/**
 * @dxyl/backend —— WebGL 1、WebGL 2 与 WebGPU 的高级封装库。
 *
 * 公共入口。低层后端类将在实现后从
 * `@dxyl/backend/webgl`、`@dxyl/backend/webgl2`、`@dxyl/backend/webgpu`
 * 子路径导出。
 */
export * from './core/index';
export { createBackend, resolveBackendOrder, type CreateBackendOptions } from './backends/index';
export * from './unified/index';

/** 包版本号，构建时由 Vite `define` 注入。 */
export const VERSION: string = '0.0.0';
