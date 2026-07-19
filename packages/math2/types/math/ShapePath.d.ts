import { BoundingRect } from './BoundingRect';
import { PathBuilder } from './PathBuilder';
import { BoolOp } from './PathBool';
type FillRule = "evenodd" | "nonzero";
type LineCap = "butt" | "round" | "square";
type LineJoin = "miter" | "round" | "bevel";
type StrokeAlign = "center" | "outside" | "inside";
type StrokeOptions = {
    lineWidth: number;
    lineJoin: LineJoin;
    lineCap: LineCap;
    strokeAlign: StrokeAlign;
    miterLimit: number;
};
export declare const CKPathCMD: {
    MOVE: number;
    LINE: number;
    QUAD: number;
    CONIC: number;
    CUBIC: number;
    CLOSE: number;
};
export declare class ShapePath extends PathBuilder {
    _strokePath: PathBuilder;
    _computeStrokeTightBounds: BoundingRect;
    strokeOptions: StrokeOptions;
    fillRule: FillRule;
    constructor();
    setStroke(options: Partial<StrokeOptions>): void;
    setFillRule(fillRule: FillRule): void;
    markDirty(): void;
    get strokePath(): PathBuilder;
    getFillPath2D(): Path2D;
    getStrokePath2D(): Path2D;
    opFillPath(other: PathBuilder, op: BoolOp): PathBuilder;
    opStrokePath(other: PathBuilder, op: BoolOp): PathBuilder;
    isPointInStrokePath(x: number, y: number): boolean;
    computeStrokeTightBounds(): BoundingRect;
}
export {};
