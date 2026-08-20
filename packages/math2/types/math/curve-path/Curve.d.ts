import { Vector2 } from '../Vector2';
import { Vector3 } from '../Vector3';
/** 曲线序列化 JSON 结构（宽松类型） */
export interface CurveJSON {
    metadata?: {
        version: number;
        type: string;
        generator: string;
    };
    arcLengthDivisions?: number;
    type?: string;
    [key: string]: any;
}
/** 曲线采样点类型：2D 或 3D 向量 */
export type CurvePoint = Vector2 | Vector3;
/** 判断曲线点是否为 2D 向量 */
export declare function isVector2Point(p: CurvePoint): boolean;
/** 两个曲线点之间的距离（自动适配 2D/3D） */
export declare function pointDistance(a: CurvePoint, b: CurvePoint): number;
/** 两个曲线点是否相等（自动适配 2D/3D） */
export declare function pointEquals(a: CurvePoint, b: CurvePoint): boolean;
/**
 * 解析曲线抽象基类。
 * 通过泛型 T 约束曲线所在空间的向量类型（Vector2 / Vector3）。
 */
export declare abstract class Curve<T extends CurvePoint = CurvePoint> {
    type: string;
    /** 计算累计段长时使用的细分数量 */
    arcLengthDivisions: number;
    /** 曲线参数变化时必须设为 true，用于使弧长缓存失效 */
    needsUpdate: boolean;
    /** 预计算的累计弧长缓存 */
    cacheArcLengths: number[] | null;
    isEllipseCurve?: boolean;
    isLineCurve?: boolean;
    isLineCurve3?: boolean;
    isSplineCurve?: boolean;
    isCatmullRomCurve3?: boolean;
    /** SplineCurve / CatmullRomCurve3 的控制点 */
    points?: T[];
    /**
     * 返回曲线上参数 t 处的点。
     * @param t 插值因子，范围 [0,1]
     * @param optionalTarget 可选的目标向量（结果写入其中）
     */
    abstract getPoint(t: number, optionalTarget?: T): T;
    /**
     * 按弧长等距采样：先做 u→t 映射，再求点。
     * @param u 插值因子，范围 [0,1]
     */
    getPointAt(u: number, optionalTarget?: T): T;
    /**
     * 通过 getPoint 采样曲线，返回曲线形状的点数组。
     * @param divisions 细分数量，返回点数 = divisions + 1
     */
    getPoints(divisions?: number): T[];
    /**
     * 通过 getPointAt 采样曲线，返回等弧长间隔的点数组。
     * @param divisions 细分数量，返回点数 = divisions + 1
     */
    getSpacedPoints(divisions?: number): T[];
    /** 返回曲线总弧长 */
    getLength(): number;
    /**
     * 返回累计段长数组。
     * @param divisions 细分数量，默认 this.arcLengthDivisions
     */
    getLengths(divisions?: number): number[];
    /**
     * 使累计段长缓存失效并重算。曲线参数每次变化后都应调用。
     */
    updateArcLengths(): void;
    /**
     * 将弧长参数 u（或给定距离 distance）映射为参数 t，用于等距采样。
     * @param u 插值因子，范围 [0,1]
     * @param distance 可选的曲线上距离
     */
    getUtoTmapping(u: number, distance?: number | null): number;
    /**
     * 返回参数 t 处的单位切向量。
     * 若子类未实现解析切线，则用相邻两点差分近似。
     */
    getTangent(t: number, optionalTarget?: T): T;
    /** 等弧长采样版本的 getTangent */
    getTangentAt(u: number, optionalTarget?: T): T;
    /**
     * 生成 Frenet 标架（需 3D 曲线），用于 TubeGeometry / ExtrudeGeometry。
     * @param segments 段数
     * @param closed 是否闭合
     */
    computeFrenetFrames(segments: number, closed?: boolean): {
        tangents: Vector3[];
        normals: Vector3[];
        binormals: Vector3[];
    };
    /** 返回当前曲线副本 */
    clone(): this;
    /** 将 source 的值复制到当前曲线 */
    copy(source: Curve<T>): this;
    /** 序列化为 JSON */
    toJSON(): CurveJSON;
    /** 从 JSON 反序列化 */
    fromJSON(json: CurveJSON): this;
}
