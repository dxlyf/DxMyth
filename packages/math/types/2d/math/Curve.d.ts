/**
 * 常用曲线处理工具函数
 */
/** 线性插值 */
export declare function lerp(a: number, b: number, t: number): number;
/** 二次贝塞尔 */
export declare function quadBezier(p0: number, p1: number, p2: number, t: number): number;
/** 三次贝塞尔 */
export declare function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number;
/** 缓动函数：ease-in */
export declare function easeIn(t: number, power?: number): number;
/** 缓动函数：ease-out */
export declare function easeOut(t: number, power?: number): number;
/** 缓动函数：ease-in-out */
export declare function easeInOut(t: number, power?: number): number;
/** 样条插值（Catmull-Rom） */
export declare function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number;
/** 将 t 映射到分段贝塞尔曲线，segments 为每段控制点数组 */
export declare function piecewiseBezier(segments: number[][], t: number): number;
/** 计算贝塞尔曲线长度（近似） */
export declare function bezierLength(points: number[], steps?: number): number;
/** 角度转弧度 */
export declare function degToRad(deg: number): number;
/** 弧度转角度 */
export declare function radToDeg(rad: number): number;
/** SVG arc: 从端点参数计算圆心坐标 */
export declare function svgArcToCenter(x1: number, y1: number, rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, x2: number, y2: number): {
    centerX: number;
    centerY: number;
    startAngleRad: number;
    endAngleRad: number;
    radiusX: number;
    radiusY: number;
    xAxisRotationRad: number;
};
/** SVG arc: 从圆心坐标计算端点参数 */
export declare function svgArcFromCenter(centerX: number, centerY: number, rx: number, ry: number, xAxisRotationRad: number, startAngleRad: number, endAngleRad: number, sweepFlag?: boolean): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    xAxisRotation: number;
    largeArcFlag: boolean;
    sweepFlag: boolean;
};
/** SVG arc: 计算圆弧上的点 */
export declare function svgArcPoint(centerX: number, centerY: number, rx: number, ry: number, xAxisRotationRad: number, angleRad: number): {
    x: number;
    y: number;
};
/** 二次贝塞尔曲线细分（德卡斯特里奥算法） */
export declare function subdivideQuadBezier(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, t?: number): {
    left: [{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }];
    right: [{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }];
};
/** 三次贝塞尔曲线细分（德卡斯特里奥算法） */
export declare function subdivideCubicBezier(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t?: number): {
    left: [{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }];
    right: [{
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }];
};
/** 二次贝塞尔曲线升阶到三次 */
export declare function elevateQuadToCubic(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}): [{
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}];
/** 三次贝塞尔曲线降阶到二次（近似） */
export declare function reduceCubicToQuad(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}): [{
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}];
/** 二次贝塞尔曲线求导（切线向量） */
export declare function quadBezierDerivative(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 三次贝塞尔曲线求导（切线向量） */
export declare function cubicBezierDerivative(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 二次贝塞尔曲线求二次导数 */
export declare function quadBezierSecondDerivative(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 三次贝塞尔曲线求二次导数 */
export declare function cubicBezierSecondDerivative(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 二次贝塞尔曲线求极值点 */
export declare function quadBezierExtrema(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}): {
    xExtrema: number[];
    yExtrema: number[];
};
/** 三次贝塞尔曲线求极值点 */
export declare function cubicBezierExtrema(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}): {
    xExtrema: number[];
    yExtrema: number[];
};
/** 计算二次贝塞尔曲线的曲率 */
export declare function quadBezierCurvature(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, t: number): number;
/** 计算三次贝塞尔曲线的曲率 */
export declare function cubicBezierCurvature(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t: number): number;
/** 求二次贝塞尔曲线的最大曲率点 */
export declare function quadBezierMaxCurvature(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, samples?: number): {
    maxCurvature: number;
    t: number;
    point: {
        x: number;
        y: number;
    };
};
/** 求三次贝塞尔曲线的最大曲率点 */
export declare function cubicBezierMaxCurvature(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, samples?: number): {
    maxCurvature: number;
    t: number;
    point: {
        x: number;
        y: number;
    };
};
/** 二次贝塞尔曲线参数方程（为了与其他函数保持一致） */
export declare function quadBezierParametric(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** 三次贝塞尔曲线参数方程（为了与其他函数保持一致） */
export declare function cubicBezierParametric(p0: {
    x: number;
    y: number;
}, p1: {
    x: number;
    y: number;
}, p2: {
    x: number;
    y: number;
}, p3: {
    x: number;
    y: number;
}, t: number): {
    x: number;
    y: number;
};
/** N阶贝塞尔曲线参数方程 */
export declare function nBezierParametric(controlPoints: {
    x: number;
    y: number;
}[], t: number): {
    x: number;
    y: number;
};
/** N阶贝塞尔曲线求导 - 返回求导后的控制点 */
export declare function nBezierDerivative(controlPoints: {
    x: number;
    y: number;
}[]): {
    x: number;
    y: number;
}[];
/** N阶贝塞尔曲线求k阶导数 - 返回k阶导数后的控制点 */
export declare function nBezierKthDerivative(controlPoints: {
    x: number;
    y: number;
}[], k: number): {
    x: number;
    y: number;
}[];
/** N阶贝塞尔曲线在指定点的导数值（切线向量） */
export declare function nBezierDerivativeAt(controlPoints: {
    x: number;
    y: number;
}[], t: number): {
    x: number;
    y: number;
};
/** N阶贝塞尔曲线在指定点的k阶导数值 */
export declare function nBezierKthDerivativeAt(controlPoints: {
    x: number;
    y: number;
}[], t: number, k: number): {
    x: number;
    y: number;
};
/** N阶贝塞尔曲线细分（德卡斯特里奥算法） */
export declare function nBezierSubdivide(controlPoints: {
    x: number;
    y: number;
}[], t?: number): {
    left: {
        x: number;
        y: number;
    }[];
    right: {
        x: number;
        y: number;
    }[];
};
/** N阶贝塞尔曲线升阶 */
export declare function nBezierElevate(controlPoints: {
    x: number;
    y: number;
}[]): {
    x: number;
    y: number;
}[];
/** N阶贝塞尔曲线降阶（近似） */
export declare function nBezierReduce(controlPoints: {
    x: number;
    y: number;
}[], targetOrder?: number): {
    x: number;
    y: number;
}[];
/** N阶贝塞尔曲线求极值点 */
export declare function nBezierExtrema(controlPoints: {
    x: number;
    y: number;
}[]): {
    xExtrema: number[];
    yExtrema: number[];
};
/** 计算N阶贝塞尔曲线的曲率 */
export declare function nBezierCurvature(controlPoints: {
    x: number;
    y: number;
}[], t: number): number;
/** 求N阶贝塞尔曲线的最大曲率点 */
export declare function nBezierMaxCurvature(controlPoints: {
    x: number;
    y: number;
}[], samples?: number): {
    maxCurvature: number;
    t: number;
    point: {
        x: number;
        y: number;
    };
};
