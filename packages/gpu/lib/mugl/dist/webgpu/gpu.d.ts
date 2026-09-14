/// <reference types="@webgpu/types" />
import { Canvas } from '../dom';
import { BindGroup, BindGroupDescriptor, BindGroupLayout, BindGroupLayoutDescriptor, Buffer, BufferDescriptor, Color, Device, Extent2D, Extent3D, Future, ImageCopyExternalImage, ImageCopyTexture, ImageDataLayout, RenderPass, RenderPassDescriptor, RenderPipeline, RenderPipelineDescriptor, Sampler, SamplerDescriptor, Shader, ShaderDescriptor, Texture, TextureDescriptor, UInt, UIntArray } from '../gpu';
import { WebGPUCanvasContextProvider, WebGPUCanvasOptions, WebGPUFeature } from './type';
/**
 * Requests a WebGPU {@link Device}.
 * @param canvas the canvas to be used
 * @param options WebGPU context initialization options
 * @param features WebGPU features to enable
 * @returns future to WebGPU device instance, or null if WebGPU is not supported
 */
export declare function requestWebGPUDevice(canvas: Canvas | WebGPUCanvasContextProvider, options?: GPURequestAdapterOptions & WebGPUCanvasOptions, features?: WebGPUFeature): Future<Device | null>;
/**
 * Resets the device state.
 * @param device the GPU device
 */
export declare function resetDevice(device: Device): void;
/**
 * Gets the enabled features of the device.
 * @param device the GPU device
 * @returns enabled features bitflag
 */
export declare function getDeviceFeatures(device: Device): WebGPUFeature;
/**
 * Returns if device context is lost.
 * @param device the GPU device
 * @returns true if device context is lost
 */
export declare function isDeviceLost(device: Device): boolean;
/**
 * Flushes the command buffer.
 * @param device the GPU device
 */
export declare function flush(device: Device): void;
/**
 * Creates a new buffer object.
 * @param device the GPU device
 * @param desc the buffer descriptor
 * @returns new buffer object
 */
export declare function createBuffer(device: Device, desc: BufferDescriptor): Buffer;
/**
 * Creates a new texture object.
 * @param device the GPU device
 * @param desc the texture descriptor
 * @returns new texture object
 */
export declare function createTexture(device: Device, desc: TextureDescriptor): Texture;
/**
 * Creates a new texture object from a canvas surface.
 * @param device the GPU device
 * @param canvas the canvas to be used. Defaults to the device default canvas.
 * @param options configurations for the canvas surface
 * @returns new texture object
 */
export declare function createSurfaceTexture(device: Device, canvas?: Canvas | WebGPUCanvasContextProvider, options?: WebGPUCanvasOptions): Texture;
/**
 * Creates a new depth-stencil texture object from a canvas surface.
 * @param device the GPU device
 * @param canvas the canvas to be used. Defaults to the device default canvas.
 * @param options configurations for the canvas surface
 * @returns new texture object
 */
export declare function createSurfaceDepthTexture(device: Device, canvas?: Canvas | WebGPUCanvasContextProvider, options?: WebGPUCanvasOptions): Texture;
/**
 * Creates a new sampler object.
 * @param device the GPU device
 * @param desc the sampler descriptor
 * @returns new sampler object
 */
export declare function createSampler(device: Device, desc?: SamplerDescriptor): Sampler;
/**
 * Creates a new shader module object.
 * @param device the GPU device
 * @param desc the shader descriptor
 * @returns new shader object
 */
export declare function createShader(device: Device, desc: ShaderDescriptor): Shader;
/**
 * Creates a new pipeline bind group layout object.
 * @param device the GPU device
 * @param desc the bind group layout descriptor
 * @returns new bind group layout object
 */
export declare function createBindGroupLayout(device: Device, desc: BindGroupLayoutDescriptor): BindGroupLayout;
/**
 * Creates a new pipeline bind group object.
 * @param device the GPU device
 * @param desc the bind group descriptor
 * @returns new bind group object
 */
export declare function createBindGroup(device: Device, desc: BindGroupDescriptor): BindGroup;
/**
 * Creates a new render pass object.
 * @param device the GPU device
 * @param desc the render pass descriptor.
 * @returns new render pass
 */
export declare function createRenderPass(device: Device, desc?: RenderPassDescriptor): RenderPass;
/**
 * Creates a new render pipeline state object.
 * @param device the GPU device
 * @param desc the pipeline descriptor
 * @returns new render pipeline object
 */
export declare function createRenderPipeline(device: Device, desc: RenderPipelineDescriptor): RenderPipeline;
/**
 * Reads data from a buffer.
 * @param device the GPU device
 * @param buffer the GPU buffer to read from
 * @param out the output CPU buffer
 * @param offset othe byte offset into GPU buffer to begin reading from. Defaults to 0
 * @returns a {@link Future}
 */
export declare function readBuffer(device: Device, buffer: Buffer, out?: Uint8Array, offset?: UInt): Future<Uint8Array>;
/**
 * Writes data to a buffer.
 * @param device the GPU device
 * @param buffer the buffer to write to
 * @param data the buffer data
 * @param offset the byte offset into GPU buffer to begin writing to. Defaults to 0
 */
export declare function writeBuffer(device: Device, buffer: Buffer, data: ArrayBufferView, offset?: UInt): void;
/**
 * Writes subregion of data array to a texture.
 * @param device the GPU device
 * @param texture the texture subregion to write to.
 * @param data the texture data
 * @param layout the data layout
 * @param size the size of the data subregion to write
 */
export declare function writeTexture(device: Device, texture: ImageCopyTexture, data: ArrayBufferView, layout: ImageDataLayout, size?: Extent3D): void;
/**
 * Uploads an image subregion to a texture.
 * @param device the GPU device
 * @param src the image subregion to write
 * @param dst the texture subregion to write to.
 * @param size the size of image subregion to write
 */
export declare function copyExternalImageToTexture(device: Device, src: ImageCopyExternalImage, dst: ImageCopyTexture, size?: Extent2D): void;
/**
 * Copies data from a buffer to another buffer.
 * @param device the GPU device
 * @param src the buffer to read from
 * @param dst the buffer to write to
 * @param size the byte size of the GPU buffer to read. Defaults to the whole buffer
 * @param srcOffset the byte offset into src buffer to begin reading from. Defaults to 0
 * @param dstOffset the byte offset into dst buffer to begin writing to. Defaults to 0
 */
export declare function copyBuffer(device: Device, src: Buffer, dst: Buffer, size?: UInt, srcOffset?: UInt, dstOffset?: UInt): void;
/**
 * Copies subregion of a texture to another texture.
 * @param device the GPU device
 * @param src the texture subregion to read from.
 * @param dst the texture subregion to write to.
 * @param size the size of the texture subregion to copy
 */
export declare function copyTexture(device: Device, src: ImageCopyTexture, dst: ImageCopyTexture, size?: Extent3D): void;
/**
 * Copies subregion of a texture to a buffer.
 * @param device the GPU device
 * @param src the texture subregion to read from.
 * @param dst the buffer to write to
 * @param layout the buffer data layout to use for storing the texture
 * @param size the size of the texture subregion to copy
 */
export declare function copyTextureToBuffer(device: Device, src: ImageCopyTexture, dst: Buffer, layout: ImageDataLayout, size?: Extent3D): void;
/**
 * Starts a render pass.
 * @param device the GPU device
 * @param pass the render pass
 */
export declare function beginRenderPass(device: Device, pass?: RenderPass): void;
/**
 * Submits the current render pass.
 * @param device the GPU device
 * @param flush true to flush the command buffer
 */
export declare function submitRenderPass(device: Device, flush?: boolean): void;
/**
 * Binds a RenderPipeline to the current render pass.
 * @param device the GPU device
 * @param pipeline the pipeline to bind
 */
export declare function setRenderPipeline(device: Device, pipeline: RenderPipeline): void;
/**
 * Binds an index buffer to the current render pass.
 * @param device the GPU device
 * @param buffer the buffer to bind
 */
export declare function setIndex(device: Device, buffer: Buffer): void;
/**
 * Binds a vertex buffer to a slot in the current render pass.
 * @param device the GPU device
 * @param slot the vertex slot to bind to
 * @param buffer the buffer to bind
 */
export declare function setVertex(device: Device, slot: number, buffer: Buffer, offset?: UInt): void;
/**
 * Binds a bind group to the current render pass.
 * @param device the GPU device
 * @param slot the bind group slot to bind to
 * @param bindGroup the bind group to use
 * @param offsets the dynamic offsets for dynamic buffers in this bind group
 */
export declare function setBindGroup(device: Device, slot: UInt, bindGroup: BindGroup, offsets?: UIntArray): void;
/**
 * Submits a draw call in the current render pass.
 * @param device the GPU device
 * @param vertexCount the number of vertices to draw
 * @param instanceCount the number of instances to draw. Defaults to 1
 * @param firstVertex the offset to the first vertex to draw. Defaults to 0
 * @param firstInstance the offset to the first instance to draw. Defaults to 0
 */
export declare function draw(device: Device, vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
/**
 * Submits an indexed draw call in the current render pass.
 * @param device the GPU device
 * @param indexCount the number of vertices to draw
 * @param instanceCount the number of instances to draw. Defaults to 1
 * @param firstIndex the offset to the first vertex to draw. Defaults to 0
 * @param firstInstance the offset to the first instance to draw. Defaults to 0
 * @param baseVertex the offset added to each index value before indexing into the vertex buffers. Defaults to 0
 */
export declare function drawIndexed(device: Device, indexCount: number, instanceCount?: number, firstIndex?: number, firstInstance?: number, baseVertex?: number): void;
/**
 * Sets the 3D viewport area for the current render pass.
 * @param device the GPU device
 * @param x x offset
 * @param y y offset
 * @param width width
 * @param height height
 * @param minDepth min depth. Defaults to 0
 * @param maxDepth max depth. Defaults to 1
 */
export declare function setViewport(device: Device, x: number, y: number, width: number, height: number, minDepth?: number, maxDepth?: number): void;
/**
 * Sets the scissor rectangle for the current render pass.
 * @param device the GPU device
 * @param x x offset
 * @param y y offset
 * @param width width
 * @param height height
 */
export declare function setScissorRect(device: Device, x: number, y: number, width: number, height: number): void;
/**
 * Sets the blend-constant color for the current render pass.
 * @param device the GPU device
 * @param color the blend color
 */
export declare function setBlendConst(device: Device, color: Color): void;
/**
 * Sets the stencil reference value for the current render pass.
 * @param device the GPU device
 * @param ref the stencil reference value.
 */
export declare function setStencilRef(device: Device, ref: UInt): void;
//# sourceMappingURL=gpu.d.ts.map