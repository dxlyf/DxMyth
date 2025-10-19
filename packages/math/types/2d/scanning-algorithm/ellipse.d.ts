export declare const drawMidpointEllipse: (cx: number, cy: number, a: number, b: number, setPixel: (x: number, y: number) => void) => void;
export declare const drawMidpointEllipseAntialias: (cx: number, cy: number, a: number, b: number, setPixel: (x: number, y: number, alpha: number) => void) => void;
export declare const drawBresenhamEllipse: (cx: number, cy: number, a: number, b: number, setPixel: (x: number, y: number) => void) => void;
/**
 * 绘制抗锯齿椭圆
 * 采用类似 Wu 抗锯齿直线的思想：对于第一象限，
 * 以 x（区域1）或 y（区域2）为自变量，计算理想边界位置，
 * 然后利用相邻像素的覆盖率 (coverageRate, 取值范围 [0,1]) 进行绘制，
 * 最后利用椭圆的对称性绘制四个象限。
 *
 * cx, cy: 椭圆中心
 * a, b: 分别为椭圆在 x、y 方向的半轴长度
 * setPixel(x, y, coverageRate): 绘制像素的回调函数
 */
export declare const drawBresenhamEllipseAntialias: (cx: number, cy: number, a: number, b: number, setPixel: (x: number, y: number, coverageRate: number) => void) => void;
