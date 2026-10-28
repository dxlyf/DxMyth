class EventEmitter {
  _events = /* @__PURE__ */ new Map();
  /**
   * 注册事件监听器。
   *
   * @param event 事件名
   * @param fn 回调函数或 handleEvent 对象
   * @param context 回调执行时的 this 上下文
   */
  on(event, fn, context) {
    return this._addListener(event, fn, false, context);
  }
  /**
   * 注册一次性事件监听器（触发后自动移除）。
   */
  once(event, fn, context) {
    return this._addListener(event, fn, true, context);
  }
  /**
   * 等待指定事件触发一次，返回 Promise。
   *
   * @param event 事件名
   * @param timeout 超时毫秒数；超时则 reject（不传则不超时）
   * @returns 事件触发时以监听器参数 resolve；超时则 reject
   */
  waitOn(event, timeout) {
    return new Promise((resolve, reject) => {
      let timer;
      const handler = (...args) => {
        if (timer !== void 0) clearTimeout(timer);
        resolve(args);
      };
      this.once(event, handler);
      if (timeout !== void 0 && timeout >= 0) {
        timer = setTimeout(() => {
          this.off(event, handler, void 0, true);
          reject(new Error(`waitOn("${event}") 超时 (${timeout}ms)`));
        }, timeout);
      }
    });
  }
  /**
   * 移除事件监听器。
   *
   * @param event 事件名，不传则移除所有事件
   * @param fn 指定回调，不传则移除该事件下全部监听器
   * @param context 指定上下文（需与注册时一致才匹配）
   * @param once 是否只移除 once 监听器
   */
  off(event, fn, context, once) {
    if (!event) {
      this._events.clear();
      return this;
    }
    const entries = this._events.get(event);
    if (!entries) return this;
    if (!fn) {
      this._events.delete(event);
      return this;
    }
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e.fn === fn && (once === void 0 || e.once === once) && (context === void 0 || e.context === context)) {
        entries.splice(i, 1);
      }
    }
    if (entries.length === 0) {
      this._events.delete(event);
    }
    return this;
  }
  /**
   * 触发事件。
   *
   * @param event 事件名
   * @param args 传递给监听器的参数
   * @returns 是否有监听器被调用
   */
  emit(event, ...args) {
    const entries = this._events.get(event);
    if (!entries || entries.length === 0) return false;
    const listeners = entries.slice();
    for (let i = 0; i < listeners.length; i++) {
      const e = listeners[i];
      if (e.once) {
        this.off(event, e.fn, e.context, true);
      }
      this._invoke(e, args);
    }
    return true;
  }
  /**
   * 获取指定事件的所有监听器列表。
   */
  listeners(event) {
    const entries = this._events.get(event);
    if (!entries) return [];
    return entries.map((e) => e.fn);
  }
  /**
   * 指定事件是否有监听器。
   * 不传 event 则检查是否有任意监听器。
   */
  hasListeners(event) {
    if (event) {
      const entries = this._events.get(event);
      return !!entries && entries.length > 0;
    }
    for (const entries of this._events.values()) {
      if (entries.length > 0) return true;
    }
    return false;
  }
  /**
   * 移除所有监听器。不传 event 则移除所有事件，传 event 则只移除该事件。
   */
  removeAllListeners(event) {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
    return this;
  }
  /**
   * 获取指定事件的监听器数量。
   */
  listenerCount(event) {
    const entries = this._events.get(event);
    return entries ? entries.length : 0;
  }
  /**
   * 获取所有已注册的事件名。
   */
  eventNames() {
    return Array.from(this._events.keys());
  }
  // ---- 内部 ----
  _addListener(event, fn, once, context) {
    let entries = this._events.get(event);
    if (!entries) {
      entries = [];
      this._events.set(event, entries);
    }
    entries.push({ fn, once, context });
    return this;
  }
  _invoke(entry, args) {
    const { fn, context } = entry;
    if (typeof fn === "function") {
      fn.apply(context, args);
    } else if (typeof fn.handleEvent === "function") {
      fn.handleEvent.apply(context, args);
    }
  }
}
export {
  EventEmitter
};
