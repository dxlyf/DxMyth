import type { Context, ContextOptions } from './Context';
import type { BackendKind } from './enums';

/** 创建后端上下文时的选项。 */
export interface BackendCreateOptions extends ContextOptions {
  readonly powerPreference?: 'default' | 'low-power' | 'high-performance';
  readonly alpha?: boolean;
  readonly antialias?: boolean;
  readonly depth?: boolean;
  readonly stencil?: boolean;
  readonly premultipliedAlpha?: boolean;
  readonly preserveDrawingBuffer?: boolean;
  readonly failIfMajorPerformanceCaveat?: boolean;
}

/** 单一图形 API 的后端抽象。 */
export abstract class Backend<TContext extends Context = Context> {
  /** 后端类型。 */
  abstract readonly kind: BackendKind;

  /** 当前环境是否支持此后端。 */
  abstract isSupported(): boolean;

  /** 创建并初始化上下文。 */
  abstract create(options: BackendCreateOptions): Promise<TContext>;
}
