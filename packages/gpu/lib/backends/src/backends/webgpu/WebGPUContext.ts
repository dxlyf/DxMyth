import { Context, type ContextOptions } from '../../core/Context';
import type { Capabilities } from '../../core/Capabilities';
import type { BufferDesc, SamplerDesc, TextureDesc } from '../../core/descriptors';
import { BackendKind } from '../../core/enums';
import { BackendError, UnsupportedError, ValidationError } from '../../core/errors';
import { ResourceScope } from '../../core/ResourceScope';
import { WebGPUCommandEncoder } from './command/WebGPUCommandEncoder';
import { WebGPUBindGroup } from './resources/WebGPUBindGroup';
import { WebGPUBindGroupLayout } from './resources/WebGPUBindGroupLayout';
import { WebGPUBuffer } from './resources/WebGPUBuffer';
import { WebGPUComputePipeline } from './resources/WebGPUComputePipeline';
import { WebGPUPipelineLayout } from './resources/WebGPUPipelineLayout';
import { WebGPUQuerySet, type QuerySetDesc } from './resources/WebGPUQuerySet';
import { WebGPURenderPipeline } from './resources/WebGPURenderPipeline';
import { WebGPUSampler } from './resources/WebGPUSampler';
import { WebGPUShaderModule, type ShaderModuleDesc } from './resources/WebGPUShaderModule';
import { WebGPUTexture } from './resources/WebGPUTexture';
import { createWebGPUCapabilities } from './WebGPUCapabilities';
import { WebGPUInfo } from './WebGPUInfo';
import {
  gpuBufferUsage,
  gpuSamplerDescriptor,
  gpuTextureFormat,
  gpuTextureUsage,
} from './util/gpuEnums';

/** WebGPU 上下文专用选项。 */
export interface WebGPUContextOptions extends ContextOptions {
  /** 画布格式，默认取 `navigator.gpu.getPreferredCanvasFormat()`。 */
  format?: GPUTextureFormat;
  alphaMode?: GPUCanvasAlphaMode;
}

function preferredCanvasFormat(): GPUTextureFormat {
  const gpu = (globalThis as { navigator?: { gpu?: GPU } }).navigator?.gpu;
  return gpu?.getPreferredCanvasFormat() ?? 'bgra8unorm';
}

function resolveCanvasContext(canvas: ContextOptions['canvas']): GPUCanvasContext | null {
  const context = (canvas as HTMLCanvasElement).getContext('webgpu');
  return (context as GPUCanvasContext | null) ?? null;
}

/** WebGPU 上下文封装。 */
export class WebGPUContext extends Context {
  override readonly backend: BackendKind = BackendKind.WebGPU;

  readonly adapter: GPUAdapter | null;
  readonly device: GPUDevice;
  readonly info: WebGPUInfo;
  readonly capabilities: Capabilities;
  readonly scope = new ResourceScope();
  /** 画布格式。 */
  readonly format: GPUTextureFormat;

  readonly #canvasContext: GPUCanvasContext | null;

  constructor(
    options: WebGPUContextOptions,
    adapter: GPUAdapter | null,
    device: GPUDevice,
    providedCanvasContext?: GPUCanvasContext | null,
  ) {
    super(options);
    this.adapter = adapter;
    this.device = device;
    this.info = new WebGPUInfo(adapter);
    this.capabilities = createWebGPUCapabilities(device);
    this.format = options.format ?? preferredCanvasFormat();
    this.#canvasContext =
      providedCanvasContext !== undefined
        ? providedCanvasContext
        : resolveCanvasContext(this.canvas);

    if (this.#canvasContext !== null) {
      this.#canvasContext.configure({
        device,
        format: this.format,
        alphaMode: options.alphaMode ?? 'opaque',
      });
    }

    void device.lost.then((info) => {
      if (info.reason === 'destroyed') {
        return;
      }
      this.stateLost();
    });

    device.onuncapturederror = (event: GPUUncapturedErrorEvent): void => {
      console.error(`WebGPU 未捕获错误：${event.error.message}`);
    };
  }

  /** 画布使用的 WebGPU 上下文（若可用）。 */
  get canvasContext(): GPUCanvasContext | null {
    return this.#canvasContext;
  }

  override get width(): number {
    return this.canvas.width;
  }

  override get height(): number {
    return this.canvas.height;
  }

  /** 创建缓冲区。 */
  createBuffer(desc: BufferDesc): WebGPUBuffer {
    const size = desc.data?.byteLength ?? desc.size ?? 0;
    if (!Number.isInteger(size) || size <= 0) {
      throw new ValidationError('缓冲区大小必须是大于 0 的整数');
    }
    const native = this.device.createBuffer({
      label: desc.label,
      size,
      usage: gpuBufferUsage(desc.usage),
      mappedAtCreation: desc.mappedAtCreation,
    });
    const buffer = this.scope.track(new WebGPUBuffer(this, native, desc, size));
    if (desc.data !== undefined) {
      this.device.queue.writeBuffer(native, 0, desc.data);
    }
    return buffer;
  }

  /** 创建纹理。 */
  createTexture(desc: TextureDesc): WebGPUTexture {
    const width = desc.width;
    const height = desc.height ?? 1;
    const depthOrArrayLayers = desc.depthOrArrayLayers ?? 1;
    if (!Number.isInteger(width) || width <= 0) {
      throw new ValidationError('纹理宽度必须是大于 0 的整数');
    }
    if (!Number.isInteger(height) || height <= 0) {
      throw new ValidationError('纹理高度必须是大于 0 的整数');
    }
    if (!Number.isInteger(depthOrArrayLayers) || depthOrArrayLayers <= 0) {
      throw new ValidationError('纹理层数必须是大于 0 的整数');
    }
    const format = gpuTextureFormat(desc.format);
    const mipLevelCount = desc.mipLevelCount ?? 1;
    const sampleCount = desc.sampleCount ?? 1;
    const native = this.device.createTexture({
      label: desc.label,
      size: { width, height, depthOrArrayLayers },
      format,
      usage: gpuTextureUsage(desc.usage),
      dimension: desc.dimension ?? '2d',
      mipLevelCount,
      sampleCount,
      viewFormats: desc.viewFormats?.map((item) => gpuTextureFormat(item)),
    });
    const texture = this.scope.track(
      new WebGPUTexture(this, native, {
        width,
        height,
        depthOrArrayLayers,
        format: desc.format,
        mipLevelCount,
        sampleCount,
      }),
    );
    if (desc.data !== undefined) {
      texture.write(desc.data);
    }
    return texture;
  }

  /** 创建采样器。 */
  createSampler(desc: SamplerDesc = {}): WebGPUSampler {
    const descriptor = gpuSamplerDescriptor(desc);
    const native = this.device.createSampler(descriptor);
    return this.scope.track(new WebGPUSampler(this, native, descriptor));
  }

  /** 创建查询集。 */
  createQuerySet(desc: QuerySetDesc): WebGPUQuerySet {
    if (!Number.isInteger(desc.count) || desc.count <= 0) {
      throw new ValidationError('查询集数量必须是大于 0 的整数');
    }
    if (desc.type === 'timestamp' && !this.device.features.has('timestamp-query')) {
      throw new UnsupportedError('时间戳查询（缺少 timestamp-query 特性）', 'webgpu');
    }
    const native = this.device.createQuerySet({
      label: desc.label,
      type: desc.type,
      count: desc.count,
    });
    return this.scope.track(new WebGPUQuerySet(this, native, desc));
  }

  /** 创建着色器模块。 */
  createShaderModule(desc: ShaderModuleDesc | string): WebGPUShaderModule {
    const source = typeof desc === 'string' ? { code: desc } : desc;
    const native = this.device.createShaderModule({
      label: source.label,
      code: source.code,
    });
    return this.scope.track(new WebGPUShaderModule(this, native, source));
  }

  /** 创建绑定组布局。 */
  createBindGroupLayout(desc: GPUBindGroupLayoutDescriptor): WebGPUBindGroupLayout {
    return this.scope.track(
      new WebGPUBindGroupLayout(this, this.device.createBindGroupLayout(desc), desc.label),
    );
  }

  /** 创建绑定组。 */
  createBindGroup(desc: GPUBindGroupDescriptor): WebGPUBindGroup {
    return this.scope.track(
      new WebGPUBindGroup(this, this.device.createBindGroup(desc), desc.label),
    );
  }

  /** 创建管线布局。 */
  createPipelineLayout(desc: GPUPipelineLayoutDescriptor): WebGPUPipelineLayout {
    return this.scope.track(
      new WebGPUPipelineLayout(this, this.device.createPipelineLayout(desc), desc.label),
    );
  }

  /** 创建渲染管线。 */
  createRenderPipeline(desc: GPURenderPipelineDescriptor): WebGPURenderPipeline {
    return this.scope.track(
      new WebGPURenderPipeline(this, this.device.createRenderPipeline(desc), desc.label),
    );
  }

  /** 创建计算管线。 */
  createComputePipeline(desc: GPUComputePipelineDescriptor): WebGPUComputePipeline {
    return this.scope.track(
      new WebGPUComputePipeline(this, this.device.createComputePipeline(desc), desc.label),
    );
  }

  /** 创建命令编码器。 */
  createCommandEncoder(label?: string): WebGPUCommandEncoder {
    return this.scope.track(
      new WebGPUCommandEncoder(this, this.device.createCommandEncoder({ label }), label),
    );
  }

  /** 提交命令缓冲。 */
  submit(commandBuffer: GPUCommandBuffer): void {
    this.device.queue.submit([commandBuffer]);
  }

  /** 获取当前帧的画布纹理。 */
  getCurrentTexture(): GPUTexture {
    if (this.#canvasContext === null) {
      throw new BackendError('当前上下文没有可用的 WebGPU 画布', { code: 'ERR_WEBGPU' });
    }
    return this.#canvasContext.getCurrentTexture();
  }

  /** 获取当前帧的画布纹理视图。 */
  currentTextureView(desc?: GPUTextureViewDescriptor): GPUTextureView {
    return this.getCurrentTexture().createView(desc);
  }

  /** 调整画布尺寸。 */
  override resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) {
      throw new ValidationError('画布尺寸必须大于 0');
    }
    this.canvas.width = width;
    this.canvas.height = height;
    this.events.emit('resize', { width, height });
  }

  /** 设备丢失时标记资源失效。 */
  private stateLost(): void {
    for (const resource of this.scope.resources) {
      resource.markLost();
    }
    this.events.emit('lost');
  }

  /** 释放资源与设备。 */
  protected override disposeContext(): void {
    this.#canvasContext?.unconfigure();
    this.scope.disposeAll();
    this.device.destroy();
  }
}
