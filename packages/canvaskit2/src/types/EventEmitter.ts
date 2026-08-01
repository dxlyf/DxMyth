/**
 * EventEmitter3 风格事件派发接口
 * Events 的每个值为参数元组，如 { click: [x: number, y: number] }
 * 参考: https://github.com/primus/eventemitter3
 */

export interface EventEmitter<Events extends Record<string, any[]> = Record<string, any[]>> {
  /**
   * 注册事件监听
   * @param event   事件名称
   * @param fn      回调函数（参数类型由 Events[K] 推导）
   * @param context 回调执行上下文（this 指向）
   */
  on<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void, context?: any): this

  /**
   * 注册一次性事件监听，触发后自动移除
   */
  once<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void, context?: any): this

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param fn    不移传则移除该事件所有回调
   * @param context 匹配上下文
   */
  off<K extends keyof Events>(event: K, fn?: (...args: Events[K]) => void, context?: any, once?: boolean): this

  /** 移除所有事件监听（或指定事件） */
  removeAllListeners<K extends keyof Events>(event?: K): this

  /**
   * 派发事件
   * @param event 事件名称
   * @param args  参数（类型由 Events[K] 推导）
   */
  emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean

  /** 获取指定事件的所有监听器 */
  listeners<K extends keyof Events>(event: K): ((...args: Events[K]) => void)[]

  /** 获取指定事件的监听器数量 */
  listenerCount<K extends keyof Events>(event: K): number

  /** 获取已注册的事件名称列表 */
  eventNames(): (keyof Events)[]

  /** 注册事件监听（on 的别名） */
  addListener<K extends keyof Events>(event: K, fn: (...args: Events[K]) => void, context?: any): this

  /** 移除事件监听（off 的别名） */
  removeListener<K extends keyof Events>(event: K, fn?: (...args: Events[K]) => void, context?: any, once?: boolean): this
}
