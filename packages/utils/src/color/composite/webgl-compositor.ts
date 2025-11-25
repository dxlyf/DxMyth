// webgl-compositor.ts
import { CompositeOperation } from './composite-types';

export class WebGLCompositor {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
  }

  createCompositeProgram(operation: CompositeOperation): WebGLProgram {
    const gl = this.gl;
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create WebGL program');

    const vertexShader = this.createVertexShader(gl);
    const fragmentShader = this.createFragmentShader(gl, operation);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Failed to link composite program: ' + gl.getProgramInfoLog(program));
    }

    return program;
  }

  private createVertexShader(gl: WebGLRenderingContext | WebGL2RenderingContext): WebGLShader {
    const source = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;
    
    return this.compileShader(gl, gl.VERTEX_SHADER, source);
  }

  private createFragmentShader(gl: WebGLRenderingContext | WebGL2RenderingContext, operation: CompositeOperation): WebGLShader {
    const blendFunctions = this.getBlendFunction(operation);
    
    const source = `
      precision mediump float;
      
      uniform sampler2D u_source;
      uniform sampler2D u_destination;
      varying vec2 v_texCoord;
      
      ${blendFunctions}
      
      void main() {
        vec4 source = texture2D(u_source, v_texCoord);
        vec4 destination = texture2D(u_destination, v_texCoord);
        
        gl_FragColor = applyComposite(source, destination);
      }
    `;
    
    return this.compileShader(gl, gl.FRAGMENT_SHADER, source);
  }

  private getBlendFunction(operation: CompositeOperation): string {
    switch (operation) {
      case 'source-over':
        return `
          vec4 applyComposite(vec4 source, vec4 destination) {
            float alpha = source.a + destination.a * (1.0 - source.a);
            if (alpha == 0.0) return vec4(0.0);
            return vec4(
              (source.rgb * source.a + destination.rgb * destination.a * (1.0 - source.a)) / alpha,
              alpha
            );
          }
        `;
      
      case 'multiply':
        return `
          vec4 applyComposite(vec4 source, vec4 destination) {
            float alpha = source.a + destination.a * (1.0 - source.a);
            vec3 s = source.rgb * source.a;
            vec3 d = destination.rgb * destination.a;
            vec3 result = s * d;
            return vec4(result / alpha, alpha);
          }
        `;
      
      case 'screen':
        return `
          vec4 applyComposite(vec4 source, vec4 destination) {
            float alpha = source.a + destination.a * (1.0 - source.a);
            vec3 s = source.rgb * source.a;
            vec3 d = destination.rgb * destination.a;
            vec3 result = s + d - s * d;
            return vec4(result / alpha, alpha);
          }
        `;
      
      // 其他操作模式的 GLSL 实现...
      
      default:
        return this.getBlendFunction('source-over');
    }
  }

  private compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
    }
    
    return shader;
  }
}