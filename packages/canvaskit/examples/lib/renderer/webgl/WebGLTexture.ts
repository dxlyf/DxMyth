/**
 * WebGL纹理实现
 * 支持WebGL 1.0和WebGL 2.0
 */

import { Texture } from '../Texture';
import { WebGLRenderer } from './WebGLRenderer';
import type { TextureOptions } from '../types';

export class WebGLTexture extends Texture {
    private renderer: WebGLRenderer;
    private gl: WebGLRenderingContext | WebGL2RenderingContext;
    private isWebGL2: boolean;
    private texture: WebGLTexture;
    private framebuffer: WebGLFramebuffer | null = null;
    private depthStencilBuffer: WebGLRenderbuffer | null = null;
    private sampler: WebGLSampler | null = null;
    private isRenderTarget: boolean = false;

    constructor(renderer: WebGLRenderer, options: TextureOptions) {
        super(renderer, options);
        this.renderer = renderer;
        this.gl = renderer.getContext();
        this.isWebGL2 = (this.gl instanceof WebGL2RenderingContext);
        this.isRenderTarget = options.usage?.includes('render-target') || false;
        this.texture = this.createTexture();

        // 如果是渲染目标，创建帧缓冲
        if (this.isRenderTarget) {
            this.createFramebuffer();
        }
    }

    private createTexture(): WebGLTexture {
        const gl = this.gl;
        const texture = gl.createTexture();
        if (!texture) {
            throw new Error('Failed to create WebGL texture');
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);

        // 设置默认采样参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.mapWrapMode(this.options.wrapS || 'clamp'));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.mapWrapMode(this.options.wrapT || 'clamp'));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.mapFilter(this.options.magFilter || 'linear'));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.mapFilter(this.options.minFilter || 'linear'));

        // 如果有数据，上传数据
        if (this.options.data) {
            this.uploadData(this.options.data);
        } else {
            // 创建空纹理
            const format = this.mapFormat(this.options.format || 'rgba8unorm');
            gl.texImage2D(
                gl.TEXTURE_2D, 
                0, 
                format.internal, 
                this.width, 
                this.height, 
                0, 
                format.format, 
                format.type, 
                null
            );
        }

        // 生成MIP映射（如果需要）
        if (this.options.generateMipmaps) {
            this.generateMipmaps();
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    private uploadData(data: ArrayBufferView): void {
        const gl = this.gl;
        const format = this.mapFormat(this.options.format || 'rgba8unorm');

        gl.texImage2D(
            gl.TEXTURE_2D, 
            0, 
            format.internal, 
            this.width, 
            this.height, 
            0, 
            format.format, 
            format.type, 
            data
        );
    }

    private createFramebuffer(): void {
        const gl = this.gl;
        const framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            return;
        }

        this.framebuffer = framebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        // 附加颜色附件
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, 
            gl.COLOR_ATTACHMENT0, 
            gl.TEXTURE_2D, 
            this.texture, 
            0
        );

        // 如果需要深度和模板缓冲
        if (this.options.depthStencil) {
            const depthStencilBuffer = gl.createRenderbuffer();
            if (depthStencilBuffer) {
                this.depthStencilBuffer = depthStencilBuffer;
                gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
                gl.renderbufferStorage(
                    gl.RENDERBUFFER, 
                    this.isWebGL2 ? gl.DEPTH24_STENCIL8 : gl.DEPTH_COMPONENT16, 
                    this.width, 
                    this.height
                );
                gl.framebufferRenderbuffer(
                    gl.FRAMEBUFFER, 
                    gl.DEPTH_ATTACHMENT, 
                    gl.RENDERBUFFER, 
                    depthStencilBuffer
                );
                if (this.isWebGL2) {
                    gl.framebufferRenderbuffer(
                        gl.FRAMEBUFFER, 
                        gl.STENCIL_ATTACHMENT, 
                        gl.RENDERBUFFER, 
                        depthStencilBuffer
                    );
                }
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            }
        }

        // 检查帧缓冲完整性
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.error('Framebuffer is not complete:', status);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    update(data: ArrayBufferView, x: number = 0, y: number = 0, width?: number, height?: number): void {
        const gl = this.gl;
        const format = this.mapFormat(this.options.format || 'rgba8unorm');

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texSubImage2D(
            gl.TEXTURE_2D, 
            0, 
            x, 
            y, 
            width || this.width, 
            height || this.height, 
            format.format, 
            format.type, 
            data
        );

        // 如果需要，更新MIP映射
        if (this.options.generateMipmaps) {
            this.generateMipmaps();
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    generateMipmaps(): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind(unit: number = 0): void {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // WebGL 2.0支持独立采样器
        if (this.isWebGL2 && this.sampler) {
            const webgl2 = gl as WebGL2RenderingContext;
            webgl2.bindSampler(unit, this.sampler);
        }
    }

    unbind(unit: number = 0): void {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);

        if (this.isWebGL2) {
            const webgl2 = gl as WebGL2RenderingContext;
            webgl2.bindSampler(unit, null);
        }
    }

    resize(width: number, height: number): void {
        if (this.width === width && this.height === height) {
            return;
        }

        this.width = width;
        this.height = height;

        // 重新创建纹理数据
        const gl = this.gl;
        const format = this.mapFormat(this.options.format || 'rgba8unorm');

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 
            0, 
            format.internal, 
            width, 
            height, 
            0, 
            format.format, 
            format.type, 
            null
        );

        if (this.options.generateMipmaps) {
            this.generateMipmaps();
        }

        gl.bindTexture(gl.TEXTURE_2D, null);

        // 如果是渲染目标，重新创建帧缓冲
        if (this.isRenderTarget) {
            this.destroyFramebuffer();
            this.createFramebuffer();
        }
    }

    getFramebuffer(): WebGLFramebuffer | null {
        return this.framebuffer;
    }

    getTexture(): WebGLTexture {
        return this.texture;
    }

    getSampler(): WebGLSampler | null {
        return this.sampler;
    }

    isReady(): boolean {
        return true; // WebGL纹理创建后立即就绪
    }

    dispose(): void {
        if (this.disposed) {
            return;
        }

        const gl = this.gl;
        
        // 销毁帧缓冲
        this.destroyFramebuffer();

        // 销毁纹理
        gl.deleteTexture(this.texture);

        // 销毁采样器
        if (this.sampler && this.isWebGL2) {
            const webgl2 = gl as WebGL2RenderingContext;
            webgl2.deleteSampler(this.sampler);
        }

        this.disposed = true;
    }

    private destroyFramebuffer(): void {
        const gl = this.gl;

        if (this.depthStencilBuffer) {
            gl.deleteRenderbuffer(this.depthStencilBuffer);
            this.depthStencilBuffer = null;
        }

        if (this.framebuffer) {
            gl.deleteFramebuffer(this.framebuffer);
            this.framebuffer = null;
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
            case 'mirror-clamp':
                return this.isWebGL2 ? (this.gl as WebGL2RenderingContext).MIRROR_CLAMP_TO_EDGE : gl.CLAMP_TO_EDGE;
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
            case 'nearest-mipmap-nearest':
                return gl.NEAREST_MIPMAP_NEAREST;
            case 'linear-mipmap-nearest':
                return gl.LINEAR_MIPMAP_NEAREST;
            case 'nearest-mipmap-linear':
                return gl.NEAREST_MIPMAP_LINEAR;
            case 'linear-mipmap-linear':
                return gl.LINEAR_MIPMAP_LINEAR;
            default:
                return gl.LINEAR;
        }
    }

    private mapFormat(format: string): { internal: number; format: number; type: number } {
        const gl = this.gl;
        const webgl2 = this.isWebGL2 ? (gl as WebGL2RenderingContext) : null;

        switch (format) {
            case 'r8unorm':
                if (webgl2) {
                    return { internal: webgl2.R8, format: gl.RED, type: gl.UNSIGNED_BYTE };
                }
                return { internal: gl.LUMINANCE, format: gl.LUMINANCE, type: gl.UNSIGNED_BYTE };
            case 'rg8unorm':
                if (webgl2) {
                    return { internal: webgl2.RG8, format: webgl2.RG, type: gl.UNSIGNED_BYTE };
                }
                return { internal: gl.LUMINANCE_ALPHA, format: gl.LUMINANCE_ALPHA, type: gl.UNSIGNED_BYTE };
            case 'rgba8unorm':
                return { internal: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
            case 'r16f':
                if (webgl2) {
                    return { internal: webgl2.R16F, format: gl.RED, type: webgl2.HALF_FLOAT };
                }
                return { internal: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
            case 'rg16f':
                if (webgl2) {
                    return { internal: webgl2.RG16F, format: webgl2.RG, type: webgl2.HALF_FLOAT };
                }
                return { internal: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
            case 'rgba16f':
                if (webgl2) {
                    return { internal: webgl2.RGBA16F, format: gl.RGBA, type: webgl2.HALF_FLOAT };
                }
                return { internal: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
            case 'rgba32f':
                if (webgl2) {
                    return { internal: webgl2.RGBA32F, format: gl.RGBA, type: gl.FLOAT };
                }
                return { internal: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
            case 'depth32f':
                if (webgl2) {
                    return { internal: webgl2.DEPTH_COMPONENT32F, format: gl.DEPTH_COMPONENT, type: gl.FLOAT };
                }
                return { internal: gl.DEPTH_COMPONENT16, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_SHORT };
            case 'depth24stencil8':
                if (webgl2) {
                    return { internal: webgl2.DEPTH24_STENCIL8, format: webgl2.DEPTH_STENCIL, type: webgl2.UNSIGNED_INT_24_8 };
                }
                return { internal: gl.DEPTH_COMPONENT16, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_SHORT };
            default:
                return { internal: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
        }
    }
}
