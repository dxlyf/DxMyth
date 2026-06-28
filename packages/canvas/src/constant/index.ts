
export const NodeDrityFlag={
    /** 变换（position、rotation、scale、skew、origin 任一变化） */
    None:0,
    Transform: 1 << 0,
    /** 形状（width、height 变化） */
    Shape: 1 << 1,
    /** 样式（fill、stroke 变化） */
    Style: 1 << 2,
    /** 子节点变化 */
    Child: 1 << 3,

    /** 本地边界框变化 */
    LocalBounds: 1 << 4,
    /** 全局边界框变化 */
    GlobalBounds: 1 << 5,
    
    All:(1<<6)-1
}