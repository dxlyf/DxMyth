import { Vec2Value } from '../../common/Vec2';
import { PolygonShape } from './PolygonShape';
declare module "./BoxShape" {
    /** @hidden @deprecated Use new keyword. */
    function BoxShape(halfWidth: number, halfHeight: number, center?: Vec2Value, angle?: number): BoxShape;
}
/**
 * A rectangle polygon which extend PolygonShape.
 */
export declare class BoxShape extends PolygonShape {
    static TYPE: "polygon";
    /**
     *
     * @param halfWidth
     * @param halfHeight
     * @param center coordinate of the center of the box relative to the body
     * @param angle angle of the box relative to the body
     */
    constructor(halfWidth: number, halfHeight: number, center?: Vec2Value, angle?: number);
}
export { BoxShape as Box };
