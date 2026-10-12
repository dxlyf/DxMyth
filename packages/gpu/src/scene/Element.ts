// ============================================================
// Element — 显示列表节点基类
//
// 一个「渲染器无关」的 2D 显示列表节点基类。渲染后端只需实现
// RenderContext，即可驱动整棵场景树的绘制；本层只负责：
//   - 身份：id / name / data
//   - 变换：组合一个 Transform（position/rotation/scale/skew/origin/pivot）
//   - 层级：parent / children，子节点增删改与遍历
//   - 显示：visible / alpha / pointerEvents / ignore
//   - 排序：zIndex（同一父节点内的绘制与命中顺序）
//   - 交互：cursor / ignore；默认命中以本地包围盒做矩形判定
//   - 事件：基于 EventTarget，沿 parent 链「捕获 → 冒泡」
//   - 包围盒：local / world / paint，懒计算 + 脏标记驱动失效
//   - 生命周期：update 前/中/后
//
// 继承链：Element → DisplayObject（抽象形状基类）
//         Element → Group → Layer（容器分支）
//
// 关键设计决策 —— 为何「组合」而非「继承」Transform：
//   TypeScript 单继承约束下，事件系统（EventTarget 的捕获/冒泡）与变换
//   （Transform）只能二选一继承。场景图中交互是核心能力，因此继承
//   EventTarget，把 Transform 作为成员组合进来，并把二者统一到同一条
//   父子链上（本类.parent ←→ transform.parent），世界矩阵由 Transform
//   自己沿父链懒计算，互不重复。
//
// 坐标空间约定：
//   local —— 节点自身坐标系；子节点的变换相对于父节点 local 空间
//   world —— 场景根坐标系；worldMatrix = 父链 localMatrix 累乘
// ============================================================

import { EventTarget } from '../events/EventTarget'
import type { PointerEvent as DxPointerEvent } from '../events/PointerEventSystem'
import { Transform, type TransformProps } from '../math/Transform'
import { BoundingRect } from '../math/BoundingRect'
import { Matrix2D } from '../math/Matrix2D'
import type { Vector2Like } from '../math/Vector2'
import type { RenderContext } from './Renderer'
import { uid } from '../utils/uid'

// ============================================================
// 脏标记（位掩码）
//   - flags:        节点自身累积的标记
//   - subtreeFlags: 子树归并标记（含所有后代），用于快速判断子树是否需要处理
// 标记会自动解析依赖（见 resolveFlags）并冒泡到祖先。
// ============================================================
export const enum ElementFlag {
    NONE = 0,
    /** 局部变换矩阵变化 */
    TRANSFORM = 1 << 0,
    /** 局部包围盒需要重算 */
    LOCAL_BOUNDS = 1 << 1,
    /** 绘制包围盒需要重算（描边/阴影等效范围） */
    PAINT_BOUNDS = 1 << 2,
    /** 世界包围盒缓存失效 */
    WORLD_BOUNDS = 1 << 3,
    /** 子节点结构变化（增删/排序） */
    CHILDREN = 1 << 4,
    /** 视觉样式变化（颜色/透明度等），需要重绘 */
    STYLE = 1 << 5,
    /** 布局变化（几何/子节点），需要重排 */
    LAYOUT = 1 << 6,
    ALL = (1 << 7) - 1,
}

/** 解析标记依赖闭包：标记某个 flag 时自动附带其依赖位 */
function resolveFlags(flag: number): number {
    let r = flag
    if (flag & ElementFlag.TRANSFORM) r |= ElementFlag.WORLD_BOUNDS
    if (flag & ElementFlag.LOCAL_BOUNDS) r |= ElementFlag.WORLD_BOUNDS
    if (flag & ElementFlag.STYLE) r |= ElementFlag.PAINT_BOUNDS
    if (flag & ElementFlag.CHILDREN) {
        r |= ElementFlag.LAYOUT | ElementFlag.LOCAL_BOUNDS | ElementFlag.WORLD_BOUNDS
    }
    return r
}

/** 指针事件参与模式（语义对齐 CSS pointer-events） */
export type PointerEventMode = 'auto' | 'all' | 'fill' | 'stroke' | 'none'

/**
 * 节点事件表。
 *
 * 注意：本表的值类型是「事件数据」类型；结构/生命周期事件经 emit 派发后
 * 监听器会收到包裹了该数据的 NodeEvent。指针事件由事件系统命中后通过
 * dispatchPointerEvent 直接派发 PointerEvent 本体（它本身就是 NodeEvent）。
 */
export type ElementEvents = {
    /** 子节点加入（target = 父节点） */
    'add:child': { target: Element; child: Element; index: number }
    /** 子节点移除（target = 父节点） */
    'remove:child': { target: Element; child: Element; index: number }
    /** 自身被挂载到父节点 */
    'attach': { target: Element; parent: Element }
    /** 自身从父节点分离 */
    'detach': { target: Element; parent: Element }
    /** 变换发生变化 */
    'transform:change': { target: Element; transform: Transform }
    /** 任意属性变化 */
    'prop:change': { target: Element; name: string; value: any; prev: any }
    /** 帧更新 */
    'update': { target: Element }
    /** 销毁 */
    'dispose': { target: Element }

    // ---- 指针事件（由事件系统命中后派发，沿父链捕获/冒泡） ----
    pointerdown: DxPointerEvent
    pointermove: DxPointerEvent
    pointerup: DxPointerEvent
    pointercancel: DxPointerEvent
    pointerenter: DxPointerEvent
    pointerleave: DxPointerEvent
    wheel: DxPointerEvent
    click: DxPointerEvent
    dblclick: DxPointerEvent
    dragstart: DxPointerEvent
    drag: DxPointerEvent
    dragend: DxPointerEvent
    dragenter: DxPointerEvent
    dragleave: DxPointerEvent
    dragover: DxPointerEvent
    drop: DxPointerEvent
}

export type ElementProps = TransformProps & {
    /** 节点名称 */
    name?: string
    /** 是否可见（不可见但仍可参与布局计算） */
    visible?: boolean
    /** 整体透明度 0~1 */
    alpha?: number
    /** 指针事件参与模式 */
    pointerEvents?: PointerEventMode
    /** 层级索引：越大越靠上（同层内绘制与命中顺序） */
    zIndex?: number
    /** 鼠标指针样式（交互时透传给宿主） */
    cursor?: string | null
    /** 是否忽略渲染（但仍保留在显示列表中，可用于纯交互占位） */
    ignore?: boolean
}

export abstract class Element<Props extends ElementProps = ElementProps>
    extends EventTarget<ElementEvents> {

    /** 全局自增 id */
    readonly id: number
    /** 节点名称 */
    name: string
    /** 节点类型标识（子类覆写） */
    type: string = 'Element'
    /** 是否为容器（Group/Layer 覆写为 true） */
    isGroup: boolean = false
    /** 用户自定义数据 */
    data: Record<string, any> = {}
    /** 参数快照 */
    props: Props

    // ---- 变换（组合） ----
    transform: Transform

    // ---- 层级 ----
    declare parent: Element | null
    children: Element[] = []

    // ---- 显示属性 ----
    visible: boolean
    pointerEvents: PointerEventMode

    // ---- 排序 / 交互 ----
    private _zIndex: number
    private _cursor: string | null
    private _ignore: boolean

    // ---- 脏标记 ----
    flags: ElementFlag = ElementFlag.ALL
    /** 子树归并标记（含所有后代） */
    subtreeFlags: ElementFlag = ElementFlag.ALL

    // ---- 包围盒缓存 ----
    protected _localBounds: BoundingRect | null = null
    protected _paintBounds: BoundingRect | null = null
    protected _worldBounds: BoundingRect | null = null
    /** 计算 worldBounds 时使用的世界矩阵版本（用于侦测祖先变换变化） */
    private _wbVersion: number = -1
    private _wbValid: boolean = false

    private _alpha: number

    constructor(props: Partial<Props> = {}) {
        super()
        this.id = uid('element')
        this.props = { ...props } as Props
        this.name = props.name ?? ''
        this.visible = props.visible ?? true
        this.pointerEvents = props.pointerEvents ?? 'auto'
        this._alpha = clamp01(props.alpha ?? 1)
        this._zIndex = props.zIndex ?? 0
        this._cursor = props.cursor ?? null
        this._ignore = props.ignore ?? false
        this.transform = new Transform(props as TransformProps)
        this.parent = null
        // 变换变化 → 标记脏 + 抛出事件
        this.transform.on('transform:change', this._onTransformChange)
    }

    private _onTransformChange = (): void => {
        this.markFlag(ElementFlag.TRANSFORM)
        this.emit('transform:change', { target: this, transform: this.transform })
    }

    // ==================== 变换代理 ====================

    get position(): Transform['position'] { return this.transform.position }
    get scale(): Transform['scale'] { return this.transform.scale }
    get skew(): Transform['skew'] { return this.transform.skew }
    get origin(): Transform['origin'] { return this.transform.origin }
    get pivot(): Transform['pivot'] { return this.transform.pivot }

    get rotation(): number { return this.transform.rotation }
    set rotation(v: number) { this.transform.rotation = v }

    /** 局部变换矩阵 */
    get matrix(): Matrix2D { return this.transform.matrix }
    /** 世界变换矩阵 */
    get worldMatrix(): Matrix2D { return this.transform.worldMatrix }
    /** 世界变换矩阵的逆 */
    get worldMatrixInvert(): Matrix2D { return this.transform.worldMatrixInvert }

    // ==================== 显示属性 ====================

    get alpha(): number { return this._alpha }
    set alpha(v: number) {
        v = clamp01(v)
        if (this._alpha !== v) {
            this._alpha = v
            this.markFlag(ElementFlag.STYLE)
        }
    }

    // ==================== 排序 ====================

    get zIndex(): number { return this._zIndex }
    set zIndex(v: number) {
        if (this._zIndex === v) return
        this._zIndex = v
        // 顺序变化：自身标记 CHILDREN，并通知父容器重排
        this.markFlag(ElementFlag.CHILDREN)
        this.parent?.invalidateOrder()
    }

    // ==================== 交互 ====================

    get cursor(): string | null { return this._cursor }
    set cursor(v: string | null) {
        if (this._cursor !== v) {
            const prev = this._cursor
            this._cursor = v
            this.emit('prop:change', { target: this, name: 'cursor', value: v, prev })
        }
    }

    get ignore(): boolean { return this._ignore }
    set ignore(v: boolean) {
        if (this._ignore === v) return
        this._ignore = v
        this.markFlag(ElementFlag.STYLE)
    }

    // ==================== 脏标记 ====================

    /** 标记脏位：自动解析依赖并冒泡到祖先的 subtreeFlags */
    markFlag(flag: ElementFlag): void {
        if (flag === ElementFlag.NONE) return
        const resolved = resolveFlags(flag)
        const added = resolved & ~this.flags
        if (added === 0) return
        this.flags |= added
        let p: Element | null = this.parent
        while (p) {
            // 祖先已包含这些位即可提前结束（子树状态已归并）
            if ((p.subtreeFlags & added) === added) break
            p.subtreeFlags |= added
            p = p.parent
        }
    }

    /** 清除自身指定标记 */
    clearFlags(flag: ElementFlag): void {
        this.flags &= ~flag
    }

    /** 自身是否包含指定标记 */
    hasFlag(flag: ElementFlag): boolean {
        return (this.flags & flag) !== 0
    }

    /** 自身或子树是否包含指定标记 */
    hasSubtreeFlag(flag: ElementFlag): boolean {
        return ((this.flags | this.subtreeFlags) & flag) !== 0
    }

    /** 清除子树归并标记（由场景在重排/重绘后调用） */
    clearSubtreeFlags(flag: ElementFlag = ElementFlag.ALL): void {
        this.subtreeFlags &= ~flag
    }

    // ==================== 层级管理 ====================

    /** 追加子节点 */
    addChild(child: Element): this {
        return this.addChildAt(child, this.children.length)
    }

    /** 在指定索引插入子节点（索引越界自动收敛，重复挂载自动先解除旧父级） */
    addChildAt(child: Element, index: number): this {
        if (child === this) return this
        const len = this.children.length
        index = index < 0 ? 0 : index > len ? len : index
        // 若已挂载到其它父级，先摘除
        if (child.parent) child.parent.removeChild(child)
        child.parent = this
        child.transform.parent = this.transform
        this.children.splice(index, 0, child)
        this.onAddChild(child, index)
        child.onAttachParent(this)
        this.markFlag(ElementFlag.CHILDREN)
        this.emit('add:child', { target: this, child, index })
        return this
    }

    /** 移除指定子节点 */
    removeChild(child: Element): this {
        const index = this.children.indexOf(child)
        return index < 0 ? this : this.removeChildAt(index)
    }

    /** 移除指定索引的子节点 */
    removeChildAt(index: number): this {
        const child = this.children[index]
        if (!child) return this
        this.children.splice(index, 1)
        child.parent = null
        child.transform.parent = null
        this.onRemoveChild(child, index)
        child.onDetachParent(this)
        this.markFlag(ElementFlag.CHILDREN)
        this.emit('remove:child', { target: this, child, index })
        return this
    }

    /** 移除全部子节点 */
    removeAllChildren(): this {
        for (let i = this.children.length - 1; i >= 0; i--) this.removeChildAt(i)
        return this
    }

    /** 从父节点移除自身 */
    remove(): this {
        this.parent?.removeChild(this)
        return this
    }

    /** 设置父节点（null 表示从当前父级移除） */
    setParent(parent: Element | null): this {
        if (this.parent === parent) return this
        if (parent) parent.addChild(this)
        else this.parent?.removeChild(this)
        return this
    }

    getChildIndex(child: Element): number {
        return this.children.indexOf(child)
    }

    getChildAt(index: number): Element | null {
        return this.children[index] ?? null
    }

    getChildByName(name: string): Element | null {
        const children = this.children
        for (let i = 0; i < children.length; i++) {
            if (children[i].name === name) return children[i]
        }
        return null
    }

    /** 交换两个子节点的位置 */
    swapChildren(a: Element, b: Element): this {
        const ia = this.children.indexOf(a)
        const ib = this.children.indexOf(b)
        if (ia < 0 || ib < 0 || ia === ib) return this
        this.children[ia] = b
        this.children[ib] = a
        this.markFlag(ElementFlag.CHILDREN)
        this.invalidateOrder()
        return this
    }

    // ---- 层级钩子（子类覆写） ----
    protected onAddChild(child: Element, index: number): void { }
    protected onRemoveChild(child: Element, index: number): void { }
    protected onAttachParent(parent: Element): void { }
    protected onDetachParent(parent: Element): void { }
    /** 子节点顺序失效（容器按 zIndex 排序时覆写） */
    invalidateOrder(): void { }

    // ==================== 遍历 ====================

    /** 深度优先前序遍历（含自身）。回调返回 true 则中断 */
    traverse(cb: (node: Element) => boolean | void): boolean {
        if (cb(this) === true) return true
        const children = this.children
        for (let i = 0; i < children.length; i++) {
            if (children[i].traverse(cb) === true) return true
        }
        return false
    }

    /** 向上遍历祖先（含自身） */
    traverseAncestor(cb: (node: Element) => boolean | void): boolean {
        let n: Element | null = this
        while (n) {
            if (cb(n) === true) return true
            n = n.parent
        }
        return false
    }

    /** 向下遍历后代（不含自身） */
    traverseDescendant(cb: (node: Element) => boolean | void): boolean {
        const children = this.children
        for (let i = 0; i < children.length; i++) {
            const c = children[i]
            if (cb(c) === true) return true
            if (c.traverseDescendant(cb) === true) return true
        }
        return false
    }

    // ==================== 坐标转换 ====================

    /** 本地坐标 → 世界坐标 */
    localToWorld<T extends Vector2Like>(point: Vector2Like, out: T): T {
        return this.transform.localToWorld(point, out)
    }

    /** 世界坐标 → 本地坐标 */
    worldToLocal<T extends Vector2Like>(point: Vector2Like, out: T): T {
        return this.transform.worldToLocal(point, out)
    }

    // ==================== 包围盒 ====================

    /** 计算本地包围盒（几何范围），由具体图形/容器实现 */
    abstract calcLocalBounds(out: BoundingRect): BoundingRect

    /** 计算本地绘制包围盒，默认等于几何包围盒（描边/阴影场景可覆写） */
    calcLocalPaintBounds(out: BoundingRect): BoundingRect {
        return out.copy(this.localBounds)
    }

    /** 本地几何包围盒（懒计算） */
    get localBounds(): BoundingRect {
        let b = this._localBounds
        if (!b) {
            b = this._localBounds = new BoundingRect()
            this.calcLocalBounds(b)
            this.clearFlags(ElementFlag.LOCAL_BOUNDS)
        } else if (this.hasFlag(ElementFlag.LOCAL_BOUNDS)) {
            this.calcLocalBounds(b)
            this.clearFlags(ElementFlag.LOCAL_BOUNDS)
        }
        return b
    }

    /** 本地绘制包围盒（懒计算） */
    get paintBounds(): BoundingRect {
        let b = this._paintBounds
        if (!b) {
            b = this._paintBounds = new BoundingRect()
            this.calcLocalPaintBounds(b)
            this.clearFlags(ElementFlag.PAINT_BOUNDS)
        } else if (this.hasFlag(ElementFlag.PAINT_BOUNDS)) {
            this.calcLocalPaintBounds(b)
            this.clearFlags(ElementFlag.PAINT_BOUNDS)
        }
        return b
    }

    /**
     * 世界坐标包围盒（轴对齐，懒计算）。
     * 通过比对世界矩阵版本侦测祖先变换变化，变换或本地包围盒变化时才重算。
     */
    get worldBounds(): BoundingRect {
        const local = this.localBounds
        const wm = this.transform.worldMatrix
        let b = this._worldBounds
        if (!b) {
            b = this._worldBounds = new BoundingRect()
            this._wbValid = false
        }
        if (
            !this._wbValid ||
            this.hasFlag(ElementFlag.WORLD_BOUNDS) ||
            this.transform._worldVersion !== this._wbVersion
        ) {
            b.copy(local)
            // 空包围盒（±Infinity）不做矩阵变换，避免 NaN
            if (!b.isEmpty()) b.applyMatrix2D(wm)
            this._wbVersion = this.transform._worldVersion
            this._wbValid = true
        }
        this.clearFlags(ElementFlag.WORLD_BOUNDS)
        return b
    }

    /** 计算世界坐标绘制包围盒并写入 out（不缓存） */
    getWorldPaintBounds(out: BoundingRect): BoundingRect {
        out.copy(this.paintBounds)
        if (!out.isEmpty()) out.applyMatrix2D(this.transform.worldMatrix)
        return out
    }

    /** 强制全部包围盒缓存失效 */
    invalidateBounds(): void {
        this.markFlag(ElementFlag.LOCAL_BOUNDS | ElementFlag.PAINT_BOUNDS | ElementFlag.WORLD_BOUNDS)
    }

    // ==================== 命中测试 ====================

    /** 几何命中：坐标为当前节点 local 空间（默认以本地包围盒做矩形判定） */
    hitTest(localX: number, localY: number): boolean {
        return this.localBounds.contains(localX, localY)
    }

    /** 是否参与命中（可见、未忽略、指针事件非 none） */
    shouldInteractive(): boolean {
        return this.visible && !this._ignore && this.pointerEvents !== 'none'
    }

    /**
     * 从世界坐标查找命中的最上层节点。
     * 顺序：先子后己（子节点绘制在上层），子节点顺序由 getRenderChildren 决定。
     */
    findHit(worldX: number, worldY: number): Element | null {
        if (!this.visible) return null
        const children = this.getRenderChildren()
        for (let i = children.length - 1; i >= 0; i--) {
            const hit = children[i].findHit(worldX, worldY)
            if (hit) return hit
        }
        if (this.shouldInteractive()) {
            const local = this.worldToLocal({ x: worldX, y: worldY }, { x: 0, y: 0 })
            if (this.hitTest(local.x, local.y)) return this
        }
        return null
    }

    // ==================== 渲染 ====================

    /** 是否真正参与绘制（可见且未被忽略） */
    shouldRender(): boolean {
        return this.visible && !this._ignore
    }

    /** 是否加入渲染列表（被忽略渲染的对象不加入） */
    shouldAddToRenderList(): boolean {
        return !this._ignore
    }

    /** 渲染顺序下的子节点（默认 children 数组顺序；容器可覆写为 zIndex 排序） */
    getRenderChildren(): readonly Element[] {
        return this.children
    }

    /** 渲染自身与子树 */
    render(ctx: RenderContext): void {
        if (!this.visible || this._alpha <= 0) return
        ctx.save()
        ctx.transform(this.transform.matrix)
        this.beforeRender(ctx)
        this.draw(ctx)
        this.renderChildren(ctx)
        this.afterRender(ctx)
        ctx.restore()
    }

    /** 绘制自身（叶子节点覆写；容器默认无自绘内容） */
    draw(ctx: RenderContext): void { }

    /** 自身绘制前的钩子（图层背景/裁剪等覆写） */
    protected beforeRender(ctx: RenderContext): void { }

    /** 自身绘制后的钩子 */
    protected afterRender(ctx: RenderContext): void { }

    /** 渲染子节点 */
    protected renderChildren(ctx: RenderContext): void {
        const children = this.getRenderChildren()
        for (let i = 0; i < children.length; i++) children[i].render(ctx)
    }

    // ==================== 生命周期 ====================

    /** 递归帧更新（先自后子） */
    update(delta: number = 0): void {
        this.updateBefore(delta)
        this.updateSelf(delta)
        const children = this.children
        for (let i = 0; i < children.length; i++) children[i].update(delta)
        this.updateAfter(delta)
        // 仅在本地存在监听器时才派发，避免无监听时空跑事件传播
        if (this.listeners.size > 0) this.emit('update', { target: this })
    }

    protected updateBefore(delta: number): void { }
    protected updateSelf(delta: number): void { }
    protected updateAfter(delta: number): void { }

    // ==================== 事件 ====================

    /**
     * 派发指针事件（由事件系统命中目标后调用）。
     * PointerEvent 继承自 NodeEvent，直接沿 parent 链执行捕获 → 冒泡。
     */
    dispatchPointerEvent(event: DxPointerEvent): void {
        this.dispatchEvent(event as any)
    }

    // ==================== 属性 ====================

    /** 通用属性写入：变化时抛出 prop:change 事件 */
    protected setProp<K extends keyof Props & string>(name: K, value: Props[K]): boolean {
        const prev = this.props[name]
        if (prev === value) return false
        this.props[name] = value
        this.emit('prop:change', { target: this, name, value, prev })
        return true
    }

    // ==================== 销毁 ====================

    /** 销毁节点：解除父子关系、移除监听器 */
    dispose(): void {
        this.removeAllChildren()
        this.parent?.removeChild(this)
        this.transform.off('transform:change', this._onTransformChange)
        this.emit('dispose', { target: this })
        this.removeAllListeners()
    }
}

/** 将数值收敛到 0~1 */
function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v
}
