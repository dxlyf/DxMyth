import type { Scene } from './Scene';
import type { Camera } from './Camera';
import type { Color } from '../math/Color';
import type { Texture } from '../textures/Texture';
import type { RenderTarget } from '../textures/RenderTarget';

/** Which graphics API a renderer instance is driving. */
export type RendererBackend = 'webgl' | 'webgl2' | 'webgpu';

/** Context attributes shared by the WebGL/WebGPU renderers. */
export interface RendererParameters {
  /** Canvas to render into; omitted means "create one and expose it". */
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  /** Force a device pixel ratio; defaults to `window.devicePixelRatio`. */
  pixelRatio?: number;
  /** Request an antialiased default framebuffer (WebGL `antialias`). */
  antialias?: boolean;
  /** `powerPreference` hint for both backends. */
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  /** WebGPU only: force a software adapter when `true`. */
  forceFallbackAdapter?: boolean;
  /** Keep the drawing buffer after presenting (needed for `readPixels`). */
  preserveDrawingBuffer?: boolean;
  /** Ask for a depth buffer (requested by default). */
  depth?: boolean;
  /** Ask for a stencil buffer. */
  stencil?: boolean;
  /** Ask for premultiplied alpha in the default framebuffer. */
  premultipliedAlpha?: boolean;
  /** Let the browser decide when to clear the drawing buffer. */
  alpha?: boolean;
  /** Enable WebGL debug output / validation where available. */
  debug?: boolean;
  /**
   * Cap on simultaneously-resident GPU geometries/materials/textures; least
   * recently used entries are evicted. `0` disables eviction.
   */
  cacheLimit?: number;
}

/** Resolved, validated renderer parameters with defaults applied. */
export interface ResolvedRendererParameters {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  pixelRatio: number;
  antialias: boolean;
  powerPreference: 'default' | 'high-performance' | 'low-power';
  forceFallbackAdapter: boolean;
  preserveDrawingBuffer: boolean;
  depth: boolean;
  stencil: boolean;
  premultipliedAlpha: boolean;
  alpha: boolean;
  debug: boolean;
  cacheLimit: number;
}

/** Backend capability flags, queried once at construction. */
export interface RendererCapabilities {
  backend: RendererBackend;
  maxTextureSize: number;
  maxTextureUnits: number;
  maxVertexAttributes: number;
  maxSamples: number;
  /** WebGL only: shader precision strings reported by the driver. */
  precision: { vertex: string; fragment: string };
  /** True for a WebGL2 context or any WebGPU device. */
  isWebGL2: boolean;
  features: {
    vertexArrayObject: boolean;
    instancedArrays: boolean;
    elementIndexUint: boolean;
    textureFloat: boolean;
    textureHalfFloat: boolean;
    depthTexture: boolean;
    colorBufferFloat: boolean;
    anisotropy: boolean;
    /** WebGPU only. */
    timestampQuery: boolean;
  };
  /** Renderer name/version string for diagnostics. */
  info: string;
}

/** Per-frame statistics, refreshed by `render()` and `resetInfo()`. */
export interface RendererInfo {
  render: {
    frame: number;
    calls: number;
    triangles: number;
    lines: number;
    points: number;
    /** Milliseconds spent in the last `render()` call. */
    time: number;
  };
  memory: {
    geometries: number;
    textures: number;
    programs: number;
  };
}

/**
 * The renderer surface every backend implements. `WebGLRenderer` and
 * `WebGPURenderer` both satisfy it, which lets application code swap backends
 * without changing anything but the constructor.
 */
export interface Renderer {
  readonly backend: RendererBackend;
  readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  readonly capabilities: RendererCapabilities;
  readonly info: RendererInfo;

  /** Drawing-buffer size in physical pixels. */
  readonly width: number;
  readonly height: number;
  /** CSS size in logical pixels. */
  readonly domWidth: number;
  readonly domHeight: number;

  pixelRatio: number;
  autoClear: boolean;

  setSize(width: number, height: number, updateStyle?: boolean): void;
  setPixelRatio(ratio: number): void;
  setClearColor(color: number | string | Color | null, alpha?: number): void;
  setClearAlpha(alpha: number): void;
  getClearColor(target: Color): Color;
  getClearAlpha(): number;
  clear(color?: boolean, depth?: boolean, stencil?: boolean): void;
  render(scene: Scene, camera: Camera): void;
  /**
   * Redirects subsequent draws into `target`, or back to the canvas when `null`.
   *
   * The renderer manages the viewport, scissor rectangle and framebuffer binding,
   * so a render-target pass is the same code as a canvas pass:
   *
   * ```ts
   * renderer.setRenderTarget(target);
   * renderer.clear();
   * renderer.render(scene, camera);
   * renderer.setRenderTarget(null);
   * ```
   */
  setRenderTarget(target: RenderTarget | null): void;
  /** The target currently bound, or `null` for the canvas. */
  getRenderTarget(): RenderTarget | null;
  resetInfo(): void;
  /** Rough GPU memory footprint of the live caches, in bytes. */
  estimateMemoryUsage(): number;
  /** Uploads a texture ahead of time so the first draw does not stall. */
  initTexture(texture: Texture): void;
  dispose(): void;
}
