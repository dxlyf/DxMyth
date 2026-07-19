/**
 * WebGL2Helper - 简化 WebGL2 渲染的辅助类
 *
 * 特性：
 *   - 资源管理（shader / program / buffer / texture / VAO / FBO / UBO / Sampler）统一追踪与销毁
 *   - Program 缓存（按源码哈希），uniform / attribute 位置缓存
 *   - 两种初始化模式：'2d' 友好（无深度/剔除、预乘 alpha 混合）；'3d' 标准（深度 + 剔除）
 *   - DPR 感知的尺寸调整
 *   - 可选错误检查（debug 模式下每帧检查并打印）
 *   - VAO / FBO / UBO / Sampler 完整封装
 *   - 纹理创建、更新、mipmap 生成
 *   - readPixels 回读
 */
export interface WebGL2HelperOptions {
    /** WebGL2 上下文属性 */
    contextAttributes?: WebGLContextAttributes
    /** 初始化模式：'2d' 适合 2D 渲染（预乘 alpha 混合、无深度测试、无剔除）；'3d' 为标准模式 */
    mode?: '2d' | '3d'
    /** 清屏颜色 */
    clearColor?: [number, number, number, number]
    /** 是否启用错误检查（生产环境可关闭以提升性能） */
    debug?: boolean
}

export interface TextureParams {
    minFilter?: number
    magFilter?: number
    wrapS?: number
    wrapT?: number
    wrapR?: number
    /** 各向异性过滤倍数（若扩展可用） */
    anisotropy?: number
    /** 是否生成 mipmap */
    generateMipmap?: boolean
    /** 比较 mode（用于 shadow map） */
    compareFunc?: number
}

export interface FramebufferOptions {
    /** 颜色附件纹理（已创建），不传则自动创建 */
    colorTexture?: WebGLTexture
    /** 是否创建深度/模板渲染缓冲 */
    depth?: boolean
    stencil?: boolean
    /** 内部颜色格式 */
    internalFormat?: number
    format?: number
    type?: number
}

export type BlendPreset = 'none' | 'alpha' | 'premultiplied' | 'additive' | 'multiply' | 'screen'

export class WebGL2Helper {
    public readonly gl: WebGL2RenderingContext
    public readonly canvas: HTMLCanvasElement
    public dpr: number = 1
    public mode: '2d' | '3d' = '2d'
    public debug: boolean

    private programCache: Map<string, WebGLProgram> = new Map()
    private uniformLocationCache: Map<string, WebGLUniformLocation | null> = new Map()
    private attribLocationCache: Map<string, number> = new Map()

    /** 资源追踪集合，便于 destroy() 一次性释放 */
    private resources = {
        programs: new Set<WebGLProgram>(),
        buffers: new Set<WebGLBuffer>(),
        textures: new Set<WebGLTexture>(),
        vaos: new Set<WebGLVertexArrayObject>(),
        fbos: new Set<WebGLFramebuffer>(),
        rbos: new Set<WebGLRenderbuffer>(),
        samplers: new Set<WebGLSampler>(),
    }

    /** 各向异性扩展（若可用） */
    private anisotropicExt: EXT_texture_filter_anisotropic | null = null

    constructor(canvas: HTMLCanvasElement | string, options: WebGL2HelperOptions | WebGLContextAttributes = {}) {
        // 兼容旧 API：直接传 contextAttributes
        // 通过特征字段区分两种参数形态
        const raw = options as Record<string, unknown>
        const isHelperOptions =
            raw && ('mode' in raw || 'debug' in raw || 'contextAttributes' in raw)
        const opts: WebGL2HelperOptions = isHelperOptions
            ? (options as WebGL2HelperOptions)
            : { contextAttributes: options as WebGLContextAttributes }

        if (typeof canvas === 'string') {
            const el = document.getElementById(canvas)
            if (!(el instanceof HTMLCanvasElement)) {
                throw new Error(`Element with id "${canvas}" is not a canvas.`)
            }
            this.canvas = el
        } else {
            this.canvas = canvas
        }

        const contextAttributes = opts.contextAttributes ?? {
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
            preserveDrawingBuffer: false,
        }

        const gl = this.canvas.getContext('webgl2', contextAttributes)
        if (!gl) {
            throw new Error('WebGL2 not supported.')
        }
        this.gl = gl
        this.mode = opts.mode ?? '2d'
        this.debug = opts.debug ?? false

        // 各向异性扩展
        this.anisotropicExt = gl.getExtension('EXT_texture_filter_anisotropic') as any

        this.init(opts.clearColor ?? (this.mode === '2d' ? [0, 0, 0, 0] : [0, 0, 0, 1]))
    }

    // ==================== 初始化与状态 ====================

    /**
     * 设置视口、清除颜色与默认状态。
     * mode='2d'：关闭深度/剔除，启用预乘 alpha 混合。
     * mode='3d'：启用深度测试与背面剔除。
     */
    public init(clearColor: [number, number, number, number] = [0, 0, 0, 0]): void {
        const { gl, canvas } = this
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3])

        if (this.mode === '2d') {
            gl.disable(gl.DEPTH_TEST)
            gl.disable(gl.CULL_FACE)
            gl.enable(gl.BLEND)
            // 预乘 alpha 混合：src 已预乘 → ONE，dst → ONE_MINUS_SRC_ALPHA
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        } else {
            gl.enable(gl.DEPTH_TEST)
            gl.depthFunc(gl.LEQUAL)
            gl.enable(gl.CULL_FACE)
            gl.cullFace(gl.BACK)
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        }
    }

    /** 切换混合模式预设 */
    public setBlendPreset(preset: BlendPreset): void {
        const { gl } = this
        switch (preset) {
            case 'none':
                gl.disable(gl.BLEND)
                break
            case 'alpha':
                gl.enable(gl.BLEND)
                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
                break
            case 'premultiplied':
                gl.enable(gl.BLEND)
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
                break
            case 'additive':
                gl.enable(gl.BLEND)
                gl.blendFunc(gl.ONE, gl.ONE)
                break
            case 'multiply':
                gl.enable(gl.BLEND)
                gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA)
                break
            case 'screen':
                gl.enable(gl.BLEND)
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR)
                break
        }
    }

    /** 设置视口 */
    public viewport(x: number, y: number, width: number, height: number): void {
        this.gl.viewport(x, y, width, height)
    }

    // ==================== 错误检查 ====================

    /** 检查 WebGL 错误，debug 模式下打印。返回错误码（0 表示无错误） */
    public checkError(tag?: string): number {
        const { gl } = this
        let error: number = gl.NO_ERROR
        let firstError: number = gl.NO_ERROR
        // 清空错误队列
        do {
            error = gl.getError()
            if (error !== gl.NO_ERROR && firstError === gl.NO_ERROR) {
                firstError = error
            }
        } while (error !== gl.NO_ERROR)

        if (firstError !== gl.NO_ERROR) {
            const name = this.errorName(firstError)
            console.error(`[WebGL2${tag ? `:${tag}` : ''}] ${name}`)
        }
        return firstError
    }

    private errorName(code: number): string {
        const { gl } = this
        switch (code) {
            case gl.INVALID_ENUM: return 'INVALID_ENUM'
            case gl.INVALID_VALUE: return 'INVALID_VALUE'
            case gl.INVALID_OPERATION: return 'INVALID_OPERATION'
            case gl.INVALID_FRAMEBUFFER_OPERATION: return 'INVALID_FRAMEBUFFER_OPERATION'
            case gl.OUT_OF_MEMORY: return 'OUT_OF_MEMORY'
            case gl.CONTEXT_LOST_WEBGL: return 'CONTEXT_LOST_WEBGL'
            default: return `UNKNOWN(${code})`
        }
    }

    // ==================== 着色器与程序 ====================

    /** 编译单个着色器，失败时附带源码行号便于调试 */
    public compileShader(source: string, type: number): WebGLShader {
        const { gl } = this
        const shader = gl.createShader(type)
        if (!shader) throw new Error('Failed to create shader.')
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader) || 'unknown error'
            gl.deleteShader(shader)
            // 附带源码行号提升调试体验
            const lines = source.split('\n').map((line, i) => `${String(i + 1).padStart(4)}: ${line}`).join('\n')
            throw new Error(`Shader compilation failed: ${info}\n--- source ---\n${lines}`)
        }
        return shader
    }

    /**
     * 创建着色器程序（顶点 + 片元），可选 transform feedback varyings。
     * 同源码的程序会被缓存复用。
     */
    public createProgram(
        vertexSource: string,
        fragmentSource: string,
        transformFeedbackVaryings?: string[],
        cacheKey?: string,
    ): WebGLProgram {
        const key = cacheKey ?? this.hashSources(vertexSource, fragmentSource)
        const cached = this.programCache.get(key)
        if (cached) return cached

        const { gl } = this
        const vs = this.compileShader(vertexSource, gl.VERTEX_SHADER)
        const fs = this.compileShader(fragmentSource, gl.FRAGMENT_SHADER)
        const program = gl.createProgram()
        if (!program) throw new Error('Failed to create program.')
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        if (transformFeedbackVaryings && transformFeedbackVaryings.length > 0) {
            gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS)
        }
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program) || 'unknown error'
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
            throw new Error(`Program linking failed: ${info}`)
        }
        gl.detachShader(program, vs)
        gl.detachShader(program, fs)
        gl.deleteShader(vs)
        gl.deleteShader(fs)

        this.programCache.set(key, program)
        this.resources.programs.add(program)
        return program
    }

    /** 使用程序 */
    public useProgram(program: WebGLProgram | null): void {
        this.gl.useProgram(program)
    }

    /** 获取 uniform 位置（带缓存） */
    public getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null {
        const key = `${(program as any).__programId ?? program}:${name}`
        if (this.uniformLocationCache.has(key)) {
            return this.uniformLocationCache.get(key)!
        }
        const loc = this.gl.getUniformLocation(program, name)
        this.uniformLocationCache.set(key, loc)
        return loc
    }

    /** 获取 attribute 位置（带缓存） */
    public getAttribLocation(program: WebGLProgram, name: string): number {
        const key = `${(program as any).__programId ?? program}:${name}`
        if (this.attribLocationCache.has(key)) {
            return this.attribLocationCache.get(key)!
        }
        const loc = this.gl.getAttribLocation(program, name)
        this.attribLocationCache.set(key, loc)
        return loc
    }

    /**
     * 设置 uniform（自动检测类型）。
     * 支持标量、向量、矩阵、整型、布尔、数组。
     *
     * 矩阵类型推断：长度 4 → mat2，9 → mat3，16 → mat4。
     * 若需显式指定矩阵或 transpose，请用 setUniformMatrix。
     */
    public setUniform(program: WebGLProgram, name: string, value: any): void {
        const { gl } = this
        const loc = this.getUniformLocation(program, name)
        if (loc === null) {
            if (this.debug) console.warn(`Uniform "${name}" not found or inactive.`)
            return
        }
        this.applyUniform(loc, value)
    }

    /** 显式设置矩阵 uniform */
    public setUniformMatrix(loc: WebGLUniformLocation, value: Float32Array, transpose?: boolean): void
    public setUniformMatrix(program: WebGLProgram, name: string, value: Float32Array, transpose?: boolean): void
    public setUniformMatrix(
        programOrLoc: WebGLProgram | WebGLUniformLocation,
        nameOrValue: string | Float32Array,
        valueOrTranspose?: Float32Array | boolean,
        transpose?: boolean,
    ): void {
        const { gl } = this
        let loc: WebGLUniformLocation
        let value: Float32Array
        let trans: boolean

        if (typeof nameOrValue === 'string') {
            loc = this.getUniformLocation(programOrLoc as WebGLProgram, nameOrValue)!
            value = valueOrTranspose as Float32Array
            trans = transpose ?? false
        } else {
            loc = programOrLoc as WebGLUniformLocation
            value = nameOrValue
            trans = (valueOrTranspose as boolean) ?? false
        }
        if (!loc) return
        switch (value.length) {
            case 4: gl.uniformMatrix2fv(loc, trans, value); break
            case 9: gl.uniformMatrix3fv(loc, trans, value); break
            case 16: gl.uniformMatrix4fv(loc, trans, value); break
            case 6: gl.uniformMatrix2x3fv(loc, trans, value); break
            case 8: gl.uniformMatrix2x4fv(loc, trans, value); break
            case 12: gl.uniformMatrix3x4fv(loc, trans, value); break
            default: console.warn(`Unsupported matrix size: ${value.length}`)
        }
    }

    /** 应用 uniform 值到 location */
    private applyUniform(loc: WebGLUniformLocation, value: any): void {
        const { gl } = this
        if (typeof value === 'number') {
            gl.uniform1f(loc, value)
        } else if (typeof value === 'boolean') {
            gl.uniform1i(loc, value ? 1 : 0)
        } else if (value instanceof Float32Array) {
            // 矩阵优先按长度判断（4/9/16）
            switch (value.length) {
                case 2: gl.uniform2fv(loc, value); break
                case 3: gl.uniform3fv(loc, value); break
                case 4:
                    // 4 长度既可能是 vec4 也可能是 mat2，默认按 vec4 处理
                    // 如需 mat2，请显式调用 setUniformMatrix
                    gl.uniform4fv(loc, value); break
                case 9: gl.uniformMatrix3fv(loc, false, value); break
                case 16: gl.uniformMatrix4fv(loc, false, value); break
                default: gl.uniform1fv(loc, value)
            }
        } else if (value instanceof Int32Array) {
            switch (value.length) {
                case 2: gl.uniform2iv(loc, value); break
                case 3: gl.uniform3iv(loc, value); break
                case 4: gl.uniform4iv(loc, value); break
                default: gl.uniform1iv(loc, value)
            }
        } else if (value instanceof Uint32Array) {
            switch (value.length) {
                case 2: gl.uniform2uiv(loc, value); break
                case 3: gl.uniform3uiv(loc, value); break
                case 4: gl.uniform4uiv(loc, value); break
                default: gl.uniform1uiv(loc, value)
            }
        } else if (Array.isArray(value)) {
            if (value.length === 0) return
            if (typeof value[0] === 'boolean') {
                const arr = new Int32Array(value.map((v) => (v ? 1 : 0)))
                gl.uniform1iv(loc, arr)
            } else if (Number.isInteger(value[0])) {
                const arr = new Int32Array(value)
                switch (arr.length) {
                    case 1: gl.uniform1iv(loc, arr); break
                    case 2: gl.uniform2iv(loc, arr); break
                    case 3: gl.uniform3iv(loc, arr); break
                    case 4: gl.uniform4iv(loc, arr); break
                    default: gl.uniform1iv(loc, arr)
                }
            } else {
                const arr = new Float32Array(value)
                switch (arr.length) {
                    case 1: gl.uniform1fv(loc, arr); break
                    case 2: gl.uniform2fv(loc, arr); break
                    case 3: gl.uniform3fv(loc, arr); break
                    case 4: gl.uniform4fv(loc, arr); break
                    default: gl.uniform1fv(loc, arr)
                }
            }
        } else {
            console.warn(`Unsupported uniform value type for "${value}"`)
        }
    }

    // ==================== 缓冲区 ====================

    /** 创建并填充缓冲区（默认 target = ARRAY_BUFFER，usage = STATIC_DRAW） */
    public createBuffer(
        data: BufferSource,
        target: number = this.gl.ARRAY_BUFFER,
        usage: number = this.gl.STATIC_DRAW,
    ): WebGLBuffer {
        const { gl } = this
        const buf = gl.createBuffer()
        if (!buf) throw new Error('Failed to create buffer.')
        gl.bindBuffer(target, buf)
        gl.bufferData(target, data, usage)
        this.resources.buffers.add(buf)
        return buf
    }

    /** 创建空缓冲区（按 size 字节），常用于动态更新的 VBO/UBO */
    public createEmptyBuffer(
        size: number,
        target: number = this.gl.ARRAY_BUFFER,
        usage: number = this.gl.DYNAMIC_DRAW,
    ): WebGLBuffer {
        const { gl } = this
        const buf = gl.createBuffer()
        if (!buf) throw new Error('Failed to create buffer.')
        gl.bindBuffer(target, buf)
        gl.bufferData(target, size, usage)
        this.resources.buffers.add(buf)
        return buf
    }

    /** 更新缓冲区数据（整体替换） */
    public updateBuffer(
        buffer: WebGLBuffer,
        data: BufferSource,
        target: number = this.gl.ARRAY_BUFFER,
        offset: number = 0,
    ): void {
        const { gl } = this
        gl.bindBuffer(target, buffer)
        gl.bufferSubData(target, offset, data)
    }

    /** 创建并绑定索引缓冲区 */
    public createIndexBuffer(
        data: BufferSource,
        usage: number = this.gl.STATIC_DRAW,
    ): WebGLBuffer {
        return this.createBuffer(data, this.gl.ELEMENT_ARRAY_BUFFER, usage)
    }

    /**
     * 创建 UBO（Uniform Buffer Object）。
     * WebGL2 中 UBO 通过 glBindBufferBase(GL_UNIFORM_BUFFER, binding, buf) 绑定到 binding point。
     */
    public createUniformBuffer(data: BufferSource | number, usage: number = this.gl.DYNAMIC_DRAW): WebGLBuffer {
        const { gl } = this
        const buf = gl.createBuffer()
        if (!buf) throw new Error('Failed to create UBO.')
        gl.bindBuffer(gl.UNIFORM_BUFFER, buf)
        if (typeof data === 'number') {
            gl.bufferData(gl.UNIFORM_BUFFER, data, usage)
        } else {
            gl.bufferData(gl.UNIFORM_BUFFER, data, usage)
        }
        this.resources.buffers.add(buf)
        return buf
    }

    /** 将 UBO 绑定到指定 binding point */
    public bindUniformBufferBase(buffer: WebGLBuffer, binding: number): void {
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, binding, buffer)
    }

    /** 将 UBO 一段范围绑定到 binding point */
    public bindUniformBufferRange(buffer: WebGLBuffer, binding: number, offset: number, size: number): void {
        this.gl.bindBufferRange(this.gl.UNIFORM_BUFFER, binding, buffer, offset, size)
    }

    /** 将 program 的 uniform block 绑定到指定 binding point */
    public bindUniformBlock(program: WebGLProgram, blockName: string, binding: number): void {
        const { gl } = this
        const index = gl.getUniformBlockIndex(program, blockName)
        if (index === gl.INVALID_INDEX) {
            if (this.debug) console.warn(`Uniform block "${blockName}" not found.`)
            return
        }
        gl.uniformBlockBinding(program, index, binding)
    }

    // ==================== VAO ====================

    /** 创建并绑定 VAO，返回之。传入 callback 在 VAO 绑定期间配置 attribute */
    public createVAO(callback?: (vao: WebGLVertexArrayObject) => void): WebGLVertexArrayObject {
        const { gl } = this
        const vao = gl.createVertexArray()
        if (!vao) throw new Error('Failed to create VAO.')
        gl.bindVertexArray(vao)
        if (callback) callback(vao)
        this.resources.vaos.add(vao)
        return vao
    }

    /** 绑定 VAO（传 null 解绑） */
    public bindVAO(vao: WebGLVertexArrayObject | null): void {
        this.gl.bindVertexArray(vao)
    }

    /**
     * 绑定 attribute（在 VAO 已绑定的情况下调用）。
     * 通过 program + name 解析 location（带缓存）。
     */
    public setAttribute(
        program: WebGLProgram,
        name: string,
        size: number,
        type: number = this.gl.FLOAT,
        normalized: boolean = false,
        stride: number = 0,
        offset: number = 0,
    ): void {
        const loc = this.getAttribLocation(program, name)
        if (loc < 0) {
            if (this.debug) console.warn(`Attribute "${name}" not found.`)
            return
        }
        this.setAttributeByLocation(loc, size, type, normalized, stride, offset)
    }

    /** 直接通过 attribute location 绑定（无需 program） */
    public setAttributeByLocation(
        loc: number,
        size: number,
        type: number = this.gl.FLOAT,
        normalized: boolean = false,
        stride: number = 0,
        offset: number = 0,
    ): void {
        const { gl } = this
        if (loc < 0) return
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, size, type, normalized, stride, offset)
    }

    /** 设置整数型 attribute（WebGL2 专有，避免浮点转换） */
    public setAttributeI(
        program: WebGLProgram,
        name: string,
        size: number,
        type: number = this.gl.INT,
        stride: number = 0,
        offset: number = 0,
    ): void {
        const { gl } = this
        const loc = this.getAttribLocation(program, name)
        if (loc < 0) return
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribIPointer(loc, size, type, stride, offset)
    }

    /** 设置 attribute 的 divisor（用于实例化绘制 instancing） */
    public setAttributeDivisor(program: WebGLProgram, name: string, divisor: number): void {
        const { gl } = this
        const loc = this.getAttribLocation(program, name)
        if (loc < 0) return
        gl.vertexAttribDivisor(loc, divisor)
    }

    // ==================== 纹理 ====================

    /**
     * 创建 2D 纹理。
     * data 为 null 时创建空纹理（常用于 FBO 颜色附件）。
     */
    public createTexture2D(
        width: number,
        height: number,
        data: ArrayBufferView | null,
        params?: TextureParams & {
            internalFormat?: number
            format?: number
            type?: number
        },
    ): WebGLTexture {
        const { gl } = this
        const internalFormat = params?.internalFormat ?? gl.RGBA
        const format = params?.format ?? gl.RGBA
        const type = params?.type ?? gl.UNSIGNED_BYTE

        const tex = gl.createTexture()
        if (!tex) throw new Error('Failed to create texture.')
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, data)

        this.applyTextureParams(gl.TEXTURE_2D, params)

        if (params?.generateMipmap) {
            gl.generateMipmap(gl.TEXTURE_2D)
        }
        this.resources.textures.add(tex)
        return tex
    }

    /** 更新纹理（部分区域），用于视频帧、动态纹理等 */
    public updateTexture2D(
        texture: WebGLTexture,
        x: number,
        y: number,
        width: number,
        height: number,
        data: ArrayBufferView,
        format: number = this.gl.RGBA,
        type: number = this.gl.UNSIGNED_BYTE,
    ): void {
        const { gl } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, width, height, format, type, data)
    }

    /** 应用纹理参数到当前绑定的纹理 */
    private applyTextureParams(target: number, params?: TextureParams): void {
        const { gl } = this
        if (!params) {
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            return
        }
        // 若开启 mipmap 但 minFilter 未指定，默认使用 mipmap 线性过滤
        const wantMipmap = params.generateMipmap === true
        const minFilter = params.minFilter ?? (wantMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR)
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, minFilter)
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, params.magFilter ?? gl.LINEAR)
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, params.wrapS ?? gl.CLAMP_TO_EDGE)
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, params.wrapT ?? gl.CLAMP_TO_EDGE)
        if (params.wrapR !== undefined) {
            gl.texParameteri(target, gl.TEXTURE_WRAP_R, params.wrapR)
        }
        if (params.anisotropy && this.anisotropicExt) {
            const max = (this.anisotropicExt as any).MAX_TEXTURE_MAX_ANISOTROPY_EXT
            const maxAniso = gl.getParameter(max)
            gl.texParameterf(target, max, Math.min(params.anisotropy, maxAniso))
        }
        if (params.compareFunc !== undefined) {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE)
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, params.compareFunc)
        }
    }

    /** 生成 mipmap */
    public generateMipmap(texture: WebGLTexture): void {
        const { gl } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.generateMipmap(gl.TEXTURE_2D)
    }

    /** 激活纹理单元并绑定纹理 */
    public bindTexture2D(texture: WebGLTexture, unit: number = 0): void {
        const { gl } = this
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
    }

    // ==================== Sampler ====================

    /** 创建 Sampler 对象（WebGL2 专有，独立于纹理的过滤/包装参数） */
    public createSampler(params?: TextureParams): WebGLSampler {
        const { gl } = this
        const sampler = gl.createSampler()
        if (!sampler) throw new Error('Failed to create sampler.')
        if (params) {
            const minFilter = params.minFilter ?? gl.LINEAR
            gl.samplerParameteri(sampler, gl.TEXTURE_MIN_FILTER, minFilter)
            gl.samplerParameteri(sampler, gl.TEXTURE_MAG_FILTER, params.magFilter ?? gl.LINEAR)
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_S, params.wrapS ?? gl.CLAMP_TO_EDGE)
            gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_T, params.wrapT ?? gl.CLAMP_TO_EDGE)
            if (params.wrapR !== undefined) {
                gl.samplerParameteri(sampler, gl.TEXTURE_WRAP_R, params.wrapR)
            }
            if (params.anisotropy && this.anisotropicExt) {
                const max = (this.anisotropicExt as any).MAX_TEXTURE_MAX_ANISOTROPY_EXT
                const maxAniso = gl.getParameter(max)
                gl.samplerParameterf(sampler, max, Math.min(params.anisotropy, maxAniso))
            }
            if (params.compareFunc !== undefined) {
                gl.samplerParameteri(sampler, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE)
                gl.samplerParameteri(sampler, gl.TEXTURE_COMPARE_FUNC, params.compareFunc)
            }
        }
        this.resources.samplers.add(sampler)
        return sampler
    }

    /** 绑定 Sampler 到纹理单元 */
    public bindSampler(sampler: WebGLSampler, unit: number = 0): void {
        this.gl.bindSampler(unit, sampler)
    }

    // ==================== FBO / RBO ====================

    /**
     * 创建 Framebuffer 并附加颜色（可选深度/模板）。
     * 返回 { fbo, colorTexture, depthRenderbuffer }。
     */
    public createFramebuffer(
        width: number,
        height: number,
        options: FramebufferOptions = {},
    ): {
        fbo: WebGLFramebuffer
        colorTexture: WebGLTexture
        depthRenderbuffer?: WebGLRenderbuffer
    } {
        const { gl } = this
        const fbo = gl.createFramebuffer()
        if (!fbo) throw new Error('Failed to create framebuffer.')
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

        // 颜色附件
        const colorTexture = options.colorTexture ?? this.createTexture2D(width, height, null, {
            internalFormat: options.internalFormat ?? gl.RGBA,
            format: options.format ?? gl.RGBA,
            type: options.type ?? gl.UNSIGNED_BYTE,
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR,
        })
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0)

        // 深度/模板附件
        let depthRenderbuffer: WebGLRenderbuffer | undefined
        if (options.depth || options.stencil) {
            depthRenderbuffer = gl.createRenderbuffer()
            if (!depthRenderbuffer) throw new Error('Failed to create depth renderbuffer.')
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer)
            // stencil=true 使用 DEPTH24_STENCIL8（同时含深度与模板）
            const fmt = options.stencil ? gl.DEPTH24_STENCIL8 : gl.DEPTH_COMPONENT24
            gl.renderbufferStorage(gl.RENDERBUFFER, fmt, width, height)
            const attachment = options.stencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, depthRenderbuffer)
            this.resources.rbos.add(depthRenderbuffer)
        }

        // 完整性检查
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null)
            gl.deleteFramebuffer(fbo)
            throw new Error(`Framebuffer incomplete: ${this.framebufferStatusName(status)}`)
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        this.resources.fbos.add(fbo)
        return { fbo, colorTexture, depthRenderbuffer }
    }

    private framebufferStatusName(status: number): string {
        const { gl } = this
        switch (status) {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: return 'INCOMPLETE_ATTACHMENT'
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: return 'MISSING_ATTACHMENT'
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: return 'INCOMPLETE_DIMENSIONS'
            case gl.FRAMEBUFFER_UNSUPPORTED: return 'UNSUPPORTED'
            case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: return 'INCOMPLETE_MULTISAMPLE'
            default: return `UNKNOWN(${status})`
        }
    }

    /** 绑定 FBO（传 null 绑定默认画布） */
    public bindFramebuffer(fbo: WebGLFramebuffer | null): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo)
    }

    /** 创建 Renderbuffer（用于深度/模板附件） */
    public createRenderbuffer(
        width: number,
        height: number,
        internalFormat: number = this.gl.DEPTH_COMPONENT24,
    ): WebGLRenderbuffer {
        const { gl } = this
        const rbo = gl.createRenderbuffer()
        if (!rbo) throw new Error('Failed to create renderbuffer.')
        gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
        gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height)
        this.resources.rbos.add(rbo)
        return rbo
    }

    // ==================== 绘制 ====================

    /** 绘制（基于数组） */
    public drawArrays(mode: number = this.gl.TRIANGLES, first: number = 0, count: number): void {
        this.gl.drawArrays(mode, first, count)
    }

    /** 绘制（基于索引） */
    public drawElements(
        mode: number = this.gl.TRIANGLES,
        count: number,
        type: number = this.gl.UNSIGNED_SHORT,
        offset: number = 0,
    ): void {
        this.gl.drawElements(mode, count, type, offset)
    }

    /** 实例化绘制（基于数组） */
    public drawArraysInstanced(
        mode: number = this.gl.TRIANGLES,
        first: number,
        count: number,
        instanceCount: number,
    ): void {
        this.gl.drawArraysInstanced(mode, first, count, instanceCount)
    }

    /** 实例化绘制（基于索引） */
    public drawElementsInstanced(
        mode: number = this.gl.TRIANGLES,
        count: number,
        type: number = this.gl.UNSIGNED_SHORT,
        offset: number,
        instanceCount: number,
    ): void {
        this.gl.drawElementsInstanced(mode, count, type, offset, instanceCount)
    }

    // ==================== 清屏与回读 ====================

    /** 清除缓冲（默认颜色 + 深度） */
    public clear(mask?: number): void {
        if (mask === undefined) {
            mask = this.gl.COLOR_BUFFER_BIT
            if (this.mode === '3d') mask |= this.gl.DEPTH_BUFFER_BIT
        }
        this.gl.clear(mask)
    }

    /** 读取像素（RGBA UNSIGNED_BYTE） */
    public readPixels(
        x: number,
        y: number,
        width: number,
        height: number,
        format: number = this.gl.RGBA,
        type: number = this.gl.UNSIGNED_BYTE,
    ): Uint8Array {
        const pixels = new Uint8Array(width * height * 4)
        this.gl.readPixels(x, y, width, height, format, type, pixels)
        return pixels
    }

    // ==================== 尺寸与销毁 ====================

    /** 调整画布尺寸（支持 DPR，会更新 CSS 尺寸） */
    public setSize(width: number, height: number, dpr?: number, updateStyle: boolean = true): void {
        if (dpr !== undefined) this.dpr = dpr
        const w = Math.max(1, Math.floor(width * this.dpr))
        const h = Math.max(1, Math.floor(height * this.dpr))
        this.canvas.width = w
        this.canvas.height = h
        if (updateStyle) {
            this.canvas.style.width = `${width}px`
            this.canvas.style.height = `${height}px`
        }
        this.gl.viewport(0, 0, w, h)
    }

    /** 删除单个资源 */
    public deleteProgram(program: WebGLProgram): void {
        this.gl.deleteProgram(program)
        this.resources.programs.delete(program)
        this.programCache.forEach((p, k) => {
            if (p === program) this.programCache.delete(k)
        })
    }
    public deleteBuffer(buffer: WebGLBuffer): void {
        this.gl.deleteBuffer(buffer)
        this.resources.buffers.delete(buffer)
    }
    public deleteTexture(texture: WebGLTexture): void {
        this.gl.deleteTexture(texture)
        this.resources.textures.delete(texture)
    }
    public deleteVAO(vao: WebGLVertexArrayObject): void {
        this.gl.deleteVertexArray(vao)
        this.resources.vaos.delete(vao)
    }
    public deleteFramebuffer(fbo: WebGLFramebuffer): void {
        this.gl.deleteFramebuffer(fbo)
        this.resources.fbos.delete(fbo)
    }
    public deleteRenderbuffer(rbo: WebGLRenderbuffer): void {
        this.gl.deleteRenderbuffer(rbo)
        this.resources.rbos.delete(rbo)
    }
    public deleteSampler(sampler: WebGLSampler): void {
        this.gl.deleteSampler(sampler)
        this.resources.samplers.delete(sampler)
    }

    /** 销毁所有追踪的资源 */
    public destroy(): void {
        const { gl, resources } = this
        resources.samplers.forEach((s) => gl.deleteSampler(s))
        resources.rbos.forEach((r) => gl.deleteRenderbuffer(r))
        resources.fbos.forEach((f) => gl.deleteFramebuffer(f))
        resources.vaos.forEach((v) => gl.deleteVertexArray(v))
        resources.textures.forEach((t) => gl.deleteTexture(t))
        resources.buffers.forEach((b) => gl.deleteBuffer(b))
        resources.programs.forEach((p) => gl.deleteProgram(p))
        resources.samplers.clear()
        resources.rbos.clear()
        resources.fbos.clear()
        resources.vaos.clear()
        resources.textures.clear()
        resources.buffers.clear()
        resources.programs.clear()
        this.programCache.clear()
        this.uniformLocationCache.clear()
        this.attribLocationCache.clear()
        // 主动丢失上下文
        const loseExt = gl.getExtension('WEBGL_lose_context')
        if (loseExt) loseExt.loseContext()
    }

    // ==================== 内部工具 ====================

    /** 简易字符串哈希（FNV-1a 32bit）用于 program 缓存 key */
    private hashSources(vs: string, fs: string): string {
        return `${this.fnv1a(vs)}_${this.fnv1a(fs)}`
    }
    private fnv1a(str: string): string {
        let hash = 0x811c9dc5
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i)
            hash = Math.imul(hash, 0x01000193)
        }
        return (hash >>> 0).toString(16)
    }
}
