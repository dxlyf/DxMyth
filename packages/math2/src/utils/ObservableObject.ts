type ChangeCallbackParamter={ path: string,parent:string,field: string, newValue: any, oldValue: any }
type ChangeCallback = (change: ChangeCallbackParamter) => void;

class ObservableObject {
  private proxy: any;
  private listeners: ChangeCallback[] = [];
  private rawToProxy = new WeakMap<object, object>();
  private proxyToRaw = new WeakMap<object, object>();

  constructor(target: object) {
    this.proxy = this.createProxy(target, '');
  }

  get value() {
    return this.proxy;
  }

  subscribe(callback: ChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(e:ChangeCallbackParamter) {
    this.listeners.forEach(cb => cb(e));
  }

  private createProxy(target: object, path: string): object {
    // 如果已经存在代理，返回
    if (this.proxyToRaw.has(target)) {
      return this.proxyToRaw.get(target); // 其实应该是rawToProxy，需要检查
    }
    // 检查rawToProxy中是否已经有代理
    const existingProxy = this.rawToProxy.get(target);
    if (existingProxy) return existingProxy;

    const handler: ProxyHandler<object> = {
      get: (obj, prop, receiver) => {
        const value = Reflect.get(obj, prop, receiver);
        // 嵌套对象懒代理
        if (typeof value === 'object' && value !== null) {
          // 构建子路径
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
          this.notify({path:changePath,parent:path,field:String(prop),newValue,oldValue});
          // 如果新值是对象，后续通过get会懒代理，这里不需要特殊处理
          return result;
        }
        return true;
      },
      // 可能需要处理删除属性等
    };

    const proxy = new Proxy(target, handler);
    this.rawToProxy.set(target, proxy);
    this.proxyToRaw.set(proxy, target);
    return proxy;
  }
}