/// <reference types="@webgpu/types" />
import { AddressMode, BlendComponent, BlendFactor, BlendOperation, CompareFunction, FilterMode, PrimitiveTopology, ShaderStage, StencilFaceState, StencilOperation, TextureDimension, TextureFormat, TextureSampleType, TextureUsage, TextureView, VertexFormat } from '../gpu';
import { WebGPURenderPassOperations } from './model';
export declare function toGPUAddressMode(mode?: AddressMode): GPUAddressMode;
export declare function toGPUFilterMode(mode?: FilterMode): GPUFilterMode;
export declare function toGPUCompareFunction(func?: CompareFunction): GPUCompareFunction;
export declare function toGPUTextureDimension(dimension?: TextureDimension): GPUTextureDimension;
export declare function toGPUTextureViewDimension(dimension?: TextureDimension): GPUTextureViewDimension;
export declare function toGPUTextureFormat(format?: TextureFormat): GPUTextureFormat;
export declare function toGPUTextureUsageFlags(usage?: TextureUsage): GPUTextureUsageFlags;
export declare function toGPUTextureSampleType(type?: TextureSampleType): GPUTextureSampleType;
export declare function toGPUShaderStage(stage?: ShaderStage): GPUShaderStageFlags;
export declare function toGPUPrimitiveTopology(topology?: PrimitiveTopology): GPUPrimitiveTopology;
export declare function toGPUStencilOperation(op?: StencilOperation): GPUStencilOperation;
export declare function toGPUStencilFaceState(state?: StencilFaceState): GPUStencilFaceState;
export declare function toGPUBlendComponent(blend?: BlendComponent): GPUBlendComponent;
export declare function toGPUBlendFactor(factor?: BlendFactor): GPUBlendFactor | undefined;
export declare function toGPUBlendOperation(operation?: BlendOperation): GPUBlendOperation;
export declare function toGPUVertexFormat(format: VertexFormat): GPUVertexFormat;
export declare function toWebGPURenderPassOperations<T>(clearValue?: T): WebGPURenderPassOperations<T>;
export declare function toRenderableGPUTextureView(view?: TextureView | null, useMsaaTex?: boolean): GPUTextureView | undefined;
//# sourceMappingURL=utils.d.ts.map