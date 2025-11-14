import { Vec, VecLike } from '../Vec';
import { Geometry2d } from './Geometry2d';
/** @public */
export declare class Edge2d extends Geometry2d {
    private _start;
    private _end;
    private _d;
    private _u;
    private _ul;
    constructor(config: {
        start: Vec;
        end: Vec;
    });
    getLength(): number;
    getVertices(): Vec[];
    nearestPoint(point: VecLike): Vec;
    getSvgPathData(first?: boolean): string;
}
