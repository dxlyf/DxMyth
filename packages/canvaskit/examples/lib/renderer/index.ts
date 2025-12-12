/**
 * 渲染器系统入口
 */

export { Renderer } from './Renderer';
export { Texture } from './Texture';
export { Pipeline } from './Pipeline';
export { Material, BasicMaterial } from './Material';
export { Geometry } from './Geometry';

export { WebGPURenderer } from './webgpu/WebGPURenderer';
export { WebGPUTexture } from './webgpu/WebGPUTexture';
export { WebGPUPipeline } from './webgpu/WebGPUPipeline';

export { WebGLRenderer } from './webgl/WebGLRenderer';
export { WebGLTexture } from './webgl/WebGLTexture';
export { WebGLPipeline } from './webgl/WebGLPipeline';

export * from './types';
export * from './Debug';

import { WebGPURenderer } from './webgpu/WebGPURenderer';
import { WebGLRenderer } from './webgl/WebGLRenderer';
import type { Renderer } from './Renderer';
import type { RendererOptions } from './types';

/**
 * 创建渲染器实例
 * @param canvas - Canvas元素
 * @param options - 渲染器配置选项
 * @returns 渲染器实例
 */
export function createRenderer(canvas: HTMLCanvasElement, options?: RendererOptions): Renderer {
    // 优先使用WebGPU，如果不支持则回退到WebGL
    if (navigator.gpu && options?.preferWebGPU !== false) {
        return new WebGPURenderer(canvas, options);
    } else {
        return new WebGLRenderer(canvas, options);
    }
}
