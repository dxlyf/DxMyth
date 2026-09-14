/// <reference types="@webgpu/types" />
import { TextureFormat, UInt } from '../gpu';
/**
 * Interface for a provider of GPUCanvasContext.
 * Useful for non-Web environments where HTML Canvas element does not exist.
 */
export interface WebGPUCanvasContextProvider {
    /**
     * Gets a WebGLRenderingContext.
     *
     * @param type context type. Must be 'webgpu'
     * @returns a GPUCanvasContext, or null if unsupported.
     */
    getContext(type: 'webgpu'): GPUCanvasContext | null;
    /**
     * @returns the canvas width.
     */
    get width(): UInt;
    /**
     * @returns the canvas height.
     */
    get height(): UInt;
}
/**
 * Options for configuring a canvas surface for WebGPU.
 */
export interface WebGPUCanvasOptions {
    /** Determines if premultiplied alpha will be used for surface texture, or opaque color. Defaults to false. */
    premultipliedAlpha?: boolean;
    /** The default surface depth-stencil texture format. Defaults to no depth-stencil texture. */
    depthStencilFormat?: TextureFormat;
    /** The number of samples for MSAA render targets. Defaults to 1. */
    sampleCount?: UInt;
}
/**
 * Supported WebGPU features.
 */
export declare enum WebGPUFeature {
    /** depth32float-stencil8 */
    Depth32FStencil8 = 1,
    /** shader-f16 */
    ShaderF16 = 2,
    /** rg11b10ufloat-renderable */
    RG11B10FRenderable = 4,
    /** float32-filterable */
    F32Filterable = 8
}
export declare const WebGPUFeatureNames: Record<WebGPUFeature, GPUFeatureName>;
//# sourceMappingURL=type.d.ts.map