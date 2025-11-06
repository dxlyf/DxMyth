import { default as Element, ElementProps } from '../Element';
import { default as BoundingRect } from '../core/BoundingRect';
import { ZRenderType } from '../zrender';
export interface GroupProps extends ElementProps {
}
declare class Group extends Element<GroupProps> {
    readonly isGroup = true;
    private _children;
    constructor(opts?: GroupProps);
    /**
     * Get children reference.
     */
    childrenRef(): Element<ElementProps>[];
    /**
     * Get children copy.
     */
    children(): Element<ElementProps>[];
    /**
     * 获取指定 index 的儿子节点
     */
    childAt(idx: number): Element;
    /**
     * 获取指定名字的儿子节点
     */
    childOfName(name: string): Element;
    childCount(): number;
    /**
     * 添加子节点到最后
     */
    add(child: Element): Group;
    /**
     * 添加子节点在 nextSibling 之前
     */
    addBefore(child: Element, nextSibling: Element): this;
    replace(oldChild: Element, newChild: Element): this;
    replaceAt(child: Element, index: number): this;
    _doAdd(child: Element): void;
    /**
     * Remove child
     * @param child
     */
    remove(child: Element): this;
    /**
     * Remove all children
     */
    removeAll(): this;
    /**
     * 遍历所有子节点
     */
    eachChild<Context>(cb: (this: Context, el: Element, index?: number) => void, context?: Context): this;
    /**
     * Visit all descendants.
     * Return false in callback to stop visit descendants of current node
     */
    traverse<T>(cb: (this: T, el: Element) => boolean | void, context?: T): this;
    addSelfToZr(zr: ZRenderType): void;
    removeSelfFromZr(zr: ZRenderType): void;
    getBoundingRect(includeChildren?: Element[]): BoundingRect;
}
export interface GroupLike extends Element {
    childrenRef(): Element[];
}
export default Group;
