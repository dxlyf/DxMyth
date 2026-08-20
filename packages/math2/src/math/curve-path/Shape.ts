// ============================================================
// Shape — 2D 形状：Path + 可选孔洞，可获取点或三角化面
// 移植自 three.js extras/core/Shape.js
// ============================================================

import { Vector2 } from '../Vector2'
import { Path } from './Path'
import { generateUUID } from './Utils'
import type { CurveJSON } from './Curve'

export class Shape extends Path {
    /** 形状的 UUID */
    uuid: string

    /** 孔洞列表（孔洞绕向需与外轮廓相反 CW/CCW） */
    holes: Path[] = []

    constructor(points?: Vector2[]) {
        super(points)
        this.uuid = generateUUID()
        this.type = 'Shape'
    }

    /** 返回每个孔洞轮廓的点数组 */
    getPointsHoles(divisions: number): Vector2[][] {
        const holesPts: Vector2[][] = []

        for (let i = 0, l = this.holes.length; i < l; i++) {
            holesPts[i] = this.holes[i].getPoints(divisions)
        }

        return holesPts
    }

    /** 返回形状及孔洞的轮廓点数据 */
    extractPoints(divisions: number): { shape: Vector2[]; holes: Vector2[][] } {
        return {
            shape: this.getPoints(divisions),
            holes: this.getPointsHoles(divisions)
        }
    }

    copy(source: Shape): this {
        super.copy(source)

        this.holes = []
        for (let i = 0, l = source.holes.length; i < l; i++) {
            this.holes.push(source.holes[i].clone())
        }

        return this
    }

    toJSON(): CurveJSON {
        const data = super.toJSON()

        data.uuid = this.uuid
        data.holes = []

        for (let i = 0, l = this.holes.length; i < l; i++) {
            data.holes.push(this.holes[i].toJSON())
        }

        return data
    }

    fromJSON(json: CurveJSON & { uuid?: string; holes?: CurveJSON[] }): this {
        super.fromJSON(json)

        this.uuid = json.uuid ?? this.uuid
        this.holes = []

        const list = json.holes ?? []
        for (let i = 0, l = list.length; i < l; i++) {
            this.holes.push(new Path().fromJSON(list[i]))
        }

        return this
    }
}
