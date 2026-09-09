
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
    deviceDescriptor?: GPUDeviceDescriptor
    /** 画布上下文配置（默认 alphaMode: 'premultiplied'） */
    contextConfiguration?: Partial<GPUCanvasConfiguration>
    /** 是否监听 uncapturederror（debug 用） */
    debug?: boolean
}

export interface RenderPassOptions {
    clearValue?: GPUColor
    /** loadOp，默认 'clear' */
    loadOp?: GPULoadOp
    storeOp?: GPUStoreOp
    /** 是否启用深度附件（需先 ensureDepthTexture） */
    depthClearValue?: number
    stencilClearValue?: number
    depthLoadOp?: GPULoadOp
    /** 模板 loadOp（仅深度格式含 stencil 通道时生效） */
    stencilLoadOp?: GPULoadOp
    /** 自定义颜色附件 view（不传则用 context 当前纹理） */
    colorView?: GPUTextureView
    /** 自定义深度附件 view */
    depthView?: GPUTextureView
}

export interface DepthTextureOptions {
    format?: GPUTextureFormat
    usage?: GPUTextureUsageFlags
}

export class WebGPUHelper {
    public readonly canvas: HTMLCanvasElement
    public device: GPUDevice | null = null
    public context: GPUCanvasContext | null = null
    public queue: GPUQueue | null = null
    public debug: boolean = false

    public format: GPUTextureFormat = 'bgra8unorm'

    /** 当前维护的深度纹理（resize 时自动重建） */
    private _depthTexture: GPUTexture | null = null
    private _depthFormat: GPUTextureFormat = 'depth24plus'

    private pipelineCache: Map<string, GPURenderPipeline> = new Map()
    private computePipelineCache: Map<string, GPUComputePipeline> = new Map()
    private commandEncoder: GPUCommandEncoder | null = null
    private renderPassEncoder: GPURenderPassEncoder | null = null
    private computePassEncoder: GPUComputePassEncoder | null = null

    /** 资源追踪 */
    private resources = {
        shaders: new Set<GPUShaderModule>(),
        buffers: new Set<GPUBuffer>(),
        textures: new Set<GPUTexture>(),
        samplers: new Set<GPUSampler>(),
        bindGroupLayouts: new Set<GPUBindGroupLayout>(),
        bindGroups: new Set<GPUBindGroup>(),
        pipelines: new Set<GPURenderPipeline>(),
        computePipelines: new Set<GPUComputePipeline>(),
    }

    private deviceDescriptor?: GPUDeviceDescriptor
    private contextConfiguration?: Partial<GPUCanvasConfiguration>
    private _lost: boolean = false

    constructor(canvas: HTMLCanvasElement | string, options: WebGPUHelperOptions | GPUDeviceDescriptor = {}) {
        if (typeof canvas === 'string') {
            const el = document.getElementById(canvas)
            if (!(el instanceof HTMLCanvasElement)) {
                throw new Error(`Element with id "${canvas}" is not a canvas.`)
            }
            this.canvas = el
        } else {
            this.canvas = canvas
        }

        // 兼容直接传 GPUDeviceDescriptor 的旧 API：
        // 旧 API 直接传 { requiredFeatures, requiredLimits, ... }
        // 新 API 传 { deviceDescriptor, contextConfiguration, debug }
        let opts: WebGPUHelperOptions
        if (options && (options as WebGPUHelperOptions).contextConfiguration !== undefined) {
            // 新 API：显式传了 contextConfiguration
            opts = options as WebGPUHelperOptions
        } else if (options && (
            (options as WebGPUHelperOptions).debug !== undefined ||
            (options as WebGPUHelperOptions).deviceDescriptor !== undefined
        )) {
            // 新 API：传了 debug 或 deviceDescriptor 字段
            opts = options as WebGPUHelperOptions
        } else {
            // 旧 API：把整个 options 当作 deviceDescriptor
            opts = { deviceDescriptor: options as GPUDeviceDescriptor }
        }

        this.deviceDescriptor = opts.deviceDescriptor
        this.contextConfiguration = opts.contextConfiguration
        this.debug = opts.debug ?? false
    }

    /** 是否支持 WebGPU */
    public static isSupported(): boolean {
        return typeof navigator !== 'undefined' && !!navigator.gpu
    }

    /** 设备是否已丢失 */
    public get isLost(): boolean {
        return this._lost
    }

    /**
     * 异步初始化适配器、设备、上下文和队列。
     * 选择高性能 adapter，绑定 device.lost 与 uncapturederror。
     */
    public async init(
        contextConfiguration?: Partial<GPUCanvasConfiguration>,
    ): Promise<void> {
        if (!navigator.gpu) throw new Error('WebGPU not supported in this environment.')

        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) throw new Error('No WebGPU adapter found.')

        this.device = await adapter.requestDevice(this.deviceDescriptor)
        if (!this.device) throw new Error('Failed to request device.')
        this.queue = this.device.queue

        // 设备丢失处理
        this.device.lost.then((info) => {
            this._lost = true
            console.error(`WebGPU device lost: ${info.reason} - ${info.message}`)
        })

        // uncapturederror 监听
        if (this.debug && 'onuncapturederror' in this.device) {
            this.device.onuncapturederror = (ev: GPUUncapturedErrorEvent) => {
                const err = ev.error as any
                console.error('[WebGPU uncaptured error]', {
                    name: err?.name,
                    message: err?.message,
                    reason: err?.reason,
                    code: err?.code,
                    errorObj: err,
                })
            }
        }

        this.context = this.canvas.getContext('webgpu') as GPUCanvasContext | null
        if (!this.context) throw new Error('WebGPU context not supported.')

        this.format = navigator.gpu.getPreferredCanvasFormat()
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied',
            ...this.contextConfiguration,
            ...contextConfiguration,
        })
    }

    /** 校验设备已就绪，未就绪抛错 */
    private ensureDevice(): GPUDevice {
        if (!this.device) throw new Error('Device not initialized. Call init() first.')
        if (this._lost) throw new Error('Device has been lost.')
        return this.device
    }

    // ==================== 着色器 ====================

    /** 创建着色器模块 */
    public createShaderModule(code: string, label?: string): GPUShaderModule {
        const device = this.ensureDevice()
        const mod = device.createShaderModule({ code, label })
        this.resources.shaders.add(mod)
        return mod
    }

    // ==================== 缓冲区 ====================

    /**
     * 创建并填充缓冲区。
     * 使用 mappedAtCreation 写入初始数据，不依赖 COPY_DST 权限。
     */
    public createBuffer(
        data: BufferSource,
        usage: GPUBufferUsageFlags,
        label?: string,
    ): GPUBuffer {
        const device = this.ensureDevice()
        const byteLength = data instanceof ArrayBuffer
            ? data.byteLength
            : (data as ArrayBufferView).byteLength
        const alignedSize = Math.ceil(byteLength / 4) * 4
        const buffer = device.createBuffer({ size: alignedSize, usage, mappedAtCreation: true, label })

        // 通过映射写入数据
        const mapped = buffer.getMappedRange()
        const src = data instanceof ArrayBuffer
            ? new Uint8Array(data)
            : new Uint8Array((data as ArrayBufferView).buffer, (data as ArrayBufferView).byteOffset, byteLength)
        new Uint8Array(mapped).set(src)
        buffer.unmap()

        this.resources.buffers.add(buffer)
        return buffer
    }

    /** 创建空缓冲区（按 size 字节），用于动态更新的 buffer */
    public createEmptyBuffer(
        size: number,
        usage: GPUBufferUsageFlags,
        label?: string,
    ): GPUBuffer {
        const device = this.ensureDevice()
        const alignedSize = Math.ceil(size / 4) * 4
        const buffer = device.createBuffer({ size: alignedSize, usage, label })
        this.resources.buffers.add(buffer)
        return buffer
    }

    /** 创建 Uniform 缓冲区（COPY_DST | UNIFORM） */
    public createUniformBuffer(data: BufferSource | number, label?: string): GPUBuffer {
        const size = typeof data === 'number' ? data : this.byteLengthOf(data)
        const alignedSize = Math.ceil(size / 256) * 256 // UBO 需要 256 字节对齐
        const buffer = this.createEmptyBuffer(alignedSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, label)
        if (typeof data !== 'number') {
            this.writeBuffer(buffer, data)
        }
        return buffer
    }

    /** 直接通过 queue 写入 buffer */
    public writeBuffer(buffer: GPUBuffer, data: BufferSource, offset: number = 0): void {
        if (!this.queue) throw new Error('Queue not initialized.')
        this.queue.writeBuffer(buffer, offset, data)
    }

    /**
     * 异步回读 buffer 数据。
     * 内部创建临时 COPY_DST buffer 复制后 mapAsync 读取。
     */
    public async readBuffer(
        srcBuffer: GPUBuffer,
        size?: number,
        offset: number = 0,
    ): Promise<ArrayBuffer> {
        const device = this.ensureDevice()
        const srcSize = size ?? srcBuffer.size
        const readback = device.createBuffer({
            size: Math.ceil(srcSize / 4) * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        })
        const encoder = device.createCommandEncoder()
        encoder.copyBufferToBuffer(srcBuffer, offset, readback, 0, srcSize)
        device.queue.submit([encoder.finish()])
        await readback.mapAsync(GPUMapMode.READ)
        const result = readback.getMappedRange().slice(0)
        readback.unmap()
        readback.destroy()
        return result as ArrayBuffer
    }

    private byteLengthOf(data: BufferSource): number {
        if (data instanceof ArrayBuffer) return data.byteLength
        return (data as ArrayBufferView).byteLength
    }

    // ==================== 纹理 ====================

    /** 创建 2D 纹理 */
    public createTexture(
        width: number,
        height: number,
        format: GPUTextureFormat = 'rgba8unorm',
        usage: GPUTextureUsageFlags = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        label?: string,
        options?: { mipLevelCount?: number; sampleCount?: number },
    ): GPUTexture {
        const device = this.ensureDevice()
        const tex = device.createTexture({
            size: { width, height },
            format,
            usage,
            label,
            mipLevelCount: options?.mipLevelCount ?? 1,
            sampleCount: options?.sampleCount ?? 1,
        })
        this.resources.textures.add(tex)
        return tex
    }

    /** 通过 queue 写入纹理数据 */
    public writeTexture(
        texture: GPUTexture,
        data: BufferSource,
        dataLayout: GPUImageDataLayout,
        size: GPUExtent3D,
        destination?: GPUImageCopyTexture,
    ): void {
        if (!this.queue) throw new Error('Queue not initialized.')
        this.queue.writeTexture(
            destination ?? { texture },
            data,
            dataLayout,
            size,
        )
    }

    /**
     * 从 ImageBitmap / HTMLImageElement 等上传到纹理。
     * 要求纹理 usage 含 COPY_DST | RENDER_ATTACHMENT。
     */
    public copyExternalImageToTexture(
        source: GPUCopyExternalImageSourceInfo,
        destination: GPUCopyExternalImageDestInfo,
        size: GPUExtent3D,
    ): void {
        if (!this.queue) throw new Error('Queue not initialized.')
        this.queue.copyExternalImageToTexture(source, destination, size)
    }

    /** 创建/重建深度纹理（resize 时自动调用） */
    public ensureDepthTexture(
        width: number,
        height: number,
        options?: DepthTextureOptions,
    ): GPUTexture {
        const device = this.ensureDevice()
        if (this._depthTexture) {
            const needsRecreate =
                (this._depthTexture as any).width !== width ||
                (this._depthTexture as any).height !== height
            if (!needsRecreate) return this._depthTexture
            this._depthTexture.destroy()
            this._depthTexture = null
        }
        this._depthFormat = options?.format ?? this._depthFormat
        this._depthTexture = device.createTexture({
            size: { width, height },
            format: this._depthFormat,
            usage: options?.usage ?? GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'depthTexture',
        })
        this.resources.textures.add(this._depthTexture)
        return this._depthTexture
    }

    /** 获取当前深度纹理（若存在） */
    public getDepthTexture(): GPUTexture | null {
        return this._depthTexture
    }

    /** 深度格式 */
    public get depthFormat(): GPUTextureFormat {
        return this._depthFormat
    }

    // ==================== Sampler ====================

    /** 创建 Sampler */
    public createSampler(descriptor: GPUSamplerDescriptor = {}, label?: string): GPUSampler {
        const device = this.ensureDevice()
        const sampler = device.createSampler({ ...descriptor, label })
        this.resources.samplers.add(sampler)
        return sampler
    }

    // ==================== BindGroup / Layout ====================

    /** 创建 BindGroupLayout */
    public createBindGroupLayout(
        entries: GPUBindGroupLayoutEntry[],
        label?: string,
    ): GPUBindGroupLayout {
        const device = this.ensureDevice()
        const layout = device.createBindGroupLayout({ entries, label })
        this.resources.bindGroupLayouts.add(layout)
        return layout
    }

    /** 创建 PipelineLayout */
    public createPipelineLayout(
        bindGroupLayouts: GPUBindGroupLayout[],
        label?: string,
    ): GPUPipelineLayout {
        const device = this.ensureDevice()
        return device.createPipelineLayout({ bindGroupLayouts, label })
    }

    /** 创建 BindGroup */
    public createBindGroup(
        layout: GPUBindGroupLayout,
        entries: GPUBindGroupEntry[],
        label?: string,
    ): GPUBindGroup {
        const device = this.ensureDevice()
        const group = device.createBindGroup({ layout, entries, label })
        this.resources.bindGroups.add(group)
        return group
    }

    // ==================== 渲染管线 ====================

    /**
     * 创建渲染管线（完整版）。
     * 接受完整 GPURenderPipelineDescriptor，或简化参数。
     */
    public createRenderPipeline(
        descriptor: GPURenderPipelineDescriptor,
    ): GPURenderPipeline
    public createRenderPipeline(
        vertexShaderModule: GPUShaderModule,
        fragmentShaderModule: GPUShaderModule,
        options?: {
            vertexEntryPoint?: string
            fragmentEntryPoint?: string
            buffers?: GPUVertexBufferLayout[]
            primitive?: GPUPrimitiveState
            depthStencil?: GPUDepthStencilState
            multisample?: GPUMultisampleState
            targets?: GPUColorTargetState[]
            layout?: GPUPipelineLayout | 'auto'
            label?: string
            cacheKey?: string
        },
    ): GPURenderPipeline
    public createRenderPipeline(
        descriptorOrVs: GPURenderPipelineDescriptor | GPUShaderModule,
        fsOrOptions?: GPUShaderModule | {
            vertexEntryPoint?: string
            fragmentEntryPoint?: string
            buffers?: GPUVertexBufferLayout[]
            primitive?: GPUPrimitiveState
            depthStencil?: GPUDepthStencilState
            multisample?: GPUMultisampleState
            targets?: GPUColorTargetState[]
            layout?: GPUPipelineLayout | 'auto'
            label?: string
            cacheKey?: string
        },
        options?: {
            vertexEntryPoint?: string
            fragmentEntryPoint?: string
            buffers?: GPUVertexBufferLayout[]
            primitive?: GPUPrimitiveState
            depthStencil?: GPUDepthStencilState
            multisample?: GPUMultisampleState
            targets?: GPUColorTargetState[]
            layout?: GPUPipelineLayout | 'auto'
            label?: string
            cacheKey?: string
        },
    ): GPURenderPipeline {
        const device = this.ensureDevice()

        let descriptor: GPURenderPipelineDescriptor
        let cacheKey: string | undefined

        if (descriptorOrVs && typeof descriptorOrVs === 'object' && 'vertex' in descriptorOrVs) {
            descriptor = descriptorOrVs as GPURenderPipelineDescriptor
            cacheKey = (descriptor as any).cacheKey
        } else {
            const vs = descriptorOrVs as GPUShaderModule
            const fs = (fsOrOptions as GPUShaderModule) ?? undefined
            const opts = (options ?? (typeof fsOrOptions === 'object' ? fsOrOptions : {})) as {
                vertexEntryPoint?: string
                fragmentEntryPoint?: string
                buffers?: GPUVertexBufferLayout[]
                primitive?: GPUPrimitiveState
                depthStencil?: GPUDepthStencilState
                multisample?: GPUMultisampleState
                targets?: GPUColorTargetState[]
                layout?: GPUPipelineLayout | 'auto'
                label?: string
                cacheKey?: string
            }
            cacheKey = opts.cacheKey
            descriptor = {
                layout: opts.layout ?? 'auto',
                vertex: {
                    module: vs,
                    entryPoint: opts.vertexEntryPoint ?? 'main',
                    buffers: opts.buffers ?? [],
                },
                fragment: fs
                    ? {
                          module: fs,
                          entryPoint: opts.fragmentEntryPoint ?? 'main',
                          targets: opts.targets ?? [{ format: this.format }],
                      }
                    : undefined,
                primitive: opts.primitive ?? { topology: 'triangle-list' },
                depthStencil: opts.depthStencil,
                multisample: opts.multisample,
                label: opts.label,
            }
        }

        if (cacheKey) {
            const cached = this.pipelineCache.get(cacheKey)
            if (cached) return cached
        }

        const pipeline = device.createRenderPipeline(descriptor)
        this.resources.pipelines.add(pipeline)
        if (cacheKey) this.pipelineCache.set(cacheKey, pipeline)
        return pipeline
    }

    // ==================== Compute 管线 ====================

    /** 创建 Compute 管线 */
    public createComputePipeline(
        shaderModule: GPUShaderModule,
        entryPoint: string = 'main',
        layout?: GPUPipelineLayout | 'auto',
        label?: string,
        cacheKey?: string,
    ): GPUComputePipeline {
        const device = this.ensureDevice()
        if (cacheKey) {
            const cached = this.computePipelineCache.get(cacheKey)
            if (cached) return cached
        }
        const pipeline = device.createComputePipeline({
            layout: layout ?? 'auto',
            compute: { module: shaderModule, entryPoint },
            label,
        })
        this.resources.computePipelines.add(pipeline)
        if (cacheKey) this.computePipelineCache.set(cacheKey, pipeline)
        return pipeline
    }

    // ==================== 命令编码 ====================

    /** 开始命令编码器 */
    public beginCommandEncoder(label?: string): GPUCommandEncoder {
        const device = this.ensureDevice()
        this.commandEncoder = device.createCommandEncoder({ label })
        return this.commandEncoder
    }

    /** 获取当前命令编码器 */
    public getCommandEncoder(): GPUCommandEncoder {
        if (!this.commandEncoder) throw new Error('No command encoder. Call beginCommandEncoder first.')
        return this.commandEncoder
    }

    /**
     * 开始渲染通道。
     * 若 options.depthClearValue !== undefined 且未传 depthView，
     * 会自动使用 ensureDepthTexture 创建的深度纹理。
     */
    public beginRenderPass(options: RenderPassOptions = {}): GPURenderPassEncoder {
        if (!this.commandEncoder) throw new Error('No command encoder. Call beginCommandEncoder first.')
        if (!this.context) throw new Error('Context not initialized.')

        const colorView = options.colorView ?? this.context.getCurrentTexture().createView()
        const colorAttachments: GPURenderPassColorAttachment[] = [
            {
                view: colorView,
                clearValue: options.clearValue ?? { r: 0, g: 0, b: 0, a: 0 },
                loadOp: options.loadOp ?? 'clear',
                storeOp: options.storeOp ?? 'store',
            },
        ]

        const descriptor: GPURenderPassDescriptor = { colorAttachments }

        // 深度/模板附件
        if (options.depthClearValue !== undefined || options.depthView) {
            let depthView = options.depthView
            if (!depthView) {
                if (!this._depthTexture) {
                    throw new Error('Depth attachment requested but no depth texture. Call ensureDepthTexture first.')
                }
                depthView = this._depthTexture.createView()
            }
            const attachment: GPURenderPassDepthStencilAttachment = {
                view: depthView,
                depthClearValue: options.depthClearValue ?? 1.0,
                depthLoadOp: options.depthLoadOp ?? 'clear',
                depthStoreOp: 'store',
            }
            // 仅当深度格式包含 stencil 通道时才设置 stencil 字段
            // depth24plus / depth32float 没有 stencil；depth24plus-stencil8 / depth32float-stencil8 有
            const fmt = this._depthFormat
            const stencilEnabled = fmt === 'depth24plus-stencil8' ||
                fmt === 'depth32float-stencil8' ||
                fmt === 'stencil8'
            if (stencilEnabled) {
                attachment.stencilClearValue = options.stencilClearValue ?? 0
                attachment.stencilLoadOp = options.stencilLoadOp ?? 'clear'
                attachment.stencilStoreOp = 'store'
            }
            descriptor.depthStencilAttachment = attachment
        }

        this.renderPassEncoder = this.commandEncoder.beginRenderPass(descriptor)
        return this.renderPassEncoder
    }

    /** 结束渲染通道 */
    public endRenderPass(): void {
        if (this.renderPassEncoder) {
            this.renderPassEncoder.end()
            this.renderPassEncoder = null
        }
    }

    /** 开始 Compute 通道 */
    public beginComputePass(label?: string): GPUComputePassEncoder {
        if (!this.commandEncoder) throw new Error('No command encoder. Call beginCommandEncoder first.')
        const device = this.ensureDevice()
        this.computePassEncoder = this.commandEncoder.beginComputePass({ label })
        return this.computePassEncoder
    }

    /** 结束 Compute 通道 */
    public endComputePass(): void {
        if (this.computePassEncoder) {
            this.computePassEncoder.end()
            this.computePassEncoder = null
        }
    }

    /** 结束命令编码并提交到队列 */
    public submit(): void {
        if (!this.commandEncoder) throw new Error('No command encoder.')
        if (!this.queue) throw new Error('Queue not initialized.')
        const commandBuffer = this.commandEncoder.finish()
        this.queue.submit([commandBuffer])
        this.commandEncoder = null
    }

    /**
     * 一键绘制：编码、渲染、提交（适用于简单单次绘制）。
     * 支持多个顶点缓冲区、实例化绘制。
     */
    public drawFrame(
        pipeline: GPURenderPipeline,
        bindGroups: GPUBindGroup[] = [],
        vertexBuffers: GPUBuffer[] | GPUBuffer,
        vertexCount: number,
        options?: {
            indexBuffer?: GPUBuffer
            indexFormat?: GPUIndexFormat
            indexCount?: number
            instanceCount?: number
            firstVertex?: number
            firstInstance?: number
            clearColor?: GPUColor
            useDepth?: boolean
        },
    ): void {
        this.beginCommandEncoder()
        const pass = this.beginRenderPass({
            clearValue: options?.clearColor,
            depthClearValue: options?.useDepth ? 1.0 : undefined,
        })
        pass.setPipeline(pipeline)
        bindGroups.forEach((group, i) => pass.setBindGroup(i, group))

        const buffers = Array.isArray(vertexBuffers) ? vertexBuffers : [vertexBuffers]
        buffers.forEach((buf, i) => pass.setVertexBuffer(i, buf))

        if (options?.indexBuffer && options?.indexCount) {
            pass.setIndexBuffer(options.indexBuffer, options.indexFormat ?? 'uint16')
            pass.drawIndexed(
                options.indexCount,
                options?.instanceCount ?? 1,
                0,
                options?.firstVertex ?? 0,
                options?.firstInstance ?? 0,
            )
        } else {
            pass.draw(
                vertexCount,
                options?.instanceCount ?? 1,
                options?.firstVertex ?? 0,
                options?.firstInstance ?? 0,
            )
        }
        this.endRenderPass()
        this.submit()
    }

    // ==================== 尺寸与销毁 ====================

    /** 调整画布尺寸（支持 DPR），并重建深度纹理（若存在） */
    public setSize(width: number, height: number, dpr: number = 1): void {
        const w = Math.max(1, Math.floor(width * dpr))
        const h = Math.max(1, Math.floor(height * dpr))
        this.canvas.width = w
        this.canvas.height = h
        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`
        // GPUCanvasContext 会自动跟随 css 尺寸适配
        // 若使用了深度纹理则重建
        if (this._depthTexture) {
            this.ensureDepthTexture(w, h)
        }
    }

    /** 单个资源销毁 */
    public destroyBuffer(buffer: GPUBuffer): void {
        buffer.destroy()
        this.resources.buffers.delete(buffer)
    }
    public destroyTexture(texture: GPUTexture): void {
        texture.destroy()
        this.resources.textures.delete(texture)
    }

    /** 销毁所有资源并释放设备 */
    public destroy(): void {
        if (this._depthTexture) {
            this._depthTexture.destroy()
            this._depthTexture = null
        }
        this.resources.buffers.forEach((b) => b.destroy())
        this.resources.textures.forEach((t) => t.destroy())
        this.resources.computePipelines.forEach((p) => (p as any).destroy?.())
        this.resources.pipelines.forEach((p) => (p as any).destroy?.())
        this.resources.bindGroups.forEach((g) => (g as any).destroy?.())
        this.resources.bindGroupLayouts.forEach((l) => (l as any).destroy?.())
        this.resources.samplers.forEach((s) => (s as any).destroy?.())
        this.resources.shaders.forEach((s) => (s as any).destroy?.())

        this.resources.buffers.clear()
        this.resources.textures.clear()
        this.resources.computePipelines.clear()
        this.resources.pipelines.clear()
        this.resources.bindGroups.clear()
        this.resources.bindGroupLayouts.clear()
        this.resources.samplers.clear()
        this.resources.shaders.clear()
        this.pipelineCache.clear()
        this.computePipelineCache.clear()
        this.commandEncoder = null
        this.renderPassEncoder = null
        this.computePassEncoder = null

        if (this.device) {
            this.device.destroy()
            this.device = null
            this.queue = null
            this.context = null
        }
    }
}
