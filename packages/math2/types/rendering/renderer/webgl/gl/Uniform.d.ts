export declare class Uniform {
    gl: WebGL2RenderingContext;
    name: string;
    type: Number;
    size: Number;
    location: WebGLUniformLocation;
    current: Float32Array;
    constructor(gl: WebGL2RenderingContext, options: {
        name: string;
        type: number;
        size: number;
        location: WebGLUniformLocation;
    });
    updateValue(value: Float32Array): void;
    setValue(value: Float32Array): void;
    getValue(): Float32Array<ArrayBufferLike>;
}
export declare class UniformVec2 extends Uniform {
    updateValue(value: Float32Array): void;
}
export declare class UniformVec3 extends Uniform {
    updateValue(value: Float32Array): void;
}
export declare class UniformMatrix3 extends Uniform {
    updateValue(value: Float32Array): void;
}
export declare function createUniform(gl: WebGLRenderingContext, type: number): UniformVec3;
