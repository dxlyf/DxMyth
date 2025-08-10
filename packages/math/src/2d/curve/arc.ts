
import { Vector2 } from '../math/vec2'


const dot = (u: number[], v: number[]) => {
    return u[0] * v[0] + u[1] * v[1]
}
const cross = (u: number[], v: number[]) => {
    return u[0] * v[1] - u[1] * v[0]
}
const angleTo = (u: number[], v: number[]) => {
    return Math.atan2(cross(u, v), dot(u, v));
}



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
export function center_to_endpoint(cx: number, cy: number, rx: number, ry: number, phi: number, startAngle: number, deltaAngle: number) {

    let PI2 = Math.PI * 2
    // 避免精度误差，由于js精度不够，所以添加一个近似最小误差
    if (deltaAngle === 0) {
        deltaAngle = 1e-6
    }
    if (deltaAngle === PI2) {
        deltaAngle = PI2 - 1e-6
    }
    let cos_phi = Math.cos(phi), sin_phi = Math.sin(phi)
    let x1 = cos_phi * rx * Math.cos(startAngle) - sin_phi * ry * Math.sin(startAngle) + cx;
    let y1 = sin_phi * rx * Math.cos(startAngle) + cos_phi * ry * Math.sin(startAngle) + cy;

    let x2 = cos_phi * rx * Math.cos(startAngle + deltaAngle) - sin_phi * ry * Math.sin(startAngle + deltaAngle) + cx;
    let y2 = sin_phi * rx * Math.cos(startAngle + deltaAngle) + cos_phi * ry * Math.sin(startAngle + deltaAngle) + cy;

    let fa = Math.abs(deltaAngle) > Math.PI ? 1 : 0
    let fs = deltaAngle > 0 ? 1 : 0
    return {
        x1,
        y1,
        x2,
        y2,
        fa,//是大弧标志，如果选择跨度小于或等于 180 度的弧，则为 0，如果选择跨度大于 180 度的弧，则为 1。
        fs //是扫描标志，如果连接中心和圆弧的线扫描的角度减小，则为 0，如果扫描的角度增加，则为 1。
    }
}

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
export function endpoint_to_center(x1: number, y1: number, x2: number, y2: number, fa: boolean | number, fs: boolean | number, rx: number, ry: number, phi: number) {
    let phi_cos = Math.cos(phi), phi_sin = Math.sin(phi)
    let xp1 = phi_cos * (x1 - x2) / 2 + phi_sin * (y1 - y2) / 2
    let yp1 = -phi_sin * (x1 - x2) / 2 + phi_cos * (y1 - y2) / 2

    //  修正半径
    let lambda = (xp1 * xp1) / (rx * rx) + (yp1 * yp1) / (ry * ry);
    if (lambda > 1) {
        lambda = Math.sqrt(lambda);
        rx *= lambda;
        ry *= lambda;
    }
    let fsign = fa !== fs ? 1 : -1
    let c1 = (rx * rx * ry * ry - rx * rx * yp1 * yp1 - ry * ry * xp1 * xp1) / (rx * rx * yp1 * yp1 + ry * ry * xp1 * xp1);
    if (c1 < 0) {	// because of floating point inaccuracies, c1 can be -epsilon.
        c1 = 0;
    } else {
        c1 = Math.sqrt(c1);
    }
    let cxp1 = fsign * c1 * (rx * yp1 / ry)
    let cyp1 = fsign * c1 * (-ry * xp1 / rx)

    let cx = phi_cos * cxp1 - phi_sin * cyp1 + (x1 + x2) / 2
    let cy = phi_sin * cxp1 + phi_cos * cyp1 + (y1 + y2) / 2


    let theta1 = angleTo([1, 0], [(xp1 - cxp1) / rx, (yp1 - cyp1) / ry])
    let dtheta = angleTo([(xp1 - cxp1) / rx, (yp1 - cyp1) / ry], [(-xp1 - cxp1) / rx, (-yp1 - cyp1) / ry])

    if (!fs && dtheta > 0) {
        dtheta -= Math.PI * 2
    }
    else if (fs && dtheta < 0) {
        dtheta += Math.PI * 2
    }
    let theta2 = theta1 + dtheta
    return {
        rx,
        ry,
        cx,
        cy,
        theta1,// 是拉伸和旋转操作之前椭圆弧的起始角度。
        theta2,// 是拉伸和旋转操作之前椭圆弧的终止角度。
        dtheta // 是这两个角度之间的差值。
    }
}

/***
 * 点在椭圆上xAxisRotation处，再旋转至theta处，返回该点坐标
 */
export function pointOnEllipse(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, theta: number) {
    const cos = Math.cos(theta) * rx
    const sin = Math.sin(theta) * ry
    const cosRx = Math.cos(xAxisRotation)
    const sinRx = Math.sin(xAxisRotation)
    return {
        x: cx + cosRx * cos - sinRx * sin,
        y: cy + sinRx * cos + cosRx * sin,
    }
}

/**
 * 四分之一椭圆弧转贝塞尔曲线段
 * @param cx 
 * @param cy 
 * @param rx 
 * @param ry 
 * @param theta1 
 * @param theta2 
 */
export function quarterArcToCubicBezier(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, theta1: number, theta2: number) {

    const deltaAngle = theta2 - theta1;
    const kappa = 4 / 3 * Math.tan(deltaAngle / 4);
    // 单位圆
    const p0 = Vector2.fromRotation(theta1)
    const p3 = Vector2.fromRotation(theta2)
    const p1 = Vector2.fromPoint(p0)
    const p2 = Vector2.fromPoint(p3)

    // 根据椭圆弧公式与贝赛尔曲线公式，推导楕圆B'(0)=R'(0)
    // 3(p1-p0)=delta*(-sin*rx,cos*ry), p1=p0-(delta/3)*(-sin*rx,cos*ry)  kappa=(delta/3) 
    // kappa= 4 / 3 * Math.tan(deltaAngle / 4);更精确

    p1.translate(-kappa * p0.y, kappa * p0.x);
    p2.translate(kappa * p3.y, -kappa * p3.x);

    p0.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)
    p1.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)
    p2.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)
    p3.scale(rx, ry).rotate(xAxisRotation).translate(cx, cy)

    return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]
}


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
export function ellipseArcToCubicBezier(x1: number, y1: number, x2: number, y2: number,
    _rx: number, _ry: number, xAxisRotation: number,
    largeArcFlag: boolean, sweepFlag: boolean, callback?: (x0: number, y0: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number, index: number) => void) {
    const { cx, cy, theta1, dtheta, rx, ry } = endpoint_to_center(x1, y1, x2, y2, largeArcFlag, sweepFlag, _rx, _ry, xAxisRotation)

    // 将弧划分为若干段，每段弧跨度不超过 PI/2
    const segments = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
    const delta = dtheta / segments;
    const curves: number[] = [];
    let thetaStart = theta1;

    for (let i = 0; i < segments; i++) {
        const thetaEnd = thetaStart + delta;
        let [x0, y0, cp1x, cp1y, cp2x, cp2y, x, y] = quarterArcToCubicBezier(cx, cy, rx, ry, xAxisRotation, thetaStart, thetaEnd)
        callback?.(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y, i)
        thetaStart = thetaEnd
        curves.push(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y)
    }
    return curves
}