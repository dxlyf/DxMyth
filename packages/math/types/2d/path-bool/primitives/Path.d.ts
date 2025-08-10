import { PathCommand } from './PathCommand';
import { PathSegment } from './PathSegment';
export type Path = PathSegment[];
export declare function pathFromCommands(commands: Iterable<PathCommand>): Iterable<PathSegment>;
export declare function pathToCommands(segments: Iterable<PathSegment>, eps?: number): Iterable<PathCommand>;
