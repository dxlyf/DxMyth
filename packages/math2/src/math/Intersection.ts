/**
 * 2D 相交检测库
 * 
 * 提供高性能的 2D 几何形状相交检测方法，包括：
 * - 点与形状的相交检测（圆、矩形、多边形）
 * - 形状与形状的相交检测（圆-圆、矩形-矩形、圆-矩形、多边形-多边形、圆-多边形）
 * - 线与形状的相交检测（线-圆、线-矩形）
 * - 射线检测和距离计算工具
 * 
 * 性能优化策略：
 * - 使用距离平方比较避免开方运算
 * - 早期退出和边界检查优化
 * - 分离轴定理（SAT）的应用
 * - 投影法和向量运算优化
 * 
 */

import { Vector2,type Vector2Like } from "./Vector2";

/**
 * 计算两条无限直线的交点
 * 使用参数方程求解，不考虑线段长度限制
 * @param p1 第一条直线的起点
 * @param p2 第一条直线的终点
 * @param p3 第二条直线的起点
 * @param p4 第二条直线的终点
 * @returns 返回交点坐标，如果两条线平行则返回 null
 */
function lineLineIntersection(p1: Vector2Like, p2: Vector2Like, p3: Vector2Like, p4: Vector2Like): Vector2 | null {
    // 计算分母，如果为 0 则两条线平行
    const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (denominator === 0) {
        return null;
    }
    
    // 使用参数方程求解交点
    const t = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
    
    // 返回交点坐标（不限制 t 的范围，因为是无限直线）
    return new Vector2(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
}

/**
 * 计算两条线段的交点（有限线段）
 * 使用克莱姆法则直接求解参数方程，然后验证交点是否在线段范围内
 * @param p1 第一条线段的起点
 * @param p2 第一条线段的终点
 * @param p3 第二条线段的起点
 * @param p4 第二条线段的终点
 * @returns 交点坐标，如果不相交则返回 null
 */
function lineSegmentIntersection(p1: Vector2Like, p2: Vector2Like, p3: Vector2Like, p4: Vector2Like): Vector2 | null {
    // 计算方向向量
    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p4.x - p3.x;
    const dy2 = p4.y - p3.y;
    
    // 使用克莱姆法则求解线性方程组
    // p1 + t * (p2 - p1) = p3 + u * (p4 - p3)
    const denominator = dx1 * dy2 - dy1 * dx2;
    
    // 如果分母为 0，说明两条线平行
    if (denominator === 0) {
        return null;
    }
    
    // 计算参数 t 和 u
    const dx3 = p3.x - p1.x;
    const dy3 = p3.y - p1.y;
    
    const t = (dx3 * dy2 - dy3 * dx2) / denominator;
    const u = (dx3 * dy1 - dy3 * dx1) / denominator;
    
    // 检查交点是否在两条线段上（t 和 u 都在 [0, 1] 范围内）
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        // 返回交点坐标
        return new Vector2(p1.x + t * dx1, p1.y + t * dy1);
    }
    
    return null;
}

/**
 * 检查点是否在线段上
 * 使用叉积判断共线，点积判断在线段范围内
 * @param point 要检查的点
 * @param segStart 线段起点
 * @param segEnd 线段终点
 * @returns 如果点在线段上返回 true，否则返回 false
 */
function isPointOnLineSegment(point: Vector2Like, segStart: Vector2Like, segEnd: Vector2Like): boolean {
    // 使用叉积判断点是否在直线上
    const cross = (point.x - segStart.x) * (segEnd.y - segStart.y) - (point.y - segStart.y) * (segEnd.x - segStart.x);
    if (Math.abs(cross) > 1e-10) return false;
    
    // 使用点积判断点是否在线段范围内
    const dot = (point.x - segStart.x) * (point.x - segEnd.x) + (point.y - segStart.y) * (point.y - segEnd.y);
    return dot <= 1e-10;
}

/**
 * 检查点是否在圆内
 * 使用距离平方比较避免开方运算，提高性能
 * @param point 要检查的点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @returns 如果点在圆内或圆上返回 true，否则返回 false
 */
function pointInCircle(point: Vector2Like, center: Vector2Like, radius: number): boolean {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return dx * dx + dy * dy <= radius * radius;
}

/**
 * 检查点是否在矩形内（轴对齐矩形）
 * 使用简单的边界检查，性能最优
 * @param point 要检查的点
 * @param rectMin 矩形最小角坐标（左下角）
 * @param rectMax 矩形最大角坐标（右上角）
 * @returns 如果点在矩形内或边上返回 true，否则返回 false
 */
function pointInRect(point: Vector2Like, rectMin: Vector2Like, rectMax: Vector2Like): boolean {
    return point.x >= rectMin.x && point.x <= rectMax.x &&
           point.y >= rectMin.y && point.y <= rectMax.y;
}

/**
 * 检查点是否在多边形内
 * 使用射线法（Ray Casting Algorithm），从点向右发射射线，计算与多边形边的交点数
 * @param point 要检查的点
 * @param vertices 多边形顶点数组，按顺时针或逆时针顺序排列
 * @returns 如果点在多边形内或边上返回 true，否则返回 false
 */
function pointInPolygon(point: Vector2Like, vertices: Vector2Like[]): boolean {
    let inside = false;
    const x = point.x, y = point.y;
    const n = vertices.length;
    
    // 遍历多边形的所有边
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;
        
        // 检查射线是否与边相交
        const intersect = ((yi > y) !== (yj > y)) &&
                         (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside; // 每次相交翻转状态
    }
    return inside;
}

/**
 * 检查两个圆是否相交
 * 使用距离平方比较避免开方运算，提高性能
 * @param center1 第一个圆的圆心
 * @param radius1 第一个圆的半径
 * @param center2 第二个圆的圆心
 * @param radius2 第二个圆的半径
 * @returns 如果两圆相交或相切返回 true，否则返回 false
 */
function circleCircle(center1: Vector2Like, radius1: number, center2: Vector2Like, radius2: number): boolean {
    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;
    const distanceSq = dx * dx + dy * dy;
    const radiusSum = radius1 + radius2;
    return distanceSq <= radiusSum * radiusSum;
}

/**
 * 检查两个轴对齐矩形是否相交
 * 使用分离轴定理的简化版本，性能最优
 * @param min1 第一个矩形的最小角坐标
 * @param max1 第一个矩形的最大角坐标
 * @param min2 第二个矩形的最小角坐标
 * @param max2 第二个矩形的最大角坐标
 * @returns 如果两矩形相交或相切返回 true，否则返回 false
 */
function rectRect(min1: Vector2Like, max1: Vector2Like, min2: Vector2Like, max2: Vector2Like): boolean {
    // 检查是否在任一轴上分离
    return !(max1.x < min2.x || min1.x > max2.x ||
             max1.y < min2.y || min1.y > max2.y);
}

/**
 * 检查圆与矩形是否相交
 * 找到矩形上距离圆心最近的点，然后检查该点是否在圆内
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 如果圆与矩形相交或相切返回 true，否则返回 false
 */
function circleRect(center: Vector2Like, radius: number, rectMin: Vector2Like, rectMax: Vector2Like): boolean {
    // 找到矩形上距离圆心最近的点
    const closestX = Math.max(rectMin.x, Math.min(center.x, rectMax.x));
    const closestY = Math.max(rectMin.y, Math.min(center.y, rectMax.y));
    
    // 计算圆心到最近点的距离平方
    const dx = center.x - closestX;
    const dy = center.y - closestY;
    
    return dx * dx + dy * dy <= radius * radius;
}

/**
 * 检查线段与圆是否相交
 * 使用二次方程求解线段与圆的交点，避免开方运算提高性能
 * @param p1 线段起点
 * @param p2 线段终点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @returns 如果线段与圆相交或相切返回 true，否则返回 false
 */
function lineCircle(p1: Vector2Like, p2: Vector2Like, center: Vector2Like, radius: number): boolean {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const fx = p1.x - center.x;
    const fy = p1.y - center.y;
    
    // 二次方程系数：at² + bt + c = 0
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - radius * radius;
    
    // 计算判别式
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return false;
    
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDiscriminant) / (2 * a);
    const t2 = (-b + sqrtDiscriminant) / (2 * a);
    
    // 检查交点是否在线段范围内
    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1) || (t1 < 0 && t2 > 1);
}

/**
 * 检查线段与矩形是否相交
 * 首先检查线段端点是否在矩形内，然后检查线段是否与矩形四条边相交
 * @param p1 线段起点
 * @param p2 线段终点
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 如果线段与矩形相交或相切返回 true，否则返回 false
 */
function lineRect(p1: Vector2Like, p2: Vector2Like, rectMin: Vector2Like, rectMax: Vector2Like): boolean {
    // 快速检查：如果任一端点在矩形内，则相交
    if (pointInRect(p1, rectMin, rectMax) || pointInRect(p2, rectMin, rectMax)) {
        return true;
    }
    
    // 矩形的四个角点
    const corners: Vector2Like[] = [
        rectMin,
        { x: rectMax.x, y: rectMin.y },
        rectMax,
        { x: rectMin.x, y: rectMax.y }
    ];
    
    // 检查线段是否与矩形的四条边相交
    for (let i = 0; i < 4; i++) {
        const corner1 = corners[i];
        const corner2 = corners[(i + 1) % 4];
        if (lineSegmentIntersection(p1, p2, corner1, corner2)) {
            return true;
        }
    }
    
    return false;
}

/**
 * 检查两个多边形是否相交
 * 使用分离轴定理（SAT）的简化版本：检查顶点包含和边相交
 * @param vertices1 第一个多边形的顶点数组
 * @param vertices2 第二个多边形的顶点数组
 * @returns 如果两多边形相交返回 true，否则返回 false
 */
function polygonPolygon(vertices1: Vector2Like[], vertices2: Vector2Like[]): boolean {
    // 检查第一个多边形的顶点是否在第二个多边形内
    for (const vertex of vertices1) {
        if (pointInPolygon(vertex, vertices2)) return true;
    }
    // 检查第二个多边形的顶点是否在第一个多边形内
    for (const vertex of vertices2) {
        if (pointInPolygon(vertex, vertices1)) return true;
    }
    
    // 检查多边形的边是否相交
    for (let i = 0; i < vertices1.length; i++) {
        const p1 = vertices1[i];
        const p2 = vertices1[(i + 1) % vertices1.length];
        
        for (let j = 0; j < vertices2.length; j++) {
            const p3 = vertices2[j];
            const p4 = vertices2[(j + 1) % vertices2.length];
            
            if (lineSegmentIntersection(p1, p2, p3, p4)) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * 检查圆与多边形是否相交
 * 结合多种检测方法：顶点在圆内、圆心在多边形内、边与圆相交
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param vertices 多边形顶点数组
 * @returns 如果圆与多边形相交返回 true，否则返回 false
 */
function circlePolygon(center: Vector2Like, radius: number, vertices: Vector2Like[]): boolean {
    // 检查多边形顶点是否在圆内
    for (const vertex of vertices) {
        if (pointInCircle(vertex, center, radius)) return true;
    }
    
    // 检查圆心是否在多边形内
    if (pointInPolygon(center, vertices)) return true;
    
    // 检查多边形的边是否与圆相交
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        
        if (lineCircle(p1, p2, center, radius)) {
            return true;
        }
    }
    
    return false;
}

/**
 * 射线检测，计算射线与障碍物的交点
 * 支持圆形和矩形障碍物，返回所有交点按距离排序
 * @param origin 射线起点
 * @param direction 射线方向（不需要归一化）
 * @param maxDistance 射线最大检测距离
 * @param obstacles 障碍物数组，支持圆形和矩形
 * @returns 命中点数组，包含交点坐标、距离和法向量
 */
function raycast(origin: Vector2Like, direction: Vector2Like, maxDistance: number, obstacles: Array<{
    type: 'circle' | 'rect' | 'polygon';
    data: any;
}>): Array<{ point: Vector2; distance: number; normal: Vector2 }> {
    const hits: Array<{ point: Vector2; distance: number; normal: Vector2 }> = [];
    const dir = Vector2.from(direction).normalize();
    const end = dir.clone().multiplyScalar(maxDistance).add(origin);
    
    for (const obstacle of obstacles) {
        let hit: Vector2 | null = null;
        let normal = new Vector2(0, 0);
        
        switch (obstacle.type) {
            case 'circle': {
                const circleData = obstacle.data as { center: Vector2Like; radius: number };
                // 使用射线-圆相交公式
                const oc = Vector2.from(origin).subtract(circleData.center);
                const a = dir.dot(dir);
                const b = 2 * oc.dot(dir);
                const c = oc.dot(oc) - circleData.radius * circleData.radius;
                const discriminant = b * b - 4 * a * c;
                
                if (discriminant >= 0) {
                    const t = (-b - Math.sqrt(discriminant)) / (2 * a);
                    if (t >= 0 && t <= maxDistance) {
                        hit = Vector2.from(origin).add(dir.clone().multiplyScalar(t));
                        // 计算法向量：从圆心指向交点
                        normal = Vector2.from(hit).subtract(circleData.center).normalize();
                    }
                }
                break;
            }
            
            case 'rect': {
                const rectData = obstacle.data as { min: Vector2Like; max: Vector2Like };
                if (lineRect(origin, end, rectData.min, rectData.max)) {
                    const corners: Vector2Like[] = [
                        rectData.min,
                        { x: rectData.max.x, y: rectData.min.y },
                        rectData.max,
                        { x: rectData.min.x, y: rectData.max.y }
                    ];
                    
                    let closestHit: Vector2 | null = null;
                    let closestDistance = Infinity;
                    
                    // 找到最近的交点
                    for (let i = 0; i < 4; i++) {
                        const intersection = lineSegmentIntersection(origin, end, corners[i], corners[(i + 1) % 4]);
                        if (intersection) {
                            const distance = Vector2.distance(origin, intersection);
                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestHit = intersection;
                                
                                // 计算边的法向量
                                const edge = Vector2.from(corners[(i + 1) % 4]).subtract(corners[i]);
                                normal = new Vector2(-edge.y, edge.x).normalize();
                            }
                        }
                    }
                    
                    hit = closestHit;
                }
                break;
            }
        }
        
        if (hit) {
            const distance = Vector2.distance(origin, hit);
            hits.push({ point: hit, distance, normal });
        }
    }
    
    // 按距离排序，最近的在前
    return hits.sort((a, b) => a.distance - b.distance);
}

/**
 * 计算点到线段的最短距离
 * 使用投影法，先计算点在线段上的投影，然后计算距离
 * @param point 要计算距离的点
 * @param segStart 线段起点
 * @param segEnd 线段终点
 * @returns 点到线段的最短距离
 */
function distanceToLineSegment(point: Vector2Like, segStart: Vector2Like, segEnd: Vector2Like): number {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    // 处理线段长度为 0 的特殊情况
    if (lengthSq === 0) {
        return Math.sqrt((point.x - segStart.x) ** 2 + (point.y - segStart.y) ** 2);
    }
    
    // 计算投影参数 t，并限制在 [0, 1] 范围内
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    // 计算投影点坐标
    const projX = segStart.x + t * dx;
    const projY = segStart.y + t * dy;
    
    // 计算点到投影点的距离
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

/**
 * 找到线段上距离指定点最近的点
 * 使用投影法，返回线段上的最近点坐标
 * @param point 指定的点
 * @param segStart 线段起点
 * @param segEnd 线段终点
 * @returns 线段上距离指定点最近的点
 */
function closestPointOnLineSegment(point: Vector2Like, segStart: Vector2Like, segEnd: Vector2Like): Vector2 {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    // 处理线段长度为 0 的特殊情况
    if (lengthSq === 0) {
        return new Vector2(segStart.x, segStart.y);
    }
    
    // 计算投影参数 t，并限制在 [0, 1] 范围内
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    // 返回投影点坐标
    return new Vector2(segStart.x + t * dx, segStart.y + t * dy);
}


// ==================== 返回交点的版本 ====================

/**
 * 计算线段与圆的交点
 * 使用二次方程求解，返回所有交点
 * @param p1 线段起点
 * @param p2 线段终点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @returns 交点数组，如果不相交则返回空数组
 */
function lineCircleIntersections(p1: Vector2Like, p2: Vector2Like, center: Vector2Like, radius: number): Vector2[] {
    const intersections: Vector2[] = [];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const fx = p1.x - center.x;
    const fy = p1.y - center.y;
    
    // 二次方程系数：at² + bt + c = 0
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - radius * radius;
    
    // 计算判别式
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return intersections;
    
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDiscriminant) / (2 * a);
    const t2 = (-b + sqrtDiscriminant) / (2 * a);
    
    // 检查交点是否在线段范围内
    if (t1 >= 0 && t1 <= 1) {
        intersections.push(new Vector2(p1.x + t1 * dx, p1.y + t1 * dy));
    }
    if (t2 >= 0 && t2 <= 1 && Math.abs(t2 - t1) > 1e-10) {
        intersections.push(new Vector2(p1.x + t2 * dx, p1.y + t2 * dy));
    }
    
    return intersections;
}

/**
 * 计算线段与矩形的交点
 * 检查线段与矩形四条边的交点
 * @param p1 线段起点
 * @param p2 线段终点
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 交点数组，如果不相交则返回空数组
 */
function lineRectIntersections(p1: Vector2Like, p2: Vector2Like, rectMin: Vector2Like, rectMax: Vector2Like): Vector2[] {
    const intersections: Vector2[] = [];
    
    // 矩形的四个角点
    const corners: Vector2Like[] = [
        rectMin,
        { x: rectMax.x, y: rectMin.y },
        rectMax,
        { x: rectMin.x, y: rectMax.y }
    ];
    
    // 检查线段是否与矩形的四条边相交
    for (let i = 0; i < 4; i++) {
        const corner1 = corners[i];
        const corner2 = corners[(i + 1) % 4];
        const intersection = lineSegmentIntersection(p1, p2, corner1, corner2);
        if (intersection) {
            // 避免重复添加相同的交点
            const isDuplicate = intersections.some(point => 
                Math.abs(point.x - intersection.x) < 1e-10 && 
                Math.abs(point.y - intersection.y) < 1e-10
            );
            if (!isDuplicate) {
                intersections.push(intersection);
            }
        }
    }
    
    return intersections;
}

/**
 * 计算两个圆的交点
 * 使用几何方法求解两圆交点
 * @param center1 第一个圆的圆心
 * @param radius1 第一个圆的半径
 * @param center2 第二个圆的圆心
 * @param radius2 第二个圆的半径
 * @returns 交点数组，如果不相交则返回空数组
 */
function circleCircleIntersections(center1: Vector2Like, radius1: number, center2: Vector2Like, radius2: number): Vector2[] {
    const intersections: Vector2[] = [];
    
    const dx = center2.x - center1.x;
    const dy = center2.y - center1.y;
    const distanceSq = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSq);
    
    // 检查是否相交
    const radiusSum = radius1 + radius2;
    const radiusDiff = Math.abs(radius1 - radius2);
    
    if (distance > radiusSum || distance < radiusDiff || distance === 0) {
        return intersections; // 不相交或重合
    }
    
    // 计算交点
    const a = (radius1 * radius1 - radius2 * radius2 + distanceSq) / (2 * distance);
    const h = Math.sqrt(radius1 * radius1 - a * a);
    
    // 中点
    const midX = center1.x + (a * dx) / distance;
    const midY = center1.y + (a * dy) / distance;
    
    // 交点
    const offsetX = (h * dy) / distance;
    const offsetY = -(h * dx) / distance;
    
    intersections.push(new Vector2(midX + offsetX, midY + offsetY));
    
    // 如果有两个不同的交点
    if (h > 1e-10) {
        intersections.push(new Vector2(midX - offsetX, midY - offsetY));
    }
    
    return intersections;
}

/**
 * 计算两个轴对齐矩形的交点
 * 返回两个矩形重叠区域的角点
 * @param min1 第一个矩形的最小角坐标
 * @param max1 第一个矩形的最大角坐标
 * @param min2 第二个矩形的最小角坐标
 * @param max2 第二个矩形的最大角坐标
 * @returns 交点数组（重叠区域的角点），如果不相交则返回空数组
 */
function rectRectIntersections(min1: Vector2Like, max1: Vector2Like, min2: Vector2Like, max2: Vector2Like): Vector2[] {
    const intersections: Vector2[] = [];
    
    // 计算重叠区域
    const overlapMin = {
        x: Math.max(min1.x, min2.x),
        y: Math.max(min1.y, min2.y)
    };
    const overlapMax = {
        x: Math.min(max1.x, max2.x),
        y: Math.min(max1.y, max2.y)
    };
    
    // 检查是否真的重叠
    if (overlapMin.x <= overlapMax.x && overlapMin.y <= overlapMax.y) {
        // 返回重叠区域的四个角点
        intersections.push(new Vector2(overlapMin.x, overlapMin.y)); // 左下
        intersections.push(new Vector2(overlapMax.x, overlapMin.y)); // 右下
        intersections.push(new Vector2(overlapMax.x, overlapMax.y)); // 右上
        intersections.push(new Vector2(overlapMin.x, overlapMax.y)); // 左上
    }
    
    return intersections;
}

/**
 * 计算圆与矩形的交点
 * 结合多种方法：圆与矩形边的交点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 交点数组，如果不相交则返回空数组
 */
function circleRectIntersections(center: Vector2Like, radius: number, rectMin: Vector2Like, rectMax: Vector2Like): Vector2[] {
    const intersections: Vector2[] = [];
    
    // 矩形的四个角点
    const corners: Vector2Like[] = [
        rectMin,
        { x: rectMax.x, y: rectMin.y },
        rectMax,
        { x: rectMin.x, y: rectMax.y }
    ];
    
    // 检查圆与矩形四条边的交点
    for (let i = 0; i < 4; i++) {
        const corner1 = corners[i];
        const corner2 = corners[(i + 1) % 4];
        const edgeIntersections = lineCircleIntersections(corner1, corner2, center, radius);
        intersections.push(...edgeIntersections);
    }
    
    // 去重（处理角点重复的情况）
    const uniqueIntersections: Vector2[] = [];
    for (const point of intersections) {
        const isDuplicate = uniqueIntersections.some(existing => 
            Math.abs(existing.x - point.x) < 1e-10 && 
            Math.abs(existing.y - point.y) < 1e-10
        );
        if (!isDuplicate) {
            uniqueIntersections.push(point);
        }
    }
    
    return uniqueIntersections;
}

/**
 * 计算两个多边形的交点
 * 检查所有边的交点
 * @param vertices1 第一个多边形的顶点数组
 * @param vertices2 第二个多边形的顶点数组
 * @returns 交点数组，如果不相交则返回空数组
 */
function polygonPolygonIntersections(vertices1: Vector2Like[], vertices2: Vector2Like[]): Vector2[] {
    const intersections: Vector2[] = [];
    
    // 检查多边形的边是否相交
    for (let i = 0; i < vertices1.length; i++) {
        const p1 = vertices1[i];
        const p2 = vertices1[(i + 1) % vertices1.length];
        
        for (let j = 0; j < vertices2.length; j++) {
            const p3 = vertices2[j];
            const p4 = vertices2[(j + 1) % vertices2.length];
            
            const intersection = lineSegmentIntersection(p1, p2, p3, p4);
            if (intersection) {
                // 避免重复添加相同的交点
                const isDuplicate = intersections.some(point => 
                    Math.abs(point.x - intersection.x) < 1e-10 && 
                    Math.abs(point.y - intersection.y) < 1e-10
                );
                if (!isDuplicate) {
                    intersections.push(intersection);
                }
            }
        }
    }
    
    return intersections;
}

/**
 * 计算圆与多边形的交点
 * 检查圆与多边形每条边的交点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param vertices 多边形顶点数组
 * @returns 交点数组，如果不相交则返回空数组
 */
function circlePolygonIntersections(center: Vector2Like, radius: number, vertices: Vector2Like[]): Vector2[] {
    const intersections: Vector2[] = [];
    
    // 检查多边形的边是否与圆相交
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        
        const edgeIntersections = lineCircleIntersections(p1, p2, center, radius);
        intersections.push(...edgeIntersections);
    }
    
    // 去重
    const uniqueIntersections: Vector2[] = [];
    for (const point of intersections) {
        const isDuplicate = uniqueIntersections.some(existing => 
            Math.abs(existing.x - point.x) < 1e-10 && 
            Math.abs(existing.y - point.y) < 1e-10
        );
        if (!isDuplicate) {
            uniqueIntersections.push(point);
        }
    }
    
    return uniqueIntersections;
}

/**
 * 求解三次方程 k3*x³ + k2*x² + k1*x + k0 = 0 的实根
 */
function solveCubic(k3: number, k2: number, k1: number, k0: number,epsilon = 1e-10): number[] {
  if (Math.abs(k3) < epsilon) {
    // 退化为二次方程
    return solveQuadratic(k2, k1, k0);
  }
  // 归一化
  const a = k2 / k3;
  const b = k1 / k3;
  const c = k0 / k3;

  const Q = (a * a - 3 * b) / 9;
  const R = (2 * a * a * a - 9 * a * b + 27 * c) / 54;
  const D = Q * Q * Q - R * R;

  const roots: number[] = [];
  if (D >= 0) {
    // 三个实根
    const theta = Math.acos(R / Math.sqrt(Q * Q * Q));
    const sqrtQ = Math.sqrt(Q);
    roots.push(-2 * sqrtQ * Math.cos(theta / 3) - a / 3);
    roots.push(-2 * sqrtQ * Math.cos((theta + 2 * Math.PI) / 3) - a / 3);
    roots.push(-2 * sqrtQ * Math.cos((theta - 2 * Math.PI) / 3) - a / 3);
  } else {
    // 一个实根
    const sqrtD = Math.sqrt(-D);
    const S = Math.cbrt(R + sqrtD);
    const T = Math.cbrt(R - sqrtD);
    roots.push(S + T - a / 3);
  }
  return roots;
}

/**
 * 求解二次方程 a*x² + b*x + c = 0 的实根
 */
function solveQuadratic(a: number, b: number, c: number, epsilon = 1e-10): number[] {
  if (Math.abs(a) < epsilon) {
    if (Math.abs(b) < epsilon) return [];
    return [-c / b];
  }
  const D = b * b - 4 * a * c;
  if (D < 0) return [];
  if (D === 0) return [-b / (2 * a)];
  const sqrtD = Math.sqrt(D);
  return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
}

/**
 * 线段与两次贝塞尔曲线求交点
 * 直线隐式方程：Ax+By+C=0
 * 二次贝塞尔曲线参数方程：B(t)=(x(t),y(t))=(1-t)²p0+2(1-t)p1+t²p2，t∈[0,1]
 * 多项式展开形式：(p0-2p1+p2)t^2+2(p1-p0)t+p0
 * A=p0-2p1+p2
 * B=2(p1-p0)
 * C=p0
 * B(t)=At^2+Bt+C,x(t)=Axt^2+Bxt+Cx,y(t)=Ayt^2+Byt+Cy
 * 
 * 代入直线隐式方程：Ax(t)+By(t)+C=0
 * 得到一个关于求解t 的一元二次方程：At^2+Bt+C=0
 */
function lineQuadraticBezierIntersections(start:Vector2Like, end:Vector2Like,cp:Vector2Like[]):Vector2Like[] {
    // 直线一般式：Ax+By+C=0
    const A_line = end.y - start.y;
    const B_line = start.x - end.x;
    const C_line = end.x * start.y - start.x * end.y;
    // 二次贝塞尔多项式：B(t)=At^2+Bt+C
    const A_bezier_x = cp[0].x - 2 * cp[1].x + cp[2].x;
    const B_bezier_x = 2 * (cp[1].x - cp[0].x);
    const C_bezier_x = cp[0].x;

    const A_bezier_y = cp[0].y - 2 * cp[1].y + cp[2].y;
    const B_bezier_y = 2 * (cp[1].y - cp[0].y);
    const C_bezier_y = cp[0].y;

    // Ab(t).x+Ba(t).y+C=0
    // 代入
    const A =A_line*A_bezier_x+B_line*A_bezier_y;
    const B =A_line*B_bezier_x+B_line*B_bezier_y;
    const C =A_line*C_bezier_x+B_line*C_bezier_y+C_line;

    const roots= solveQuadratic(A,B,C);
    // 返回在[0,1]范围内的交点
    return roots.filter(t=>t>=0&&t<=1).map(t=>{
        const tt=t*t;
        return Vector2.create(
            A_bezier_x*tt+B_bezier_x*t+C_bezier_x,
            A_bezier_y*tt+B_bezier_y*t+C_bezier_y
        );
    });
}
/**
 * 计算线段与三次贝塞尔曲线的交点
 * @param start 线段起点
 * @param end 线段终点
 * @param cp 三次贝塞尔曲线控制点数组，长度必须为3
 * @returns 交点数组，可能为空
 */
function lineCubicBezierIntersections(start:Vector2Like, end:Vector2Like,cp:Vector2Like[]):Vector2Like[] {
    // 三次贝塞尔曲线一般式：B(t)=At^3+Bt^2+Ct+D
    // 展开成多项式：B(t)=At^3+3At^2*B+3At*C+D
    // A=p0-3p1+3p2-p3
    // B=3(p1-p0)-6p2+3p3
    // C=3(p2-p1)+3p3-p0
    // D=p0
    const A_bezier_x = cp[0].x - 3 * cp[1].x + 3 * cp[2].x - cp[3].x;
    const B_bezier_x = 3 * (cp[1].x - cp[0].x) - 6 * cp[2].x + 3 * cp[3].x;
    const C_bezier_x = 3 * (cp[2].x - cp[1].x) + 3 * cp[3].x - cp[0].x;
    const D_bezier_x = cp[0].x;
    const A_bezier_y = cp[0].y - 3 * cp[1].y + 3 * cp[2].y - cp[3].y;
    const B_bezier_y = 3 * (cp[1].y - cp[0].y) - 6 * cp[2].y + 3 * cp[3].y;
    const C_bezier_y = 3 * (cp[2].y - cp[1].y) + 3 * cp[3].y - cp[0].y;
    const D_bezier_y = cp[0].y;
    // 直线一般式：Ax+By+C=0
    const A_line = end.y - start.y;
    const B_line = start.x - end.x;
    const C_line = end.x * start.y - start.x * end.y;
    // 三次贝塞尔多项式：B(t)=At^3+Bt^2+Ct+D
    // 代入直线隐式方程：Ax(t)+By(t)+C=0
    // 得到一个关于求解t 的一元三次方程：At^3+Bt^2+Ct+D=0
    const A =A_line*A_bezier_x+B_line*A_bezier_y;
    const B =A_line*B_bezier_x+B_line*B_bezier_y;
    const C =A_line*C_bezier_x+B_line*C_bezier_y+C_line;
    const D =A_line*D_bezier_x+B_line*D_bezier_y+C_line;
    // 求解三次方程的根
    const roots= solveCubic(A,B,C,D);
    // 返回在[0,1]范围内的交点
    return roots.filter(t=>t>=0&&t<=1).map(t=>{
        const tt=t*t;
        return Vector2.create(
            A_bezier_x*tt*tt+B_bezier_x*tt*2*t+C_bezier_x*tt+D_bezier_x,
            A_bezier_y*tt*tt+B_bezier_y*tt*2*t+C_bezier_y*tt+D_bezier_y
        );
    });
}

export {
    // 基础相交检测函数
    lineLineIntersection,      // 直线-直线相交检测
    lineSegmentIntersection,   // 线段-线段相交检测
    isPointOnLineSegment,      // 点是否在线段上检测
    pointInCircle,             // 点-圆相交检测
    pointInRect,               // 点-矩形相交检测
    pointInPolygon,            // 点-多边形相交检测
    circleCircle,              // 圆-圆相交检测
    rectRect,                  // 矩形-矩形相交检测
    circleRect,                // 圆-矩形相交检测
    lineCircle,                // 线段-圆相交检测
    lineRect,                  // 线段-矩形相交检测
    polygonPolygon,           // 多边形-多边形相交检测
    circlePolygon,             // 圆-多边形相交检测
    raycast,                   // 射线检测
    distanceToLineSegment,     // 点到线段距离计算
    closestPointOnLineSegment, // 线段上最近点计算
    
    // 返回交点的版本
    lineCircleIntersections,   // 线段-圆交点计算
    lineRectIntersections,     // 线段-矩形交点计算
    circleCircleIntersections, // 圆-圆交点计算
    rectRectIntersections,     // 矩形-矩形交点计算
    circleRectIntersections,   // 圆-矩形交点计算
    polygonPolygonIntersections, // 多边形-多边形交点计算
    circlePolygonIntersections,  // 圆-多边形交点计算
    lineQuadraticBezierIntersections, // 线段-二次贝塞尔曲线交点计算
    lineCubicBezierIntersections // 线段-三次贝塞尔曲线交点计算
};


