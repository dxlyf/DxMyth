import { warn } from "src/utils/logging/warn";
import { Matrix } from "./matrix/Matrix";
import { ObservablePoint } from "./point/ObservablePoint";
import { PointData } from "./point/PointData";
import { DEG_TO_RAD, RAD_TO_DEG } from "./misc/const";

const defaultSkew = new ObservablePoint(null);
const defaultPivot = new ObservablePoint(null);
const defaultScale = new ObservablePoint(null, 1, 1);
const defaultOrigin = new ObservablePoint(null);

/**
 * Options for updating the transform of a container.
 * @category scene
 * @standard
 */
export interface UpdateTransformOptions {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    skewX: number;
    skewY: number;
    pivotX: number;
    pivotY: number;
    originX: number;
    originY: number;
}
export class Transformable {
    parent: Transformable;
    public didChange = false;
    // same as above, but for the renderable
    /** @private */
    public didViewUpdate = false;
    /**
   * A value that increments each time the containe is modified
   * eg children added, removed etc
   * @ignore
   */
    public _didContainerChangeTick = 0;
    /**
     * A value that increments each time the container view is modified
     * eg texture swap, geometry change etc
     * @ignore
     */
    public _didViewChangeTick = 0;
     // used by the transform system to check if a container needs to be updated that frame
    // if the tick matches the current transform system tick, it is not updated again
    /** @internal */
    public updateTick = -1;

    /**
     * Current transform of the object based on local factors: position, scale, other stuff.
     * This matrix represents the local transformation without any parent influence.
     * @example
     * ```ts
     * // Basic transform access
     * const localMatrix = sprite.localTransform;
     * console.log(localMatrix.toString());
     * ```
     * @readonly
     * @see {@link Container#worldTransform} For global transform
     * @see {@link Container#groupTransform} For render group transform
     */
    public localTransform: Matrix = new Matrix();
    /**
     * The relative group transform is a transform relative to the render group it belongs too. It will include all parent
     * transforms and up to the render group (think of it as kind of like a stage - but the stage can be nested).
     * If this container is is self a render group matrix will be relative to its parent render group
     * @readonly
     * @advanced
     */
    public relativeGroupTransform: Matrix = new Matrix();
    /**
     * The group transform is a transform relative to the render group it belongs too.
     * If this container is render group then this will be an identity matrix. other wise it
     * will be the same as the relativeGroupTransform.
     * Use this value when actually rendering things to the screen
     * @readonly
     * @advanced
     */
    public groupTransform: Matrix = this.relativeGroupTransform;
    private _worldTransform: Matrix;
     /**
     * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
     * @deprecated since 8.2.6
     * @ignore
     */
     set _didChangeId(value: number)
     {
         this._didViewChangeTick = (value >> 12) & 0xFFF; // Extract the upper 12 bits
         this._didContainerChangeTick = value & 0xFFF; // Extract the lower 12 bits
     }
     /** @ignore */
     get _didChangeId(): number
     {
         return (this._didContainerChangeTick & 0xfff) | ((this._didViewChangeTick & 0xfff) << 12);
     }
 
     /**
      * property that tracks if the container transform has changed
      * @ignore
      */
     private _didLocalTransformChangeId = -1;
    // transform data..
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * @internal
     */
    public _position: ObservablePoint = new ObservablePoint(this, 0, 0);

    /**
     * The scale factor of the object.
     * @internal
     */
    public _scale: ObservablePoint = defaultScale;

    /**
     * The pivot point of the container that it rotates around.
     * @internal
     */
    public _pivot: ObservablePoint = defaultPivot;

    /**
     * The origin point around which the container rotates and scales.
     * Unlike pivot, changing origin will not move the container's position.
     * @private
     */
    public _origin: ObservablePoint = defaultOrigin;

    /**
     * The skew amount, on the x and y axis.
     * @internal
     */
    public _skew: ObservablePoint = defaultSkew;

    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     */
    public _cx = 1;

    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     */
    public _sx = 0;

    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     */
    public _cy = 0;

    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     */
    public _sy = 1;

    /**
     * The rotation amount.
     * @internal
     */
    private _rotation = 0;

    /**
     * Current transform of the object based on world (parent) factors.
     *
     * This matrix represents the absolute transformation in the scene graph.
     * @example
     * ```ts
     * // Get world position
     * const worldPos = container.worldTransform;
     * console.log(`World position: (${worldPos.tx}, ${worldPos.ty})`);
     * ```
     * @readonly
     * @see {@link Container#localTransform} For local space transform
     */
    get worldTransform() {
        this._worldTransform ||= new Matrix();

        return this._worldTransform;
    }

    /**
     * The position of the container on the x axis relative to the local coordinates of the parent.
     *
     * An alias to position.x
     * @example
     * ```ts
     * // Basic position
     * container.x = 100;
     * ```
     */
    get x(): number {
        return this._position.x;
    }

    set x(value: number) {
        this._position.x = value;
    }

    /**
     * The position of the container on the y axis relative to the local coordinates of the parent.
     *
     * An alias to position.y
     * @example
     * ```ts
     * // Basic position
     * container.y = 200;
     * ```
     */
    get y(): number {
        return this._position.y;
    }

    set y(value: number) {
        this._position.y = value;
    }

    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * @example
     * ```ts
     * // Basic position setting
     * container.position.set(100, 200);
     * container.position.set(100); // Sets both x and y to 100
     * // Using point data
     * container.position = { x: 50, y: 75 };
     * ```
     * @since 4.0.0
     */
    get position(): ObservablePoint {
        return this._position;
    }

    set position(value: PointData) {
        this._position.copyFrom(value);
    }

    /**
     * The rotation of the object in radians.
     *
     * > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
     * > rotation is in radians, angle is in degrees.
     * @example
     * ```ts
     * // Basic rotation
     * container.rotation = Math.PI / 4; // 45 degrees
     *
     * // Convert from degrees
     * const degrees = 45;
     * container.rotation = degrees * Math.PI / 180;
     *
     * // Rotate around center
     * container.pivot.set(container.width / 2, container.height / 2);
     * container.rotation = Math.PI; // 180 degrees
     *
     * // Rotate around center with origin
     * container.origin.set(container.width / 2, container.height / 2);
     * container.rotation = Math.PI; // 180 degrees
     * ```
     */
    get rotation(): number {
        return this._rotation;
    }

    set rotation(value: number) {
        if (this._rotation !== value) {
            this._rotation = value;
            this._onUpdate(this._skew);
        }
    }

    /**
     * The angle of the object in degrees.
     *
     * > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
     * > rotation is in radians, angle is in degrees.
     @example
     * ```ts
     * // Basic angle rotation
     * sprite.angle = 45; // 45 degrees
     *
     * // Rotate around center
     * sprite.pivot.set(sprite.width / 2, sprite.height / 2);
     * sprite.angle = 180; // Half rotation
     *
     * // Rotate around center with origin
     * sprite.origin.set(sprite.width / 2, sprite.height / 2);
     * sprite.angle = 180; // Half rotation
     *
     * // Reset rotation
     * sprite.angle = 0;
     * ```
     */
    get angle(): number {
        return this.rotation * RAD_TO_DEG;
    }

    set angle(value: number) {
        this.rotation = value * DEG_TO_RAD;
    }

    /**
     * The center of rotation, scaling, and skewing for this display object in its local space.
     * The `position` is the projection of `pivot` in the parent's local space.
     *
     * By default, the pivot is the origin (0, 0).
     * @example
     * ```ts
     * // Rotate around center
     * container.pivot.set(container.width / 2, container.height / 2);
     * container.rotation = Math.PI; // Rotates around center
     * ```
     * @since 4.0.0
     */
    get pivot(): ObservablePoint {
        if (this._pivot === defaultPivot) {
            this._pivot = new ObservablePoint(this, 0, 0);
        }

        return this._pivot;
    }

    set pivot(value: PointData | number) {
        if (this._pivot === defaultPivot) {
            this._pivot = new ObservablePoint(this, 0, 0);

            // #if _DEBUG
            if (this._origin !== defaultOrigin) {
                // eslint-disable-next-line max-len
                warn(`Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.`);
            }
            // #endif
        }

        typeof value === 'number' ? this._pivot.set(value) : this._pivot.copyFrom(value);
    }

    /**
     * The skew factor for the object in radians. Skewing is a transformation that distorts
     * the object by rotating it differently at each point, creating a non-uniform shape.
     * @example
     * ```ts
     * // Basic skewing
     * container.skew.set(0.5, 0); // Skew horizontally
     * container.skew.set(0, 0.5); // Skew vertically
     *
     * // Skew with point data
     * container.skew = { x: 0.3, y: 0.3 }; // Diagonal skew
     *
     * // Reset skew
     * container.skew.set(0, 0);
     *
     * // Animate skew
     * app.ticker.add(() => {
     *     // Create wave effect
     *     container.skew.x = Math.sin(Date.now() / 1000) * 0.3;
     * });
     *
     * // Combine with rotation
     * container.rotation = Math.PI / 4; // 45 degrees
     * container.skew.set(0.2, 0.2); // Skew the rotated object
     * ```
     * @since 4.0.0
     * @type {ObservablePoint} Point-like object with x/y properties in radians
     * @default {x: 0, y: 0}
     */
    get skew(): ObservablePoint {
        if (this._skew === defaultSkew) {
            this._skew = new ObservablePoint(this, 0, 0);
        }

        return this._skew;
    }

    set skew(value: PointData) {
        if (this._skew === defaultSkew) {
            this._skew = new ObservablePoint(this, 0, 0);
        }

        this._skew.copyFrom(value);
    }

    /**
     * The scale factors of this object along the local coordinate axes.
     *
     * The default scale is (1, 1).
     * @example
     * ```ts
     * // Basic scaling
     * container.scale.set(2, 2); // Scales to double size
     * container.scale.set(2); // Scales uniformly to double size
     * container.scale = 2; // Scales uniformly to double size
     * // Scale to a specific width and height
     * container.setSize(200, 100); // Sets width to 200 and height to 100
     * ```
     * @since 4.0.0
     */
    get scale(): ObservablePoint {
        if (this._scale === defaultScale) {
            this._scale = new ObservablePoint(this, 1, 1);
        }

        return this._scale;
    }

    set scale(value: PointData | number | string) {
        if (this._scale === defaultScale) {
            this._scale = new ObservablePoint(this, 0, 0);
        }

        if (typeof value === 'string') {
            value = parseFloat(value);
        }

        typeof value === 'number' ? this._scale.set(value) : this._scale.copyFrom(value);
    }

    /**
     * @experimental
     * The origin point around which the container rotates and scales without affecting its position.
     * Unlike pivot, changing the origin will not move the container's position.
     * @example
     * ```ts
     * // Rotate around center point
     * container.origin.set(container.width / 2, container.height / 2);
     * container.rotation = Math.PI; // Rotates around center
     *
     * // Reset origin
     * container.origin.set(0, 0);
     * ```
     */
    get origin(): ObservablePoint {
        if (this._origin === defaultOrigin) {
            this._origin = new ObservablePoint(this, 0, 0);
        }

        return this._origin;
    }

    set origin(value: PointData | number) {
        if (this._origin === defaultOrigin) {
            this._origin = new ObservablePoint(this, 0, 0);

            // #if _DEBUG
            if (this._pivot !== defaultPivot) {
                // eslint-disable-next-line max-len
                warn(`Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.`);
            }
            // #endif
        }

        typeof value === 'number' ? this._origin.set(value) : this._origin.copyFrom(value);
    }
    private _updateSkew(): void {
        const rotation = this._rotation;
        const skew = this._skew;

        this._cx = Math.cos(rotation + skew._y);
        this._sx = Math.sin(rotation + skew._y);
        this._cy = -Math.sin(rotation - skew._x); // cos, added PI/2
        this._sy = Math.cos(rotation - skew._x); // sin, added PI/2
    }
    public _onUpdate(point?: ObservablePoint) {
        if (point) {
            //   this.updateFlags |= UPDATE_TRANSFORM;

            if (point === this._skew) {
                this._updateSkew();
            }
        }

        this._didContainerChangeTick++;

        if (this.didChange) return;
        this.didChange = true;

    }
    public setFromMatrix(matrix: Matrix): void {
        matrix.decompose(this);
    }
    public updateLocalTransform(): void {
        const localTransformChangeId = this._didContainerChangeTick;

        if (this._didLocalTransformChangeId === localTransformChangeId) return;

        this._didLocalTransformChangeId = localTransformChangeId;

        const lt = this.localTransform;
        const scale = this._scale;
        const pivot = this._pivot;
        const origin = this._origin;
        const position = this._position;

        const sx = scale._x;
        const sy = scale._y;

        const px = pivot._x;
        const py = pivot._y;

        const ox = -origin._x;
        const oy = -origin._y;

        // get the matrix values of the container based on its this properties..
        lt.a = this._cx * sx;
        lt.b = this._sx * sx;
        lt.c = this._cy * sy;
        lt.d = this._sy * sy;

        lt.tx = position._x - ((px * lt.a) + (py * lt.c)) // Pivot offset
            + ((ox * lt.a) + (oy * lt.c)) // Origin offset for rotation and scaling
            - (ox * sx); // Remove unscaled origin to maintain position
        lt.ty = position._y - ((px * lt.b) + (py * lt.d)) // Pivot offset
            + ((ox * lt.b) + (oy * lt.d)) // Origin offset for rotation and scaling
            - (oy * sy); // Remove unscaled origin to maintain position
    }
    public updateTransform(opts: Partial<UpdateTransformOptions>): this {
        this.position.set(
            typeof opts.x === 'number' ? opts.x : this.position.x,
            typeof opts.y === 'number' ? opts.y : this.position.y
        );
        this.scale.set(
            typeof opts.scaleX === 'number' ? opts.scaleX || 1 : this.scale.x,
            typeof opts.scaleY === 'number' ? opts.scaleY || 1 : this.scale.y
        );
        this.rotation = typeof opts.rotation === 'number' ? opts.rotation : this.rotation;
        this.skew.set(
            typeof opts.skewX === 'number' ? opts.skewX : this.skew.x,
            typeof opts.skewY === 'number' ? opts.skewY : this.skew.y
        );
        this.pivot.set(
            typeof opts.pivotX === 'number' ? opts.pivotX : this.pivot.x,
            typeof opts.pivotY === 'number' ? opts.pivotY : this.pivot.y
        );
        this.origin.set(
            typeof opts.originX === 'number' ? opts.originX : this.origin.x,
            typeof opts.originY === 'number' ? opts.originY : this.origin.y
        );

        return this;
    }
}