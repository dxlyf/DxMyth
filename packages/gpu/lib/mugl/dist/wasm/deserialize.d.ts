/// <reference types="@webgpu/types" />
import { Num } from '../gpu';
import { WebGPUCanvasOptions } from '../webgpu';
export declare const UTF8_DECODER: TextDecoder;
export declare function dataView(mem: WebAssembly.Memory): DataView;
export declare function decodeStr(mem: WebAssembly.Memory, ptr: number, len: number): string;
export declare function toWebGLContextAttributes(flags: Num): WebGLContextAttributes;
export declare function toWebGPUContextAttributes(flags: Num): GPURequestAdapterOptions & WebGPUCanvasOptions;
//# sourceMappingURL=deserialize.d.ts.map