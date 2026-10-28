import { NodeEvent } from "./EventTarget.js";
import { EventEmitter } from "./EventEmitter.js";
import { CachePool } from "../math/CachePool.js";
class KeyboardEvent extends NodeEvent {
  static pool = CachePool.create({
    initSize: 10,
    create: () => new KeyboardEvent("", {}),
    init(item) {
      item.reset();
    }
  });
  key = "";
  code = "";
  ctrlKey = false;
  shiftKey = false;
  altKey = false;
  metaKey = false;
  repeat = false;
  constructor(type, data) {
    super(type, data);
  }
  reset() {
    this.key = "";
    this.code = "";
    this.ctrlKey = false;
    this.shiftKey = false;
    this.altKey = false;
    this.metaKey = false;
    this.repeat = false;
    this.data = {};
    this.defaultPrevented = false;
    this.cancelBubble = false;
    this.immediateCancelBubble = false;
    this.delegateType = "";
    this.target = null;
    this.currentTarget = null;
    this.nativeEvent = null;
  }
  copy(target) {
    this.type = target.type;
    this.data = target.data;
    this.nativeEvent = target.nativeEvent;
    this.target = target.target;
    this.currentTarget = target.currentTarget;
    this.delegateType = target.delegateType;
    this.cancelBubble = target.cancelBubble;
    this.immediateCancelBubble = target.immediateCancelBubble;
    this.defaultPrevented = target.defaultPrevented;
    this.key = target.key;
    this.code = target.code;
    this.ctrlKey = target.ctrlKey;
    this.shiftKey = target.shiftKey;
    this.altKey = target.altKey;
    this.metaKey = target.metaKey;
    this.repeat = target.repeat;
  }
}
const DEFAULT_KEYBOARD_EVENTS = {
  keydown: "keydown",
  keyup: "keyup"
};
function normalizeKey(raw) {
  const lower = raw.toLowerCase();
  if (lower === " ") return "space";
  return lower;
}
const MODIFIER_KEYS = /* @__PURE__ */ new Set([
  "control",
  "ctrl",
  "shift",
  "alt",
  "option",
  "meta",
  "command",
  "cmd",
  "win",
  "capslock",
  "numlock"
]);
const MODIFIER_MAP = {
  control: "ctrl",
  ctrl: "ctrl",
  shift: "shift",
  alt: "alt",
  option: "alt",
  meta: "meta",
  command: "meta",
  cmd: "meta",
  win: "meta"
};
function parseCombo(combo) {
  const parts = combo.toLowerCase().split("+").map((s) => s.trim());
  const result = { ctrl: false, shift: false, alt: false, meta: false, key: "", raw: combo };
  for (const part of parts) {
    const mod = MODIFIER_MAP[part];
    if (mod) {
      result[mod] = true;
      continue;
    }
    result.key = part;
  }
  return result;
}
class KeyboardEventSystem extends EventEmitter {
  options;
  handlers = /* @__PURE__ */ new Map();
  /** 当前修饰键状态 */
  ctrlKey = false;
  shiftKey = false;
  altKey = false;
  metaKey = false;
  /** 当前按下的非修饰键集合（小写 key 值） */
  _pressedKeys = /* @__PURE__ */ new Set();
  constructor(options) {
    super();
    this.options = options;
    this.onKeyboardEvent = this.onKeyboardEvent.bind(this);
  }
  _getKeyboardEvents() {
    return this.options.keyboardEvents ?? DEFAULT_KEYBOARD_EVENTS;
  }
  /** 绑定原生键盘事件 */
  attachEvents() {
    const events = this._getKeyboardEvents();
    for (const [name, type] of Object.entries(events)) {
      const handler = this.onKeyboardEvent.bind(this, name);
      this.options.target.addEventListener(type, handler, false);
      this.handlers.set(name, handler);
    }
  }
  /** 解绑原生键盘事件 */
  detachEvents() {
    const events = this._getKeyboardEvents();
    for (const [name, type] of Object.entries(events)) {
      const handler = this.handlers.get(name);
      if (!handler) continue;
      this.options.target.removeEventListener(type, handler, false);
    }
    this.handlers.clear();
  }
  /**
   * 查询指定键或组合键是否当前处于按下状态。
   * 支持单键 "a"、"enter"，或组合键 "ctrl+z"、"shift+ctrl+a"
   */
  isPressed(keyOrCombo) {
    const combo = parseCombo(keyOrCombo);
    if (combo.ctrl !== this.ctrlKey) return false;
    if (combo.shift !== this.shiftKey) return false;
    if (combo.alt !== this.altKey) return false;
    if (combo.meta !== this.metaKey) return false;
    if (combo.key) return this._pressedKeys.has(combo.key);
    return true;
  }
  /** 从对象池获取事件实例 */
  createEvent(type, nativeEvent) {
    const e = KeyboardEvent.pool.get();
    e.type = type;
    e.data = {};
    e.nativeEvent = nativeEvent;
    return e;
  }
  onKeyboardEvent(eventType, e) {
    const event = this.createEvent(eventType, e);
    event.key = e.key;
    event.code = e.code;
    event.ctrlKey = e.ctrlKey;
    event.shiftKey = e.shiftKey;
    event.altKey = e.altKey;
    event.metaKey = e.metaKey;
    event.repeat = e.repeat;
    this.ctrlKey = e.ctrlKey;
    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.metaKey = e.metaKey;
    const rawKey = normalizeKey(e.key);
    if (eventType === "keydown" && !MODIFIER_KEYS.has(rawKey)) {
      this._pressedKeys.add(rawKey);
    } else if (eventType === "keyup") {
      this._pressedKeys.delete(rawKey);
    }
    event.type = eventType;
    this.emit(eventType, event);
    KeyboardEvent.pool.release(event);
  }
}
function comboToString(c) {
  const mods = [];
  if (c.ctrl) mods.push("ctrl");
  if (c.shift) mods.push("shift");
  if (c.alt) mods.push("alt");
  if (c.meta) mods.push("meta");
  mods.push(c.key);
  return mods.join("+");
}
class ShortcutRegistry {
  _shortcuts = /* @__PURE__ */ new Map();
  _keyboard;
  /** 是否忽略 repeat 事件（默认 true，仅首次按下触发） */
  ignoreRepeat = true;
  constructor(keyboard) {
    this._keyboard = keyboard;
    this._keyboard.on("keydown", this._onKeyDown, this);
  }
  /**
   * 注册一个快捷键。
   *
   * @param combo 组合键字符串，如 "ctrl+z"、"ctrl+shift+s"、"alt+enter"
   * @param callback 触发时的回调
   * @param thisArg 回调的 this 上下文
   */
  register(combo, callback, thisArg) {
    const parsed = parseCombo(combo);
    if (!parsed.key) {
      console.warn(`[ShortcutRegistry] 组合键缺少主键: "${combo}"`);
      return;
    }
    const key = comboToString(parsed);
    this._shortcuts.set(key, { combo: parsed, callback, thisArg });
  }
  /**
   * 注销一个快捷键。
   *
   * @param combo 与注册时相同的组合键字符串
   * @param callback 不传则移除该组合键的全部回调
   */
  unregister(combo, callback) {
    const parsed = parseCombo(combo);
    const key = comboToString(parsed);
    if (!callback) {
      this._shortcuts.delete(key);
      return;
    }
    const binding = this._shortcuts.get(key);
    if (binding && binding.callback === callback) {
      this._shortcuts.delete(key);
    }
  }
  /** 移除所有快捷键 */
  clear() {
    this._shortcuts.clear();
  }
  /** 销毁实例，解绑监听 */
  destroy() {
    this._keyboard.off("keydown", this._onKeyDown, this);
    this._shortcuts.clear();
  }
  /** 检查某个快捷键是否已注册 */
  has(combo) {
    const parsed = parseCombo(combo);
    return this._shortcuts.has(comboToString(parsed));
  }
  /** 获取所有已注册的快捷键字符串 */
  getShortcuts() {
    return Array.from(this._shortcuts.values()).map((b) => b.combo.raw);
  }
  /**
   * 查询指定组合键是否当前处于按下状态。
   */
  isPressed(combo) {
    return this._keyboard.isPressed(combo);
  }
  _onKeyDown(e) {
    if (this.ignoreRepeat && e.repeat) return;
    const rawKey = normalizeKey(e.key);
    if (MODIFIER_KEYS.has(rawKey) || rawKey === "dead") return;
    const combo = {
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey,
      key: rawKey
    };
    const key = comboToString(combo);
    const binding = this._shortcuts.get(key);
    if (binding) {
      binding.callback.call(binding.thisArg, e);
    }
  }
}
export {
  KeyboardEvent,
  KeyboardEventSystem,
  ShortcutRegistry
};
