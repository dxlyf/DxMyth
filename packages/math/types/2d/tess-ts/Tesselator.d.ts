import { WINDING, ELEMENT } from './utils/constants';
import { TESSmesh } from './mesh/TESSmesh';
import { V3, V2 } from './type';
import { PriorityQ } from './utils/PriorityQ';
import { Dict } from './utils/Dict';
type TESSface = any;
type TESSedge = any;
export declare class Tesselator {
    /*** state needed for collecting the input data ***/
    mesh: TESSmesh;
    /*** state needed for projecting onto the sweep plane ***/
    normal: V3;
    sUnit: V3;
    tUnit: V3;
    bmin: V2;
    bmax: V2;
    /*** state needed for the line sweep ***/
    windingRule: WINDING;
    dict: Dict;
    pq: PriorityQ;
    event: any;
    vertexIndexCounter: number;
    vertices: Array<number>;
    vertexIndices: Array<number>;
    vertexCount: number;
    elements: Array<number>;
    elementCount: number;
    dot_(u: V3, v: V3): number;
    normalize_(v: V3): void;
    longAxis_(v: V3): number;
    computeNormal_(norm: V3): void;
    checkOrientation_(): void;
    projectPolygon_(): void;
    addWinding_(eDst: any, eSrc: any): void;
    tessellateMonoRegion_(mesh: any, face: TESSface): boolean;
    tessellateInterior_(mesh: TESSmesh): boolean;
    discardExterior_(mesh: TESSmesh): void;
    setWindingNumber_(mesh: TESSmesh, value: number, keepOnlyBoundary: boolean): void;
    getNeighbourFace_(edge: TESSedge): TESSedge;
    outputPolymesh_(mesh: TESSmesh, elementType: number, polySize: number, vertexSize: number): void;
    outputContours_(mesh: TESSmesh, vertexSize: number): void;
    addContour(size: number, vertices: Array<number>): void;
    /**
     * Run tesselation
     * @param windingRule
     * @param elementType
     * @param polySize
     * @param vertexSize
     * @param normal
     * @param validate UNSAFE! Skip mesh validation pass, may throw any error.
     */
    tesselate(windingRule: WINDING | undefined, elementType: ELEMENT | undefined, polySize: number, vertexSize: 2 | 3, normal: V3, validate?: boolean): boolean;
}
export {};
