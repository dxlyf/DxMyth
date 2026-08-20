// ============================================================
// curve-path — 曲线与路径模块（移植自 three.js extras）
// 命名空间导出以避免与 math2 其他模块的 ShapePath/Curve 冲突
// ============================================================

export { Curve } from './Curve'
export type { CurveJSON, CurvePoint } from './Curve'
export { CurvePath } from './CurvePath'
export { Path } from './Path'
export { Shape } from './Shape'
export { ShapePath } from './ShapePath'
export { ShapeUtils } from './ShapeUtils'
export { CatmullRom, QuadraticBezier, CubicBezier } from './Interpolations'
export { generateUUID } from './Utils'
export * from './curves'
