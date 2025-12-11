/**
 * WebGPU渲染器实现
 */

import { Renderer } from '../Renderer';
import { WebGPUTexture } from './WebGPUTexture';
import { WebGPUPipeline } from './WebGPUPipeline';
import { Geometry } from '../Geometry';
import { Material, BasicMaterial } from '../Material';
import type { RendererOptions, RenderPassOptions, ComputePassOptions } from '../types';
import type { Texture } from '../Texture';
import type { Pipeline } from '../Pipeline';

export class WebGPURenderer extends Renderer {
    private adapter: GPUAdapter | null = null;
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    private swapChain: GPUSwapChain | null = null;
    private commandEncoder: GPUCommandEncoder | null = null;
    private currentRenderPass: GPURenderPassEncoder | null = null;
    private currentComputePass: GPUComputePassEncoder | null = null;

    constructor(canvas: HTMLCanvasElement, options?: RendererOptions) {
        super(canvas, options);
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        // 检查WebGPU支持
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported in this browser');
        }

        try {
            // 获取GPU适配器
            this.adapter = await navigator.gpu.requestAdapter({
                powerPreference: this.options.powerPreference,
                forceFallbackAdapter: false
            });

            if (!this.adapter) {
                throw new Error('Failed to get GPU adapter');
            }

            // 请求设备
            this.device = await this.adapter.requestDevice({
                requiredFeatures: [],
                requiredLimits: {},
                label: 'DxMyth WebGPU Device'
            });

            // 获取画布上下文
            this.context = this.canvas.getContext('webgpu');
            if (!this.context) {
                throw new Error('Failed to get WebGPU canvas context');
            }

            // 配置上下文
            const format = navigator.gpu.getPreferredCanvasFormat();
            this.context.configure({
                device: this.device,
                format: format,
                alphaMode: 'premultiplied',
                compositingAlphaMode: 'opaque',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
            });

            // 创建交换链
            this.swapChain = this.context;

            this.isInitialized = true;
            this.emit('initialized', this);
        } catch (error) {
            console.error('WebGPU initialization failed:', error);
            this.emit('error', error);
            throw error;
        }
    }

    dispose(): void {
        if (!this.isInitialized) return;

        if (this.device) {
            this.device.destroy();
            this.device = null;
        }

        this.adapter = null;
        this.context = null;
        this.swapChain = null;
        this.commandEncoder = null;
        this.currentRenderPass = null;
        this.currentComputePass = null;

        this.isInitialized = false;
        this.emit('disposed', this);
    }

    setViewport(x: number, y: number, width: number, height: number): void {
        if (this.currentRenderPass) {
            this.currentRenderPass.setViewport(x, y, width, height, 0.0, 1.0);
        }
    }

    setScissor(x: number, y: number, width: number, height: number): void {
        if (this.currentRenderPass) {
            this.currentRenderPass.setScissorRect(x, y, width, height);
        }
    }

    enableScissorTest(enabled: boolean): void {
        // WebGPU默认启用剪刀测试，通过设置剪刀矩形大小为0来禁用
        if (this.currentRenderPass) {
            if (!enabled) {
                this.currentRenderPass.setScissorRect(0, 0, 0, 0);
            }
        }
    }

    clearColor(color?: [number, number, number, number]): void {
        // 颜色清除在渲染通道开始时处理
    }

    clearDepth(depth?: number): void {
        // 深度清除在渲染通道开始时处理
    }

    clearStencil(stencil?: number): void {
        // 模板清除在渲染通道开始时处理
    }

    clear(): void {
        if (!this.device || !this.swapChain) return;

        const format = navigator.gpu.getPreferredCanvasFormat();
        const commandEncoder = this.device.createCommandEncoder();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.swapChain.getCurrentTexture().createView(),
                    clearValue: {
                        r: this.options.clearColor![0],
                        g: this.options.clearColor![1],
                        b: this.options.clearColor![2],
                        a: this.options.clearColor![3]
                    },
                    loadOp: 'clear',
                    storeOp: 'store'
                }
            ],
            depthStencilAttachment: this.options.depth ? {
                view: this.createDepthStencilView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
                stencilClearValue: 0,
                stencilLoadOp: 'clear',
                stencilStoreOp: 'store'
            } : undefined
        };

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    beginRenderPass(options?: RenderPassOptions): void {
        if (!this.device || !this.swapChain) return;

        this.commandEncoder = this.device.createCommandEncoder();

        const colorAttachment: GPURenderPassColorAttachment = {
            view: options?.target
                ? (options.target as WebGPUTexture).getNativeTexture() as GPUTextureView
                : this.swapChain.getCurrentTexture().createView(),
            clearValue: options?.clearColor || {
                r: this.options.clearColor![0],
                g: this.options.clearColor![1],
                b: this.options.clearColor![2],
                a: this.options.clearColor![3]
            },
            loadOp: options?.loadOp || (options?.clear ? 'clear' : 'load'),
            storeOp: 'store'
        };

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment],
            depthStencilAttachment: this.options.depth ? {
                view: this.createDepthStencilView(),
                depthClearValue: options?.depthClearValue || 1.0,
                depthLoadOp: options?.depthLoadOp || (options?.clear ? 'clear' : 'load'),
                depthStoreOp: 'store',
                stencilClearValue: options?.stencilClearValue || 0,
                stencilLoadOp: options?.stencilLoadOp || (options?.clear ? 'clear' : 'load'),
                stencilStoreOp: 'store'
            } : undefined
        };

        this.currentRenderPass = this.commandEncoder.beginRenderPass(renderPassDescriptor);
    }

    endRenderPass(): void {
        if (!this.currentRenderPass || !this.commandEncoder || !this.device) return;

        this.currentRenderPass.end();
        this.currentRenderPass = null;

        this.device.queue.submit([this.commandEncoder.finish()]);
        this.commandEncoder = null;
    }

    beginComputePass(options?: ComputePassOptions): void {
        if (!this.device) return;

        this.commandEncoder = this.device.createCommandEncoder();
        this.currentComputePass = this.commandEncoder.beginComputePass({
            label: options?.label
        });
    }

    endComputePass(): void {
        if (!this.currentComputePass || !this.commandEncoder || !this.device) return;

        this.currentComputePass.end();
        this.currentComputePass = null;

        this.device.queue.submit([this.commandEncoder.finish()]);
        this.commandEncoder = null;
    }

    draw(pipeline: Pipeline, geometry: Geometry, material: Material, instanceCount: number = 1): void {
        if (!this.currentRenderPass) return;

        // 应用材质
        material.prepare(pipeline);
        material.apply();

        // 设置管线
        this.currentRenderPass.setPipeline((pipeline as WebGPUPipeline).getNativePipeline() as GPURenderPipeline);

        // 设置顶点缓冲
        const vertexBuffers = geometry.getVertexBuffers();
        vertexBuffers.forEach((buffer, index) => {
            this.currentRenderPass!.setVertexBuffer(index, buffer as GPUBuffer, 0);
        });

        // 设置索引缓冲
        const indexBuffer = geometry.getIndexBuffer();
        if (indexBuffer) {
            this.currentRenderPass.setIndexBuffer(indexBuffer as GPUBuffer, 'uint16', 0);
            this.currentRenderPass.drawIndexed(geometry.getPrimitiveCount() * 3, instanceCount, 0, 0, 0);
        } else {
            this.currentRenderPass.draw(geometry.getVertexCount(), instanceCount, 0, 0);
        }

        // 更新调试信息
        if (this.options.enableDebug) {
            this.debugInfo.drawCalls++;
            this.debugInfo.triangles += geometry.getPrimitiveCount();
            this.debugInfo.vertices += geometry.getVertexCount();
        }
    }

    createVertexBuffer(data: ArrayBuffer, usage: 'static' | 'dynamic' | 'stream' = 'static'): GPUBuffer {
        if (!this.device) {
            throw new Error('WebGPU device not initialized');
        }

        const gpuUsage = GPUBufferUsage.VERTEX;
        const mappedAtCreation = usage === 'dynamic' || usage === 'stream';

        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: gpuUsage | GPUBufferUsage.COPY_DST,
            mappedAtCreation: mappedAtCreation,
            label: 'Vertex Buffer'
        });

        if (mappedAtCreation) {
            const arrayBuffer = buffer.getMappedRange();
            new Uint8Array(arrayBuffer).set(new Uint8Array(data));
            buffer.unmap();
        } else {
            this.device.queue.writeBuffer(buffer, 0, data);
        }

        if (this.options.enableDebug) {
            this.debugInfo.bufferMemory += data.byteLength;
        }

        return buffer;
    }

    createIndexBuffer(data: ArrayBuffer, usage: 'static' | 'dynamic' | 'stream' = 'static'): GPUBuffer {
        if (!this.device) {
            throw new Error('WebGPU device not initialized');
        }

        const gpuUsage = GPUBufferUsage.INDEX;
        const mappedAtCreation = usage === 'dynamic' || usage === 'stream';

        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: gpuUsage | GPUBufferUsage.COPY_DST,
            mappedAtCreation: mappedAtCreation,
            label: 'Index Buffer'
        });

        if (mappedAtCreation) {
            const arrayBuffer = buffer.getMappedRange();
            new Uint8Array(arrayBuffer).set(new Uint8Array(data));
            buffer.unmap();
        } else {
            this.device.queue.writeBuffer(buffer, 0, data);
        }

        if (this.options.enableDebug) {
            this.debugInfo.bufferMemory += data.byteLength;
        }

        return buffer;
    }

    updateBuffer(buffer: GPUBuffer, data: ArrayBuffer, offset: number = 0): void {
        if (!this.device) {
            throw new Error('WebGPU device not initialized');
        }

        this.device.queue.writeBuffer(buffer, offset, data);
    }

    createTexture(options: any): Texture {
        return new WebGPUTexture(this, options);
    }

    updateTexture(texture: Texture, data: ArrayBufferView, x: number = 0, y: number = 0, width?: number, height?: number): void {
        if (texture instanceof WebGPUTexture) {
            texture.update(data, x, y, width, height);
        }
    }

    createRenderTarget(width: number, height: number, options?: any): Texture {
        const renderTargetOptions = {
            width,
            height,
            format: 'rgba8unorm',
            usage: 'render-target',
            ...options
        };

        return this.createTexture(renderTargetOptions);
    }

    createPipeline(options: any): Pipeline {
        return new WebGPUPipeline(this, options);
    }

    /**
     * 创建几何体
     * @param options - 几何体选项
     * @returns 几何体对象
     */
    createGeometry(options?: any): Geometry {
        return new Geometry(this, options);
    }

    /**
     * 创建材质
     * @param type - 材质类型 (可选，默认是BasicMaterial)
     * @param options - 材质选项
     * @returns 材质对象
     */
    createMaterial(type: string = 'basic', options?: any): Material {
        switch (type.toLowerCase()) {
            case 'basic':
            default:
                return new BasicMaterial(this, options);
        }
    }

    createSampler(options: any): GPUSampler {
        if (!this.device) {
            throw new Error('WebGPU device not initialized');
        }

        const gpuSamplerDesc: GPUSamplerDescriptor = {
            addressModeU: this.mapWrapMode(options.wrapS || 'clamp'),
            addressModeV: this.mapWrapMode(options.wrapT || 'clamp'),
            magFilter: this.mapFilter(options.magFilter || 'linear'),
            minFilter: this.mapFilter(options.minFilter || 'linear'),
            mipmapFilter: this.mapFilter(options.mipFilter || 'linear'),
            maxAnisotropy: options.anisotropy || 1
        };

        return this.device.createSampler(gpuSamplerDesc);
    }

    createQuery(type: string, count: number = 1): any {
        if (!this.device) {
            throw new Error('WebGPU device not initialized');
        }

        const querySet = this.device.createQuerySet({
            type: type as GPUQueryType,
            count: count
        });

        return querySet;
    }

    resize(width: number, height: number): void {
        this.options.width = width;
        this.options.height = height;

        if (this.context && this.device) {
            this.context.configure({
                device: this.device,
                format: navigator.gpu.getPreferredCanvasFormat(),
                alphaMode: 'premultiplied',
                compositingAlphaMode: 'opaque',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
            });
        }
    }

    getAPI(): 'webgpu' {
        return 'webgpu';
    }

    getCapabilities(): any {
        return {
            webgpu: true,
            computeShaders: true,
            bindGroups: true,
            storageTextures: true,
            indirectDrawing: true,
            shaderModel: 'wgsl',
            maxVertexAttributes: 16,
            maxVertexBuffers: 8,
            maxTextureSize: 8192
        };
    }

    getContext(): GPUDevice | null {
        return this.device;
    }

    flush(): void {
        // WebGPU自动刷新
    }

    submit(): void {
        // WebGPU自动提交
    }

    // 辅助方法

    private mapWrapMode(mode: string): GPUAddressMode {
        switch (mode) {
            case 'repeat':
                return 'repeat';
            case 'mirror':
                return 'mirror-repeat';
            case 'clamp':
            default:
                return 'clamp-to-edge';
        }
    }

    private mapFilter(filter: string): GPUFilterMode | GPUTextureFilterMode {
        switch (filter) {
            case 'nearest':
                return 'nearest';
            case 'linear':
            default:
                return 'linear';
        }
    }

    private createDepthStencilView(): GPUTextureView {
        if (!this.device) {
            throw new Error('WebGPU device not initialized');
        }

        const depthTexture = this.device.createTexture({
            size: [this.options.width, this.options.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Depth Texture'
        });

        return depthTexture.createView();
    }
}
