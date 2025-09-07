import {createWebGLProgram} from '../utils'


const vertexShaderSource=`#version 300 es
in vec2 position;
uniform mat3 projectionMatrix;
uniform mat3 matrix;
void main(){
    vec3 pos=projectionMatrix*matrix*vec3(position,1);
    gl_Position=vec4(pos,1);
}
`
const fragmentShaderSource=`#version 300 es
perecision mediump float;
out vec4 fragColor;
uniform vec4 color;
void main(){
    fragColor=color;
}
`


function initProgram(gl:WebGL2RenderingContext){
    const program=createWebGLProgram(gl,vertexShaderSource,fragmentShaderSource)
    return {
        program,
        uniforms:{},
        attributes:{}
    }
}