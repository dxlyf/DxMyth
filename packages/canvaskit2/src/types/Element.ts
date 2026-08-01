/**
 * Element — 图形元素基类接口
 *
 * 所有场景对象（Rect、Ellipse、Text、Group、Image 等）的基类，
 * 管理场景图层级、变换、样式、事件和生命周期。
 */
import type { BoundingRect } from './BoundingRect'
import type { Point } from './Point'
import type { Transform } from './Transform'
import type { CanvasPointerEvent } from './CanvasPointerEvent'
import type { EventEmitter } from './EventEmitter'
import type { Matrix2DLike } from './Matrix2D'
import type { PointLike } from './Point'


// ============================================================
// Element 构造参数
// ============================================================

/**
 * Element 构造参数，所有属性均为可选
 * transform 相关分量使用 PointLike 以支持字面量传参
 */
export interface ElementProps {
  /** 唯一标识（不传则自动生成） */
  id?: string
  /** 名称 */
  name?: string

  /** 位置 */
  position?: PointLike
  /** 缩放 */
  scale?: PointLike
  /** 倾斜（弧度） */
  skew?: PointLike
  /** 变换原点 */
  origin?: PointLike
  /** 轴心 */
  pivot?: PointLike
  /** 旋转角（弧度） */
  rotation?: number

  /** 渲染层级 */
  zIndex?: number

  /** 是否可见 */
  visible?: boolean
  /** 指针事件策略 */
  pointerEvents?: 'all' | 'fill' | 'stroke' | 'none'
}

// ============================================================
// 脏标记
// ============================================================

/** 脏标记位 */
export enum ElementFlag {
  /** 无 */
  NONE = 0,
  /** 变换分量变化（position/scale/rotation/skew），触发 WORLD_BOUNDS | REPAINT */
  TRANSFORM = 1 << 0,
  /** 世界边界变化，需重新计算世界边界 */
  WORLD_BOUNDS = 1 << 1,
  /** 需重绘 */
  REPAINT = 1 << 2,
  /** 结构变化（添加/删除子元素、zIndex 等），需重建渲染列表 */
  REFLOW = 1 << 3,
}

// ============================================================
// 元素事件
// ============================================================

/** Element 派发的事件 */
export interface ElementEvents {
  [key: string]: any[]
  // ---- 指针事件 ----
  pointerdown: [CanvasPointerEvent]
  pointermove: [CanvasPointerEvent]
  pointerup: [CanvasPointerEvent]
  pointerenter: [CanvasPointerEvent]
  pointerleave: [CanvasPointerEvent]
  click: [CanvasPointerEvent]
  dblclick: [CanvasPointerEvent]

  // ---- 拖拽事件 ----
  dragstart: [CanvasPointerEvent]
  drag: [CanvasPointerEvent]
  dragend: [CanvasPointerEvent]

  // ---- 生命周期 ----
  /** 挂载到场景时触发 */
  mount: []
  /** 从场景卸载时触发 */
  unmount: []
}

// ============================================================
// Element 接口
// ============================================================

export interface Element<P  extends ElementProps = ElementProps> extends EventEmitter<ElementEvents> {
  // ---- 标识 ----

  /** 唯一标识 */
  id: string
  /** 元素类型（如 'rect'、'ellipse'、'text'、'image'、'group'） */
  type: string
  /** 名称，用于查找 */
  name: string

  /** 元素自定义属性 */
  props: P
  /** 渲染层级，值越大越靠上 */
  zIndex: number
   // ---- 可见性 ----

  /** 是否可见（不可见时跳过渲染和命中检测） */
  visible: boolean
  /** 指针事件策略，控制元素如何响应指针事件 */
  pointerEvents: 'all' | 'fill' | 'stroke' | 'none'
  
  /** 拥有者元素（用于事件冒泡、选择器遍历等父链追踪） */
  owner: any | null
  // ---- 场景图 ----

  /** 父级元素 */
  parent: Element | null
  /** 子元素列表（只读） */
  readonly children: ReadonlyArray<Element>

  // ---- 脏标记 ----

  /** 当前脏标记位 */
  readonly flags: ElementFlag
// ---- 变换 ----

  /** 变换对象（包含 localMatrix / worldMatrix / worldInverseMatrix 等） */
  transform: Transform
  /** 平移 */
  position: Point
  /** 缩放 */
  scale: Point
  /** 倾斜（弧度） */
  skew: Point
  /** 变换原点 */
  origin: Point
  /** 轴心（局部坐标锚点） */
  pivot: Point
  /** 旋转角（弧度） */
  rotation: number
  
  /** 世界坐标变换矩阵 */
  matrix: Matrix2DLike
  worldMatrix: Matrix2DLike
  
  
}

