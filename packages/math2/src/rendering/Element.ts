import { EventEmitter, type EventMap } from "src/events/EventEmitter";
import { Vector2, Vector2Like } from "src/math/Vector2";
import { Matrix2D } from "src/math/Matrix2D";
import { Transform, type TransformProps, type TransformEvents } from "src/math/Transform";
import { type PointerEvent, type PointerEventsMaps } from 'src/events/PointerEventSystem'
import { uid } from "src/utils/uid";
import { BoundingRect } from "src/math/BoundingRect";
import { merge } from "src/utils/merge";


export type ElementEvents = TransformEvents & PointerEventsMaps & {
    'add:child': [{ target: Element, parent: Element }]
    'remove:child': [{ target: Element, parent: Element }]
    'prop:change': [{ target: Element, name: string, value: any,prev:any }]
    'update': [instance: Element]
    'dispose': [instance: Element]
}

export type ElementProps = TransformProps & {
    name?: string // 元素名称
    // 渲染
    visible?: boolean // 是否可见,不可见但响应事件
    ignore?: boolean // 是否忽略渲染
    zIndex?: number // 层级索引
    // 事件
    pointerEvents?: 'auto' | 'fill' | 'stroke' | 'all' | 'none' // 是否可交互,响应事件
    cursor?: string // 鼠标指针
}
export const ELEMENT_DIRTY_FLAGS = {
    NONE: 0,
    TRANSFORM: 1 << 1, // 变换变化，影响重排，包括
    LOCAL_BOUNDS: 1 << 2,
    CHILDREN: 1 << 3,
    LAYER_Z_INDEX: 1 << 4, // 层级索引变化,需要重排
  //  REPAINT: 1 << 4,   // 需要重新绘制
  //  REFLOW: 1 << 5,   // 需要重新布局、形状变化、变换变化
    SHAPE: 1 << 6, // 形状变化,需要重排和重绘
    STYLE: 1 << 7, // 样式变化,需要重绘，重排看具体样式
    PROPS: 1 << 8, // 属性变化

}
export abstract class Element<Props extends ElementProps = ElementProps, Events extends TransformEvents = ElementEvents, Owner extends any = any> extends Transform<Events> {
    uid: number = 0
    name: string
    owner: Owner | null = null
    props: Props 
    // 更新标记
    flags: number = ELEMENT_DIRTY_FLAGS.NONE
    /** 子树中累积的标记（归并自所有子节点） */
    subtreeFlags: number = ELEMENT_DIRTY_FLAGS.NONE
    // 包围合
    _localBounds: BoundingRect
    _worldBounds: BoundingRect
    //元素层级关系
    parent: Element<Props> | null = null
    children: Element<Props>[] = []
    constructor(props?: Partial<Props>) {
        super(props)
        this.props=merge({} as Props,...this.getDefaultProps(),props)
        this.uid = uid('element')
        this.name = props.name
    }
    getDefaultProps():Partial<Props>[]{
        return [{
            pointerEvents:'auto',
            cursor:null,
            visible:true,
            ignore:false,
            zIndex:-1,
        }] as Partial<Props>[]
    }
    setProp<K extends keyof Props>(name:K,value:Props[K]){
        const oldValue = this.props[name]
        if(oldValue===value){
            this.props[name]=value
            this.flags |= ELEMENT_DIRTY_FLAGS.PROPS;
            (this as EventEmitter<ElementEvents>).emit('prop:change', { target: this, name:name as string, value,prev:oldValue })
        }
    }
    getProp<K extends keyof Props>(name:K):Props[K]{
        return this.props[name]
    }
    set zIndex(value:number){
         (this as Element<Props>).setProp('zIndex',value)
    }
    get zIndex(){
        return this.props.zIndex
    }
    set visible(value:boolean){
        (this as Element<Props>).setProp('visible',value)
    }
    get visible(){
        return this.props.visible
    }
    set ignore(value:boolean){
        (this as Element<Props>).setProp('ignore',value)
    }
    get ignore(){
        return this.props.visible
    }
    onTransformChange(): void {
        this.flags |= ELEMENT_DIRTY_FLAGS.LOCAL_BOUNDS
        this.flags |= ELEMENT_DIRTY_FLAGS.TRANSFORM
    }
    onAttachParent() {
        const children = this.children
        this.owner = this.parent.owner as Owner
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i]
            child.onAttachParent()
        }
    }
    onDetachParent() {
        const children = this.children
        this.owner = null
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i]
            child.onDetachParent()
        }
    }

    onAddChild(child: Element) {
        this.flags |= ELEMENT_DIRTY_FLAGS.CHILDREN
    }
    onRemoveChild(child: Element) {
        this.flags |= ELEMENT_DIRTY_FLAGS.CHILDREN
    }
    addChild(child: Element<Props>) {
       this.addChildAt(child,this.children.length)
    }
    addChildAt(child: Element<Props>, index: number) {
        if (child.parent) {
            child.parent.removeChild(child)
        }
        let len = this.children.length
        let insertIndex = len, i = -1
        while (i++ < len&&index<len) {
            if (index < i) {
                insertIndex = i
                break
            }
        }
        child.parent = this
        if (len === insertIndex) {
            this.children.push(child)
        } else {
            this.children.splice(insertIndex, 0, child)
        }
        this.onAddChild(child);
        child.onAttachParent();
        (this as EventEmitter<ElementEvents>).emit('add:child', { target: this, parent: child })
    }
    removeChild(child: Element<Props>) {
        const index = this.children.indexOf(child)
        if (index > -1) {
            this.children.splice(index, 1)
            this.onRemoveChild(child);
            child.onDetachParent();
            (this as EventEmitter<ElementEvents>).emit('remove:child', { target: this, parent: child })
            child.parent = null;
        }
    }
    // 计算元素包围盒
    abstract calcLocalBounds(out: BoundingRect): void
    get localBounds(): BoundingRect {
        this.updateLocalBounds()
        return this._localBounds
    }
    get worldBounds(): BoundingRect {
        this.updateWorldBounds()
        return this._worldBounds
    }
    updateLocalBounds(forceUpdate: boolean = false) {
        let shouldUpdate = forceUpdate
        if (!this._localBounds) {
            this._localBounds = new BoundingRect()
            shouldUpdate = true
        }
        if (this.flags & ELEMENT_DIRTY_FLAGS.LOCAL_BOUNDS) {
            this.flags &= ~ELEMENT_DIRTY_FLAGS.LOCAL_BOUNDS
            shouldUpdate = true
        }
        if (shouldUpdate) {
            this.calcLocalBounds(this._localBounds)
        }
    }
    updateWorldBounds() {
        if (!this._worldBounds) {
            this._worldBounds = new BoundingRect()
        }
        const localBounds = this.localBounds
        this._worldBounds.copy(localBounds)
        this._worldBounds.applyMatrix2D(this.worldMatrix)
    }
    updateBefore() {

    }
    update() {
        this.updateMatrix()
        this.updateWorldMatrix()
    }
    updateAfter() {
        this.flags = ELEMENT_DIRTY_FLAGS.NONE
    }
    
    traverse(callback: ((element: Element) => boolean | void)) {
        if (callback(this) === true) {
            return true
        }
        const children = this.children
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            const result = child.traverse(callback)
            if (result === true) {
                return true
            }
        }
        return false
    }
    dispose() {
        (this as EventEmitter<ElementEvents>).emit('dispose', this)
    }
}