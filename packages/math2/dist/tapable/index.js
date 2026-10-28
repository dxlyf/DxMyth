function equalToOrIn(value, check) {
  if (Array.isArray(check)) {
    return check.includes(value);
  }
  return check === value;
}
function callTap(tap, args, ctx) {
  if (tap.context) {
    return tap.callback(ctx, ...args);
  }
  return tap.callback(...args);
}
class InterceptionManager {
  interceptions;
  interceptionKeySet;
  constructor() {
    this.interceptions = [];
    this.interceptionKeySet = /* @__PURE__ */ new Set();
  }
  isUsed() {
    return this.interceptions.length > 0;
  }
  intercept(int) {
    this.interceptions.push(int);
    Object.keys(int).forEach((s) => {
      this.interceptionKeySet.add(s);
    });
  }
  tap(tap) {
    if (this.interceptionKeySet.has("tap")) {
      this.interceptions.forEach((i) => {
        i.tap?.(tap);
      });
    }
  }
  call(ctx, ...args) {
    if (this.interceptionKeySet.has("call")) {
      this.interceptions.forEach((i) => {
        if (i.context) {
          i.call?.(ctx, ...args);
        } else {
          i.call?.(...args);
        }
      });
    }
  }
  loop(...args) {
    if (this.interceptionKeySet.has("loop")) {
      this.interceptions.forEach((i) => {
        i.loop?.(...args);
      });
    }
  }
  error(err) {
    if (this.interceptionKeySet.has("error")) {
      if (err instanceof Error) {
        const asError = err;
        this.interceptions.forEach((i) => {
          i.error?.(asError);
        });
      }
    }
  }
  result(r) {
    if (this.interceptionKeySet.has("result")) {
      this.interceptions.forEach((i) => {
        i.result?.(r);
      });
    }
  }
  done() {
    if (this.interceptionKeySet.has("done")) {
      this.interceptions.forEach((i) => {
        i.done?.();
      });
    }
  }
}
class Hook {
  taps;
  interceptions;
  constructor() {
    this.taps = [];
    this.interceptions = new InterceptionManager();
  }
  tap(options, callback) {
    const resolvedOptions = typeof options === "string" ? {
      name: options,
      context: false
    } : {
      context: false,
      ...options
    };
    const key = Symbol(resolvedOptions.name);
    const tap = {
      key,
      ...resolvedOptions,
      callback
    };
    if (tap.before) {
      let insertionIndex = this.taps.length;
      const beforeSet = new Set(
        Array.isArray(tap.before) ? tap.before : [tap.before]
      );
      for (insertionIndex; insertionIndex > 0 && beforeSet.size > 0; insertionIndex--) {
        const t = this.taps[insertionIndex - 1];
        if (beforeSet.has(t.name)) {
          beforeSet.delete(t.name);
        }
        if (t.before && equalToOrIn(tap.name, t.before)) {
          break;
        }
      }
      this.taps.splice(insertionIndex, 0, tap);
    } else {
      this.taps.push(tap);
    }
    this.interceptions.tap(tap);
    return tap;
  }
  untap(tap) {
    this.taps = this.taps.filter((t) => t.key !== tap.key);
  }
  isUsed() {
    return this.taps.length > 0 || this.interceptions.isUsed();
  }
  intercept(int) {
    this.interceptions.intercept(int);
  }
}
class SyncHook extends Hook {
  call(...args) {
    if (!this.isUsed()) {
      return;
    }
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      this.taps.forEach((t) => {
        callTap(t, args, ctx);
      });
    } catch (err) {
      this.interceptions.error(err);
      throw err;
    }
    this.interceptions.done();
  }
}
class SyncBailHook extends Hook {
  call(...args) {
    if (!this.isUsed()) {
      return;
    }
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
      const rtn = callTap(this.taps[tapIndex], args, ctx);
      if (rtn !== void 0) {
        this.interceptions.result(rtn);
        return rtn;
      }
    }
    this.interceptions.done();
  }
}
class SyncWaterfallHook extends Hook {
  call(...args) {
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    let [rtn, ...rest] = args;
    for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
      const tapValue = callTap(this.taps[tapIndex], [rtn, ...rest], ctx);
      if (tapValue !== void 0) {
        rtn = tapValue;
      }
    }
    this.interceptions.result(rtn);
    return rtn;
  }
}
class SyncLoopHook extends Hook {
  call(...args) {
    let finished = false;
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      while (finished !== true) {
        finished = true;
        this.interceptions.loop(...args);
        for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
          const rtn = callTap(this.taps[tapIndex], args, ctx);
          if (rtn !== void 0) {
            finished = false;
            break;
          }
        }
      }
    } catch (e) {
      this.interceptions.error(e);
      throw e;
    }
    this.interceptions.done();
  }
}
class AsyncParallelHook extends Hook {
  async call(...args) {
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    await Promise.allSettled(this.taps.map((tap) => callTap(tap, args, ctx)));
    this.interceptions.done();
  }
}
class AsyncParallelBailHook extends Hook {
  async call(...args) {
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      const rtn = await Promise.race(
        this.taps.map((tap) => callTap(tap, args, ctx))
      );
      this.interceptions.result(rtn);
      return rtn;
    } catch (e) {
      this.interceptions.error(e);
      throw e;
    }
  }
}
class AsyncSeriesHook extends Hook {
  async call(...args) {
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
        await callTap(this.taps[tapIndex], args, ctx);
      }
    } catch (e) {
      this.interceptions.error(e);
      throw e;
    }
    this.interceptions.done();
  }
}
class AsyncSeriesBailHook extends Hook {
  async call(...args) {
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
        const rtn = await callTap(this.taps[tapIndex], args, ctx);
        if (rtn !== void 0) {
          this.interceptions.result(rtn);
          return rtn;
        }
      }
    } catch (e) {
      this.interceptions.error(e);
      throw e;
    }
    this.interceptions.done();
  }
}
class AsyncSeriesWaterfallHook extends Hook {
  async call(...args) {
    let [rtn, ...rest] = args;
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
        const tapValue = await callTap(
          this.taps[tapIndex],
          [rtn, ...rest],
          ctx
        );
        if (tapValue !== void 0) {
          rtn = tapValue;
        }
      }
    } catch (e) {
      this.interceptions.error(e);
      throw e;
    }
    this.interceptions.result(rtn);
    return rtn;
  }
}
class AsyncSeriesLoopHook extends Hook {
  async call(...args) {
    let finished = false;
    const ctx = {};
    this.interceptions.call(ctx, ...args);
    try {
      while (finished !== true) {
        finished = true;
        this.interceptions.loop(...args);
        for (let tapIndex = 0; tapIndex < this.taps.length; tapIndex += 1) {
          const rtn = await callTap(this.taps[tapIndex], args, ctx);
          if (rtn !== void 0) {
            finished = false;
            break;
          }
        }
      }
    } catch (e) {
      this.interceptions.error(e);
      throw e;
    }
    this.interceptions.done();
  }
}
export {
  AsyncParallelBailHook,
  AsyncParallelHook,
  AsyncSeriesBailHook,
  AsyncSeriesHook,
  AsyncSeriesLoopHook,
  AsyncSeriesWaterfallHook,
  SyncBailHook,
  SyncHook,
  SyncLoopHook,
  SyncWaterfallHook,
  equalToOrIn
};
