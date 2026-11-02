import { merge } from 'src/utils/merge'
import { } from 'src/events/EventSystem'
import { Transform, type TransformProps, type TransformEvents } from 'src/math/Transform'
import { BoundingRect } from 'src/math/BoundingRect'
import { getPathValue, setPathValue } from 'src/utils/util'
import { uid } from 'src/utils/uid'
import type { PointerEvent as ScenePointerEvent } from 'src/events/PointerEventSystem'
import type { Group } from './Group'

// auto 根据元素是否设了fill或stroke来检查点
// fill 点是否在fill内
// stroke 点是否在stroke内
// none 不检查
export type PointerEvents = 'auto' | 'fill' | 'stroke' | 'none'
export type ElementProps = TransformProps & {
    ignore: boolean // 完全忽略，不渲染，也不接收事件
    visible: boolean // 是否可见,false不渲染，但是接收事件
    pointerEvents: PointerEvents
    zIndex: number // 层级索引
}
/**
 * 元素可监听的交互事件。
 *
 * 鼠标与触摸在事件系统中统一以 pointer 语义派发（mouse 输入模式同样会映射成
 * pointerdown / pointermove / pointerup），因此这里不再单独声明 mousedown 系列。
 */
export type ElementPointerEvents = {
    pointerdown: [event: ScenePointerEvent]
    pointermove: [event: ScenePointerEvent]
    pointerup: [event: ScenePointerEvent]
    pointercancel: [event: ScenePointerEvent]
    pointerover: [event: ScenePointerEvent]
    pointerout: [event: ScenePointerEvent]
    pointerenter: [event: ScenePointerEvent]
    pointerleave: [event: ScenePointerEvent]
    click: [event: ScenePointerEvent]
    dblclick: [event: ScenePointerEvent]
    wheel: [event: ScenePointerEvent]
    dragstart: [event: ScenePointerEvent]
    drag: [event: ScenePointerEvent]
    dragend: [event: ScenePointerEvent]
    dragenter: [event: ScenePointerEvent]
    dragleave: [event: ScenePointerEvent]
    dragover: [event: ScenePointerEvent]
    drop: [event: ScenePointerEvent]
}
export type ElementEvents = {
    'prop:change': [options: { prop: string | (string | number)[], value: any, oldValue: any }]
    '*': [event: string, ...args: any[]]
    dispose: [element: Element]
} & ElementPointerEvents & TransformEvents
export const enum ElementFlag {
    NONE = 0,
    /** 局部变换矩阵变化 */
    TRANSFORM = 1 << 0,
    /** 局部包围盒需要重算 */
    LOCAL_BOUNDS = 1 << 1,
    /** 绘制包围盒需要重算（描边/阴影等效范围） */
    PAINT_BOUNDS = 1 << 2,
    /** 子节点结构变化（增删/排序） */
    CHILDREN = 1 << 3,
    /** 视觉样式变化（颜色/透明度等），需要重绘 */
    STYLE = 1 << 4,
    /** 布局变化（几何/子节点），需要重排 */
    LAYOUT = 1 << 5,
    ALL = (1 << 6) - 1,
}

/** 解析标记依赖闭包：标记某个 flag 时自动附带其依赖位 */
function resolveFlags(flag: number): number {
    let r = flag
    if (flag & ElementFlag.STYLE) {
        r |= ElementFlag.PAINT_BOUNDS
    }
    if (flag & ElementFlag.CHILDREN) {
        r |= ElementFlag.LAYOUT | ElementFlag.LOCAL_BOUNDS
    }
    return r
}
export  class Element<
    Props extends ElementProps = ElementProps,
    Events extends ElementEvents = ElementEvents
> extends Transform<Events> {
    type: string = 'Element'
    /** 元素实例唯一标识，供缓存/去重等场景使用 */
    readonly uid: number = uid('element')
    isGroup: boolean = false
    props: Props
    data: any
    flags: ElementFlag = ElementFlag.ALL
    subtreeFlags: ElementFlag = 0

    parent: Group | null = null

    // 包围盒
    private _localBounds: BoundingRect
    /** 局部包围盒版本，重算时自增；世界盒据此判断是否需要重算 */
    private _localBoundsVersion: number = 0
    private _worldBounds: BoundingRect
    private _worldBoundsVersion: number = -1
    private _worldBoundsLocalVersion: number = -1
    private _paintBounds: BoundingRect
    constructor(props: Partial<Props> = {}) {
        super(props)
        this.props = merge(this.getSelfDefaultProps(), this.getDefaultProps(), props) as Props
        this.data = {}
    }
    get visible() {
        return this.props.visible
    }
    set visible(value: boolean) {
        (this as Element<ElementProps>).setProp('visible', value);
    }
    get ignore() {
        return this.props.ignore
    }
    set ignore(value: boolean) {
        (this as Element<ElementProps>).setProp('ignore', value);
    }
    get pointerEvents() {
        return this.props.pointerEvents
    }
    set pointerEvents(value: PointerEvents) {
        (this as Element<ElementProps>).setProp('pointerEvents', value);
    }
    get zIndex() {
        return this.props.zIndex
    }
    set zIndex(value: number) {
        (this as Element<ElementProps>).setProp('zIndex', value);
    }
    onTransformChange(): void {
        this.markFlag(ElementFlag.TRANSFORM)
    }

    private getSelfDefaultProps(): Partial<Props> {
        return {
            ignore: false,
            visible: true,
            pointerEvents: 'auto',
            zIndex: 0
        } as Partial<Props>
    }
    getDefaultProps(): Partial<Props> {
        return {}
    }
    getProps(): Props {
        return this.props
    }
    setProp<K extends Extract<keyof Props, string>>(prop: K, value: Props[K]) {
        const oldValue = this.props[prop]
        if (oldValue !== value) {
            this.props[prop] = value
            this.emit('prop:change', { prop: prop as string, value, oldValue })
        }
    }
    getPathValue(path: (string | number)[], defaultValue?: any) {
        return getPathValue(this.props, path, defaultValue)
    }
    setPathValue(path: (string | number)[], value: any) {
        const oldValue = getPathValue(this.props, path)
        if (oldValue !== value) {
            setPathValue(this.props, path, value)
            this.emit('prop:change', { prop: path, value, oldValue })
        }
    }

    // ==================== 脏标记 ====================

    /**
     * 标记脏位：自动解析依赖并冒泡到祖先。
     *
     * 容器的缓存包围盒由整棵子树（含子节点局部矩阵）推导，所以 LOCAL_BOUNDS 必须
     * 直接落到祖先自身的 flags；其余脏位只归并到 subtreeFlags，保持惰性。
     * 世界包围盒不占脏位，由「世界矩阵版本 + 局部盒版本」派生判断。
     */
    markFlag(flag: ElementFlag): void {
        if (flag === ElementFlag.NONE) return
        const resolved = resolveFlags(flag)
        this.flags |= resolved
        // 自身矩阵变化不影响自身几何盒，但会改变祖先的局部盒（组局部盒含 child.matrix）
        let ancestorBounds = resolved & ElementFlag.LOCAL_BOUNDS
        if (resolved & ElementFlag.TRANSFORM) {
            ancestorBounds |= ElementFlag.LOCAL_BOUNDS
        }
        let p: Group | null = this.parent
        while (p) {
            p.flags |= ancestorBounds
            p.subtreeFlags |= resolved
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

    /** 从父节点移除自身 */
    remove(): this {
        this.parent?.removeChild(this)
        return this
    }

    /** 向上遍历祖先（含自身） */
    traverseAncestor(cb: (node: AnyElement) => boolean | void): boolean {
        let n: AnyElement | null = this
        while (n) {
            if (cb(n) === true) return true
            n = n.parent
        }
        return false
    }

    getLocalBounds() {
        if (!this._localBounds) {
            this._localBounds = new BoundingRect()
        }
        if (this.hasSubtreeFlag(ElementFlag.LOCAL_BOUNDS)) {
            this.clearFlags(ElementFlag.LOCAL_BOUNDS)
            this.clearSubtreeFlags(ElementFlag.LOCAL_BOUNDS)
            this.calcBounds(this._localBounds)
            this._localBoundsVersion++
        }
        return this._localBounds
    }
    getWorldBounds() {
        // 先取世界矩阵，让 Transform 的版本号推进到最新
        const worldMatrix = this.worldMatrix
        const localBounds = this.getLocalBounds()
        if (
            !this._worldBounds ||
            this._worldBoundsVersion !== this._worldVersion ||
            this._worldBoundsLocalVersion !== this._localBoundsVersion
        ) {
            if (!this._worldBounds) this._worldBounds = new BoundingRect()
            this._worldBounds.copy(localBounds).applyMatrix2D(worldMatrix)
            this._worldBoundsVersion = this._worldVersion
            this._worldBoundsLocalVersion = this._localBoundsVersion
        }
        return this._worldBounds
    }
    getPaintBounds(): BoundingRect{
        if (!this._paintBounds) this._paintBounds = new BoundingRect()
        this.calcPaintBounds(this._paintBounds)
        return this._paintBounds
    }
    /**
     * 判断世界坐标点是否落在图元内，供命中测试使用。
     *
     * 入参统一是世界坐标，各图元内部自行用 worldMatrixInvert 换算到自身局部坐标，
     * 因此容器可以直接把同一个点透传给子节点递归判断。
     *
     * 基类没有几何形状，始终返回 false；具体图元按 pointerEvents 的
     * auto / fill / stroke 语义覆写此方法。
     *
     * @param x 世界坐标 X
     * @param y 世界坐标 Y
     */
    hitTest(x: number, y: number): boolean {
        return false
    }
    calcBounds(out: BoundingRect): void{
        out.makeZero()
    }
    calcPaintBounds(out: BoundingRect): void{
        out.copy(this.getWorldBounds())
    }
    /**
     * 触发事件，并额外向通配监听器 `'*'` 派发。
     *
     * 事件表由子类泛型决定，基类无法静态约束事件名与参数，
     * 因此这里放宽签名；监听侧 `on` 仍保留完整类型检查。
     */
    emit(event: string, ...args: any[]) {
        const ret = (super.emit as any)(event, ...args);
        (super.emit as any)('*', event, ...args)
        return ret as boolean
    }
    dispose() {
        this.emit('dispose', this)

    }

}

/** 任意 Props / 事件表的元素类型，用于父子引用与遍历等不关心具体泛型的场景 */
export type AnyElement = Element<any, any>
