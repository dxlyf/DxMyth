// ============================================================
// QuadTree — 四叉树空间索引
// ============================================================
//
// 用于二维轴对齐包围盒（AABB）的空间划分，支持：
//   - 插入 / 删除元素
//   - 矩形范围查询、点查询
//   - 遍历全部元素
//
// 与「把跨子区的元素同时写入多个子树」的实现不同，这里每个元素只归属一个节点：
// 元素会下放到能完整包含它的最深子节点，跨子区的元素则保留在当前节点。
// 这样查询结果天然无重复，也不会因大对象导致内存膨胀。
//
// 注意：根节点范围应尽量覆盖全部数据；超出根范围的对象会一直保留在根节点上，
// 结果是正确的（查询时仍按元素自身包围盒过滤），但没有空间划分收益。

/** 轴对齐包围盒：左上角坐标 + 尺寸 */
export interface QuadTreeBounds {
    x: number
    y: number
    width: number
    height: number
}

/** 四叉树选项 */
export interface QuadTreeOptions {
    /** 单节点元素数超过该值时分裂，默认 10 */
    maxObjects?: number
    /** 最大深度（根为 0），默认 6 */
    maxDepth?: number
}

/** a 与 b 是否相交（含边界接触） */
function intersects(a: QuadTreeBounds, b: QuadTreeBounds): boolean {
    return a.x <= b.x + b.width && a.x + a.width >= b.x
        && a.y <= b.y + b.height && a.y + a.height >= b.y
}

/** 四叉树节点（内部） */
class QuadTreeNode<T extends QuadTreeBounds> {
    x: number
    y: number
    width: number
    height: number
    depth: number
    /** 当前节点直接持有的元素 */
    objects: T[] = []
    /** 四个子节点：左上、右上、左下、右下；未分裂时为 null */
    children: QuadTreeNode<T>[] | null = null

    constructor(x: number, y: number, width: number, height: number, depth: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.depth = depth
    }
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
export class QuadTree<T extends QuadTreeBounds = QuadTreeBounds> {
    private readonly maxObjects: number
    private readonly maxDepth: number
    private readonly root: QuadTreeNode<T>
    private _size = 0

    /**
     * @param bounds  根节点覆盖的矩形范围
     * @param options 分裂阈值与最大深度
     */
    constructor(bounds: QuadTreeBounds, options: QuadTreeOptions = {}) {
        this.maxObjects = Math.max(1, options.maxObjects ?? 10)
        this.maxDepth = Math.max(0, options.maxDepth ?? 6)
        this.root = new QuadTreeNode(
            bounds.x, bounds.y,
            Math.max(0, bounds.width), Math.max(0, bounds.height),
            0,
        )
    }

    /** 已插入的元素总数 */
    get size(): number {
        return this._size
    }

    isEmpty(): boolean {
        return this._size === 0
    }

    /** 根节点覆盖范围 */
    get bounds(): QuadTreeBounds {
        return { x: this.root.x, y: this.root.y, width: this.root.width, height: this.root.height }
    }

    /** 清空全部元素，保留根范围 */
    clear(): this {
        this.root.objects.length = 0
        this.root.children = null
        this._size = 0
        return this
    }

    /** 插入一个元素 */
    insert(item: T): this {
        this._insert(this.root, item)
        this._size++
        return this
    }

    /** 批量插入 */
    insertAll(items: Iterable<T>): this {
        for (const item of items) this.insert(item)
        return this
    }

    /**
     * 查询与给定矩形相交的全部元素。
     * @param out 可选输出数组，复用以减少分配
     */
    search(bounds: QuadTreeBounds, out: T[] = []): T[] {
        this._search(this.root, bounds, out)
        return out
    }

    /** 查询包含给定点的全部元素 */
    searchPoint(x: number, y: number, out: T[] = []): T[] {
        return this.search({ x, y, width: 0, height: 0 }, out)
    }

    /** 删除一个元素（按引用匹配）；不存在时返回 false */
    remove(item: T): boolean {
        if (this._remove(this.root, item)) {
            this._size--
            return true
        }
        return false
    }

    /** 深度优先遍历全部元素 */
    forEach(callback: (item: T) => void): void {
        this._forEach(this.root, callback)
    }

    /** 收集全部元素 */
    toArray(): T[] {
        const result: T[] = []
        this._forEach(this.root, (item) => result.push(item))
        return result
    }

    // ---- 内部实现 ----

    /** 元素完全落入的子节点下标；跨子区或无法判定时返回 -1 */
    private _childIndex(node: QuadTreeNode<T>, item: QuadTreeBounds): number {
        const midX = node.x + node.width * 0.5
        const midY = node.y + node.height * 0.5
        const left = item.x + item.width <= midX
        const right = item.x >= midX
        const top = item.y + item.height <= midY
        const bottom = item.y >= midY
        if (left && top) return 0
        if (right && top) return 1
        if (left && bottom) return 2
        if (right && bottom) return 3
        return -1
    }

    private _insert(node: QuadTreeNode<T>, item: T): void {
        // 有子节点且能完整落入某个子节点时继续下放
        if (node.children) {
            const index = this._childIndex(node, item)
            if (index !== -1) {
                this._insert(node.children[index], item)
                return
            }
        }
        node.objects.push(item)
        // 元素超限且仍可细分时分裂
        if (!node.children && node.depth < this.maxDepth && node.width > 0 && node.height > 0
            && node.objects.length > this.maxObjects) {
            this._split(node)
        }
    }

    /** 把当前节点四等分，并把能完整落入子节点的元素下放 */
    private _split(node: QuadTreeNode<T>): void {
        const halfWidth = node.width * 0.5
        const halfHeight = node.height * 0.5
        const depth = node.depth + 1
        const children = [
            new QuadTreeNode(node.x, node.y, halfWidth, halfHeight, depth),
            new QuadTreeNode(node.x + halfWidth, node.y, halfWidth, halfHeight, depth),
            new QuadTreeNode(node.x, node.y + halfHeight, halfWidth, halfHeight, depth),
            new QuadTreeNode(node.x + halfWidth, node.y + halfHeight, halfWidth, halfHeight, depth),
        ]
        node.children = children as QuadTreeNode<T>[]

        const objects = node.objects
        node.objects = []
        for (let i = 0; i < objects.length; i++) {
            const item = objects[i]
            const index = this._childIndex(node, item)
            if (index === -1) node.objects.push(item)
            else children[index].objects.push(item)
        }
    }

    private _search(node: QuadTreeNode<T>, bounds: QuadTreeBounds, out: T[]): void {
        const objects = node.objects
        for (let i = 0; i < objects.length; i++) {
            if (intersects(objects[i], bounds)) out.push(objects[i])
        }
        const children = node.children
        if (!children) return
        // 子节点中的元素必然完整位于该子节点内，不相交即可整体跳过
        for (let i = 0; i < 4; i++) {
            if (intersects(children[i], bounds)) {
                this._search(children[i], bounds, out)
            }
        }
    }

    private _remove(node: QuadTreeNode<T>, item: T): boolean {
        const index = node.objects.indexOf(item)
        if (index !== -1) {
            node.objects.splice(index, 1)
            return true
        }
        const children = node.children
        if (children) {
            // 元素只会存在于能完整包含它的子节点路径上
            const childIndex = this._childIndex(node, item)
            if (childIndex !== -1) return this._remove(children[childIndex], item)
        }
        return false
    }

    private _forEach(node: QuadTreeNode<T>, callback: (item: T) => void): void {
        const objects = node.objects
        for (let i = 0; i < objects.length; i++) callback(objects[i])
        const children = node.children
        if (children) {
            for (let i = 0; i < 4; i++) this._forEach(children[i], callback)
        }
    }
}
