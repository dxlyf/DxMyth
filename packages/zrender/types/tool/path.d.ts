import { default as Path, PathProps } from '../graphic/Path';
import { MatrixArray } from '../core/matrix';
type SVGPathOption = Omit<PathProps, 'shape' | 'buildPath'>;
declare class SVGPath extends Path {
    applyTransform(m: MatrixArray): void;
}
/**
 * Create a Path object from path string data
 * http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  opts Other options
 */
export declare function createFromString(str: string, opts?: SVGPathOption): SVGPath;
/**
 * Create a Path class from path string data
 * @param  str
 * @param  opts Other options
 */
export declare function extendFromString(str: string, defaultOpts?: SVGPathOption): typeof SVGPath;
/**
 * Merge multiple paths
 */
export declare function mergePath(pathEls: Path[], opts: PathProps): Path<PathProps>;
/**
 * Clone a path.
 */
export declare function clonePath(sourcePath: Path, opts?: {
    /**
     * If bake global transform to path.
     */
    bakeTransform?: boolean;
    /**
     * Convert global transform to local.
     */
    toLocal?: boolean;
}): Path<PathProps>;
export {};
