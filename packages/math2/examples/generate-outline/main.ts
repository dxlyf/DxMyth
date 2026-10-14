import { ExampleManager, Example } from '../lib/Example2'
import { PathBuilder, generateOutline, LineJoin, LineCap, earcut, type FlattenedContour } from 'src'

/** h,s,l 均为 0~1 之外的标准写法：h 为 0~360，s/l 为 0~1。 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)]
}

type Tri = { pts: number[]; color: [number, number, number] }

const VERT_SRC = `
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
uniform vec2 u_resolution;
void main() {
    // 像素坐标 -> 裁剪空间，y 轴翻转（canvas 向下，clip 向上）
    vec2 zeroToOne = a_position / u_resolution;
    vec2 clip = zeroToOne * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    v_color = a_color;
}
`

const FRAG_SRC = `
precision mediump float;
varying vec4 v_color;
void main() {
    gl_FragColor = v_color;
}
`

/**
 * generateOutline + earcut + WebGL 示例。
 * 左侧：原生 canvas.stroke 参考描边，并显示可拖动的中心线顶点。
 * 中间：把 generateOutline 拆出的多边形逐块交给 earcut 三角化，用 Canvas2D 填充渲染。
 * 右侧：用 WebGL 渲染同一份三角形（同一套顶点与颜色），用于比对两者是否一致。
 */
export class GenerateOutlineExample extends Example {
    name: string = 'GenerateOutline'

    state = {
        width: 24,
        join: 'miter',
        cap: 'butt',
        miterLimit: 10,
        alignment: 0.5,
        closed: false,
    }
    stateOptions: Record<string, { type?: string; min?: number; max?: number; step?: number; options?: string[] }> = {
        width: { type: 'number', min: 1, max: 80, step: 1 },
        join: { options: ['miter', 'round', 'bevel'] },
        cap: { options: ['butt', 'round', 'square'] },
        miterLimit: { type: 'number', min: 1, max: 20, step: 0.5 },
        alignment: { type: 'number', min: 0, max: 1, step: 0.01 },
    }

    /** 中心线顶点，可拖动 */
    points: { x: number, y: number }[] = [
        { x: 100, y: 120 },
        { x: 180, y: 60 },
        { x: 260, y: 200 },
        { x: 320, y: 140 },
    ]
    hitPoint: { x: number, y: number } | null = null
    startOffset: { x: number, y: number } | null = null

    dpr: number = window.devicePixelRatio

    // 左：原生描边参考
    nativeCanvas: HTMLCanvasElement = null!
    nativeCtx: CanvasRenderingContext2D = null!
    // 中：Canvas2D 渲染三角形
    canvasCanvas: HTMLCanvasElement = null!
    canvasCtx: CanvasRenderingContext2D = null!
    // 右：WebGL 渲染三角形
    glCanvas: HTMLCanvasElement = null!
    private gl: WebGLRenderingContext = null!
    private program: WebGLProgram = null!
    private vbo: WebGLBuffer = null!
    private aPosition: number = -1
    private aColor: number = -1
    private uResolution: WebGLUniformLocation = null!

    createCanvas(width: number, height: number, dpr: number = 1) {
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        return canvas
    }

    enter(): void {
        this.nativeCanvas = this.createCanvas(400, 400, this.dpr)
        this.canvasCanvas = this.createCanvas(400, 400, this.dpr)
        this.glCanvas = this.createCanvas(400, 400, this.dpr)
        this.nativeCtx = this.nativeCanvas.getContext('2d')!
        this.canvasCtx = this.canvasCanvas.getContext('2d')!
        this.gl = this.glCanvas.getContext('webgl')!
        document.body.appendChild(this.nativeCanvas)
        document.body.appendChild(this.canvasCanvas)
        document.body.appendChild(this.glCanvas)
        this.initGL()
        ;[this.nativeCanvas, this.canvasCanvas, this.glCanvas].forEach(dom => this.attachPointerEvents(dom))
    }

    exit(): void {
        ;[this.nativeCanvas, this.canvasCanvas, this.glCanvas].forEach(dom => {
            this.detachPointerEvents(dom)
            document.body.removeChild(dom)
        })
        this.gl?.getExtension('WEBGL_lose_context')?.loseContext()
    }

    private compileShader(type: number, src: string): WebGLShader {
        const shader = this.gl.createShader(type)!
        this.gl.shaderSource(shader, src)
        this.gl.compileShader(shader)
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('shader 编译失败: ' + this.gl.getShaderInfoLog(shader))
        }
        return shader
    }

    private initGL(): void {
        const gl = this.gl
        const program = gl.createProgram()!
        gl.attachShader(program, this.compileShader(gl.VERTEX_SHADER, VERT_SRC))
        gl.attachShader(program, this.compileShader(gl.FRAGMENT_SHADER, FRAG_SRC))
        gl.linkProgram(program)
        this.program = program
        this.aPosition = gl.getAttribLocation(program, 'a_position')
        this.aColor = gl.getAttribLocation(program, 'a_color')
        this.uResolution = gl.getUniformLocation(program, 'u_resolution')!
        this.vbo = gl.createBuffer()!
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    }

    onPointer(e: { x: number, y: number, type: string }): void {
        const pick = (x: number, y: number) => this.points.find(item => Math.hypot(x - item.x, y - item.y) <= 8) || null
        if (e.type === 'pointerdown') {
            const hit = pick(e.x, e.y)
            if (hit) {
                this.hitPoint = hit
                this.startOffset = { x: e.x - hit.x, y: e.y - hit.y }
            }
        } else if (e.type === 'pointermove') {
            if (this.hitPoint && this.startOffset) {
                this.hitPoint.x = e.x - this.startOffset.x
                this.hitPoint.y = e.y - this.startOffset.y
                this.owner.refresh()
            } else {
                const hit = pick(e.x, e.y)
                if (hit !== this.hitPoint) {
                    this.hitPoint = hit
                    this.owner.refresh()
                }
            }
        } else if (e.type === 'pointerup') {
            this.hitPoint = null
            this.startOffset = null
        }
    }

    /** 由中心线顶点构建 PathBuilder，闭合时追加 Close 命令。 */
    buildPath(): PathBuilder {
        const path = PathBuilder.default()
        this.points.forEach((p, i) => {
            if (i === 0) path.moveTo(p.x, p.y)
            else path.lineTo(p.x, p.y)
        })
        if (this.state.closed) path.closePath()
        return path
    }

    /** generateOutline 拆出的多边形 */
    computePolygons(): FlattenedContour[] {
        const contours = this.buildPath().getSubPaths({ autoClose: false, skipDegenerate: true })
        return generateOutline(contours, {
            lineWidth: this.state.width,
            lineJoin: this.state.join as LineJoin,
            lineCap: this.state.cap as LineCap,
            miterLimit: this.state.miterLimit,
            alignment: this.state.alignment,
        })
    }

    /**
     * 对每个多边形单独调用 earcut 得到三角形。
     * 颜色按全局三角形序号取值，Canvas2D 与 WebGL 共用同一份结果，便于比对。
     */
    buildTriangles(polygons: FlattenedContour[]): Tri[] {
        const triangles: Tri[] = []
        let t = 0
        for (const poly of polygons) {
            const p = poly.points
            if (p.length < 3) continue
            const vertices: number[] = []
            for (const q of p) vertices.push(q.x, q.y)
            const tris = earcut.default(vertices)
            for (let i = 0; i < tris.length; i += 3) {
                const color = hslToRgb((t * 47) % 360, 0.7, 0.6)
                t++
                triangles.push({
                    pts: [
                        vertices[tris[i] * 2], vertices[tris[i] * 2 + 1],
                        vertices[tris[i + 1] * 2], vertices[tris[i + 1] * 2 + 1],
                        vertices[tris[i + 2] * 2], vertices[tris[i + 2] * 2 + 1],
                    ],
                    color,
                })
            }
        }
        return triangles
    }

    /** 绘制中心线与可拖动顶点。 */
    drawCenterline(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.beginPath()
        this.points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
        })
        if (this.state.closed) ctx.closePath()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(0, 0, 180, 0.9)'
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.restore()

        this.points.forEach(item => {
            ctx.beginPath()
            ctx.fillStyle = this.hitPoint === item ? '#1e90ff' : '#ff3b30'
            ctx.arc(item.x, item.y, 5, 0, Math.PI * 2)
            ctx.fill()
        })
    }

    /** 左侧：原生描边参考。 */
    drawNative(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.beginPath()
        this.points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
        })
        if (this.state.closed) ctx.closePath()
        ctx.lineWidth = this.state.width
        ctx.lineJoin = this.state.join as CanvasLineJoin
        ctx.lineCap = this.state.cap as CanvasLineCap
        ctx.miterLimit = this.state.miterLimit
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.35)'
        ctx.stroke()
        ctx.restore()
    }

    /** 中间：Canvas2D 逐个三角形填充。 */
    drawTriangles2D(ctx: CanvasRenderingContext2D, triangles: Tri[]): void {
        for (const tr of triangles) {
            const [r, g, b] = tr.color
            ctx.fillStyle = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
            ctx.beginPath()
            ctx.moveTo(tr.pts[0], tr.pts[1])
            ctx.lineTo(tr.pts[2], tr.pts[3])
            ctx.lineTo(tr.pts[4], tr.pts[5])
            ctx.closePath()
            ctx.fill()
        }
    }

    /** 右侧：WebGL 渲染同一份三角形。 */
    drawTrianglesGL(triangles: Tri[]): void {
        const gl = this.gl
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(1, 1, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        if (triangles.length === 0) return

        const data: number[] = []
        for (const tr of triangles) {
            const [r, g, b] = tr.color
            for (let k = 0; k < 3; k++) {
                data.push(tr.pts[k * 2], tr.pts[k * 2 + 1], r, g, b, 1)
            }
        }

        gl.useProgram(this.program)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW)
        gl.uniform2f(this.uResolution, this.glCanvas.width / this.dpr, this.glCanvas.height / this.dpr)
        const stride = 6 * 4
        gl.enableVertexAttribArray(this.aPosition)
        gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, stride, 0)
        gl.enableVertexAttribArray(this.aColor)
        gl.vertexAttribPointer(this.aColor, 4, gl.FLOAT, false, stride, 2 * 4)
        gl.drawArrays(gl.TRIANGLES, 0, data.length / 6)
    }

    render(): void {
        const polygons = this.computePolygons()
        const triangles = this.buildTriangles(polygons)

        // 左：原生描边 + 中心线/顶点
        const nctx = this.nativeCtx
        nctx.clearRect(0, 0, nctx.canvas.width, nctx.canvas.height)
        nctx.save()
        nctx.scale(this.dpr, this.dpr)
        this.drawNative(nctx)
        this.drawCenterline(nctx)
        nctx.restore()

        // 中：Canvas2D 三角形
        const cctx = this.canvasCtx
        cctx.clearRect(0, 0, cctx.canvas.width, cctx.canvas.height)
        cctx.save()
        cctx.scale(this.dpr, this.dpr)
        this.drawTriangles2D(cctx, triangles)
        cctx.restore()

        // 右：WebGL 三角形
        this.drawTrianglesGL(triangles)
    }
}

ExampleManager.create([GenerateOutlineExample])
