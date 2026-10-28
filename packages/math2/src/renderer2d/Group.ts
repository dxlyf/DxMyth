import { BoundingRect } from 'src/math/BoundingRect'
import { Element, ElementFlag, type AnyElement, type ElementEvents, type ElementProps } from './Element'

export type GroupProps = ElementProps
export type GroupEvents = ElementEvents & {
    'child:add': [{ target: Group, child: AnyElement, index: number }]
    'child:remove': [{ target: Group, child: AnyElement, index: number }]
}

/** 深度优先前序遍历，回调返回 true 则中断 */
function traverseNode(node: AnyElement, cb: (node: AnyElement) => boolean | void): boolean {
    if (cb(node) === true) return true
    if (node.isGroup) {
        const children = (node as Group).children
        for (let i = 0; i < children.length; i++) {
            if (traverseNode(children[i], cb) === true) return true
        }
    }
    return false
}

export class Group<Props extends GroupProps = GroupProps> extends Element<Props, GroupEvents> {
    type: string = 'Group'
    isGroup: boolean = true
    children: AnyElement[] = []

    // ==================== 层级管理 ====================

    /** 追加子节点 */
    addChild(child: AnyElement): this {
        return this.addChildAt(child, this.children.length)
    }
    /** 在指定索引插入子节点（索引越界自动收敛，重复挂载自动先解除旧父级） */
    addChildAt(child: AnyElement, index: number): this {
        if (child === this) return this
        const len = this.children.length
        index = index < 0 ? 0 : index > len ? len : index
        // 若已挂载到其它父级，先摘除
        if (child.parent) child.parent.removeChild(child)
        child.parent = this
        this.children.splice(index, 0, child)
        this.markFlag(ElementFlag.CHILDREN)
        this.emit('child:add', { target: this, child, index })
        return this
    }

    /** 移除指定子节点 */
    removeChild(child: AnyElement): this {
        const index = this.children.indexOf(child)
        return index < 0 ? this : this.removeChildAt(index)
    }
    /** 移除指定索引的子节点 */
    removeChildAt(index: number): this {
        const child = this.children[index]
        if (!child) return this
        this.children.splice(index, 1)
        child.parent = null
        this.markFlag(ElementFlag.CHILDREN)
        this.emit('child:remove', { target: this, child, index })
        return this
    }

    /** 移除全部子节点 */
    removeAllChildren(): this {
        for (let i = this.children.length - 1; i >= 0; i--) this.removeChildAt(i)
        return this
    }

    // ==================== 遍历 ====================

    /** 深度优先前序遍历（含自身）。回调返回 true 则中断 */
    traverse(cb: (node: AnyElement) => boolean | void): boolean {
        return traverseNode(this, cb)
    }

    /** 向下遍历后代（不含自身） */
    traverseDescendant(cb: (node: AnyElement) => boolean | void): boolean {
        const children = this.children
        for (let i = 0; i < children.length; i++) {
            if (traverseNode(children[i], cb) === true) return true
        }
        return false
    }

    // ==================== 包围盒 ====================


    /** 组自身没有几何，局部包围盒为所有子节点局部包围盒（经子节点局部矩阵变换后）的并集 */
    calcBounds(out: BoundingRect): void {
        out.setEmpty()
        const tmp = BoundingRect.pool.get()
        const children = this.children
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            tmp.copy(child.getLocalBounds()).applyMatrix2D(child.matrix)
            out.union(tmp)
        }
        BoundingRect.pool.release(tmp)
    }

    /** 组的绘制范围：子节点绘制范围（世界坐标）的并集，子节点结果已含自身世界矩阵，不再乘矩阵 */
    calcPaintBounds(out: BoundingRect): void {
        out.setEmpty()
        const children = this.children
        for (let i = 0; i < children.length; i++) {
            out.union(children[i].getPaintBounds())
        }
    }

    // ==================== 命中测试 ====================

    /**
     * 命中测试：组自身没有几何，按绘制顺序反向遍历子节点（后绘制的在上层）。
     *
     * 入参是世界坐标，直接透传给子节点，由子节点用自己的 worldMatrixInvert
     * 换算到自身局部坐标，避免逐层做局部矩阵的逆变换。
     *
     * 任一层 pointerEvents 为 none 即整棵子树不参与命中；visible 为 false 仍可命中。
     *
     * @param x 世界坐标 X
     * @param y 世界坐标 Y
     */
    hitTest(x: number, y: number): boolean {
        if (this.ignore || this.pointerEvents === 'none') return false
        const children = this.children
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].hitTest(x, y)) return true
        }
        return false
    }
}
