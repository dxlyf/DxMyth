/**
 * WebGL2 后端。
 *
 * 几何由 `GPU2DRenderer` 展开成三角形，这里只负责：
 *
 *   - 两个 shader 程序：shape（纯色 / 渐变 / pattern）与 image（纹理方块）
 *   - 动态 VBO / IBO 上传与 drawElements
 *   - stencil 裁剪层级
 *   - 可分离混合模式映射
 *   - 图片 / 文字纹理缓存
 */
import { Color } from '../math/Color'
import { Matrix2D } from '../math/Matrix2D'
import { isEmptyMesh } from './geometry'
import type { Mesh2D } from './geometry'
import { isPatternPaint } from './Paint'
import type { BlendMode, ImageSource, PaintColor, PaintSource, PatternPaint } from './Paint'
import { GPU2DRenderer, resolveBlend, resolveGradient } from './GPU2DRenderer'
import type { BlendFactorToken, GPU2DRendererOptions, Rect, UvRect } from './GPU2DRenderer'
import { imageSize } from './CanvasRenderer'

export interface WebGL2RendererOptions extends GPU2DRendererOptions {
    /** 覆盖默认的 WebGL 上下文属性 */
    contextAttributes?: WebGLContextAttributes
    antialias?: boolean
    preserveDrawingBuffer?: boolean
    powerPreference?: WebGLPowerPreference
}

interface TextureEntry {
    texture: WebGLTexture
    width: number
    height: number
}

const QUAD_INDICES = new Uint32Array([0, 1, 2, 0, 2, 3])
const IDENTITY = Matrix2D.identity()

const SHAPE_VS = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_local;
uniform vec2 u_resolution;
out vec2 v_local;
void main() {
    vec2 clip = a_position / u_resolution * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    v_local = a_local;
}`

const SHAPE_FS = `#version 300 es
precision highp float;

in vec2 v_local;

uniform int u_kind;
uniform vec4 u_params0;
uniform vec4 u_params1;
uniform int u_stopCount;
uniform vec4 u_stopColors[8];
uniform float u_stopOffsets[8];
uniform float u_opacity;
uniform sampler2D u_texture;
uniform mat3 u_patternMatrix;
uniform vec2 u_texSize;
uniform int u_repeat;

out vec4 outColor;

vec4 sampleStops(float t) {
    if (u_stopCount <= 0) return vec4(0.0);
    vec4 prevColor = u_stopColors[0];
    float prevOffset = u_stopOffsets[0];
    if (u_stopCount == 1) return prevColor;
    for (int i = 1; i < 8; i++) {
        if (i >= u_stopCount) break;
        float offset = u_stopOffsets[i];
        vec4 color = u_stopColors[i];
        if (t <= offset) {
            float span = max(offset - prevOffset, 1e-6);
            return mix(prevColor, color, clamp((t - prevOffset) / span, 0.0, 1.0));
        }
        prevColor = color;
        prevOffset = offset;
    }
    return prevColor;
}

vec4 linearGradient() {
    vec2 p0 = u_params0.xy;
    vec2 d = u_params0.zw - p0;
    float len2 = dot(d, d);
    float t = len2 > 1e-6 ? dot(v_local - p0, d) / len2 : 0.0;
    return sampleStops(t);
}

vec4 radialGradient() {
    vec2 c0 = u_params0.xy;
    float r0 = u_params0.z;
    vec2 c1 = u_params1.xy;
    float r1 = u_params1.z;
    vec2 d = c1 - c0;
    float dr = r1 - r0;
    vec2 pc = v_local - c0;
    float a = dot(d, d) - dr * dr;
    float b = -2.0 * (dot(pc, d) + r0 * dr);
    float c = dot(pc, pc) - r0 * r0;
    float t = 0.0;
    if (abs(a) < 1e-6) {
        t = abs(b) > 1e-6 ? -c / b : 0.0;
    } else {
        float disc = b * b - 4.0 * a * c;
        if (disc >= 0.0) {
            float sq = sqrt(disc);
            float t0 = (-b + sq) / (2.0 * a);
            float t1 = (-b - sq) / (2.0 * a);
            float lo = min(t0, t1);
            float hi = max(t0, t1);
            t = lo >= 0.0 ? lo : hi;
        }
    }
    return sampleStops(t);
}

vec4 conicGradient() {
    vec2 d = v_local - u_params0.xy;
    float angle = atan(d.y, d.x);
    return sampleStops(fract((angle - u_params0.z) / 6.283185307179586));
}

vec4 patternColor() {
    vec3 p = u_patternMatrix * vec3(v_local, 1.0);
    vec2 uv = p.xy / max(u_texSize, vec2(1.0));
    if (u_repeat == 0) {
        uv = fract(uv);
    } else if (u_repeat == 1) {
        uv = vec2(fract(uv.x), clamp(uv.y, 0.0, 1.0));
    } else if (u_repeat == 2) {
        uv = vec2(clamp(uv.x, 0.0, 1.0), fract(uv.y));
    } else if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) {
        discard;
    }
    return texture(u_texture, uv);
}

void main() {
    vec4 color;
    if (u_kind == 1) {
        color = linearGradient();
    } else if (u_kind == 2) {
        color = radialGradient();
    } else if (u_kind == 3) {
        color = conicGradient();
    } else if (u_kind == 4) {
        color = patternColor();
    } else {
        color = u_params0;
    }
    color.a *= u_opacity;
    if (color.a <= 0.0) discard;
    outColor = color;
}`

const IMAGE_VS = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_uv;
uniform vec2 u_resolution;
out vec2 v_uv;
void main() {
    vec2 clip = a_position / u_resolution * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    v_uv = a_uv;
}`

const IMAGE_FS = `#version 300 es
precision mediump float;

in vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_opacity;
out vec4 outColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    color.a *= u_opacity;
    if (color.a <= 0.0) discard;
    outColor = color;
}`

export class WebGL2Renderer extends GPU2DRenderer {
    private readonly _gl: WebGL2RenderingContext

    private _shapeProgram!: WebGLProgram
    private _imageProgram!: WebGLProgram
    private _vao!: WebGLVertexArrayObject
    private _vbo!: WebGLBuffer
    private _ibo!: WebGLBuffer

    private readonly _shapeLoc = new Map<string, WebGLUniformLocation | null>()
    private readonly _imageLoc = new Map<string, WebGLUniformLocation | null>()

    private readonly _textures = new WeakMap<ImageSource, TextureEntry | null>()
    private readonly _textureSet = new Set<WebGLTexture>()
    private readonly _patternMatrix = new Float32Array(9)

    private _blendKey = ''
    private _quadMesh: Mesh2D = { positions: new Float32Array(8), indices: QUAD_INDICES }

    constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options: WebGL2RendererOptions = {}) {
        super(canvas, options)
        const attributes: WebGLContextAttributes = {
            alpha: true,
            antialias: options.antialias ?? true,
            depth: false,
            stencil: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
            powerPreference: options.powerPreference ?? 'default',
            ...options.contextAttributes,
        }
        const gl = (this.canvas as HTMLCanvasElement).getContext(
            'webgl2',
            attributes,
        ) as WebGL2RenderingContext | null
        if (!gl) throw new Error('WebGL2Renderer: 当前环境不支持 WebGL2')
        this._gl = gl
        this._initResources()
        this.initialize()
    }

    get gl(): WebGL2RenderingContext {
        return this._gl
    }

    // ============================================================
    // 资源初始化
    // ============================================================

    private _initResources(): void {
        const gl = this._gl
        this._shapeProgram = this._link(SHAPE_VS, SHAPE_FS)
        this._imageProgram = this._link(IMAGE_VS, IMAGE_FS)

        for (const name of [
            'u_resolution',
            'u_kind',
            'u_params0',
            'u_params1',
            'u_stopCount',
            'u_stopColors[0]',
            'u_stopOffsets[0]',
            'u_opacity',
            'u_texture',
            'u_patternMatrix',
            'u_texSize',
            'u_repeat',
        ]) {
            this._shapeLoc.set(name, gl.getUniformLocation(this._shapeProgram, name))
        }
        for (const name of ['u_resolution', 'u_texture', 'u_opacity']) {
            this._imageLoc.set(name, gl.getUniformLocation(this._imageProgram, name))
        }

        this._vbo = gl.createBuffer() as WebGLBuffer
        this._ibo = gl.createBuffer() as WebGLBuffer
        this._vao = gl.createVertexArray() as WebGLVertexArrayObject
        gl.bindVertexArray(this._vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0)
        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)
        gl.bindVertexArray(null)

        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.CULL_FACE)
        gl.disable(gl.SCISSOR_TEST)
        gl.enable(gl.BLEND)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        this._applyBlend('source-over')
    }

    private _link(vertexSource: string, fragmentSource: string): WebGLProgram {
        const gl = this._gl
        const program = gl.createProgram() as WebGLProgram
        const vertex = this._compile(gl.VERTEX_SHADER, vertexSource)
        const fragment = this._compile(gl.FRAGMENT_SHADER, fragmentSource)
        gl.attachShader(program, vertex)
        gl.attachShader(program, fragment)
        gl.linkProgram(program)
        gl.deleteShader(vertex)
        gl.deleteShader(fragment)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            throw new Error(`WebGL2Renderer: shader 链接失败\n${log ?? ''}`)
        }
        return program
    }

    private _compile(type: number, source: string): WebGLShader {
        const gl = this._gl
        const shader = gl.createShader(type) as WebGLShader
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader)
            throw new Error(`WebGL2Renderer: shader 编译失败\n${log ?? ''}`)
        }
        return shader
    }

    // ============================================================
    // 后端挂钩
    // ============================================================

    protected onResize(): void {
        const gl = this._gl
        const width = this.canvas.width
        const height = this.canvas.height
        gl.viewport(0, 0, width, height)
        // 退出裁剪用的全屏方块，坐标已经是设备像素
        this._quadMesh = {
            positions: new Float32Array([0, 0, width, 0, width, height, 0, height]),
            indices: QUAD_INDICES,
        }
    }

    protected onClear(color: PaintColor | null): void {
        const gl = this._gl
        if (color == null) gl.clearColor(0, 0, 0, 0)
        else {
            const rgba = toRGBA(color)
            gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3])
        }
        gl.disable(gl.SCISSOR_TEST)
        gl.colorMask(true, true, true, true)
        gl.stencilMask(0xff)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
        // stencil 已被清空，裁剪层级随之失效
        this._clipDepth = 0
        this._applyClipState()
    }

    protected onClearRectDevice(x: number, y: number, width: number, height: number): void {
        if (width <= 0 || height <= 0) return
        const gl = this._gl
        gl.enable(gl.SCISSOR_TEST)
        gl.scissor(Math.floor(x), this.canvas.height - Math.ceil(y) - Math.ceil(height), Math.ceil(width), Math.ceil(height))
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.disable(gl.SCISSOR_TEST)
    }

    protected submitMesh(
        mesh: Mesh2D,
        matrix: Matrix2D,
        source: PaintSource,
        opacity: number,
        blend: BlendMode,
    ): void {
        if (isEmptyMesh(mesh)) return
        const gl = this._gl
        this._applyClipState()
        this._applyBlend(blend)
        this._prepareShape(opacity)

        if (isPatternPaint(source)) {
            const texture = this._texture(source.image)
            if (!texture) return
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, texture.texture)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            this._setPatternMatrix(source)
            gl.uniform1i(this._loc(this._shapeLoc, 'u_kind'), 4)
            gl.uniform1i(this._loc(this._shapeLoc, 'u_texture'), 0)
            gl.uniform2f(this._loc(this._shapeLoc, 'u_texSize'), texture.width, texture.height)
            gl.uniform1i(this._loc(this._shapeLoc, 'u_repeat'), repeatCode(source.repetition))
            gl.uniformMatrix3fv(this._loc(this._shapeLoc, 'u_patternMatrix'), false, this._patternMatrix)
            this._drawMesh(mesh, matrix)
            return
        }

        const gradient = resolveGradient(source)
        if (!gradient) return
        gl.uniform1i(this._loc(this._shapeLoc, 'u_kind'), gradient.kind)
        gl.uniform4fv(this._loc(this._shapeLoc, 'u_params0'), gradient.params0)
        gl.uniform4fv(this._loc(this._shapeLoc, 'u_params1'), gradient.params1)
        gl.uniform1i(this._loc(this._shapeLoc, 'u_stopCount'), gradient.count)
        if (gradient.count > 0) {
            gl.uniform4fv(this._loc(this._shapeLoc, 'u_stopColors[0]'), gradient.colors)
            gl.uniform1fv(this._loc(this._shapeLoc, 'u_stopOffsets[0]'), gradient.offsets)
        }
        this._drawMesh(mesh, matrix)
    }

    protected submitImage(
        image: ImageSource,
        matrix: Matrix2D,
        dst: Rect,
        uv: UvRect,
        opacity: number,
        blend: BlendMode,
        smoothing: boolean,
    ): void {
        const texture = this._texture(image)
        if (!texture) return
        const gl = this._gl
        this._applyClipState()
        this._applyBlend(blend)

        gl.useProgram(this._imageProgram)
        gl.uniform2f(this._loc(this._imageLoc, 'u_resolution'), this.canvas.width, this.canvas.height)
        gl.uniform1f(this._loc(this._imageLoc, 'u_opacity'), clamp01(opacity))
        gl.uniform1i(this._loc(this._imageLoc, 'u_texture'), 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture.texture)
        const filter = smoothing ? gl.LINEAR : gl.NEAREST
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)

        this._upload(this.imageVertices(dst, uv, matrix), QUAD_INDICES)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0)
    }

    protected beginClip(mesh: Mesh2D, matrix: Matrix2D, level: number): void {
        if (isEmptyMesh(mesh)) {
            this._applyClipState()
            return
        }
        const gl = this._gl
        gl.enable(gl.STENCIL_TEST)
        gl.stencilMask(0xff)
        gl.stencilFunc(gl.EQUAL, level - 1, 0xff)
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR_WRAP)
        gl.colorMask(false, false, false, false)
        this._prepareShape(1)
        gl.uniform1i(this._loc(this._shapeLoc, 'u_kind'), 0)
        gl.uniform4f(this._loc(this._shapeLoc, 'u_params0'), 0, 0, 0, 1)
        gl.uniform1i(this._loc(this._shapeLoc, 'u_stopCount'), 0)
        this._drawMesh(mesh, matrix)
        gl.colorMask(true, true, true, true)
        this._applyClipState()
    }

    protected endClip(from: number, to: number): void {
        const gl = this._gl
        if (from > to) {
            gl.enable(gl.STENCIL_TEST)
            gl.stencilMask(0xff)
            gl.colorMask(false, false, false, false)
            this._prepareShape(1)
            gl.uniform1i(this._loc(this._shapeLoc, 'u_kind'), 0)
            gl.uniform4f(this._loc(this._shapeLoc, 'u_params0'), 0, 0, 0, 1)
            gl.uniform1i(this._loc(this._shapeLoc, 'u_stopCount'), 0)
            for (let level = from; level > to; level--) {
                gl.stencilFunc(gl.EQUAL, level, 0xff)
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR_WRAP)
                this._drawMesh(this._quadMesh, IDENTITY)
            }
            gl.colorMask(true, true, true, true)
        }
        this._applyClipState()
    }

    protected onFlush(): void {
        this._gl.flush()
    }

    protected onDispose(): void {
        const gl = this._gl
        gl.useProgram(null)
        gl.deleteProgram(this._shapeProgram)
        gl.deleteProgram(this._imageProgram)
        gl.bindVertexArray(null)
        gl.deleteVertexArray(this._vao)
        gl.deleteBuffer(this._vbo)
        gl.deleteBuffer(this._ibo)
        for (const texture of this._textureSet) gl.deleteTexture(texture)
        this._textureSet.clear()
    }

    // ============================================================
    // 内部工具
    // ============================================================

    private _loc(map: Map<string, WebGLUniformLocation | null>, name: string): WebGLUniformLocation | null {
        return map.get(name) ?? null
    }

    private _prepareShape(opacity: number): void {
        const gl = this._gl
        gl.useProgram(this._shapeProgram)
        gl.uniform2f(this._loc(this._shapeLoc, 'u_resolution'), this.canvas.width, this.canvas.height)
        gl.uniform1f(this._loc(this._shapeLoc, 'u_opacity'), clamp01(opacity))
    }

    private _drawMesh(mesh: Mesh2D, matrix: Matrix2D): void {
        const gl = this._gl
        this._upload(this.shapeVertices(mesh, matrix), mesh.indices)
        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0)
    }

    private _upload(vertices: Float32Array, indices: Uint32Array): void {
        const gl = this._gl
        gl.bindVertexArray(this._vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW)
    }

    private _applyBlend(blend: BlendMode): void {
        const gl = this._gl
        const state = resolveBlend(blend)
        const key = `${state.equation}|${state.src}|${state.dst}|${state.srcAlpha}|${state.dstAlpha}`
        if (key === this._blendKey) return
        this._blendKey = key
        gl.blendEquation(
            state.equation === 'min' ? gl.MIN : state.equation === 'max' ? gl.MAX : gl.FUNC_ADD,
        )
        gl.blendFuncSeparate(
            this._factor(state.src),
            this._factor(state.dst),
            this._factor(state.srcAlpha),
            this._factor(state.dstAlpha),
        )
    }

    private _factor(token: BlendFactorToken): number {
        const gl = this._gl
        switch (token) {
            case 'zero':
                return gl.ZERO
            case 'one':
                return gl.ONE
            case 'src-color':
                return gl.SRC_COLOR
            case 'one-minus-src-color':
                return gl.ONE_MINUS_SRC_COLOR
            case 'src-alpha':
                return gl.SRC_ALPHA
            case 'one-minus-src-alpha':
                return gl.ONE_MINUS_SRC_ALPHA
            case 'dst-color':
                return gl.DST_COLOR
            case 'one-minus-dst-color':
                return gl.ONE_MINUS_DST_COLOR
            case 'dst-alpha':
                return gl.DST_ALPHA
            case 'one-minus-dst-alpha':
                return gl.ONE_MINUS_DST_ALPHA
            default:
                return gl.ONE
        }
    }

    private _applyClipState(): void {
        const gl = this._gl
        if (this._clipDepth > 0) {
            gl.enable(gl.STENCIL_TEST)
            gl.stencilFunc(gl.EQUAL, this._clipDepth, 0xff)
            gl.stencilMask(0x00)
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
        } else {
            gl.disable(gl.STENCIL_TEST)
            gl.stencilMask(0xff)
        }
    }

    private _setPatternMatrix(pattern: PatternPaint): void {
        const source = pattern.transform
        if (!source) {
            this._patternMatrix.set([1, 0, 0, 0, 1, 0, 0, 0, 1])
            return
        }
        const m = Matrix2D.from(source).invert()
        this._patternMatrix[0] = m[0]
        this._patternMatrix[1] = m[1]
        this._patternMatrix[2] = 0
        this._patternMatrix[3] = m[2]
        this._patternMatrix[4] = m[3]
        this._patternMatrix[5] = 0
        this._patternMatrix[6] = m[4]
        this._patternMatrix[7] = m[5]
        this._patternMatrix[8] = 1
    }

    private _texture(source: ImageSource): TextureEntry | null {
        const cached = this._textures.get(source)
        if (cached !== undefined) return cached
        const size = imageSize(source)
        if (!size.width || !size.height) return null

        const gl = this._gl
        const texture = gl.createTexture()
        if (!texture) return null
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
        try {
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                source as TexImageSource,
            )
        } catch {
            // 跨域等无法上传的情况：记住失败，避免每帧重试
            gl.deleteTexture(texture)
            this._textures.set(source, null)
            return null
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

        const entry: TextureEntry = { texture, width: size.width, height: size.height }
        this._textures.set(source, entry)
        this._textureSet.add(texture)
        return entry
    }
}

function repeatCode(repetition: PatternPaint['repetition']): number {
    switch (repetition) {
        case 'repeat':
            return 0
        case 'repeat-x':
            return 1
        case 'repeat-y':
            return 2
        case 'no-repeat':
            return 3
        default:
            return 0
    }
}

function toRGBA(color: PaintColor): [number, number, number, number] {
    if (typeof color === 'string') {
        const parsed = Color.fromInput(color)
        return [parsed[0], parsed[1], parsed[2], parsed[3] ?? 1]
    }
    return [color[0], color[1], color[2], color[3] ?? 1]
}

function clamp01(value: number): number {
    return value < 0 ? 0 : value > 1 ? 1 : value
}
