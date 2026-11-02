import { createBackend, type CreateBackendOptions } from '../backends/index';
import type { WebGL2Context } from '../backends/webgl2/WebGL2Context';
import type { WebGLContext } from '../backends/webgl/WebGLContext';
import type { WebGPUContext } from '../backends/webgpu/WebGPUContext';
import type { Capabilities } from '../core/Capabilities';
import type { Context } from '../core/Context';
import { BackendKind, type TextureFormat } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import { BindGroup } from './BindGroup';
import { BindGroupLayout } from './BindGroupLayout';
import { Buffer } from './Buffer';
import { CommandEncoder } from './CommandEncoder';
import { ComputePipeline, RenderPipeline } from './RenderPipeline';
import { PipelineLayout } from './PipelineLayout';
import { Queue } from './Queue';
import { Sampler } from './Sampler';
import { ShaderModule } from './ShaderModule';
import { Texture } from './Texture';
import { TextureView } from './TextureView';
import type {
  BindGroupDescriptor,
  BindGroupLayoutDescriptor,
  BufferDescriptor,
  CommandEncoderDescriptor,
  ComputePipelineDescriptor,
  PipelineLayoutDescriptor,
  RenderPipelineDescriptor,
  ShaderModuleDescriptor,
  TextureDescriptor,
  UnifiedSamplerDescriptor,
} from './types';

/** 创建设备时的选项。 */
export type DeviceOptions = CreateBackendOptions;

/**
 * 统一的 WebGPU 风格设备。
 *
 * 同一套 `Buffer / Texture / BindGroup / RenderPipeline / CommandEncoder`
 * API 可在 WebGPU、WebGL2、WebGL1 上运行；WebGL1 不支持 UBO / 计算 / 存储缓冲。
 */
export class Device {
  /** 按优先级创建并初始化设备。 */
  static async create(options: DeviceOptions): Promise<Device> {
    return new Device(await createBackend(options));
  }

  /** 用已有上下文构建设备。 */
  static fromContext(context: Context): Device {
    return new Device(context);
  }

  readonly context: Context;
  readonly backend: BackendKind;
  readonly queue: Queue;
  #canvasView: TextureView | null = null;
  #disposed = false;

  private constructor(context: Context) {
    this.context = context;
    this.backend = context.backend;
    this.queue = new Queue(this);
  }

  /** WebGPU 底层上下文。 */
  get gpuContext(): WebGPUContext {
    if (this.backend !== BackendKind.WebGPU) {
      throw new ValidationError('当前设备不是 WebGPU 后端');
    }
    return this.context as WebGPUContext;
  }

  /** WebGL 底层上下文。 */
  get glContext(): WebGLContext {
    if (this.backend === BackendKind.WebGPU) {
      throw new ValidationError('当前设备不是 WebGL 后端');
    }
    return this.context as WebGLContext;
  }

  /** 归一化能力。 */
  get capabilities(): Capabilities {
    return this.context.capabilities;
  }

  /** 画布颜色格式。 */
  get format(): TextureFormat {
    return this.backend === BackendKind.WebGPU
      ? (this.gpuContext.format as TextureFormat)
      : 'rgba8unorm';
  }

  /** 画布宽度。 */
  get width(): number {
    return this.context.width;
  }

  /** 画布高度。 */
  get height(): number {
    return this.context.height;
  }

  /** 创建缓冲区。 */
  createBuffer(desc: BufferDescriptor): Buffer {
    return new Buffer(this, desc);
  }

  /** 创建纹理。 */
  createTexture(desc: TextureDescriptor): Texture {
    return new Texture(this, desc);
  }

  /** 创建采样器。 */
  createSampler(desc: UnifiedSamplerDescriptor = {}): Sampler {
    if (this.backend === BackendKind.WebGPU) {
      return new Sampler(this, desc, this.gpuContext.createSampler(desc), null, null);
    }
    if (this.backend === BackendKind.WebGL2) {
      return new Sampler(
        this,
        desc,
        null,
        (this.glContext as WebGL2Context).createSamplerObject(desc),
        null,
      );
    }
    return new Sampler(this, desc, null, null, this.glContext.createSampler(desc));
  }

  /** 创建着色器模块。 */
  createShaderModule(desc: ShaderModuleDescriptor): ShaderModule {
    if (this.backend !== BackendKind.WebGPU) {
      return new ShaderModule(this, desc, null);
    }
    if (desc.code.wgsl === undefined) {
      throw new ValidationError('WebGPU 着色器模块需要 code.wgsl');
    }
    return new ShaderModule(
      this,
      desc,
      this.gpuContext.createShaderModule({ label: desc.label, code: desc.code.wgsl }),
    );
  }

  /** 创建绑定组布局。 */
  createBindGroupLayout(desc: BindGroupLayoutDescriptor): BindGroupLayout {
    return new BindGroupLayout(this, desc);
  }

  /** 创建管线布局。 */
  createPipelineLayout(desc: PipelineLayoutDescriptor): PipelineLayout {
    return new PipelineLayout(this, desc);
  }

  /** 创建渲染管线。 */
  createRenderPipeline(desc: RenderPipelineDescriptor): RenderPipeline {
    return new RenderPipeline(this, desc);
  }

  /** 创建计算管线。 */
  createComputePipeline(desc: ComputePipelineDescriptor): ComputePipeline {
    if (this.backend !== BackendKind.WebGPU) {
      throw new UnsupportedError('计算管线（WebGL）', this.backend);
    }
    return new ComputePipeline(this, desc);
  }

  /** 创建绑定组。 */
  createBindGroup(desc: BindGroupDescriptor): BindGroup {
    return new BindGroup(this, desc);
  }

  /** 创建命令编码器。 */
  createCommandEncoder(desc: CommandEncoderDescriptor = {}): CommandEncoder {
    return new CommandEncoder(this, desc);
  }

  /** 当前画布纹理视图；WebGL 后端为默认帧缓冲的占位视图。 */
  currentTextureView(): TextureView {
    if (this.backend === BackendKind.WebGPU) {
      return new TextureView(
        this,
        null,
        null,
        { format: this.format },
        this.gpuContext.currentTextureView(),
      );
    }
    if (this.#canvasView === null) {
      this.#canvasView = new TextureView(this, null, null, { format: this.format });
    }
    return this.#canvasView;
  }

  /** 调整画布尺寸。 */
  resize(width: number, height: number): void {
    this.context.resize(width, height);
    this.#canvasView = null;
  }

  /** 销毁设备及其资源；幂等。 */
  dispose(): void {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    this.context.dispose();
  }
}
