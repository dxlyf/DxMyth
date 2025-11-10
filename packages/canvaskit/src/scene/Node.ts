import { Transform } from 'src/math/Transform'
import { Matrix2D, Vector2 } from 'src/math'
import { BoundingRect } from 'src/math/BoundingRect'
import { merge } from 'src/utils'
import { NodeEffectFlags } from 'src/consts'
import type { NodeOptions,NodeEvents} from 'src/types/Node'


export abstract class Node<Options extends NodeOptions = NodeOptions, E extends NodeEvents = NodeEvents> extends Transform<Options, E>  {
    static uid = 0
    type = 'Node'
    uid = 0
    effectFlag: number = NodeEffectFlags.None;
    props: Options
    parent: Node<Options,E>|null = null;
    children: Node<Options,E>[] | null = null
    _globalBounds: BoundingRect = null;
    _localBounds: BoundingRect = null;
    constructor(options?: Options) {
        super(options)
        this.uid = Node.uid++
        this.props = merge({}, ...this.getDefaultProps(), options || {})
    }
    updateTransform(){
        super.updateTransform()
        this.effectFlag |= NodeEffectFlags.Matrix|NodeEffectFlags.Repaint
    }
    getDefaultProps(): Options[] {
        return [{
            zIndex: 0,
            visible: true,
            opacity: 1,
            cache: false
        }] as Options[]
    }
    get zIndex() {
        return this.props.zIndex || 0
    }
    set zIndex(zIndex: number) {
        if (this.props.zIndex !== zIndex) {
            this.props.zIndex = zIndex
            this.effectFlag |= NodeEffectFlags.Reflow
        }

    }
    get visible() {
        return this.props.visible
    }
    set visible(v: boolean) {
        if (this.props.visible !== v) {
            this.props.visible = v
            this.effectFlag |= NodeEffectFlags.Repaint
        }

    }
    get opacity() {
        return this.props.opacity
    }
    set opacity(v: number) {
        if (this.props.opacity !== v) {
            this.props.opacity = v
            this.effectFlag |= NodeEffectFlags.Repaint
        }
    }
    getChildEffectFlag() {
        let flag = 0
        const children = this.children
        if (children) {
            for (const child of children) {
                flag |= child.getChildEffectFlag()
            }
        }
        return flag
    }
    getAllEffectFlag() {
        let flag = this.effectFlag
        const children = this.children
        if (children) {
            for (const child of children) {
                flag |= child.getAllEffectFlag()
            }
        }
        return flag
    }
    // 是否应该渲染
    shouldRender() {
        return this.props.opacity > 0 && this.visible
    }
    // 是否应该响应事件
    shouldInteraction() {
        return this.props.silent!==true
    }
    // 是否应该添加到渲染列表中,包括不可见，但需要响应事件的节点
    shouldAddToPendingRenderList() {
        return this.props.visible
    }
    get globalBounds() {
        return this.getGlobalBounds()
    }
    get localBounds() {
        return this.getLocalBounds()
    }
    isInViewport(viewport:BoundingRect){
          return viewport.intersectionBox(this.globalBounds)
    }
    getGlobalBounds(): BoundingRect {
        if (this._globalBounds === null) {
            this._globalBounds = BoundingRect.default()
        }
        this._globalBounds.copy(this.localBounds)
        if(this.parent){
            this._globalBounds.applyMatrix(this.parent.worldMatrix)
        }
        return this._globalBounds
    }
    getLocalBounds(forceUpdate=false): BoundingRect {
        if (this._localBounds === null) {
            this._localBounds = BoundingRect.default()
            forceUpdate=true
        } else {
            if(this.effectFlag&NodeEffectFlags.Matrix){
                this.effectFlag &= ~NodeEffectFlags.Matrix
                forceUpdate=true
            }
        }
        if(forceUpdate){
            this.innerCalcLocalBounds()
            this._localBounds.applyMatrix(this.matrix)
            if (this.children) {
                const children = this.children
                for (let i = 0; i < children.length; i++) {
                    const localBounds=children[i].getLocalBounds()
                    this._localBounds.union(localBounds)
                }
            }
        }
        return this._localBounds
    }
    abstract innerCalcLocalBounds():void
    add(child: Node<Options,E>): void {
        if (this.children === null) {
            this.children = []
        }
        if (child.parent !== this) {
            if (child.parent !== null) {
                child.parent.remove(child)
            }
            this.children.push(child)
            child.parent = this
            this.effectFlag |= NodeEffectFlags.Child | NodeEffectFlags.Reflow
        }
    }
    removeSelf() {
        if (this.parent) {
            this.parent.remove(this)
        }
    }
    remove(child: Node<Options,E>): void {
        const index = this.children.indexOf(child)
        if (index > -1) {
            this.children.splice(index, 1)
            child.parent = null
            this.effectFlag |= NodeEffectFlags.Child | NodeEffectFlags.Reflow
        }
    }
    traverse<T extends Node<Options,E>>(fn: (el: T) => void): void {
        fn((this as unknown) as T);
        const children = this.children
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].traverse<T>(fn)
            }
        }
    }
    onBeforeUpdate(delta: number): void {

    }
    onUpdate(delta: number) {

    }
    onAfterUpdate(delta: number) {

    }
    
    dispose(){
    
    }
  
}