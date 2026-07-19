import { Path64, PathD, Paths64, PathsD } from './Core.js';
export declare const Minkowski: {
    sum(pattern: Path64, path: Path64, isClosed: boolean): Paths64;
    sumD(pattern: PathD, path: PathD, isClosed: boolean, decimalPlaces?: number): PathsD;
    diff(pattern: Path64, path: Path64, isClosed: boolean): Paths64;
    diffD(pattern: PathD, path: PathD, isClosed: boolean, decimalPlaces?: number): PathsD;
};
