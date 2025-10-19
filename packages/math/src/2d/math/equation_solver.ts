// EquationSolver.ts
/*
第三方nerdamer
// ax+(bx-ax)t-dx-(ex-dx)u=0
// ay+(by-ay)t-dy-(ey-dy)u=0
 const eq1 = `${dy0}x-${dx0}y+${c0}=0`;
const eq2 =  `${dy1}x-${dx1}y+${c1}=0`;
const eq3=`${dx0}t-${dx1}u+${a[0]-c[0]}=0`
const eq4=`${dy0}t-${dy1}u+${a[1]-c[1]}=0`
// 求解方程组：将两个方程用'='连接，并指定求解变量为 x 和 y
const solutions = nerdamer.solveEquations([eq1, eq2], ['x', 'y']);
const solutions2 = nerdamer.solveEquations([eq3, eq4], ['t', 'u']);

const x0=a[0]+(b[0]-a[0])*solutions2[0][1]
const y0=a[1]+(b[1]-a[1])*solutions2[0][1]
*/
/**
 * 
 * 通用方程求解器，支持求解常见的代数方程：
 * - 一元一次
 * - 一元二次
 * - 一元三次
 * - 一元四次（Ferrari 法）
 * - 任意阶多项式（数值法）
 * - 二元一次（联立）
 * - 特例：二元二次（圆与直线）
 */
export class EquationSolver {

    static EPS = 1e-10;


    /**
     * 求解一元一次方程 ax + b = 0
     * @param a 系数 a
     * @param b 常数 b
     * @returns 解 x 或 null（无解）
     */
    static solveLinear1(a: number, b: number): number | null {
        if (Math.abs(a) < this.EPS) return Math.abs(b) < this.EPS ? Infinity : null;
        return -b / a;
    }

    /**
    * 求解一元二次方程 ax^2 + bx + c = 0
    * @param a 系数 a
    * @param b 系数 b
    * @param c 常数 c
    * @returns 解的数组（0、1 或 2 个实数解）
    */
    static solveQuadratic1(a: number, b: number, c: number): number[] {
        if (Math.abs(a) < this.EPS) return this.solveLinear1(b, c) !== null ? [this.solveLinear1(b, c)!] : [];
        const delta = b * b - 4 * a * c;
        if (delta > this.EPS) {
            const sqrtD = Math.sqrt(delta);
            return [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)];
        } else if (Math.abs(delta) < this.EPS) {
            return [-b / (2 * a)];
        } else {
            return []; // 无实数根
        }
    }

    /**
     * 求解二元一次联立方程组：
     * a1 x + b1 y = c1
     * a2 x + b2 y = c2
     * @returns 解对象 { x, y } 或 null（无解或无唯一解）
     */
    static solveLinear2(
        a1: number, b1: number, c1: number,
        a2: number, b2: number, c2: number
    ): { x: number, y: number } | null {
        const D = a1 * b2 - a2 * b1;
        if (D === 0) return null;
        const Dx = c1 * b2 - c2 * b1;
        const Dy = a1 * c2 - a2 * c1;
        return {
            x: Dx / D,
            y: Dy / D
        };
    }

    /**
 * 求解一元三次方程 ax^3 + bx^2 + cx + d = 0（实数根）
 * 使用卡尔丹公式 Cardano’s method
 * @returns 实数根数组（最多 3 个）
 */
    static solveCubic1(a: number, b: number, c: number, d: number): number[] {
        if (Math.abs(a) < this.EPS) return this.solveQuadratic1(b, c, d); // 退化为一元二次

        // 归一化系数：x^3 + A x^2 + B x + C = 0
        const A = b / a;
        const B = c / a;
        const C = d / a;

        // 减去A/3：x = t - A/3，方程化为 t^3 + p t + q = 0
        const p = B - (A * A) / 3;
        const q = (2 * A * A * A) / 27 - (A * B) / 3 + C;
        const offset = -A / 3;

        // 判别式
        const discriminant = (q * q) / 4 + (p * p * p) / 27;
        const roots: number[] = [];

        if (discriminant > this.EPS) {
            // 1 个实根
            const sqrtD = Math.sqrt(discriminant);
            const u = Math.cbrt(-q / 2 + sqrtD);
            const v = Math.cbrt(-q / 2 - sqrtD);
            roots.push(u + v + offset);
        } else if (Math.abs(discriminant) < this.EPS) {
            // 判别式为 0：3 重根或 1 个单根 + 1 个双根
            const u = Math.cbrt(-q / 2);
            roots.push(2 * u + offset, -u + offset);
        } else {
            // 判别式 < 0：3 个不相等的实根
            // const r = Math.sqrt(-p * p * p / 27); // 注意负号包裹整个 p^3
            const phi = Math.acos(-q / (2 * Math.sqrt(-p * p * p / 27)));
            const t = 2 * Math.sqrt(-p / 3);
            roots.push(
                t * Math.cos(phi / 3) + offset,
                t * Math.cos((phi + 2 * Math.PI) / 3) + offset,
                t * Math.cos((phi + 4 * Math.PI) / 3) + offset
            );
        }

        return roots;
    }


    /**
     * 求解二元二次联立方程（支持特例，如一个是圆，一个是直线）
     * 
     * 示例：
     * x^2 + y^2 = r^2
     * y = kx + b
     * 
     * @returns 交点数组（最多两个）
     */
    static solveCircleLineIntersection(
        r: number,
        k: number,
        b: number
    ): { x: number, y: number }[] {
        // 带入圆方程
        // x^2 + (kx + b)^2 = r^2
        // 解一元二次方程
        const A = 1 + k * k;
        const B = 2 * k * b;
        const C = b * b - r * r;
        const xs = this.solveQuadratic1(A, B, C);
        return xs.map(x => ({ x, y: k * x + b }));
    }

    /**
     * 求解一元二次方程（含复数根）ax^2 + bx + c = 0
     * @param a 系数 a
     * @param b 系数 b
     * @param c 常数 c
     * @returns 解的复数数组（re, im）
     */
    static solveQuadraticComplex(a: number, b: number, c: number): { re: number, im: number }[] {
        if (Math.abs(a) < this.EPS) return [{ re: -c / b, im: 0 }];
        const delta = b * b - 4 * a * c;
        if (delta >= 0) {
            const sqrtD = Math.sqrt(delta);
            return [
                { re: (-b - sqrtD) / (2 * a), im: 0 },
                { re: (-b + sqrtD) / (2 * a), im: 0 }
            ];
        } else {
            const sqrtD = Math.sqrt(-delta);
            return [
                { re: -b / (2 * a), im: -sqrtD / (2 * a) },
                { re: -b / (2 * a), im: sqrtD / (2 * a) }
            ];
        }
    }
    /**
     * 求解一元四次方程 ax^4 + bx^3 + cx^2 + dx + e = 0（Ferrari 法）
     * @param a,b,c,d,e 系数
     * @returns 实数根数组
     */
    static solveQuartic1(a: number, b: number, c: number, d: number, e: number): number[] {
        if (Math.abs(a) < this.EPS) return this.solveCubic1(b, c, d, e);
        b /= a; c /= a; d /= a; e /= a;
        const bb = b * b;
        const p = -3 * bb / 8 + c;
        const q = bb * b / 8 - b * c / 2 + d;
        const r = -3 * bb * bb / 256 + bb * c / 16 - b * d / 4 + e;
        const roots: number[] = [];
        if (Math.abs(q) < this.EPS) {
            const sq = this.solveQuadratic1(1, p, r);
            for (const z of sq) {
                if (z < -this.EPS) continue;
                const sqrtZ = Math.sqrt(z);
                roots.push(-b / 4 + sqrtZ, -b / 4 - sqrtZ);
            }
        } else {
            const cubic = this.solveCubic1(1, 2 * p, p * p - 4 * r, -q * q);
            const z = cubic.find(z => z > -this.EPS);
            if (z === undefined) return [];
            const u = Math.sqrt(z);
            const v = q / (2 * u);
            const w = p + z;
            const sq1 = this.solveQuadratic1(1, u, (w - v) / 2);
            const sq2 = this.solveQuadratic1(1, -u, (w + v) / 2);
            for (const x of [...sq1, ...sq2]) roots.push(x - b / 4);
        }
        return roots.filter(x => Math.abs(a * x ** 4 + b * x ** 3 + c * x ** 2 + d * x + e) < 1e-6);
    }

    /**
    * 求解任意多项式实根（牛顿法迭代）
    * @param coeffs 多项式系数数组，从最高次到最低次
    * @param guess 初始猜测值
    * @returns 实根数组
    */
    static solvePolynomialNumeric(coeffs: number[], guess = 0, maxIter = 100, tol = 1e-8): number[] {
        const n = coeffs.length - 1;
        const f = (x: number) => coeffs.reduce((sum, c, i) => sum + c * x ** (n - i), 0);
        const df = (x: number) => coeffs.slice(0, -1).reduce((sum, c, i) => sum + c * (n - i) * x ** (n - i - 1), 0);
        const roots: number[] = [];
        let poly = [...coeffs];
        while (poly.length > 2) {
            let x = guess;
            for (let i = 0; i < maxIter; i++) {
                const fx = f(x);
                const dfx = df(x);
                if (Math.abs(fx) < tol) break;
                if (Math.abs(dfx) < this.EPS) x += 1;
                else x = x - fx / dfx;
            }
            roots.push(x);
            const newPoly: number[] = [];
            let rem = 0;
            for (let i = 0; i < poly.length - 1; i++) {
                const coeff = (i === 0 ? poly[i] : poly[i] + rem * x);
                newPoly.push(coeff);
                rem = coeff;
            }
            poly = newPoly;
        }
        if (poly.length === 2) roots.push(-poly[1] / poly[0]);
        return roots;
    }
    /**
     * 拉格朗日插值：给定 (xi, yi) 点，构造插值多项式在 x 处的值
     * @param points 点数组 [{x,y}]
     * @param x 要插值的位置
     * @returns 插值函数值 f(x)
     */
    static lagrangeInterpolation(points: { x: number, y: number }[], x: number): number {
        let result = 0;
        const n = points.length;
        for (let i = 0; i < n; i++) {
            let term = points[i].y;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x - points[j].x) / (points[i].x - points[j].x);
                }
            }
            result += term;
        }
        return result;
    }
}
type Point = { x: number, y: number }



type LineLike={
    start: Point,
    end: Point
}
type CircleLike={
    center: Point,
    radius: number
}

// 一元二次方程的求根公式
function solveQuadraticRoot(a:number,b:number,c:number) {
    const delta=b*b-4*a*c
    if(delta<0) return [] // 无解
    else if(delta==0) return [-b/(2*a)] // 一个解
    else {
        // 两个不同的实数解
        let x1=-b+Math.sqrt(delta)/(2*a)
        let x2=-b-Math.sqrt(delta)/(2*a)
        return [x1,x2]
    }
}

/**
 * 直线与圆的交点
 * line:Ax+By+C=0
 * y=-Ax/B-C/B
 * circle: (x-cx)^2+(y-cy)^2=r^2
 * 代入:(x-cx)^2+((-Ax/B-C/B)-cy)^2=r^2 组成一元二次方程
 * x^2-2cxx+cx^2+((-Ax/B-C/B)(-Ax/B-C/B)-2cy(-Ax/B-C/B)+cy^2)
    x^2-2cxx+cx^2+(A^2x^2/B^2+2ACx/B^2+C^2/B^2+2cyAx/B+2cyC/B+cy^2)
    
 * @param line 
 * @param circle 
 * @returns 
 */

export class LineEquation {
     static create(a:number,b:number,c:number){
        return new this(a,b,c)
     }
     static fromLine(start:Point,end:Point){
        const dx=end.x-start.x
        const dy=end.y-start.y
        const A=dy
        const B=-dx
        const C=end.x*start.y-end.y*start.x //dx*line.start.y+dy*line.start.x
        return this.create(A,B,C)
     }
     /**
     * (x-x0)(y1-y0)=(y-y0)(x1-x0)
     * 
     * 创建：通过两点 (x0, y0) 和 (x1, y1) 定义直线
     */
     static fromTwoPoints(p0: Point, p1: Point): LineEquation {
        const A = p0.y - p1.y;
        const B = p1.x - p0.x;
        const C = p0.x * p1.y - p1.x * p0.y;
        return this.create(A, B, C);
    }
    /**
     * 创建：通过斜率和截距 y = m*x + b
     */
    static fromSlopeIntercept(m: number, b: number): LineEquation {
        // 转换为一般式： -m*x + y - b = 0
        return this.create(-m, 1, -b);
    }

    /**
     * 创建：通过点和斜率
     */
    static fromPointSlope(p: Point, m: number): LineEquation {
        // y - y0 = m(x - x0) => mx - y + (y0 - m*x0) = 0
        return this.create(-m, 1, m * p.x - p.y);
    }
    /**
     * 创建：截距式（x/a + y/b = 1）
     * @param a x轴截距 ≠ 0
     * @param b y轴截距 ≠ 0
     */
    static fromIntercepts(a: number, b: number): LineEquation {
        // x/a + y/b = 1 => b*x + a*y - a*b = 0
        if (a === 0 || b === 0) throw new Error("a and b must be non-zero");
        const A = b;
        const B = a;
        const C = -a * b;
        return this.create(A, B, C);
    }

    /**
     * 创建：点向式，给定点 p 和方向向量 v
     * @param p 点 p(x0, y0)
     * @param v 方向向量 v(vx, vy)
     */
    static fromPointDirection(p: Point, v: Point): LineEquation {
        // 方向向量 (vx, vy) 垂直的法向量为 (-vy, vx)
        const A = -v.y;
        const B = v.x;
        const C = -(A * p.x + B * p.y);
        return this.create(A, B, C);
    }

    /**
     * 创建：法向式，通过一个法向量和一点
     * @param n 法向量 n(A, B)
     * @param p 点 p(x0, y0)
     */
    static fromNormalThroughPoint(n: Point, p: Point): LineEquation {
        // 法向式：A(x - x0) + B(y - y0) = 0 → Ax + By + C = 0
        const A = n.x;
        const B = n.y;
        const C = -(A * p.x + B * p.y);
        return this.create(A, B, C);
    }

    /**
     * 创建：交点式，给定 x、y 轴交点
     * 即与 x 轴交于 (a, 0)，与 y 轴交于 (0, b)
     */
    static fromXYIntercepts(a: number, b: number): LineEquation {
        return this.fromIntercepts(a, b); // 与截距式相同
    }

    /**
     * 求两直线的交点（无交点返回 null）
     */
    static intersection(l1: LineEquation, l2: LineEquation): Point | null {
        const D = l1.A * l2.B - l2.A * l1.B;
        if (Math.abs(D) < 1e-8) return null; // 平行或重合

        const Dx = -l1.C * l2.B + l2.C * l1.B;
        const Dy = -l1.A * l2.C + l2.A * l1.C;

        return {
            x: Dx / D,
            y: Dy / D
        };
    }


    A: number;
    B: number;
    C: number;

    /**
     * 通过一般式 Ax + By + C = 0 构造直线
     */
    constructor(A: number, B: number, C: number) {
        this.A = A;
        this.B = B;
        this.C = C;
    }

   
    /**
     * 获取斜率（若为垂直线返回 Infinity）
     */
    getSlope(): number {
        if (this.B === 0) return Infinity; // 垂直线
        return -this.A / this.B;
    }

    /**
     * 获取 y 截距（若为垂直线返回 null）
     */
    getYIntercept(): number | null {
        if (this.B === 0) return null;
        return -this.C / this.B;
    }

    /**
     * 计算 y = f(x)，即给定 x 计算 y 值（前提是 B ≠ 0）
     */
    getY(x: number): number | null {
        if (this.B === 0) return null;
        return (-this.A * x - this.C) / this.B;
    }

    /**
     * 计算 x = f(y)，即给定 y 计算 x 值（前提是 A ≠ 0）
     */
    getX(y: number): number | null {
        if (this.A === 0) return null;
        return (-this.B * y - this.C) / this.A;
    }

    /**
     * 判断点是否在直线上
     */
    isPointOnLine(p: Point, epsilon = 1e-8): boolean {
        return Math.abs(this.A * p.x + this.B * p.y + this.C) < epsilon;
    }

    /**
     * 计算点到直线的距离
     */
    distanceToPoint(p: Point): number {
        return Math.abs(this.A * p.x + this.B * p.y + this.C) / Math.sqrt(this.A ** 2 + this.B ** 2);
    }

    /**
     * 构造与当前直线平行，经过给定点的直线
     */
    parallelThrough(p: Point): LineEquation {
        const C = -(this.A * p.x + this.B * p.y);
        return (this.constructor as typeof LineEquation).create(this.A, this.B, C);
    }

    /**
     * 构造与当前直线垂直，经过给定点的直线
     */
    perpendicularThrough(p: Point): LineEquation {
        const A = this.B;
        const B = -this.A;
        const C = -(A * p.x + B * p.y);
        return  (this.constructor as typeof LineEquation).create(A, B, C);
    }
    /***
     * 参数方程转代数方程求交点
     * 克莱姆法求相交
     * x0=Ax+ (Bx -Ax)t x1=Cx+ (Dx -Cx)u
     * y0=Ay+ (By -Ay)t y1=Cy+ (Dy -Cy)u
     * 
        Ax+ (Bx -Ax)t=Cx+ (Dx -Cx)u = (Bx -Ax)t-(Dx -Cx)u=Cx-Ax
        Ay+ (By -Ay)t=Cy+ (Dy -Cy)u = (By -Ay)t-(Dy -Cy)u=Cy-Ay

        A=(Bx -Ax)  B=-(Dx -Cx)  C=Cx-Ax
        E=(By -Ay)  F=-(Dy -Cy)  G=Cy-Ay

        det=A*F-B*E
        t=(C*F-B*G)/det        
     */
    getLineIntersection(line: LineLike) {
        const a=line.start
        const b=line.end
        const c=line.start
        const d=line.end
        const A=b.x-a.x
        const B=-(d.x-c.x)
        const C=c.x-a.x
        const E=b.y-a.y
        const F=-(d.y-c.y)
        const G=c.y-a.y

        const det=A*F-B*E
        if(det===0){
            return
        }
        const t=(C*F-B*G)/det
        const u=(A*G-C*E)/det
        if(t>=0&&t<=1&&u>=0&&u<=1){
            return {
                x:a.x+(b.x-a.x)*t,
                y:a.y+(b.y-a.y)*t
            }
        }
    }
    // 一般式求相交
    getGeneralLineIntersection(line: LineLike) {
        const [A1,B1,C1]=this.toArray()
        const [A2,B2,C2]=LineEquation.fromLine(line.start,line.end).toArray()
        // 不相交
        if(A1*B2-B1*A2===0){
            return
        }
        if(B1==0&&A1!==0){
            const x=-C1/A1
            const y=(-A2*x-C2)/B2
            return {
                x,
                y
            }
        }
        if(B2==0&&A2!==0){
            const x=-C2/A2
            const y=(-A1*x-C1)/B1
            return {
                x,
                y
            }
        }
        const x=(B2*C1-B1*C2)/(A2*B1-A1*B2)
        const y=(-A1*x-C1)/B1
        return {x,y}
    }
     getCircleIntersection(line: LineLike, circle: CircleLike) {
        const [A1,B1,C1]=[this.A,this.B,this.C]
        let cx=circle.center.x,cy=circle.center.y,r=circle.radius
    
        let A2=A1*A1+B1*B1
        let B2=2*(-B1*B1*cx+A1*C1+cy*A1*B1)
        let C2=cx*cx*B1*B1+C1*C1+2*cy*B1*C1+B1*B1*cy*cy-B1*B1*r*r
        let x0=solveQuadraticRoot(A2,B2,C2)
        return x0.map(x=>{
            let y=(-A1*x-C1)/B1
            return {x,y}
        })
    }
    toArray(){
        return [this.A,this.B,this.C]
    }
    /**
     * 将直线转换为字符串形式 Ax + By + C = 0
     */
    toString(): string {
        return `${this.A}x + ${this.B}y + ${this.C} = 0`;
    }
}

export class CircleEquation{

    static create(cx:number,cy:number,r:number){
        return new CircleEquation(cx,cy,r)
    }
    // 一般式: x² + y² + Dx + Ey + F = 0
    static fromGeneral(D:number,E:number,F:number){
        return new CircleEquation(D/-2,E/-2,Math.sqrt(F))
    }
    cx:number
    cy:number
    r:number
    constructor(cx:number,cy:number,r:number){
        this.cx=cx
        this.cy=cy
        this.r=r
    }
    isPointOnCircle(p:Point,elipson=1e-6):boolean{
        return Math.pow(p.x-this.cx,2)+Math.pow(p.y-this.cy,2)<=Math.pow(this.r,2)
    }
    toGeneral(){
        let D=-2*this.cx
        let E=-2*this.cy
        let F=this.cx*this.cx+this.cy*this.cy-this.r*this.r
        return [D,E,F]
    }
    circleIntersection(circle:CircleEquation){
        const [D1,E1,F1]=this.toGeneral() // 圆的一般方程
        const [D2,E2,F2]=circle.toGeneral()
        //转为直线方程:Ax+By+C=0
        let A=D1-D2,B=E1-E2,C=F1-F2
        // 圆标准方程:(x-cx)^2+(y-cy)^2=r^2 
        // y=(-Ax/B-C/B) 代入标准方程:(x-cx)^2+((-Ax/B-C/B)-cy)^2=r^2 
        // 得到一元二次方程:Ax²+Bx+C=0
        // 求根式解一元二次方程:-b+sqrt(b²-4ac)/2a 或 -b-sqrt(b²-4ac)/2a
        let BB=B*B,AA=A*A,CC=C*C
        let A2=BB+AA
        let B2=2*(-this.cx*BB+A*C+this.cy*A*B)
        let C2=(this.cx**2)*BB+CC+2*this.cy*B*C+BB*(this.cy**2)-BB*(this.r**2)
        return solveQuadraticRoot(A2,B2,C2).map(x=>{
            return {
                x,
                y:(-A*x-C)/B
            }
        })
    }
    
}


export class EllipseEquation{

    static create(cx:number,cy:number,r:number){
        return new CircleEquation(cx,cy,r)
    }
    // 一般式: Ax² +Bxy+ Cy² + Dx + Ey + F = 0
    static fromGeneral(D:number,E:number,F:number){
        return new CircleEquation(D/-2,E/-2,Math.sqrt(F))
    }
    cx:number
    cy:number
    r:number
    constructor(cx:number,cy:number,r:number){
        this.cx=cx
        this.cy=cy
        this.r=r
    }
    isPointOnCircle(p:Point,elipson=1e-6):boolean{
        return Math.pow(p.x-this.cx,2)+Math.pow(p.y-this.cy,2)<=Math.pow(this.r,2)
    }
    toGeneral(){
        let D=-2*this.cx
        let E=-2*this.cy
        let F=this.cx*this.cx+this.cy*this.cy-this.r*this.r
        return [D,E,F]
    }
    circleIntersection(circle:CircleEquation){
        const [D1,E1,F1]=this.toGeneral() // 圆的一般方程
        const [D2,E2,F2]=circle.toGeneral()
        //转为直线方程:Ax+By+C=0
        let A=D1-D2,B=E1-E2,C=F1-F2
        // 圆标准方程:(x-cx)^2+(y-cy)^2=r^2 
        // y=(-Ax/B-C/B) 代入标准方程:(x-cx)^2+((-Ax/B-C/B)-cy)^2=r^2 
        // 得到一元二次方程:Ax²+Bx+C=0
        // 求根式解一元二次方程:-b+sqrt(b²-4ac)/2a 或 -b-sqrt(b²-4ac)/2a
        let BB=B*B,AA=A*A,CC=C*C
        let A2=BB+AA
        let B2=2*(-this.cx*BB+A*C+this.cy*A*B)
        let C2=(this.cx**2)*BB+CC+2*this.cy*B*C+BB*(this.cy**2)-BB*(this.r**2)
        return solveQuadraticRoot(A2,B2,C2).map(x=>{
            return {
                x,
                y:(-A*x-C)/B
            }
        })
    }
    
}