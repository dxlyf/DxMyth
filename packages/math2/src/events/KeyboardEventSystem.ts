import { NodeEvent } from './EventTarget'
import { EventEmitter } from './EventEmitter'
import { CachePool } from '../math/CachePool'

export class KeyboardEvent<T = string, D = any> extends NodeEvent<T, D> {
    static pool = CachePool.create({
        initSize: 10,
        create: () => new KeyboardEvent('', {}),
        init(item) {
            item.reset()
        },
    })

    key: string = ''
    code: string = ''
    ctrlKey: boolean = false
    shiftKey: boolean = false
    altKey: boolean = false
    metaKey: boolean = false
    repeat: boolean = false

    constructor(type: T, data: D) {
        super(type, data)
    }

    reset() {
        this.key = ''
        this.code = ''
        this.ctrlKey = false
        this.shiftKey = false
        this.altKey = false
        this.metaKey = false
        this.repeat = false
        this.data = {} as D
        this.defaultPrevented = false
        this.cancelBubble = false
        this.immediateCancelBubble = false
        this.delegateType = ''
        this.target = null
        this.currentTarget = null
        this.nativeEvent = null
    }

    copy(target: KeyboardEvent<any, any>) {
        this.type = target.type
        this.data = target.data
        this.nativeEvent = target.nativeEvent
        this.target = target.target
        this.currentTarget = target.currentTarget
        this.delegateType = target.delegateType
        this.cancelBubble = target.cancelBubble
        this.immediateCancelBubble = target.immediateCancelBubble
        this.defaultPrevented = target.defaultPrevented
        this.key = target.key
        this.code = target.code
        this.ctrlKey = target.ctrlKey
        this.shiftKey = target.shiftKey
        this.altKey = target.altKey
        this.metaKey = target.metaKey
        this.repeat = target.repeat
    }
}

export type KeyboardEventSystemOptions = {
    /** 绑定键盘事件的 DOM 目标 */
    target: HTMLElement | Document | Window
    /** 自定义需要绑定的原生事件映射，key 为内部事件名，value 为原生 DOM 事件类型 */
    keyboardEvents?: Record<string, string>
}

const DEFAULT_KEYBOARD_EVENTS = {
    keydown: 'keydown',
    keyup: 'keyup',
}

export type KeyboardEventsMaps = {
    keydown: [e: KeyboardEvent]
    keyup: [e: KeyboardEvent]
}

/** 归一化键值：转小写，处理部分别名 */
function normalizeKey(raw: string): string {
    const lower = raw.toLowerCase()
    if (lower === ' ') return 'space'
    return lower
}

/** 修饰键 key 值集合（用于判断纯修饰键） */
const MODIFIER_KEYS = new Set([
    'control', 'ctrl', 'shift', 'alt', 'option',
    'meta', 'command', 'cmd', 'win', 'capslock', 'numlock',
])

type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta'

/** 统一修饰键别名 */
const MODIFIER_MAP: Record<string, ModifierKey> = {
    control: 'ctrl',
    ctrl: 'ctrl',
    shift: 'shift',
    alt: 'alt',
    option: 'alt',
    meta: 'meta',
    command: 'meta',
    cmd: 'meta',
    win: 'meta',
}

/** 解析组合键字符串，如 "ctrl+z" → { ctrl: true, key: "z", raw: "ctrl+z" } */
function parseCombo(combo: string): { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean; key: string; raw: string } {
    const parts = combo.toLowerCase().split('+').map((s) => s.trim())
    const result = { ctrl: false, shift: false, alt: false, meta: false, key: '', raw: combo }
    for (const part of parts) {
        const mod = MODIFIER_MAP[part]
        if (mod) {
            result[mod] = true
            continue
        }
        result.key = part
    }
    return result
}

/**
 * 键盘事件系统，封装原生键盘事件，支持事件池复用、修饰键追踪。
 * 继承 EventEmitter，外部通过 on/off 订阅键盘事件。
 */
export class KeyboardEventSystem extends EventEmitter<KeyboardEventsMaps> {
    options: KeyboardEventSystemOptions
    handlers: Map<string, any> = new Map()

    /** 当前修饰键状态 */
    ctrlKey: boolean = false
    shiftKey: boolean = false
    altKey: boolean = false
    metaKey: boolean = false

    /** 当前按下的非修饰键集合（小写 key 值） */
    private _pressedKeys: Set<string> = new Set()

    constructor(options: KeyboardEventSystemOptions) {
        super()
        this.options = options
        this.onKeyboardEvent = this.onKeyboardEvent.bind(this)
    }

    private _getKeyboardEvents(): Record<string, string> {
        return this.options.keyboardEvents ?? DEFAULT_KEYBOARD_EVENTS
    }

    /** 绑定原生键盘事件 */
    attachEvents() {
        const events = this._getKeyboardEvents()
        for (const [name, type] of Object.entries(events)) {
            const handler = this.onKeyboardEvent.bind(this, name)
            this.options.target.addEventListener(type as any, handler as any, false)
            this.handlers.set(name, handler)
        }
    }

    /** 解绑原生键盘事件 */
    detachEvents() {
        const events = this._getKeyboardEvents()
        for (const [name, type] of Object.entries(events)) {
            const handler = this.handlers.get(name)
            if (!handler) continue
            this.options.target.removeEventListener(type, handler, false)
        }
        this.handlers.clear()
    }

    /**
     * 查询指定键或组合键是否当前处于按下状态。
     * 支持单键 "a"、"enter"，或组合键 "ctrl+z"、"shift+ctrl+a"
     */
    isPressed(keyOrCombo: string): boolean {
        const combo = parseCombo(keyOrCombo)
        if (combo.ctrl !== this.ctrlKey) return false
        if (combo.shift !== this.shiftKey) return false
        if (combo.alt !== this.altKey) return false
        if (combo.meta !== this.metaKey) return false
        if (combo.key) return this._pressedKeys.has(combo.key)
        return true
    }

    /** 从对象池获取事件实例 */
    createEvent(type: string, nativeEvent: KeyboardEventInit): KeyboardEvent {
        const e = KeyboardEvent.pool.get()
        e.type = type
        e.data = {} as any
        e.nativeEvent = nativeEvent as any
        return e
    }

    onKeyboardEvent(eventType: string, e: globalThis.KeyboardEvent) {
        const event = this.createEvent(eventType, e)

        event.key = e.key
        event.code = e.code
        event.ctrlKey = e.ctrlKey
        event.shiftKey = e.shiftKey
        event.altKey = e.altKey
        event.metaKey = e.metaKey
        event.repeat = e.repeat

        // 同步修饰键状态
        this.ctrlKey = e.ctrlKey
        this.shiftKey = e.shiftKey
        this.altKey = e.altKey
        this.metaKey = e.metaKey

        // 追踪非修饰键
        const rawKey = normalizeKey(e.key)
        if (eventType === 'keydown' && !MODIFIER_KEYS.has(rawKey)) {
            this._pressedKeys.add(rawKey)
        } else if (eventType === 'keyup') {
            this._pressedKeys.delete(rawKey)
        }

        event.type = eventType
        this.emit(eventType as any, event)

        // 释放事件回 pool
        KeyboardEvent.pool.release(event)
    }
}

// ============================================================
// ShortcutRegistry — 快捷键/组合键注册与匹配
//
// 格式: "ctrl+z", "ctrl+shift+s", "alt+enter", "meta+k"
// 修饰键: ctrl / shift / alt / meta
// ============================================================

export interface ShortcutBinding {
    /** 解析后的修饰键+主键描述 */
    combo: ShortcutCombo
    /** 回调 */
    callback: (e: KeyboardEvent) => void
    /** 回调 this 上下文 */
    thisArg?: any
}

export interface ShortcutCombo {
    ctrl: boolean
    shift: boolean
    alt: boolean
    meta: boolean
    /** 主键（小写），如 "z", "enter", "arrowleft" */
    key: string
    /** 原始组合键字符串 */
    raw: string
}

/**
 * 将 ShortcutCombo 序列化回字符串（确保一致的格式用于 Map key）
 */
function comboToString(c: ShortcutCombo): string {
    const mods: string[] = []
    if (c.ctrl) mods.push('ctrl')
    if (c.shift) mods.push('shift')
    if (c.alt) mods.push('alt')
    if (c.meta) mods.push('meta')
    mods.push(c.key)
    return mods.join('+')
}

/**
 * 快捷键/组合键注册管理器。
 *
 * 用法:
 *   const shortcuts = new ShortcutRegistry(keyboard)
 *   shortcuts.register('ctrl+z', (e) => { })
 *   shortcuts.register('ctrl+shift+s', (e) => {  })
 *   shortcuts.unregister('ctrl+z')
 */
export class ShortcutRegistry {
    private _shortcuts: Map<string, ShortcutBinding> = new Map()
    private _keyboard: KeyboardEventSystem
    /** 是否忽略 repeat 事件（默认 true，仅首次按下触发） */
    ignoreRepeat: boolean = true

    constructor(keyboard: KeyboardEventSystem) {
        this._keyboard = keyboard
        this._keyboard.on('keydown', this._onKeyDown, this)
    }

    /**
     * 注册一个快捷键。
     *
     * @param combo 组合键字符串，如 "ctrl+z"、"ctrl+shift+s"、"alt+enter"
     * @param callback 触发时的回调
     * @param thisArg 回调的 this 上下文
     */
    register(combo: string, callback: (e: KeyboardEvent) => void, thisArg?: any): void {
        const parsed = parseCombo(combo)
        if (!parsed.key) {
            console.warn(`[ShortcutRegistry] 组合键缺少主键: "${combo}"`)
            return
        }
        const key = comboToString(parsed)
        this._shortcuts.set(key, { combo: parsed, callback, thisArg })
    }

    /**
     * 注销一个快捷键。
     *
     * @param combo 与注册时相同的组合键字符串
     * @param callback 不传则移除该组合键的全部回调
     */
    unregister(combo: string, callback?: (e: KeyboardEvent) => void): void {
        const parsed = parseCombo(combo)
        const key = comboToString(parsed)
        if (!callback) {
            this._shortcuts.delete(key)
            return
        }
        const binding = this._shortcuts.get(key)
        if (binding && binding.callback === callback) {
            this._shortcuts.delete(key)
        }
    }

    /** 移除所有快捷键 */
    clear(): void {
        this._shortcuts.clear()
    }

    /** 销毁实例，解绑监听 */
    destroy(): void {
        this._keyboard.off('keydown', this._onKeyDown, this)
        this._shortcuts.clear()
    }

    /** 检查某个快捷键是否已注册 */
    has(combo: string): boolean {
        const parsed = parseCombo(combo)
        return this._shortcuts.has(comboToString(parsed))
    }

    /** 获取所有已注册的快捷键字符串 */
    getShortcuts(): string[] {
        return Array.from(this._shortcuts.values()).map((b) => b.combo.raw)
    }

    /**
     * 查询指定组合键是否当前处于按下状态。
     */
    isPressed(combo: string): boolean {
        return this._keyboard.isPressed(combo)
    }

    private _onKeyDown(e: KeyboardEvent): void {
        if (this.ignoreRepeat && e.repeat) return

        // 排除纯修饰键
        const rawKey = normalizeKey(e.key)
        if (MODIFIER_KEYS.has(rawKey) || rawKey === 'dead') return

        const combo: ShortcutCombo = {
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            meta: e.metaKey,
            key: rawKey,
            raw: '',
        }
        const key = comboToString(combo)
        const binding = this._shortcuts.get(key)
        if (binding) {
            binding.callback.call(binding.thisArg, e)
        }
    }
}
