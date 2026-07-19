/**
 * WebGPUHelper - 简化 WebGPU 渲染的辅助类
 *
 * 特性：
 *   - 异步初始化（adapter / device / context / queue），含 device.lost 处理
 *   - 资源管理：shader / buffer / texture / sampler / bindGroupLayout / bindGroup / pipeline 统一追踪与销毁
 *   - 渲染管线缓存（按 key 复用）
 *   - 支持 depth/stencil 附件的渲染通道
 *   - 自动维护深度纹理（resize 时同步重建）
 *   - Compute 管线与 compute pass 支持
 *   - Buffer 回读（readBuffer / mapAsync 封装）
 *   - GPU uncapturederror 监听
 *   - DPR 感知的尺寸调整
 */
export interface WebGPUHelperOptions {
    /** 设备描述 */
    deviceDescriptor?: GPUDeviceDescriptor;
    /** 画布上下文配置（默认 alphaMode: 'premultiplied'） */
    contextConfiguration?: Partial<GPUCanvasConfiguration>;
    /** 是否监听 uncapturederror（debug 用） */
    debug?: boolean;
}
export interface RenderPassOptions {
    clearValue?: GPUColor;
    /** loadOp，默认 'clear' */
    loadOp?: GPULoadOp;
    storeOp?: GPUStoreOp;
    /** 是否启用深度附件（需先 ensureDepthTexture） */
    depthClearValue?: number;
    stencilClearValue?: number;
    depthLoadOp?: GPULoadOp;
    /** 模板 loadOp（仅深度格式含 stencil 通道时生效） */
    stencilLoadOp?: GPULoadOp;
    /** 自定义颜色附件 view（不传则用 context 当前纹理） */
    colorView?: GPUTextureView;
    /** 自定义深度附件 view */
    depthView?: GPUTextureView;
}
export interface DepthTextureOptions {
    format?: GPUTextureFormat;
    usage?: GPUTextureUsageFlags;
}
export declare class WebGPUHelper {
    readonly canvas: HTMLCanvasElement;
    device: GPUDevice | null;
    context: GPUCanvasContext | null;
    queue: GPUQueue | null;
    debug: boolean;
    format: GPUTextureFormat;
    /** 当前维护的深度纹理（resize 时自动重建） */
    private _depthTexture;
    private _depthFormat;
    private pipelineCache;
    private computePipelineCache;
    private commandEncoder;
    private renderPassEncoder;
    private computePassEncoder;
    /** 资源追踪 */
    private resources;
    private deviceDescriptor?;
    private contextConfiguration?;
    private _lost;
    constructor(canvas: HTMLCanvasElement | string, options?: WebGPUHelperOptions | GPUDeviceDescriptor);
    /** 是否支持 WebGPU */
    static isSupported(): boolean;
    /** 设备是否已丢失 */
    get isLost(): boolean;
    /**
     * 异步初始化适配器、设备、上下文和队列。
     * 选择高性能 adapter，绑定 device.lost 与 uncapturederror。
     */
    init(contextConfiguration?: Partial<GPUCanvasConfiguration>): Promise<void>;
    /** 校验设备已就绪，未就绪抛错 */
    private ensureDevice;
    /** 创建着色器模块 */
    createShaderModule(code: string, label?: string): GPUShaderModule;
    /**
     * 创建并填充缓冲区。
     * 使用 mappedAtCreation 写入初始数据，不依赖 COPY_DST 权限。
     */
    createBuffer(data: BufferSource, usage: GPUBufferUsageFlags, label?: string): GPUBuffer;
    /** 创建空缓冲区（按 size 字节），用于动态更新的 buffer */
    createEmptyBuffer(size: number, usage: GPUBufferUsageFlags, label?: string): GPUBuffer;
    /** 创建 Uniform 缓冲区（COPY_DST | UNIFORM） */
    createUniformBuffer(data: BufferSource | number, label?: string): GPUBuffer;
    /** 直接通过 queue 写入 buffer */
    writeBuffer(buffer: GPUBuffer, data: BufferSource, offset?: number): void;
    /**
     * 异步回读 buffer 数据。
     * 内部创建临时 COPY_DST buffer 复制后 mapAsync 读取。
     */
    readBuffer(srcBuffer: GPUBuffer, size?: number, offset?: number): Promise<ArrayBuffer>;
    private byteLengthOf;
    /** 创建 2D 纹理 */
    createTexture(width: number, height: number, format?: GPUTextureFormat, usage?: GPUTextureUsageFlags, label?: string, options?: {
        mipLevelCount?: number;
        sampleCount?: number;
    }): GPUTexture;
    /** 通过 queue 写入纹理数据 */
    writeTexture(texture: GPUTexture, data: BufferSource, dataLayout: GPUImageDataLayout, size: GPUExtent3D, destination?: GPUImageCopyTexture): void;
    /**
     * 从 ImageBitmap / HTMLImageElement 等上传到纹理。
     * 要求纹理 usage 含 COPY_DST | RENDER_ATTACHMENT。
     */
    copyExternalImageToTexture(source: GPUCopyExternalImageSourceInfo, destination: GPUCopyExternalImageDestInfo, size: GPUExtent3D): void;
    /** 创建/重建深度纹理（resize 时自动调用） */
    ensureDepthTexture(width: number, height: number, options?: DepthTextureOptions): GPUTexture;
    /** 获取当前深度纹理（若存在） */
    getDepthTexture(): GPUTexture | null;
    /** 深度格式 */
    get depthFormat(): GPUTextureFormat;
    /** 创建 Sampler */
    createSampler(descriptor?: GPUSamplerDescriptor, label?: string): GPUSampler;
    /** 创建 BindGroupLayout */
    createBindGroupLayout(entries: GPUBindGroupLayoutEntry[], label?: string): GPUBindGroupLayout;
    /** 创建 PipelineLayout */
    createPipelineLayout(bindGroupLayouts: GPUBindGroupLayout[], label?: string): GPUPipelineLayout;
    /** 创建 BindGroup */
    createBindGroup(layout: GPUBindGroupLayout, entries: GPUBindGroupEntry[], label?: string): GPUBindGroup;
    /**
     * 创建渲染管线（完整版）。
     * 接受完整 GPURenderPipelineDescriptor，或简化参数。
     */
    createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
    createRenderPipeline(vertexShaderModule: GPUShaderModule, fragmentShaderModule: GPUShaderModule, options?: {
        vertexEntryPoint?: string;
        fragmentEntryPoint?: string;
        buffers?: GPUVertexBufferLayout[];
        primitive?: GPUPrimitiveState;
        depthStencil?: GPUDepthStencilState;
        multisample?: GPUMultisampleState;
        targets?: GPUColorTargetState[];
        layout?: GPUPipelineLayout | 'auto';
        label?: string;
        cacheKey?: string;
    }): GPURenderPipeline;
    /** 创建 Compute 管线 */
    createComputePipeline(shaderModule: GPUShaderModule, entryPoint?: string, layout?: GPUPipelineLayout | 'auto', label?: string, cacheKey?: string): GPUComputePipeline;
    /** 开始命令编码器 */
    beginCommandEncoder(label?: string): GPUCommandEncoder;
    /** 获取当前命令编码器 */
    getCommandEncoder(): GPUCommandEncoder;
    /**
     * 开始渲染通道。
     * 若 options.depthClearValue !== undefined 且未传 depthView，
     * 会自动使用 ensureDepthTexture 创建的深度纹理。
     */
    beginRenderPass(options?: RenderPassOptions): GPURenderPassEncoder;
    /** 结束渲染通道 */
    endRenderPass(): void;
    /** 开始 Compute 通道 */
    beginComputePass(label?: string): GPUComputePassEncoder;
    /** 结束 Compute 通道 */
    endComputePass(): void;
    /** 结束命令编码并提交到队列 */
    submit(): void;
    /**
     * 一键绘制：编码、渲染、提交（适用于简单单次绘制）。
     * 支持多个顶点缓冲区、实例化绘制。
     */
    drawFrame(pipeline: GPURenderPipeline, bindGroups: GPUBindGroup[], vertexBuffers: GPUBuffer[] | GPUBuffer, vertexCount: number, options?: {
        indexBuffer?: GPUBuffer;
        indexFormat?: GPUIndexFormat;
        indexCount?: number;
        instanceCount?: number;
        firstVertex?: number;
        firstInstance?: number;
        clearColor?: GPUColor;
        useDepth?: boolean;
    }): void;
    /** 调整画布尺寸（支持 DPR），并重建深度纹理（若存在） */
    setSize(width: number, height: number, dpr?: number): void;
    /** 单个资源销毁 */
    destroyBuffer(buffer: GPUBuffer): void;
    destroyTexture(texture: GPUTexture): void;
    /** 销毁所有资源并释放设备 */
    destroy(): void;
}
