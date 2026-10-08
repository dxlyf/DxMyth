/** Listener signature; `T` is the event payload type. */
export type Listener<T> = (event: T) => void;

/**
 * Minimal typed event emitter used by geometries, materials, textures and
 * render targets so the renderer can react to `dispose` and `needsUpdate`.
 */
export class EventDispatcher<TEventMap extends object = Record<string, unknown>> {
  private _listeners: {
    [K in keyof TEventMap]?: Set<Listener<TEventMap[K]>>;
  } = {};

  addEventListener<K extends keyof TEventMap>(type: K, listener: Listener<TEventMap[K]>): void {
    let set = this._listeners[type];
    if (!set) {
      set = new Set();
      this._listeners[type] = set;
    }
    set.add(listener);
  }

  hasEventListener<K extends keyof TEventMap>(type: K, listener: Listener<TEventMap[K]>): boolean {
    return this._listeners[type]?.has(listener) ?? false;
  }

  removeEventListener<K extends keyof TEventMap>(type: K, listener: Listener<TEventMap[K]>): void {
    this._listeners[type]?.delete(listener);
  }

  /** Dispatches to a snapshot of the listener set so handlers may unsubscribe. */
  dispatchEvent<K extends keyof TEventMap>(type: K, event: TEventMap[K]): void {
    const set = this._listeners[type];
    if (!set || set.size === 0) return;
    for (const listener of Array.from(set)) listener(event);
  }

  removeAllEventListeners(): void {
    this._listeners = {};
  }
}
