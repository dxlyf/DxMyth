/**
 * 纹理抽象类
 * 统一WebGL和WebGPU的纹理接口
 */

import type { TextureOptions, SamplerOptions } from './types';
import type { Renderer } from './Renderer';

export abstract class Texture {
    protected renderer: Renderer;
    protected options: TextureOptions;
    protected width: number;
    protected height: number;
    protected format: string;
    protected usage: string;
    protected isDisposed: boolean = false;

    constructor(renderer: Renderer, options: TextureOptions) {
        this.renderer = renderer;
        this.options = {
            format: 'rgba8unorm',
            wrapS: 'clamp',
            wrapT: 'clamp',
            minFilter: 'linear',
            magFilter: 'linear',
            mipmaps: true,
            usage: 'sampled',
            ...options
        };
        this.width = options.width;
        this.height = options.height;
        this.format = this.options.format!;
        this.usage = this.options.usage!;
    }

    /**
     * 获取纹理宽度
     * @returns 纹理宽度
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * 获取纹理高度
     * @returns 纹理高度
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * 获取纹理格式
     * @returns 纹理格式
     */
    getFormat(): string {
        return this.format;
    }

    /**
     * 获取纹理使用方式
     * @returns 纹理使用方式
     */
    getUsage(): string {
        return this.usage;
    }

    /**
     * 更新纹理数据
     * @param data - 纹理数据
     * @param x - X偏移
     * @param y - Y偏移
     * @param width - 宽度
     * @param height - 高度
     */
    abstract update(data: ArrayBufferView, x?: number, y?: number, width?: number, height?: number): void;

    /**
     * 生成MIP映射
     */
    abstract generateMipmaps(): void;

    /**
     * 创建采样器
     * @param options - 采样器选项
     * @returns 采样器对象
     */
    abstract createSampler(options?: SamplerOptions): any;

    /**
     * 获取底层API纹理对象
     * @returns 底层纹理对象
     */
    abstract getNativeTexture(): any;

    /**
     * 清理纹理资源
     */
    abstract dispose(): void;

    /**
     * 检查纹理是否已清理
     * @returns 是否已清理
     */
    isDisposed(): boolean {
        return this.isDisposed;
    }
}

/**
 * 从图片创建纹理
 * @param renderer - 渲染器
 * @param image - 图片元素
 * @param options - 纹理选项
 * @returns 纹理对象
 */
export async function createTextureFromImage(renderer: Renderer, image: HTMLImageElement | ImageBitmap, options?: Partial<TextureOptions>): Promise<Texture> {
    const textureOptions: TextureOptions = {
        width: image.width,
        height: image.height,
        mipmaps: true,
        ...options
    };

    const texture = renderer.createTexture(textureOptions);
    texture.update(new Uint8ClampedArray(image.width * image.height * 4), 0, 0, image.width, image.height);
    texture.generateMipmaps();

    return texture;
}

/**
 * 从URL加载纹理
 * @param renderer - 渲染器
 * @param url - 图片URL
 * @param options - 纹理选项
 * @returns 纹理对象
 */
export async function loadTexture(renderer: Renderer, url: string, options?: Partial<TextureOptions>): Promise<Texture> {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    
    const promise = new Promise<Texture>((resolve, reject) => {
        image.onload = () => {
            createTextureFromImage(renderer, image, options)
                .then(resolve)
                .catch(reject);
        };
        image.onerror = () => {
            reject(new Error(`Failed to load texture: ${url}`));
        };
    });

    image.src = url;
    return promise;
}
