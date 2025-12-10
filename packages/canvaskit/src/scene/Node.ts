import { Transform } from 'src/math/Transform'
import { Matrix2D, Vector2 } from 'src/math'
import { BoundingRect } from 'src/math/BoundingRect'
import { merge } from 'src/utils'
import { NodeEffectFlags } from 'src/consts'
import type { NodeOptions, NodeEvents } from 'src/types/Node'
import { type CKEngine } from 'src/core/CKEngine'


export abstract class Node<Options extends NodeOptions = NodeOptions, E extends NodeEvents = NodeEvents> extends Transform<Options, E> {
    static uid = 0
    type = 'Node'
    uid = 0
    effectFlag: number = NodeEffectFlags.None;
    props: Options
    parent: Node<Options, E> | null = null;
    children: Node<Options, E>[] | null = null
    _owner: CKEngine = null
    _bounds: BoundingRect = null;// 包围合
    _globalBounds: BoundingRect = null;//应用了全局矩阵的包围合 
    constructor(options?: Options) {
        super(options)
        this.uid = Node.uid++
        this.props = merge({}, ...this.getDefaultProps(), options || {})
    }
    // 变换更新时
    updateTransform() {
        super.updateTransform()
        this.effectFlag |= NodeEffectFlags.Matrix | NodeEffectFlags.Repaint
    }
    getDefaultProps(): Options[] {
        return [{
            zIndex: 0,
            visible: true,
            silent: false,
            ingore: false,
            cache: false
        }] as Options[]
    }
    get zIndex() {
        return this.props.zIndex || 0
    }
    // 在渲染列表中的层级
    set zIndex(zIndex: number) {
        if (this.props.zIndex !== zIndex) {
            this.props.zIndex = zIndex
            this.effectFlag |= NodeEffectFlags.Reflow
        }

    }
    get visible() {
        return this.props.visible
    }
    // 显示排除在渲染列表中
    set visible(v: boolean) {
        if (this.props.visible !== v) {
            this.props.visible = v
            this.effectFlag |= NodeEffectFlags.Repaint
        }

    }
    get ingore() {
        return this.props.ingore
    }
    // 是否排除在对象列表
    set ingore(v: boolean) {
        if (this.props.ingore !== v) {
            this.props.ingore = v
            this.effectFlag |= NodeEffectFlags.Repaint
        }
    }
    // 获取节点的所有者引擎
    get owner(): CKEngine {
        if (this.parent) {
            return this.parent.owner
        }
        return this._owner
    }
    // 获取子节点的效果标志
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
    // 获取所有子节点的效果标志
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
        return !this.props.ingore && this.visible
    }
    // 是否应该响应事件
    shouldInteraction() {
        return !this.props.ingore && this.props.silent !== true
    }
    // 是否应该添加到渲染列表中,包括不可见，但需要响应事件的节点
    shouldAddToPendingRenderList() {
        return !this.props.ingore && (this.visible || !this.props.silent)
    }
    get bounds() {
        return this.getBounds()
    }
    get globalBounds() {
        return this.getGlobalBounds()
    }
    // 是否在视口内
    isInViewport(viewport: BoundingRect) {
        return viewport.intersectionBox(this.globalBounds)
    }
    // 是否应该更新全局包围合
    shouldUpdateGloablBounds() {
        return this.effectFlag & (NodeEffectFlags.Shape | NodeEffectFlags.Matrix)
    }
    // 是否应该更新包围合
    shouldUpdateBounds() {
        return this.effectFlag & NodeEffectFlags.Shape
    }
    // 获取应用了全局矩阵的包围合
    getGlobalBounds(forceUpdate = true): BoundingRect {
        let needUpdate = false
        if (this._globalBounds === null) {
            this._globalBounds = BoundingRect.default()
        } else {
            if (this.shouldUpdateGloablBounds()) {
                needUpdate = true
            }
        }
        if (needUpdate || forceUpdate) {
            this._globalBounds.copy(this.bounds).applyMatrix(this.worldMatrix)
        }
        return this._globalBounds
    }
    // 获取包围合
    getBounds(forceUpdate = false): BoundingRect {
        let needUpdate = false
        if (this._bounds === null) {
            this._bounds = BoundingRect.default()
            needUpdate = true
        } else {
            if (this.shouldUpdateBounds()) {
                needUpdate = true
            }
        }
        if (forceUpdate || needUpdate) {
            this.innerCalcBounds()
            if (this.children) {
                const children = this.children
                for (let i = 0; i < children.length; i++) {
                    const bounds = children[i].getBounds(forceUpdate)
                    this._bounds.union(bounds)
                }
            }
        }
        return this._bounds
    }
    // 内部计算包围合，需要继承者具体实现
    abstract innerCalcBounds(): void
    // 获取节点在父节点中的索引
    index() {
        if (this.parent) {
            return this.parent.children.indexOf(this)
        }
        return -1
    }
    // 在指定节点之前插入子节点
    insertBefore(child: Node<Options, E>, refChild?: Node<Options, E>) {
        if (this.children === null) {
            this.children = []
        }
        if (child.parent) {
            child.parent.remove(child)
        }
        child.parent = this
        if (refChild && refChild.parent === this) {
            this.children.splice(refChild.index(), 0, child)
        } else {
            this.children.push(child)
        }
        this.effectFlag |= NodeEffectFlags.Child | NodeEffectFlags.Reflow
    }
    add(child: Node<Options, E>): void {
        this.insertBefore(child)
    }
    // 从父节点中移除自身
    removeSelf() {
        if (this.parent) {
            this.parent.remove(this)
        }
    }
    // 移除子节点
    remove(child: Node<Options, E>): void {
        const index = this.children.indexOf(child)
        if (index > -1) {
            this.children.splice(index, 1)
            child.parent = null
            this.effectFlag |= NodeEffectFlags.Child | NodeEffectFlags.Reflow
        }
    }
    removeAllChildren() {
        if (this.children) {
            for (let i = 0, len = this.children.length; i < len; i++) {
                this.children[i].parent = null
            }
            this.children.length = 0
            this.effectFlag |= NodeEffectFlags.Child | NodeEffectFlags.Reflow
        }
    }
    // 遍历所有子节点
    traverse<T extends Node<Options, E>>(fn: (el: T) => void): void {
        fn((this as unknown) as T);
        const children = this.children
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                children[i].traverse<T>(fn)
            }
        }
    }
    traverseBackward<T extends Node<Options, E>>(fn: (el: T) => void): void {
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
    dispose() {
        this.removeAllListeners()
    }

}