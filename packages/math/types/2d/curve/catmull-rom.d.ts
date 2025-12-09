/**
 * 二维坐标点
 */
export interface Point {
    x: number;
    y: number;
}
/**
 * 二维向量
 */
export interface Vector {
    x: number;
    y: number;
}
/**
 * Catmull-Rom曲线类型枚举
 */
export declare enum CatmullRomType {
    /** 均匀参数化 */
    UNIFORM = "uniform",
    /** 准均匀参数化 */
    CENTRIPETAL = "centripetal",
    /** 弦长参数化 */
    CHORDAL = "chordal"
}
/**
 * 使用四个控制点计算Catmull-Rom曲线在参数t处的点
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数，默认为0.5（标准Catmull-Rom）
 * @returns 曲线上对应点的坐标
 */
export declare function catmullRomPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number, tension?: number): Point;
/**
 * 根据控制点数组生成Catmull-Rom曲线上的点
 * @param points 控制点数组（至少需要4个点）
 * @param segments 每段曲线生成的点数（不包括端点）
 * @param type Catmull-Rom曲线类型
 * @param tension 张力参数
 * @returns 生成的曲线上的点数组
 */
export declare function catmullRomCurve(points: Point[], segments?: number, type?: CatmullRomType, tension?: number): Point[];
/**
 * 为开环Catmull-Rom曲线生成端点扩展点
 * @param points 原始控制点数组
 * @returns 扩展后的控制点数组，包含额外的端点
 */
export declare function createExtendedPoints(points: Point[]): Point[];
/**
 * 生成闭合的Catmull-Rom曲线点
 * @param points 控制点数组（形成闭合曲线）
 * @param segments 每段曲线生成的点数
 * @param tension 张力参数
 * @returns 闭合曲线上的点数组
 */
export declare function closedCatmullRomCurve(points: Point[], segments?: number, tension?: number): Point[];
/**
 * 计算Catmull-Rom曲线在参数t处的一阶导数（切线向量）
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数
 * @returns 切线向量
 */
export declare function catmullRomDerivative(p0: Point, p1: Point, p2: Point, p3: Point, t: number, tension?: number): Vector;
/**
 * 计算Catmull-Rom曲线在参数t处的二阶导数
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数
 * @returns 二阶导数向量
 */
export declare function catmullRomSecondDerivative(p0: Point, p1: Point, p2: Point, p3: Point, t: number, tension?: number): Vector;
/**
 * 使用数值积分计算Catmull-Rom曲线段的长度
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param numSamples 采样点数，默认为100
 * @returns 曲线段长度
 */
export declare function catmullRomSegmentLength(p0: Point, p1: Point, p2: Point, p3: Point, tension?: number, numSamples?: number): number;
/**
 * 计算Catmull-Rom曲线的总长度
 * @param points 控制点数组
 * @param tension 张力参数
 * @param numSamplesPerSegment 每段的采样点数
 * @returns 曲线总长度
 */
export declare function catmullRomCurveLength(points: Point[], tension?: number, numSamplesPerSegment?: number): number;
/**
 * 细分Catmull-Rom曲线段
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param divisions 细分次数
 * @returns 细分后的控制点数组
 */
export declare function subdivideCatmullRomSegment(p0: Point, p1: Point, p2: Point, p3: Point, tension?: number, divisions?: number): Point[];
/**
 * 将点投影到Catmull-Rom曲线段上
 * @param point 要投影的点
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param iterations 二分迭代次数
 * @returns 投影点信息
 */
export declare function projectPointToCatmullRomSegment(point: Point, p0: Point, p1: Point, p2: Point, p3: Point, tension?: number, iterations?: number): {
    projection: Point;
    t: number;
    distance: number;
};
/**
 * 计算Catmull-Rom曲线段的曲率
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param t 曲线参数 [0, 1]
 * @param tension 张力参数
 * @returns 曲率值
 */
export declare function catmullRomCurvature(p0: Point, p1: Point, p2: Point, p3: Point, t: number, tension?: number): number;
/**
 * 寻找Catmull-Rom曲线段上的最大曲率点
 * @param p0 第一个控制点
 * @param p1 第二个控制点（起始点）
 * @param p2 第三个控制点（结束点）
 * @param p3 第四个控制点
 * @param tension 张力参数
 * @param samples 采样点数
 * @returns 最大曲率点信息
 */
export declare function findCatmullRomMaxCurvaturePoint(p0: Point, p1: Point, p2: Point, p3: Point, tension?: number, samples?: number): {
    t: number;
    curvature: number;
    point: Point;
};
/**
 * 使用向心参数化生成Catmull-Rom曲线点
 * @param points 控制点数组
 * @param alpha 向心参数，默认为0.5（标准向心型）
 * @param segments 每段曲线生成的点数
 * @param tension 张力参数
 * @returns 生成的曲线上的点数组
 */
export declare function centripetalCatmullRomCurve(points: Point[], alpha?: number, segments?: number, tension?: number): Point[];
