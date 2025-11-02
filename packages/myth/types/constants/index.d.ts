export declare enum ElementEffectFlag {
    None = 0,// 无变化
    Shape = 1,// 形状发生变化
    Style = 2,// 样式发生变化
    Layout = 4,// 布局发生变化，如z-index
    Transform = 8,// 矩阵发生变化
    Children = 16
}
