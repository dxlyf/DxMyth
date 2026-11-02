/**
 * WebGL 扩展的类型化访问与缓存。
 *
 * `getExtension` 每次调用都会查询驱动，这里按名称缓存结果，
 * 同时为常用扩展提供带类型的 getter。
 */
export class ExtensionRegistry {
  readonly #gl: WebGLRenderingContext;
  readonly #cache = new Map<string, unknown>();

  constructor(gl: WebGLRenderingContext) {
    this.#gl = gl;
  }

  /** 获取扩展对象；不存在时返回 `null`。 */
  get<T>(name: string): T | null {
    if (!this.#cache.has(name)) {
      this.#cache.set(name, this.#gl.getExtension(name));
    }
    return (this.#cache.get(name) as T | null | undefined) ?? null;
  }

  /** 扩展是否可用。 */
  has(name: string): boolean {
    return this.get(name) !== null;
  }

  /** 顶点数组对象扩展（WebGL1）。 */
  get vertexArrayObject(): OES_vertex_array_object | null {
    return this.get<OES_vertex_array_object>('OES_vertex_array_object');
  }

  /** 实例化绘制扩展。 */
  get instancedArrays(): ANGLE_instanced_arrays | null {
    return this.get<ANGLE_instanced_arrays>('ANGLE_instanced_arrays');
  }

  /** 主动丢失上下文扩展，测试和清理时使用。 */
  get loseContext(): WEBGL_lose_context | null {
    return this.get<WEBGL_lose_context>('WEBGL_lose_context');
  }

  /** 深度纹理扩展。 */
  get depthTexture(): WEBGL_depth_texture | null {
    return this.get<WEBGL_depth_texture>('WEBGL_depth_texture');
  }

  /** 32 位索引扩展。 */
  get elementIndexUint(): OES_element_index_uint | null {
    return this.get<OES_element_index_uint>('OES_element_index_uint');
  }

  /** 浮点纹理扩展。 */
  get textureFloat(): OES_texture_float | null {
    return this.get<OES_texture_float>('OES_texture_float');
  }

  /** 半浮点纹理扩展。 */
  get textureHalfFloat(): OES_texture_half_float | null {
    return this.get<OES_texture_half_float>('OES_texture_half_float');
  }

  /** 各向异性过滤扩展。 */
  get anisotropicFiltering(): EXT_texture_filter_anisotropic | null {
    return this.get<EXT_texture_filter_anisotropic>('EXT_texture_filter_anisotropic');
  }

  /** 当前环境支持的扩展名列表。 */
  get supportedNames(): readonly string[] {
    return this.#gl.getSupportedExtensions() ?? [];
  }
}
