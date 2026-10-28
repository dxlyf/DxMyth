import { Matrix2D } from '../math/Matrix2D';
import { Mesh2D } from './geometry';
import { BlendMode, ImageSource, PaintColor, PaintSource } from './Paint';
import { GPU2DRenderer, GPU2DRendererOptions, Rect, UvRect } from './GPU2DRenderer';
/** TS 标准库不带 WebGPU 类型，这里只声明本文件用到的成员 */
export interface GPUBufferLike {
    destroy(): void;
}
export interface GPUTextureViewLike {
}
export interface GPUTextureLike {
    createView(): GPUTextureViewLike;
    destroy(): void;
}
export interface GPUSamplerLike {
}
export interface GPUShaderModuleLike {
}
export interface GPUBindGroupLayoutLike {
}
export interface GPUPipelineLayoutLike {
}
export interface GPURenderPipelineLike {
}
export interface GPUBindGroupLike {
}
export interface GPURenderPassEncoderLike {
    setPipeline(pipeline: GPURenderPipelineLike): void;
    setBindGroup(index: number, group: GPUBindGroupLike): void;
    setVertexBuffer(slot: number, buffer: GPUBufferLike): void;
    setIndexBuffer(buffer: GPUBufferLike, format: string): void;
    setStencilReference(reference: number): void;
    drawIndexed(indexCount: number, instanceCount?: number, firstIndex?: number): void;
    end(): void;
}
export interface GPUCommandEncoderLike {
    beginRenderPass(descriptor: unknown): GPURenderPassEncoderLike;
    finish(): unknown;
}
export interface GPUQueueLike {
    submit(commandBuffers: unknown[]): void;
    writeBuffer(buffer: GPUBufferLike, bufferOffset: number, data: ArrayBufferView): void;
    writeTexture(destination: unknown, data: ArrayBufferView, layout: unknown, size: unknown): void;
    copyExternalImageToTexture(source: {
        source: ImageSource;
    }, destination: {
        texture: GPUTextureLike;
    }, copySize: {
        width: number;
        height: number;
    }): void;
}
export interface GPUDeviceLike {
    readonly queue: GPUQueueLike;
    createShaderModule(descriptor: {
        code: string;
        label?: string;
    }): GPUShaderModuleLike;
    createBindGroupLayout(descriptor: unknown): GPUBindGroupLayoutLike;
    createPipelineLayout(descriptor: unknown): GPUPipelineLayoutLike;
    createRenderPipeline(descriptor: unknown): GPURenderPipelineLike;
    createBuffer(descriptor: {
        size: number;
        usage: number;
        label?: string;
    }): GPUBufferLike;
    createTexture(descriptor: unknown): GPUTextureLike;
    createSampler(descriptor: unknown): GPUSamplerLike;
    createBindGroup(descriptor: unknown): GPUBindGroupLike;
    createCommandEncoder(): GPUCommandEncoderLike;
    destroy(): void;
}
export interface WebGPURendererOptions extends GPU2DRendererOptions {
    /** 已创建的 GPUDevice；不传时请使用 `WebGPURenderer.create()` */
    device?: GPUDeviceLike;
    /** swap chain 格式，默认取 adapter 的推荐格式 */
    format?: string;
    /** 画布 alpha 模式，默认 premultiplied */
    alphaMode?: 'opaque' | 'premultiplied';
    label?: string;
}
export declare class WebGPURenderer extends GPU2DRenderer {
    /** 请求 adapter / device 后创建实例，避免把异步初始化塞进构造函数 */
    static create(canvas?: HTMLCanvasElement | OffscreenCanvas, options?: WebGPURendererOptions): Promise<WebGPURenderer>;
    private readonly _device;
    private readonly _context;
    private readonly _format;
    private readonly _alphaMode;
    private readonly _label;
    private readonly _shapeModule;
    private readonly _imageModule;
    private readonly _bindGroupLayout;
    private readonly _pipelineLayout;
    private readonly _pipelines;
    private readonly _uniformBuffer;
    private readonly _uniformData;
    private readonly _uniformInts;
    private readonly _samplerLinear;
    private readonly _samplerNearest;
    private _vertexBuffer;
    private _vertexCapacity;
    private _indexBuffer;
    private _indexCapacity;
    private _depthTexture;
    private _depthView;
    private _quadPositions;
    private _pass;
    private _encoder;
    private readonly _textures;
    private readonly _textureSet;
    private _whiteTexture;
    constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options?: WebGPURendererOptions);
    get device(): GPUDeviceLike;
    get format(): string;
    protected onResize(): void;
    protected onClear(color: PaintColor | null): void;
    protected onClearRectDevice(x: number, y: number, width: number, height: number): void;
    protected submitMesh(mesh: Mesh2D, matrix: Matrix2D, source: PaintSource, opacity: number, blend: BlendMode): void;
    protected submitImage(image: ImageSource, matrix: Matrix2D, dst: Rect, uv: UvRect, opacity: number, blend: BlendMode, smoothing: boolean): void;
    protected beginClip(mesh: Mesh2D, matrix: Matrix2D, level: number): void;
    protected endClip(from: number, to: number): void;
    protected onFlush(): void;
    protected onDispose(): void;
    private _drawShape;
    private _draw;
    private _ensurePass;
    private _endPass;
    private _uploadVertices;
    private _uploadIndices;
    private _bindGroup;
    private _createWhiteTexture;
    private _texture;
    /** 只写 resolution / opacity，供 image 管线复用同一块 uniform 缓冲 */
    private _writeCommonUniforms;
    /**
     * shape uniform 布局（float 偏移）：
     *   0  resolution  | 2 opacity | 3 kind
     *   4  params0     | 8 params1
     *  12  stopColors[8]
     *  44  stopA       | 48 stopB
     *  52  pattern（三列 vec3，每列补 16 字节）
     *  64  texSize     | 66 repeatMode | 67 stopCount
     */
    private _writeShapeUniforms;
    private _pipeline;
    private _depthStencil;
    private _blendDescriptor;
    /** 画布按预乘 alpha 合成，shader 输出的源色已乘过 alpha，源因子里的 alpha 项换成 one */
    private _premultiplySource;
    private _factor;
}
