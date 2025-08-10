/**
 * 中心点坐标转终点坐标
 * @param cx 中心点x坐标。
 * @param cy 中心点y坐标。
 * @param rx x轴方向的半径长度。
 * @param ry y轴方向的半径长度。
 * @param phi 椭圆的旋转角度，以弧度为单位。默认为0。
 * @param startAngle 起始角度，以弧度为单位。默认为0。
 * @param deltaAngle 终止角度，以弧度为单位。默认为2π（即一个完整的圆）。

 * @returns
 */
export declare function center_to_endpoint(cx: number, cy: number, rx: number, ry: number, phi: number, startAngle: number, deltaAngle: number): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    fa: number;
    fs: number;
};
/**
 * 端点坐标转中心点坐标
 * @param x1 起点坐标x
 * @param y1 起点坐标y
 * @param x2 终点坐标x
 * @param y2 终点坐标y
 * @param fa 大弧标志，如果选择跨度小于或等于 180 度的弧，则为 0，如果选择跨度大于 180 度的弧，则为 1。
 * @param fs 扫描标志，如果连接中心和圆弧的线扫描的角度减小，则为 0，如果扫描的角度增加，则为 1。
 * @param rx 椭圆弧的x轴半径。
 * @param ry ry 椭圆弧的y轴半径。
 * @param phi 椭圆的旋转角度，以弧度为单位。默认为0。
 * @returns
 */
export declare function endpoint_to_center(x1: number, y1: number, x2: number, y2: number, fa: boolean | number, fs: boolean | number, rx: number, ry: number, phi: number): {
    rx: number;
    ry: number;
    cx: number;
    cy: number;
    theta1: number;
    theta2: number;
    dtheta: number;
};
/***
 * 点在椭圆上xAxisRotation处，再旋转至theta处，返回该点坐标
 */
export declare function pointOnEllipse(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, theta: number): {
    x: number;
    y: number;
};
/**
 * 四分之一椭圆弧转贝塞尔曲线段
 * @param cx
 * @param cy
 * @param rx
 * @param ry
 * @param theta1
 * @param theta2
 */
export declare function quarterArcToCubicBezier(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, theta1: number, theta2: number): number[];
/**
 * svg A命令的椭圆弧转细分成贝塞尔曲线

 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param _rx
 * @param _ry
 * @param xAxisRotation
 * @param largeArcFlag
 * @param sweepFlag
 */
export declare function ellipseArcToCubicBezier(x1: number, y1: number, x2: number, y2: number, _rx: number, _ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, callback?: (x0: number, y0: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number, index: number) => void): number[];
