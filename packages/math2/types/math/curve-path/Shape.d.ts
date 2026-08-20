import { Vector2 } from '../Vector2';
import { Path } from './Path';
import { CurveJSON } from './Curve';
export declare class Shape extends Path {
    /** 形状的 UUID */
    uuid: string;
    /** 孔洞列表（孔洞绕向需与外轮廓相反 CW/CCW） */
    holes: Path[];
    constructor(points?: Vector2[]);
    /** 返回每个孔洞轮廓的点数组 */
    getPointsHoles(divisions: number): Vector2[][];
    /** 返回形状及孔洞的轮廓点数据 */
    extractPoints(divisions: number): {
        shape: Vector2[];
        holes: Vector2[][];
    };
    copy(source: Shape): this;
    toJSON(): CurveJSON;
    fromJSON(json: CurveJSON & {
        uuid?: string;
        holes?: CurveJSON[];
    }): this;
}
