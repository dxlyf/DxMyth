export declare const drawDDALine: (x1: number, y1: number, x2: number, y2: number, setPixel: (x: number, y: number) => void) => void;
/**
 * Xiaolin Wu抗锯齿直线算法
 * @param {number} x0 - 起点x坐标
 * @param {number} y0 - 起点y坐标
 * @param {number} x1 - 终点x坐标
 * @param {number} y1 - 终点y坐标
 * @param {function} setPixel - 绘制像素的回调函数 (x, y, alpha) => void
 */
export declare function xiaolinWuLine(x0: number, y0: number, x1: number, y1: number, setPixel: (x: number, y: number, alpha: number) => void): void;
export declare const drawBresenhamLine: (x1: number, y1: number, x2: number, y2: number, setPixel: (x: number, y: number) => void) => void;
export declare const drawDDALineAntialias: (x1: number, y1: number, x2: number, y2: number, setPixel: (x: number, y: number, coverageRate: number) => void) => void;
export declare const drawBresenhamLineAntialias: (x1: number, y1: number, x2: number, y2: number, setPixel: (x: number, y: number, coverageRate: number) => void) => void;
export declare function drawThickLine(x1: number, y1: number, x2: number, y2: number, width: number, setPixel: (x: number, y: number) => void): void;
export type setPixelFn = (x: number, y: number) => unknown;
export type setPixelAlphaFn = (x: number, y: number, alpha: number) => unknown;
/**
 * Line segment rasterisation
 * @param  {number} x0
 * @param  {number} y0
 * @param  {number} x1
 * @param  {number} y1
 * @param  {setPixel} setPixel
 */
export declare function line(x0: number, y0: number, x1: number, y1: number, setPixel: setPixelFn): void;
/**
 * Draw a black (0) anti-aliased line on white (255) background
 * @param  {number} x0
 * @param  {number} y0
 * @param  {number} x1
 * @param  {number} y1
 * @param  {setPixelAlpha} setPixelAA
 * @return {number}
 */
export declare function lineAA(x0: number, y0: number, x1: number, y1: number, setPixelAA: setPixelAlphaFn): void;
/**
 * Plot an anti-aliased line of width wd
 * @param  {number} x0
 * @param  {number} y0
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} wd
 * @param  {setPixel} setPixel
 */
export declare function lineWidth(x0: number, y0: number, x1: number, y1: number, wd: number, setPixel: setPixelAlphaFn): void;
