import { CanvasKitInit, CanvasKitInitWasmUrl } from "./canvaskit.es.js";
const LYF_EVENTS = {
  BEFORE_INIT: "beforeInit",
  INIT: "init",
  DISPOSE: "dispose"
};
class EventEmitter {
  // 存储事件监听器的映射
  events = /* @__PURE__ */ new Map();
  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   * @returns 当前实例，支持链式调用
   */
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, /* @__PURE__ */ new Set());
    }
    this.events.get(event).add(listener);
    return this;
  }
  /**
   * 注册一次性事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   * @returns 当前实例，支持链式调用
   */
  once(event, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.off(event, onceListener);
    };
    onceListener._originalListener = listener;
    return this.on(event, onceListener);
  }
  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   * @returns 当前实例，支持链式调用
   */
  off(event, listener) {
    const listeners = this.events.get(event);
    if (listeners) {
      if (listener) {
        listeners.forEach((l) => {
          if (l === listener || l._originalListener === listener) {
            listeners.delete(l);
          }
        });
      }
      if (listeners.size === 0 || !listener) {
        this.events.delete(event);
      }
    }
    return this;
  }
  /**
   * 移除指定事件的所有监听器
   * @param event 事件名称
   * @returns 当前实例，支持链式调用
   */
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  listenerCount(event) {
    return this.events.get(event)?.size || 0;
  }
  /**
   * 获取指定事件的所有监听器
   * @param event 事件名称
   * @returns 监听器数组
   */
  listeners(event) {
    return Array.from(this.events.get(event) || []);
  }
  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns 当前实例，支持链式调用
   */
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
    return this;
  }
  /**
   * 获取所有已注册的事件名称
   * @returns 事件名称数组
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
}
const getType = Function.prototype.call.bind(Object.prototype.toString);
const isUndefined = (value) => {
  return value === void 0;
};
const isArray = (value) => {
  return Array.isArray(value);
};
const isObject = (value) => {
  return getType(value) === "[object Object]";
};
const isPlainObject = (value) => {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  return proto === Object.prototype;
};
const _mergeWith = (target, source, merge2, parentContext = null) => {
  if (isArray(source)) {
    for (const [name, value] of source) {
      const context = {
        target,
        source,
        key: name,
        objValue: target[name],
        srcValue: value,
        path: parentContext ? parentContext.path + `[${name}]` : `[${name}]`,
        merge: merge2
      };
      merge2(context);
    }
  } else if (isPlainObject(source)) {
    for (const [name, value] of Object.entries(source)) {
      const context = {
        target,
        source,
        key: name,
        objValue: target[name],
        srcValue: value,
        path: parentContext ? parentContext.path + `.${name}` : name,
        merge: merge2
      };
      merge2(context);
    }
  }
  return target;
};
const handleDeepMergeConfig = (context) => {
  const { target, source, key, objValue, srcValue, path } = context;
  if (isUndefined(srcValue)) {
    return;
  }
  if (isArray(srcValue)) {
    context.target[context.key] = (isArray(objValue) ? objValue : []).concat(srcValue);
  } else if (isPlainObject(srcValue)) {
    context.target[context.key] = _mergeWith(isPlainObject(objValue) ? objValue : {}, srcValue, context.merge, context);
  } else {
    context.target[context.key] = srcValue;
  }
};
const mergeConfig = (target, ...sources) => {
  const lastReducer = sources[0];
  let length = sources.length;
  let handle = handleDeepMergeConfig;
  if (typeof lastReducer === "function") {
    handle = lastReducer(handleDeepMergeConfig);
    length--;
  }
  for (let i = 0; i < length; i++) {
    _mergeWith(target, sources[i], handle);
  }
  return target;
};
const CANVAS_RENDERER_EVENTS = {
  RESIZE: "resize",
  DISPOSE: "dispose"
};
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
const useElementResize = (options) => {
  const { element, resizeTo = "element", enableWindowResize = true, enableElementResize = true, debounceDelay = 10, onResize } = options;
  const handleResize = debounce(() => {
    const win = element.ownerDocument.defaultView || window;
    if (resizeTo === "element") {
      onResize(element.clientWidth, element.clientHeight);
    } else if (resizeTo === "parent") {
      const parent = element.parentElement;
      if (!parent) {
        return;
      }
      onResize(parent.clientWidth || 0, parent.clientHeight || 0);
    } else {
      onResize(win.innerWidth, win.innerHeight);
    }
  }, debounceDelay);
  if (enableWindowResize) {
    window.addEventListener("resize", handleResize);
  }
  let observer;
  if (enableElementResize && resizeTo === "element") {
    observer = new ResizeObserver(handleResize);
    observer.observe(element);
  }
  handleResize();
  return () => {
    observer && observer.disconnect();
    window.removeEventListener("resize", handleResize);
  };
};
class CanvasRenderer extends EventEmitter {
  type = "canvas";
  domElement;
  ctx;
  options;
  constructor(options) {
    super();
    this.options = options;
    this.createDomElement();
    this.domElement.style.display = "block";
    if (this.options.width && this.options.height) {
      this.setSize(this.options.width, this.options.height);
    } else {
      this.on(CANVAS_RENDERER_EVENTS.DISPOSE, useElementResize({
        element: this.domElement,
        resizeTo: this.options.resizeTo,
        onResize: (width, height) => {
          this.setSize(width, height);
        }
      }));
    }
  }
  createDomElement() {
    const container = this.options.canvas;
    if (container instanceof HTMLCanvasElement) {
      this.domElement = container;
    } else {
      this.domElement = document.createElement("canvas");
      container.appendChild(this.domElement);
    }
  }
  setSize(width, height) {
    const dpr = this.options.dpr;
    this.domElement.width = width * dpr >> 0;
    this.domElement.height = height * dpr >> 0;
    if (dpr > 1) {
      this.domElement.style.width = `${width}px`;
      this.domElement.style.height = `${height}px`;
    }
    this.emit(CANVAS_RENDERER_EVENTS.RESIZE, width, height);
  }
  dispose() {
    this.emit(CANVAS_RENDERER_EVENTS.DISPOSE);
  }
}
const CanvasPlugin = (lyf) => {
  lyf.on(LYF_EVENTS.BEFORE_INIT, (lyf2) => {
    const config = lyf2.config;
    if (config.rendererType === "canvas") {
      const canvasRenderer = new CanvasRenderer({
        canvas: config.canvas,
        width: config.width,
        height: config.height,
        resizeTo: config.resizeTo,
        dpr: config.dpr
      });
      lyf2.registerRenderer("canvas", canvasRenderer);
    }
  });
};
const SVG_RENDERER_EVENTS = {
  RESIZE: "resize",
  DISPOSE: "dispose"
};
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const createSvgElement = (tagName) => {
  return document.createElementNS(SVG_NAMESPACE, tagName);
};
class SvgRenderer extends EventEmitter {
  type = "svg";
  domElement;
  options;
  constructor(options) {
    super();
    this.options = options;
    this.createDomElement();
    this.domElement.style.display = "block";
    if (this.options.width && this.options.height) {
      this.setSize(this.options.width, this.options.height);
    } else {
      this.on(SVG_RENDERER_EVENTS.DISPOSE, useElementResize({
        element: this.domElement,
        resizeTo: this.options.resizeTo,
        onResize: (width, height) => {
          this.setSize(width, height);
        }
      }));
    }
  }
  createDomElement() {
    const container = this.options.canvas;
    if (container instanceof HTMLCanvasElement) {
      this.domElement = container;
    } else {
      this.domElement = createSvgElement("svg");
      container.appendChild(this.domElement);
    }
  }
  setSize(width, height) {
    this.domElement.style.width = `${width}px`;
    this.domElement.style.height = `${height}px`;
    this.emit(SVG_RENDERER_EVENTS.RESIZE, width, height);
  }
  dispose() {
    this.emit(SVG_RENDERER_EVENTS.DISPOSE);
  }
}
const SvgPlugin = (lyf) => {
  lyf.on(LYF_EVENTS.BEFORE_INIT, (lyf2) => {
    const config = lyf2.config;
    if (config.rendererType === "svg") {
      const renderer = new SvgRenderer(config);
      lyf2.registerRenderer("svg", renderer);
    }
  });
};
class CanvasKitRenderer {
  type;
  domElement;
  constructor(options) {
  }
  dispose() {
  }
}
let canvaskKitPromise;
let _ck = null;
const getCanvasKit = () => {
  if (canvaskKitPromise) {
    return canvaskKitPromise;
  }
  canvaskKitPromise = CanvasKitInit({
    locateFile: (file) => {
      return CanvasKitInitWasmUrl;
    }
  }).then((CanvasKit) => {
    _ck = CanvasKit;
    return CanvasKit;
  });
  return canvaskKitPromise;
};
const canvasKit = {
  getCanvasKit,
  get ck() {
    if (!_ck) {
      throw new Error("CanvasKit not initialized");
    }
    return _ck;
  }
};
const CanvasKitPlugin = (lyf) => {
  lyf.addInitTask(new Promise((resolve) => {
    canvasKit.getCanvasKit().then((CanvasKit) => {
      lyf.ck = CanvasKit;
      resolve();
    });
  }));
  lyf.on(LYF_EVENTS.BEFORE_INIT, (lyf2) => {
    const config = lyf2.config;
    if (config.rendererType === "canvaskit") {
      const renderer = new CanvasKitRenderer(config);
      lyf2.registerRenderer("canvaskit", renderer);
    }
  });
};
const CorePlugin = (lyf) => {
  lyf.registerPlugin(CanvasPlugin, CanvasKitPlugin, SvgPlugin);
};
class Lyf extends EventEmitter {
  static defaultPlugins = [CorePlugin];
  static registerPlugin(plugin) {
    this.defaultPlugins.push(plugin);
  }
  config;
  renderer = null;
  renderers = {};
  promises = [];
  // 初始化任务，会在initialize时并行执行
  plugins = /* @__PURE__ */ new Set();
  constructor() {
    super();
    this.registerPlugin(...Lyf.defaultPlugins);
  }
  registerPlugin(...plugins) {
    plugins.forEach((plugin) => {
      this.plugins.add(plugin);
    });
  }
  installPlugins() {
    this.plugins.forEach((plugin) => {
      plugin(this);
    });
    this.plugins.clear();
  }
  registerRenderer(type, renderer) {
    this.renderers[type] = renderer;
  }
  // 初始化任务，会在initialize时并行执行
  addInitTask(promise) {
    this.promises.push(promise);
  }
  get domElement() {
    return this.renderer.domElement;
  }
  async initialize(config) {
    try {
      this.config = mergeConfig({
        dpr: window.devicePixelRatio,
        plugins: []
      }, config);
      if (this.config.plugins) {
        this.registerPlugin(...this.config.plugins);
      }
      this.installPlugins();
      await Promise.all(this.promises);
      this.emit(LYF_EVENTS.BEFORE_INIT, this);
      this.renderer = this.renderers[this.config.rendererType];
      this.emit(LYF_EVENTS.INIT, this);
    } catch (e) {
      console.error("initialize error", e);
    }
  }
  dispose() {
    this.emit(LYF_EVENTS.DISPOSE, this);
  }
}
const copy$1 = (out, m) => {
  out[0] = m[0];
  out[1] = m[1];
  out[2] = m[2];
  out[3] = m[3];
  out[4] = m[4];
  out[5] = m[5];
  return out;
};
const identity = (out) => {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
};
const multiplyMatrices = (out, m, n) => {
  const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5];
  const b0 = n[0], b1 = n[1], b2 = n[2], b3 = n[3], b4 = n[4], b5 = n[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
};
const inverse = (out, m) => {
  const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5];
  const det = a0 * a3 - a2 * a1;
  if (det === 0) {
    throw new Error("Matrix is singular, cannot be inverted.");
  }
  const invDet = 1 / det;
  out[0] = a3 * invDet;
  out[1] = -a1 * invDet;
  out[2] = -a2 * invDet;
  out[3] = a0 * invDet;
  out[4] = (a2 * a5 - a3 * a4) * invDet;
  out[5] = (a1 * a4 - a0 * a5) * invDet;
  return out;
};
const determinant = (m) => {
  const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3];
  return a0 * a3 - a2 * a1;
};
const adjoint = (out, m) => {
  const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5];
  out[0] = a3;
  out[1] = -a1;
  out[2] = -a2;
  out[3] = a0;
  out[4] = a2 * a5 - a3 * a4;
  out[5] = a1 * a4 - a0 * a5;
  return out;
};
const mapPoint = (out, point, m) => {
  const x = point.x, y = point.y;
  const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5];
  out.x = a0 * x + a2 * y + a4;
  out.y = a1 * x + a3 * y + a5;
  return out;
};
const mapPoints = (out, points, m) => {
  for (let i = 0; i < points.length; i++) {
    mapPoint(out[i], points[i], m);
  }
  return out;
};
const fromTranslateRotateScale = (out, translate, rotate, scale) => {
  const cos = Math.cos(rotate), sin = Math.sin(rotate);
  const sx = scale.x, sy = scale.y;
  out[0] = cos * sx;
  out[1] = sin * sx;
  out[2] = -sin * sy;
  out[3] = cos * sy;
  out[4] = translate.x;
  out[5] = translate.y;
  return out;
};
const fromTranslate = (out, x, y) => {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = x;
  out[5] = y;
  return out;
};
const fromRotate = (out, rotate) => {
  const cos = Math.cos(rotate), sin = Math.sin(rotate);
  out[0] = cos;
  out[1] = sin;
  out[2] = -sin;
  out[3] = cos;
  out[4] = 0;
  out[5] = 0;
  return out;
};
const fromSkew = (out, skewX, skewY) => {
  out[0] = 1;
  out[1] = skewY;
  out[2] = skewX;
  out[3] = 1;
  out[4] = 1;
  out[5] = 1;
  return out;
};
const fromSkewAngle = (out, angleX, angleY) => {
  const skewX = Math.tan(angleX), skewY = Math.tan(angleY);
  out[0] = 1;
  out[1] = skewY;
  out[2] = skewX;
  out[3] = 1;
  out[4] = 1;
  out[5] = 1;
  return out;
};
const fromScale = (out, scale) => {
  out[0] = scale;
  out[1] = 0;
  out[2] = 0;
  out[3] = scale;
  out[4] = 0;
  out[5] = 0;
  return out;
};
const fromTranslateSkewRotationScaleOrigin = (out, translate, skew, rotate, scale, origin) => {
  const cos = Math.cos(rotate), sin = Math.sin(rotate);
  const skewX = Math.tan(skew.x), skewY = Math.tan(skew.y);
  const sx = scale.x, sy = scale.y;
  const originX = origin.x, originY = origin.y;
  const translateX = translate.x, translateY = translate.y;
  let a = cos + skewX * sin;
  let b = skewY * cos + sin;
  let c = -sin + skewX * cos;
  let d = skewY * -sin + cos;
  let e = originX + translateX;
  let f = originY + translateY;
  a *= sx;
  b *= sx;
  c *= sy;
  d *= sy;
  e -= a * originX + c * originY;
  f -= b * originX + d * originY;
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = e;
  out[5] = f;
  return out;
};
const extractTranslateSkewRotationScaleOrigin = (m, origin) => {
  const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5];
  const scaleX = Math.sqrt(a0 * a0 + a1 * a1);
  const scaleY = Math.sqrt(a2 * a2 + a3 * a3);
  const rotation = Math.atan2(a1, a0);
  const cos = Math.cos(-rotation);
  const sin = Math.sin(-rotation);
  const skewMatrix0 = (a0 * cos + a1 * sin) / scaleX;
  const skewMatrix1 = (-a0 * sin + a1 * cos) / scaleX;
  const skewMatrix2 = (a2 * cos + a3 * sin) / scaleY;
  const skewMatrix3 = (-a2 * sin + a3 * cos) / scaleY;
  const skewX = Math.atan2(skewMatrix2, skewMatrix0);
  const skewY = Math.atan2(skewMatrix1, skewMatrix3);
  const translateX = a4 - origin.x + origin.x * scaleX * Math.cos(rotation) - origin.y * scaleY * Math.sin(rotation + skewX);
  const translateY = a5 - origin.y + origin.x * scaleX * Math.sin(rotation) + origin.y * scaleY * Math.cos(rotation + skewX);
  return {
    translate: { x: translateX, y: translateY },
    skew: { x: skewX, y: skewY },
    rotation,
    scale: { x: scaleX, y: scaleY }
  };
};
class Matrix2D extends Float32Array {
  clone() {
    return new Matrix2D(this);
  }
  copy(m) {
    copy$1(this, m);
    return this;
  }
  isIdentity() {
    return this[0] === 1 && this[1] === 0 && this[2] === 0 && this[3] === 1 && this[4] === 0 && this[5] === 0;
  }
  isScaleIdentity() {
    return this[0] === 1 && this[1] === 0 && this[2] === 0 && this[3] === 1;
  }
  isTranslateIdentity() {
    return this[4] === 0 && this[5] === 0;
  }
  isRotateIdentity() {
    return this[1] === 0 && this[2] === 0;
  }
  identity() {
    identity(this);
    return this;
  }
  multiplyMatrices(m, n) {
    multiplyMatrices(this, m, n);
    return this;
  }
  preMultiply(m) {
    multiplyMatrices(this, m, this);
    return this;
  }
  postMultiply(m) {
    multiplyMatrices(this, this, m);
    return this;
  }
  inverse() {
    inverse(this, this);
    return this;
  }
  determinant() {
    return determinant(this);
  }
  fromTranslateSkewRotationScaleOrigin(translate, skew, rotate, scale, origin) {
    fromTranslateSkewRotationScaleOrigin(this, translate, skew, rotate, scale, origin);
    return this;
  }
  mapPoint(out, point) {
    if (!point) {
      point = out;
    }
    return mapPoint(out, point, this);
  }
  mapPoints(out, points) {
    if (!points) {
      points = out;
    }
    return mapPoints(out, points, this);
  }
}
const matrix2DUtil = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Matrix2D,
  adjoint,
  copy: copy$1,
  determinant,
  extractTranslateSkewRotationScaleOrigin,
  fromRotate,
  fromScale,
  fromSkew,
  fromSkewAngle,
  fromTranslate,
  fromTranslateRotateScale,
  fromTranslateSkewRotationScaleOrigin,
  identity,
  inverse,
  mapPoint,
  mapPoints,
  multiplyMatrices
}, Symbol.toStringTag, { value: "Module" }));
const copy = (out, vector) => {
  out[0] = vector[0];
  out[1] = vector[1];
  return out;
};
const subtract = (out, vector, vector2) => {
  out[0] = vector[0] - vector2[0];
  out[1] = vector[1] - vector2[1];
  return out;
};
const add = (out, vector, vector2) => {
  out[0] = vector[0] + vector2[0];
  out[1] = vector[1] + vector2[1];
  return out;
};
const multiply = (out, vector, vector2) => {
  out[0] = vector[0] * vector2[0];
  out[1] = vector[1] * vector2[1];
  return out;
};
const divide = (out, vector, vector2) => {
  out[0] = vector[0] / vector2[0];
  out[1] = vector[1] / vector2[1];
  return out;
};
const multiplyScalar = (out, vector, scale) => {
  out[0] = vector[0] * scale;
  out[1] = vector[1] * scale;
  return out;
};
const divideScalar = (out, vector, scale) => {
  out[0] = vector[0] / scale;
  out[1] = vector[1] / scale;
  return out;
};
const negate = (out, vector) => {
  out[0] = -vector[0];
  out[1] = -vector[1];
  return out;
};
const magnitude = (vector) => {
  return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};
const squareMagnitude = (vector) => {
  return vector[0] * vector[0] + vector[1] * vector[1];
};
const distanceTo = (vector, vector2) => {
  return Math.sqrt(distanceToSquared(vector, vector2));
};
const distanceToSquared = (vector, vector2) => {
  const x = vector[0] - vector2[0];
  const y = vector[1] - vector2[1];
  return x * x + y * y;
};
const dot = (vector, vector2) => {
  return vector[0] * vector2[0] + vector[1] * vector2[1];
};
const cross = (vector, vector2) => {
  return vector[0] * vector2[1] - vector[1] * vector2[0];
};
const angleTo = (vector, vector2) => {
  return dot(vector, vector2) / (magnitude(vector) * magnitude(vector2));
};
const angle = (vector) => {
  return Math.atan2(vector[1], vector[0]);
};
const normalize = (out, vector) => {
  const length = magnitude(vector);
  if (length === 0) {
    out[0] = 0;
    out[1] = 0;
    return out;
  }
  out[0] = vector[0] / length;
  out[1] = vector[1] / length;
  return out;
};
const setLength = (out, vector, len) => {
  const length = magnitude(vector);
  if (length === 0) {
    return false;
  }
  const scale = len / length;
  out[0] = vector[0] * scale;
  out[1] = vector[1] * scale;
  return true;
};
const equals = (vector, vector2) => {
  return vector[0] === vector2[0] && vector[1] === vector2[1];
};
const equalsEpsilon = (vector, vector2, epsilon = 1e-6) => {
  return Math.abs(vector[0] - vector2[0]) <= epsilon && Math.abs(vector[1] - vector2[1]) <= epsilon;
};
const applyMatrix2D = (out, vector, matrix) => {
  const x = vector[0];
  const y = vector[1];
  out[0] = x * matrix[0] + y * matrix[2] + matrix[4];
  out[1] = x * matrix[1] + y * matrix[3] + matrix[5];
  return out;
};
const isZero = (vector) => {
  return vector[0] === 0 && vector[1] === 0;
};
const isOne = (vector) => {
  return vector[0] === 1 && vector[1] === 1;
};
const isFinite = (vector) => {
  return Number.isFinite(vector[0]) && Number.isFinite(vector[1]);
};
const fromAngle = (out, angle2, len) => {
  out[0] = len * Math.cos(angle2) * Math.PI / 180;
  out[1] = len * Math.sin(angle2) * Math.PI / 180;
  return out;
};
const from = (out, vector) => {
  out[0] = vector[0];
  out[1] = vector[1];
  return out;
};
const fromValues = (out, x, y) => {
  out[0] = x;
  out[1] = y;
  return out;
};
const fromPoint = (out, point) => {
  out[0] = point.x;
  out[1] = point.y;
  return out;
};
class Vector2D extends Float32Array {
  static ZERO = new Vector2D([0, 0]);
  static ONE = new Vector2D([1, 1]);
  static fromRotation(radian) {
    return new Vector2D([Math.cos(radian), Math.sin(radian)]);
  }
  static fromPoint(point) {
    return new Vector2D([point.x, point.y]);
  }
  static fromValues(x, y) {
    return new Vector2D([x, y]);
  }
  clone() {
    return new Vector2D(this);
  }
  copy(vector) {
    copy(this, vector);
    return this;
  }
  add(vector) {
    this[0] += vector[0];
    this[1] += vector[1];
    return this;
  }
  subtract(vector) {
    subtract(this, this, vector);
    return this;
  }
  multiply(vector) {
    multiply(this, this, vector);
    return this;
  }
  divide(vector) {
    divide(this, this, vector);
    return this;
  }
  negate() {
    negate(this, this);
    return this;
  }
  normalize() {
    normalize(this, this);
    return this;
  }
  dot(vector) {
    return dot(this, vector);
  }
  cross(vector) {
    return cross(this, vector);
  }
  magnitude() {
    return magnitude(this);
  }
  squareMagnitude() {
    return squareMagnitude(this);
  }
  distanceTo(vector) {
    return distanceTo(this, vector);
  }
  distanceToSquared(vector) {
    return distanceToSquared(this, vector);
  }
  angleTo(vector) {
    return angleTo(this, vector);
  }
  angle() {
    return angle(this);
  }
  applyMatrix2D(matrix) {
    applyMatrix2D(this, this, matrix);
    return this;
  }
  equals(vector) {
    return equals(this, vector);
  }
  equalsEpsilon(vector, epsilon) {
    return equalsEpsilon(this, vector, epsilon);
  }
}
const vector2DUtil = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Vector2D,
  add,
  angle,
  angleTo,
  applyMatrix2D,
  copy,
  cross,
  distanceTo,
  distanceToSquared,
  divide,
  divideScalar,
  dot,
  equals,
  equalsEpsilon,
  from,
  fromAngle,
  fromPoint,
  fromValues,
  isFinite,
  isOne,
  isZero,
  magnitude,
  multiply,
  multiplyScalar,
  negate,
  normalize,
  setLength,
  squareMagnitude,
  subtract
}, Symbol.toStringTag, { value: "Module" }));
const math = {
  matrix2DUtil,
  vector2DUtil
};
export {
  Lyf,
  math
};
