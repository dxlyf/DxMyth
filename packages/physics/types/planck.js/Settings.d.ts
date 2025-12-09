/**
 * Tuning constants based on meters-kilograms-seconds (MKS) units.
 *
 * Some tolerances are absolute and some are relative. Absolute tolerances use MKS units.
 */
export declare class Settings {
    /**
     * You can use this to change the length scale used by your game.
     *
     * For example for inches you could use 39.4.
     */
    static lengthUnitsPerMeter: number;
    /**
     * The maximum number of contact points between two convex shapes. Do not change
     * this value.
     */
    static maxManifoldPoints: number;
    /**
     * The maximum number of vertices on a convex polygon. You cannot increase this
     * too much because BlockAllocator has a maximum object size.
     */
    static maxPolygonVertices: number;
    /**
     * This is used to fatten AABBs in the dynamic tree. This allows proxies to move
     * by a small amount without triggering a tree adjustment. This is in meters.
     */
    static aabbExtension: number;
    /**
     * This is used to fatten AABBs in the dynamic tree. This is used to predict the
     * future position based on the current displacement. This is a dimensionless
     * multiplier.
     */
    static aabbMultiplier: number;
    /**
     * A small length used as a collision and constraint tolerance. Usually it is
     * chosen to be numerically significant, but visually insignificant.
     */
    static linearSlop: number;
    /**
     * A small angle used as a collision and constraint tolerance. Usually it is
     * chosen to be numerically significant, but visually insignificant.
     */
    static angularSlop: number;
    /**
     * The radius of the polygon/edge shape skin. This should not be modified.
     * Making this smaller means polygons will have an insufficient buffer for
     * continuous collision. Making it larger may create artifacts for vertex
     * collision.
     */
    static get polygonRadius(): number;
    /**
     * Maximum number of sub-steps per contact in continuous physics simulation.
     */
    static maxSubSteps: number;
    /**
     * Maximum number of contacts to be handled to solve a TOI impact.
     */
    static maxTOIContacts: number;
    /**
     * Maximum iterations to solve a TOI.
     */
    static maxTOIIterations: number;
    /**
     * Maximum iterations to find Distance.
     */
    static maxDistanceIterations: number;
    /**
     * A velocity threshold for elastic collisions. Any collision with a relative
     * linear velocity below this threshold will be treated as inelastic.
     */
    static velocityThreshold: number;
    /**
     * The maximum linear position correction used when solving constraints. This
     * helps to prevent overshoot.
     */
    static maxLinearCorrection: number;
    /**
     * The maximum angular position correction used when solving constraints. This
     * helps to prevent overshoot.
     */
    static maxAngularCorrection: number;
    /**
     * The maximum linear velocity of a body. This limit is very large and is used
     * to prevent numerical problems. You shouldn't need to adjust Settings.
     */
    static maxTranslation: number;
    /**
     * The maximum angular velocity of a body. This limit is very large and is used
     * to prevent numerical problems. You shouldn't need to adjust Settings.
     */
    static maxRotation: number;
    /**
     * This scale factor controls how fast overlap is resolved. Ideally this would
     * be 1 so that overlap is removed in one time step. However using values close
     * to 1 often lead to overshoot.
     */
    static baumgarte: number;
    static toiBaugarte: number;
    /**
     * The time that a body must be still before it will go to sleep.
     */
    static timeToSleep: number;
    /**
     * A body cannot sleep if its linear velocity is above this tolerance.
     */
    static linearSleepTolerance: number;
    /**
     * A body cannot sleep if its angular velocity is above this tolerance.
     */
    static angularSleepTolerance: number;
}
/** @internal */
export declare class SettingsInternal {
    static get maxManifoldPoints(): number;
    static get maxPolygonVertices(): number;
    static get aabbExtension(): number;
    static get aabbMultiplier(): number;
    static get linearSlop(): number;
    static get linearSlopSquared(): number;
    static get angularSlop(): number;
    static get polygonRadius(): number;
    static get maxSubSteps(): number;
    static get maxTOIContacts(): number;
    static get maxTOIIterations(): number;
    static get maxDistanceIterations(): number;
    static get velocityThreshold(): number;
    static get maxLinearCorrection(): number;
    static get maxAngularCorrection(): number;
    static get maxTranslation(): number;
    static get maxTranslationSquared(): number;
    static get maxRotation(): number;
    static get maxRotationSquared(): number;
    static get baumgarte(): number;
    static get toiBaugarte(): number;
    static get timeToSleep(): number;
    static get linearSleepTolerance(): number;
    static get linearSleepToleranceSqr(): number;
    static get angularSleepTolerance(): number;
    static get angularSleepToleranceSqr(): number;
}
