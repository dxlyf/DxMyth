import { Transform, Vector2Like, BoundingRect } from '@dxyl/math2'
import { EventTarget, NodeEvent } from './EventTarget'
import { ElementFlags, ElementFlag } from './ElementFlags'
import { merge } from 'src/utils/merge'
import type { PointerEventData, PointerEventName } from 'src/event/EventSystem'
import { Engine } from './Engine'


export type ElementEvents = {
    // pointer 统一事件（覆盖 mouse / touch）
    pointerdown: NodeEvent<PointerEventName, PointerEventData>
    pointermove: NodeEvent<PointerEventName, PointerEventData>
    pointerup: NodeEvent<PointerEventName, PointerEventData>
    pointerover: NodeEvent<PointerEventName, PointerEventData>
    pointerout: NodeEvent<PointerEventName, PointerEventData>
    pointerenter: NodeEvent<PointerEventName, PointerEventData>
    pointerleave: NodeEvent<PointerEventName, PointerEventData>
    click: NodeEvent<PointerEventName, PointerEventData>
    dblclick: NodeEvent<PointerEventName, PointerEventData>
    // drag 系列（源元素接收）
    dragstart: NodeEvent<PointerEventName, PointerEventData>
    drag: NodeEvent<PointerEventName, PointerEventData>
    dragend: NodeEvent<PointerEventName, PointerEventData>
    // drag-drop 系列（拖拽悬停的目标元素接收）
    dragenter: NodeEvent<PointerEventName, PointerEventData>
    dragleave: NodeEvent<PointerEventName, PointerEventData>
    dragover: NodeEvent<PointerEventName, PointerEventData>
    drop: NodeEvent<PointerEventName, PointerEventData>
    // 兼容旧 mouse 事件别名
    mousedown: NodeEvent<PointerEventName, PointerEventData>
    mousemove: NodeEvent<PointerEventName, PointerEventData>
    mouseup: NodeEvent<PointerEventName, PointerEventData>

    // element
    dispose: [instance: Element]
    // group
    'add:child': { target: Element, child: Element }
    'remove:child': { target: Element, child: Element }

}
/* Keyword values */
// pointer-events: auto;
// pointer-events: none; 元素永远不会成为鼠标事件的target。但是，当其后代元素的pointer-events属性指定其他值时，鼠标事件可以指向后代元素，在这种情况下，鼠标事件将在捕获或冒泡阶段触发父元素的事件侦听器。
// pointer-events: visiblePainted; /* SVG only */只适用于 SVG。元素只有在以下情况才会成为鼠标事件的目标：visibility属性值为visible，且鼠标指针在元素内部，且fill属性指定了none之外的值 .visibility属性值为visible，鼠标指针在元素边界上，且stroke属性指定了none之外的值
// pointer-events: visibleFill; /* SVG only */
// pointer-events: visibleStroke; /* SVG only */只适用于 SVG。只有在元素visibility属性值为visible，且鼠标指针在元素边界时，元素才会成为鼠标事件的目标，stroke属性的值不影响事件处理。
// pointer-events: visible; /* SVG only */ 只适用于 SVG。只有在元素visibility属性值为visible，且鼠标指针在元素内部或边界时，元素才会成为鼠标事件的目标，fill和stroke属性的值不影响事件处理。
// pointer-events: painted; /* SVG only 只适用于 SVG。元素只有在以下情况才会成为鼠标事件的目标：鼠标指针在元素内部，且fill属性指定了none之外的值鼠标指针在元素边界上，且stroke属性指定了none之外的值,visibility属性的值不影响事件处理。*/
// pointer-events: fill; /* SVG only */只适用于 SVG。只有鼠标指针在元素内部时，元素才会成为鼠标事件的目标，fill和visibility属性的值不影响事件处理。
// pointer-events: stroke; /* SVG only */只适用于 SVG。只有鼠标指针在元素边界上时，元素才会成为鼠标事件的目标，stroke和visibility属性的值不影响事件处理。
// pointer-events: all; /* SVG only */  只适用于 SVG。只有鼠标指针在元素内部或边界时，元素才会成为鼠标事件的目标，fill、stroke和visibility属性的值不影响事件处理。
export type PointerEventTypes = 'none' | 'all' | 'fill' | 'stroke'

export type ElementProps = {
    name?: string // 元素名称
    // 渲染
    visible?: boolean // 是否可见,不可见但响应事件
    ignore?: boolean // 是否忽略渲染
    zIndex?: number // 层级索引
    // 事件
    pointerEvents?: PointerEventTypes // 是否可交互,响应事件
    cursor?: string // 鼠标指针
    // 变换
    position?: Vector2Like
    rotation?: number
    scale?: Vector2Like
    skew?: Vector2Like
    origin?: Vector2Like
}
let uid = 0
export abstract class Element<Props extends ElementProps = ElementProps> extends EventTarget<ElementEvents> {
    id: number
    name?: string
    isGroup: boolean = false
    type: string = 'Element'
    props: Props
    data: any = {}
    _cache: any = {}
    owner: Engine | null = null

    // 节点关系
    declare parent: Element<Props> | null
    declare children: Element<Props>[] | null
    // 变换
    transform: Transform

    // 包围盒
    _localBounds: BoundingRect // 本地边界框
    _worldBounds: BoundingRect // 世界边界框
    _localPaintBounds: BoundingRect // 本地绘制边界框
    /** 更新标记管理器 */
    flags: ElementFlags = new ElementFlags()

    constructor(props?: Partial<Props>) {
        super()
        this.id = uid++
        this.props = merge({}, ...this.getDefaultProps(), props || {}) as Props
        this.name = this.props.name
        this.transform = new Transform(this.props)
        this.transform.onChange(() => {
            this.flags.add(ElementFlag.TRANSFORM)
        })

    }
    // 计算本地包围盒
    abstract calcLocalBounds(out: BoundingRect): BoundingRect
    // 计算本地边框包围盒
    abstract calcLocalPaintBounds(out: BoundingRect): BoundingRect
    // 判断点是否命中
    abstract hitTest(x: number, y: number): boolean

    onBeforeUpdate() {

    }
    onUpdate() {

    }
    onAfterUpdate() {

    }

    getDefaultProps(): Partial<Props>[] {
        return [{
            visible: true,
            ignore: false,
            zIndex: 0,
            pointerEvents: 'all',
            cursor: 'pointer'

        }] as Partial<Props>[]
    }
    get visible() {
        return this.props.visible
    }
    set visible(value: boolean) {
        this.props.visible = value
        this.flags.add(ElementFlag.REPAINT)
    }
    set ignore(value: boolean) {
        this.props.ignore = value
        this.flags.add(ElementFlag.REPAINT)
    }
    get ignore() {
        return this.props.ignore
    }
    get zIndex() {
        return this.props.zIndex
    }
    set zIndex(value: number) {
        this.props.zIndex = value
        this.flags.add(ElementFlag.REFLOW)
    }
    get position() {
        return this.transform.position
    }
    get rotation() {
        return this.transform.rotation
    }
    set rotation(v: number) {
        this.transform.rotation = v
    }
    get scale() {
        return this.transform.scale
    }
    get skew() {
        return this.transform.skew
    }
    get origin() {
        return this.transform.origin
    }
    /** 是否添加到渲染列表,包括不渲染，但响应事件的对象 */
    shouldAddToRenderList() {
        return !this.props.ignore
    }
    // 是否可渲染，正真正要渲染的对象
    shouldRender() {
        return this.props.visible && !this.props.ignore
    }
    // 是否可交互
    shouldInteractive(): boolean {
        return this.props.pointerEvents !== 'none' && !this.props.ignore
    }
    setProp<K extends keyof Props>(name: K, value: Props[K]) {
        const oldValue = this.props[name]
        if (oldValue !== value) {
            this.props[name] = value
        }
    }
    setProps(value: Partial<Props>) {
        for (const key in value) {
            this.setProp(key, value[key] as any)
        }
    }
    // ---- 矩阵代理 ----

    get matrix() {
        return this.transform.matrix
    }

    get worldMatrix() {
        return this.transform.worldMatrix
    }

    get worldMatrixInvert() {
        return this.transform.worldMatrixInvert
    }
    // 添加owner到自身
    setParent(parent: Element) {
        if (parent) {
            this.parent = parent as Element<Props>
            this.transform.parent = parent.transform
            this.flags.setParent(parent.flags)
            if (parent.owner) {
                this.addOwnerToSelf(parent.owner)
            }
        } else {
            this.parent = null
            this.transform.parent = null
            this.flags.removeParent()
        }
    }
    addOwnerToSelf(owner: Engine) {
        this.owner = owner
        const children = this.children
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                const child = children[i]
                child.addOwnerToSelf(owner)
            }
        }
    }
    // 
    get localBounds() {
        return this.getLocalBounds()
    }
    get worldBounds() {
        return this.getWorldBounds()
    }
    get paintBounds() {
        return this.getPaintBounds()
    }
    minX() {
        return this.worldBounds.minX
    }
    minY() {
        return this.worldBounds.minY
    }
    maxX() {
        return this.worldBounds.maxX
    }
    maxY() {
        return this.worldBounds.maxY
    }
    getLocalBounds(forceUpdate = false) {
        if (!this._localBounds) {
            this._localBounds = BoundingRect.default()
            forceUpdate = true
        }
        if (forceUpdate || this.flags.has(ElementFlag.BOUNDS)) {
            this.flags.remove(ElementFlag.BOUNDS)
            this.calcLocalBounds(this._localBounds)
        }
        return this._localBounds
    }
    getWorldBounds(forceUpdate = false) {
        if (!this._worldBounds) {
            this._worldBounds = BoundingRect.default()
            forceUpdate = true
        }
        const localBounds = this.getLocalBounds()
        if (forceUpdate || this.flags.has(ElementFlag.WORLD_BOUNDS)) {
            this.flags.remove(ElementFlag.WORLD_BOUNDS)
            this._worldBounds.copy(localBounds).applyMatrix2D(this.worldMatrix)
        }
        return this._worldBounds
    }
    getPaintBounds(forceUpdate = false) {
        if (!this._localPaintBounds) {
            this._localPaintBounds = BoundingRect.default()
            forceUpdate = true
        }
        if (forceUpdate || this.flags.has(ElementFlag.PAINT_BOUNDS)) {
            this.flags.remove(ElementFlag.PAINT_BOUNDS)
            this.calcLocalPaintBounds(this._localPaintBounds)
        }
        return this._localPaintBounds
    }

    /** 遍历祖先节点 */
    traverseAncestor(callback: (element: Element<Props>) => boolean) {
        if (callback(this) === false) {
            return
        }
        if (this.parent) {
            this.parent.traverseAncestor(callback)
        }
    }
    /** 遍历后代节点 */
    traverseDescendant(callback: (element: Element<Props>) => (boolean | void)) {
        if (callback(this) === false) {
            return false
        }
        if (this.children) {
            const children = this.children
            for (let i = 0, len = children.length; i < len; i++) {
                const child = children[i]
                if (child.traverseDescendant(callback) === false) {
                    return false
                }
            }
        }
        return true
    }
    dispose() {
        this.removeAllListeners()
        this.emit('dispose', this as any)
    }
}
