import {BoundingRect} from '../math/bounding_rect'
import {Vector2} from '../math/vec2'
const boundingBox=BoundingRect.default()
export class Circle{
    constructor(public cx:number,public cy:number,public radius:number) {

    }
    clone() {
        return new Circle(this.cx,this.cy, this.radius);
    }
    copy(circle:Circle) {
        this.cx=circle.cx;
        this.cy=circle.cy;
        this.radius = circle.radius;
        return this
    }
    setRadius(radius:number) {
        this.radius = radius;
        return this
    }
    setCenter(x:number,y:number) {
        this.cx=x;
        this.cy=y;
        return this;
    }
    /**
     * 计算圆的面积
     *
     * @returns 返回圆的面积
     */
    getArea() {
        return Math.PI * this.radius ** 2;
    }
    /**
     * 计算圆的周长
     *
     * @returns 返回圆的周长
     */
    getCircumference() {
        return 2 * Math.PI * this.radius;
    }
    /**
     *  a = (r₁² - r₂² + d²) / (2d)
     * 圆c0和圆c1的交点，线段p0-p1是两个圆的公共弦。
     * P是两个圆的交点,并且在公共弦上
     * Q是c0c1两个圆心的连线,与交点连成的公共弦线，垂直于公共弦。
     * 设直线三角形:c0QP,c1QP
     * d=|c1-c0|
     * 邻边与对边长度:a=|P-Q| b=|Q-c0|  
     * r0^2=a^2+b^2
     * r1^2=(d-b)^2+a^2
     * r0^2-r1^2=a^2+b^2-((d-b)^2+a^2)
     * r0^2-r1^2=a^2+b^2-d^2+2db-b^2-a^2
       r0^2-r1^2=-d^2+2db
       r0^2-r1^2+d^2=2db
       (r0^2-r1^2+d^2)/2d=b

       方法2:圆1 c0 r0,圆2 c1 r1
       (x-c0.x)^2+(y-c0.y)^2=r0^2
       (x-c1.x)^2+(y-c1.y)^2=r1^2
   
       转换为线性直线方程
        (x-c0.x)^2+(y-c0.y)^2-r0^2=0
        (x-c1.x)^2+(y-c1.y)^2-r1^2=0
        A=2(c1.x-c0.x)
        B=2(c1.y-c0.y)
        C=c0.x^2-c1.x^2+c0.y^2-c1.y^2-r0^2+r1^2
        Ax+By+C=0
        // 要么解直线方程与贺圆的联立方程
        // 要么求c0到直线的距离,如果距离大于r0,则无交点
        // d=|Ax0+By0+C|/sqrt(A^2+B^2)
        // 如果距离等于r0,则相切,如果距离小于r0,则有两个交点
        n0=normalize(c1-c0)
        p=c0+n0*d 
        a=sqrt(r0^2-d^2)
        q=p+ccw(n0)a
     * @param circle 
     * @returns 
     */
    intersectionFromCircle(circle:Circle){
        const c0=Vector2.create(this.cx, this.cy)
        const c1=Vector2.create(circle.cx, circle.cy)
        const delta=Vector2.sub(Vector2.default(),c1, c0)
        const dir=delta.clone().normalize()
        const r0=this.radius
        const r1=circle.radius
        const len=delta.magnitude()
      //  const middle_t0=(r0-r1+len)/(2*len)
        if(len<=r0+r1) {
            const rootAxis_len=(r0*r0-r1*r1+len*len)/(2*len)
        
            const rootAxis_center=dir.clone().multiplyScalar(rootAxis_len).add(c0)
            const h=r0*r0-rootAxis_len*rootAxis_len
            const p0=dir.clone().ccw().multiplyScalar(h).add(rootAxis_center)
            const p1=dir.clone().cw().multiplyScalar(h).add(rootAxis_center)
            return [p0, p1]
        }
        return []
    }
    distanceTo(x:number,y:number) {
        return Math.sqrt((x - this.cx) ** 2 + (y - this.cy) ** 2);
    }
    contains(x:number,y:number) {
        return this.distanceTo(x,y) <= this.radius;
    }
    containsStroke(x:number,y:number,width:number,alignment:number=0.5) {
        const dist=this.distanceTo(x,y);
        const halfWidth=width*0.5
        const offset=(alignment-0.5)*2*halfWidth
        const radius=this.radius+offset
        return Math.abs(dist-radius)<=halfWidth;
    }
    containsBoundingRect(x:number,y:number) {
        boundingBox.fromCircle(this.cx,this.cy, this.radius);
        return boundingBox.containsXY(x,y)
    }
    getBoundingBox(boundingBox:BoundingRect) {
        boundingBox.fromCircle(this.cx,this.cy, this.radius);
        return boundingBox;
    }
}