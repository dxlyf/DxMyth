type GL = WebGL2RenderingContext;
export type ShaderProgramConfig = {
    vert: string;
    frag: string;
    uniforms: Record<string, UniformInfo>;
    attributes: Record<string, AttributeInfo>;
};
type UniformInfoType = 'single' | 'array' | 'struct' | 'block' | 'block-member';
export type UniformInfo<T extends UniformInfoType = UniformInfoType, Value = any> = {
    name: string;
    locationName?: string;
    type: T;
    glType: number;
    size: number;
    location: WebGLUniformLocation | null;
    uniforms?: Record<string, UniformInfo> | UniformInfo[] | null;
    blockIndex?: number;
    blockBinding?: number;
    value?: Value;
};
export type AttributeInfo = {
    name: string;
    type: number;
    size: number;
    location: number;
    isArray: boolean;
};
export type UniformBlockInfo = {
    name: string;
    index: number;
    size: number;
    activeUniforms: number;
    binding: number;
};
export type UniformInfos = Record<string, UniformInfo>;
export type AttributeInfos = Record<string, AttributeInfo>;
export type PrecisionType = 'lowp' | 'mediump' | 'highp';
export type CreateProgramFactoryConfig = {};
export declare function createProgramFactory(factoryConfig: CreateProgramFactoryConfig): void;
/**
     * 创建 WebGL 程序
     * @param {GL} gl WebGL2 上下文
     * @param {string} vertexShaderSource 顶点着色器源码
     * @param {string} fragmentShaderSource 片段着色器源码
     * @returns 创建的程序对象
     */
export declare function createWebGLProgram(gl: GL, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram | null;
/**
 * 编译着色器
 * @param gl WebGL2 上下文
 * @param type 着色器类型
 * @param source 着色器源码
 * @returns 编译后的着色器
 */
export declare function createWebGLShader(gl: GL, type: number, source: string): WebGLShader | null;
/**
 * 创建缓冲区
 * @param gl WebGL2 上下文
 * @param data 缓冲区数据
 * @param usage 使用方式 (默认为 gl.STATIC_DRAW)
 * @returns 创建的缓冲区
 */
export declare function createBuffer(gl: GL, data: ArrayBufferView, usage?: number): WebGLBuffer | null;
/**
 * 创建索引缓冲区
 * @param gl WebGL2 上下文
 * @param indices 索引数据
 * @param usage 使用方式 (默认为 gl.STATIC_DRAW)
 * @returns 创建的索引缓冲区
 */
export declare function createIndexBuffer(gl: GL, indices: ArrayBufferView, usage?: number): WebGLBuffer | null;
/**
 * 创建纹理
 * @param gl WebGL2 上下文
 * @param options 纹理选项
 * @returns 创建的纹理
 */
export declare function createTexture(gl: GL, options?: {
    src?: TexImageSource | null;
    width?: number;
    height?: number;
    format?: number;
    internalFormat?: number;
    type?: number;
    wrapS?: number;
    wrapT?: number;
    minFilter?: number;
    magFilter?: number;
    generateMipmap?: boolean;
}): WebGLTexture | null;
/**
 * 设置顶点属性指针
 * @param gl WebGL2 上下文
 * @param program 程序对象
 * @param name 属性名
 * @param size 每个顶点分量数
 * @param type 数据类型
 * @param normalized 是否归一化
 * @param stride 步长
 * @param offset 偏移量
 */
export declare function setAttributePointer(gl: GL, program: WebGLProgram, name: string, size: number, type: number, normalized?: boolean, stride?: number, offset?: number): void;
/**
 * 设置统一变量(uniform)
 * @param gl WebGL2 上下文
 * @param location 位置
 * @param name uniform名称
 * @param value 值
 */
export declare function setUniform(gl: GL, location: WebGLUniformLocation, name: string, value: number | number[] | Float32List | Int32List): void;
/**
 * 清除画布
 * @param gl WebGL2 上下文
 * @param color 清除颜色 [r, g, b, a]
 */
export declare function clear(gl: GL, color?: [number, number, number, number]): void;
export declare function getGLSLTypeName(gl: GL, type: number): string;
/**
 * 获取程序中所有激活的uniform信息
 * @param gl WebGL2上下文
 * @param program 程序对象
 * @returns uniform信息数组
 */
export declare function getActiveUniforms(gl: GL, program: WebGLProgram): UniformInfos;
/**
* 获取程序中所有激活的attribute信息
* @param gl WebGL2上下文
* @param program 程序对象
* @returns attribute信息数组
*/
export declare function getActiveAttributes(gl: GL, program: WebGLProgram): AttributeInfo[];
/**
* 获取uniform block信息
* @param gl WebGL2上下文
* @param program 程序对象
* @param blockIndex block索引
* @returns block信息
*/
export declare function getUniformBlockInfo(gl: GL, program: WebGLProgram, blockIndex: number): UniformBlockInfo;
/**
* 设置数组uniform
* @param gl WebGL2上下文
* @param program 程序对象
* @param baseName uniform基础名称(不带数组下标)
* @param values 值数组
* @param setter 单个元素的设置函数
*/
export declare function setUniformArray<T>(gl: GL, program: WebGLProgram, baseName: string, values: T[], setter: (location: WebGLUniformLocation | null, value: T) => void): void;
/**
 *  * // 设置uniform block绑定
GL.setUniformBlockBinding(gl, program, 'LightBlock', 0);

// 创建uniform buffer
const lightData = new Float32Array([...ambient, ...diffuse, ...position]);
const ubo = GL.createUniformBuffer(gl, lightData);

// 绑定到绑定点0
GL.bindUniformBuffer(gl, ubo, 0);
 *
* 设置uniform block的绑定点
* @param gl WebGL2上下文
* @param program 程序对象
* @param blockName block名称
* @param bindingPoint 绑定点索引
*/
export declare function setUniformBlockBinding(gl: GL, program: WebGLProgram, blockName: string, bindingPoint: number): void;
/**
* 创建uniform buffer对象
* @param gl WebGL2上下文
* @param data 初始数据
* @param usage 使用方式
* @returns 创建的UBO
*/
export declare function createUniformBuffer(gl: GL, data?: ArrayBufferView | null, usage?: number): WebGLBuffer | null;
/**
* 设置顶点属性指针(支持数组属性)
* @param gl WebGL2上下文
* @param program 程序对象
* @param name 属性名称
* @param buffer 缓冲区对象
* @param size 每个顶点分量数
* @param type 数据类型
* @param normalized 是否归一化
* @param stride 步长
* @param offset 偏移量
* @param divisor 实例化除数(可选)
*/
export declare function setAttributePointerAdvanced(gl: GL, program: WebGLProgram, name: string, buffer: WebGLBuffer, size: number, type?: number, normalized?: boolean, stride?: number, offset?: number, divisor?: number): void;
/**
* 绑定uniform buffer到绑定点
* @param gl WebGL2上下文
* @param buffer uniform buffer对象
* @param bindingPoint 绑定点索引
* @param offset 偏移量
* @param size 数据大小
*/
export declare function bindUniformBuffer(gl: GL, buffer: WebGLBuffer, bindingPoint: number, offset?: number, size?: number): void;
/**
* 设置顶点属性(支持数组属性)
* @param gl WebGL2上下文
* @param program 程序对象
* @param name 属性名称
* @param values 属性值数组
* @param size 每个顶点分量数
* @param type 数据类型
* @param normalized 是否归一化
*/
export declare function setAttributeValues(gl: GL, program: WebGLProgram, name: string, values: number[] | Float32Array, size: number, type?: number, normalized?: boolean): void;
export declare function updateBuffer(gl: GL, buffer: WebGLBuffer, data: ArrayBufferView, usage?: number): void;
export declare function createVAO(gl: GL): WebGLVertexArrayObject | null;
export declare function setupVAO(gl: GL, vao: WebGLVertexArrayObject, program: WebGLProgram, attributes: Array<{
    name: string;
    buffer: WebGLBuffer;
    size: number;
    type?: number;
    normalized?: boolean;
    stride?: number;
    offset?: number;
    divisor?: number;
}>): void;
export declare function createFramebuffer(gl: GL): WebGLFramebuffer | null;
export declare function attachTextureToFramebuffer(gl: GL, framebuffer: WebGLFramebuffer, texture: WebGLTexture, attachment?: number): void;
export declare function checkFramebufferStatus(gl: GL, framebuffer: WebGLFramebuffer): boolean;
export {};
