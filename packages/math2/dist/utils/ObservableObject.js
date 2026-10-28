class ObservableObject {
  proxy;
  listeners = [];
  rawToProxy = /* @__PURE__ */ new WeakMap();
  proxyToRaw = /* @__PURE__ */ new WeakMap();
  constructor(target) {
    this.proxy = this.createProxy(target, "");
  }
  get value() {
    return this.proxy;
  }
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }
  notify(e) {
    this.listeners.forEach((cb) => cb(e));
  }
  createProxy(target, path) {
    if (this.proxyToRaw.has(target)) {
      return this.proxyToRaw.get(target);
    }
    const existingProxy = this.rawToProxy.get(target);
    if (existingProxy) return existingProxy;
    const handler = {
      get: (obj, prop, receiver) => {
        const value = Reflect.get(obj, prop, receiver);
        if (typeof value === "object" && value !== null) {
          const childPath = path ? `${path}.${String(prop)}` : String(prop);
          return this.createProxy(value, childPath);
        }
        return value;
      },
      set: (obj, prop, newValue, receiver) => {
        const oldValue = Reflect.get(obj, prop, receiver);
        if (oldValue !== newValue) {
          const result = Reflect.set(obj, prop, newValue, receiver);
          const changePath = path ? `${path}.${String(prop)}` : String(prop);
          this.notify({ path: changePath, parent: path, field: String(prop), newValue, oldValue });
          return result;
        }
        return true;
      }
      // 可能需要处理删除属性等
    };
    const proxy = new Proxy(target, handler);
    this.rawToProxy.set(target, proxy);
    this.proxyToRaw.set(proxy, target);
    return proxy;
  }
}
export {
  ObservableObject
};
