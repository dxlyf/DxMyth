import { Path } from './primitives/Path';
export declare enum PathBooleanOperation {
    Union = 0,
    Difference = 1,
    Intersection = 2,
    Exclusion = 3,
    Division = 4,
    Fracture = 5
}
export declare enum FillRule {
    NonZero = 0,
    EvenOdd = 1
}
export declare function pathBoolean(a: Path, aFillRule: FillRule, b: Path, bFillRule: FillRule, op: PathBooleanOperation): Path[];
