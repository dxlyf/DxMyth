/** SVG 弧线的端点参数化 */
export interface EndpointArcParams {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /** 椭圆 x 半轴 */
    rx: number;
    /** 椭圆 y 半轴 */
    ry: number;
    /** x 轴旋转角（弧度） */
    xAxisRotation: number;
    /** 是否走大弧（> 180°） */
    largeArcFlag: boolean;
    /** 是否逆时针方向 */
    sweepFlag: boolean;
}
/** 弧线的中心参数化 */
export interface CenterArcParams {
    /** 椭圆中心 x */
    cx: number;
    /** 椭圆中心 y */
    cy: number;
    /** 椭圆 x 半轴 */
    rx: number;
    /** 椭圆 y 半轴 */
    ry: number;
    /** 起始角（弧度） */
    startAngle: number;
    /** 扫描角（弧度），正值为逆时针 */
    sweepAngle: number;
    /** x 轴旋转角（弧度） */
    xAxisRotation: number;
}
/** 中心参数化转回端点时的返回类型 */
export interface EndpointArcResult {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    largeArcFlag: boolean;
    sweepFlag: boolean;
}
export declare function normalizeAngles(startAngle: number, endAngle: number, ccw?: boolean): {
    startAngle: number;
    endAngle: number;
};
/**
 * 将 SVG 端点参数化转换为中心参数化。
 *
 * 算法步骤（对应 SVG 规范 F.6.5）：
 * 1. 将端点变换到椭圆局部坐标系
 * 2. 修正 rx/ry（如果太小无法连接两端点，按比例放大）
 * 3. 计算椭圆中心在局部坐标系中的位置
 * 4. 将中心变换回全局坐标系
 * 5. 计算 startAngle 和 sweepAngle
 */
export declare function endpointToCenter(params: EndpointArcParams): CenterArcParams;
/**
 * 将中心参数化转换回端点参数化（endpointToCenter 的逆运算）。
 *
 * 算法步骤：
 * 1. 在局部坐标系中根据 startAngle 和 sweepAngle 计算两端点
 * 2. 将端点旋转回全局坐标系
 * 3. 根据 sweepAngle 推导 largeArcFlag 和 sweepFlag
 */
export declare function centerToEndpoint(params: CenterArcParams): EndpointArcResult;
/** 椭圆弧的几何表示 */
export interface ArcOvalResult {
    /** 椭圆中心 x */
    cx: number;
    /** 椭圆中心 y */
    cy: number;
    /** 椭圆 x 半轴 */
    rx: number;
    /** 椭圆 y 半轴 */
    ry: number;
    /** 起始角（弧度） */
    startAngle: number;
    /** 结束角（弧度） */
    endAngle: number;
    /** 是否逆时针 */
    counterclockwise: boolean;
    /** x 轴旋转角（弧度） */
    xAxisRotation: number;
}
/**
 * 将 SVG 弧线端点参数转换为椭圆弧几何表示。
 *
 * 组合 endpointToCenter，输出 startAngle 和 endAngle（而非 sweepAngle），
 * 方便直接用于 canvas arc() 等 API。
 */
export declare function arcToOval(params: EndpointArcParams): ArcOvalResult;
/** 三次贝塞尔曲线段 */
export interface CubicBezierPoints {
    /** 起点 */
    p1: {
        x: number;
        y: number;
    };
    /** 控制点 1 */
    cp1: {
        x: number;
        y: number;
    };
    /** 控制点 2 */
    cp2: {
        x: number;
        y: number;
    };
    /** 终点 */
    p2: {
        x: number;
        y: number;
    };
}
/**
 * 将椭圆弧近似为三次贝塞尔曲线。
 *
 * 基于公式 k = (4/3) * tan(θ/4)：
 * 1. 在单位圆上计算切点及切线方向的缩放因子
 * 2. 按 rx/ry 缩放到椭圆
 * 3. 按 xAxisRotation 旋转
 * 4. 平移到 (cx, cy)
 *
 * @param cx        椭圆中心 x
 * @param cy        椭圆中心 y
 * @param rx        椭圆 x 半轴
 * @param ry        椭圆 y 半轴
 * @param xAxisRotation x 轴旋转角（弧度）
 * @param startAngle 起始角（弧度）
 * @param deltaAngle 角度跨度（弧度），正值逆时针
 */
export declare function ellipticalArcToCubicBezier(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, startAngle: number, deltaAngle: number): CubicBezierPoints;
/**
 * 将椭圆（或椭圆弧）近似为多段三次贝塞尔曲线。
 *
 * 会自动将弧度按每段不超过 segmentAngle（默认 π/2，即 90°）切分，
 * 保证每段近似精度。
 *
 * @param cx        椭圆中心 x
 * @param cy        椭圆中心 y
 * @param rx        椭圆 x 半轴
 * @param ry        椭圆 y 半轴
 * @param xAxisRotation x 轴旋转角（弧度）
 * @param startAngle 起始角（弧度）
 * @param endAngle   结束角（弧度）
 * @param counterclockwise 是否逆时针，默认 false（顺时针）
 * @param segmentAngle 每段最大角度（弧度），默认 π/2（90°）
 */
export declare function ellipseToCubics(cx: number, cy: number, rx: number, ry: number, xAxisRotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean, segmentAngle?: number): CubicBezierPoints[];
