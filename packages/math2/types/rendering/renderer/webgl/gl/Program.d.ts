import { GLContext } from './Context';
type GLProgramOptions = {
    vert: string;
    frag: string;
};
export declare class GLProgram {
    gl: GLContext;
    program: WebGLProgram;
    options: GLProgramOptions;
    constructor(gl: GLContext, options: GLProgramOptions);
}
export {};
