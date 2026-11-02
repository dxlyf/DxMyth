/** 可能缺失的值（`null` 或 `undefined`）。 */
export type Maybe<T> = T | null | undefined;

/** 可能为 `null` 的值。 */
export type Nullable<T> = T | null;

/** 所有后端均可接受的画布类型，包含 Worker 中的 `OffscreenCanvas`。 */
export type CanvasLike = HTMLCanvasElement | OffscreenCanvas;

/** 取 `const` 对象的值联合类型。 */
export type ValueOf<T> = T[keyof T];

/** 持有 `dispose` 方法、用于释放外部资源的对象。 */
export interface Disposable {
  dispose(): void;
}

/** 取出 Promise 的解析类型。 */
export type AwaitedValue<T> = T extends PromiseLike<infer U> ? U : T;
