import { Backend, type BackendCreateOptions } from '../../core/Backend';
import { BackendKind } from '../../core/enums';
import { UnsupportedError } from '../../core/errors';
import { WebGLContext } from './WebGLContext';

/** WebGL1 后端。 */
export class WebGLBackend extends Backend<WebGLContext> {
  readonly kind = BackendKind.WebGL;

  /** 当前环境是否可创建 WebGL1 上下文。 */
  isSupported(): boolean {
    try {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        return canvas.getContext('webgl') !== null;
      }
      if (typeof OffscreenCanvas !== 'undefined') {
        const canvas = new OffscreenCanvas(1, 1);
        return canvas.getContext('webgl') !== null;
      }
    } catch {
      return false;
    }
    return false;
  }

  /** 创建 WebGL1 上下文。 */
  async create(options: BackendCreateOptions): Promise<WebGLContext> {
    const attributes: WebGLContextAttributes = {
      alpha: options.alpha,
      antialias: options.antialias,
      depth: options.depth,
      stencil: options.stencil,
      premultipliedAlpha: options.premultipliedAlpha,
      preserveDrawingBuffer: options.preserveDrawingBuffer,
      failIfMajorPerformanceCaveat: options.failIfMajorPerformanceCaveat,
      powerPreference: options.powerPreference,
    };
    const gl = options.canvas.getContext('webgl', attributes);
    if (gl === null) {
      throw new UnsupportedError('WebGL1 上下文', 'webgl');
    }
    return new WebGLContext(options, gl);
  }
}
