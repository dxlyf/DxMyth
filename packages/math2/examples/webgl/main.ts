
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { WebGL2Helper, Stats, Ruler, ZoomTranslate, CanvasRenderer, random, Path2D as SPath2D, pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, clipper2, BoolOp, ShapePath } from 'src'

class WeblglExample extends Example {
    constructor() {
        super()
    }
    canvas: CanvasRenderer

    webgl!: WebGL2Helper
    private gl!:WebGL2RenderingContext
    private _program!: WebGLProgram
    private _vao!: WebGLVertexArrayObject
    private _ubo!: WebGLBuffer
    private _rotY: number = 0

    getState(): Record<string, { label?: string; floder?: boolean; min?: number; max?: number; step?: number; value?: any; options?: any[] }> {
        return {

        }
    }

    enter(): void {
        super.enter()
        const webgl = new WebGL2Helper(document.createElement('canvas'), {
            mode: '3d',
            clearColor: [0.1, 0.1, 0.15, 1],
            debug: true,
        })
        this.webgl = webgl
        webgl.setSize(800, 600)
        document.body.appendChild(webgl.canvas)

        // ============================================================
        // 顶点着色器：position + MVP 变换 + 颜色传递
        // ============================================================
        const vertexSource = `#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_color;

// UBO：采用 std140 布局，与 JS 端列主序矩阵匹配
layout(std140) uniform Matrices {
    mat4 u_mvp;
};

out vec3 v_color;

void main() {
    gl_Position = u_mvp * vec4(a_position, 1.0);
    v_color = a_color;
}
`

        // ============================================================
        // 片元着色器：简单颜色输出
        // ============================================================
        const fragmentSource = `#version 300 es
precision mediump float;

in vec3 v_color;
out vec4 o_fragColor;

void main() {
    o_fragColor = vec4(v_color, 1.0);
}
`

        this._program = webgl.createProgram(vertexSource, fragmentSource)

        // ============================================================
        // 创建立方体顶点数据（交错：position(3) + color(3) = 6 floats/vertex）
        // ============================================================
        const vertices = new Float32Array([
            // ---- 前面 (z = 0.5, 红) ----
            -0.5, -0.5, 0.5, 1, 0, 0,
            0.5, -0.5, 0.5, 1, 0, 0,
            0.5, 0.5, 0.5, 1, 0, 0,
            -0.5, 0.5, 0.5, 1, 0, 0,
            // ---- 后面 (z = -0.5, 绿) ----
            -0.5, -0.5, -0.5, 0, 1, 0,
            -0.5, 0.5, -0.5, 0, 1, 0,
            0.5, 0.5, -0.5, 0, 1, 0,
            0.5, -0.5, -0.5, 0, 1, 0,
            // ---- 顶面 (y = 0.5, 蓝) ----
            -0.5, 0.5, -0.5, 0, 0, 1,
            -0.5, 0.5, 0.5, 0, 0, 1,
            0.5, 0.5, 0.5, 0, 0, 1,
            0.5, 0.5, -0.5, 0, 0, 1,
            // ---- 底面 (y = -0.5, 黄) ----
            -0.5, -0.5, -0.5, 1, 1, 0,
            0.5, -0.5, -0.5, 1, 1, 0,
            0.5, -0.5, 0.5, 1, 1, 0,
            -0.5, -0.5, 0.5, 1, 1, 0,
            // ---- 右面 (x = 0.5, 品红) ----
            0.5, -0.5, -0.5, 1, 0, 1,
            0.5, 0.5, -0.5, 1, 0, 1,
            0.5, 0.5, 0.5, 1, 0, 1,
            0.5, -0.5, 0.5, 1, 0, 1,
            // ---- 左面 (x = -0.5, 青) ----
            -0.5, -0.5, -0.5, 0, 1, 1,
            -0.5, -0.5, 0.5, 0, 1, 1,
            -0.5, 0.5, 0.5, 0, 1, 1,
            -0.5, 0.5, -0.5, 0, 1, 1,
        ])

        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,       // 前面
            4, 5, 6, 4, 6, 7,       // 后面
            8, 9, 10, 8, 10, 11,    // 顶面
            12, 13, 14, 12, 14, 15, // 底面
            16, 17, 18, 16, 18, 19, // 右面
            20, 21, 22, 20, 22, 23, // 左面
        ])

        // ============================================================
        // VAO：绑定顶点属性 + 索引缓冲
        // ============================================================
        const { gl } = webgl
        this.gl=gl
        const vbo = webgl.createBuffer(vertices, gl.ARRAY_BUFFER)
        const ibo = webgl.createIndexBuffer(indices)

        this._vao = webgl.createVAO(() => {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
            // stride = 6 * 4 bytes (3 pos + 3 color)
            webgl.setAttributeByLocation(0, 3, gl.FLOAT, false, 24, 0)   // position
            webgl.setAttributeByLocation(1, 3, gl.FLOAT, false, 24, 12)  // color
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
        })

        // ============================================================
        // UBO：MVP 矩阵（16 floats * 4 bytes = 64 bytes）
        // ============================================================
        this._ubo = webgl.createEmptyBuffer(64, gl.UNIFORM_BUFFER, gl.DYNAMIC_DRAW)
        webgl.bindUniformBlock(this._program, 'Matrices', 0)

        // 启动渲染循环
        this._loop()
    }

    private _loop = (): void => {
        const { gl, webgl } = this

        this._rotY += 0.01

        // 构建 MVP 矩阵
        const mvp = this._computeMVP()

        // 更新 UBO
        webgl.useProgram(this._program)
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this._ubo)
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, mvp)

        // 清屏 + 绘制索引化立方体
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        webgl.bindVAO(this._vao)
        webgl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

        requestAnimationFrame(this._loop)
    }

    // ---- 简易矩阵运算（列主序 4x4） ----

    private _computeMVP(): Float32Array {
        const w = this.webgl.canvas.width / (this.webgl.dpr || 1)
        const h = this.webgl.canvas.height / (this.webgl.dpr || 1)

        const proj = this._perspective(Math.PI / 3, w / h, 0.1, 100)
        const view = this._lookAt([0, 1.5, 4], [0, 0, 0], [0, 1, 0])
        const model = this._rotateY(this._rotY)

        const vp = this._multiply4(proj, view)
        return this._multiply4(vp, model)
    }

    /** 透视投影矩阵 */
    private _perspective(fovy: number, aspect: number, near: number, far: number): Float32Array {
        const f = 1 / Math.tan(fovy / 2)
        const nf = 1 / (near - far)
        const m = new Float32Array(16)
        m[0] = f / aspect
        m[5] = f
        m[10] = (far + near) * nf
        m[11] = -1
        m[14] = 2 * far * near * nf
        return m
    }

    /** 视图矩阵（lookAt） */
    private _lookAt(eye: number[], center: number[], up: number[]): Float32Array {
        const f = this._norm3(this._sub3(center, eye))
        const s = this._norm3(this._cross3(f, up))
        const u = this._cross3(s, f)
        const m = new Float32Array(16)
        m[0] = s[0]; m[1] = u[0]; m[2] = -f[0]
        m[4] = s[1]; m[5] = u[1]; m[6] = -f[1]
        m[8] = s[2]; m[9] = u[2]; m[10] = -f[2]
        m[12] = -this._dot3(s, eye)
        m[13] = -this._dot3(u, eye)
        m[14] = this._dot3(f, eye)
        m[15] = 1
        return m
    }

    /** Y 轴旋转矩阵 */
    private _rotateY(angle: number): Float32Array {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const m = new Float32Array(16)
        m[0] = c; m[2] = s
        m[5] = 1
        m[8] = -s; m[10] = c
        m[15] = 1
        return m
    }

    /** 列主序矩阵乘法：a * b */
    private _multiply4(a: Float32Array, b: Float32Array): Float32Array {
        const out = new Float32Array(16)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                out[j * 4 + i] =
                    a[i] * b[j * 4] +
                    a[4 + i] * b[j * 4 + 1] +
                    a[8 + i] * b[j * 4 + 2] +
                    a[12 + i] * b[j * 4 + 3]
            }
        }
        return out
    }

    private _norm3(v: number[]): number[] {
        const len = Math.hypot(v[0], v[1], v[2])
        return [v[0] / len, v[1] / len, v[2] / len]
    }
    private _sub3(a: number[], b: number[]): number[] { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
    private _cross3(a: number[], b: number[]): number[] { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] }
    private _dot3(a: number[], b: number[]): number { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] }

    onChange(): void {

    }
    render() {

    }
}

ExampleManager.create({ examples: [WeblglExample] }).init()
