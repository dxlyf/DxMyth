type Percision = 'highp' | 'mediump' | 'lowp';
type WebglProgramWrapperConfig = {
    vert: string;
    frag: string;
    percision: Percision;
    version: number;
};
export declare class WebglProgramWrapper {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    config: WebglProgramWrapperConfig;
    constructor(gl: WebGL2RenderingContext, config: WebglProgramWrapperConfig);
    vertextShaderSource(): string;
}
export {};
