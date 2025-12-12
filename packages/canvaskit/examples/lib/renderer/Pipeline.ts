/**
 * 管线抽象类
 * 统一WebGL和WebGPU的渲染管线接口
 */

import type { ShaderSource, PipelineState, VertexAttribute } from './types';
import type { Renderer } from './Renderer';
import type { Texture } from './Texture';

export abstract class Pipeline {
    protected renderer: Renderer;
    protected state: PipelineState;
    protected shaders: { vertex: any; fragment?: any; compute?: any } = { vertex: null };
    protected isDisposed: boolean = false;

    constructor(renderer: Renderer, state: PipelineState) {
        this.renderer = renderer;
        this.state = {
            topology: 'triangle-list',
            primitiveRestart: false,
            cullMode: 'back',
            frontFace: 'cw',
            depthTest: true,
            depthWrite: true,
            depthCompare: 'less',
            blendEnabled: false,
            blendSrcFactor: 'src-alpha',
            blendDstFactor: 'one-minus-src-alpha',
            blendEquation: 'add',
            ...state
        };
    }

    /**
     * 获取管线状态
     * @returns 管线状态
     */
    getState(): PipelineState {
        return { ...this.state };
    }

    /**
     * 设置管线状态
     * @param state - 要更新的管线状态
     */
    setState(state: Partial<PipelineState>): void {
        this.state = { ...this.state, ...state };
        this.updatePipelineState();
    }

    /**
     * 更新管线状态（由具体实现类处理）
     */
    protected abstract updatePipelineState(): void;

    /**
     * 编译着色器
     * @param source - 着色器源码
     */
    abstract compileShader(source: ShaderSource): void;

    /**
     * 设置顶点属性布局
     * @param attributes - 顶点属性列表
     */
    abstract setVertexAttributes(attributes: VertexAttribute[]): void;

    /**
     * 设置顶点缓冲
     * @param buffers - 顶点缓冲列表
     */
    abstract setVertexBuffers(buffers: any[]): void;

    /**
     * 设置索引缓冲
     * @param buffer - 索引缓冲
     */
    abstract setIndexBuffer(buffer: any): void;

    /**
     * 设置全局 uniforms
     * @param uniforms - Uniform 数据
     */
    abstract setUniforms(uniforms: Record<string, any>): void;

    /**
     * 设置纹理
     * @param index - 纹理索引
     * @param texture - 纹理对象
     * @param sampler - 采样器
     */
    abstract setTexture(index: number, texture: Texture, sampler?: any): void;

    /**
     * 绑定管线
     */
    abstract bind(): void;

    /**
     * 解绑管线
     */
    abstract unbind(): void;

    /**
     * 获取底层API管线对象
     * @returns 底层管线对象
     */
    abstract getNativePipeline(): any;

    /**
     * 清理管线资源
     */
    abstract dispose(): void;

    /**
     * 检查管线是否已清理
     * @returns 是否已清理
     */
    isDisposed(): boolean {
        return this.isDisposed;
    }
}
