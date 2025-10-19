/***
 * 1. 参数方程法（笛卡尔坐标系）
实现原理：
根据圆的参数方程 x = r·cosθ, y = r·sinθ 生成离散点。通过均匀采样角度θ（0到2π）计算坐标点，适用于任意精度需求。
TypeScript实现：
*/
export declare const drawParametricCircle: (cx: number, cy: number, r: number, setPixel: (x: number, y: number) => void) => void;
/**
 * 2. 中点画圆算法
核心机制：
基于八分对称性，每次计算一个八分圆弧并通过对称绘制全圆。利用决策参数判断下一个像素的位置。

误差决策公式：

d = 1 - r
ΔE = 3
ΔSE = 5 - 2r
TypeScript实现：
 */
export declare const drawMidpointCircle: (cx: number, cy: number, r: number, setPixel: (x: number, y: number) => void) => void;
/**
 *
3. Bresenham画圆算法
优化特性：
仅使用整数运算，通过递推公式消除乘除法，相比中点算法减少50%计算量。

递推公式：

Δ = 3 - 2r
当Δ <0时选择E点，Δ +=4x+6
否则选择SE点，Δ +=4(x-y)+10
 */
export declare const drawBresenhamCircle: (cx: number, cy: number, r: number, setPixel: (x: number, y: number) => void) => void;
export declare const drawMidpointCircleAntialias: (cx: number, cy: number, r: number, setPixel: (x: number, y: number, coverageRate: number) => void) => void;
export declare const drawBresenhamCircleAntialias: (cx: number, cy: number, r: number, setPixel: (x: number, y: number, coverageRate: number) => void) => void;
export declare const drawAntialiasedCircle: (cx: number, cy: number, r: number, setPixel: (x: number, y: number, alpha: number) => void) => void;
