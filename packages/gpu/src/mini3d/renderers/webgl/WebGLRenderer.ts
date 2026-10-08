import { Color } from '../../math/Color';
import { Vector3 } from '../../math/Vector3';
import { Matrix3 } from '../../math/Matrix3';
import { Matrix4 } from '../../math/Matrix4';
import { Vector2 } from '../../math/Vector2';
import { Sphere } from '../../math/Sphere';
import type { Scene } from '../../core/Scene';
import type { Camera } from '../../core/Camera';
import { Mesh, Line, Points, Sprite } from '../../core/Mesh';
import type { Object3D } from '../../core/Object3D';
import type { Material } from '../../materials/Material';
import { Texture } from '../../textures/Texture';
import { LightState, collectLights } from '../../core/LightState';
import type {
  Renderer,
  RendererBackend,
  RendererCapabilities,
  RendererInfo,
  RendererParameters,
  ResolvedRendererParameters,
} from '../../core/types';
import { GLProgram, programCacheKey, resolveMaterialShader } from './GLProgram';
import type { GL } from './GLTypes';
import type {
  SetterContext,
  UniformTextureBinder,
  UniformValues,
} from './WebGLUniforms';
import { WebGLState } from './WebGLState';
import { WebGLTextures, type TextureCapabilities } from './WebGLTextures';
import { WebGLGeometries } from './WebGLGeometries';
import { WebGLRenderTargets } from './WebGLRenderTargets';
import type { RenderTarget } from '../../textures/RenderTarget';
import { DRAW_MODE_VALUES } from '../../core/BufferGeometry';
import type { BufferGeometry } from '../../core/BufferGeometry';

export type GLContextLike = WebGL2RenderingContext;

export interface WebGLRendererParameters extends RendererParameters {
  /** Force a WebGL1 context even when WebGL2 is available. */
  forceWebGL1?: boolean;
}

/** Resolves user parameters into a complete, validated set. */
export function resolveParameters(parameters: WebGLRendererParameters = {}): ResolvedRendererParameters {
  const canvas = parameters.canvas ?? createDefaultCanvas();
  return {
    canvas,
    pixelRatio: parameters.pixelRatio ?? defaultPixelRatio(),
    antialias: parameters.antialias ?? true,
    powerPreference: parameters.powerPreference ?? 'default',
    forceFallbackAdapter: parameters.forceFallbackAdapter ?? false,
    preserveDrawingBuffer: parameters.preserveDrawingBuffer ?? false,
    depth: parameters.depth ?? true,
    stencil: parameters.stencil ?? false,
    premultipliedAlpha: parameters.premultipliedAlpha ?? true,
    alpha: parameters.alpha ?? false,
    debug: parameters.debug ?? false,
    cacheLimit: parameters.cacheLimit ?? 512,
  };
}

function defaultPixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

function createDefaultCanvas(): HTMLCanvasElement {
  if (typeof document === 'undefined') {
    throw new Error(
      'mini3d.WebGLRenderer: no canvas supplied and `document` is unavailable (headless?); pass `{ canvas }`.',
    );
  }
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 150;
  return canvas;
}

/** One queued draw: an object plus the material index to render it with. */
interface RenderItem {
  object: Object3D & { geometry: { drawMode: string; id: number }; material: Material | Material[] };
  material: Material;
  materialIndex: number;
  /** Ascending sort key: opaque first (0), transparent second (1). */
  transparent: boolean;
  z: number;
  order: number;
}

/**
 * WebGL1 **and** WebGL2 renderer.
 *
 * A single implementation drives both APIs: the context is requested as
 * `webgl2` and falls back to `webgl`; `capabilities.isWebGL2` then gates the
 * few divergent paths (VAOs, native float textures, GLSL 3.00).
 */
export class WebGLRenderer implements Renderer {
  readonly backend: RendererBackend;
  readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  readonly capabilities: RendererCapabilities;
  readonly info: RendererInfo;

  readonly parameters: ResolvedRendererParameters;
  readonly context: GLContextLike;

  /** Raw API name, e.g. `"WebGL 2.0 (OpenGL ES 3.0)"`. */
  readonly glVersion: string;

  pixelRatio: number;
  autoClear = true;
  /** Clear the depth buffer between `render()` calls (default `true`). */
  autoClearDepth = true;
  /** Clear the stencil buffer between `render()` calls (default `true`). */
  autoClearStencil = true;
  /** Toggle frustum culling globally. */
  frustumCulling = true;
  /** Emit `console.warn` for GL errors after each draw when `true`. */
  checkShaderErrors = true;

  /** Escape hatch for advanced users; mirrors three.js' `renderer.state`. */
  readonly state: WebGLState;
  readonly textures: WebGLTextures;
  readonly geometries: WebGLGeometries;
  /** Framebuffer cache for `RenderTarget`; bound through `setRenderTarget`. */
  readonly renderTargets: WebGLRenderTargets;

  private readonly gl: GLContextLike;
  private readonly clearColor = new Color(0x000000);
  private clearAlpha = 0;
  private readonly lightState = new LightState();
  private readonly programCache = new Map<string, GLProgram>();
  private readonly renderList: RenderItem[] = [];
  private readonly boundSphere = new Sphere();
  private readonly scratchColor = new Color();
  private frame = 0;
  private disposed = false;
  /** Scene of the frame currently being rendered; used for the fog uniforms. */
  private _currentScene: Scene | null = null;
  /** True when the context can compile `dFdx`/`dFdy`. */
  private derivativesAvailable: boolean;
  private _backgroundProgram: GLProgram | null = null;
  private _backgroundBuffer: WebGLBuffer | null = null;
  /** Target currently bound, or `null` for the canvas. */
  private _renderTarget: RenderTarget | null = null;

  constructor(parameters: WebGLRendererParameters = {}) {
    this.parameters = resolveParameters(parameters);
    this.canvas = this.parameters.canvas;
    this.pixelRatio = this.parameters.pixelRatio;

    const contextAttributes: WebGLContextAttributes = {
      alpha: this.parameters.alpha,
      depth: this.parameters.depth,
      stencil: this.parameters.stencil,
      antialias: this.parameters.antialias,
      premultipliedAlpha: this.parameters.premultipliedAlpha,
      preserveDrawingBuffer: this.parameters.preserveDrawingBuffer,
      powerPreference: this.parameters.powerPreference,
      failIfMajorPerformanceCaveat: false,
    };

    const gl = this.acquireContext(contextAttributes);
    if (!gl) {
      throw new Error(
        'mini3d.WebGLRenderer: unable to obtain a WebGL context. ' +
          'Check that the canvas is attached to a document and that WebGL is enabled.',
      );
    }
    this.gl = gl;
    this.context = gl;
    this.backend = this.capabilitiesIsWebGL2(gl) ? 'webgl2' : 'webgl';
    this.glVersion = this.describeContext(gl);
    this.capabilities = this.queryCapabilities(gl);

    this.state = new WebGLState(gl, { isWebGL2: this.capabilities.isWebGL2 });
    this.textures = new WebGLTextures(gl, this.queryTextureCapabilities(gl));
    this.geometries = new WebGLGeometries(gl, this.state, this.capabilities.isWebGL2);
    this.renderTargets = new WebGLRenderTargets(gl, this.textures, this.capabilities.isWebGL2);
    // The uniform setter context holds the context and the texture-unit
    // allocator, so it is (re)wired whenever the context is.
    this.refreshSetterContext();

    // `dFdx`/`dFdy` drive tangent-space normal mapping. GLSL ES 3.00 has them in
    // core; GLSL ES 1.00 needs an extension directive, but ANGLE refuses that
    // directive while compiling a 1.00 shader against a WebGL2 context, so the
    // only reliable answer comes from compiling a probe shader.
    this.derivativesAvailable = detectDerivatives(gl, this.capabilities.isWebGL2);
    if (!this.derivativesAvailable) {
      console.info(
        'mini3d.WebGLRenderer: screen-space derivatives are unavailable; ' +
          'normalMap is ignored and flat-shaded normals fall back to the interpolated normal.',
      );
    }
    this.info = {
      render: { frame: 0, calls: 0, triangles: 0, lines: 0, points: 0, time: 0 },
      memory: { geometries: 0, textures: 0, programs: 0 },
    };

    this.setSize(
      (this.canvas as HTMLCanvasElement).width || 300,
      (this.canvas as HTMLCanvasElement).height || 150,
      false,
    );
    this.setClearColor(0x000000, 0);
  }

  // ------------------------------------------------------------ context ----

  private acquireContext(attributes: WebGLContextAttributes): GLContextLike | null {
    const canvas = this.canvas as HTMLCanvasElement;
    const forceWebGL1 = (this.parameters as WebGLRendererParameters).forceWebGL1 === true;

    // Respect a context the caller already created on the canvas: asking for
    // "webgl2" on a canvas that holds a WebGL1 context would throw, and forcing
    // WebGL2 would silently ignore an explicit WebGL1 request.
    const existing = this.findExistingContext(canvas, forceWebGL1);
    if (existing) return existing;

    const attempts: string[] = forceWebGL1
      ? ['webgl', 'experimental-webgl']
      : ['webgl2', 'webgl', 'experimental-webgl'];
    for (const name of attempts) {
      const context = this.getContextOrNull(canvas, name, attributes);
      if (context) return context;
    }
    return null;
  }

  /**
   * Detects a rendering context already attached to `canvas`, if any. When
   * `forceWebGL1` is set, a WebGL2 context on the canvas is *not* adopted 鈥?   * otherwise the flag would be silently ignored.
   */
  private findExistingContext(canvas: HTMLCanvasElement, forceWebGL1: boolean): GLContextLike | null {
    const probe = (name: string): GLContextLike | null => {
      try {
        return canvas.getContext(name) as GLContextLike | null;
      } catch {
        return null;
      }
    };
    if (forceWebGL1) return probe('webgl') ?? probe('experimental-webgl');
    return probe('webgl2') ?? probe('webgl') ?? probe('experimental-webgl');
  }

  /** `getContext` that tolerates an incompatible-context error on the canvas. */
  private getContextOrNull(
    canvas: HTMLCanvasElement,
    name: string,
    attributes: WebGLContextAttributes,
  ): GLContextLike | null {
    try {
      return canvas.getContext(name, attributes) as GLContextLike | null;
    } catch {
      // The canvas already holds an incompatible context type.
      return null;
    }
  }

  /**
   * True when the context really is WebGL2. `instanceof WebGL2RenderingContext`
   * is unreliable (headless and worker contexts may not expose the global, and
   * `document.createElement('canvas').getContext('webgl2')` can silently
   * downgrade), so the version string and a WebGL2-only method are checked too.
   */
  private capabilitiesIsWebGL2(gl: GLContextLike): boolean {
    if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
      return true;
    }
    const version = String(gl.getParameter(gl.VERSION) ?? '');
    if (/\bWebGL\s*2(\.0)?\b/i.test(version)) return true;
    // `drawBuffers` exists only on a WebGL2 context.
    return typeof (gl as unknown as { drawBuffers?: unknown }).drawBuffers === 'function';
  }

  private describeContext(gl: GLContextLike): string {
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        return `${gl.getParameter(gl.VERSION)} 鈥?${renderer}`;
      }
      return String(gl.getParameter(gl.VERSION));
    } catch {
      return 'WebGL (version unavailable)';
    }
  }

  private queryCapabilities(gl: GLContextLike): RendererCapabilities {
    const isWebGL2 = this.capabilitiesIsWebGL2(gl);
    const has = (name: string): boolean => gl.getExtension(name) !== null;

    const precision = (type: number): string => {
      try {
        const format = gl.getShaderPrecisionFormat(type, gl.HIGH_FLOAT) as
          | (WebGLShaderPrecisionFormat & { precision?: number })
          | null;
        if (!format) return 'unknown';
        const digits = typeof format.precision === 'number' ? format.precision : 0;
        return `highp(${digits})`;
      } catch {
        return 'unknown';
      }
    };

    return {
      backend: isWebGL2 ? 'webgl2' : 'webgl',
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
      maxTextureUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) as number,
      maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number,
      maxSamples: isWebGL2 ? (gl.getParameter(gl.MAX_SAMPLES) as number) : 0,
      precision: {
        vertex: precision(gl.VERTEX_SHADER),
        fragment: precision(gl.FRAGMENT_SHADER),
      },
      isWebGL2,
      features: {
        vertexArrayObject: isWebGL2 || has('OES_vertex_array_object'),
        instancedArrays: isWebGL2 || has('ANGLE_instanced_arrays'),
        elementIndexUint: isWebGL2 || has('OES_element_index_uint'),
        textureFloat: isWebGL2 || has('OES_texture_float'),
        textureHalfFloat: isWebGL2 || has('OES_texture_half_float'),
        depthTexture: isWebGL2 || has('WEBGL_depth_texture'),
        colorBufferFloat: isWebGL2 || has('EXT_color_buffer_float'),
        anisotropy: has('EXT_texture_filter_anisotropic'),
        timestampQuery: isWebGL2 && has('EXT_disjoint_timer_query_webgl2'),
      },
      info: this.describeContext(gl),
    };
  }

  private queryTextureCapabilities(gl: GLContextLike): TextureCapabilities {
    const isWebGL2 = this.capabilitiesIsWebGL2(gl);
    const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
    return {
      isWebGL2,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
      maxTextureUnits: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) as number,
      maxAnisotropy: anisotropy
        ? (gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number)
        : 1,
      supportsFloat: isWebGL2 || gl.getExtension('OES_texture_float') !== null,
      supportsHalfFloat: isWebGL2 || gl.getExtension('OES_texture_half_float') !== null,
      supportsDepthTexture: isWebGL2 || gl.getExtension('WEBGL_depth_texture') !== null,
      anisotropyExtension: anisotropy as TextureCapabilities['anisotropyExtension'],
      halfFloatLinear: isWebGL2 || gl.getExtension('OES_texture_half_float_linear') !== null,
    };
  }

  // ------------------------------------------------------------- sizing ----

  get width(): number {
    return (this.canvas as HTMLCanvasElement).width;
  }

  get height(): number {
    return (this.canvas as HTMLCanvasElement).height;
  }

  get domWidth(): number {
    return this.canvas.width;
  }

  get domHeight(): number {
    return this.canvas.height;
  }

  setSize(width: number, height: number, updateStyle = true): void {
    this.canvas.width = Math.max(1, Math.floor(width * this.pixelRatio));
    this.canvas.height = Math.max(1, Math.floor(height * this.pixelRatio));
    if (updateStyle && typeof (this.canvas as HTMLCanvasElement).style !== 'undefined') {
      const style = (this.canvas as HTMLCanvasElement).style;
      style.width = `${width}px`;
      style.height = `${height}px`;
    }
    this.state.setViewport(0, 0, this.canvas.width, this.canvas.height);
  }

  setPixelRatio(ratio: number): void {
    const previous = this.pixelRatio;
    this.pixelRatio = ratio;
    const domWidth = (this.canvas.width || 300) / previous;
    const domHeight = (this.canvas.height || 150) / previous;
    this.setSize(domWidth, domHeight, false);
  }

  // -------------------------------------------------------------- clear ----

  setClearColor(color: number | string | Color | null, alpha = 1): this {
    if (color !== null && color !== undefined) this.clearColor.set(color);
    this.clearAlpha = alpha;
    return this;
  }

  setClearAlpha(alpha: number): void {
    this.clearAlpha = alpha;
  }

  getClearColor(target: Color = new Color()): Color {
    return target.copy(this.clearColor);
  }

  getClearAlpha(): number {
    return this.clearAlpha;
  }

  clear(
    color = true,
    depth = this.autoClearDepth,
    stencil = this.autoClearStencil,
  ): void {
    const gl = this.gl;
    let mask = 0;
    if (color) {
      this.state.setClearColor(this.clearColor, this.clearAlpha);
      mask |= gl.COLOR_BUFFER_BIT;
    }
    if (depth) {
      // Depth writes must be enabled for glClear to touch the depth buffer.
      this.state.setDepthWrite(true);
      mask |= gl.DEPTH_BUFFER_BIT;
    }
    if (stencil) mask |= gl.STENCIL_BUFFER_BIT;
    if (mask !== 0) gl.clear(mask);
  }

  // ------------------------------------------------------- render target ----

  /**
   * Redirects subsequent draws into `target`, or back to the canvas when `null`.
   *
   * Binds the framebuffer and applies the target's viewport and scissor, so a
   * render-target pass is written exactly like a canvas pass. Passing `null`
   * restores the canvas viewport.
   */
  setRenderTarget(target: RenderTarget | null): void {
    if (this.disposed) return;
    const gl = this.gl;
    const changed = this._renderTarget !== target;

    // Finish the previous multisampled pass before its resolve texture is read.
    if (changed && this._renderTarget && this.renderTargets.isMultisampled(this._renderTarget)) {
      this.renderTargets.resolveMultisample(this._renderTarget);
    }

    this._renderTarget = target;
    this.renderTargets.bind(target);

    if (target === null) {
      if (target !== null || changed) this.state.setScissorTest(false);
      this.state.setViewport(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.state.setViewport(
      target.viewport.x,
      target.viewport.y,
      target.viewport.width,
      target.viewport.height,
    );
    if (target.scissorTest) {
      this.state.setScissor(
        target.scissor.x,
        target.scissor.y,
        target.scissor.width,
        target.scissor.height,
      );
      this.state.setScissorTest(true);
    } else {
      this.state.setScissorTest(false);
    }
    void gl;
  }

  /** The target currently bound, or `null` for the canvas. */
  getRenderTarget(): RenderTarget | null {
    return this._renderTarget;
  }

  // ------------------------------------------------------------- render ----

  render(scene: Scene, camera: Camera): void {
    if (this.disposed) throw new Error('mini3d.WebGLRenderer: render() called after dispose()');
    const started = now();

    camera.updateMatrices();
    (scene as Object3D).updateMatrixWorld();
    this._currentScene = scene;

    // The viewport follows whatever is bound; `setRenderTarget` already applied
    // the target's viewport, so only the canvas case needs re-stating.
    if (this._renderTarget === null) {
      this.state.setViewport(0, 0, this.canvas.width, this.canvas.height);
    }

    collectLights(scene, this.lightState, camera);

    // Per-frame counters: without this the draw-call and triangle totals are
    // cumulative for the lifetime of the renderer rather than per frame.
    this.info.render.calls = 0;
    this.info.render.triangles = 0;
    this.info.render.lines = 0;
    this.info.render.points = 0;

    this.renderList.length = 0;
    this.projectObject(scene, camera);

    // Opaque front-to-back, then transparent back-to-front.
    this.renderList.sort(compareRenderItems);

    this.textures.resetFrameStats();
    this.geometries.resetFrameStats();

    if (this.autoClear) {
      this.clear(this.clearAlpha >= 0, this.autoClearDepth, this.autoClearStencil);
    }
    this.drawBackground(scene, camera);

    for (const item of this.renderList) {
      this.drawItem(item, camera);
    }

    this.state.bindVertexArray(null);
    this.state.useProgram(null);

    this.info.render.frame = ++this.frame;
    this.info.render.time = now() - started;
    this.info.memory.geometries = this.geometries.count;
    this.info.memory.textures = this.textures.count;
    this.info.memory.programs = this.programCache.size;
    this.retireUnusedPrograms();
  }

  /** Walks the graph once and queues every visible, in-frustum draw. */
  private projectObject(object: Object3D, camera: Camera): void {
    if (!object.visible) return;

    const renderable = object as Object3D & {
      isMesh?: boolean;
      isLine?: boolean;
      isPoints?: boolean;
      isSprite?: boolean;
      geometry?: { getBoundingSphere(): Sphere; drawMode?: string };
      material?: Material | Material[];
    };

    if (
      (renderable.isMesh || renderable.isLine || renderable.isPoints) &&
      renderable.geometry &&
      renderable.material &&
      object.layers.test(camera.layers)
    ) {
      if (this.isVisible(object, camera, renderable.geometry)) {
        this.pushRenderItem(object as never, renderable.material, camera);
      }
    } else if (renderable.isSprite && renderable.material) {
      // Sprites are billboards; mini3d renders them through the points path.
      this.pushRenderItem(object as never, renderable.material as Material, camera);
    }

    const children = object.children;
    for (let i = 0; i < children.length; i++) this.projectObject(children[i], camera);
  }

  /** Frustum test against the object's world-space bounding sphere. */
  private isVisible(
    object: Object3D,
    camera: Camera,
    geometry: { getBoundingSphere(): Sphere },
  ): boolean {
    const holder = object as Object3D & { boundingSphere?: Sphere | null };
    if (!this.frustumCulling || !object.frustumCulled) return true;
    let sphere = holder.boundingSphere ?? null;
    if (!sphere) {
      sphere = geometry.getBoundingSphere().clone();
      holder.boundingSphere = sphere;
    }
    this.boundSphere.copy(sphere).applyMatrix4(object.matrixWorld);
    return camera.frustum.intersectsSphere(this.boundSphere);
  }

  /**
   * Expands a material (or material array) into render items.
   *
   * A geometry with groups needs one item per group, because each item draws a
   * single `[start, count)` range. With a single material every group still has
   * to be queued 鈥?otherwise only the first group of e.g. a `BoxGeometry`
   * (which splits its six faces into six groups) would ever be drawn.
   */
  private pushRenderItem(
    object: Object3D & { geometry?: { drawMode?: string; groups?: { materialIndex: number }[] } },
    material: Material | Material[],
    camera: Camera,
  ): void {
    const groups = object.geometry?.groups ?? [];

    if (Array.isArray(material)) {
      if (material.length === 0) return;
      if (groups.length === 0) {
        for (let i = 0; i < material.length; i++) {
          this.pushSingle(object as never, material[i], i, camera);
        }
        return;
      }
      const seen = new Set<number>();
      for (const group of groups) {
        const index = Math.min(group.materialIndex, material.length - 1);
        if (seen.has(index)) continue;
        seen.add(index);
        this.pushSingle(object as never, material[index], index, camera);
      }
      return;
    }

    if (groups.length === 0) {
      this.pushSingle(object as never, material, 0, camera);
      return;
    }
    // A single material covers every group, so this is one draw rather than one
    // per group. Queueing per group would pay the whole per-draw setup (program
    // bind, attribute binding, every uniform upload) once per group: a box has
    // six groups, so a single-material box would cost six draws where one
    // suffices.
    this.pushSingle(object as never, material, 0, camera);
  }

  private pushSingle(
    object: Object3D & { geometry?: { drawMode?: string } },
    material: Material,
    materialIndex: number,
    camera: Camera,
  ): void {
    if (!material.visible) return;
    const transparent = material.transparent && material.blending !== 'none';
    const sphere = (object as unknown as { boundingSphere?: Sphere | null }).boundingSphere;
    let z = 0;
    if (sphere) {
      _worldCenter.copy(sphere.center).applyMatrix4(object.matrixWorld);
      z = _worldCenter.distanceToSquared(
        _cameraPosition.setFromMatrixPosition(camera.matrixWorld),
      );
    } else {
      _cameraPosition.setFromMatrixPosition(camera.matrixWorld);
      z = object.matrixWorld.elements[14] - _cameraPosition.z;
    }
    this.renderList.push({
      object: object as never,
      material,
      materialIndex,
      transparent,
      z,
      order: object.renderOrder,
    });
  }

  /** Paints the scene background (clear colour, or a texture as a fullscreen quad). */
  private drawBackground(scene: Scene, camera: Camera): void {
    const background = scene.background;
    if (background === null) return;
    if (background instanceof Color) {
      this.scratchColor.copy(background);
      this.state.setClearColor(this.scratchColor, 1);
      const gl = this.gl;
      this.state.setDepthWrite(false);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.state.setDepthWrite(true);
      return;
    }
    // Texture background: draw it with the sprite/basic path as a screen quad.
    if (background instanceof Texture) {
      this.drawBackgroundTexture(background, camera);
    }
  }

  private drawBackgroundTexture(texture: Texture, camera: Camera): void {
    const gl = this.gl;
    this.textures.track(texture);
    const handle = this.textures.upload(texture);

    if (!this._backgroundProgram) {
      this._backgroundProgram = new GLProgram(
        gl,
        {
          shaderName: null,
          defines: {},
          vertexShader: BACKGROUND_VERTEX,
          fragmentShader: BACKGROUND_FRAGMENT,
          raw: false,
          glslVersion: '100 es',
        },
        'background',
      );
    }
    if (!this._backgroundBuffer) {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error('mini3d: gl.createBuffer() returned null');
      this._backgroundBuffer = buffer;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, BACKGROUND_QUAD, gl.STATIC_DRAW);
    }

    const program = this._backgroundProgram;
    this.state.useProgram(program.program);
    this.state.bindVertexArray(null);
    this.state.setDepthTest(false);
    this.state.setDepthWrite(false);
    this.state.setSide('double');
    this.state.setBlending('none');

    this.state.bindArrayBuffer(this._backgroundBuffer);
    const location = gl.getAttribLocation(program.program, 'position');
    if (location >= 0) {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    }

    this.state.activeTexture(0);
    gl.bindTexture(gl.TEXTURE_2D, handle);
    program.uniforms.setTexture('diffuseMap', texture, this.uniformSetterContext.textures);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.state.setDepthTest(true);
    this.state.setDepthWrite(true);
  }

  // --------------------------------------------------------------- draw ----

  private drawItem(item: RenderItem, camera: Camera): void {
    const { object, material } = item;
    const geometry = object.geometry as unknown as {
      drawMode?: string;
      groups: { start: number; count: number; materialIndex: number }[];
      index: { count: number } | null;
      drawCount: number;
      drawRange: { start: number; count: number };
      attributes: Record<string, { itemSize: number }>;
    };

    let program: GLProgram;
    try {
      program = this.acquireProgram(material);
    } catch (error) {
      if (this.checkShaderErrors) {
        // Include the compiler log: it is the only actionable information.
        console.error(
          `mini3d: failed to build shader program for "${material.name || material.kind}"`,
          error instanceof Error ? error.message : error,
        );
      }
      return;
    }

    this.state.useProgram(program.program);
    // Texture units are allocated per program bind: each program's samplers get
    // consecutive units starting at 0, so a program with more samplers than the
    // previous one cannot collide with it.
    this.textureUnit = 0;
    this.geometries.bind(geometry as never, program.program);
    this.applyMaterialState(material);
    this.uploadFrameUniforms(program, object, camera);
    this.uploadMaterialUniforms(program, material, camera);

    const drawMode = (geometry.drawMode ?? 'triangles') as keyof typeof DRAW_MODE_VALUES;
    const mode = DRAW_MODE_VALUES[drawMode] ?? this.gl.TRIANGLES;
    const indexed = geometry.index !== null;
    const groups = geometry.groups;

    // Per-draw vertex-count accounting for `renderer.info`.
    const [primitiveCount, primitiveSize] = primitiveStats(drawMode);

    if (groups.length > 0 && Array.isArray(material)) {
      // One draw per group belonging to this item's material slot.
      for (const group of groups) {
        if (group.materialIndex !== item.materialIndex) continue;
        this.drawRange(program, geometry as never, mode, indexed, group.start, group.count);
        this.accumulateInfo(primitiveCount, primitiveSize, group.count);
      }
    } else {
      // No groups, or a single material: one draw over the whole range.
      const start = geometry.drawRange.start;
      const count = Number.isFinite(geometry.drawRange.count)
        ? Math.min(geometry.drawRange.count, geometry.drawCount - start)
        : geometry.drawCount - start;
      if (count > 0) {
        this.drawRange(program, geometry as never, mode, indexed, start, count);
        this.accumulateInfo(primitiveCount, primitiveSize, count);
      }
    }

    this.info.render.calls++;
    if (this.parameters.debug) this.checkForErrors(material);
  }

  private drawRange(
    program: GLProgram,
    geometry: { index: { array: ArrayLike<number> } | null; drawCount: number },
    mode: number,
    indexed: boolean,
    start: number,
    count: number,
  ): void {
    const gl = this.gl;
    if (indexed && geometry.index) {
      const isUint32 = geometry.index.array instanceof Uint32Array;
      const byteOffset = start * (isUint32 ? 4 : 2);
      gl.drawElements(mode, count, isUint32 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, byteOffset);
    } else {
      gl.drawArrays(mode, start, count);
    }
    void program;
  }

  accumulateInfo(primitiveCount: number, primitiveSize: number, count: number): void {
    if (primitiveCount === 1 && primitiveSize === 3) this.info.render.triangles += count / 3;
    else if (primitiveCount === 1 && primitiveSize === 1) this.info.render.points += count;
    else if (primitiveCount === 2) this.info.render.lines += Math.floor(count / 2);
  }

  /** Applies every piece of GL state a material asks for. */
  private applyMaterialState(material: Material): void {
    this.state.setDepthTest(material.depthTest);
    this.state.setDepthWrite(material.depthWrite);
    this.state.setDepthFunc(material.depthFunc);
    this.state.setSide(material.side);
    this.state.setBlending(material.blending);
    this.state.setColorWrite(material.colorWrite);
    this.state.setPolygonOffset(
      material.polygonOffset,
      material.polygonOffsetFactor,
      material.polygonOffsetUnits,
    );
  }

  // ------------------------------------------------------------- uniforms --

  /**
   * The per-draw values this renderer owns rather than the material.
   *
   * They are addressed through `WebGLUniforms.setValue` like everything else,
   * but are built fresh for each draw: the per-node value cache cannot help
   * here (the values genuinely change), and keeping them out of the material's
   * `uniforms` record avoids a second writer ping-ponging the same uniform.
   */
  private readonly frameValues: UniformValues = {
    modelMatrix: { value: null },
    modelViewMatrix: { value: null },
    projectionMatrix: { value: null },
    viewMatrix: { value: null },
    normalMatrix: { value: null },
    cameraPosition: { value: null },
    numDirectionalLights: { value: 0 },
    numPointLights: { value: 0 },
    numSpotLights: { value: 0 },
    ambientLightColor: { value: null },
    hemisphereLightSkyColor: { value: null },
    hemisphereLightGroundColor: { value: null },
    hemisphereLightUp: { value: null },
    directionalLightsData: { value: null },
    pointLightsData: { value: null },
    spotLightsData: { value: null },
    fogColor: { value: null },
    fogDensity: { value: 0 },
    fogNear: { value: 0 },
    fogFar: { value: 0 },
    pointScale: { value: 0 },
  };

  /** Scratch values reused by every frame upload. */
  private readonly frameScratch = {
    cameraPosition: new Vector3(),
    hemisphereUp: new Vector3(),
  };

  private uploadFrameUniforms(program: GLProgram, object: Object3D, camera: Camera): void {
    const uniforms = program.uniforms;
    const ctx = this.uniformSetterContext;

    _modelView.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
    _normalMatrix.getNormalMatrix(_modelView);
    this.frameScratch.cameraPosition.setFromMatrixPosition(camera.matrixWorld);

    const state = this.lightState;
    const fog = (this._currentScene as Scene | null)?.fog ?? null;

    let fogDensity = 0;
    let fogNear = 1;
    let fogFar = 1000;
    if (fog) {
      const exp2 = (fog as { density?: number }).density;
      if (exp2 !== undefined) {
        fogDensity = exp2;
      } else {
        const linear = fog as unknown as { near: number; far: number };
        fogNear = linear.near;
        fogFar = linear.far;
        fogDensity = 0.00025;
      }
    }

    const values = this.frameValues;
    values.modelMatrix.value = object.matrixWorld.elements;
    values.modelViewMatrix.value = _modelView.elements;
    values.projectionMatrix.value = camera.projectionMatrix.elements;
    values.viewMatrix.value = camera.matrixWorldInverse.elements;
    values.normalMatrix.value = _normalMatrix.elements;
    values.cameraPosition.value = this.frameScratch.cameraPosition;
    values.numDirectionalLights.value = state.directionalCount;
    values.numPointLights.value = state.pointCount;
    values.numSpotLights.value = state.spotCount;
    values.ambientLightColor.value = state.ambient;
    values.hemisphereLightSkyColor.value = state.hemisphereSky;
    values.hemisphereLightGroundColor.value = state.hemisphereGround;
    this.frameScratch.hemisphereUp.set(
      state.hemisphereUp[0],
      state.hemisphereUp[1],
      state.hemisphereUp[2],
    );
    values.hemisphereLightUp.value = this.frameScratch.hemisphereUp;
    values.directionalLightsData.value = state.directionalData;
    values.pointLightsData.value = state.pointData;
    values.spotLightsData.value = state.spotData;
    values.fogColor.value = fog ? fog.color : null;
    values.fogDensity.value = fogDensity;
    values.fogNear.value = fogNear;
    values.fogFar.value = fogFar;
    // Half the drawing-buffer height keeps point attenuation resolution
    // independent of the canvas size.
    values.pointScale.value = this.canvas.height * 0.5;

    uniforms.uploadAll(ctx, values);
  }

  /**
   * Uploads the material's own uniforms.
   *
   * The material's `uniforms` record is the single source of truth for every
   * value a shader reads: each material writes its typed fields into the record
   * when they change, and the texture slots live there as `Texture` values.
   * Uploading from the record (rather than re-deriving values from typed fields)
   * is what lets the per-node caches work 鈥?a value written by two different
   * code paths would otherwise ping-pong through the cache every draw.
   */
  private uploadMaterialUniforms(program: GLProgram, material: Material, _camera: Camera): void {
    // Values the material derives from its own state (the texture matrix, for
    // instance) are written into the record here, so the record stays the single
    // source of truth for the upload itself.
    material.refreshUniforms();
    program.uniforms.uploadAll(this.uniformSetterContext, material.uniforms as UniformValues);
  }

  /**
   * The context the uniform setters need: the GL context plus the texture cache
   * adapter. Reused so no object is allocated per draw.
   */
  private readonly uniformSetterContext: SetterContext = {
    gl: null as unknown as GL,
    textures: {
      allocateTextureUnit: () => this.textureUnit++,
      bind: (texture, unit, kind, isNormalMap) => {
        void kind;
        if (texture) {
          const value = texture as Texture;
          this.textures.track(value);
          this.textures.bind(value, unit);
        } else {
          this.textures.bindFallback(unit, isNormalMap);
        }
      },
    },
  };

  /** Next free texture unit for the currently bound program. */
  private textureUnit = 0;

  /** Reinstalls the binder after a context change; see `setSize`/`initGL`. */
  private refreshSetterContext(): void {
    this.uniformSetterContext.gl = this.gl;
  }

  // ------------------------------------------------------------ programs ---

  /**
   * Connects a program's uniform table to this renderer's texture cache.
   *
   * The binder only provides the texture-unit allocator and the bind call;
   * `WebGLUniforms` decides which samplers need units and in what order.
   */
  private installTextureBinder(program: GLProgram): void {
    // Sampler units are handed out on demand per program bind, so the renderer
    // tracks how many were used to report the high-water mark.
    this.peakSamplerUnits = Math.max(this.peakSamplerUnits, program.uniforms.unitsRequired);
  }

  /** Highest sampler-unit count seen across every compiled program. */
  private peakSamplerUnits = 0;

  /** Resolves (and caches) the program a material needs. */
  private acquireProgram(material: Material): GLProgram {
    const { parameters } = resolveMaterialShader(material, this.derivativesAvailable);
    const key = programCacheKey(
      parameters.shaderName,
      parameters.defines,
      parameters.raw,
      parameters.glslVersion,
    );
    const cached = this.programCache.get(key);
    if (cached) {
      cached.markUsed();
      return cached;
    }
    try {
      const program = new GLProgram(this.gl, parameters, key);
      this.installTextureBinder(program);
      this.programCache.set(key, program);
      return program;
    } catch (error) {
      // A driver can accept a capability probe and still fail the real shader.
      // Falling back here keeps a normal-mapped material rendering (without the
      // tangent-space perturbation) instead of disappearing entirely.
      if (parameters.defines.USE_NORMALMAP) {
        const message = error instanceof Error ? error.message : String(error);
        const fallback = resolveMaterialShader(material, false);
        const fallbackKey = programCacheKey(
          fallback.parameters.shaderName,
          fallback.parameters.defines,
          fallback.parameters.raw,
          fallback.parameters.glslVersion,
        );
        const existing = this.programCache.get(fallbackKey);
        if (existing) {
          existing.markUsed();
          console.warn(
            `mini3d.WebGLRenderer: falling back to the non-normal-mapped program for "${material.name || material.kind}"`,
            message.split('\n')[0],
          );
          return existing;
        }
        const program = new GLProgram(this.gl, fallback.parameters, fallbackKey);
        this.installTextureBinder(program);
        this.programCache.set(fallbackKey, program);
        this.derivativesAvailable = false;
        console.warn(
          `mini3d.WebGLRenderer: this context cannot compile normal-map shaders; ` +
            `normalMap is ignored for all materials. (${message.split('\n')[0]})`,
        );
        return program;
      }
      throw error;
    }
  }

  /**
   * Frees programs that were not used in the previous frame and pushes the
   * cache back under `parameters.cacheLimit`.
   */
  private retireUnusedPrograms(): void {
    for (const [key, program] of this.programCache) {
      if (program.used) {
        program.markUnused();
        continue;
      }
      program.dispose();
      this.programCache.delete(key);
    }

    const limit = Math.max(this.parameters.cacheLimit, 1);
    if (this.programCache.size <= limit) return;
    const excess = this.programCache.size - limit;
    let removed = 0;
    for (const [key, program] of this.programCache) {
      if (removed >= excess) break;
      program.dispose();
      this.programCache.delete(key);
      removed++;
    }
  }

  /** Uploads a texture eagerly so the first draw does not stall. */
  initTexture(texture: Texture): void {
    this.textures.track(texture);
    this.textures.upload(texture);
  }

  /** Uploads a geometry eagerly. */
  initGeometry(geometry: BufferGeometry): void {
    this.geometries.prepare(geometry);
  }

  resetInfo(): void {
    this.info.render.calls = 0;
    this.info.render.triangles = 0;
    this.info.render.lines = 0;
    this.info.render.points = 0;
    this.info.render.time = 0;
  }

  estimateMemoryUsage(): number {
    return this.geometries.bytes + this.textures.bytes;
  }

  private checkForErrors(material: Material): void {
    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR) {
      console.error(
        `mini3d.WebGLRenderer: GL error 0x${error.toString(16)} while drawing with material "${material.name || material.kind}"`,
      );
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const program of this.programCache.values()) program.dispose();
    this.programCache.clear();
    this._backgroundProgram?.dispose();
    this._backgroundProgram = null;
    this.geometries.dispose();
    this.textures.dispose();
    this.state.reset();
  }
}

// -------------------------------------------------------------- helpers ----

function now(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

/**
 * Determines whether `dFdx`/`dFdy` are usable by compiling a probe shader.
 *
 * The probe intentionally does **not** use the
 * `GL_OES_standard_derivatives` extension directive: on some ANGLE/Intel
 * combinations that directive is accepted by the probe yet poisons the context
 * so that every subsequent shader using derivatives fails to compile. Derivatives
 * are therefore only considered available when a 1.00 shader can use `dFdx`
 * without any extension declaration (always true on WebGL2, and true on WebGL1
 * contexts that expose the built-ins directly).
 */
function detectDerivatives(gl: GLContextLike, isWebGL2: boolean): boolean {
  const probe = (source: string): boolean => {
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) return false;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS) === true;
    gl.deleteShader(shader);
    return ok;
  };

  const body =
    'precision highp float;\n' +
    'varying vec3 vPos;\n' +
    'void main() {\n' +
    '  vec3 dx = dFdx(vPos);\n' +
    '  vec3 dy = dFdy(vPos);\n' +
    '  gl_FragColor = vec4(dx + dy, 1.0);\n' +
    '}\n';

  if (isWebGL2 && probe(body)) return true;
  return probe(body);
}

function primitiveStats(drawMode: string): [number, number] {
  switch (drawMode) {
    case 'points':
      return [1, 1];
    case 'lines':
      return [2, 2];
    case 'line-strip':
      return [2, 1];
    case 'triangle-strip':
      return [1, 1];
    case 'triangles':
    default:
      return [1, 3];
  }
}

/**
 * Opaque first (fewer state changes), then transparent sorted back-to-front, and
 * `renderOrder` applied *within* each group.
 *
 * Ordering by `renderOrder` first would let a transparent object draw before the
 * opaque geometry behind it, which breaks the blend: the background it should
 * have composited over has not been written yet.
 */
function compareRenderItems(a: RenderItem, b: RenderItem): number {
  if (a.transparent !== b.transparent) return a.transparent ? 1 : -1;
  if (a.order !== b.order) return a.order - b.order;
  // Transparent back-to-front, opaque front-to-back.
  return a.transparent ? b.z - a.z : a.z - b.z;
}

const BACKGROUND_VERTEX = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const BACKGROUND_FRAGMENT = /* glsl */ `
uniform sampler2D diffuseMap;
varying vec2 vUv;
void main() {
  gl_FragColor = texture2D(diffuseMap, vUv);
}
`;

/** Fullscreen triangle strip in clip space: BL, BR, TL, TR. */
const BACKGROUND_QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

// Module-level scratch objects keep per-frame allocation at zero.
const _modelView = new Matrix4();
const _normalMatrix = new Matrix3();
const _uvMatrix = new Matrix3();
const _cameraPosition = new Vector3();
const _worldCenter = new Vector3();
