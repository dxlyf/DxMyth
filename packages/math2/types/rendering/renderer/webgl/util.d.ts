type GLContext = WebGL2RenderingContext;
export declare function createWebGLShader(gl: GLContext, source: string, type: number): WebGLShader;
export declare function createWebGLProgram(gl: GLContext, vertexSource: string, fragmentSource: string): WebGLProgram;
type AttributeActiveInfo = {
    name: string;
    type: number;
    size: number;
    location: number;
};
type UnifromActiveInfo = {
    name: string;
    type?: number;
    size?: number;
    location?: WebGLUniformLocation | null;
};
type UnifromBlockActiveInfo = {
    name: string;
    type: number;
    size: number;
    blockIndexx: number;
    bindingIndex: number;
    offset?: number;
    blocks: Omit<UnifromBlockActiveInfo, 'blocks'>[];
};
export declare function getWebGLActiveAttributes(gl: GLContext, program: WebGLProgram): Map<string, AttributeActiveInfo>;
export declare function getWebGLActiveUniforms(gl: GLContext, program: WebGLProgram): Map<string, UnifromActiveInfo>;
export declare function getWebGLActiveUniformBlocks(gl: GLContext, program: WebGLProgram): Map<string, UnifromBlockActiveInfo>;
export {};
