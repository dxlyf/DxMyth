import { Vector } from './Vector';
export type AbsolutePathCommand = ["M", Vector] | ["L", Vector] | ["C", Vector, Vector, Vector] | ["S", Vector, Vector] | ["Q", Vector, Vector] | ["T", Vector] | ["A", number, number, number, boolean, boolean, Vector] | ["Z"] | ["z"];
type RelativePathCommand = ["H", number] | ["V", number] | ["m", number, number] | ["l", number, number] | ["h", number] | ["v", number] | ["c", number, number, number, number, number, number] | ["s", number, number, number, number] | ["q", number, number, number, number] | ["t", number, number] | ["a", number, number, number, boolean, boolean, number, number];
export type PathCommand = AbsolutePathCommand | RelativePathCommand;
export declare function toAbsoluteCommands(commands: Iterable<PathCommand>): Iterable<AbsolutePathCommand>;
export {};
