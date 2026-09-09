// ============================================================
// Program - WebGL 着色器程序封装
//
// 功能：
//   - 自动识别着色器中全部激活的输入参数：
//       · Attribute（顶点属性）
//       · Uniform（普通变量 / 结构体成员 / 数组）
//       · Uniform Block（UBO，WebGL2 专有）
//   - 获取每个参数的完整信息：名称、GL 类型、语义类型、分量数、
//     数组大小、结构体成员、块大小与偏移量等
//   - 按类型提供直观的赋值接口（标量 / 向量 / 矩阵 / 采样器 / 数组 / 结构体 / UBO）
//   - 参数变更自动检测（dirty 标记）与统一同步（sync / use）
//   - 兼容 WebGL 1 / 2（按能力探测，UBO 仅 WebGL2）
//   - 完善的错误处理：编译 / 链接 / 参数获取失败均抛出带上下文的异常
// ============================================================

/** 语义化的参数类型名（与 GL 类型码一一映射） */
export type UniformType =
    | 'float' | 'vec2' | 'vec3' | 'vec4'
    | 'int' | 'ivec2' | 'ivec3' | 'ivec4'
    | 'uint' | 'uvec2' | 'uvec3' | 'uvec4'
    | 'bool' | 'bvec2' | 'bvec3' | 'bvec4'
    | 'mat2' | 'mat3' | 'mat4'
    | 'mat2x3' | 'mat2x4' | 'mat3x2' | 'mat3x4' | 'mat4x2' | 'mat4x3'
    | 'sampler2D' | 'sampler3D' | 'samplerCube'
    | 'sampler2DShadow' | 'sampler2DArray' | 'sampler2DArrayShadow' | 'samplerCubeShadow'
    | 'unknown'

/** 允许传入的 uniform / UBO 值形态 */
export type UniformValue =
    | number
    | boolean
    | Array<number>
    | Float32Array
    | Int32Array
    | Uint32Array
    | null
    | undefined

/** GL 类型码 → 语义类型名 */
const TYPE_NAMES: Record<number, UniformType> = {
    [0x1406]: 'float', [0x8B50]: 'vec2', [0x8B51]: 'vec3', [0x8B52]: 'vec4',
    [0x1404]: 'int', [0x8B53]: 'ivec2', [0x8B54]: 'ivec3', [0x8B55]: 'ivec4',
    [0x1405]: 'uint', [0x8DC6]: 'uvec2', [0x8DC7]: 'uvec3', [0x8DC8]: 'uvec4',
    [0x8B56]: 'bool', [0x8B57]: 'bvec2', [0x8B58]: 'bvec3', [0x8B59]: 'bvec4',
    [0x8B5A]: 'mat2', [0x8B5B]: 'mat3', [0x8B5C]: 'mat4',
    [0x8B65]: 'mat2x3', [0x8B66]: 'mat2x4', [0x8B67]: 'mat3x2', [0x8B68]: 'mat3x4', [0x8B69]: 'mat4x2', [0x8B6A]: 'mat4x3',
    [0x8B5E]: 'sampler2D', [0x8B5F]: 'sampler3D', [0x8B60]: 'samplerCube',
    [0x8B62]: 'sampler2DShadow', [0x8DC1]: 'sampler2DArray', [0x8DC4]: 'sampler2DArrayShadow', [0x8DC5]: 'samplerCubeShadow',
}

/** 语义类型 → 单个元素的分量数（mat 为行列积） */
const COMPONENT_COUNT: Record<UniformType, number> = {
    float: 1, vec2: 2, vec3: 3, vec4: 4,
    int: 1, ivec2: 2, ivec3: 3, ivec4: 4,
    uint: 1, uvec2: 2, uvec3: 3, uvec4: 4,
    bool: 1, bvec2: 2, bvec3: 3, bvec4: 4,
    mat2: 4, mat3: 9, mat4: 16,
    mat2x3: 6, mat2x4: 8, mat3x2: 6, mat3x4: 12, mat4x2: 8, mat4x3: 12,
    sampler2D: 1, sampler3D: 1, samplerCube: 1,
    sampler2DShadow: 1, sampler2DArray: 1, sampler2DArrayShadow: 1, samplerCubeShadow: 1,
    unknown: 1,
}

/** 矩阵类型 → [列数, 行数]（GLSL 列主序） */
function matrixDims(t: UniformType): [number, number] | null {
    switch (t) {
        case 'mat2': return [2, 2]
        case 'mat3': return [3, 3]
        case 'mat4': return [4, 4]
        case 'mat2x3': return [2, 3]
        case 'mat2x4': return [2, 4]
        case 'mat3x2': return [3, 2]
        case 'mat3x4': return [3, 4]
        case 'mat4x2': return [4, 2]
        case 'mat4x3': return [4, 3]
        default: return null
    }
}

/** 数值存储类别：浮点 / 有符号整型（含布尔）/ 无符号整型 */
type ValueKind = 'f' | 'i' | 'u'

function valueKindOf(t: UniformType): ValueKind {
    switch (t) {
        case 'float': case 'vec2': case 'vec3': case 'vec4':
        case 'mat2': case 'mat3': case 'mat4':
        case 'mat2x3': case 'mat2x4': case 'mat3x2': case 'mat3x4': case 'mat4x2': case 'mat4x3':
            return 'f'
        case 'uint': case 'uvec2': case 'uvec3': case 'uvec4':
            return 'u'
        default:
            // int / ivec / bool / bvec 在 GLSL 中按整型存储
            return 'i'
    }
}

/** 解析 uniform 完整名，识别结构体归属与结构体内路径 */
function parseStructName(name: string): { struct: string | null; memberPath: string } {
    const dot = name.indexOf('.')
    if (dot === -1) return { struct: null, memberPath: name }
    return { struct: name.slice(0, dot), memberPath: name.slice(dot + 1) }
}

/** 取字段基名（去掉结构体前缀与数组下标）："light.colors[0]" → "colors" */
function baseName(name: string): string {
    const dot = name.indexOf('.')
    const last = dot === -1 ? name : name.slice(dot + 1)
    const br = last.indexOf('[')
    return br === -1 ? last : last.slice(0, br)
}

/** 按点分 + 数组下标路径读取对象字段："colors[0]" / "inner.pos" */
function readPath(obj: any, path: string): any {
    let cur: any = obj
    const re = /([^\[]+)|\[(\d+)\]/g
    for (const seg of path.split('.')) {
        let m: RegExpExecArray | null
        while ((m = re.exec(seg)) !== null) {
            if (cur == null) return undefined
            cur = cur[m[1] ?? m[2]]
        }
    }
    return cur
}

/** 单个 Uniform 的完整信息 */
export interface UniformInfo {
    /** getActiveUniform 返回的完整名称（含结构体前缀与数组下标，如 "light.pos"、"colors[0]"） */
    name: string
    /** 去除结构体前缀与数组下标后的字段名（如 "pos"、"colors"） */
    baseName: string
    /** 语义类型名（如 "vec3"） */
    type: UniformType
    /** 原始 GL 类型码（gl.FLOAT_VEC3 等） */
    glType: number
    /** 数组长度（非数组为 1） */
    size: number
    /** 是否为数组 */
    isArray: boolean
    /** 单个元素的分量数（vec3=3、mat4=16） */
    componentCount: number
    /** 标量总数 = componentCount * size */
    length: number
    /** uniform 位置（被优化掉的为 null） */
    location: WebGLUniformLocation | null
    /** 是否结构体成员（名称中含 '.'） */
    isStruct: boolean
    /** 所属结构体名（非结构体为 null） */
    structName: string | null
    /** 结构体内的相对路径（如 "pos"、"colors[0]"、"inner.pos"） */
    memberPath: string | null
    /** 最近一次设置的值（供 sync 延迟应用） */
    value: UniformValue
    /** 待同步标记（参数变更自动检测） */
    dirty: boolean
}

/** 单个 Attribute 的完整信息 */
export interface AttributeInfo {
    /** 属性名 */
    name: string
    /** 语义类型名 */
    type: UniformType
    /** 原始 GL 类型码 */
    glType: number
    /** 数组长度（非数组为 1） */
    size: number
    /** 是否为数组 */
    isArray: boolean
    /** 单个元素的分量数 */
    componentCount: number
    /** 标量总数 = componentCount * size */
    length: number
    /** attribute location */
    location: number
}

/** Uniform Block 成员的完整信息（含字节布局） */
export interface BlockMemberInfo {
    /** 完整名（含块前缀，如 "Lights.data"） */
    name: string
    /** 去除块前缀与数组下标后的字段名 */
    baseName: string
    /** 语义类型名 */
    type: UniformType
    /** 原始 GL 类型码 */
    glType: number
    /** 数组长度（非数组为 1） */
    arraySize: number
    /** 成员在块内的字节偏移 */
    offset: number
    /** 数组元素步长（字节），非数组为 0 */
    arrayStride: number
    /** 矩阵列步长（字节），非矩阵为 0 */
    matrixStride: number
    /** 是否行主序矩阵 */
    isRowMajor: boolean
    /** 单个元素的分量数 */
    componentCount: number
    /** 单个元素字节数（矩阵为行列积，供估算） */
    sizeBytes: number
}

/** Uniform Block 的完整信息 */
export interface UniformBlockInfo {
    /** 块名 */
    name: string
    /** 块索引（getUniformBlockIndex 返回值） */
    index: number
    /** 块字节大小 */
    size: number
    /** 绑定点（默认 0） */
    binding: number
    /** 块内激活成员 */
    members: BlockMemberInfo[]
    /** 内部 UBO 缓冲（未创建为 null） */
    buffer: WebGLBuffer | null
    /** 内部缓冲数据（setUniformBlock 写入用） */
    data: ArrayBuffer | null
    /** 内部缓冲的 DataView */
    view: DataView | null
    /** 待上传标记 */
    dirty: boolean
}

/** Program 构造选项（复用已创建的 program / 着色器） */
export interface ProgramOptions {
    /** 已链接的 WebGLProgram */
    program: WebGLProgram
    /** 可选的顶点着色器（仅用于 dispose 时一并删除） */
    vertexShader?: WebGLShader
    /** 可选的片元着色器 */
    fragmentShader?: WebGLShader
    /** 是否开启自动同步（默认 true：use()/sync() 时应用全部脏参数） */
    autoSync?: boolean
    /** 调试模式：设置不存在的参数时打印警告 */
    debug?: boolean
}

/**
 * WebGL 着色器程序封装
 *
 * 用法：
 *   const program = new Program(gl, vsSource, fsSource)
 *   program.setUniform('uColor', [1, 0, 0, 1])      // 普通 uniform
 *   program.setUniform('light', { pos: [0,1,0], intensity: 2 }) // 结构体
 *   program.setUniformBlock('Lights', { data: [...] })          // UBO
 *   program.bindAttribute('aPosition', buffer, { size: 3 })
 *   program.use()
 *   gl.drawArrays(...)
 */
export class Program {
    /** 底层 WebGL 上下文（WebGL2 时兼容 WebGL1 API） */
    readonly gl: WebGLRenderingContext
    /** 是否 WebGL2 上下文 */
    readonly isWebGL2: boolean
    /** 版本号：1 或 2 */
    readonly version: 1 | 2
    /** 底层 GL 程序对象 */
    readonly program: WebGLProgram

    private readonly _gl2: WebGL2RenderingContext | null
    private readonly _autoSync: boolean
    private readonly _debug: boolean
    private readonly _ownsShaders: boolean
    private _vertexShader: WebGLShader | null = null
    private _fragmentShader: WebGLShader | null = null
    private _isBound = false

    /** 全部激活 attribute（按名索引） */
    readonly attributes = new Map<string, AttributeInfo>()
    /** 全部激活 uniform（按完整名索引，结构体成员含点号） */
    readonly uniforms = new Map<string, UniformInfo>()
    /** 结构体分组：结构体名 → 其成员 Uniform 列表 */
    readonly structs = new Map<string, UniformInfo[]>()
    /** 全部激活 uniform block（WebGL2） */
    readonly uniformBlocks = new Map<string, UniformBlockInfo>()

    /** 待同步的脏 uniform 集合 */
    private readonly _dirtyUniforms = new Set<UniformInfo>()

    // ==================== 构造与静态工厂 ====================

    /**
     * 创建 Program。
     * 传入两份源码时自动编译并链接；传入 ProgramOptions 时复用已有 program。
     */
    constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string, options?: { autoSync?: boolean; debug?: boolean })
    constructor(gl: WebGLRenderingContext, options: ProgramOptions)
    constructor(
        gl: WebGLRenderingContext,
        vertexSourceOrOptions: string | ProgramOptions,
        fragmentSource?: string,
        options: { autoSync?: boolean; debug?: boolean } = {},
    ) {
        this.gl = gl
        this.isWebGL2 = typeof (gl as WebGL2RenderingContext).getUniformBlockIndex === 'function'
        this.version = this.isWebGL2 ? 2 : 1
        this._gl2 = this.isWebGL2 ? (gl as WebGL2RenderingContext) : null
        this._autoSync = options.autoSync ?? true
        this._debug = options.debug ?? false

        if (typeof vertexSourceOrOptions === 'string') {
            if (fragmentSource === undefined) {
                throw new Error('[Program] 使用源码构造时必须同时提供 fragment shader 源码。')
            }
            // 自己编译着色器，owns 以便销毁
            const vs = this._compileShader(gl.VERTEX_SHADER, vertexSourceOrOptions)
            const fs = this._compileShader(gl.FRAGMENT_SHADER, fragmentSource)
            this.program = this._link(vs, fs)
            this._vertexShader = vs
            this._fragmentShader = fs
            this._ownsShaders = true
        } else {
            this.program = vertexSourceOrOptions.program
            this._vertexShader = vertexSourceOrOptions.vertexShader ?? null
            this._fragmentShader = vertexSourceOrOptions.fragmentShader ?? null
            this._ownsShaders = false
        }

        this._introspect()
    }

    /** 便捷静态工厂：编译并链接后返回 Program 实例 */
    static create(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string, options?: { autoSync?: boolean; debug?: boolean }): Program {
        return new Program(gl, vertexSource, fragmentSource, options)
    }

    // ==================== 编译 / 链接 ====================

    /**
     * 编译单个着色器，失败时抛出带源码行号上下文的异常。
     */
    private _compileShader(type: number, source: string): WebGLShader {
        const gl = this.gl
        const shader = gl.createShader(type)
        if (!shader) {
            throw new Error('[Program] 创建 shader 对象失败。')
        }
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader) || 'unknown error'
            gl.deleteShader(shader)
            const kind = type === gl.VERTEX_SHADER ? 'vertex' : type === gl.FRAGMENT_SHADER ? 'fragment' : String(type)
            const lines = source.split('\n').map((l, i) => `${String(i + 1).padStart(4)}: ${l}`).join('\n')
            throw new Error(`[Program] ${kind} shader 编译失败：${log}\n--- 源码 ---\n${lines}`)
        }
        return shader
    }

    /**
     * 链接顶点 + 片元着色器，失败时抛出链接错误日志。
     */
    private _link(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
        const gl = this.gl
        const program = gl.createProgram()
        if (!program) {
            throw new Error('[Program] 创建 program 对象失败。')
        }
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program) || 'unknown error'
            gl.deleteProgram(program)
            throw new Error(`[Program] program 链接失败：${log}`)
        }
        gl.detachShader(program, vs)
        gl.detachShader(program, fs)
        return program
    }

    // ==================== 参数自动识别（introspection） ====================

    /** 收集全部激活的 attribute / uniform / uniform block 信息 */
    private _introspect(): void {
        try {
            this._collectAttributes()
            this._collectUniforms()
            if (this.isWebGL2) {
                this._collectUniformBlocks()
            }
        } catch (e) {
            throw new Error(`[Program] 参数信息获取失败：${(e as Error).message}`)
        }
    }

    private _collectAttributes(): void {
        const gl = this.gl
        const count = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES) as number
        for (let i = 0; i < count; i++) {
            const info = gl.getActiveAttrib(this.program, i)
            if (!info) continue
            const type = TYPE_NAMES[info.type] ?? 'unknown'
            const comps = COMPONENT_COUNT[type]
            const location = gl.getAttribLocation(this.program, info.name)
            this.attributes.set(info.name, {
                name: info.name,
                type,
                glType: info.type,
                size: info.size,
                isArray: info.size > 1,
                componentCount: comps,
                length: comps * info.size,
                location,
            })
        }
    }

    private _collectUniforms(): void {
        const gl = this.gl
        const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS) as number
        for (let i = 0; i < count; i++) {
            const info = gl.getActiveUniform(this.program, i)
            if (!info) continue
            const type = TYPE_NAMES[info.type] ?? 'unknown'
            const comps = COMPONENT_COUNT[type]
            const { struct, memberPath } = parseStructName(info.name)
            const u: UniformInfo = {
                name: info.name,
                baseName: baseName(info.name),
                type,
                glType: info.type,
                size: info.size,
                isArray: info.size > 1,
                componentCount: comps,
                length: comps * info.size,
                location: gl.getUniformLocation(this.program, info.name),
                isStruct: struct !== null,
                structName: struct,
                memberPath: struct ? memberPath : null,
                value: undefined,
                dirty: false,
            }
            this.uniforms.set(info.name, u)
            if (struct !== null) {
                let list = this.structs.get(struct)
                if (!list) {
                    list = []
                    this.structs.set(struct, list)
                }
                list.push(u)
            }
        }
    }

    private _collectUniformBlocks(): void {
        const gl2 = this._gl2!
        const count = gl2.getProgramParameter(this.program, gl2.ACTIVE_UNIFORM_BLOCKS) as number
        for (let i = 0; i < count; i++) {
            const name = gl2.getActiveUniformBlockName(this.program, i)
            if (!name) continue
            const index = gl2.getUniformBlockIndex(this.program, name)
            const size = gl2.getActiveUniformBlockParameter(this.program, index, gl2.UNIFORM_BLOCK_DATA_SIZE) as number
            const binding = gl2.getActiveUniformBlockParameter(this.program, index, gl2.UNIFORM_BLOCK_BINDING) as number

            const block: UniformBlockInfo = {
                name,
                index,
                size,
                binding,
                members: [],
                buffer: null,
                data: null,
                view: null,
                dirty: false,
            }

            // 块内激活 uniform 的全局索引
            const indices = gl2.getActiveUniformBlockParameter(this.program, index, gl2.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES) as Uint32Array
            const indicesArr = Array.from(indices)
            if (indicesArr.length > 0) {
                const offsets = gl2.getActiveUniforms(this.program, indices, gl2.UNIFORM_OFFSET) as Int32Array
                const arrayStrides = gl2.getActiveUniforms(this.program, indices, gl2.UNIFORM_ARRAY_STRIDE) as Int32Array
                const matrixStrides = gl2.getActiveUniforms(this.program, indices, gl2.UNIFORM_MATRIX_STRIDE) as Int32Array
                const rowMajors = gl2.getActiveUniforms(this.program, indices, gl2.UNIFORM_IS_ROW_MAJOR) as Int32Array

                indicesArr.forEach((uidx, k) => {
                    const info = gl2.getActiveUniform(this.program, uidx)
                    if (!info) return
                    const type = TYPE_NAMES[info.type] ?? 'unknown'
                    const comps = COMPONENT_COUNT[type]
                    block.members.push({
                        name: info.name,
                        baseName: baseName(info.name),
                        type,
                        glType: info.type,
                        arraySize: info.size,
                        offset: offsets[k],
                        arrayStride: arrayStrides[k],
                        matrixStride: matrixStrides[k],
                        isRowMajor: rowMajors[k] !== 0,
                        componentCount: comps,
                        sizeBytes: comps * 4,
                    })
                })
            }

            this.uniformBlocks.set(name, block)
        }
    }

    // ==================== 查询接口 ====================

    /** 获取 attribute 信息（不存在返回 undefined） */
    getAttribute(name: string): AttributeInfo | undefined {
        return this.attributes.get(name)
    }

    /** 获取 uniform 信息（不存在返回 undefined） */
    getUniform(name: string): UniformInfo | undefined {
        return this.uniforms.get(name)
    }

    /** 获取 uniform block 信息（WebGL1 返回 undefined） */
    getUniformBlock(name: string): UniformBlockInfo | undefined {
        return this.uniformBlocks.get(name)
    }

    /** 是否包含指定 attribute */
    hasAttribute(name: string): boolean {
        return this.attributes.has(name)
    }

    /** 是否包含指定 uniform（含结构体成员名） */
    hasUniform(name: string): boolean {
        return this.uniforms.has(name) || this.structs.has(name)
    }

    /** 是否包含指定 uniform block */
    hasUniformBlock(name: string): boolean {
        return this.uniformBlocks.has(name)
    }

    /** 全部 attribute 信息列表 */
    getAttributesList(): AttributeInfo[] {
        return Array.from(this.attributes.values())
    }

    /** 全部 uniform 信息列表 */
    getUniformsList(): UniformInfo[] {
        return Array.from(this.uniforms.values())
    }

    /** 全部 uniform block 信息列表 */
    getUniformBlocksList(): UniformBlockInfo[] {
        return Array.from(this.uniformBlocks.values())
    }

    /** 打印全部参数信息摘要（调试用） */
    dump(): void {
        const pad = (s: string, n: number) => s.padEnd(n)
        console.group(`[Program] ${this.version === 2 ? 'WebGL2' : 'WebGL1'} 参数摘要`)
        console.log(`Attributes (${this.attributes.size}):`)
        for (const a of this.attributes.values()) {
            console.log(`  ${pad(a.name, 24)} ${pad(a.type, 12)} loc=${a.location} size=${a.size} len=${a.length}`)
        }
        console.log(`Uniforms (${this.uniforms.size}):`)
        for (const u of this.uniforms.values()) {
            console.log(`  ${pad(u.name, 24)} ${pad(u.type, 12)} loc=${u.location ? 'yes' : 'null'} size=${u.size} len=${u.length}${u.isStruct ? ` [struct:${u.structName}]` : ''}`)
        }
        if (this.uniformBlocks.size > 0) {
            console.log(`Uniform Blocks (${this.uniformBlocks.size}):`)
            for (const b of this.uniformBlocks.values()) {
                console.log(`  ${pad(b.name, 24)} size=${b.size}B binding=${b.binding}`)
                for (const m of b.members) {
                    console.log(`    ${pad(m.name, 20)} ${pad(m.type, 10)} off=${m.offset} stride=${m.arrayStride} matStride=${m.matrixStride}`)
                }
            }
        }
        console.groupEnd()
    }

    // ==================== Uniform 赋值 ====================

    /**
     * 设置 uniform 值。
     * - 普通 uniform：传标量 / 向量数组 / 矩阵（列主序）/ 采样器单元号
     * - 数组 uniform：传长度 = size * componentCount 的扁平数组
     * - 结构体：传对象，按成员路径自动分发（如 { pos: [1,2,3], colors: [...] }）
     */
    setUniform(name: string, value: UniformValue): this {
        const info = this.uniforms.get(name)
        if (info) {
            this._setUniformInfo(info, value)
            return this
        }
        // 结构体：遍历成员按相对路径取值
        const members = this.structs.get(name)
        if (members) {
            if (typeof value !== 'object' || value === null) {
                throw new Error(`[Program] 结构体 "${name}" 需要传入对象，实际为 ${typeof value}。`)
            }
            for (const m of members) {
                const v = readPath(value, m.memberPath!)
                if (v !== undefined) {
                    this._setUniformInfo(m, v)
                }
            }
            return this
        }
        this._warnUnknown('uniform', name)
        return this
    }

    /** 批量设置 uniform（键可以是普通名或结构体名） */
    setUniforms(values: Record<string, UniformValue>): this {
        for (const [name, value] of Object.entries(values)) {
            this.setUniform(name, value)
        }
        return this
    }

    private _setUniformInfo(info: UniformInfo, value: UniformValue): void {
        info.value = value
        if (this._autoSync && this._isBound) {
            // 程序已在用：立即应用，不留脏标记
            this._applyUniform(info)
            info.dirty = false
            this._dirtyUniforms.delete(info)
        } else {
            // 尚未绑定：标记为脏，use()/sync() 时统一应用
            info.dirty = true
            this._dirtyUniforms.add(info)
        }
    }

    // ==================== Uniform Block（UBO） ====================

    /**
     * 将 uniform block 绑定到指定 binding point（WebGL2）。
     * 返回该 block 信息。
     */
    bindUniformBlock(name: string, binding: number): UniformBlockInfo | null {
        if (!this.isWebGL2) {
            this._warn('uniform block', '当前为 WebGL1 上下文，不支持 Uniform Block。')
            return null
        }
        const gl2 = this._gl2!
        const block = this.uniformBlocks.get(name)
        if (!block) {
            this._warnUnknown('uniform block', name)
            return null
        }
        gl2.uniformBlockBinding(this.program, block.index, binding)
        block.binding = binding
        return block
    }

    /**
     * 为 uniform block 创建内部 UBO 缓冲（大小为块尺寸），并返回之。
     * 调用后可用 setUniformBlock 写值，内部缓冲会在 sync() 时自动上传。
     */
    createUniformBlockBuffer(name: string): WebGLBuffer | null {
        if (!this.isWebGL2) {
            this._warn('uniform block', '当前为 WebGL1 上下文，不支持 Uniform Block。')
            return null
        }
        const gl2 = this._gl2!
        const block = this.uniformBlocks.get(name)
        if (!block) {
            this._warnUnknown('uniform block', name)
            return null
        }
        const buffer = gl2.createBuffer()
        if (!buffer) {
            throw new Error(`[Program] 创建 UBO 缓冲失败：${name}`)
        }
        gl2.bindBuffer(gl2.UNIFORM_BUFFER, buffer)
        gl2.bufferData(gl2.UNIFORM_BUFFER, block.size, gl2.DYNAMIC_DRAW)
        block.buffer = buffer
        return buffer
    }

    /**
     * 为 uniform block 赋值。
     * 内部缓冲不存在时自动创建；若尚未绑定到 binding point 会使用块默认 binding。
     * 值按成员字节偏移写入，sync() 或 use() 时自动上传。
     */
    setUniformBlock(name: string, values: Record<string, UniformValue>): this {
        if (!this.isWebGL2) {
            this._warn('uniform block', '当前为 WebGL1 上下文，不支持 Uniform Block。')
            return this
        }
        const block = this.uniformBlocks.get(name)
        if (!block) {
            this._warnUnknown('uniform block', name)
            return this
        }
        if (!block.buffer) {
            this.createUniformBlockBuffer(name)
        }
        if (!block.data) {
            block.data = new ArrayBuffer(block.size)
            block.view = new DataView(block.data)
        }
        for (const member of block.members) {
            const v = values[member.baseName] ?? values[member.name]
            if (v !== undefined) {
                this._writeBlockMember(block.view!, member, v)
            }
        }
        block.dirty = true
        return this
    }

    /** 将成员值按布局写入 DataView（处理标量 / 向量 / 矩阵 / 数组） */
    private _writeBlockMember(view: DataView, m: BlockMemberInfo, value: UniformValue): void {
        const dims = matrixDims(m.type)
        const kind = dims ? 'f' : valueKindOf(m.type)
        const comps = m.componentCount
        const count = Math.max(m.arraySize, 1)
        const arr = this._coerce(value, kind, comps * count)

        if (dims) {
            const [cols, rows] = dims
            const colBytes = m.matrixStride > 0 ? m.matrixStride : rows * 4
            const elemBytes = m.arrayStride > 0 ? m.arrayStride : comps * 4
            for (let e = 0; e < count; e++) {
                const elemBase = m.offset + e * elemBytes
                for (let c = 0; c < cols; c++) {
                    const colBase = elemBase + c * colBytes
                    for (let r = 0; r < rows; r++) {
                        view.setFloat32(colBase + r * 4, arr[e * comps + c * rows + r])
                    }
                }
            }
        } else {
            const elemBytes = m.arrayStride > 0 ? m.arrayStride : comps * 4
            for (let i = 0; i < comps * count; i++) {
                const elem = Math.floor(i / comps)
                const off = m.offset + elem * elemBytes + (i % comps) * 4
                if (kind === 'f') view.setFloat32(off, arr[i])
                else if (kind === 'u') view.setUint32(off, arr[i])
                else view.setInt32(off, arr[i])
            }
        }
    }

    // ==================== Attribute 绑定 ====================

    /**
     * 将顶点缓冲绑定到 attribute 并启用。
     * opts 缺省时自动使用 shader 声明的类型与分量数。
     */
    bindAttribute(
        name: string,
        buffer: WebGLBuffer,
        opts?: {
            size?: number
            type?: number
            normalized?: boolean
            stride?: number
            offset?: number
            divisor?: number
        },
    ): this {
        const gl = this.gl
        const info = this.attributes.get(name)
        if (!info) {
            this._warnUnknown('attribute', name)
            return this
        }
        const location = info.location
        if (location < 0) return this
        const size = opts?.size ?? Math.min(info.componentCount, 4)
        const type = opts?.type ?? info.glType
        gl.enableVertexAttribArray(location)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.vertexAttribPointer(location, size, type, opts?.normalized ?? false, opts?.stride ?? 0, opts?.offset ?? 0)
        if (opts?.divisor !== undefined && this.isWebGL2) {
            this._gl2!.vertexAttribDivisor(location, opts.divisor)
        }
        return this
    }

    /** 设置常量顶点属性（不依赖顶点缓冲，vertexAttrib4f） */
    setConstantAttribute(name: string, v0: number, v1 = 0, v2 = 0, v3 = 1): this {
        const gl = this.gl
        const info = this.attributes.get(name)
        if (!info) {
            this._warnUnknown('attribute', name)
            return this
        }
        gl.vertexAttrib4f(info.location, v0, v1, v2, v3)
        return this
    }

    // ==================== 使用与同步 ====================

    /** 绑定程序并同步全部脏参数（返回 this 便于链式） */
    use(): this {
        this.gl.useProgram(this.program)
        this._isBound = true
        this.sync()
        return this
    }

    /**
     * 同步参数：应用全部待同步（dirty）的 uniform，并上传脏的 UBO 缓冲。
     * 若程序尚未被 use()，会自动先绑定。
     */
    sync(force = false): this {
        const gl = this.gl
        if (!this._isBound || force) {
            gl.useProgram(this.program)
            this._isBound = true
        }
        if (this._dirtyUniforms.size > 0) {
            for (const info of this._dirtyUniforms) {
                this._applyUniform(info)
                info.dirty = false
            }
            this._dirtyUniforms.clear()
        }
        if (this.isWebGL2) {
            for (const block of this.uniformBlocks.values()) {
                if (block.dirty && block.buffer && block.data) {
                    this._uploadBlock(block)
                    block.dirty = false
                }
            }
        }
        return this
    }

    /** 上传 UBO 缓冲的脏区间到 GL */
    private _uploadBlock(block: UniformBlockInfo): void {
        const gl2 = this._gl2!
        gl2.bindBuffer(gl2.UNIFORM_BUFFER, block.buffer)
        gl2.bufferSubData(gl2.UNIFORM_BUFFER, 0, block.data!)
        gl2.bindBufferBase(gl2.UNIFORM_BUFFER, block.binding, block.buffer)
    }

    /** 解绑程序（之后其他 program 可绑定） */
    unbind(): this {
        this.gl.useProgram(null)
        this._isBound = false
        return this
    }

    // ==================== 底层 uniform 应用（类型感知） ====================

    /**
     * 按信息将缓存的 value 应用到 location。
     * info.dirty 由调用方管理；此处只负责 GL 调用。
     */
    private _applyUniform(info: UniformInfo): void {
        const gl = this.gl
        const loc = info.location
        if (!loc) return
        const value = info.value

        // 标量 / 采样器
        switch (info.type) {
            case 'float': {
                if (info.size === 1) gl.uniform1f(loc, this._scalar(value, 'f'))
                else gl.uniform1fv(loc, this._coerce(value, 'f', info.size))
                return
            }
            case 'int': case 'bool': {
                if (info.size === 1) gl.uniform1i(loc, Math.round(this._scalar(value, 'i')))
                else gl.uniform1iv(loc, this._coerce(value, 'i', info.size) as Int32Array)
                return
            }
            case 'uint': {
                const gl2 = this._gl2
                if (!gl2) return
                if (info.size === 1) gl2.uniform1ui(loc, Math.round(this._scalar(value, 'u')))
                else gl2.uniform1uiv(loc, this._coerce(value, 'u', info.size) as Uint32Array)
                return
            }
            case 'sampler2D': case 'sampler3D': case 'samplerCube':
            case 'sampler2DShadow': case 'sampler2DArray': case 'sampler2DArrayShadow': case 'samplerCubeShadow':
                gl.uniform1i(loc, this._scalar(value, 'i'))
                return
            default:
                break
        }

        const dims = matrixDims(info.type)
        const comps = info.componentCount
        const total = comps * info.size

        if (dims) {
            const arr = this._coerce(value, 'f', total) as Float32Array
            const gl2 = this._gl2
            switch (info.type) {
                case 'mat2': gl.uniformMatrix2fv(loc, false, arr); break
                case 'mat3': gl.uniformMatrix3fv(loc, false, arr); break
                case 'mat4': gl.uniformMatrix4fv(loc, false, arr); break
                // 非方形矩阵为 WebGL2 专有 API
                case 'mat2x3': gl2?.uniformMatrix2x3fv(loc, false, arr); break
                case 'mat2x4': gl2?.uniformMatrix2x4fv(loc, false, arr); break
                case 'mat3x2': gl2?.uniformMatrix3x2fv(loc, false, arr); break
                case 'mat3x4': gl2?.uniformMatrix3x4fv(loc, false, arr); break
                case 'mat4x2': gl2?.uniformMatrix4x2fv(loc, false, arr); break
                case 'mat4x3': gl2?.uniformMatrix4x3fv(loc, false, arr); break
                default: break
            }
            return
        }

        // 向量
        const kind = valueKindOf(info.type)
        if (kind === 'u') {
            const gl2 = this._gl2
            if (!gl2) return
            const arr = this._coerce(value, 'u', total) as Uint32Array
            if (comps === 2) gl2.uniform2uiv(loc, arr)
            else if (comps === 3) gl2.uniform3uiv(loc, arr)
            else if (comps === 4) gl2.uniform4uiv(loc, arr)
        } else if (kind === 'i') {
            const arr = this._coerce(value, 'i', total) as Int32Array
            if (comps === 2) gl.uniform2iv(loc, arr)
            else if (comps === 3) gl.uniform3iv(loc, arr)
            else if (comps === 4) gl.uniform4iv(loc, arr)
        } else {
            const arr = this._coerce(value, 'f', total) as Float32Array
            if (comps === 2) gl.uniform2fv(loc, arr)
            else if (comps === 3) gl.uniform3fv(loc, arr)
            else if (comps === 4) gl.uniform4fv(loc, arr)
        }
    }

    /** 提取标量值 */
    private _scalar(value: UniformValue, kind: ValueKind): number {
        if (typeof value === 'number') return value
        if (typeof value === 'boolean') return value ? 1 : 0
        if (value == null) return 0
        const v = (value as ArrayLike<number>)[0] ?? 0
        return typeof v === 'boolean' ? (v ? 1 : 0) : v
    }

    /** 将任意值统一补齐为 count 长度的 TypedArray */
    private _coerce(value: UniformValue, kind: ValueKind, count: number): Float32Array | Int32Array | Uint32Array {
        const src: number[] = []
        if (typeof value === 'number') src.push(value)
        else if (typeof value === 'boolean') src.push(value ? 1 : 0)
        else if (value != null) {
            const list = value as ArrayLike<number | boolean>
            for (let i = 0; i < list.length; i++) {
                const v = list[i]
                src.push(typeof v === 'boolean' ? (v ? 1 : 0) : v)
            }
        }
        const n = Math.min(src.length, count)
        const padded = new Array<number>(count).fill(0)
        for (let i = 0; i < n; i++) padded[i] = src[i]
        if (kind === 'f') return Float32Array.from(padded)
        if (kind === 'u') return Uint32Array.from(padded)
        return Int32Array.from(padded)
    }

    // ==================== 错误与警告 ====================

    private _warnUnknown(kind: string, name: string): void {
        if (this._debug) {
            console.warn(`[Program] 未找到 ${kind} "${name}"（可能已被编译器优化掉或名称拼写错误）。`)
        }
    }

    private _warn(kind: string, msg: string): void {
        if (this._debug) {
            console.warn(`[Program] ${kind}: ${msg}`)
        }
    }

    // ==================== 销毁 ====================

    /** 释放程序与着色器资源（含内部 UBO 缓冲） */
    dispose(): void {
        const gl = this.gl
        if (this._ownsShaders) {
            if (this._vertexShader) gl.deleteShader(this._vertexShader)
            if (this._fragmentShader) gl.deleteShader(this._fragmentShader)
            this._vertexShader = null
            this._fragmentShader = null
        }
        for (const block of this.uniformBlocks.values()) {
            if (block.buffer) {
                gl.deleteBuffer(block.buffer)
                block.buffer = null
            }
            block.data = null
            block.view = null
        }
        gl.deleteProgram(this.program)
        this.attributes.clear()
        this.uniforms.clear()
        this.structs.clear()
        this.uniformBlocks.clear()
        this._dirtyUniforms.clear()
        this._isBound = false
    }
}
