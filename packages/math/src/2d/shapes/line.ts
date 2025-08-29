import { Vector2, Vector2Point } from "../math/vec2";
import { clamp } from '../utils'
import { BoundingRect } from "../math/bounding_rect";


export class Line {
    start = Vector2.default()
    end = Vector2.default()

    constructor(start = Vector2.default(), end = Vector2.default()) {
        this.start.copy(start)
        this.end.copy(end)
    }

    get length(): number {
        return this.end.distance(this.start)
    }
    get lengthSquared(): number {
        return this.end.distanceSquared(this.start)
    }
    clone() {
        return new Line(this.start, this.end)
    }
    copy(other: Line) {
        this.start.copy(other.start)
        this.end.copy(other.end)
    }
    offset(width: number) {
        const delta = this.end.clone().sub(this.start).normalize().perp()
        this.start.add(delta.clone().multiplyScalar(width))
        this.end.add(delta.clone().multiplyScalar(width))
        return this
    }
    getDelta(out = Vector2.default()) {
        return out.subVectors(this.end, this.start)
    }
    getCenter(out = Vector2.default()) {
        return Vector2.lerp(out, this.start, this.end, 0.5)
    }
    distanceTo(x: number, y: number): number {
        const p = Vector2.create(x, y)
        const delta = this.end.clone().sub(this.start)
        const pStart = p.clone().sub(this.start)
        let t = pStart.dot(delta) / delta.dot(delta)
        t = clamp(t, 0, 1)
        return pStart.distance(delta.multiplyScalar(t))
    }
    // 点与直线平方距离
    pointLineSquareDistance(x: number, y: number): number {
        const dx = this.end.x - this.start.x
        const dy = this.end.y - this.start.y
        return (x * dy - y * dx + this.end.x * this.start.y - x * this.end.y - y * this.start.x) / (dx * dx + dy * dy)
    }
    // 点与直线距离
    pointLineDistance(x: number, y: number): number {
        const { A, B, C } = this.toGeneralFormula()
        return Math.abs(A * x + B * y + C) / Math.hypot(A, B)
    }
    // 转一般式
    toGeneralFormula() {
        const ab = this.getDelta()
        return {
            A: ab.y,
            B: -ab.x,
            C: ab.cross(this.start)
        }
    }
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
    intersectionFromLine(line: Line, out = Vector2.default()) {
        const ab = this.getDelta()
        const cd = line.getDelta()
        const det = ab.cross(cd)
        if (det === 0) {
            return null
        }
        const ac = line.start.clone().sub(this.start)
        const u = ac.cross(cd) / det
        const v = ac.cross(ab) / det
        if (u < 0 || u > 1 || v < 0 || v > 1) {
            return null
        }
        out.copy(ab).multiplyScalar(u).add(this.start)
        return out
    }
    intersectionFromCirlce(circle: { cx: number, cy: number, r: number }) {
        const center = Vector2.create(circle.cx, circle.cy)
        const r = circle.r
        const ab = this.getDelta()
        const ac = center.clone().sub(this.start)
        const ab_normalize = ab.clone().normalize()
        // ac投影在ab
        const t = ac.dot(ab) / ab.dot(ab)

        // 投影在ab线段的点
        const proj = ab.clone().multiplyScalar(t).add(this.start)
        // 计算圆心到投影点的平方距离
        const a_len = center.distanceSquared(proj)
        // 通过三角函数,a^2+b^2=c^2
        const b_len = Math.sqrt(r * r - a_len)
        // 在线段上
        const intersections = []
        const start_len=this.start.distanceSquared(center)
        const end_len=this.end.distanceSquared(center)
        const square_radius=circle.r*circle.r
        if(start_len>square_radius&&end_len<=square_radius||start_len<=square_radius&&end_len>square_radius){

             // 如果端点不在圆内,计算线段与圆的交点
            if (start_len>square_radius) {
                intersections.push(ab_normalize.clone().mulScalar(-b_len).add(this.start))
            }
            if (end_len > square_radius) {
                intersections.push(ab_normalize.clone().mulScalar(b_len).add(this.start))
            }
        }

        return intersections
    }
    /**
     * t:长度,d:方向
     * x=p0+dt=bounds.left
     * t=(bounds.left-p0)/d
     * @param box 
     */
    intersectionFromAABB(box:{min:Vector2,max:Vector2}){
        const min=box.min
        const max=box.max
        const d0=this.getDelta()
        const start=this.start,end=this.end
        const t0=Vector2.create(min.x,min.y).sub(start).mulScalar(1/d0.x)
        const t1=Vector2.create(max.x,max.y).sub(start).mulScalar(1/d0.x)
        const t_min=Math.max(Math.min(t0.x,t1.x),Math.min(t0.y,t1.y))
        const t_max=Math.min(Math.max(t0.x,t1.x),Math.max(t0.y,t1.y))
        if(t_min<=t_max&&t_min>=0&&t_min<=1){
            return [this.start.clone().add(d0.mulScalar(t_min)),this.start.clone().add(d0.mulScalar(t_max))]
        }
        return []
    }
    /**
     * y=xk+b b=y-xk
     * 适用所有直线
     * 计算截距:Ax+By+C=0
     * (x-x0)dy-(y-y0)dx=
     * 横截距 a=-C/A 
     * 纵截距 b=-C/B 
    */
    intercept() {
        const ab = this.getDelta()
        const A = ab.y, B = -ab.x, C = ab.cross(this.start);
        return {
            x: -C / A,
            y: -C / B
        }
    }

    contains(x: number, y: number): boolean {
        return this.distanceTo(x, y) < 1e-6
    }

    containsStroke(x: number, y: number, width: number, alignment = 0.5) {
        const halfWidth = width * 0.5
        const offset = (alignment - 0.5) * 2 * halfWidth
        const line = this.clone()
        const dist = line.offset(offset).distanceTo(x, y)
        return dist <= halfWidth;
    }
    getBoundingBox(boundingBox: BoundingRect) {
        let x = Math.min(this.start.x, this.end.x)
        let y = Math.min(this.start.y, this.end.y)
        let w = Math.abs(this.start.x - this.end.x)
        let h = Math.abs(this.start.y - this.end.y)
        boundingBox.fromRect(x, y, w, h);
        return boundingBox;
    }

}