// ============================================================
// scene — 渲染器无关的 2D 显示列表 / 场景图
//   Paint          绘制样式（填充/描边画笔与描边参数，支持 change 监听）
//   Element        显示列表节点基类（身份 / 变换 / 层级 / 事件 / 排序 / 交互）
//   DisplayObject  抽象形状基类（几何 PathBuilder + 样式 Paint）
//   Group          容器节点（子节点包围盒并集 / zIndex 排序）
//   Layer          顶层合成容器（背景 / 裁剪 / 缓存 / 混合模式）
//   Container      场景根容器（场景树顶层，根语义标识）
//   Renderer       渲染器抽象基类（实现 RenderContext 契约 + 尺寸 / 逐帧入口）
//   CanvasRenderer 基于 CanvasRenderingContext2D 的渲染器实现
//
// 继承链：Element → DisplayObject（形状分支）
//         Element → Group → Layer（容器分支）
//         Element → Group → Container（场景根）
//         Renderer → CanvasRenderer（渲染后端分支）
// ============================================================

export * from './Paint'
export * from './Element'
export * from './DisplayObject'
export * from './Group'
export * from './Container'
export * from './Renderer'
export * from './CanvasRenderer'
