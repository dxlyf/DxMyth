import { default as Path, PathProps } from '../Path';
export declare class SectorShape {
    cx: number;
    cy: number;
    r0: number;
    r: number;
    startAngle: number;
    endAngle: number;
    clockwise: boolean;
    /**
     * Corner radius of sector
     *
     * clockwise, from inside to outside, four corners are
     * inner start -> inner end
     * outer start -> outer end
     *
     * 5               => [5, 5, 5, 5]
     * [5]             => [5, 5, 0, 0]
     * [5, 10]         => [5, 5, 10, 10]
     * [5, 10, 15]     => [5, 10, 15, 15]
     * [5, 10, 15, 20] => [5, 10, 15, 20]
     */
    cornerRadius: number | number[];
}
export interface SectorProps extends PathProps {
    shape?: Partial<SectorShape>;
}
declare class Sector extends Path<SectorProps> {
    shape: SectorShape;
    constructor(opts?: SectorProps);
    getDefaultShape(): SectorShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: SectorShape): void;
    isZeroArea(): boolean;
}
export default Sector;
