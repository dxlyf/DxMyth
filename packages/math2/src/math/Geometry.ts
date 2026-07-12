// import { Vector2Like } from "./Vector2";

// // ============ 基础类型定义 ============
// interface Vector2 {
//     x: number;
//     y: number;
// }

// interface Rect {
//     x: number;      // 左上角 x
//     y: number;      // 左上角 y
//     width: number;
//     height: number;
// }

// // 矩阵类（简化版，仅用于演示）
// class Matrix3x3 {
//     private m: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    
//     translate(dx: number, dy: number): this {
//         this.m[2] += dx;
//         this.m[5] += dy;
//         return this;
//     }
    
//     rotate(angle: number): this {
//         const cos = Math.cos(angle);
//         const sin = Math.sin(angle);
//         // 简化：仅2x2旋转部分
//         const a = this.m[0], b = this.m[1];
//         const c = this.m[3], d = this.m[4];
//         this.m[0] = a * cos - b * sin;
//         this.m[1] = a * sin + b * cos;
//         this.m[3] = c * cos - d * sin;
//         this.m[4] = c * sin + d * cos;
//         return this;
//     }
    
//     // 应用变换到点
//     transformPoint(p: Vector2): Vector2 {
//         return {
//             x: this.m[0] * p.x + this.m[1] * p.y + this.m[2],
//             y: this.m[3] * p.x + this.m[4] * p.y + this.m[5]
//         };
//     }
    
//     // 应用变换到矩形（返回新的轴对齐包围盒）
//     transformRect(rect: Rect): Rect {
//         const corners = [
//             { x: rect.x, y: rect.y },
//             { x: rect.x + rect.width, y: rect.y },
//             { x: rect.x, y: rect.y + rect.height },
//             { x: rect.x + rect.width, y: rect.y + rect.height }
//         ];
        
//         const transformed = corners.map(p => this.transformPoint(p));
        
//         const minX = Math.min(...transformed.map(p => p.x));
//         const minY = Math.min(...transformed.map(p => p.y));
//         const maxX = Math.max(...transformed.map(p => p.x));
//         const maxY = Math.max(...transformed.map(p => p.y));
        
//         return {
//             x: minX,
//             y: minY,
//             width: maxX - minX,
//             height: maxY - minY
//         };
//     }
// }


// // ============ Element 基类 ============
// abstract class Element {
//     // 变换矩阵（相对于父节点）
//     protected localTransform: Matrix3x3 = new Matrix3x3();
    
//     // 父节点引用
//     protected parent: Group | null = null;
    
//     // 脏标记
//     protected isDirty: boolean = true;
    
//     // 缓存的局部包围盒（在局部坐标系中）
//     protected cachedLocalBounds: Rect | null = null;
    
//     // 缓存的世界包围盒（在世界坐标系中）
//     protected cachedWorldBounds: Rect | null = null;
    
//     // 标记为脏（当位置、大小、旋转改变时调用）
//     markDirty(): void {
//         this.isDirty = true;
//         this.cachedLocalBounds = null;
//         this.cachedWorldBounds = null;
        
//         // 向上传播脏标记到父节点
//         if (this.parent) {
//             this.parent.markDirty();
//         }
//     }
    
//     // 设置位置
//     setPosition(x: number, y: number): void {
//         // 实际应用中需要重新构建变换矩阵
//         // 简化：直接平移
//         this.localTransform = new Matrix3x3().translate(x, y);
//         this.markDirty();
//     }
    
//     // 设置旋转
//     setRotation(angle: number): void {
//         this.localTransform.rotate(angle);
//         this.markDirty();
//     }
    
//     // 获取局部包围盒（抽象方法）
//     abstract getLocalBounds(): Rect;
    
//     // 获取世界包围盒
//     getWorldBounds(): Rect {
//         // 如果缓存有效，直接返回
//         if (!this.isDirty && this.cachedWorldBounds) {
//             return this.cachedWorldBounds;
//         }
        
//         // 计算局部包围盒
//         const local = this.getLocalBounds();
        
//         // 应用变换到世界空间
//         this.cachedWorldBounds = this.localTransform.transformRect(local);
        
//         // 如果有父节点，需要叠加父节点的变换
//         if (this.parent) {
//             const parentWorld = this.parent.getWorldBounds();
//             // 注意：这里用父节点的变换矩阵来转换当前的世界包围盒
//             // 实际实现中应该用矩阵乘法，这里简化演示
//             const parentTransform = this.parent.getLocalTransform();
//             this.cachedWorldBounds = parentTransform.transformRect(this.cachedWorldBounds);
//         }
        
//         return this.cachedWorldBounds;
//     }
    
//     // 获取局部变换矩阵（供子类或父类使用）
//     getLocalTransform(): Matrix3x3 {
//         return this.localTransform;
//     }
    
//     // 父子关系管理
//     setParent(parent: Group | null): void {
//         this.parent = parent;
//         this.markDirty();
//     }
    
//     getParent(): Group | null {
//         return this.parent;
//     }
// }


// /**
//  * 边界样式配置
//  */
// export interface StrokeStyle {
//     color: string;
//     width: number;
//     lineJoin: 'miter' | 'round' | 'bevel';
//     lineCap: 'butt' | 'round' | 'square';
//     miterLimit?: number; // 默认10
//     dashArray?: number[]; // 虚线样式
//     dashOffset?: number;
// }

// /**
//  * 默认边界样式
//  */
// export const DEFAULT_STROKE_STYLE: StrokeStyle = {
//     color: '#000000',
//     width: 1,
//     lineJoin: 'miter',
//     lineCap: 'butt',
//     miterLimit: 10
// };

// // ============ 几何工具函数 ============

// /**
//  * 向量工具
//  */
// export class VectorUtils {
//     /**
//      * 计算两点距离
//      */
//     static distance(p1: Vector2Like, p2: Vector2Like): number {
//         const dx = p2.x - p1.x;
//         const dy = p2.y - p1.y;
//         return Math.sqrt(dx * dx + dy * dy);
//     }
    
//     /**
//      * 计算点到线段的最短距离
//      */
//     static pointToSegmentDistance(p: Vector2Like, a: Vector2Like, b: Vector2Like): number {
//         const dx = b.x - a.x;
//         const dy = b.y - a.y;
//         const lenSq = dx * dx + dy * dy;
        
//         if (lenSq === 0) {
//             return this.distance(p, a);
//         }
        
//         // 计算投影参数 t
//         let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
//         t = Math.max(0, Math.min(1, t));
        
//         // 投影点
//         const projX = a.x + t * dx;
//         const projY = a.y + t * dy;
        
//         return this.distance(p, { x: projX, y: projY });
//     }
    
//     /**
//      * 计算点到折线的距离
//      */
//     static pointToPolylineDistance(p: Vector2Like, points: Vector2Like[]): number {
//         if (points.length < 2) return Infinity;
        
//         let minDist = Infinity;
//         for (let i = 0; i < points.length - 1; i++) {
//             const dist = this.pointToSegmentDistance(p, points[i], points[i + 1]);
//             if (dist < minDist) minDist = dist;
//         }
//         return minDist;
//     }
    
//     /**
//      * 判断点是否在线段上（考虑线宽）
//      */
//     static isPointOnSegment(p: Vector2Like, a: Vector2Like, b: Vector2Like, lineWidth: number): boolean {
//         const dist = this.pointToSegmentDistance(p, a, b);
//         return dist <= lineWidth / 2;
//     }
    
//     /**
//      * 计算两条线段的交点
//      */
//     static segmentIntersection(a1: Vector2Like, a2: Vector2Like, b1: Vector2Like, b2: Vector2Like): Vector2Like | null {
//         const d1x = a2.x - a1.x;
//         const d1y = a2.y - a1.y;
//         const d2x = b2.x - b1.x;
//         const d2y = b2.y - b1.y;
        
//         const denom = d1x * d2y - d1y * d2x;
//         if (Math.abs(denom) < 1e-10) return null;
        
//         const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
//         const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;
        
//         if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
//             return {
//                 x: a1.x + t * d1x,
//                 y: a1.y + t * d1y
//             };
//         }
//         return null;
//     }
// }

// // ============ 边界检测器 ============

// /**
//  * 边界检测器 - 处理各种形状的边界检测
//  */
// export class BoundaryDetector {
//     /**
//      * 检测点是否在形状的边界上
//      */
//     static isPointOnShapeBoundary(
//         point: Vector2Like,
//         shape: Shape,
//         strokeStyle: StrokeStyle,
//         worldToScreen: (p: Vector2Like) => Vector2Like = (p) => p
//     ): boolean {
//         // 将点转换到世界坐标（如果是屏幕坐标）
//         // 这里假设传入的已经是世界坐标
        
//         if (shape instanceof Circle) {
//             return this.isPointOnCircleBoundary(point, shape, strokeStyle);
//         } else if (shape instanceof RectShape) {
//             return this.isPointOnRectBoundary(point, shape, strokeStyle);
//         } else if (shape instanceof PathShape) {
//             return this.isPointOnPathBoundary(point, shape, strokeStyle);
//         } else if (shape instanceof PolygonShape) {
//             return this.isPointOnPolygonBoundary(point, shape, strokeStyle);
//         }
        
//         return false;
//     }
    
//     /**
//      * 检测点是否在圆形边界上
//      */
//     static isPointOnCircleBoundary(
//         point: Vector2Like,
//         circle: Circle,
//         strokeStyle: StrokeStyle
//     ): boolean {
//         const center = circle.getCenter();
//         const radius = circle.getRadius();
//         const halfWidth = strokeStyle.width / 2;
        
//         // 计算到圆心的距离
//         const dist = VectorUtils.distance(point, center);
        
//         // 在圆环内（考虑线宽）
//         const innerRadius = radius - halfWidth;
//         const outerRadius = radius + halfWidth;
        
//         return dist >= innerRadius && dist <= outerRadius;
//     }
    
//     /**
//      * 检测点是否在矩形边界上
//      */
//     static isPointOnRectBoundary(
//         point: Vector2Like,
//         rect: RectShape,
//         strokeStyle: StrokeStyle
//     ): boolean {
//         const halfWidth = strokeStyle.width / 2;
//         const corners = rect.getCorners();
//         const lineJoin = strokeStyle.lineJoin;
//         const miterLimit = strokeStyle.miterLimit || 10;
        
//         // 检查点是否在任何一条边上
//         for (let i = 0; i < corners.length; i++) {
//             const a = corners[i];
//             const b = corners[(i + 1) % corners.length];
            
//             if (VectorUtils.isPointOnSegment(point, a, b, strokeStyle.width)) {
//                 return true;
//             }
//         }
        
//         // 检查顶点区域（lineJoin 效果）
//         if (lineJoin === 'round') {
//             // 圆形顶点：检测点是否在顶点的圆内
//             for (const corner of corners) {
//                 const dist = VectorUtils.distance(point, corner);
//                 if (dist <= halfWidth) {
//                     return true;
//                 }
//             }
//         } else if (lineJoin === 'miter') {
//             // 尖角顶点：检测点是否在顶点附近的三角形区域
//             for (let i = 0; i < corners.length; i++) {
//                 const prev = corners[(i - 1 + corners.length) % corners.length];
//                 const curr = corners[i];
//                 const next = corners[(i + 1) % corners.length];
                
//                 if (this.isPointNearMiter(point, prev, curr, next, halfWidth, miterLimit)) {
//                     return true;
//                 }
//             }
//         } else if (lineJoin === 'bevel') {
//             // 斜角顶点：检测点是否在顶点附近的四边形区域
//             for (let i = 0; i < corners.length; i++) {
//                 const prev = corners[(i - 1 + corners.length) % corners.length];
//                 const curr = corners[i];
//                 const next = corners[(i + 1) % corners.length];
                
//                 if (this.isPointNearBevel(point, prev, curr, next, halfWidth)) {
//                     return true;
//                 }
//             }
//         }
        
//         return false;
//     }
    
//     /**
//      * 检测点是否在路径边界上
//      */
//     static isPointOnPathBoundary(
//         point: Vector2Like,
//         path: PathShape,
//         strokeStyle: StrokeStyle
//     ): boolean {
//         const segments = path.getSegments();
//         const halfWidth = strokeStyle.width / 2;
//         const lineJoin = strokeStyle.lineJoin;
//         const lineCap = strokeStyle.lineCap;
//         const miterLimit = strokeStyle.miterLimit || 10;
        
//         // 收集所有路径点
//         const points = path.getPoints();
        
//         // 检查每个线段
//         for (let i = 0; i < segments.length; i++) {
//             const seg = segments[i];
//             const start = seg.start;
//             const end = seg.end;
            
//             // 检查点是否在线段上
//             if (VectorUtils.isPointOnSegment(point, start, end, strokeStyle.width)) {
//                 return true;
//             }
//         }
        
//         // 处理 lineJoin（连接点）
//         if (lineJoin === 'round') {
//             for (const p of points) {
//                 if (VectorUtils.distance(point, p) <= halfWidth) {
//                     return true;
//                 }
//             }
//         } else if (lineJoin === 'miter') {
//             for (let i = 1; i < points.length - 1; i++) {
//                 const prev = points[i - 1];
//                 const curr = points[i];
//                 const next = points[i + 1];
                
//                 if (this.isPointNearMiter(point, prev, curr, next, halfWidth, miterLimit)) {
//                     return true;
//                 }
//             }
//         } else if (lineJoin === 'bevel') {
//             for (let i = 1; i < points.length - 1; i++) {
//                 const prev = points[i - 1];
//                 const curr = points[i];
//                 const next = points[i + 1];
                
//                 if (this.isPointNearBevel(point, prev, curr, next, halfWidth)) {
//                     return true;
//                 }
//             }
//         }
        
//         // 处理 lineCap（端点）
//         if (points.length > 0) {
//             const first = points[0];
//             const last = points[points.length - 1];
            
//             if (lineCap === 'round' || lineCap === 'square') {
//                 // 圆形端点：检测点是否在端点圆内
//                 for (const endpoint of [first, last]) {
//                     const dist = VectorUtils.distance(point, endpoint);
//                     if (dist <= halfWidth) {
//                         return true;
//                     }
                    
//                     // square cap: 在端点添加矩形
//                     if (lineCap === 'square' && points.length > 1) {
//                         const next = points[1];
//                         const angle = Math.atan2(next.y - endpoint.y, next.x - endpoint.x);
//                         if (this.isPointOnSquareCap(point, endpoint, angle, halfWidth)) {
//                             return true;
//                         }
//                     }
//                 }
//             }
            
//             // butt cap: 默认就是线段检测，不需要额外处理
//         }
        
//         return false;
//     }
    
//     /**
//      * 检测点是否在多边形边界上
//      */
//     static isPointOnPolygonBoundary(
//         point: Vector2Like,
//         polygon: PolygonShape,
//         strokeStyle: StrokeStyle
//     ): boolean {
//         // 多边形与矩形类似，但顶点更多
//         const vertices = polygon.getVertices();
//         const halfWidth = strokeStyle.width / 2;
//         const lineJoin = strokeStyle.lineJoin;
//         const miterLimit = strokeStyle.miterLimit || 10;
        
//         // 检查边
//         for (let i = 0; i < vertices.length; i++) {
//             const a = vertices[i];
//             const b = vertices[(i + 1) % vertices.length];
            
//             if (VectorUtils.isPointOnSegment(point, a, b, strokeStyle.width)) {
//                 return true;
//             }
//         }
        
//         // 检查顶点（lineJoin 效果）
//         if (lineJoin === 'round') {
//             for (const v of vertices) {
//                 if (VectorUtils.distance(point, v) <= halfWidth) {
//                     return true;
//                 }
//             }
//         } else if (lineJoin === 'miter') {
//             for (let i = 0; i < vertices.length; i++) {
//                 const prev = vertices[(i - 1 + vertices.length) % vertices.length];
//                 const curr = vertices[i];
//                 const next = vertices[(i + 1) % vertices.length];
                
//                 if (this.isPointNearMiter(point, prev, curr, next, halfWidth, miterLimit)) {
//                     return true;
//                 }
//             }
//         } else if (lineJoin === 'bevel') {
//             for (let i = 0; i < vertices.length; i++) {
//                 const prev = vertices[(i - 1 + vertices.length) % vertices.length];
//                 const curr = vertices[i];
//                 const next = vertices[(i + 1) % vertices.length];
                
//                 if (this.isPointNearBevel(point, prev, curr, next, halfWidth)) {
//                     return true;
//                 }
//             }
//         }
        
//         return false;
//     }
    
//     // ============ lineJoin 辅助方法 ============
    
//     /**
//      * 检测点是否在 miter 连接区域
//      */
//     private static isPointNearMiter(
//         point: Vector2Like,
//         prev: Vector2Like,
//         curr: Vector2Like,
//         next: Vector2Like,
//         halfWidth: number,
//         miterLimit: number
//     ): boolean {
//         // 计算两条边的方向
//         const dir1 = this.normalize({ x: curr.x - prev.x, y: curr.y - prev.y });
//         const dir2 = this.normalize({ x: next.x - curr.x, y: next.y - curr.y });
        
//         // 计算夹角
//         const angle = Math.acos(Math.max(-1, Math.min(1, 
//             dir1.x * dir2.x + dir1.y * dir2.y
//         )));
        
//         // 计算 miter 长度
//         const halfAngle = angle / 2;
//         const miterLength = halfWidth / Math.sin(halfAngle);
        
//         // 如果 miter 超过限制，转为 bevel
//         if (miterLength > halfWidth * miterLimit) {
//             return this.isPointNearBevel(point, prev, curr, next, halfWidth);
//         }
        
//         // 计算 miter 方向（角平分线）
//         const bisector = this.normalize({
//             x: dir1.x + dir2.x,
//             y: dir1.y + dir2.y
//         });
        
//         // 检查点是否在 miter 三角形内
//         const miterEnd = {
//             x: curr.x + bisector.x * miterLength,
//             y: curr.y + bisector.y * miterLength
//         };
        
//         return this.isPointInTriangle(point, prev, curr, miterEnd) ||
//                this.isPointInTriangle(point, curr, next, miterEnd);
//     }
    
//     /**
//      * 检测点是否在 bevel 连接区域
//      */
//     private static isPointNearBevel(
//         point: Vector2Like,
//         prev: Vector2Like,
//         curr: Vector2Like,
//         next: Vector2Like,
//         halfWidth: number
//     ): boolean {
//         // bevel 连接是一个四边形
//         // 计算两条边的垂直方向
//         const dir1 = this.normalize({ x: curr.x - prev.x, y: curr.y - prev.y });
//         const dir2 = this.normalize({ x: next.x - curr.x, y: next.y - curr.y });
        
//         // 垂直向量
//         const perp1 = { x: -dir1.y, y: dir1.x };
//         const perp2 = { x: -dir2.y, y: dir2.x };
        
//         // bevel 的四个角
//         const p1 = { x: curr.x + perp1.x * halfWidth, y: curr.y + perp1.y * halfWidth };
//         const p2 = { x: curr.x - perp1.x * halfWidth, y: curr.y - perp1.y * halfWidth };
//         const p3 = { x: curr.x + perp2.x * halfWidth, y: curr.y + perp2.y * halfWidth };
//         const p4 = { x: curr.x - perp2.x * halfWidth, y: curr.y - perp2.y * halfWidth };
        
//         // 检查点是否在四边形内
//         return this.isPointInQuadrilateral(point, p1, p2, p4, p3);
//     }
    
//     // ============ 几何判断辅助方法 ============
    
//     private static normalize(v: Vector2Like): Vector2Like {
//         const len = Math.sqrt(v.x * v.x + v.y * v.y);
//         if (len === 0) return { x: 0, y: 0 };
//         return { x: v.x / len, y: v.y / len };
//     }
    
//     private static isPointInTriangle(p: Vector2Like, a: Vector2Like, b: Vector2Like, c: Vector2Like): boolean {
//         const d1 = this.sign(p, a, b);
//         const d2 = this.sign(p, b, c);
//         const d3 = this.sign(p, c, a);
        
//         const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
//         const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        
//         return !(hasNeg && hasPos);
//     }
    
//     private static isPointInQuadrilateral(
//         p: Vector2Like,
//         a: Vector2Like,
//         b: Vector2Like,
//         c: Vector2Like,
//         d: Vector2Like
//     ): boolean {
//         // 将四边形分成两个三角形
//         return this.isPointInTriangle(p, a, b, c) ||
//                this.isPointInTriangle(p, a, c, d);
//     }
    
//     private static sign(p: Vector2Like, a: Vector2Like, b: Vector2Like): number {
//         return (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
//     }
    
//     private static isPointOnSquareCap(
//         point: Vector2Like,
//         endpoint: Vector2Like,
//         angle: number,
//         halfWidth: number
//     ): boolean {
//         // 计算 square cap 的四个角
//         const perpX = -Math.sin(angle);
//         const perpY = Math.cos(angle);
        
//         const capLength = halfWidth;
//         const p1 = {
//             x: endpoint.x + Math.cos(angle) * capLength + perpX * halfWidth,
//             y: endpoint.y + Math.sin(angle) * capLength + perpY * halfWidth
//         };
//         const p2 = {
//             x: endpoint.x + Math.cos(angle) * capLength - perpX * halfWidth,
//             y: endpoint.y + Math.sin(angle) * capLength - perpY * halfWidth
//         };
//         const p3 = {
//             x: endpoint.x - perpX * halfWidth,
//             y: endpoint.y - perpY * halfWidth
//         };
//         const p4 = {
//             x: endpoint.x + perpX * halfWidth,
//             y: endpoint.y + perpY * halfWidth
//         };
        
//         return this.isPointInQuadrilateral(point, p1, p2, p3, p4);
//     }
// }

// // ============ 扩展 Shape 类 ============

// export abstract class Shape extends Element {
//     protected fillColor: string = '#000000';
//     protected strokeStyle: StrokeStyle = { ...DEFAULT_STROKE_STYLE };
    
//     // 边界检测的缓存
//     protected _cachedBoundaryPoints: Vector2Like[] | null = null;
//     protected _boundaryDirty: boolean = true;
    
//     setStrokeStyle(style: Partial<StrokeStyle>): void {
//         this.strokeStyle = { ...this.strokeStyle, ...style };
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
    
//     setStrokeWidth(width: number): void {
//         this.strokeStyle.width = width;
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
    
//     setLineJoin(join: 'miter' | 'round' | 'bevel'): void {
//         this.strokeStyle.lineJoin = join;
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
    
//     setLineCap(cap: 'butt' | 'round' | 'square'): void {
//         this.strokeStyle.lineCap = cap;
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
    
//     /**
//      * 检测点是否在边界上
//      */
//     isPointOnBoundary(point: Vector2Like): boolean {
//         return BoundaryDetector.isPointOnShapeBoundary(
//             point,
//             this,
//             this.strokeStyle
//         );
//     }
    
//     /**
//      * 检测点是否在形状内部（包括边界）
//      */
//     abstract isPointInside(point: Vector2Like): boolean;
    
//     /**
//      * 获取边界上的点（用于调试或吸附）
//      */
//     getClosestBoundaryPoint(point: Vector2Like): Vector2Like | null {
//         // 默认实现：采样边界点
//         const boundaryPoints = this.getBoundaryPoints();
//         if (boundaryPoints.length === 0) return null;
        
//         let minDist = Infinity;
//         let closest: Vector2Like | null = null;
        
//         for (const bp of boundaryPoints) {
//             const dist = VectorUtils.distance(point, bp);
//             if (dist < minDist) {
//                 minDist = dist;
//                 closest = bp;
//             }
//         }
        
//         return closest;
//     }
    
//     /**
//      * 获取边界采样点（用于绘制或吸附）
//      */
//     protected abstract getBoundaryPoints(): Vector2Like[];
// }

// // ============ 具体形状实现 ============

// export class Circle extends Shape {
//     private radius: number;
    
//     constructor(radius: number, x: number = 0, y: number = 0) {
//         super();
//         this.radius = radius;
//         this.setPosition(x, y);
//     }
    
//     protected computeLocalBounds(): Rect {
//         return {
//             x: this.position.x - this.radius,
//             y: this.position.y - this.radius,
//             width: this.radius * 2,
//             height: this.radius * 2
//         };
//     }
    
//     isPointInside(point: Vector2Like): boolean {
//         const center = this.getCenter();
//         const dist = VectorUtils.distance(point, center);
//         return dist <= this.radius;
//     }
    
//     isPointOnBoundary(point: Vector2Like): boolean {
//         return BoundaryDetector.isPointOnCircleBoundary(
//             point,
//             this,
//             this.strokeStyle
//         );
//     }
    
//     protected getBoundaryPoints(): Vector2Like[] {
//         if (!this._boundaryDirty || !this._cachedBoundaryPoints) {
//             const points: Vector2Like[] = [];
//             const segments = 64;
//             const center = this.getCenter();
            
//             for (let i = 0; i <= segments; i++) {
//                 const angle = (i / segments) * Math.PI * 2;
//                 points.push({
//                     x: center.x + Math.cos(angle) * this.radius,
//                     y: center.y + Math.sin(angle) * this.radius
//                 });
//             }
            
//             this._cachedBoundaryPoints = points;
//             this._boundaryDirty = false;
//         }
        
//         return this._cachedBoundaryPoints!;
//     }
    
//     getCenter(): Vector2Like {
//         return { ...this.position };
//     }
    
//     getRadius(): number {
//         return this.radius;
//     }
    
//     setRadius(radius: number): void {
//         this.radius = radius;
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
// }

// export class RectShape extends Shape {
//     private width: number;
//     private height: number;
    
//     constructor(width: number, height: number, x: number = 0, y: number = 0) {
//         super();
//         this.width = width;
//         this.height = height;
//         this.setPosition(x, y);
//     }
    
//     protected computeLocalBounds(): Rect {
//         return {
//             x: this.position.x,
//             y: this.position.y,
//             width: this.width,
//             height: this.height
//         };
//     }
    
//     isPointInside(point: Vector2Like): boolean {
//         return point.x >= this.position.x &&
//                point.x <= this.position.x + this.width &&
//                point.y >= this.position.y &&
//                point.y <= this.position.y + this.height;
//     }
    
//     isPointOnBoundary(point: Vector2Like): boolean {
//         return BoundaryDetector.isPointOnRectBoundary(
//             point,
//             this,
//             this.strokeStyle
//         );
//     }
    
//     protected getBoundaryPoints(): Vector2Like[] {
//         if (!this._boundaryDirty || !this._cachedBoundaryPoints) {
//             const corners = this.getCorners();
//             // 添加闭合路径
//             this._cachedBoundaryPoints = [...corners, corners[0]];
//             this._boundaryDirty = false;
//         }
        
//         return this._cachedBoundaryPoints!;
//     }
    
//     getCorners(): Vector2Like[] {
//         return [
//             { x: this.position.x, y: this.position.y },
//             { x: this.position.x + this.width, y: this.position.y },
//             { x: this.position.x + this.width, y: this.position.y + this.height },
//             { x: this.position.x, y: this.position.y + this.height }
//         ];
//     }
    
//     getWidth(): number { return this.width; }
//     getHeight(): number { return this.height; }
    
//     setSize(width: number, height: number): void {
//         this.width = width;
//         this.height = height;
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
// }

// // ============ 路径形状 ============

// export class PathShape extends Shape {
//     private segments: PathSegment[] = [];
//     private _cachedPoints: Vector2Like[] | null = null;
    
//     addSegment(type: 'line' | 'quadratic' | 'cubic', ...args: any[]): void {
//         // ... 路径构建逻辑
//         this.markDirty();
//         this._boundaryDirty = true;
//         this._cachedPoints = null;
//     }
    
//     getPoints(): Vector2Like[] {
//         if (!this._cachedPoints) {
//             // 从 segments 提取所有点
//             this._cachedPoints = [];
//             for (const seg of this.segments) {
//                 this._cachedPoints.push(seg.start);
//                 // ... 提取中间点
//             }
//             if (this.segments.length > 0) {
//                 this._cachedPoints.push(this.segments[this.segments.length - 1].end);
//             }
//         }
//         return this._cachedPoints;
//     }
    
//     getSegments(): PathSegment[] {
//         return this.segments;
//     }
    
//     protected computeLocalBounds(): Rect {
//         // ... 计算路径的包围盒
//         return { x: 0, y: 0, width: 0, height: 0 };
//     }
    
//     isPointInside(point: Vector2Like): boolean {
//         // 使用射线法检测点是否在路径内部
//         // 对于开放路径，可能需要特殊处理
//         return false;
//     }
    
//     protected getBoundaryPoints(): Vector2Like[] {
//         return this.getPoints();
//     }
// }

// interface PathSegment {
//     start: Vector2Like;
//     end: Vector2Like;
//     type: 'line' | 'quadratic' | 'cubic';
//     controlPoints?: Vector2Like[];
// }

// // ============ 多边形形状 ============

// export class PolygonShape extends Shape {
//     private vertices: Vector2Like[] = [];
    
//     setVertices(vertices: Vector2Like[]): void {
//         this.vertices = vertices;
//         this.markDirty();
//         this._boundaryDirty = true;
//     }
    
//     getVertices(): Vector2Like[] {
//         return this.vertices;
//     }
    
//     protected computeLocalBounds(): Rect {
//         // ... 计算多边形包围盒
//         return { x: 0, y: 0, width: 0, height: 0 };
//     }
    
//     isPointInside(point: Vector2Like): boolean {
//         // 射线法检测
//         let inside = false;
//         for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
//             const xi = this.vertices[i].x, yi = this.vertices[i].y;
//             const xj = this.vertices[j].x, yj = this.vertices[j].y;
            
//             const intersect = ((yi > point.y) !== (yj > point.y)) &&
//                 (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
//             if (intersect) inside = !inside;
//         }
//         return inside;
//     }
    
//     protected getBoundaryPoints(): Vector2Like[] {
//         return [...this.vertices, this.vertices[0]];
//     }
// }

// // ============ 使用示例 ============

// function demonstrateBoundaryDetection() {
//     // 创建矩形
//     const rect = new RectShape(200, 100, 100, 100);
//     rect.setStrokeWidth(5);
//     rect.setLineJoin('round');
//     rect.setLineCap('round');
    
//     // 测试点
//     const testPoints = [
//         { x: 100, y: 100 },  // 左上角
//         { x: 150, y: 100 },  // 上边中点
//         { x: 200, y: 100 },  // 右上角
//         { x: 200, y: 150 },  // 右边中点
//         { x: 200, y: 200 },  // 右下角
//         { x: 150, y: 200 },  // 下边中点
//         { x: 100, y: 200 },  // 左下角
//         { x: 100, y: 150 },  // 左边中点
//         { x: 150, y: 150 },  // 中心（不在边界上）
//         { x: 152, y: 102 },  // 靠近边界
//     ];
    
//     console.log('=== 边界检测测试 ===');
//     console.log('矩形位置:', rect.position);
//     console.log('矩形尺寸:', rect.width, 'x', rect.height);
//     console.log('线宽:', rect.strokeStyle.width);
//     console.log('lineJoin:', rect.strokeStyle.lineJoin);
//     console.log();
    
//     for (const point of testPoints) {
//         const onBoundary = rect.isPointOnBoundary(point);
//         const inside = rect.isPointInside(point);
//         const status = onBoundary ? '在边界上' : (inside ? '在内部' : '在外部');
//         console.log(`点 (${point.x}, ${point.y}): ${status}`);
//     }
    
//     // 测试圆形
//     console.log('\n=== 圆形边界检测 ===');
//     const circle = new Circle(50, 100, 100);
//     circle.setStrokeWidth(10);
//     circle.setLineJoin('round');
//     circle.setLineCap('round');
    
//     const circleTestPoints = [
//         { x: 100, y: 50 },   // 上
//         { x: 150, y: 100 },  // 右
//         { x: 100, y: 150 },  // 下
//         { x: 50, y: 100 },   // 左
//         { x: 100, y: 100 },  // 中心
//         { x: 105, y: 95 },   // 靠近边界
//     ];
    
//     for (const point of circleTestPoints) {
//         const onBoundary = circle.isPointOnBoundary(point);
//         const status = onBoundary ? '在边界上' : '不在边界上';
//         console.log(`点 (${point.x}, ${point.y}): ${status}`);
//     }
// }

