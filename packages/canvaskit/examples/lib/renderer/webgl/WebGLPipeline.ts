/**
 * WebGL渲染管线实现
 * 支持WebGL 1.0和WebGL 2.0
 */

import { Pipeline } from '../Pipeline';
import { WebGLRenderer } from './WebGLRenderer';
import type { PipelineOptions, ShaderSource, VertexAttribute } from '../types';

export class WebGLPipeline extends Pipeline {
    private renderer: WebGLRenderer;
    private gl: WebGLRenderingContext | WebGL2RenderingContext;
    private isWebGL2: boolean;
    private program: WebGLProgram;
    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;
    private uniformLocations: Map<string, WebGLUniformLocation> = new Map();
    private vertexAttributes: Map<string, { index: number; size: number; type: number; offset: number; stride: number }> = new Map();
    private vertexArrayObject: WebGLVertexArrayObject | null = null;
    private isInitialized: boolean = false;

    constructor(renderer: WebGLRenderer, options: PipelineOptions) {
        super(renderer, options);
        this.renderer = renderer;
        this.gl = renderer.getContext();
        this.isWebGL2 = (this.gl instanceof WebGL2RenderingContext);
        
        // 编译着色器
        this.vertexShader = this.compileShader(gl.VERTEX_SHADER, options.shaders.vertex);
        this.fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, options.shaders.fragment);
        
        // 创建并链接程序
        this.program = this.linkProgram();
        
        // 初始化顶点属性
        this.initVertexAttributes(options.vertexAttributes || []);
        
        // 初始化uniform位置
        this.initUniformLocations();
        
        this.isInitialized = true;
    }

    private compileShader(type: number, source: ShaderSource): WebGLShader {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error('Failed to create shader');
        }

        // 根据WebGL版本选择合适的着色器版本
        const shaderSource = this.getShaderSource(source);
        
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation failed: ${error}`);
        }

        return shader;
    }

    private getShaderSource(source: ShaderSource): string {
        if (typeof source === 'string') {
            return source;
        }

        // 选择合适的着色器版本
        if (this.isWebGL2 && source.webgl2) {
            return `#version 300 es\n${source.webgl2}`;
        } else if (source.webgl1) {
            return `#version 100\n${source.webgl1}`;
        } else {
            throw new Error('No valid shader source provided');
        }
    }

    private linkProgram(): WebGLProgram {
        const gl = this.gl;
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Failed to create program');
        }

        gl.attachShader(program, this.vertexShader);
        gl.attachShader(program, this.fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Program linking failed: ${error}`);
        }

        // 释放着色器资源
        gl.deleteShader(this.vertexShader);
        gl.deleteShader(this.fragmentShader);

        return program;
    }

    private initVertexAttributes(attributes: VertexAttribute[]): void {
        const gl = this.gl;
        
        attributes.forEach((attr, index) => {
            const location = gl.getAttribLocation(this.program, attr.name);
            if (location === -1) {
                console.warn(`Vertex attribute '${attr.name}' not found in shader`);
                return;
            }

            this.vertexAttributes.set(attr.name, {
                index: location,
                size: attr.size,
                type: this.mapAttributeType(attr.type),
                offset: attr.offset || 0,
                stride: attr.stride || 0
            });
        });

        // WebGL 2.0支持顶点数组对象
        if (this.isWebGL2) {
            const webgl2 = gl as WebGL2RenderingContext;
            this.vertexArrayObject = webgl2.createVertexArray();
            if (this.vertexArrayObject) {
                webgl2.bindVertexArray(this.vertexArrayObject);
                this.setupVertexAttributes();
                webgl2.bindVertexArray(null);
            }
        }
    }

    private setupVertexAttributes(): void {
        const gl = this.gl;
        
        this.vertexAttributes.forEach((attr) => {
            gl.enableVertexAttribArray(attr.index);
            gl.vertexAttribPointer(
                attr.index,
                attr.size,
                attr.type,
                false, // normalized
                attr.stride,
                attr.offset
            );
        });
    }

    private initUniformLocations(): void {
        const gl = this.gl;
        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = gl.getActiveUniform(this.program, i);
            if (uniformInfo) {
                const location = gl.getUniformLocation(this.program, uniformInfo.name);
                if (location) {
                    this.uniformLocations.set(uniformInfo.name, location);
                }
            }
        }
    }

    bind(): void {
        const gl = this.gl;
        
        // 使用程序
        gl.useProgram(this.program);
        
        // 绑定顶点数组对象（WebGL 2.0）
        if (this.isWebGL2 && this.vertexArrayObject) {
            const webgl2 = gl as WebGL2RenderingContext;
            webgl2.bindVertexArray(this.vertexArrayObject);
        } else if (!this.isWebGL2) {
            // WebGL 1.0需要每次绑定
            this.setupVertexAttributes();
        }
    }

    unbind(): void {
        const gl = this.gl;
        
        // 解绑顶点数组对象
        if (this.isWebGL2) {
            const webgl2 = gl as WebGL2RenderingContext;
            webgl2.bindVertexArray(null);
        }
        
        // 解绑程序
        gl.useProgram(null);
    }

    setUniform(name: string, value: any): void {
        const gl = this.gl;
        const location = this.uniformLocations.get(name);
        
        if (!location) {
            console.warn(`Uniform '${name}' not found in program`);
            return;
        }
        
        // 根据值的类型设置uniform
        if (typeof value === 'number') {
            gl.uniform1f(location, value);
        } else if (Array.isArray(value)) {
            switch (value.length) {
                case 1:
                    gl.uniform1fv(location, value);
                    break;
                case 2:
                    gl.uniform2fv(location, value);
                    break;
                case 3:
                    gl.uniform3fv(location, value);
                    break;
                case 4:
                    gl.uniform4fv(location, value);
                    break;
                case 9:
                    gl.uniformMatrix3fv(location, false, value);
                    break;
                case 16:
                    gl.uniformMatrix4fv(location, false, value);
                    break;
                default:
                    console.warn(`Uniform '${name}' has unsupported array length: ${value.length}`);
            }
        } else if (value instanceof Float32Array || value instanceof Float64Array) {
            switch (value.length) {
                case 1:
                    gl.uniform1fv(location, value);
                    break;
                case 2:
                    gl.uniform2fv(location, value);
                    break;
                case 3:
                    gl.uniform3fv(location, value);
                    break;
                case 4:
                    gl.uniform4fv(location, value);
                    break;
                case 9:
                    gl.uniformMatrix3fv(location, false, value);
                    break;
                case 16:
                    gl.uniformMatrix4fv(location, false, value);
                    break;
                default:
                    console.warn(`Uniform '${name}' has unsupported typed array length: ${value.length}`);
            }
        }
    }

    setUniforms(uniforms: Record<string, any>): void {
        for (const [name, value] of Object.entries(uniforms)) {
            this.setUniform(name, value);
        }
    }

    setVertexAttribute(name: string, buffer: WebGLBuffer, size: number, type: number, normalized: boolean = false, stride: number = 0, offset: number = 0): void {
        const gl = this.gl;
        const attr = this.vertexAttributes.get(name);
        
        if (!attr) {
            console.warn(`Vertex attribute '${name}' not found`);
            return;
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(attr.index);
        gl.vertexAttribPointer(attr.index, size, type, normalized, stride, offset);
    }

    setIndexBuffer(buffer: WebGLBuffer): void {
        const gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    }

    setTexture(name: string, texture: any, unit: number = 0): void {
        const gl = this.gl;
        const location = this.uniformLocations.get(name);
        
        if (!location) {
            console.warn(`Uniform '${name}' not found in program`);
            return;
        }
        
        // 激活纹理单元
        gl.activeTexture(gl.TEXTURE0 + unit);
        
        // 绑定纹理
        gl.bindTexture(gl.TEXTURE_2D, texture as WebGLTexture);
        
        // 设置uniform
        gl.uniform1i(location, unit);
    }

    getProgram(): WebGLProgram {
        return this.program;
    }

    getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.uniformLocations.get(name) || null;
    }

    getVertexAttribute(name: string): any {
        return this.vertexAttributes.get(name) || null;
    }

    getVertexArrayObject(): WebGLVertexArrayObject | null {
        return this.vertexArrayObject;
    }

    dispose(): void {
        if (this.disposed) {
            return;
        }
        
        const gl = this.gl;
        
        if (this.vertexArrayObject) {
            if (this.isWebGL2) {
                const webgl2 = gl as WebGL2RenderingContext;
                webgl2.deleteVertexArray(this.vertexArrayObject);
            }
        }
        
        gl.deleteProgram(this.program);
        
        this.disposed = true;
    }

    private getShaderSource(source: ShaderSource): string {
        if (typeof source === 'string') {
            return source;
        }
        
        if (this.isWebGL2 && source.webgl2) {
            return `#version 300 es\n${source.webgl2}`;
        } else if (source.webgl1) {
            return `#version 100\n${source.webgl1}`;
        } else {
            throw new Error('No valid shader source provided');
        }
    }

    private mapAttributeType(type: string): number {
        const gl = this.gl;
        
        switch (type) {
            case 'float':
                return gl.FLOAT;
            case 'int':
                return gl.INT;
            case 'uint':
                return gl.UNSIGNED_INT;
            case 'short':
                return gl.SHORT;
            case 'ushort':
                return gl.UNSIGNED_SHORT;
            case 'byte':
                return gl.BYTE;
            case 'ubyte':
                return gl.UNSIGNED_BYTE;
            default:
                return gl.FLOAT;
        }
    }

    private mapTopology(topology: string): number {
        const gl = this.gl;
        
        switch (topology) {
            case 'point-list':
                return gl.POINTS;
            case 'line-list':
                return gl.LINES;
            case 'line-strip':
                return gl.LINE_STRIP;
            case 'triangle-list':
                return gl.TRIANGLES;
            case 'triangle-strip':
                return gl.TRIANGLE_STRIP;
            case 'triangle-fan':
                return gl.TRIANGLE_FAN;
            default:
                return gl.TRIANGLES;
        }
    }
}
