export function UnitBezier(p1x: any, p1y: any, p2x: any, p2y: any): void;
export class UnitBezier {
    constructor(p1x: any, p1y: any, p2x: any, p2y: any);
    cx: number;
    bx: number;
    ax: number;
    cy: number;
    by: number;
    ay: number;
    p1x: any;
    p1y: any;
    p2x: any;
    p2y: any;
    sampleCurveX: (t: any) => number;
    sampleCurveY: (t: any) => number;
    sampleCurveDerivativeX: (t: any) => number;
    solveCurveX: (x: any, epsilon: any) => any;
    solve: (x: any, epsilon: any) => number;
}
