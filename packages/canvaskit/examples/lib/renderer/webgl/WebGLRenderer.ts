/**
 * WebGL渲染器实现
 * 支持WebGL 1.0和WebGL 2.0
 */

import { Renderer } from '../Renderer';
import { WebGLTexture } from './WebGLTexture';
import { WebGLPipeline } from './WebGLPipeline';
import { Geometry } from '../Geometry';
import { Material, BasicMaterial } from '../Material';
import type { RendererOptions, RenderPassOptions, ComputePassOptions } from '../types';
import type { Texture } from '../Texture';
import type { Pipeline } from '../Pipeline';

export class WebGLRenderer extends Renderer {
    private gl: WebGLRenderingContext | WebGL2RenderingContext;
    private isWebGL2: boolean = false;
    private currentProgram: WebGLProgram | null = null;
    private currentVertexArray: WebGLVertexArrayObject | null = null;
    private viewport: [number, number, number, number] = [0, 0, 0, 0];
    private scissor: [number, number, number, number] = [0, 0, 0, 0];
    private scissorEnabled: boolean = false;

    constructor(canvas: HTMLCanvasElement, options?: RendererOptions) {
        super(canvas, options);
        this.gl = this.createContext();
        this.initializeWebGL();
    }

    private createContext(): WebGLRenderingContext | WebGL2RenderingContext {
        // 优先尝试WebGL 2.0
        const gl2 = this.canvas.getContext('webgl2', {
            antialias: this.options.antialias,
            depth: this.options.depth,
            stencil: this.options.stencil,
            alpha: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            powerPreference: this.options.powerPreference
        });

        if (gl2) {
            this.isWebGL2 = true;
            return gl2;
        }

        // 回退到WebGL 1.0
        const gl = this.canvas.getContext('webgl', {
            antialias: this.options.antialias,
            depth: this.options.depth,
            stencil: this.options.stencil,
            alpha: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            powerPreference: this.options.powerPreference
        });

        if (!gl) {
            throw new Error('WebGL is not supported in this browser');
        }

        this.isWebGL2 = false;
        return gl;
    }

    async initialize(): Promise<void> {
        // WebGL不需要异步初始化
        if (!this.isInitialized) {
            this.initializeWebGL();
            this.isInitialized = true;
            this.emit('initialized', this);
        }
    }

    private initializeWebGL(): void {
        const gl = this.gl;

        // 设置视口
        this.setViewport(0, 0, this.canvas.width, this.canvas.height);

        // 启用深度测试
        if (this.options.depth) {
            gl.enable(gl.DEPTH_TEST);
        }

        // 启用模板测试
        if (this.options.stencil) {
            gl.enable(gl.STENCIL_TEST);
        }

        // 设置清除颜色
        gl.clearColor(
            this.options.clearColor![0],
            this.options.clearColor![1],
            this.options.clearColor![2],
            this.options.clearColor![3]
        );

        // 设置混合模式
        if (this.options.blend) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }

        // 启用背面剔除
        if (this.options.cullFace) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
        }
    }

    dispose(): void {
        if (!this.isInitialized) return;

        // 清理资源
        this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        this.isInitialized = false;
        this.emit('disposed', this);
    }

    setViewport(x: number, y: number, width: number, height: number): void {
        const gl = this.gl;
        this.viewport = [x, y, width, height];
        gl.viewport(x, y, width, height);
    }

    setScissor(x: number, y: number, width: number, height: number): void {
        const gl = this.gl;
        this.scissor = [x, y, width, height];
        gl.scissor(x, y, width, height);
    }

    enableScissorTest(enabled: boolean): void {
        const gl = this.gl;
        this.scissorEnabled = enabled;
        if (enabled) {
            gl.enable(gl.SCISSOR_TEST);
        } else {
            gl.disable(gl.SCISSOR_TEST);
        }
    }

    clearColor(color?: [number, number, number, number]): void {
        const gl = this.gl;
        if (color) {
            gl.clearColor(color[0], color[1], color[2], color[3]);
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    clearDepth(depth?: number): void {
        const gl = this.gl;
        if (depth !== undefined) {
            gl.clearDepth(depth);
        }
        gl.clear(gl.DEPTH_BUFFER_BIT);
    }

    clearStencil(stencil?: number): void {
        const gl = this.gl;
        if (stencil !== undefined) {
            gl.clearStencil(stencil);
        }
        gl.clear(gl.STENCIL_BUFFER_BIT);
    }

    clear(): void {
        const gl = this.gl;
        let mask = 0;

        mask |= gl.COLOR_BUFFER_BIT;
        if (this.options.depth) {
            mask |= gl.DEPTH_BUFFER_BIT;
        }
        if (this.options.stencil) {
            mask |= gl.STENCIL_BUFFER_BIT;
        }

        gl.clear(mask);
    }

    beginRenderPass(options?: RenderPassOptions): void {
        const gl = this.gl;

        // 绑定帧缓冲（如果有）
        if (options?.target) {
            const framebuffer = (options.target as WebGLTexture).getFramebuffer();
            if (framebuffer) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                // 设置视口
                gl.viewport(0, 0, options.target.getWidth(), options.target.getHeight());
            }
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // 设置视口
            gl.viewport(0, 0, this.canvas.width * this.options.pixelRatio, this.canvas.height * this.options.pixelRatio);
        }

        // 清除缓冲
        if (options?.clear) {
            let clearMask = 0;

            // 清除颜色缓冲
            if (options.colorAttachments?.[0]?.clearValue) {
                gl.clearColor(...options.colorAttachments[0].clearValue);
                clearMask |= gl.COLOR_BUFFER_BIT;
            }

            // 清除深度缓冲
            if (this.options.depth && options.depthStencilAttachment?.depthClearValue !== undefined) {
                gl.clearDepth(options.depthStencilAttachment.depthClearValue);
                clearMask |= gl.DEPTH_BUFFER_BIT;
            }

            // 清除模板缓冲
            if (this.options.stencil && options.depthStencilAttachment?.stencilClearValue !== undefined) {
                gl.clearStencil(options.depthStencilAttachment.stencilClearValue);
                clearMask |= gl.STENCIL_BUFFER_BIT;
            }

            if (clearMask) {
                gl.clear(clearMask);
            }
        }
    }

    endRenderPass(): void {
        const gl = this.gl;
        // 解绑帧缓冲
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    beginComputePass(options?: ComputePassOptions): void {
        // WebGL 1.0不支持计算着色器
        // WebGL 2.0可以通过transform feedback模拟，但这里简单返回
        if (!this.isWebGL2) {
            console.warn('Compute pass is not supported in WebGL 1.0');
        }
    }

    endComputePass(): void {
        // WebGL中不支持计算着色器
    }

    draw(pipeline: Pipeline, geometry: Geometry, material: Material, instanceCount: number = 1): void {
        const gl = this.gl;
        const webglPipeline = pipeline as WebGLPipeline;

        // 应用材质
        material.prepare(pipeline);
        material.apply();

        // 绑定管线
        webglPipeline.bind();

        // 设置顶点缓冲
        const vertexBuffers = geometry.getVertexBuffers();
        vertexBuffers.forEach((buffer, index) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer as WebGLBuffer);
            // 顶点属性布局由pipeline设置
        });

        // 设置索引缓冲
        const indexBuffer = geometry.getIndexBuffer();
        if (indexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer as WebGLBuffer);
        }

        // 绘制
        const topology = this.mapTopology(webglPipeline.getState().topology);
        if (indexBuffer) {
            gl.drawElements(topology, geometry.getPrimitiveCount() * 3, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(topology, 0, geometry.getVertexCount());
        }

        // 更新调试信息
        if (this.options.enableDebug) {
            this.debugInfo.drawCalls++;
            this.debugInfo.triangles += geometry.getPrimitiveCount();
            this.debugInfo.vertices += geometry.getVertexCount();
        }
    }

    createVertexBuffer(data: ArrayBuffer, usage: 'static' | 'dynamic' | 'stream' = 'static'): WebGLBuffer {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create vertex buffer');
        }

        const glUsage = this.mapUsage(usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        if (this.options.enableDebug) {
            this.debugInfo.bufferMemory += data.byteLength;
        }

        return buffer;
    }

    createIndexBuffer(data: ArrayBuffer, usage: 'static' | 'dynamic' | 'stream' = 'static'): WebGLBuffer {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create index buffer');
        }

        const glUsage = this.mapUsage(usage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        if (this.options.enableDebug) {
            this.debugInfo.bufferMemory += data.byteLength;
        }

        return buffer;
    }

    updateBuffer(buffer: WebGLBuffer, data: ArrayBuffer, offset: number = 0): void {
        const gl = this.gl;
        // 确定缓冲类型
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        if (gl.isBuffer(buffer)) {
            gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    createTexture(options: any): Texture {
        return new WebGLTexture(this, options);
    }

    updateTexture(texture: Texture, data: ArrayBufferView, x: number = 0, y: number = 0, width?: number, height?: number): void {
        if (texture instanceof WebGLTexture) {
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
        return new WebGLPipeline(this, options);
    }

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

    createSampler(options: any): WebGLSampler | null {
        const gl = this.gl;
        if (!this.isWebGL2) {
            // WebGL 1.0不支持独立采样器对象
            return null;
        }

        const webgl2 = gl as WebGL2RenderingContext;
        const sampler = webgl2.createSampler();
        if (!sampler) {
            return null;
        }

        webgl2.samplerParameteri(sampler, webgl2.TEXTURE_WRAP_S, this.mapWrapMode(options.wrapS || 'clamp'));
        webgl2.samplerParameteri(sampler, webgl2.TEXTURE_WRAP_T, this.mapWrapMode(options.wrapT || 'clamp'));
        webgl2.samplerParameteri(sampler, webgl2.TEXTURE_MAG_FILTER, this.mapFilter(options.magFilter || 'linear'));
        webgl2.samplerParameteri(sampler, webgl2.TEXTURE_MIN_FILTER, this.mapFilter(options.minFilter || 'linear'));

        return sampler;
    }

    createQuery(type: string, count: number = 1): any {
        if (!this.isWebGL2) {
            return null;
        }

        const webgl2 = this.gl as WebGL2RenderingContext;
        const query = webgl2.createQuery();
        if (!query) {
            return null;
        }

        return query;
    }

    resize(width: number, height: number): void {
        const gl = this.gl;
        this.options.width = width;
        this.options.height = height;
        this.canvas.width = width;
        this.canvas.height = height;

        // 更新视口
        this.setViewport(0, 0, width, height);
    }

    getAPI(): 'webgl' | 'webgl2' {
        return this.isWebGL2 ? 'webgl2' : 'webgl';
    }

    getCapabilities(): any {
        return {
            webgl: true,
            webgl2: this.isWebGL2,
            computeShaders: this.isWebGL2,
            transformFeedback: this.isWebGL2,
            instancedDrawing: true,
            vertexArrayObjects: this.isWebGL2,
            samplerObjects: this.isWebGL2,
            uniformBuffers: this.isWebGL2,
            shaderModel: this.isWebGL2 ? 'glsl300es' : 'glsl100',
            maxVertexAttributes: this.gl.getParameter(this.gl.MAX_VERTEX_ATTRIBS),
            maxVertexBuffers: 8,
            maxTextureSize: this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE)
        };
    }

    getContext(): WebGLRenderingContext | WebGL2RenderingContext {
        return this.gl;
    }

    flush(): void {
        this.gl.flush();
    }

    submit(): void {
        // WebGL中不需要显式提交
        this.gl.flush();
    }

    // 辅助方法

    private mapUsage(usage: string): number {
        const gl = this.gl;
        switch (usage) {
            case 'static':
                return gl.STATIC_DRAW;
            case 'dynamic':
                return gl.DYNAMIC_DRAW;
            case 'stream':
                return gl.STREAM_DRAW;
            default:
                return gl.STATIC_DRAW;
        }
    }

    private mapTopology(topology: string): number {
        const gl = this.gl;
        switch (topology) {
            case 'point-list':
                return gl.POINTS;
            case 'line-list':
                return gl.LINES;
            case 'line-strip':
                return gl.LINE_STRIP;
            case 'triangle-list':
                return gl.TRIANGLES;
            case 'triangle-strip':
                return gl.TRIANGLE_STRIP;
            case 'triangle-fan':
                return gl.TRIANGLE_FAN;
            default:
                return gl.TRIANGLES;
        }
    }

    private mapWrapMode(mode: string): number {
        const gl = this.gl;
        switch (mode) {
            case 'repeat':
                return gl.REPEAT;
            case 'mirror':
                return gl.MIRRORED_REPEAT;
            case 'clamp':
                return gl.CLAMP_TO_EDGE;
            default:
                return gl.CLAMP_TO_EDGE;
        }
    }

    private mapFilter(filter: string): number {
        const gl = this.gl;
        switch (filter) {
            case 'nearest':
                return gl.NEAREST;
            case 'linear':
                return gl.LINEAR;
            default:
                return gl.LINEAR;
        }
    }
}
