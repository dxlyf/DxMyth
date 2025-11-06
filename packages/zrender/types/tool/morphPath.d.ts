import { default as Path } from '../graphic/Path';
import { default as Element, ElementAnimateConfig } from '../Element';
import { split } from './dividePath';
/**
 * Make two bezier arrays aligns on structure. To have better animation.
 *
 * It will:
 * Make two bezier arrays have same number of subpaths.
 * Make each subpath has equal number of bezier curves.
 *
 * array is the convert result of pathToBezierCurves.
 */
export declare function alignBezierCurves(array1: number[][], array2: number[][]): any[][];
export interface CombineMorphingPath extends Path {
    childrenRef(): (CombineMorphingPath | Path)[];
    __isCombineMorphing: boolean;
}
export declare function centroid(array: number[]): number[];
export declare function isCombineMorphing(path: Element): path is CombineMorphingPath;
export declare function isMorphing(el: Element): boolean;
/**
 * Morphing from old path to new path.
 */
export declare function morphPath(fromPath: Path, toPath: Path, animationOpts: ElementAnimateConfig): Path;
export interface DividePathParams {
    path: Path;
    count: number;
}
export interface DividePath {
    (params: DividePathParams): Path[];
}
export interface IndividualDelay {
    (index: number, count: number, fromPath: Path, toPath: Path): number;
}
export interface CombineConfig extends ElementAnimateConfig {
    /**
     * Transform of returned will be ignored.
     */
    dividePath?: DividePath;
    /**
     * delay of each individual.
     * Because individual are sorted on z-order. The index is also sorted top-left / right-down.
     */
    individualDelay?: IndividualDelay;
}
/**
 * Make combine morphing from many paths to one.
 * Will return a group to replace the original path.
 */
export declare function combineMorph(fromList: (CombineMorphingPath | Path)[], toPath: Path, animationOpts: CombineConfig): {
    fromIndividuals: Path<import('../graphic/Path').PathProps>[];
    toIndividuals: any[];
    count: number;
};
export interface SeparateConfig extends ElementAnimateConfig {
    dividePath?: DividePath;
    individualDelay?: IndividualDelay;
}
/**
 * Make separate morphing from one path to many paths.
 * Make the MorphingKind of `toPath` become `'ONE_ONE'`.
 */
export declare function separateMorph(fromPath: Path, toPathList: Path[], animationOpts: SeparateConfig): {
    fromIndividuals: Path[];
    toIndividuals: Path[];
    count: number;
};
export { split as defaultDividePath };
