
export enum ElementEffectFlag{
    None=0, // 无变化
    Shape=1<<0,// 形状发生变化
    Style=1<<1,// 样式发生变化
    Layout=1<<2,// 布局发生变化，如z-index
    Transform=1<<3,// 矩阵发生变化
    Children=1<<4, // 子元素发生变化
}

