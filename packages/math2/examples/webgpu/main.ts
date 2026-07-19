
import { ExampleManager, Example, Canvas } from '../lib/Example'
import { WebGPUHelper, Stats, Ruler, ZoomTranslate, CanvasRenderer, random, Path2D as SPath2D, pathBooleanOp, Line, PathBuilder, Point, Conic, PointerEventSystem, PathStroke, Matrix2D, Transform, clipper2, BoolOp, ShapePath } from 'src'

// ============================================================
// WGSL 着色器
// ============================================================

const VERTEX_WGSL = /* wgsl */ `
struct Uniforms {
    mvp: mat4x4<f32>,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec3<f32>,
};

@vertex
fn main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.position = u.mvp * vec4<f32>(in.position, 1.0);
    out.color = in.color;
    return out;
}
`

const FRAGMENT_WGSL = /* wgsl */ `
@fragment
fn main(@location(0) color: vec3<f32>) -> @location(0) vec4<f32> {
    return vec4<f32>(color, 1.0);
}
`

// ---- 立方体顶点 ----
const CUBE_VERTICES = new Float32Array([
    // 前面 (z = 0.5, 红)
    -0.5, -0.5, 0.5, 1, 0, 0,
    0.5, -0.5, 0.5, 1, 0, 0,
    0.5, 0.5, 0.5, 1, 0, 0,
    -0.5, 0.5, 0.5, 1, 0, 0,
    // 后面 (z = -0.5, 绿)
    -0.5, -0.5, -0.5, 0, 1, 0,
    -0.5, 0.5, -0.5, 0, 1, 0,
    0.5, 0.5, -0.5, 0, 1, 0,
    0.5, -0.5, -0.5, 0, 1, 0,
    // 顶面 (y = 0.5, 蓝)
    -0.5, 0.5, -0.5, 0, 0, 1,
    -0.5, 0.5, 0.5, 0, 0, 1,
    0.5, 0.5, 0.5, 0, 0, 1,
    0.5, 0.5, -0.5, 0, 0, 1,
    // 底面 (y = -0.5, 黄)
    -0.5, -0.5, -0.5, 1, 1, 0,
    0.5, -0.5, -0.5, 1, 1, 0,
    0.5, -0.5, 0.5, 1, 1, 0,
    -0.5, -0.5, 0.5, 1, 1, 0,
    // 右面 (x = 0.5, 品红)
    0.5, -0.5, -0.5, 1, 0, 1,
    0.5, 0.5, -0.5, 1, 0, 1,
    0.5, 0.5, 0.5, 1, 0, 1,
    0.5, -0.5, 0.5, 1, 0, 1,
    // 左面 (x = -0.5, 青)
    -0.5, -0.5, -0.5, 0, 1, 1,
    -0.5, -0.5, 0.5, 0, 1, 1,
    -0.5, 0.5, 0.5, 0, 1, 1,
    -0.5, 0.5, -0.5, 0, 1, 1,
])

const CUBE_INDICES = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23,
])

class WebGPUExample extends Example {
    constructor() {
        super()
    }
    canvas: CanvasRenderer

    private _helper!: WebGPUHelper
    private _pipeline!: GPURenderPipeline
    private _bindGroup!: GPUBindGroup
    private _vertexBuffer!: GPUBuffer
    private _indexBuffer!: GPUBuffer
    private _uniformBuffer!: GPUBuffer
    private _rotY: number = 0
    private _frameCount: number = 0

    getState(): Record<string, any> {
        return {}
    }

    async enter(): Promise<void> {
        super.enter()
        try {
            // ---- 创建 canvas 并占满页面 ----
            const canvas = document.createElement('canvas')
            canvas.style.display = 'block'
            canvas.style.position = 'fixed'
            canvas.style.top = '0'
            canvas.style.left = '0'
            canvas.style.width = '100vw'
            canvas.style.height = '100vh'
            canvas.style.zIndex = '1'
            document.body.appendChild(canvas)

            // 关键：先获取 CSS 尺寸并设置 canvas.width/height，再 configure
            const w = canvas.clientWidth
            const h = canvas.clientHeight
            if (w === 0 || h === 0) {
                throw new Error(`Canvas size is zero: ${w}x${h}. Check CSS.`)
            }
            canvas.width = w
            canvas.height = h
            console.log('[WebGPU] canvas size:', w, h)

            // ---- 初始化 helper ----
            const helper = new WebGPUHelper(canvas, { debug: true })
            this._helper = helper
            await helper.init()
            console.log('[WebGPU] device ready, format:', helper.format)

            helper.ensureDepthTexture(w, h)

            this._setupPipeline(helper)
            console.log('[WebGPU] pipeline created, starting loop')
            this._loop()
        } catch (err) {
            console.error('[WebGPU] setup failed:', err)
        }
    }

    private _setupPipeline(helper: WebGPUHelper): void {
        const device = helper.device!

        // push error scope to catch GPU validation errors
        device.pushErrorScope('validation')
        device.pushErrorScope('out-of-memory')
        device.pushErrorScope('internal')

        const vsModule = helper.createShaderModule(VERTEX_WGSL, 'vs')
        const fsModule = helper.createShaderModule(FRAGMENT_WGSL, 'fs')

        const bindGroupLayout = helper.createBindGroupLayout([
            { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' as const } },
        ], 'bgl')

        const pipelineLayout = helper.createPipelineLayout([bindGroupLayout], 'pl')

        const vertexLayout: GPUVertexBufferLayout = {
            arrayStride: 24,
            stepMode: 'vertex',
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x3' as const },
                { shaderLocation: 1, offset: 12, format: 'float32x3' as const },
            ],
        }

        this._pipeline = device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: vsModule,
                entryPoint: 'main',
                buffers: [vertexLayout],
            },
            fragment: {
                module: fsModule,
                entryPoint: 'main',
                targets: [{ format: helper.format }],
            },
            primitive: { topology: 'triangle-list' },
            depthStencil: {
                format: helper.depthFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            label: 'pipeline_cube',
        })

        this._vertexBuffer = helper.createBuffer(CUBE_VERTICES, GPUBufferUsage.VERTEX, 'vbo')
        this._indexBuffer = helper.createBuffer(CUBE_INDICES, GPUBufferUsage.INDEX, 'ibo')
        this._uniformBuffer = helper.createEmptyBuffer(64, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, 'ubo')

        this._bindGroup = helper.createBindGroup(bindGroupLayout, [
            { binding: 0, resource: { buffer: this._uniformBuffer } },
        ], 'bg')

        // check GPU errors from setup
        device.popErrorScope().then((err) => { if (err) console.error('[WebGPU] validation error:', err.message) })
        device.popErrorScope().then((err) => { if (err) console.error('[WebGPU] oom error:', err.message) })
        device.popErrorScope().then((err) => { if (err) console.error('[WebGPU] internal error:', err.message) })
    }

    private _loop = (): void => {
        const helper = this._helper
        if (!helper || !helper.device) return
        const device = helper.device!
        requestAnimationFrame(this._loop)

        this._rotY += 0.01
        const mvp = this._computeMVP()
        device.queue.writeBuffer(this._uniformBuffer, 0, mvp.buffer as unknown as ArrayBuffer)

        try {
            helper.beginCommandEncoder()
            const pass = helper.beginRenderPass({
                clearValue: { r: 0.1, g: 0.1, b: 0.15, a: 1 },
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
            })

            pass.setPipeline(this._pipeline)
            pass.setBindGroup(0, this._bindGroup)
            pass.setVertexBuffer(0, this._vertexBuffer)
            pass.setIndexBuffer(this._indexBuffer, 'uint16')
            pass.drawIndexed(36)

            helper.endRenderPass()
            helper.submit()
        } catch (err) {
            console.error('[WebGPU] render error:', err)
        }

        if (++this._frameCount === 1) {
            console.log('[WebGPU] first frame submitted')
        }
    }

    // ---- 矩阵运算（列主序 4x4） ----

    private _computeMVP(): Float32Array {
        const w = this._helper.canvas.width
        const h = this._helper.canvas.height
        const proj = this._perspective(Math.PI / 3, w / h, 0.1, 100)
        const view = this._lookAt([0, 1.5, 4], [0, 0, 0], [0, 1, 0])
        const model = this._rotateY(this._rotY)
        const vp = this._multiply4(proj, view)
        return this._multiply4(vp, model)
    }

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

    private _rotateY(angle: number): Float32Array {
        const c = Math.cos(angle), s = Math.sin(angle)
        const m = new Float32Array(16)
        m[0] = c; m[2] = s
        m[5] = 1
        m[8] = -s; m[10] = c
        m[15] = 1
        return m
    }

    private _multiply4(a: Float32Array, b: Float32Array): Float32Array {
        const out = new Float32Array(16)
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                out[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3]
        return out
    }

    private _norm3(v: number[]): number[] {
        const len = Math.hypot(v[0], v[1], v[2])
        return [v[0] / len, v[1] / len, v[2] / len]
    }
    private _sub3(a: number[], b: number[]): number[] { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] }
    private _cross3(a: number[], b: number[]): number[] { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] }
    private _dot3(a: number[], b: number[]): number { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] }

    onChange(): void {}
    render() {}
}

ExampleManager.create({ examples: [WebGPUExample] }).init()
