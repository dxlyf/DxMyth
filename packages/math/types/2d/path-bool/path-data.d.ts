import { Path } from './primitives/Path';
import { PathCommand } from './primitives/PathCommand';
export declare function commandsFromPathData(d: string): Iterable<PathCommand>;
export declare function pathFromPathData(d: string): Path;
export declare function pathToPathData(path: Path, eps?: number): string;
