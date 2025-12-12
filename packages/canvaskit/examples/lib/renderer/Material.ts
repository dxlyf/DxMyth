/**
 * 材质抽象类
 * 定义渲染材质的统一接口
 */

import type { Renderer } from './Renderer';
import type { Texture } from './Texture';
import type { Pipeline } from './Pipeline';

export abstract class Material {
    protected renderer: Renderer;
    protected uniforms: Record<string, any> = {};
    protected textures: Map<number, { texture: Texture; sampler?: any }> = new Map();
    protected pipeline: Pipeline | null = null;
    protected isDisposed: boolean = false;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    /**
     * 设置Uniform值
     * @param name - Uniform名称
     * @param value - Uniform值
     */
    setUniform(name: string, value: any): void {
        this.uniforms[name] = value;
    }

    /**
     * 获取Uniform值
     * @param name - Uniform名称
     * @returns Uniform值
     */
    getUniform(name: string): any {
        return this.uniforms[name];
    }

    /**
     * 获取所有Uniforms
     * @returns Uniforms对象
     */
    getUniforms(): Record<string, any> {
        return { ...this.uniforms };
    }

    /**
     * 设置纹理
     * @param index - 纹理单元索引
     * @param texture - 纹理对象
     * @param sampler - 采样器（可选）
     */
    setTexture(index: number, texture: Texture, sampler?: any): void {
        this.textures.set(index, { texture, sampler });
    }

    /**
     * 获取纹理
     * @param index - 纹理单元索引
     * @returns 纹理对象和采样器
     */
    getTexture(index: number): { texture: Texture; sampler?: any } | undefined {
        return this.textures.get(index);
    }

    /**
     * 获取材质关联的渲染管线
     * @returns 渲染管线
     */
    getPipeline(): Pipeline | null {
        return this.pipeline;
    }

    /**
     * 设置渲染管线
     * @param pipeline - 渲染管线
     */
    setPipeline(pipeline: Pipeline): void {
        this.pipeline = pipeline;
    }

    /**
     * 准备材质进行渲染
     * @param pipeline - 渲染管线
     */
    abstract prepare(pipeline: Pipeline): void;

    /**
     * 应用材质到渲染管线
     */
    abstract apply(): void;

    /**
     * 更新材质（由具体实现类处理）
     */
    abstract update(): void;

    /**
     * 清理材质资源
     */
    abstract dispose(): void;

    /**
     * 检查材质是否已清理
     * @returns 是否已清理
     */
    isDisposed(): boolean {
        return this.isDisposed;
    }
}

/**
 * 基本材质类
 * 提供基本的着色器和Uniform管理
 */
export class BasicMaterial extends Material {
    constructor(renderer: Renderer, options?: any) {
        super(renderer);
        
        // 处理材质选项
        if (options) {
            // 设置uniforms
            if (options.uniforms) {
                Object.entries(options.uniforms).forEach(([name, value]) => {
                    this.setUniform(name, value);
                });
            }
            
            // 设置纹理
            if (options.textures) {
                Object.entries(options.textures).forEach(([index, textureInfo]) => {
                    this.setTexture(Number(index), textureInfo.texture, textureInfo.sampler);
                });
            }
        }
    }

    prepare(pipeline: Pipeline): void {
        if (this.pipeline === null) {
            this.pipeline = pipeline;
        }
    }

    apply(): void {
        if (this.pipeline === null) {
            throw new Error('Material pipeline not set');
        }

        // 应用Uniforms
        this.pipeline.setUniforms(this.uniforms);

        // 应用纹理
        this.textures.forEach(({ texture, sampler }, index) => {
            this.pipeline!.setTexture(index, texture, sampler);
        });
    }

    update(): void {
        // 基本材质默认不需要特殊更新
    }

    dispose(): void {
        if (this.isDisposed) return;
        
        // 清理采样器（纹理由渲染器管理）
        this.textures.forEach(({ sampler }) => {
            if (sampler && typeof sampler.dispose === 'function') {
                sampler.dispose();
            }
        });

        this.textures.clear();
        this.uniforms = {};
        this.pipeline = null;
        this.isDisposed = true;
    }
}
