import type { AttributeType, VertexAttributeDesc } from '../core/descriptors';
import { BackendKind } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { WebGLContext } from '../backends/webgl/WebGLContext';
import type { WebGLProgram } from '../backends/webgl/resources/WebGLProgram';
import type { WebGPUComputePipeline } from '../backends/webgpu/resources/WebGPUComputePipeline';
import type { WebGPURenderPipeline } from '../backends/webgpu/resources/WebGPURenderPipeline';
import type { Buffer } from './Buffer';
import type { Device } from './Device';
import type {
  ColorTargetState,
  ComputePipelineDescriptor,
  RenderPipelineDescriptor,
  VertexAttribute,
  VertexBufferLayout,
  VertexFormat,
} from './types';

function attributeFormat(format: VertexFormat): { size: number; type: AttributeType } {
  const match = /^(float32|uint32|sint32)(?:x([234]))?$/.exec(format);
  if (match === null) {
    throw new ValidationError(`不支持的顶点格式：${format}`);
  }
  return {
    size: match[2] === undefined ? 1 : Number(match[2]),
    type: match[1] === 'float32' ? 'float' : match[1] === 'uint32' ? 'uint32' : 'int32',
  };
}

function blendState(target: ColorTargetState | undefined): GPUBlendState | undefined {
  if (target?.blend === undefined) {
    return undefined;
  }
  const color = target.blend.color ?? {};
  const alpha = target.blend.alpha ?? color;
  return {
    color: {
      srcFactor: color.srcFactor ?? 'one',
      dstFactor: color.dstFactor ?? 'zero',
      operation: color.operation ?? 'add',
    },
    alpha: {
      srcFactor: alpha.srcFactor ?? 'one',
      dstFactor: alpha.dstFactor ?? 'zero',
      operation: alpha.operation ?? 'add',
    },
  };
}

/** 统一的 WebGPU 风格渲染管线。 */
export class RenderPipeline {
  readonly label: string | undefined;
  readonly vertexLayouts: readonly VertexBufferLayout[];
  readonly topology: NonNullable<RenderPipelineDescriptor['primitive']>['topology'];
  readonly #device: Device;
  readonly #program: WebGLProgram | null;
  readonly #gpu: WebGPURenderPipeline | null;
  readonly #desc: RenderPipelineDescriptor;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: RenderPipelineDescriptor) {
    this.#device = device;
    this.#desc = desc;
    this.label = desc.label;
    this.vertexLayouts = desc.vertex.buffers ?? [];
    this.topology = desc.primitive?.topology ?? 'triangle-list';

    if (device.backend === BackendKind.WebGPU) {
      const vertexModule = desc.vertex.module.gpuModule;
      if (vertexModule === null) {
        throw new ValidationError('WebGPU 渲染管线需要 WGSL 顶点着色器模块');
      }
      const fragmentModule = desc.fragment?.module.gpuModule ?? null;
      if (desc.fragment !== undefined && fragmentModule === null) {
        throw new ValidationError('WebGPU 渲染管线需要 WGSL 片元着色器模块');
      }
      if (desc.layout.gpuLayout === null) {
        throw new ValidationError('WebGPU 管线布局不可用');
      }
      const descriptor: GPURenderPipelineDescriptor = {
        label: desc.label,
        layout: desc.layout.gpuLayout.handle,
        vertex: {
          module: vertexModule.handle,
          entryPoint: desc.vertex.entryPoint,
          buffers: this.vertexLayouts.map((layout) => ({
            arrayStride: layout.arrayStride,
            stepMode: layout.stepMode ?? 'vertex',
            attributes: layout.attributes.map((attribute) => ({
              shaderLocation: attribute.shaderLocation,
              offset: attribute.offset,
              format: attribute.format,
            })),
          })),
        },
        primitive: {
          topology: this.topology as GPUPrimitiveTopology,
          stripIndexFormat: desc.primitive?.stripIndexFormat,
          frontFace: desc.primitive?.frontFace,
          cullMode: desc.primitive?.cullMode,
        },
        multisample: desc.multisample,
      };
      if (desc.fragment !== undefined && fragmentModule !== null) {
        descriptor.fragment = {
          module: fragmentModule.handle,
          entryPoint: desc.fragment.entryPoint,
          targets: desc.fragment.targets.map((target) => ({
            format: target.format as GPUTextureFormat,
            blend: blendState(target),
            writeMask: target.writeMask,
          })),
        };
      }
      if (desc.depthStencil !== undefined) {
        descriptor.depthStencil = {
          format: desc.depthStencil.format as GPUTextureFormat,
          depthWriteEnabled: desc.depthStencil.depthWriteEnabled ?? true,
          depthCompare: desc.depthStencil.depthCompare ?? 'less',
          depthBias: desc.depthStencil.depthBias,
          depthBiasSlopeScale: desc.depthStencil.depthBiasSlopeScale,
          depthBiasClamp: desc.depthStencil.depthBiasClamp,
          stencilFront: desc.depthStencil.stencilFront,
          stencilBack: desc.depthStencil.stencilBack,
          stencilReadMask: desc.depthStencil.stencilReadMask,
          stencilWriteMask: desc.depthStencil.stencilWriteMask,
        };
      }
      this.#gpu = device.gpuContext.createRenderPipeline(descriptor);
      this.#program = null;
      return;
    }

    const context = device.glContext;
    if (desc.fragment === undefined) {
      throw new ValidationError('WebGL 渲染管线需要片元着色器');
    }
    const vertexSources = desc.vertex.module.glslFor(device.backend);
    const fragmentSources = desc.fragment.module.glslFor(device.backend);
    const attributeLocations: Record<string, number> = {};
    for (const layout of this.vertexLayouts) {
      for (const attribute of layout.attributes) {
        attributeLocations[attribute.name ?? `a${attribute.shaderLocation}`] =
          attribute.shaderLocation;
      }
    }
    this.#program = context.createProgram({
      label: desc.label,
      vertex: vertexSources.vertex,
      fragment: fragmentSources.fragment,
      attributeLocations,
    });
    this.#gpu = null;
  }

  /** WebGL 程序。 */
  get glProgram(): WebGLProgram | null {
    return this.#program;
  }

  /** WebGPU 原生管线。 */
  get gpuPipeline(): WebGPURenderPipeline | null {
    return this.#gpu;
  }

  /** @internal WebGL 管线状态。 */
  applyGlState(): void {
    if (this.#program === null) {
      return;
    }
    const context = this.#device.glContext as WebGLContext;
    this.#program.use();
    context.setDepthStencilState(this.#desc.depthStencil ?? { depthWriteEnabled: true });
    context.setRasterizerState({
      cullMode: this.#desc.primitive?.cullMode ?? 'none',
      frontFace: this.#desc.primitive?.frontFace ?? 'ccw',
    });
    context.setBlendState(this.#desc.fragment?.targets[0]?.blend ?? null);
    const mask = this.#desc.fragment?.targets[0]?.writeMask ?? 0b1111;
    context.setColorMask({
      r: (mask & 1) !== 0,
      g: (mask & 2) !== 0,
      b: (mask & 4) !== 0,
      a: (mask & 8) !== 0,
    });
  }

  /** @internal 生成 WebGL 属性描述。 */
  glAttributes(
    buffers: ReadonlyMap<number, { buffer: Buffer; offset: number }>,
  ): VertexAttributeDesc[] {
    const attributes: VertexAttributeDesc[] = [];
    this.vertexLayouts.forEach((layout, slot) => {
      const bound = buffers.get(slot);
      if (bound === undefined) {
        return;
      }
      const buffer = bound.buffer.glBuffer;
      if (buffer === null) {
        throw new ValidationError('顶点缓冲不是 WebGL 缓冲区');
      }
      for (const attribute of layout.attributes) {
        const format = attributeFormat(attribute.format);
        attributes.push({
          buffer,
          location: attribute.shaderLocation,
          size: format.size,
          type: format.type,
          offset: bound.offset + attribute.offset,
          stride: layout.arrayStride,
          divisor: layout.stepMode === 'instance' ? 1 : 0,
        });
      }
    });
    return attributes;
  }

  /** @internal 取得顶点属性列表。 */
  get attributeLayouts(): readonly VertexAttribute[] {
    return this.vertexLayouts.flatMap((layout) => layout.attributes);
  }

  /** 销毁管线；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#program?.destroy();
    this.#gpu?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }
}

/** 计算管线；WebGL 不支持。 */
export class ComputePipeline {
  readonly label: string | undefined;
  readonly #device: Device;
  readonly #gpu: WebGPUComputePipeline | null;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: ComputePipelineDescriptor) {
    this.#device = device;
    this.label = desc.label;
    if (device.backend !== BackendKind.WebGPU) {
      throw new UnsupportedError('计算管线（WebGL）', device.backend);
    }
    const module = desc.compute.module.gpuModule;
    if (module === null || desc.layout.gpuLayout === null) {
      throw new ValidationError('WebGPU 计算管线缺少模块或布局');
    }
    this.#gpu = device.gpuContext.createComputePipeline({
      label: desc.label,
      layout: desc.layout.gpuLayout.handle,
      compute: { module: module.handle, entryPoint: desc.compute.entryPoint },
    });
  }

  /** WebGPU 原生计算管线。 */
  get gpuPipeline() {
    return this.#gpu;
  }

  /** 销毁管线；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpu?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }
}
