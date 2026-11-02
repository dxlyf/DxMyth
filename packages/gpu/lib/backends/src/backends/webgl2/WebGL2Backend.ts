import { Backend, type BackendCreateOptions } from '../../core/Backend';
import { BackendKind } from '../../core/enums';
import { UnsupportedError } from '../../core/errors';
import { WebGL2Context } from './WebGL2Context';

/** WebGL2 后端。 */
export class WebGL2Backend extends Backend<WebGL2Context> {
  readonly kind = BackendKind.WebGL2;

  /** 当前环境是否可创建 WebGL2 上下文。 */
  isSupported(): boolean {
    try {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        return canvas.getContext('webgl2') !== null;
      }
      if (typeof OffscreenCanvas !== 'undefined') {
        const canvas = new OffscreenCanvas(1, 1);
        return canvas.getContext('webgl2') !== null;
      }
    } catch {
      return false;
    }
    return false;
  }

  /** 创建 WebGL2 上下文。 */
  async create(options: BackendCreateOptions): Promise<WebGL2Context> {
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
    const gl = options.canvas.getContext('webgl2', attributes);
    if (gl === null) {
      throw new UnsupportedError('WebGL2 上下文', 'webgl2');
    }
    return new WebGL2Context(options, gl);
  }
}
