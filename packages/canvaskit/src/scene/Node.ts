import { Transform } from 'src/math/Transform'
import { Matrix2D, Vector2 } from 'src/math'
import { BoundingRect } from 'src/math/BoundingRect'
import { merge } from 'src/utils'
import { NodeEffectFlags } from 'src/consts'
import type { NodeOptions,NodeEvents} from 'src/types/Node'
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer'


export abstract class Node<Options extends NodeOptions = NodeOptions, E extends NodeEvents = NodeEvents> extends Transform<Options, E>  {
    static uid = 0
    type = 'Node'
    uid = 0
    effectFlag: number = NodeEffectFlags.None;
    props: Options
    parent: Node<Options,E>|null = null;
    children: Node<Options,E>[] | null = null
    _bounds: BoundingRect = null;// 包围合
    _globalBounds: BoundingRect = null;//应用了全局矩阵的包围合 
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
            silent:false,
            ingore: false,
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
    get ingore() {
        return this.props.ingore
    }
    set ingore(v: boolean) {
        if (this.props.ingore !== v) {
            this.props.ingore = v
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
        return !this.props.ingore&&this.visible
    }
    // 是否应该响应事件
    shouldInteraction() {
        return !this.props.ingore&&this.props.silent!==true
    }
    // 是否应该添加到渲染列表中,包括不可见，但需要响应事件的节点
    shouldAddToPendingRenderList() {
        return !this.props.ingore&&(this.visible||!this.props.silent)
    }
    get bounds() {
        return this.getBounds()
    }
    get globalBounds() {
        return this.getGlobalBounds()
    }
    isInViewport(viewport:BoundingRect){
          return viewport.intersectionBox(this.globalBounds)
    }
    getGlobalBounds(forceUpdate=true): BoundingRect {
        let needUpdate=false
        if (this._globalBounds === null) {
            this._globalBounds = BoundingRect.default()
        }else {
            if(this.effectFlag&NodeEffectFlags.Matrix){
                needUpdate=true
            }
        }
        if(needUpdate||forceUpdate){
            this._globalBounds.copy(this.bounds).applyMatrix(this.worldMatrix)
        }
        return this._globalBounds
    }
    getBounds(forceUpdate=false): BoundingRect {
        let needUpdate=false
        if (this._bounds === null) {
            this._bounds = BoundingRect.default()
            needUpdate=true
        } else {
            if(this.effectFlag&NodeEffectFlags.Shape){
                needUpdate=true
            }
        }
        if(forceUpdate||needUpdate){
            this.innerCalcBounds()
            if (this.children) {
                const children = this.children
                for (let i = 0; i < children.length; i++) {
                    const bounds=children[i].getBounds(forceUpdate)
                    this._bounds.union(bounds)
                }
            }
        }
        return this._bounds
    }
    abstract innerCalcBounds():void
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
    removeAllChildren(){
        if (this.children) {
            for (let i = 0, len = this.children.length; i < len; i++) {
                this.children[i].parent=null
            }
            this.children.length=0
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
    traverseBackward<T extends Node<Options,E>>(fn: (el: T) => void): void {
        const children = this.children
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].traverse<T>(fn)
            }
        }
        fn((this as unknown) as T);
    }
    onBeforeUpdate(delta: number): void {

    }
    onUpdate(delta: number) {

    }
    onAfterUpdate(delta: number) {

    }
    dispose(){
        this.removeAllListeners()
    }
  
}