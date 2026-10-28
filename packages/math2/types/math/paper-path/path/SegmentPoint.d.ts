import { Point } from '../basic/Point';
import { Segment } from './Segment';
export declare class SegmentPoint extends Point {
    /** 该点所属的 segment。 */
    _owner: Segment;
    constructor(point: Point | undefined, owner: Segment);
    _set(x: number, y: number, dontNotify?: boolean): this;
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    isZero(): boolean;
}
