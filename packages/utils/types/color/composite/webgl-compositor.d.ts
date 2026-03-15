import { CompositeOperation } from './composite-types';
export declare class WebGLCompositor {
    private gl;
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    createCompositeProgram(operation: CompositeOperation): WebGLProgram;
    private createVertexShader;
    private createFragmentShader;
    private getBlendFunction;
    private compileShader;
}
