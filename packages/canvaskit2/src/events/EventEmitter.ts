// ============================================================
// EventEmitter — EventEmitter3 风格事件派发实现
// Events 每个值为参数元组，如 { click: [x: number, y: number] }
// ============================================================

import type { EventEmitter as IEventEmitter } from '../types/EventEmitter'

/** 内部监听器结构 */
interface Listener {
  fn: (...args: any[]) => void
  context: any
  once: boolean
}

export class EventEmitter<Events extends Record<string, any[]> = Record<string, any[]>>
  implements IEventEmitter<Events> {

  /** 事件 → 监听器列表 */
  private _events = new Map<string, Listener[]>()

  // ---- 注册 ----

  on<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void, context?: any): this {
    return this._addListener(event as string, fn as (...args: any[]) => void, context, false)
  }

  once<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void, context?: any): this {
    return this._addListener(event as string, fn as (...args: any[]) => void, context, true)
  }

  /** 内部添加监听器 */
  private _addListener(event: string, fn: (...args: any[]) => void, context?: any, once?: boolean): this {
    let list = this._events.get(event)
    if (!list) {
      list = []
      this._events.set(event, list)
    }
    list.push({ fn, context, once: !!once })
    return this
  }

  // ---- 移除 ----

  off<K extends keyof Events>(event: K, fn?: (...args: Events[K]) => void, context?: any, once?: boolean): this {
    if (!fn) {
      this._events.delete(event as string)
      return this
    }

    const list = this._events.get(event as string)
    if (!list) return this

    const remaining = list.filter(
      (l) => l.fn !== fn || l.context !== context || (once !== undefined && l.once !== once)
    )
    if (remaining.length === 0) {
      this._events.delete(event as string)
    } else {
      this._events.set(event as string, remaining)
    }
    return this
  }

  removeAllListeners<K extends keyof Events>(event?: K): this {
    if (event) {
      this._events.delete(event as string)
    } else {
      this._events.clear()
    }
    return this
  }

  // ---- 派发 ----

  emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean {
    const list = this._events.get(event as string)
    if (!list) return false

    let hasOnce = false

    // 直接遍历，避免 slice() 创建中间数组
    for (let i = 0, len = list.length; i < len; i++) {
      const l = list[i]
      l.fn.apply(l.context, args as any[])
      if (l.once) hasOnce = true
    }

    // 有 once 监听器时批量清理，避免每次独立操作
    if (hasOnce) {
      const remaining = list.filter((l) => !l.once)
      if (remaining.length === 0) {
        this._events.delete(event as string)
      } else {
        list.length = 0
        list.push(...remaining)
      }
    }

    return true
  }

  // ---- 查询 ----

  listeners<K extends keyof Events>(event: K): ((...args: Events[K]) => void)[] {
    const list = this._events.get(event as string)
    return (list ? list.map((l) => l.fn as (...args: Events[K]) => void) : [])
  }

  listenerCount<K extends keyof Events>(event: K): number {
    const list = this._events.get(event as string)
    return list ? list.length : 0
  }

  eventNames(): (keyof Events)[] {
    return Array.from(this._events.keys()) as (keyof Events)[]
  }

  // ---- 别名 ----

  addListener<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void, context?: any): this {
    return this.on(event, fn, context)
  }

  removeListener<K extends keyof Events>(event: K, fn?: (...args: Events[K]) => void, context?: any, once?: boolean): this {
    return this.off(event, fn, context, once)
  }
}
