import { Matrix } from './matrix/Matrix';
import { ObservablePoint } from './point/ObservablePoint';
import { PointData } from './point/PointData';
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
export declare class Transformable {
    parent: Transformable;
    didChange: boolean;
    /** @private */
    didViewUpdate: boolean;
    /**
   * A value that increments each time the containe is modified
   * eg children added, removed etc
   * @ignore
   */
    _didContainerChangeTick: number;
    /**
     * A value that increments each time the container view is modified
     * eg texture swap, geometry change etc
     * @ignore
     */
    _didViewChangeTick: number;
    /** @internal */
    updateTick: number;
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
    localTransform: Matrix;
    /**
     * The relative group transform is a transform relative to the render group it belongs too. It will include all parent
     * transforms and up to the render group (think of it as kind of like a stage - but the stage can be nested).
     * If this container is is self a render group matrix will be relative to its parent render group
     * @readonly
     * @advanced
     */
    relativeGroupTransform: Matrix;
    /**
     * The group transform is a transform relative to the render group it belongs too.
     * If this container is render group then this will be an identity matrix. other wise it
     * will be the same as the relativeGroupTransform.
     * Use this value when actually rendering things to the screen
     * @readonly
     * @advanced
     */
    groupTransform: Matrix;
    private _worldTransform;
    /**
    * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
    * @deprecated since 8.2.6
    * @ignore
    */
    set _didChangeId(value: number);
    /** @ignore */
    get _didChangeId(): number;
    /**
     * property that tracks if the container transform has changed
     * @ignore
     */
    private _didLocalTransformChangeId;
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * @internal
     */
    _position: ObservablePoint;
    /**
     * The scale factor of the object.
     * @internal
     */
    _scale: ObservablePoint;
    /**
     * The pivot point of the container that it rotates around.
     * @internal
     */
    _pivot: ObservablePoint;
    /**
     * The origin point around which the container rotates and scales.
     * Unlike pivot, changing origin will not move the container's position.
     * @private
     */
    _origin: ObservablePoint;
    /**
     * The skew amount, on the x and y axis.
     * @internal
     */
    _skew: ObservablePoint;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     */
    _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     */
    _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     */
    _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     */
    _sy: number;
    /**
     * The rotation amount.
     * @internal
     */
    private _rotation;
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
    get worldTransform(): Matrix;
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
    get x(): number;
    set x(value: number);
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
    get y(): number;
    set y(value: number);
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
    get position(): ObservablePoint;
    set position(value: PointData);
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
    get rotation(): number;
    set rotation(value: number);
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
    get angle(): number;
    set angle(value: number);
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
    get pivot(): ObservablePoint;
    set pivot(value: PointData | number);
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
    get skew(): ObservablePoint;
    set skew(value: PointData);
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
    get scale(): ObservablePoint;
    set scale(value: PointData | number | string);
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
    get origin(): ObservablePoint;
    set origin(value: PointData | number);
    private _updateSkew;
    _onUpdate(point?: ObservablePoint): void;
    setFromMatrix(matrix: Matrix): void;
    updateLocalTransform(): void;
    updateTransform(opts: Partial<UpdateTransformOptions>): this;
}
