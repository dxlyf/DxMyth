import { Transform } from 'src/math/Transform'
import { INode, NodeOptions, NodeEvents } from 'src/interface/Node'
import { Matrix2D, Vector2 } from 'src/math'
import { BoundingRect } from 'src/math/BoundingRect'
import { merge } from 'src/utils'
import { NodeEffectFlags } from 'src/consts'


export abstract class Node<Options extends NodeOptions = NodeOptions, E extends NodeEvents = NodeEvents> extends Transform<Options, E> implements INode<Options> {
    static uid = 0
    type = 'Node'
    uid = 0
    effectFlag: number = NodeEffectFlags.None;
    props: Options
    parent: Node<Options, E> = null;
    children: INode<Options>[] | null = null
    sortChildren: INode<Options>[] | null = null;
    _bounds: BoundingRect = null;
    _localBounds: BoundingRect = null;
    constructor(options?: Options) {
        super(options)
        this.uid = Node.uid++
        this.props = merge({}, ...this.getDefaultProps(), options || {})
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

    get bounds() {
        this.internalCalcBounds()
        return this._bounds
    }
    get localBounds() {
        this.internalCalcLocalBounds()
        return this._localBounds
    }
    internalCalcBounds(): void {
        if (this._bounds === null) {
            this._bounds = BoundingRect.default()
        } else {
            this._bounds.makeEmpty()
        }
        this.calcBounds()
        if (this.children) {
            const children = this.children
            for (let i = 0; i < children.length; i++) {
                children[i].internalCalcBounds()
                this._bounds.union(children[i].bounds)
            }
        }

    }
    calcBounds() {

    }
    internalCalcLocalBounds(): void {
        if (this._localBounds === null) {
            this._localBounds = BoundingRect.default()
        } else {
            this._localBounds.makeEmpty()
        }
        this.calcLocalBounds()
        if (this.children) {
            const children = this.children
            for (let i = 0; i < children.length; i++) {
                children[i].internalCalcLocalBounds()
                this._localBounds.union(children[i].localBounds)
            }
        }

    }
    calcLocalBounds() {

    }
    add(child: INode): void {
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
    remove(child: INode): void {
        const index = this.children.indexOf(child)
        if (index > -1) {
            this.children.splice(index, 1)
            child.parent = null
            this.effectFlag |= NodeEffectFlags.Child | NodeEffectFlags.Reflow
        }
    }
    getSortChildren(): INode<Options>[] | null {
        const children = this.children
        if (children) {
            if (this.sortChildren === null || this.effectFlag & NodeEffectFlags.Reflow) {
                this.effectFlag &= ~NodeEffectFlags.Reflow
                this.sortChildren = children.slice()
                this.sortChildren.sort((a, b) => {
                    const a_zIndex = a.props.zIndex || 0
                    const b_zIndex = b.props.zIndex || 0
                    return a_zIndex - b_zIndex
                })
                return this.sortChildren
            }
            return this.sortChildren
        }
        return null
    }
    traverse<T extends INode<Options>>(fn: (el: T) => void): void {
        fn((this as unknown) as T);
        const children = this.children
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].traverse<T>(fn)
            }
        }
    }
    traverseSort<T extends INode<Options>>(fn: (el: T) => void): void {
        fn((this as unknown) as T);
        const children = this.getSortChildren()
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].traverseSort<T>(fn)
            }
        }
    }
    onBeforeUpdate(delta: number): void {

    }
    onUpdate(delta: number) {

    }
    onAfterUpdate(delta: number) {

    }

}