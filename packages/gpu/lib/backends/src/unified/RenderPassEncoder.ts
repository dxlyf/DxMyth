import type { WebGLContext } from '../backends/webgl/WebGLContext';
import type { WebGLFramebuffer as WebGLFramebufferResource } from '../backends/webgl/resources/WebGLFramebuffer';
import type { WebGLTexture } from '../backends/webgl/resources/WebGLTexture';
import type { WebGLVertexArray } from '../backends/webgl/resources/WebGLVertexArray';
import type { WebGPURenderPass } from '../backends/webgpu/command/WebGPURenderPass';
import { BackendKind, type IndexFormat } from '../core/enums';
import type { Viewport } from '../core/descriptors';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { BindGroup } from './BindGroup';
import type { Buffer } from './Buffer';
import type { Device } from './Device';
import type { RenderPipeline } from './RenderPipeline';
import type { Sampler } from './Sampler';
import type { RenderPassDescriptor } from './types';

interface BoundVertexBuffer {
  buffer: Buffer;
  offset: number;
  size?: number;
}

/**
 * 统一的渲染通道。
 *
 * WebGPU 后端包装原生 render pass；WebGL 后端在创建时绑定 FBO、清屏，
 * 后续 `set*` / `draw` 立即执行。
 */
export class RenderPassEncoder {
  readonly label: string | undefined;
  readonly #device: Device;
  readonly #gpuPass: WebGPURenderPass | null;
  readonly #gl: WebGLContext | null;
  #framebuffer: WebGLFramebufferResource | null = null;
  #previousFramebuffer: WebGLFramebuffer | null = null;
  readonly #vaos: WebGLVertexArray[] = [];
  readonly #vaoCache = new Map<string, WebGLVertexArray>();
  #pipeline: RenderPipeline | null = null;
  readonly #bindGroups = new Map<number, BindGroup>();
  readonly #vertexBuffers = new Map<number, BoundVertexBuffer>();
  #indexBuffer: { buffer: Buffer; format: IndexFormat; offset: number } | null = null;
  #ended = false;

  /** @internal 由 CommandEncoder 创建。 */
  constructor(device: Device, desc: RenderPassDescriptor, gpuPass: WebGPURenderPass | null) {
    this.#device = device;
    this.label = desc.label;
    this.#gpuPass = gpuPass;
    this.#gl = gpuPass === null ? device.glContext : null;

    if (gpuPass !== null) {
      return;
    }
    const context = this.#gl;
    if (context === null) {
      throw new ValidationError('渲染通道后端不可用');
    }
    this.#previousFramebuffer = context.state.getBoundFramebuffer();
    const attachments = desc.colorAttachments;
    if (attachments.length === 0) {
      throw new ValidationError('渲染通道至少需要一个颜色附件');
    }
    if (attachments.some((attachment) => attachment.view.isCanvas) && attachments.length > 1) {
      throw new UnsupportedError('画布与离屏附件混合（WebGL）', device.backend);
    }
    if (attachments[0]!.view.isCanvas) {
      if (desc.depthStencilAttachment !== undefined) {
        throw new UnsupportedError('画布深度附件（WebGL 默认帧缓冲自带深度）', device.backend);
      }
      context.bindFramebuffer(null);
    } else {
      const colors = attachments.map((attachment) => {
        const texture = attachment.view.glTexture;
        if (texture === null) {
          throw new ValidationError('颜色附件需要 WebGL 纹理');
        }
        return texture;
      });
      const depthTexture = desc.depthStencilAttachment?.view.glTexture ?? undefined;
      this.#framebuffer = context.createFramebuffer({ colors, depth: depthTexture });
      context.bindFramebuffer(this.#framebuffer);
    }

    const width = attachments[0]!.view.width;
    const height = attachments[0]!.view.height;
    context.setViewport({ x: 0, y: 0, width, height });
    context.setScissor(null);

    const color = attachments[0]!;
    if (color.loadOp !== 'load') {
      context.clear({
        color: color.clearValue ?? { r: 0, g: 0, b: 0, a: 1 },
      });
    }
    const depth = desc.depthStencilAttachment;
    if (depth !== undefined && depth.depthLoadOp !== 'load') {
      context.clear({ depth: depth.depthClearValue ?? 1 });
    }
  }

  /** 设置渲染管线。 */
  setPipeline(pipeline: RenderPipeline): void {
    this.#assertOpen();
    this.#pipeline = pipeline;
    this.#gpuPass?.setPipeline(pipeline.gpuPipeline!);
  }

  /** 设置绑定组。 */
  setBindGroup(index: number, group: BindGroup): void {
    this.#assertOpen();
    this.#bindGroups.set(index, group);
    this.#gpuPass?.setBindGroup(index, group.gpuBindGroup!);
  }

  /** 设置顶点缓冲。 */
  setVertexBuffer(slot: number, buffer: Buffer, offset = 0, size?: number): void {
    this.#assertOpen();
    this.#vertexBuffers.set(slot, { buffer, offset, size });
    this.#gpuPass?.setVertexBuffer(slot, buffer.gpuBuffer!, offset, size);
  }

  /** 设置索引缓冲。 */
  setIndexBuffer(buffer: Buffer, format: IndexFormat, offset = 0, size?: number): void {
    this.#assertOpen();
    this.#indexBuffer = { buffer, format, offset };
    this.#gpuPass?.setIndexBuffer(buffer.gpuBuffer!, format, offset, size);
  }

  /** 数组绘制。 */
  draw(vertexCount: number, instanceCount = 1, firstVertex = 0, firstInstance = 0): void {
    this.#assertOpen();
    if (this.#gpuPass !== null) {
      this.#gpuPass.draw(vertexCount, instanceCount, firstVertex, firstInstance);
      return;
    }
    this.#prepareGlDraw();
    const context = this.#gl!;
    context.drawArrays({
      mode: this.#pipeline!.topology,
      count: vertexCount,
      first: firstVertex,
      instances: instanceCount > 1 ? instanceCount : undefined,
    });
  }

  /** 索引绘制。 */
  drawIndexed(
    indexCount: number,
    instanceCount = 1,
    firstIndex = 0,
    baseVertex = 0,
    firstInstance = 0,
  ): void {
    this.#assertOpen();
    if (this.#gpuPass !== null) {
      this.#gpuPass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
      return;
    }
    if (baseVertex !== 0) {
      throw new UnsupportedError('drawIndexed 的 baseVertex（WebGL）', this.#device.backend);
    }
    const index = this.#indexBuffer;
    if (index === null) {
      throw new ValidationError('drawIndexed 前需要调用 setIndexBuffer');
    }
    this.#prepareGlDraw();
    const context = this.#gl!;
    const gl = context.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index.buffer.glBuffer!.handle);
    const size = index.format === 'uint32' ? 4 : 2;
    context.drawElements({
      mode: this.#pipeline!.topology,
      count: indexCount,
      type: index.format,
      offset: index.offset + firstIndex * size,
      instances: instanceCount > 1 ? instanceCount : undefined,
    });
  }

  /** 设置视口。 */
  setViewport(viewport: Viewport): void {
    this.#assertOpen();
    if (this.#gpuPass !== null) {
      this.#gpuPass.setViewport(
        viewport.x,
        viewport.y,
        viewport.width,
        viewport.height,
        viewport.minDepth ?? 0,
        viewport.maxDepth ?? 1,
      );
      return;
    }
    this.#gl!.setViewport(viewport);
  }

  /** 设置裁剪矩形。 */
  setScissorRect(x: number, y: number, width: number, height: number): void {
    this.#assertOpen();
    if (this.#gpuPass !== null) {
      this.#gpuPass.setScissorRect(x, y, width, height);
      return;
    }
    this.#gl!.setScissor({ x, y, width, height });
  }

  /** 结束通道。 */
  end(): void {
    if (this.#ended) {
      return;
    }
    this.#ended = true;
    if (this.#gpuPass !== null) {
      this.#gpuPass.end();
      return;
    }
    if (this.#gl !== null) {
      this.#gl.state.bindFramebuffer(this.#gl.gl.FRAMEBUFFER, this.#previousFramebuffer);
    }
    for (const vao of this.#vaos) {
      vao.destroy();
    }
    this.#vaos.length = 0;
    this.#vaoCache.clear();
    this.#framebuffer?.destroy();
  }

  #prepareGlDraw(): void {
    const context = this.#gl!;
    const pipeline = this.#pipeline;
    if (pipeline === null || pipeline.glProgram === null) {
      throw new ValidationError('绘制前需要调用 setPipeline');
    }
    pipeline.applyGlState();
    this.#applyBindGroups(pipeline);
    const attributes = pipeline.glAttributes(this.#vertexBuffers);
    if (attributes.length > 0) {
      const key = this.#vertexBufferKey(pipeline);
      let vao = this.#vaoCache.get(key);
      if (vao === undefined) {
        vao = context.createVertexArray({ label: this.label, attributes });
        this.#vaos.push(vao);
        this.#vaoCache.set(key, vao);
      }
      vao.bind();
    } else {
      context.bindVertexArray(null);
    }
  }

  #vertexBufferKey(pipeline: RenderPipeline): string {
    const buffers = [...this.#vertexBuffers.entries()]
      .map(([slot, bound]) => `${slot}:${bound.buffer.id}:${bound.offset}`)
      .join('|');
    return `${pipeline.label ?? ''}:${pipeline.attributeLayouts.length}:${buffers}`;
  }

  #applyBindGroups(pipeline: RenderPipeline): void {
    const context = this.#gl!;
    const program = pipeline.glProgram!;
    const gl = context.gl;
    for (const [groupIndex, group] of this.#bindGroups) {
      const samplerEntries = group.layout.entries.filter((entry) => entry.sampler !== undefined);
      let textureIndex = 0;
      for (const entry of group.layout.entries) {
        const bound = group.entry(entry.binding).resource;
        if (entry.buffer !== undefined) {
          if (!('buffer' in bound)) {
            continue;
          }
          const gl2 = gl as WebGL2RenderingContext;
          if (typeof gl2.bindBufferBase !== 'function') {
            throw new UnsupportedError('uniform 缓冲绑定（WebGL1）', 'webgl');
          }
          const point = groupIndex * 16 + entry.binding;
          const block = entry.buffer.glslBlock ?? `Block${entry.binding}`;
          program.bindUniformBlock(block, point);
          const buffer = bound.buffer.glBuffer;
          if (buffer === null) {
            throw new ValidationError('uniform 缓冲不是 WebGL 缓冲区');
          }
          if (bound.offset !== undefined || bound.size !== undefined) {
            gl2.bindBufferRange(
              gl2.UNIFORM_BUFFER,
              point,
              buffer.handle,
              bound.offset ?? 0,
              bound.size ?? bound.buffer.size - (bound.offset ?? 0),
            );
          } else {
            gl2.bindBufferBase(gl2.UNIFORM_BUFFER, point, buffer.handle);
          }
          continue;
        }
        if (entry.texture !== undefined) {
          if (!('view' in bound)) {
            continue;
          }
          const view = bound.view;
          const texture = view.glTexture;
          if (texture === null) {
            throw new ValidationError('绑定组纹理不是 WebGL 纹理');
          }
          const unit = entry.binding;
          texture.bind(unit);
          const uniformName = entry.texture.glslSampler ?? `uTexture${entry.binding}`;
          program.requireUniform(uniformName).set(unit);
          const samplerEntry = samplerEntries[textureIndex];
          textureIndex += 1;
          if (samplerEntry !== undefined) {
            const samplerResource = group.entry(samplerEntry.binding).resource;
            if ('sampler' in samplerResource) {
              this.#applySampler(texture, samplerResource.sampler, unit);
            }
          }
          continue;
        }
      }
    }
  }

  #applySampler(texture: WebGLTexture, sampler: Sampler, unit: number): void {
    const context = this.#gl!;
    if (this.#device.backend === BackendKind.WebGL2 && sampler.gl2Sampler !== null) {
      sampler.bind(unit);
      return;
    }
    texture.bind(unit);
    sampler.applyToTexture(context.gl, context.gl.TEXTURE_2D);
  }

  #assertOpen(): void {
    if (this.#ended) {
      throw new ValidationError('渲染通道已经结束');
    }
  }
}
