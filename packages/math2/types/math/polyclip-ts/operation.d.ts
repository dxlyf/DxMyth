import { Geom } from './geom-in.js';
import * as geomIn from "./geom-in.js";
export declare class Operation {
    type: string;
    numMultiPolys: number;
    run(type: string, geom: Geom, moreGeoms: Geom[]): geomIn.MultiPoly;
}
declare const operation: Operation;
export default operation;
