// ============================================================
// ShapePath — 将一系列路径转换为形状数组（用于字体与 SVG）
// 移植自 three.js extras/core/ShapePath.js
// ============================================================

import { Color } from '../Color'
import { Vector2 } from '../Vector2'
import { Path } from './Path'
import { Shape } from './Shape'
import { ShapeUtils } from './ShapeUtils'

export class ShapePath {
    type = 'ShapePath'

    /** 形状颜色 */
    color: Color

    /** 已生成的子路径 */
    subPaths: Path[] = []

    /** 正在生成的当前路径 */
    currentPath: Path | null = null

    constructor() {
        this.color = new Color(1, 1, 1, 1)
    }

    /** 创建新路径并将其 currentPoint 移到给定点 */
    moveTo(x: number, y: number): this {
        this.currentPath = new Path()
        this.subPaths.push(this.currentPath)
        this.currentPath.moveTo(x, y)
        return this
    }

    /** 在当前路径上添加一条 LineCurve 到给定点 */
    lineTo(x: number, y: number): this {
        this.currentPath!.lineTo(x, y)
        return this
    }

    /** 在当前路径上添加一条 QuadraticBezierCurve */
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this {
        this.currentPath!.quadraticCurveTo(aCPx, aCPy, aX, aY)
        return this
    }

    /** 在当前路径上添加一条 CubicBezierCurve */
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): this {
        this.currentPath!.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY)
        return this
    }

    /** 在当前路径上添加一条经过给定点列表的 SplineCurve */
    splineThru(pts: Vector2[]): this {
        this.currentPath!.splineThru(pts)
        return this
    }

    /**
     * 将子路径转换为形状数组。
     * @param isCCW 默认实心形状为顺时针、孔洞为逆时针；设为 true 则翻转
     */
    toShapes(isCCW: boolean): Shape[] {
        function toShapesNoHoles(inSubpaths: Path[]): Shape[] {
            const shapes: Shape[] = []

            for (let i = 0, l = inSubpaths.length; i < l; i++) {
                const tmpPath = inSubpaths[i]

                const tmpShape = new Shape()
                tmpShape.curves = tmpPath.curves

                shapes.push(tmpShape)
            }

            return shapes
        }

        function isPointInsidePolygon(inPt: Vector2, inPolygon: Vector2[]): boolean {
            const polyLen = inPolygon.length

            // 点在多边形轮廓上 => 立即命中；
            // 否则统计过 inPt 的水平线与多边形边的交点（inPt 左侧），
            // 每次真实交点翻转 inside 状态。
            let inside = false
            for (let p = polyLen - 1, q = 0; q < polyLen; p = q++) {
                let edgeLowPt = inPolygon[p]
                let edgeHighPt = inPolygon[q]

                let edgeDx = edgeHighPt.x - edgeLowPt.x
                let edgeDy = edgeHighPt.y - edgeLowPt.y

                if (Math.abs(edgeDy) > Number.EPSILON) {
                    // 非平行
                    if (edgeDy < 0) {
                        edgeLowPt = inPolygon[q]
                        edgeDx = -edgeDx
                        edgeHighPt = inPolygon[p]
                        edgeDy = -edgeDy
                    }

                    if ((inPt.y < edgeLowPt.y) || (inPt.y > edgeHighPt.y)) continue

                    if (inPt.y === edgeLowPt.y) {
                        if (inPt.x === edgeLowPt.x) return true // inPt 在轮廓上
                    } else {
                        const perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y)
                        if (perpEdge === 0) return true // inPt 在轮廓上
                        if (perpEdge < 0) continue
                        inside = !inside // 真实的 inPt 左侧交点
                    }
                } else {
                    // 平行或共线
                    if (inPt.y !== edgeLowPt.y) continue // 平行
                    // 边与 inPt 在同一水平线上
                    if (((edgeHighPt.x <= inPt.x) && (inPt.x <= edgeLowPt.x)) ||
                        ((edgeLowPt.x <= inPt.x) && (inPt.x <= edgeHighPt.x))) return true // inPt 在轮廓上
                }
            }

            return inside
        }

        const isClockWise = ShapeUtils.isClockWise

        const subPaths = this.subPaths
        if (subPaths.length === 0) return []

        let solid: boolean
        let tmpPath: Path
        let tmpShape: Shape
        const shapes: Shape[] = []

        if (subPaths.length === 1) {
            tmpPath = subPaths[0]
            tmpShape = new Shape()
            tmpShape.curves = tmpPath.curves
            shapes.push(tmpShape)
            return shapes
        }

        let holesFirst = !isClockWise(subPaths[0].getPoints())
        holesFirst = isCCW ? !holesFirst : holesFirst

        const betterShapeHoles: { h: Path; p: Vector2 }[][] = []
        const newShapes: ({ s: Shape; p: Vector2[] } | undefined)[] = []
        let newShapeHoles: { h: Path; p: Vector2 }[][] = []
        let mainIdx = 0
        let tmpPoints: Vector2[]

        newShapes[mainIdx] = undefined
        newShapeHoles[mainIdx] = []

        for (let i = 0, l = subPaths.length; i < l; i++) {
            tmpPath = subPaths[i]
            tmpPoints = tmpPath.getPoints()
            solid = isClockWise(tmpPoints)
            solid = isCCW ? !solid : solid

            if (solid) {
                if ((!holesFirst) && (newShapes[mainIdx])) mainIdx++

                newShapes[mainIdx] = { s: new Shape(), p: tmpPoints }
                newShapes[mainIdx]!.s.curves = tmpPath.curves

                if (holesFirst) mainIdx++
                newShapeHoles[mainIdx] = []
            } else {
                newShapeHoles[mainIdx].push({ h: tmpPath, p: tmpPoints[0] })
            }
        }

        // 只有孔洞？可能所有形状方向都错了
        if (!newShapes[0]) return toShapesNoHoles(subPaths)

        if (newShapes.length > 1) {
            let ambiguous = false
            let toChange = 0

            for (let sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                betterShapeHoles[sIdx] = []
            }

            for (let sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                const sho = newShapeHoles[sIdx]

                for (let hIdx = 0; hIdx < sho.length; hIdx++) {
                    const ho = sho[hIdx]
                    let hole_unassigned = true

                    for (let s2Idx = 0; s2Idx < newShapes.length; s2Idx++) {
                        if (isPointInsidePolygon(ho.p, newShapes[s2Idx]!.p)) {
                            if (sIdx !== s2Idx) toChange++

                            if (hole_unassigned) {
                                hole_unassigned = false
                                betterShapeHoles[s2Idx].push(ho)
                            } else {
                                ambiguous = true
                            }
                        }
                    }

                    if (hole_unassigned) {
                        betterShapeHoles[sIdx].push(ho)
                    }
                }
            }

            if (toChange > 0 && ambiguous === false) {
                newShapeHoles = betterShapeHoles
            }
        }

        let tmpHoles: { h: Path; p: Vector2 }[]

        for (let i = 0, il = newShapes.length; i < il; i++) {
            tmpShape = newShapes[i]!.s
            shapes.push(tmpShape)
            tmpHoles = newShapeHoles[i]

            for (let j = 0, jl = tmpHoles.length; j < jl; j++) {
                tmpShape.holes.push(tmpHoles[j].h)
            }
        }

        return shapes
    }
}
