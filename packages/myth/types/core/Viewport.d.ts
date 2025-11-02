import { BoundingRect } from '../../../../../../../../src/math/BoundingRect';
import { IViewport } from '../../../../../../../../src/types/core/Viewport';
export declare class Viewport implements IViewport {
    rect: import('@dxyl/math/types/2d').BoundingRect;
    matrix: import('@dxyl/math/types/2d').Matrix2D;
    constructor();
    get left(): number;
    get top(): number;
    get right(): number;
    get bottom(): number;
    copy(source: Viewport): this;
    clone(): Viewport;
    multiptyScalar(scale: number): this;
    setViertport(x: number, y: number, width: number, height: number): void;
    intersect(rect: BoundingRect): boolean;
}
