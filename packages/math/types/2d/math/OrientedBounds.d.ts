import { AxisAlignedBounds } from './AxisAlignedBounds';
import { Point } from './points';
import { Matrix } from './matrix/Matrix';
/**
 * An oriented bounding box is a rotated rectangle.
 *
 * An oriented bounding box is modelled by rotating its (axis-aligned) {@link OrientedBounds#innerBounds}
 * by an angle {@link OrientedBounds#angle} around its center. The center of an oriented bounding box and
 * its axis-aligned inner-bounds coincide.
 *
 * @public
 */
export declare class OrientedBounds {
    innerBounds: AxisAlignedBounds;
    currentID: number;
    dirtyID: number;
    protected _rotation: number;
    protected _center: Point;
    protected _hull: [Point, Point, Point, Point];
    protected _matrix: Matrix;
    /**
     * @param innerBounds
     * @param angle
     */
    constructor(innerBounds: AxisAlignedBounds, angle?: number);
    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @param angle
     */
    constructor(x?: number, y?: number, width?: number, height?: number, angle?: number);
    /**
     * The angle, in radians, by which this bounding box is tilted.
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * The center of this bounding box.
     *
     * The center of this and {@code this.innerBounds} will always coincide.
     */
    get center(): Point;
    set center(value: Point);
    /**
     * The four-corners of this bounding, in clockwise order starting from the top-left.
     *
     * @readonly
     */
    get hull(): [Point, Point, Point, Point];
    /**
     * The top-left corner of this bounding box. The returned instance should not be modified directly.
     *
     * @readonly
     */
    get topLeft(): Point;
    /**
     * The top-right corner of this bounding box. The returned instance should not be modified directly.
     *
     * @readonly
     */
    get topRight(): Point;
    /**
     * The bottom-right corner of this bounding box. The returned instance should not be modified directly.
     */
    get bottomRight(): Point;
    /**
     * The bottom-left corner of this bounding box. The returned instance should not be modified directly.
     */
    get bottomLeft(): Point;
    /**
     * Checks whether the given {@code bounds} are equal to this.
     *
     * @param bounds
     */
    equals(bounds: OrientedBounds): boolean;
    /**
     * Whether this bounding box contains the given point
     *
     * @param point
     */
    contains(point: Point | number, y?: number): boolean;
    /**
     * Copies {@code bounds} into this instance.
     *
     * @param bounds
     */
    copyFrom(bounds: OrientedBounds): this;
    /**
     * Whether any internal state needs to be recalculated.
     */
    protected isDirty(): boolean;
    /**
     * This will recalculate the center, orientation matrix, and the hull vertices. It should be called only if
     * {@code this.isDirty} returns true.
     */
    protected update(): void;
    _onUpdate(): void;
    /**
     * This will translate {@link OrientedBounds#innerBounds} after {@link OrientedBounds#center} is
     * changed to ensure consistency.
     */
    private updateCenter;
}
