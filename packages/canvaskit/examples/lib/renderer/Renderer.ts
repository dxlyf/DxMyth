/**
 * 渲染器抽象基类
 * 定义WebGL和WebGPU渲染器必须实现的接口
 */

import type { RendererOptions, RenderPassOptions, ComputePassOptions, DebugInfo, RendererEvent } from './types';
import type { Texture } from './Texture';
import type { Pipeline } from './Pipeline';
import type { Material } from './Material';
import type { Geometry } from './Geometry';

export abstract class Renderer {
    protected canvas: HTMLCanvasElement;
    protected options: RendererOptions;
    protected isInitialized: boolean = false;
    protected debugInfo: DebugInfo = {
        drawCalls: 0,
        triangles: 0,
        vertices: 0,
        textureMemory: 0,
        bufferMemory: 0,
        shaderCompilations: 0,
        frameTime: 0
    };
    protected eventHandlers: Map<RendererEvent, ((...args: any[]) => void)[]> = new Map();

    constructor(canvas: HTMLCanvasElement, options?: RendererOptions) {
        this.canvas = canvas;
        this.options = {
            width: canvas.width,
            height: canvas.height,
            pixelRatio: window.devicePixelRatio,
            clearColor: [0.0, 0.0, 0.0, 1.0],
            enableDebug: false,
            antialias: true,
            depth: true,
            stencil: false,
            powerPreference: 'default',
            ...options
        };
    }

    /**
     * 初始化渲染器
     */
    abstract initialize(): Promise<void>;

    /**
     * 清理渲染器资源
     */
    abstract dispose(): void;

    /**
     * 设置视口
     * @param x - 视口X坐标
     * @param y - 视口Y坐标
     * @param width - 视口宽度
     * @param height - 视口高度
     */
    abstract setViewport(x: number, y: number, width: number, height: number): void;

    /**
     * 设置剪刀矩形
     * @param x - 剪刀矩形X坐标
     * @param y - 剪刀矩形Y坐标
     * @param width - 剪刀矩形宽度
     * @param height - 剪刀矩形高度
     */
    abstract setScissor(x: number, y: number, width: number, height: number): void;

    /**
     * 启用/禁用剪刀测试
     * @param enabled - 是否启用剪刀测试
     */
    abstract enableScissorTest(enabled: boolean): void;

    /**
     * 清除颜色缓冲
     * @param color - 清除颜色
     */
    abstract clearColor(color?: [number, number, number, number]): void;

    /**
     * 清除深度缓冲
     * @param depth - 清除深度值
     */
    abstract clearDepth(depth?: number): void;

    /**
     * 清除模板缓冲
     * @param stencil - 清除模板值
     */
    abstract clearStencil(stencil?: number): void;

    /**
     * 清除所有缓冲
     */
    abstract clear(): void;

    /**
     * 开始渲染通道
     * @param options - 渲染通道选项
     */
    abstract beginRenderPass(options?: RenderPassOptions): void;

    /**
     * 结束渲染通道
     */
    abstract endRenderPass(): void;

    /**
     * 开始计算通道
     * @param options - 计算通道选项
     */
    abstract beginComputePass(options?: ComputePassOptions): void;

    /**
     * 结束计算通道
     */
    abstract endComputePass(): void;

    /**
     * 绘制几何体
     * @param pipeline - 渲染管线
     * @param geometry - 几何体
     * @param material - 材质
     * @param instanceCount - 实例数量
     */
    abstract draw(pipeline: Pipeline, geometry: Geometry, material: Material, instanceCount?: number): void;

    /**
     * 分配顶点缓冲
     * @param data - 顶点数据
     * @param usage - 使用方式
     * @returns 顶点缓冲对象
     */
    abstract createVertexBuffer(data: ArrayBuffer, usage?: 'static' | 'dynamic' | 'stream'): any;

    /**
     * 分配索引缓冲
     * @param data - 索引数据
     * @param usage - 使用方式
     * @returns 索引缓冲对象
     */
    abstract createIndexBuffer(data: ArrayBuffer, usage?: 'static' | 'dynamic' | 'stream'): any;

    /**
     * 更新缓冲数据
     * @param buffer - 缓冲对象
     * @param data - 新数据
     * @param offset - 偏移量
     */
    abstract updateBuffer(buffer: any, data: ArrayBuffer, offset?: number): void;

    /**
     * 创建纹理
     * @param options - 纹理选项
     * @returns 纹理对象
     */
    abstract createTexture(options: any): Texture;

    /**
     * 更新纹理数据
     * @param texture - 纹理对象
     * @param data - 纹理数据
     * @param x - X偏移
     * @param y - Y偏移
     * @param width - 宽度
     * @param height - 高度
     */
    abstract updateTexture(texture: Texture, data: ArrayBufferView, x?: number, y?: number, width?: number, height?: number): void;

    /**
     * 创建渲染目标
     * @param width - 宽度
     * @param height - 高度
     * @param options - 纹理选项
     * @returns 渲染目标纹理
     */
    abstract createRenderTarget(width: number, height: number, options?: any): Texture;

    /**
     * 创建渲染管线
     * @param options - 管线配置
     * @returns 渲染管线
     */
    abstract createPipeline(options: any): Pipeline;

    /**
     * 创建几何体
     * @param options - 几何体选项
     * @returns 几何体对象
     */
    abstract createGeometry(options?: any): Geometry;

    /**
     * 创建材质
     * @param type - 材质类型 (可选，默认是BasicMaterial)
     * @param options - 材质选项
     * @returns 材质对象
     */
    abstract createMaterial(type?: string, options?: any): Material;

    /**
     * 创建采样器
     * @param options - 采样器选项
     * @returns 采样器对象
     */
    abstract createSampler(options: any): any;

    /**
     * 创建查询对象
     * @param type - 查询类型
     * @param count - 查询数量
     * @returns 查询对象
     */
    abstract createQuery(type: string, count?: number): any;

    /**
     * 调整渲染器大小
     * @param width - 新宽度
     * @param height - 新高度
     */
    abstract resize(width: number, height: number): void;

    /**
     * 获取当前渲染API
     * @returns API名称
     */
    abstract getAPI(): 'webgl' | 'webgl2' | 'webgpu';

    /**
     * 获取渲染器能力
     * @returns 能力对象
     */
    abstract getCapabilities(): any;

    /**
     * 获取调试信息
     * @returns 调试信息
     */
    getDebugInfo(): DebugInfo {
        return { ...this.debugInfo };
    }

    /**
     * 重置调试信息
     */
    resetDebugInfo(): void {
        this.debugInfo = {
            drawCalls: 0,
            triangles: 0,
            vertices: 0,
            textureMemory: 0,
            bufferMemory: 0,
            shaderCompilations: 0,
            frameTime: 0
        };
    }

    /**
     * 监听渲染器事件
     * @param event - 事件类型
     * @param handler - 事件处理函数
     */
    on(event: RendererEvent, handler: (...args: any[]) => void): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)!.push(handler);
    }

    /**
     * 移除渲染器事件监听
     * @param event - 事件类型
     * @param handler - 事件处理函数
     */
    off(event: RendererEvent, handler: (...args: any[]) => void): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * 触发渲染器事件
     * @param event - 事件类型
     * @param args - 事件参数
     */
    protected  emit(event: RendererEvent, ...args: any[]): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(...args));
        }
    }

    /**
     * 获取渲染上下文
     * @returns 渲染上下文
     */
    abstract getContext(): any;

    /**
     * 执行同步任务
     */
    abstract flush(): void;

    /**
     * 执行异步任务
     */
    abstract submit(): void;
}
