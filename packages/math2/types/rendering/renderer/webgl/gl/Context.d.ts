import { AttributeBuffer, IndexBuffer } from './Buffer';
export declare class GLContext {
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext);
    createProgram(): WebGLProgram;
    createShader(type: number, source: string): WebGLShader;
    createVertexShader(source: string): WebGLShader;
    createFragmentShader(source: string): WebGLShader;
    compileProgram(program: WebGLProgram, vertex: string, fragment: string): void;
    useProgram(program: WebGLProgram): void;
    createBuffer(): WebGLBuffer;
    createVertexBuffer(): AttributeBuffer;
    createIndexBuffer(): IndexBuffer;
    createVao(): WebGLVertexArrayObject;
    enableVertexAttribArray(location: number): void;
    vertexAttribPointer(location: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
}
