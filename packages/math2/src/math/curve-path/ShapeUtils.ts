// ============================================================
// ShapeUtils — 形状工具函数（面积、绕向、三角化）
// 移植自 three.js extras/ShapeUtils.js
// ============================================================

import earcut from '../earcut'
import type { Vector2Like } from '../Vector2'

export class ShapeUtils {
    /**
     * 计算 2D 轮廓多边形面积（鞋带公式）。
     * @param contour 2D 点数组
     */
    static area(contour: Vector2Like[]): number {
        const n = contour.length
        let a = 0.0

        for (let p = n - 1, q = 0; q < n; p = q++) {
            a += contour[p].x * contour[q].y - contour[q].x * contour[p].y
        }

        return a * 0.5
    }

    /**
     * 判断轮廓是否为顺时针绕向。
     * @param pts 定义多边形的 2D 点数组
     */
    static isClockWise(pts: Vector2Like[]): boolean {
        return ShapeUtils.area(pts) < 0
    }

    /**
     * 三角化形状定义（外轮廓 + 孔洞）。
     * @param contour 外轮廓点数组
     * @param holes 孔洞点数组的数组
     * @return 每个面为三个顶点的索引数组
     */
    static triangulateShape(contour: Vector2Like[], holes: Vector2Like[][]): number[][] {
        const vertices: number[] = [] // 扁平顶点数组 [x0,y0, x1,y1, ...]
        const holeIndices: number[] = [] // 孔洞起点索引数组
        const faces: number[][] = [] // 最终顶点索引数组 [[a,b,d],[b,c,d],...]

        removeDupEndPts(contour)
        addContour(vertices, contour)

        let holeIndex = contour.length

        holes.forEach(removeDupEndPts)

        for (let i = 0; i < holes.length; i++) {
            holeIndices.push(holeIndex)
            holeIndex += holes[i].length
            addContour(vertices, holes[i])
        }

        const triangles = earcut(vertices, holeIndices)

        for (let i = 0; i < triangles.length; i += 3) {
            faces.push(triangles.slice(i, i + 3))
        }

        return faces
    }
}

function removeDupEndPts(points: Vector2Like[]): void {
    const l = points.length

    if (l > 2 && points[l - 1].x === points[0].x && points[l - 1].y === points[0].y) {
        points.pop()
    }
}

function addContour(vertices: number[], contour: Vector2Like[]): void {
    for (let i = 0; i < contour.length; i++) {
        vertices.push(contour[i].x)
        vertices.push(contour[i].y)
    }
}
