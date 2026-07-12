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
}

export type ElementProps = {
    name?: string // 元素名称
    // 渲染
    visible?: boolean // 是否可见,不可见但响应事件
    ignore?: boolean // 是否忽略渲染
    zIndex?: number // 层级索引
    // 事件
    interactive?: boolean // 是否可交互,响应事件
    cursor?: string // 鼠标指针
    // 变换
    position?: Vector2Like
    rotation?: number
    scale?: Vector2Like
    skew?: Vector2Like
    origin?: Vector2Like
}

export abstract class Element<Props extends ElementProps = ElementProps> extends EventTarget<ElementEvents> {
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
    _localBoundsVersion: number = 0 // 本地边界框版本号
    _worldBounds: BoundingRect // 世界边界框
    _worldBoundsVersion: number = 0 // 世界边界框版本号
    _localStrokeBounds: BoundingRect // 本地边框边界框
    _localStrokeBoundsVersion: number = -1 // 本地边框边界框版本号
    _worldStrokeBounds: BoundingRect // 世界边框边界框
    _worldStrokeBoundsVersion: number = -1 // 世界边框边界框版本号
    /** 更新标记管理器 */
    flags: ElementFlags = new ElementFlags()

    constructor(props?: Partial<Props>) {
        super()

        this.props = merge({}, ...this.getDefaultProps(), props || {}) as Props
        this.transform = new Transform()
        this.transform.setTransform(this.props.position, this.props.scale, this.props.rotation, this.props.skew, this.props.origin,)
        this.transform.onChange(() => {
            this.flags.add(ElementFlag.TRANSFORM | ElementFlag.BOUNDS)
        })

    }
    // 计算本地包围盒
    abstract calcLocalBounds(out: BoundingRect): BoundingRect
    // 计算本地边框包围盒
    abstract calcLocalStrokeBounds(out: BoundingRect): BoundingRect
    // 判断点是否命中
    abstract hitTest(x: number, y: number): boolean


    onUpdate() {

    }

    getDefaultProps(): Partial<Props>[] {
        return [{
            visible: true,
            ignore: false,
            zIndex: 0,
            interactive: true,
            cursor: 'pointer'

        }] as Partial<Props>[]
    }
    get visible() {
        return this.props.visible
    }
    set visible(value: boolean) {
        this.props.visible = value
        this.flags.add(ElementFlag.VISIBILITY)
    }
    set ignore(value: boolean) {
        this.props.ignore = value
        this.flags.add(ElementFlag.VISIBILITY)
    }
    get ignore() {
        return this.props.ignore
    }
    get zIndex() {
        return this.props.zIndex
    }
    set zIndex(value: number) {
        this.props.zIndex = value
        this.flags.add(ElementFlag.CHILDREN)
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
    dirtyStyle() {
        this.flags.add(ElementFlag.STYLE)
    }
    dirtyShape() {
        this.flags.add(ElementFlag.SHAPE|ElementFlag.BOUNDS)
    }
    dirty() {
        this.flags.add(ElementFlag.VISIBILITY)
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
    shouldInteractive() {
        return this.props.interactive && !this.props.ignore
    }
    get name() {
        return this.props.name
    }
    setProp(name: keyof Props, value: any) {
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
            this.flags.setParent(parent.flags)
            this.transform.parent = parent.transform
            if (parent.owner) {
                this.addOwnerToSelf(parent.owner)
            }
        } else {
            this.parent = null
            this.transform.parent = null
            this.flags.parent = null
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
        this.updateLocalBounds()
        return this._localBounds
    }
    get worldBounds() {
        this.updateWorldBounds()
        return this._worldBounds
    }
    get localStrokeBounds() {
        this.updateLocalStrokeBounds()
        return this._localStrokeBounds
    }
    get worldStrokeBounds() {
        this.updateWorldStrokeBounds()
        return this._worldStrokeBounds
    }
    updateLocalBounds(forceUpdate: boolean = false) {
        if (!this._localBounds) {
            this._localBounds = BoundingRect.zero()
            forceUpdate = true
        }
        if (this.flags.has(ElementFlag.BOUNDS) || forceUpdate) {
            this.flags.remove(ElementFlag.BOUNDS)
            this._localBoundsVersion++
            this.calcLocalBounds(this._localBounds)
        }
    }
    updateWorldBounds(forceUpdate: boolean = false) {
        if (!this._worldBounds) {
            this._worldBounds = BoundingRect.zero()
            forceUpdate = true
        }
        const localBounds = this.localBounds
        if (this._worldBoundsVersion !== this._localBoundsVersion || forceUpdate) {
            this._worldBoundsVersion = this._localBoundsVersion
            this._worldBounds.copy(localBounds).applyMatrix2D(this.worldMatrix)
        }
    }
    updateLocalStrokeBounds(forceUpdate: boolean = false) {
        if (!this._localStrokeBounds) {
            this._localStrokeBounds = BoundingRect.zero()
            forceUpdate = true
        }
        if (this._localStrokeBoundsVersion !== this._localBoundsVersion || forceUpdate) {
            this._localStrokeBoundsVersion = this._localBoundsVersion
            this.calcLocalStrokeBounds(this._localStrokeBounds)
        }
    }
    updateWorldStrokeBounds(forceUpdate: boolean = false) {
        if (!this._worldStrokeBounds) {
            this._worldStrokeBounds = BoundingRect.zero()
            forceUpdate = true
        }
        const localStrokeBounds = this.localStrokeBounds
        if (this._worldStrokeBoundsVersion !== this._localStrokeBoundsVersion || forceUpdate) {
            this._worldStrokeBoundsVersion = this._localStrokeBoundsVersion
            this._worldStrokeBounds.copy(localStrokeBounds).applyMatrix2D(this.worldMatrix)
        }
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
