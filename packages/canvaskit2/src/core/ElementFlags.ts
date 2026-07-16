// ============================================================
// ElementFlags — Fiber-style 更新标记
// ============================================================

export const enum ElementFlag {
    NONE = 0,
    TRANSFORM = 1 << 1,    // 变换矩阵变化（组合）
    SHAPE = 1 << 2,    // 形状变化（顶点数据），影响重排，路径生成，包围盒
    STYLE = 1 << 3,    // 样式变化（颜色、透明度等），影响绘制，apint包围盒
    CHILDREN = 1 << 4,    // 子元素变化（增删改）,重排，元素排序
    BOUNDS = 1 << 6,    // 局部包围盒需要更新
    WORLD_BOUNDS = 1 << 7,    // 世界坐标包围盒需要更新
    PAINT_BOUNDS = 1 << 8,    // 绘制绘制区域包围盒需要更新
    PATH = 1 << 9,    // 路径需要更新
    REPAINT = 1 << 10,   // 需要重新绘制REDRAW
    REFLOW = 1 << 11,   // 需要重新布局
    ALL = (1 << 12) - 1,   // 所有 flag
}

/** flag 依赖定义：key 被标记时自动附加 value(s) */
const FLAG_DEPENDENCIES: Record<number, number> = {
    [ElementFlag.SHAPE]: ElementFlag.PATH | ElementFlag.REPAINT,
    [ElementFlag.STYLE]: ElementFlag.PAINT_BOUNDS | ElementFlag.REPAINT,
    [ElementFlag.TRANSFORM]: ElementFlag.WORLD_BOUNDS | ElementFlag.REPAINT,
    [ElementFlag.PATH]: ElementFlag.BOUNDS | ElementFlag.PAINT_BOUNDS | ElementFlag.REFLOW,
    [ElementFlag.BOUNDS]: ElementFlag.WORLD_BOUNDS,
    [ElementFlag.CHILDREN]: ElementFlag.REFLOW | ElementFlag.REPAINT,
}

/**
 * 注册或覆盖 flag 依赖关系。
 * 当 source 被标记时，target 会自动被标记。
 * 多次调用同 source 会覆盖之前的设定（而非合并）。
 */
export function defineFlagDependency(source: ElementFlag, target: ElementFlag): void {
    FLAG_DEPENDENCIES[source] = target
}

/**
 * 批量注册多个依赖关系。
 * deps 的 key 为源 flag，value 为目标 flag。
 */
export function defineFlagDependencies(deps: Record<number, number>): void {
    for (const k in deps) {
        if (Object.prototype.hasOwnProperty.call(deps, k)) {
            FLAG_DEPENDENCIES[Number(k)] = deps[k]
        }
    }
}

/**
 * 解析单个 flag 的所有依赖（含传递依赖）
 */
function resolveDependencies(flag: number, visited: Set<number> = new Set()): number {
    if (visited.has(flag)) return 0
    visited.add(flag)
    let resolved = flag
    const deps = FLAG_DEPENDENCIES[flag]
    if (deps !== undefined) {
        // 依赖中可能有未标记的位，逐一 resolve
        let remaining = deps
        while (remaining !== 0) {
            const lowestBit = remaining & -remaining
            remaining ^= lowestBit
            resolved |= resolveDependencies(lowestBit, visited)
        }
    }
    return resolved
}

/**
 * 解析多个 flag 组合的所有依赖
 */
function resolveAllDependencies(flags: number): number {
    let resolved = 0
    let remaining = flags
    const visited = new Set<number>()
    while (remaining !== 0) {
        const lowestBit = remaining & -remaining
        remaining ^= lowestBit
        resolved |= resolveDependencies(lowestBit, visited)
    }
    return resolved
}

/**
 * 位掩码标记管理器。
 * 管理当前节点自身标记（flags）与子树归并标记（subtreeFlags）。
 * 支持父子级联：子节点标记新 flag 时自动冒泡到父节点的 subtreeFlags。
 */
export class ElementFlags {
    /** 父级 flags 管理器（设置后 add 会自动冒泡） */
    parent: ElementFlags | null = null

    /** 当前累积的更新标记 */
    flags: ElementFlag = ElementFlag.ALL
    /** 子树中累积的标记（归并自所有子节点） */
    subtreeFlags: ElementFlag = ElementFlag.ALL

    constructor(parent?: ElementFlags) {
        this.parent = parent ?? null
    }

    get allFlags(): ElementFlag {
        return this.flags | this.subtreeFlags
    }
    hasSubtreeFlag(flag: ElementFlag): boolean {
        return (this.subtreeFlags & flag) !== 0
    }

    /** 标记指定 flag — 自动附加依赖标记，并冒泡到父级 */
    add(flag: ElementFlag): void {
        const resolved = resolveAllDependencies(flag)
        const prev = this.flags
        this.flags |= resolved
        this._propagate(prev)
    }

    /** 将当前新增的 flag 冒泡到父级链 */
    private _propagate(prevFlags: number): void {
        // 实际新增的位 = 新值 & ~旧值
        const newBits = this.flags & ~prevFlags
        if (newBits !== 0) {
            let p = this.parent
            while (p) {
                p.subtreeFlags |= newBits
                p = p.parent
            }
        }
    }

    /**
     * 将 allFlags（flags | subtreeFlags）冒泡到指定的父级链
     */
    private _bubbleTo(ancestor: ElementFlags | null): void {
        if (!ancestor) return
        const bits = this.allFlags
        if (bits === 0) return
        let p: ElementFlags | null = ancestor
        while (p) {
            p.subtreeFlags |= bits
            p = p.parent
        }
    }

    /**
     * 将 allFlags 从指定的父级链中移除
     */
    private _unbubbleFrom(ancestor: ElementFlags | null): void {
        if (!ancestor) return
        const bits = this.allFlags
        if (bits === 0) return
        let p: ElementFlags | null = ancestor
        while (p) {
            p.subtreeFlags &= ~bits
            p = p.parent
        }
    }

    /** 设置父级，自动将当前 allFlags 收集到新父级链 */
    setParent(newParent: ElementFlags | null): void {
        if (this.parent === newParent) return
        this.parent = newParent
        // 再冒泡到新父级链
        this._bubbleTo(this.parent)
    }

    /** 移除父级，从旧父级链清理当前 allFlags */
    removeParent(): void {
        this.parent = null
    }

    /** 是否包含指定标记 */
    has(flag: ElementFlag): boolean {
        return (this.flags & flag) !== 0
    }

    /** 子树（含自身）是否有指定标记 */
    include(flag: ElementFlag): boolean {
        return ((this.flags | this.subtreeFlags) & flag) !== 0
    }
    removeSubtreeFlag(flag: ElementFlag): void {
        this.subtreeFlags &= ~flag
    }

    /** 清除指定标记 */
    remove(flag: ElementFlag): void {
        this.flags &= ~flag
    }

    /** 是否有任意标记 */
    get dirty(): boolean {
        return this.flags !== ElementFlag.NONE || this.subtreeFlags !== ElementFlag.NONE
    }

    /** 清除所有标记 */
    clear(): void {
        this.flags = ElementFlag.NONE
        this.subtreeFlags = ElementFlag.NONE
    }
}
