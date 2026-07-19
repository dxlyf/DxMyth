import { NodeEvent } from './EventTarget';
import { EventEmitter } from './EventEmitter';
import { CachePool } from '../math/CachePool';
export declare class KeyboardEvent<T = string, D = any> extends NodeEvent<T, D> {
    static pool: CachePool<KeyboardEvent<string, {}>, []>;
    key: string;
    code: string;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    repeat: boolean;
    constructor(type: T, data: D);
    reset(): void;
    copy(target: KeyboardEvent<any, any>): void;
}
export type KeyboardEventSystemOptions = {
    /** 绑定键盘事件的 DOM 目标 */
    target: HTMLElement | Document | Window;
    /** 自定义需要绑定的原生事件映射，key 为内部事件名，value 为原生 DOM 事件类型 */
    keyboardEvents?: Record<string, string>;
};
export type KeyboardEventsMaps = {
    keydown: [e: KeyboardEvent];
    keyup: [e: KeyboardEvent];
};
/**
 * 键盘事件系统，封装原生键盘事件，支持事件池复用、修饰键追踪。
 * 继承 EventEmitter，外部通过 on/off 订阅键盘事件。
 */
export declare class KeyboardEventSystem extends EventEmitter<KeyboardEventsMaps> {
    options: KeyboardEventSystemOptions;
    handlers: Map<string, any>;
    /** 当前修饰键状态 */
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    /** 当前按下的非修饰键集合（小写 key 值） */
    private _pressedKeys;
    constructor(options: KeyboardEventSystemOptions);
    private _getKeyboardEvents;
    /** 绑定原生键盘事件 */
    attachEvents(): void;
    /** 解绑原生键盘事件 */
    detachEvents(): void;
    /**
     * 查询指定键或组合键是否当前处于按下状态。
     * 支持单键 "a"、"enter"，或组合键 "ctrl+z"、"shift+ctrl+a"
     */
    isPressed(keyOrCombo: string): boolean;
    /** 从对象池获取事件实例 */
    createEvent(type: string, nativeEvent: KeyboardEventInit): KeyboardEvent;
    onKeyboardEvent(eventType: string, e: globalThis.KeyboardEvent): void;
}
export interface ShortcutBinding {
    /** 解析后的修饰键+主键描述 */
    combo: ShortcutCombo;
    /** 回调 */
    callback: (e: KeyboardEvent) => void;
    /** 回调 this 上下文 */
    thisArg?: any;
}
export interface ShortcutCombo {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
    /** 主键（小写），如 "z", "enter", "arrowleft" */
    key: string;
    /** 原始组合键字符串 */
    raw: string;
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
export declare class ShortcutRegistry {
    private _shortcuts;
    private _keyboard;
    /** 是否忽略 repeat 事件（默认 true，仅首次按下触发） */
    ignoreRepeat: boolean;
    constructor(keyboard: KeyboardEventSystem);
    /**
     * 注册一个快捷键。
     *
     * @param combo 组合键字符串，如 "ctrl+z"、"ctrl+shift+s"、"alt+enter"
     * @param callback 触发时的回调
     * @param thisArg 回调的 this 上下文
     */
    register(combo: string, callback: (e: KeyboardEvent) => void, thisArg?: any): void;
    /**
     * 注销一个快捷键。
     *
     * @param combo 与注册时相同的组合键字符串
     * @param callback 不传则移除该组合键的全部回调
     */
    unregister(combo: string, callback?: (e: KeyboardEvent) => void): void;
    /** 移除所有快捷键 */
    clear(): void;
    /** 销毁实例，解绑监听 */
    destroy(): void;
    /** 检查某个快捷键是否已注册 */
    has(combo: string): boolean;
    /** 获取所有已注册的快捷键字符串 */
    getShortcuts(): string[];
    /**
     * 查询指定组合键是否当前处于按下状态。
     */
    isPressed(combo: string): boolean;
    private _onKeyDown;
}
