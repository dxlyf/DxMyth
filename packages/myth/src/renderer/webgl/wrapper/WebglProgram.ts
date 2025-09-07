import {createWebGLProgram} from '../utils'
type Percision='highp'|'mediump'|'lowp'
type WebglProgramWrapperConfig={
    vert:string,
    frag:string
    percision:Percision
    version:number // 300 es or 100 es
}
enum ShaderType{
    VERTEX=0x8B31,
    FRAGMENT=0x8B30
}
export class WebglProgramWrapper{
    gl:WebGL2RenderingContext
    program:WebGLProgram
    config:WebglProgramWrapperConfig
    constructor(gl:WebGL2RenderingContext,config:WebglProgramWrapperConfig){
        this.config=config;
        this.gl=gl;
        this.program=createWebGLProgram(gl,config.vert,config.frag)
    }
    get 
    vertextShaderSource(){
        return `version ${this.config.version} es

            attribute vec4 a_position;
            void main(){
                gl_Position=a_position;
            }
        `
    }

}