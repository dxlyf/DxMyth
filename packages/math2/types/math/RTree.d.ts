/** 轴对齐包围盒 */
export interface BBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
/**
 * RTree 中存储的元素。
 * 延展的泛型 T 可附加任意业务数据（如元素 ID、引用等）。
 */
export type RTreeItem<T = unknown> = {
    /** 元素包围盒 */
    bbox: BBox;
    /** 业务数据 */
    data: T;
};
/** 查询结果 */
export interface QueryResult<T = unknown> {
    /** 匹配元素 */
    item: RTreeItem<T>;
    /** 查询点在包围盒内的相对位置（仅 pointQuery 时计算） */
    point?: {
        x: number;
        y: number;
    };
}
interface KNNResult<T = unknown> {
    item: RTreeItem<T>;
    distSq: number;
}
export interface RTreeOptions {
    /** 节点最大容量（默认 9），增大 = 查询更快但内存更多 */
    maxEntries?: number;
}
/**
 * RTree 空间索引。
 *
 * @typeParam T - 元素附带的业务数据类型
 *
 * @example
 * ```ts
 * const tree = new RTree<{ id: string }>()
 *
 * // 批量插入
 * tree.bulkInsert([
 *   { bbox: { minX: 0, minY: 0, maxX: 10, maxY: 10 }, data: { id: 'a' } },
 *   { bbox: { minX: 5, minY: 5, maxX: 15, maxY: 15 }, data: { id: 'b' } },
 * ])
 *
 * // 范围查询
 * const results = tree.search({ minX: 0, minY: 0, maxX: 12, maxY: 12 })
 *
 * // 点查询
 * const hit = tree.searchPoint(8, 8)
 *
 * // kNN
 * const nearest = tree.nearest(0, 0, 5)
 * ```
 */
export declare class RTree<T = unknown> {
    private root;
    private _maxEntries;
    private _minEntries;
    private _size;
    constructor(options?: RTreeOptions);
    /** 树中元素总数 */
    get size(): number;
    /** 整棵树的包围盒（所有元素的 MBR） */
    get bbox(): BBox;
    /** 清空树 */
    clear(): void;
    /**
     * 插入单个元素。
     * 复杂度 O(log n)。
     */
    insert(item: RTreeItem<T>): void;
    /**
     * 批量插入（STR 策略）。
     * 比逐个 insert 高效 ~10x，适合初始加载。
     *
     * @param items - 要插入的全部元素
     */
    bulkInsert(items: RTreeItem<T>[]): void;
    /**
     * 删除一个元素（引用相等判断）。
     * 复杂度 O(log n)，可能触发重新平衡。
     *
     * @returns 是否成功删除
     */
    remove(item: RTreeItem<T>): boolean;
    /**
     * 按谓词删除元素。
     *
     * @returns 删除的元素数量
     */
    removeBy(predicate: (item: RTreeItem<T>) => boolean): number;
    /**
     * 范围查询：返回所有与 query 相交的元素。
     * 复杂度 O(log n + k)，k 为结果数。
     */
    search(query: BBox): QueryResult<T>[];
    /**
     * 点查询：返回所有包含点 (px, py) 的元素。
     */
    searchPoint(px: number, py: number): QueryResult<T>[];
    /**
     * 判断是否存在与 query 相交的元素。
     * 比 search().length > 0 更高效（无结果收集开销）。
     */
    collides(query: BBox): boolean;
    /**
     * k 近邻搜索（kNN）。
     *
     * 使用优先级队列 + 最佳优先策略（BFS）。
     *
     * @param k - 返回前 k 个最近元素
     * @param maxDist - 最大搜索半径（Infinity = 不限）
     * @returns 按距离升序排列的最近元素列表
     */
    nearest(px: number, py: number, k?: number, maxDist?: number): KNNResult<T>[];
    /**
     * 查找距离点 (px, py) 最近的单个元素。
     * 比 nearest(px, py, 1) 更快（提前剪枝）。
     */
    nearestOne(px: number, py: number, maxDist?: number): KNNResult<T> | null;
    /**
     * 查找所有完全包含 query 的元素。
     */
    searchContaining(query: BBox): QueryResult<T>[];
    /** 获取所有元素 */
    all(): RTreeItem<T>[];
    /** 遍历所有元素 */
    forEach(fn: (item: RTreeItem<T>) => void): void;
    private _collect;
    /**
     * 树的高度。
     */
    get height(): number;
    /**
     * 树中所有节点的总包围盒面积（衡量空间利用率）。
     * 值越大表示重叠越多、查询效率越差。
     */
    totalNodeArea(): number;
    /**
     * 验证树结构完整性（用于调试）。
     * 返回 null 表示验证通过，否则返回错误描述。
     */
    validate(): string | null;
    private _validateNode;
}
export {};
