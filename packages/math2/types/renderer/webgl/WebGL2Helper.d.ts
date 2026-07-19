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
    contextAttributes?: WebGLContextAttributes;
    /** 初始化模式：'2d' 适合 2D 渲染（预乘 alpha 混合、无深度测试、无剔除）；'3d' 为标准模式 */
    mode?: '2d' | '3d';
    /** 清屏颜色 */
    clearColor?: [number, number, number, number];
    /** 是否启用错误检查（生产环境可关闭以提升性能） */
    debug?: boolean;
}
export interface TextureParams {
    minFilter?: number;
    magFilter?: number;
    wrapS?: number;
    wrapT?: number;
    wrapR?: number;
    /** 各向异性过滤倍数（若扩展可用） */
    anisotropy?: number;
    /** 是否生成 mipmap */
    generateMipmap?: boolean;
    /** 比较 mode（用于 shadow map） */
    compareFunc?: number;
}
export interface FramebufferOptions {
    /** 颜色附件纹理（已创建），不传则自动创建 */
    colorTexture?: WebGLTexture;
    /** 是否创建深度/模板渲染缓冲 */
    depth?: boolean;
    stencil?: boolean;
    /** 内部颜色格式 */
    internalFormat?: number;
    format?: number;
    type?: number;
}
export type BlendPreset = 'none' | 'alpha' | 'premultiplied' | 'additive' | 'multiply' | 'screen';
export declare class WebGL2Helper {
    readonly gl: WebGL2RenderingContext;
    readonly canvas: HTMLCanvasElement;
    dpr: number;
    mode: '2d' | '3d';
    debug: boolean;
    private programCache;
    private uniformLocationCache;
    private attribLocationCache;
    /** 资源追踪集合，便于 destroy() 一次性释放 */
    private resources;
    /** 各向异性扩展（若可用） */
    private anisotropicExt;
    constructor(canvas: HTMLCanvasElement | string, options?: WebGL2HelperOptions | WebGLContextAttributes);
    /**
     * 设置视口、清除颜色与默认状态。
     * mode='2d'：关闭深度/剔除，启用预乘 alpha 混合。
     * mode='3d'：启用深度测试与背面剔除。
     */
    init(clearColor?: [number, number, number, number]): void;
    /** 切换混合模式预设 */
    setBlendPreset(preset: BlendPreset): void;
    /** 设置视口 */
    viewport(x: number, y: number, width: number, height: number): void;
    /** 检查 WebGL 错误，debug 模式下打印。返回错误码（0 表示无错误） */
    checkError(tag?: string): number;
    private errorName;
    /** 编译单个着色器，失败时附带源码行号便于调试 */
    compileShader(source: string, type: number): WebGLShader;
    /**
     * 创建着色器程序（顶点 + 片元），可选 transform feedback varyings。
     * 同源码的程序会被缓存复用。
     */
    createProgram(vertexSource: string, fragmentSource: string, transformFeedbackVaryings?: string[], cacheKey?: string): WebGLProgram;
    /** 使用程序 */
    useProgram(program: WebGLProgram | null): void;
    /** 获取 uniform 位置（带缓存） */
    getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null;
    /** 获取 attribute 位置（带缓存） */
    getAttribLocation(program: WebGLProgram, name: string): number;
    /**
     * 设置 uniform（自动检测类型）。
     * 支持标量、向量、矩阵、整型、布尔、数组。
     *
     * 矩阵类型推断：长度 4 → mat2，9 → mat3，16 → mat4。
     * 若需显式指定矩阵或 transpose，请用 setUniformMatrix。
     */
    setUniform(program: WebGLProgram, name: string, value: any): void;
    /** 显式设置矩阵 uniform */
    setUniformMatrix(loc: WebGLUniformLocation, value: Float32Array, transpose?: boolean): void;
    setUniformMatrix(program: WebGLProgram, name: string, value: Float32Array, transpose?: boolean): void;
    /** 应用 uniform 值到 location */
    private applyUniform;
    /** 创建并填充缓冲区（默认 target = ARRAY_BUFFER，usage = STATIC_DRAW） */
    createBuffer(data: BufferSource, target?: number, usage?: number): WebGLBuffer;
    /** 创建空缓冲区（按 size 字节），常用于动态更新的 VBO/UBO */
    createEmptyBuffer(size: number, target?: number, usage?: number): WebGLBuffer;
    /** 更新缓冲区数据（整体替换） */
    updateBuffer(buffer: WebGLBuffer, data: BufferSource, target?: number, offset?: number): void;
    /** 创建并绑定索引缓冲区 */
    createIndexBuffer(data: BufferSource, usage?: number): WebGLBuffer;
    /**
     * 创建 UBO（Uniform Buffer Object）。
     * WebGL2 中 UBO 通过 glBindBufferBase(GL_UNIFORM_BUFFER, binding, buf) 绑定到 binding point。
     */
    createUniformBuffer(data: BufferSource | number, usage?: number): WebGLBuffer;
    /** 将 UBO 绑定到指定 binding point */
    bindUniformBufferBase(buffer: WebGLBuffer, binding: number): void;
    /** 将 UBO 一段范围绑定到 binding point */
    bindUniformBufferRange(buffer: WebGLBuffer, binding: number, offset: number, size: number): void;
    /** 将 program 的 uniform block 绑定到指定 binding point */
    bindUniformBlock(program: WebGLProgram, blockName: string, binding: number): void;
    /** 创建并绑定 VAO，返回之。传入 callback 在 VAO 绑定期间配置 attribute */
    createVAO(callback?: (vao: WebGLVertexArrayObject) => void): WebGLVertexArrayObject;
    /** 绑定 VAO（传 null 解绑） */
    bindVAO(vao: WebGLVertexArrayObject | null): void;
    /**
     * 绑定 attribute（在 VAO 已绑定的情况下调用）。
     * 通过 program + name 解析 location（带缓存）。
     */
    setAttribute(program: WebGLProgram, name: string, size: number, type?: number, normalized?: boolean, stride?: number, offset?: number): void;
    /** 直接通过 attribute location 绑定（无需 program） */
    setAttributeByLocation(loc: number, size: number, type?: number, normalized?: boolean, stride?: number, offset?: number): void;
    /** 设置整数型 attribute（WebGL2 专有，避免浮点转换） */
    setAttributeI(program: WebGLProgram, name: string, size: number, type?: number, stride?: number, offset?: number): void;
    /** 设置 attribute 的 divisor（用于实例化绘制 instancing） */
    setAttributeDivisor(program: WebGLProgram, name: string, divisor: number): void;
    /**
     * 创建 2D 纹理。
     * data 为 null 时创建空纹理（常用于 FBO 颜色附件）。
     */
    createTexture2D(width: number, height: number, data: ArrayBufferView | null, params?: TextureParams & {
        internalFormat?: number;
        format?: number;
        type?: number;
    }): WebGLTexture;
    /** 更新纹理（部分区域），用于视频帧、动态纹理等 */
    updateTexture2D(texture: WebGLTexture, x: number, y: number, width: number, height: number, data: ArrayBufferView, format?: number, type?: number): void;
    /** 应用纹理参数到当前绑定的纹理 */
    private applyTextureParams;
    /** 生成 mipmap */
    generateMipmap(texture: WebGLTexture): void;
    /** 激活纹理单元并绑定纹理 */
    bindTexture2D(texture: WebGLTexture, unit?: number): void;
    /** 创建 Sampler 对象（WebGL2 专有，独立于纹理的过滤/包装参数） */
    createSampler(params?: TextureParams): WebGLSampler;
    /** 绑定 Sampler 到纹理单元 */
    bindSampler(sampler: WebGLSampler, unit?: number): void;
    /**
     * 创建 Framebuffer 并附加颜色（可选深度/模板）。
     * 返回 { fbo, colorTexture, depthRenderbuffer }。
     */
    createFramebuffer(width: number, height: number, options?: FramebufferOptions): {
        fbo: WebGLFramebuffer;
        colorTexture: WebGLTexture;
        depthRenderbuffer?: WebGLRenderbuffer;
    };
    private framebufferStatusName;
    /** 绑定 FBO（传 null 绑定默认画布） */
    bindFramebuffer(fbo: WebGLFramebuffer | null): void;
    /** 创建 Renderbuffer（用于深度/模板附件） */
    createRenderbuffer(width: number, height: number, internalFormat?: number): WebGLRenderbuffer;
    /** 绘制（基于数组） */
    drawArrays(mode: number, first: number, count: number): void;
    /** 绘制（基于索引） */
    drawElements(mode: number, count: number, type?: number, offset?: number): void;
    /** 实例化绘制（基于数组） */
    drawArraysInstanced(mode: number, first: number, count: number, instanceCount: number): void;
    /** 实例化绘制（基于索引） */
    drawElementsInstanced(mode: number, count: number, type: number, offset: number, instanceCount: number): void;
    /** 清除缓冲（默认颜色 + 深度） */
    clear(mask?: number): void;
    /** 读取像素（RGBA UNSIGNED_BYTE） */
    readPixels(x: number, y: number, width: number, height: number, format?: number, type?: number): Uint8Array;
    /** 调整画布尺寸（支持 DPR，会更新 CSS 尺寸） */
    setSize(width: number, height: number, dpr?: number, updateStyle?: boolean): void;
    /** 删除单个资源 */
    deleteProgram(program: WebGLProgram): void;
    deleteBuffer(buffer: WebGLBuffer): void;
    deleteTexture(texture: WebGLTexture): void;
    deleteVAO(vao: WebGLVertexArrayObject): void;
    deleteFramebuffer(fbo: WebGLFramebuffer): void;
    deleteRenderbuffer(rbo: WebGLRenderbuffer): void;
    deleteSampler(sampler: WebGLSampler): void;
    /** 销毁所有追踪的资源 */
    destroy(): void;
    /** 简易字符串哈希（FNV-1a 32bit）用于 program 缓存 key */
    private hashSources;
    private fnv1a;
}
