/**
 * WebGPU纹理实现
 */

import { Texture } from '../Texture';
import type { Renderer } from '../Renderer';
import type { TextureOptions, SamplerOptions } from '../types';

export class WebGPUTexture extends Texture {
    private texture: GPUTexture | null = null;
    private view: GPUTextureView | null = null;
    private sampler: GPUSampler | null = null;

    constructor(renderer: Renderer, options: TextureOptions) {
        super(renderer, options);
        this.createTexture();
    }

    private createTexture(): void {
        const device = this.renderer.getContext() as GPUDevice;
        if (!device) {
            throw new Error('WebGPU device not available');
        }

        const gpuUsage = this.getGPUUsage();

        const textureDescriptor: GPUTextureDescriptor = {
            size: {
                width: this.width,
                height: this.height,
                depthOrArrayLayers: 1
            },
            format: this.format as GPUTextureFormat,
            usage: gpuUsage,
            mipLevelCount: this.options.mipmaps ? this.calculateMipLevels() : 1,
            sampleCount: 1,
            dimension: '2d',
            label: 'DxMyth WebGPU Texture'
        };

        this.texture = device.createTexture(textureDescriptor);
        this.view = this.texture.createView();

        // 创建默认采样器
        this.sampler = this.createDefaultSampler();
    }

    private getGPUUsage(): GPUTextureUsageFlags {
        let usage = 0;

        switch (this.usage) {
            case 'sampled':
                usage |= GPUTextureUsage.TEXTURE_BINDING;
                break;
            case 'render-target':
                usage |= GPUTextureUsage.RENDER_ATTACHMENT;
                break;
            case 'storage':
                usage |= GPUTextureUsage.STORAGE_BINDING;
                break;
            default:
                usage |= GPUTextureUsage.TEXTURE_BINDING;
        }

        if (this.options.mipmaps) {
            usage |= GPUTextureUsage.COPY_DST;
        }

        return usage;
    }

    private calculateMipLevels(): number {
        const maxDimension = Math.max(this.width, this.height);
        return Math.floor(Math.log2(maxDimension)) + 1;
    }

    private createDefaultSampler(): GPUSampler {
        const device = this.renderer.getContext() as GPUDevice;
        if (!device) {
            throw new Error('WebGPU device not available');
        }

        const samplerDescriptor: GPUSamplerDescriptor = {
            addressModeU: this.mapWrapMode(this.options.wrapS!),
            addressModeV: this.mapWrapMode(this.options.wrapT!),
            magFilter: this.mapFilter(this.options.magFilter!),
            minFilter: this.mapFilter(this.options.minFilter!),
            mipmapFilter: this.options.mipmaps ? 'linear' : 'nearest',
            maxAnisotropy: 1
        };

        return device.createSampler(samplerDescriptor);
    }

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

    private mapFilter(filter: string): GPUFilterMode {
        switch (filter) {
            case 'nearest':
                return 'nearest';
            case 'linear':
            default:
                return 'linear';
        }
    }

    update(data: ArrayBufferView, x: number = 0, y: number = 0, width?: number, height?: number): void {
        const device = this.renderer.getContext() as GPUDevice;
        if (!device || !this.texture) {
            throw new Error('WebGPU texture not available');
        }

        const uploadWidth = width || this.width;
        const uploadHeight = height || this.height;

        // 创建暂存缓冲
        const stagingBuffer = device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true
        });

        // 将数据复制到暂存缓冲
        new Uint8Array(stagingBuffer.getMappedRange()).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
        stagingBuffer.unmap();

        // 创建命令编码器
        const commandEncoder = device.createCommandEncoder();

        // 复制数据到纹理
        commandEncoder.copyBufferToTexture(
            {
                buffer: stagingBuffer,
                bytesPerRow: uploadWidth * this.getBytesPerPixel(),
                rowsPerImage: uploadHeight
            },
            {
                texture: this.texture,
                origin: { x, y, z: 0 },
            },
            {
                width: uploadWidth,
                height: uploadHeight,
                depthOrArrayLayers: 1
            }
        );

        // 提交命令
        device.queue.submit([commandEncoder.finish()]);

        // 清理暂存缓冲
        stagingBuffer.destroy();
    }

    private getBytesPerPixel(): number {
        switch (this.format) {
            case 'rgba8unorm':
            case 'rgba8snorm':
            case 'rgba8uint':
            case 'rgba8sint':
                return 4;
            case 'rgb8unorm':
            case 'rgb8snorm':
            case 'rgb8uint':
            case 'rgb8sint':
                return 3;
            case 'rgba16float':
            case 'rgba16unorm':
            case 'rgba16snorm':
            case 'rgba16uint':
            case 'rgba16sint':
                return 8;
            case 'rgba32float':
            case 'rgba32uint':
            case 'rgba32sint':
                return 16;
            case 'depth24plus':
            case 'depth24plus-stencil8':
                return 4;
            default:
                return 4;
        }
    }

    generateMipmaps(): void {
        const device = this.renderer.getContext() as GPUDevice;
        if (!device || !this.texture) {
            throw new Error('WebGPU texture not available');
        }

        // 创建命令编码器
        const commandEncoder = device.createCommandEncoder();

        // 生成MIP映射
        commandEncoder.generateMipmaps(this.texture);

        // 提交命令
        device.queue.submit([commandEncoder.finish()]);
    }

    createSampler(options?: SamplerOptions): GPUSampler {
        const device = this.renderer.getContext() as GPUDevice;
        if (!device) {
            throw new Error('WebGPU device not available');
        }

        const samplerOptions = {
            wrapS: this.options.wrapS,
            wrapT: this.options.wrapT,
            magFilter: this.options.magFilter,
            minFilter: this.options.minFilter,
            mipFilter: this.options.mipmaps ? 'linear' : 'nearest',
            anisotropy: 1,
            ...options
        };

        const samplerDescriptor: GPUSamplerDescriptor = {
            addressModeU: this.mapWrapMode(samplerOptions.wrapS!),
            addressModeV: this.mapWrapMode(samplerOptions.wrapT!),
            magFilter: this.mapFilter(samplerOptions.magFilter!),
            minFilter: this.mapFilter(samplerOptions.minFilter!),
            mipmapFilter: this.mapFilter(samplerOptions.mipFilter!),
            maxAnisotropy: samplerOptions.anisotropy || 1
        };

        return device.createSampler(samplerDescriptor);
    }

    getNativeTexture(): GPUTexture | GPUTextureView {
        return this.view || this.texture!;
    }

    getTextureView(): GPUTextureView {
        if (!this.view && this.texture) {
            this.view = this.texture.createView();
        }
        return this.view!;
    }

    getSampler(): GPUSampler {
        return this.sampler!;
    }

    dispose(): void {
        if (this.isDisposed) return;

        if (this.sampler) {
            this.sampler = null;
        }

        if (this.view) {
            this.view = null;
        }

        if (this.texture) {
            this.texture.destroy();
            this.texture = null;
        }

        this.isDisposed = true;
    }
}
