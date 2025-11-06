import { default as Element } from './Element';
import { default as Displayable } from './graphic/Displayable';
declare function shapeCompareFunc(a: Displayable, b: Displayable): number;
export default class Storage {
    private _roots;
    private _displayList;
    private _displayListLen;
    traverse<T>(cb: (this: T, el: Element) => void, context?: T): void;
    /**
     * get a list of elements to be rendered
     *
     * @param {boolean} update whether to update elements before return
     * @param {DisplayParams} params options
     * @return {Displayable[]} a list of elements
     */
    getDisplayList(update?: boolean, includeIgnore?: boolean): Displayable[];
    /**
     * 更新图形的绘制队列。
     * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
     * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
     */
    updateDisplayList(includeIgnore?: boolean): void;
    private _updateAndAddDisplayable;
    /**
     * 添加图形(Displayable)或者组(Group)到根节点
     */
    addRoot(el: Element): void;
    /**
     * 删除指定的图形(Displayable)或者组(Group)
     * @param el
     */
    delRoot(el: Element | Element[]): void;
    delAllRoots(): void;
    getRoots(): Element<import('./Element').ElementProps>[];
    /**
     * 清空并且释放Storage
     */
    dispose(): void;
    displayableSortFunc: typeof shapeCompareFunc;
}
export {};
