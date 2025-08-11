
export enum DirtyFlag{
    None=0, // 无变化
    Shape=1<<0,// 形状发生变化
    Style=1<<1,// 样式发生变化
    Transform=1<<2,// 矩阵发生变化
    Children=1<<3, // 子元素发生变化
}