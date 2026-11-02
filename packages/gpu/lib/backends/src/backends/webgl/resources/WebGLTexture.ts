import type { SamplerDesc, TextureDesc } from '../../../core/descriptors';
import { BackendError, UnsupportedError, ValidationError } from '../../../core/errors';
import type { TextureFormat, TextureUsage } from '../../../core/enums';
import { bytesPerPixel, isDepthFormat, isStencilFormat } from '../../../core/format';
import { Resource } from '../../../core/Resource';
import type { NativeTexture } from '../native';
import type { WebGLContext } from '../WebGLContext';
import { textureFormat, type GLTextureFormat } from '../util/glEnums';
import { WebGLSampler } from './WebGLSampler';

/** 纹理上传的附加参数。 */
export interface TextureUploadOptions {
  level?: number;
  width?: number;
  height?: number;
}

/**
 * WebGL 二维纹理封装。
 *
 * 构造时会分配存储；WebGL2 使用不可变的 `texStorage2D`，
 * WebGL1 使用 `texImage2D`。`upload` 只做子区域更新，
 * 需要重新分配请使用 `setImage`（仅 WebGL1）。
 */
export class WebGLTexture extends Resource<NativeTexture> {
  readonly width: number;
  readonly height: number;
  readonly format: TextureFormat;
  readonly usage: TextureUsage;
  readonly mipLevelCount: number;
  readonly target: number;
  readonly #context: WebGLContext;
  readonly #webgl2: boolean;
  readonly #internal: GLTextureFormat;
  readonly #desc: TextureDesc;
  #samplerDesc: SamplerDesc;

  constructor(context: WebGLContext, native: NativeTexture, desc: TextureDesc) {
    super(native, { label: desc.label });
    this.#context = context;
    const gl = context.gl;
    this.#webgl2 = typeof (gl as WebGL2RenderingContext).texStorage2D === 'function';
    this.target = gl.TEXTURE_2D;

    const width = desc.width;
    const height = desc.height ?? 1;
    if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
      throw new ValidationError('纹理尺寸必须是大于 0 的整数');
    }
    if (desc.dimension !== undefined && desc.dimension !== '2d') {
      throw new UnsupportedError(`纹理维度 ${desc.dimension}（当前仅支持 2D）`, 'webgl');
    }
    if ((desc.depthOrArrayLayers ?? 1) !== 1) {
      throw new UnsupportedError('纹理数组 / 3D 纹理', 'webgl');
    }
    if ((desc.sampleCount ?? 1) !== 1) {
      throw new UnsupportedError('多重采样纹理', 'webgl');
    }
    if (isStencilFormat(desc.format) && !isDepthFormat(desc.format)) {
      throw new UnsupportedError(`仅模板格式 ${desc.format} 不能作为纹理`, 'webgl');
    }
    if (!this.#webgl2 && isDepthFormat(desc.format) && context.extensions.depthTexture === null) {
      throw new UnsupportedError('深度纹理（缺少 WEBGL_depth_texture）', 'webgl');
    }

    const mipLevelCount = desc.mipLevelCount ?? 1;
    const maxLevels = Math.floor(Math.log2(Math.max(width, height))) + 1;
    if (!Number.isInteger(mipLevelCount) || mipLevelCount < 1 || mipLevelCount > maxLevels) {
      throw new ValidationError(`mipLevelCount 必须在 1 到 ${maxLevels} 之间`);
    }
    if (desc.data !== undefined && ArrayBuffer.isView(desc.data)) {
      const expected = width * height * bytesPerPixel(desc.format);
      if (desc.data.byteLength < expected) {
        throw new ValidationError(
          `纹理数据不足：需要 ${expected} 字节，实际 ${desc.data.byteLength} 字节`,
        );
      }
    }

    // 所有校验通过后再触碰 GL 状态，避免失败路径留下半绑定。
    this.#internal = textureFormat(gl, desc.format);
    this.width = width;
    this.height = height;
    this.format = desc.format;
    this.usage = desc.usage;
    this.mipLevelCount = mipLevelCount;
    this.#desc = { ...desc, width, height, mipLevelCount };
    this.#samplerDesc = { minFilter: 'linear', magFilter: 'linear' };

    const state = context.state;
    const previousUnit = state.getActiveTextureUnit();
    const previousTexture = state.getBoundTexture(0, this.target);
    state.activeTexture(0);
    state.bindTexture(this.target, native);
    try {
      this.#allocate(desc.data);
      new WebGLSampler(this.#samplerDesc).apply(gl, this.target);
    } finally {
      state.activeTexture(previousUnit >= 0 ? previousUnit : 0);
      state.bindTexture(this.target, previousTexture);
    }
  }

  #allocate(data: ArrayBufferView | undefined): void {
    const gl = this.#context.gl;
    if (this.#webgl2) {
      const gl2 = gl as WebGL2RenderingContext;
      gl2.texStorage2D(
        this.target,
        this.mipLevelCount,
        this.#internal.internalFormat,
        this.width,
        this.height,
      );
      if (data !== undefined) {
        gl2.texSubImage2D(
          this.target,
          0,
          0,
          0,
          this.width,
          this.height,
          this.#internal.format,
          this.#internal.type,
          data,
        );
      }
      return;
    }
    if (data !== undefined) {
      gl.texImage2D(
        this.target,
        0,
        this.#internal.internalFormat,
        this.width,
        this.height,
        0,
        this.#internal.format,
        this.#internal.type,
        data,
      );
      return;
    }
    gl.texImage2D(
      this.target,
      0,
      this.#internal.internalFormat,
      this.width,
      this.height,
      0,
      this.#internal.format,
      this.#internal.type,
      null,
    );
  }

  /** 绑定到指定纹理单元。 */
  bind(unit = 0): void {
    this.#context.state.activeTexture(unit);
    this.#context.state.bindTexture(this.target, this.handle);
  }

  /** 子区域更新；不会重新分配存储。 */
  upload(source: TexImageSource | ArrayBufferView, options: TextureUploadOptions = {}): void {
    const level = this.#validateLevel(options.level ?? 0);
    const width = options.width ?? this.width;
    const height = options.height ?? this.height;
    this.#validateRegion(level, 0, 0, width, height);
    this.#withBoundTexture(() => {
      const gl = this.#context.gl;
      if (ArrayBuffer.isView(source)) {
        gl.texSubImage2D(
          this.target,
          level,
          0,
          0,
          width,
          height,
          this.#internal.format,
          this.#internal.type,
          source,
        );
        return;
      }
      gl.texSubImage2D(
        this.target,
        level,
        0,
        0,
        this.#internal.format,
        this.#internal.type,
        source,
      );
    });
  }

  /** 更新纹理的一部分区域。 */
  uploadSub(
    source: TexImageSource | ArrayBufferView,
    x: number,
    y: number,
    options: TextureUploadOptions = {},
  ): void {
    const level = this.#validateLevel(options.level ?? 0);
    const width = options.width ?? this.width;
    const height = options.height ?? this.height;
    this.#validateRegion(level, x, y, width, height);
    this.#withBoundTexture(() => {
      const gl = this.#context.gl;
      if (ArrayBuffer.isView(source)) {
        gl.texSubImage2D(
          this.target,
          level,
          x,
          y,
          width,
          height,
          this.#internal.format,
          this.#internal.type,
          source,
        );
        return;
      }
      gl.texSubImage2D(
        this.target,
        level,
        x,
        y,
        this.#internal.format,
        this.#internal.type,
        source,
      );
    });
  }

  /**
   * 重新分配并上传整张纹理（仅 WebGL1）。
   *
   * WebGL2 的 `texStorage2D` 存储不可变，调用会抛 `UnsupportedError`。
   */
  setImage(source: TexImageSource | ArrayBufferView, options: TextureUploadOptions = {}): void {
    if (this.#webgl2) {
      throw new UnsupportedError('setImage（WebGL2 纹理存储不可变）', 'webgl2');
    }
    const width = options.width ?? this.width;
    const height = options.height ?? this.height;
    if (width !== this.width || height !== this.height) {
      throw new ValidationError('WebGL1 setImage 只支持与创建时相同的尺寸');
    }
    this.#withBoundTexture(() => {
      const gl = this.#context.gl;
      if (ArrayBuffer.isView(source)) {
        gl.texImage2D(
          this.target,
          0,
          this.#internal.internalFormat,
          width,
          height,
          0,
          this.#internal.format,
          this.#internal.type,
          source,
        );
        return;
      }
      gl.texImage2D(
        this.target,
        0,
        this.#internal.internalFormat,
        this.#internal.format,
        this.#internal.type,
        source,
      );
    });
  }

  /** 生成多级渐远纹理。 */
  generateMipmaps(): void {
    this.#withBoundTexture(() => {
      this.#context.gl.generateMipmap(this.target);
    });
  }

  /** 应用仅适用于 WebGL1 的参数型采样器。 */
  applySampler(sampler: WebGLSampler): void {
    if (!(sampler instanceof WebGLSampler)) {
      throw new UnsupportedError('原生采样器对象不能写入纹理参数', 'webgl2');
    }
    this.#samplerDesc = { ...sampler.desc };
    this.#withBoundTexture(() => {
      sampler.apply(this.#context.gl, this.target);
    });
  }

  /** 用描述创建并应用采样参数。 */
  setSampler(desc: SamplerDesc): void {
    this.#samplerDesc = { ...desc };
    this.applySampler(new WebGLSampler(this.#samplerDesc));
  }

  /** 上下文恢复：重新分配存储并恢复采样参数。 */
  override restore(): void {
    const gl = this.#context.gl;
    const native = gl.createTexture();
    if (native === null) {
      throw new BackendError('恢复纹理失败', { code: 'ERR_WEBGL' });
    }
    const state = this.#context.state;
    const previousUnit = state.getActiveTextureUnit();
    const previousTexture = state.getBoundTexture(0, this.target);
    state.activeTexture(0);
    state.bindTexture(this.target, native);
    try {
      this.#allocate(this.#desc.data);
      new WebGLSampler(this.#samplerDesc).apply(gl, this.target);
    } catch (error) {
      gl.deleteTexture(native);
      throw error;
    } finally {
      state.activeTexture(previousUnit >= 0 ? previousUnit : 0);
      state.bindTexture(this.target, previousTexture);
    }
    this.markRestored(native);
  }

  /** 纹理创建参数，供上下文恢复使用。 */
  get descriptor(): Readonly<TextureDesc> {
    return this.#desc;
  }

  #validateLevel(level: number): number {
    if (!Number.isInteger(level) || level < 0 || level >= this.mipLevelCount) {
      throw new ValidationError(`纹理层级 ${level} 超出范围 0-${this.mipLevelCount - 1}`);
    }
    return level;
  }

  #validateRegion(level: number, x: number, y: number, width: number, height: number): void {
    const levelWidth = Math.max(1, this.width >> level);
    const levelHeight = Math.max(1, this.height >> level);
    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
      throw new ValidationError('纹理更新区域无效');
    }
    if (x + width > levelWidth || y + height > levelHeight) {
      throw new ValidationError(`纹理更新区域超出第 ${level} 层尺寸 ${levelWidth}×${levelHeight}`);
    }
  }

  #withBoundTexture<T>(fn: () => T): T {
    const state = this.#context.state;
    const previousUnit = state.getActiveTextureUnit();
    const previousTexture = state.getBoundTexture(0, this.target);
    state.activeTexture(0);
    state.bindTexture(this.target, this.handle);
    try {
      return fn();
    } finally {
      state.activeTexture(previousUnit >= 0 ? previousUnit : 0);
      state.bindTexture(this.target, previousTexture);
    }
  }

  protected override destroyNative(native: NativeTexture): void {
    this.#context.state.onTextureDestroyed(native);
    this.#context.gl.deleteTexture(native);
  }
}
