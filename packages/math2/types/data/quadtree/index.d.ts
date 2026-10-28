/** 轴对齐包围盒：左上角坐标 + 尺寸 */
export interface QuadTreeBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
/** 四叉树选项 */
export interface QuadTreeOptions {
    /** 单节点元素数超过该值时分裂，默认 10 */
    maxObjects?: number;
    /** 最大深度（根为 0），默认 6 */
    maxDepth?: number;
}
/**
 * 四叉树。
 *
 * 元素只需满足 QuadTreeBounds（即带 x/y/width/height），业务数据可直接挂在元素上。
 *
 * ```ts
 * const tree = new QuadTree<{ x: number, y: number, width: number, height: number, id: string }>(
 *     { x: 0, y: 0, width: 1000, height: 1000 }
 * )
 * tree.insert({ x: 10, y: 10, width: 20, height: 20, id: 'a' })
 * const hits = tree.search({ x: 0, y: 0, width: 100, height: 100 })
 * ```
 */
export declare class QuadTree<T extends QuadTreeBounds = QuadTreeBounds> {
    private readonly maxObjects;
    private readonly maxDepth;
    private readonly root;
    private _size;
    /**
     * @param bounds  根节点覆盖的矩形范围
     * @param options 分裂阈值与最大深度
     */
    constructor(bounds: QuadTreeBounds, options?: QuadTreeOptions);
    /** 已插入的元素总数 */
    get size(): number;
    isEmpty(): boolean;
    /** 根节点覆盖范围 */
    get bounds(): QuadTreeBounds;
    /** 清空全部元素，保留根范围 */
    clear(): this;
    /** 插入一个元素 */
    insert(item: T): this;
    /** 批量插入 */
    insertAll(items: Iterable<T>): this;
    /**
     * 查询与给定矩形相交的全部元素。
     * @param out 可选输出数组，复用以减少分配
     */
    search(bounds: QuadTreeBounds, out?: T[]): T[];
    /** 查询包含给定点的全部元素 */
    searchPoint(x: number, y: number, out?: T[]): T[];
    /** 删除一个元素（按引用匹配）；不存在时返回 false */
    remove(item: T): boolean;
    /** 深度优先遍历全部元素 */
    forEach(callback: (item: T) => void): void;
    /** 收集全部元素 */
    toArray(): T[];
    /** 元素完全落入的子节点下标；跨子区或无法判定时返回 -1 */
    private _childIndex;
    private _insert;
    /** 把当前节点四等分，并把能完整落入子节点的元素下放 */
    private _split;
    private _search;
    private _remove;
    private _forEach;
}
