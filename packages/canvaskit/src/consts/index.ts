
export const NodeEffectFlags={
   None:0, // 无变化
   Matrix:1<<1, // 矩阵变化
   Child:1<<2,// 子节点变化,子节点列列，发生新增，删除，移动等变化
   Shape:1<<3,// 形状变化，shape属性发生变化
   Style:1<<4,// 样式变化，样式属性发生变化
   Reflow:1<<5,// 层级变化，属性zindex或子节点层级变化
   Repaint:1<<6,// 绘制变化，绘制属性发生变化,如矩阵，样式，形状等变化
}