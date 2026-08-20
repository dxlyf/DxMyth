import { EllipseCurve } from './EllipseCurve';
export declare class ArcCurve extends EllipseCurve {
    isArcCurve: boolean;
    type: string;
    constructor(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean);
}
