/**
 * 渲染器系统示例
 * 展示如何使用跨API渲染器
 */

import { createRenderer, BasicMaterial, Geometry } from './index';
import type { Renderer, Material, Pipeline } from './index';
import type { RendererOptions } from './types';

// 简单的顶点着色器
const vertexShader = {
    webgl1: `
        attribute vec3 a_position;
        attribute vec4 a_color;
        
        uniform mat4 u_modelViewProjection;
        
        varying vec4 v_color;
        
        void main() {
            v_color = a_color;
            gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
        }
    `,
    webgl2: `
        #version 300 es
        
        in vec3 a_position;
        in vec4 a_color;
        
        uniform mat4 u_modelViewProjection;
        
        out vec4 v_color;
        
        void main() {
            v_color = a_color;
            gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
        }
    `
};

// 简单的片段着色器
const fragmentShader = {
    webgl1: `
        precision mediump float;
        
        varying vec4 v_color;
        
        void main() {
            gl_FragColor = v_color;
        }
    `,
    webgl2: `
        #version 300 es
        precision mediump float;
        
        in vec4 v_color;
        out vec4 fragColor;
        
        void main() {
            fragColor = v_color;
        }
    `
};

class RendererExample {
    private renderer: Renderer;
    private canvas: HTMLCanvasElement;
    private geometry: Geometry;
    private material: Material;
    private pipeline: Pipeline;
    private rotation: number = 0;
    private animationId: number = 0;

    constructor(canvas: HTMLCanvasElement, options?: RendererOptions) {
        // 创建渲染器
        this.canvas = canvas;
        this.renderer = createRenderer(canvas, {
            ...options,
            enableDebug: true,
            antialias: true
        });

        // 初始化几何体
        this.geometry = this.createGeometry();

        // 初始化材质
        this.material = new BasicMaterial({
            uniforms: {
                u_modelViewProjection: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
            }
        });

        // 初始化管线
        this.pipeline = this.renderer.createPipeline({
            topology: 'triangle-list',
            shaders: {
                vertex: vertexShader,
                fragment: fragmentShader
            },
            vertexAttributes: [
                { name: 'a_position', size: 3, type: 'float', offset: 0, stride: 28 },
                { name: 'a_color', size: 4, type: 'float', offset: 12, stride: 28 }
            ],
            depthTest: true,
            depthWrite: true,
            cullMode: 'back'
        });

        // 开始动画循环
        this.startAnimation();
    }

    private createGeometry(): Geometry {
        // 创建一个彩色立方体
        const vertices = new Float32Array([
            // 正面
            -0.5, -0.5,  0.5, 1.0, 0.0, 0.0, 1.0,
             0.5, -0.5,  0.5, 1.0, 0.0, 0.0, 1.0,
             0.5,  0.5,  0.5, 1.0, 0.0, 0.0, 1.0,
            -0.5,  0.5,  0.5, 1.0, 0.0, 0.0, 1.0,
            
            // 背面
            -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
             0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
             0.5,  0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
            -0.5,  0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
            
            // 顶面
            -0.5,  0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
             0.5,  0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
             0.5,  0.5,  0.5, 0.0, 0.0, 1.0, 1.0,
            -0.5,  0.5,  0.5, 0.0, 0.0, 1.0, 1.0,
            
            // 底面
            -0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0,
             0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0,
             0.5, -0.5,  0.5, 1.0, 1.0, 0.0, 1.0,
            -0.5, -0.5,  0.5, 1.0, 1.0, 0.0, 1.0,
            
            // 右面
             0.5, -0.5, -0.5, 1.0, 0.0, 1.0, 1.0,
             0.5,  0.5, -0.5, 1.0, 0.0, 1.0, 1.0,
             0.5,  0.5,  0.5, 1.0, 0.0, 1.0, 1.0,
             0.5, -0.5,  0.5, 1.0, 0.0, 1.0, 1.0,
            
            // 左面
            -0.5, -0.5, -0.5, 0.0, 1.0, 1.0, 1.0,
            -0.5,  0.5, -0.5, 0.0, 1.0, 1.0, 1.0,
            -0.5,  0.5,  0.5, 0.0, 1.0, 1.0, 1.0,
            -0.5, -0.5,  0.5, 0.0, 1.0, 1.0, 1.0
        ]);

        const indices = new Uint16Array([
            // 正面
            0, 1, 2,
            0, 2, 3,
            
            // 背面
            4, 5, 6,
            4, 6, 7,
            
            // 顶面
            8, 9, 10,
            8, 10, 11,
            
            // 底面
            12, 13, 14,
            12, 14, 15,
            
            // 右面
            16, 17, 18,
            16, 18, 19,
            
            // 左面
            20, 21, 22,
            20, 22, 23
        ]);

        const geometry = this.renderer.createGeometry({
            vertexBuffers: [
                {
                    data: vertices,
                    attributes: [
                        { name: 'a_position', size: 3, type: 'float', offset: 0, stride: 28 },
                        { name: 'a_color', size: 4, type: 'float', offset: 12, stride: 28 }
                    ]
                }
            ],
            indexBuffer: indices,
            topology: 'triangle-list'
        });

        return geometry;
    }

    private updateModelViewProjection(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const aspect = width / height;
        
        // 透视投影矩阵
        const fov = Math.PI / 4;
        const near = 0.1;
        const far = 100.0;
        const top = near * Math.tan(fov * 0.5);
        const right = top * aspect;
        
        const projection = [
            near / right, 0, 0, 0,
            0, near / top, 0, 0,
            0, 0, -(far + near) / (far - near), -1,
            0, 0, -(2 * far * near) / (far - near), 0
        ];
        
        // 视图矩阵 (相机在z轴5.0处)
        const view = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -5.0, 1
        ];
        
        // 模型矩阵 (旋转)
        this.rotation += 0.01;
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        
        const model = [
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        
        // 计算MVP矩阵
        const modelView = this.multiplyMatrices(view, model);
        const mvp = this.multiplyMatrices(projection, modelView);
        
        // 更新材质的uniform
        this.material.setUniform('u_modelViewProjection', mvp);
    }

    private multiplyMatrices(a: number[], b: number[]): number[] {
        // 4x4矩阵乘法
        const result = new Array(16);
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum += a[i * 4 + k] * b[k * 4 + j];
                }
                result[i * 4 + j] = sum;
            }
        }
        
        return result;
    }

    private render(): void {
        // 开始渲染通道
        this.renderer.beginRenderPass({
            clear: true
        });

        // 更新模型视图投影矩阵
        this.updateModelViewProjection();

        // 绘制
        this.renderer.draw(this.pipeline, this.geometry, this.material);

        // 结束渲染通道
        this.renderer.endRenderPass();
    }

    private animate(): void {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation(): void {
        this.animate();
    }

    stopAnimation(): void {
        cancelAnimationFrame(this.animationId);
    }

    resize(width: number, height: number): void {
        this.renderer.resize(width, height);
    }

    dispose(): void {
        this.stopAnimation();
        this.geometry.dispose();
        this.material.dispose();
        this.pipeline.dispose();
        this.renderer.dispose();
    }
}

// 导出示例类
export { RendererExample };

// 使用示例
// 假设HTML中有一个id为"canvas"的canvas元素
// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
// const example = new RendererExample(canvas);
// window.addEventListener('resize', () => {
//     example.resize(canvas.clientWidth, canvas.clientHeight);
// });
