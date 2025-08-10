import * as bn from "src/2d/utils/bignumber";
export interface Vector {
    x: bn.BigNumber;
    y: bn.BigNumber;
}
export declare const crossProduct: (a: Vector, b: Vector) => bn.BigNumber;
export declare const dotProduct: (a: Vector, b: Vector) => bn.BigNumber;
export declare const length: (v: Vector) => bn.BigNumber;
export declare const sineOfAngle: (pShared: Vector, pBase: Vector, pAngle: Vector) => bn.BigNumber;
export declare const cosineOfAngle: (pShared: Vector, pBase: Vector, pAngle: Vector) => bn.BigNumber;
export declare const horizontalIntersection: (pt: Vector, v: Vector, y: bn.BigNumber) => {
    x: bn.BigNumber;
    y: bn.BigNumber;
} | null;
export declare const verticalIntersection: (pt: Vector, v: Vector, x: bn.BigNumber) => {
    x: bn.BigNumber;
    y: bn.BigNumber;
} | null;
export declare const intersection: (pt1: Vector, v1: Vector, pt2: Vector, v2: Vector) => Vector | null;
export declare const perpendicular: (v: Vector) => {
    x: bn.BigNumber;
    y: bn.BigNumber;
};
