import { Transform } from '../math/Transform'
import { EventTarget, NodeEvent } from './EventTarget'
import { ElementFlags, ElementFlag } from './ElementFlags'
import { BoundingRect } from 'src/math/BoundingRect'
import { merge } from 'src/utils/merge'
import { Vector2Like } from 'src/math/Vector2'


export type ElementEvents = {
    click: NodeEvent
    mousedown: NodeEvent
    mousemove: NodeEvent
    mouseup: NodeEvent
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

export abstract class Element<Props extends ElementProps=ElementProps> extends EventTarget<ElementEvents> {
    type: string = 'Element'
    props: Props
    // 节点关系
    declare parent: Element<Props> | null
    declare children: Element<Props>[] | null
    // 变换
    transform: Transform

    // 包围盒
    _localBounds: BoundingRect // 本地边界框
    _worldBounds: BoundingRect // 世界边界框
    /** 更新标记管理器 */
    flags: ElementFlags = new ElementFlags()

    constructor(props?: Partial<Props>) {
        super()
    
        this.props=merge({},...this.getDefaultProps(), props || {}) as Props
        this.transform = new Transform()
        this.transform.setTransform(this.props.position, this.props.scale, this.props.rotation, this.props.skew, this.props.origin,)
        this.transform.onChange(() => {
            this.flags.add(ElementFlag.TRANSFORM | ElementFlag.LOCAL_BOUNDS)
        })
   
    }
        // 计算本地包围盒
    abstract calcLocalBounds(out: BoundingRect): BoundingRect
        // 判断点是否命中
    abstract hitTest(x: number, y: number): boolean
    
    
    onUpdate(){

    }

    getDefaultProps(): Partial<Props>[] {
        return [{
            visible:true,
            ignore:false,
            zIndex:0,
            interactive:true,
            cursor:'pointer'
            
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
    get position(){
        return this.transform.position
    }
    get rotation(){
        return this.transform.rotation
    }
    set rotation(v:number){
        this.transform.rotation=v
    }
    get scale(){
        return this.transform.scale
    }
    get skew(){
        return this.transform.skew
    }
    get origin(){
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
    shouldInteractive() {
        return this.props.interactive&&!this.props.ignore
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
    // 

    get localBounds() {
        this.updateLocalBounds()
        return this._localBounds
    }
    get worldBounds() {
        this.updateWorldBounds()
        return this._worldBounds
    }
    updateLocalBounds() {
        if (!this._localBounds) {
            this._localBounds = BoundingRect.zero()
        }
        if (this.flags.has(ElementFlag.LOCAL_BOUNDS)||this._localBounds.isZero()) {
            this.flags.remove(ElementFlag.LOCAL_BOUNDS)
            this.flags.add(ElementFlag.WORLD_BOUNDS)
            this.calcLocalBounds(this._localBounds)
        }
    }
    updateWorldBounds() {
        if (!this._worldBounds) {
            this._worldBounds = BoundingRect.zero()
        }
        const localBounds = this.localBounds
        if (this.flags.has(ElementFlag.WORLD_BOUNDS)||this._worldBounds.isZero()) {
            this.flags.remove(ElementFlag.WORLD_BOUNDS)
            this._worldBounds.copy(localBounds).applyMatrix2D(this.worldMatrix)
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
    traverseDescendant(callback: (element: Element<Props>) => (boolean|void)) {
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
}
