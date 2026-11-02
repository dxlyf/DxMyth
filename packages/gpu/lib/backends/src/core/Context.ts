import type { Capabilities } from './Capabilities';
import type { BackendKind } from './enums';
import { EventEmitter } from './events';
import type { CanvasLike, Disposable } from './types';

/** 上下文事件表。 */
export interface ContextEvents {
  lost: [];
  restored: [];
  resize: [{ width: number; height: number }];
}

/** 创建上下文时的通用选项。 */
export interface ContextOptions {
  readonly canvas: CanvasLike;
  /** 是否跟随画布尺寸与 devicePixelRatio 自动调整，默认 `true`。 */
  readonly autoResize?: boolean;
  /** 覆盖像素比；省略时采用 `devicePixelRatio`。 */
  readonly pixelRatio?: number;
}

/** 所有图形上下文的抽象基类。 */
export abstract class Context implements Disposable {
  /** 上下文事件（丢失、恢复、尺寸变化）。 */
  readonly events = new EventEmitter<ContextEvents>();
  readonly canvas: CanvasLike;
  readonly autoResize: boolean;
  #pixelRatio: number;
  #disposed = false;
  #resizeObserver: ResizeObserver | null = null;

  protected constructor(options: ContextOptions) {
    this.canvas = options.canvas;
    this.autoResize = options.autoResize ?? true;
    this.#pixelRatio =
      options.pixelRatio ?? (typeof devicePixelRatio === 'number' ? devicePixelRatio : 1);

    if (
      this.autoResize &&
      typeof ResizeObserver !== 'undefined' &&
      typeof HTMLCanvasElement !== 'undefined' &&
      options.canvas instanceof HTMLCanvasElement
    ) {
      this.#resizeObserver = new ResizeObserver(() => {
        this.resizeToDisplaySize();
      });
      this.#resizeObserver.observe(options.canvas);
    }
  }

  /** 后端类型。 */
  abstract readonly backend: BackendKind;

  /** 归一化后的能力与限制。 */
  abstract readonly capabilities: Capabilities;

  /** 绘制缓冲宽度（设备像素）。 */
  abstract get width(): number;

  /** 绘制缓冲高度（设备像素）。 */
  abstract get height(): number;

  /** 当前像素比。 */
  get pixelRatio(): number {
    return this.#pixelRatio;
  }

  /** 是否已销毁。 */
  get disposed(): boolean {
    return this.#disposed;
  }

  /** 设置像素比；子类负责触发尺寸更新。 */
  protected setPixelRatio(value: number): void {
    this.#pixelRatio = Math.max(0, value);
  }

  /** 调整绘制缓冲尺寸。 */
  abstract resize(width: number, height: number): void;

  /**
   * 按画布 CSS 尺寸 × `pixelRatio` 调整绘制缓冲。
   *
   * @returns 是否发生了尺寸变化。
   */
  resizeToDisplaySize(): boolean {
    const canvas = this.canvas;
    if (!('clientWidth' in canvas) || !('clientHeight' in canvas)) {
      return false;
    }
    const width = Math.max(1, Math.round(canvas.clientWidth * this.pixelRatio));
    const height = Math.max(1, Math.round(canvas.clientHeight * this.pixelRatio));
    if (width === this.width && height === this.height) {
      return false;
    }
    this.resize(width, height);
    return true;
  }

  /** 销毁上下文及其所有资源；幂等。 */
  dispose(): void {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.disposeContext();
    this.events.clear();
  }

  /** 子类在此释放上下文相关的资源。 */
  protected abstract disposeContext(): void;
}
