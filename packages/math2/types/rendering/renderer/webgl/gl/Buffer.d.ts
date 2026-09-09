export declare class AttributeBuffer {
    static id: number;
    gl: WebGL2RenderingContext;
    usage: number;
    buffer: WebGLBuffer;
    version: number;
    id: number;
    location: number;
    itemSize: number;
    constructor(gl: WebGL2RenderingContext);
    bind(): void;
    bufferData(data: Float32Array): void;
    bufferSubData(dstByteOffset: number, srcData: Float32Array, srcOffset: number): void;
    upload(): void;
    update(): void;
    destroy(): void;
}
export declare class IndexBuffer {
    static id: number;
    gl: WebGL2RenderingContext;
    usage: number;
    buffer: WebGLBuffer;
    version: number;
    initialized: boolean;
    id: number;
    constructor(gl: WebGL2RenderingContext);
    bind(): void;
    bufferData(data: Float32Array): void;
    bufferSubData(dstByteOffset: number, srcData: Float32Array, srcOffset: number): void;
    update(): void;
    destroy(): void;
}
