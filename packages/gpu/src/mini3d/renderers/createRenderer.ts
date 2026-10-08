import type {
  Renderer,
  RendererBackend,
  RendererParameters,
} from '../core/types';
import { WebGLRenderer, type WebGLRendererParameters } from './webgl/WebGLRenderer';


/**
 * The WebGPU backend is loaded on demand: importing it eagerly would make a
 * WebGL-only application pay for the WebGPU code path (and vice versa in
 * environments where `navigator.gpu` exists but the module is unwanted).
 */
async function loadWebGPU(): Promise<typeof import('./webgpu/WebGPURenderer')> {
  return import('./webgpu/WebGPURenderer');
}

export interface CreateRendererOptions extends RendererParameters {
  /**
   * Preferred backend. `'auto'` (the default) picks WebGPU when the
   * environment supports it and falls back to WebGL2, then WebGL1.
   */
  backend?: RendererBackend | 'auto';
  /** Prefer WebGL2 over WebGPU even when both are available. */
  preferWebGL?: boolean;
  /** Force a WebGL1 context (useful for testing the legacy path). */
  forceWebGL1?: boolean;
  /**
   * WebGPU only: milliseconds to wait for `requestAdapter()` /
   * `requestDevice()` before giving up, so a stub adapter cannot hang startup.
   */
  deviceTimeout?: number;
}

/** What the current environment can actually do. */
export interface BackendSupport {
  webgpu: boolean;
  webgl2: boolean;
  webgl1: boolean;
  /** Reason WebGPU is unavailable, when it is. */
  webgpuReason?: string;
}

/**
 * Probes `navigator.gpu` / canvas context availability, cheaply and safely.
 *
 * `requestAdapter()` can hang indefinitely when no usable adapter exists (for
 * example in headless Chrome, where a stub adapter is returned but never
 * settles), so the probe is bounded by `timeoutMs`.
 */
export async function detectBackends(timeoutMs?: number): Promise<BackendSupport> {
  const support: BackendSupport = { webgpu: false, webgl2: false, webgl1: false };
  // `undefined` keeps the default probe budget; an explicit value (including 0,
  // which skips the WebGPU probe entirely) is honoured.
  const budget = timeoutMs ?? 5000;

  const nav = (globalThis as { navigator?: { gpu?: unknown } }).navigator;
  if (nav && nav.gpu) {
    if (budget <= 0) {
      // Opt out of the probe entirely: `requestAdapter()` can hang, which would
      // otherwise delay renderer creation by the full timeout.
      support.webgpuReason = 'skipped (probe timeout disabled)';
      return probeCanvasSupport(support);
    }
    try {
      const gpu = nav.gpu as { requestAdapter(): Promise<unknown | null> };
      const adapter = await Promise.race([
        gpu.requestAdapter().catch((error) => {
          support.webgpuReason = error instanceof Error ? error.message : String(error);
          return null;
        }),
        new Promise<null>((resolve) => {
          setTimeout(() => {
            support.webgpuReason = `requestAdapter() did not settle within ${budget} ms`;
            resolve(null);
          }, budget);
        }),
      ]);
      if (adapter) support.webgpu = true;
      else support.webgpuReason = support.webgpuReason ?? 'requestAdapter() returned null (no compatible adapter)';
    } catch (error) {
      support.webgpuReason = error instanceof Error ? error.message : String(error);
    }
  } else {
    support.webgpuReason = 'navigator.gpu is not available (WebGPU unsupported or disabled)';
  }

  return probeCanvasSupport(support);
}

/** Fills in the WebGL capability flags by probing a throwaway canvas. */
function probeCanvasSupport(support: BackendSupport): BackendSupport {
  if (typeof document !== 'undefined') {
    try {
      const probe = document.createElement('canvas');
      support.webgl2 = probe.getContext('webgl2') !== null;
      support.webgl1 = support.webgl2 || probe.getContext('webgl') !== null;
    } catch {
      /* leave both false */
    }
  }
  return support;
}

/**
 * Creates the best available renderer.
 *
 * ```ts
 * const renderer = await createRenderer({ backend: 'auto', antialias: true });
 * ```
 */
export async function createRenderer(options: CreateRendererOptions = {}): Promise<Renderer> {
  const requested = options.backend ?? 'auto';

  if (requested === 'webgl') {
    return new WebGLRenderer({ ...options, forceWebGL1: true } as WebGLRendererParameters);
  }
  if (requested === 'webgl2') {
    return new WebGLRenderer(options as WebGLRendererParameters);
  }
  if (requested === 'webgpu') {
    return createWebGPU(options);
  }

  // 'auto'
  if (!options.preferWebGL) {
    const support = await detectBackends(options.deviceTimeout ?? undefined);
    if (support.webgpu) {
      try {
        return await createWebGPU(options);
      } catch {
        // Fall through to WebGL when the adapter rejects the request.
      }
    }
  }
  return new WebGLRenderer({ ...options, forceWebGL1: options.forceWebGL1 } as WebGLRendererParameters);
}

/**
 * Convenience wrapper returning a renderer plus its backend name, for demos
 * that want to display which API is in use.
 */
export async function autoRenderer(
  options: CreateRendererOptions = {},
): Promise<{ renderer: Renderer; backend: RendererBackend }> {
  const renderer = await createRenderer(options);
  return { renderer, backend: renderer.backend };
}

async function createWebGPU(options: CreateRendererOptions): Promise<Renderer> {
  const { WebGPURenderer } = await loadWebGPU();
  if (!WebGPURenderer.isAvailable()) {
    throw new Error('mini3d.createRenderer: WebGPU is not available in this environment');
  }
  return WebGPURenderer.create(options);
}
