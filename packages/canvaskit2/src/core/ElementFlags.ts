// ============================================================
// ElementFlags — Fiber-style 更新标记
// ============================================================

export const enum ElementFlag {
    NONE            = 0,
    TRANSFORM       = 1 << 1,    // 变换矩阵变化（组合）
    SHAPE           = 1 << 2,    // 形状变化（顶点数据）
    STYLE           = 1 << 3,    // 样式变化（颜色、透明度等）
    CHILDREN        = 1 << 4,    // 子元素变化（增删改）
    VISIBILITY      = 1 << 5,    // 可见性变化
    LOCAL_BOUNDS    = 1 << 6,    // 局部包围盒需要更新
    WORLD_BOUNDS    = 1 << 7,   // 世界包围盒需要更新
    RENDER_DATA     = 1 << 8,   // 渲染数据需要更新
    ALL             = (1 << 9)-1,        // 全部标记
}

/**
 * 位掩码标记管理器。
 * 管理当前节点自身标记（flags）与子树归并标记（subtreeFlags）。
 */
export class ElementFlags {
    /** 当前累积的更新标记 */
    value: ElementFlag = ElementFlag.NONE
    /** 子树中累积的标记（归并自所有子节点） */
    subtree: ElementFlag = ElementFlag.NONE
    parent?:ElementFlags|null
    constructor(){
        this.value=ElementFlag.NONE
    }
    addSubtreeFlag(flag: ElementFlag): void {
        this.subtree |= flag
        if(this.parent){
            this.parent.addSubtreeFlag(this.subtree)
        }
    }
    removeSubtreeFlag(flag: ElementFlag): void {
        this.subtree &= ~flag
    }
    hasSubtreeFlag(flag: ElementFlag): boolean {
        return (this.subtree & flag) !== 0
    }
    /** 标记指定 flag */
    add(flag: ElementFlag): void {
        this.value |= flag
        if(this.parent){
            this.parent.addSubtreeFlag(this.value)
        }
    }

    /** 是否包含指定标记 */
    has(flag: ElementFlag): boolean {
        return (this.value & flag) !== 0
    }

    /** 子树（含自身）是否有指定标记 */
    include(flag: ElementFlag): boolean {
        return ((this.value | this.subtree) & flag) !== 0
    }

    /** 清除指定标记 */
    remove(flag: ElementFlag): void {
        this.value &= ~flag
    }

    /** 是否有任意标记 */
    get dirty(): boolean {
        return this.value !== ElementFlag.NONE || this.subtree !== ElementFlag.NONE
    }

    /** 清除所有标记 */
    clear(): void {
        this.value = ElementFlag.NONE
        this.subtree = ElementFlag.NONE
    }
}
