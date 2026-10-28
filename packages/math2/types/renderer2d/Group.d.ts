import { BoundingRect } from '../math/BoundingRect';
import { Element, AnyElement, ElementEvents, ElementProps } from './Element';
export type GroupProps = ElementProps;
export type GroupEvents = ElementEvents & {
    'child:add': [{
        target: Group;
        child: AnyElement;
        index: number;
    }];
    'child:remove': [{
        target: Group;
        child: AnyElement;
        index: number;
    }];
};
export declare class Group<Props extends GroupProps = GroupProps> extends Element<Props, GroupEvents> {
    type: string;
    isGroup: boolean;
    children: AnyElement[];
    /** 追加子节点 */
    addChild(child: AnyElement): this;
    /** 在指定索引插入子节点（索引越界自动收敛，重复挂载自动先解除旧父级） */
    addChildAt(child: AnyElement, index: number): this;
    /** 移除指定子节点 */
    removeChild(child: AnyElement): this;
    /** 移除指定索引的子节点 */
    removeChildAt(index: number): this;
    /** 移除全部子节点 */
    removeAllChildren(): this;
    /** 深度优先前序遍历（含自身）。回调返回 true 则中断 */
    traverse(cb: (node: AnyElement) => boolean | void): boolean;
    /** 向下遍历后代（不含自身） */
    traverseDescendant(cb: (node: AnyElement) => boolean | void): boolean;
    /** 组自身没有几何，局部包围盒为所有子节点局部包围盒（经子节点局部矩阵变换后）的并集 */
    calcBounds(out: BoundingRect): void;
    /** 组的绘制范围：子节点绘制范围（世界坐标）的并集，子节点结果已含自身世界矩阵，不再乘矩阵 */
    calcPaintBounds(out: BoundingRect): void;
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
    hitTest(x: number, y: number): boolean;
}
