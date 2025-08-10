import { Vector2 } from '../math/vec2';
import { BoundingRect } from '../math/bounding_rect';
export declare class Line {
    start: Vector2;
    end: Vector2;
    constructor(start?: Vector2, end?: Vector2);
    get length(): number;
    get lengthSquared(): number;
    clone(): Line;
    copy(other: Line): void;
    offset(width: number): this;
    getDelta(out?: Vector2): Vector2;
    getCenter(out?: Vector2): Vector2;
    distanceTo(x: number, y: number): number;
    /**
     * 直线参数方程(x,y)=(x0+at, y0+bt) (a,b)是单位向量
     * 线段上的点参数方程:(x,y)=(x0+(x1-x0)t, y0+(y1-y0)t)
     * 直线一般式 Ax+By+C=0
      参数方程转一般式：
      x=x0+(x1-x0)t  t=(x-x0)/(x1-x0)
      y=y0+(y1-y0)t  t=(y-y0)/(y1-y0)
      (x-x0)/(x1-x0)=(y-y0)/(y1-y0)=(x-x0)(y1-y0)=(y-y0)(x1-x0)=(x-x0)dy=(y-y0)dx
      dx=bx-ax dy=by-ay
      (x-x0)dy-(y-y0)dx=0 =dx*x-x0dy-dx*y+y0dx=0

      Ax=dy,By=-dx,C=y0dx-x0dy


     * 线段与线段相交点
     * 法向式:
     * (x-x0)dy=(y-y0)dx
     * Ax+By+C=0
     * Cx+Dy+E=0
     * 克莱姆法则求解：
     * Ax+By=-C
     * Cx+Dy=-E
       d=AD-BC
       u=(BE-DC)/d
       v=(AE-CD)/d
    */
    intersectionFromLine(line: Line, out?: Vector2): Vector2 | null;
    /**
     * y=xk+b b=y-xk
     * 适用所有直线
     * 计算截距:Ax+By+C=0
     * (x-x0)dy-(y-y0)dx=
     * 横截距 a=-C/A
     * 纵截距 b=-C/B
    */
    intercept(): {
        x: number;
        y: number;
    };
    contains(x: number, y: number): boolean;
    containsStroke(x: number, y: number, width: number, alignment?: number): boolean;
    getBoundingBox(boundingBox: BoundingRect): BoundingRect;
}
