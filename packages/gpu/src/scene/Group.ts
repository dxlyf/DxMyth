// ============================================================
// Group — 容器节点
//
// 直接继承 Element（与 DisplayObject 形状分支并列），增加「容器」语义：
//   - 子节点边界：本地/绘制包围盒 = 各子节点包围盒（经子节点局部矩阵变换后）的并集
//   - 命中委托：默认不自我命中，交由子节点；可设置 hitArea 让整块区域可交互
//   - 顺序：渲染/命中按 zIndex 升序（同 zIndex 保持插入顺序，稳定排序）
//
// 坐标说明：子节点的 localBounds 位于子节点自身空间，需经 child.matrix 变换到
// 本容器的 local 空间后再并集 —— 这是嵌套变换下包围盒正确性的关键。
// ============================================================

import { BoundingRect } from '../math/BoundingRect'
import { Element, type ElementProps } from './Element'

export type GroupProps = ElementProps

export class Group<Props extends GroupProps = GroupProps> extends Element<Props> {

    type: string = 'Group'
    isGroup: boolean = true

    /** 可选命中区域（local 空间）；设置后整块区域可命中 */
    hitArea: BoundingRect | null = null

    constructor(props: Partial<Props> = {}) {
        super(props)
    }

    // ---- 顺序 ----

    /** 渲染顺序子节点：按 zIndex 升序稳定排序 */
    getRenderChildren(): readonly Element[] {
        const children = this.children
        if (children.length <= 1) return children
        // ES2019+ Array#sort 为稳定排序，同 zIndex 保持插入顺序
        return children.slice().sort((a, b) => a.zIndex - b.zIndex)
    }

    // ---- 包围盒 ----

    /** 本地包围盒 = 各子节点本地包围盒（经子节点局部矩阵变换）的并集 */
    calcLocalBounds(out: BoundingRect): BoundingRect {
        out.setEmpty()
        const children = this.children
        if (children.length === 0) return out
        const tmp = BoundingRect.pool.get()
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            tmp.copy(child.localBounds)
            tmp.applyMatrix2D(child.matrix)
            out.union(tmp)
        }
        BoundingRect.pool.release(tmp)
        return out
    }

    /** 本地绘制包围盒 = 各子节点绘制包围盒（经子节点局部矩阵变换）的并集 */
    calcLocalPaintBounds(out: BoundingRect): BoundingRect {
        out.setEmpty()
        const children = this.children
        if (children.length === 0) return out
        const tmp = BoundingRect.pool.get()
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            tmp.copy(child.paintBounds)
            tmp.applyMatrix2D(child.matrix)
            out.union(tmp)
        }
        BoundingRect.pool.release(tmp)
        return out
    }

    // ---- 命中 ----

    /** 容器自身默认不命中（由子节点命中）；设置 hitArea 后整块区域可命中 */
    hitTest(localX: number, localY: number): boolean {
        return this.hitArea ? this.hitArea.contains(localX, localY) : false
    }
}
