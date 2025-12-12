/** 2D vector */
export interface Vec2Value {
    x: number;
    y: number;
}
declare module "./Vec2" {
    /** @hidden @deprecated Use new keyword. */
    function Vec2(x: number, y: number): Vec2;
    /** @hidden @deprecated Use new keyword. */
    function Vec2(obj: Vec2Value): Vec2;
    /** @hidden @deprecated Use new keyword. */
    function Vec2(): Vec2;
}
/** 2D vector */
export declare class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    constructor(obj: Vec2Value);
    constructor();
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any): Vec2;
    static zero(): Vec2;
    /** @hidden */
    static neo(x: number, y: number): Vec2;
    static clone(v: Vec2Value): Vec2;
    /** @hidden */
    toString(): string;
    /**
     * Does this vector contain finite coordinates?
     */
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    clone(): Vec2;
    /**
     * Set this vector to all zeros.
     *
     * @returns this
     */
    setZero(): Vec2;
    set(x: number, y: number): Vec2;
    set(value: Vec2Value): Vec2;
    /**
     * Set this vector to some specified coordinates.
     *
     * @returns this
     */
    setNum(x: number, y: number): this;
    /**
     * Set this vector to some specified coordinates.
     *
     * @returns this
     */
    setVec2(value: Vec2Value): this;
    /** @internal @deprecated Use setCombine or setMul */
    wSet(a: number, v: Vec2Value, b?: number, w?: Vec2Value): Vec2;
    /**
     * Set linear combination of v and w: `a * v + b * w`
     */
    setCombine(a: number, v: Vec2Value, b: number, w: Vec2Value): Vec2;
    setMul(a: number, v: Vec2Value): Vec2;
    /**
     * Add a vector to this vector.
     *
     * @returns this
     */
    add(w: Vec2Value): Vec2;
    /** @internal @deprecated Use addCombine or addMul */
    wAdd(a: number, v: Vec2Value, b?: number, w?: Vec2Value): Vec2;
    /**
     * Add linear combination of v and w: `a * v + b * w`
     */
    addCombine(a: number, v: Vec2Value, b: number, w: Vec2Value): Vec2;
    addMul(a: number, v: Vec2Value): Vec2;
    /**
     * @deprecated Use subCombine or subMul
     */
    wSub(a: number, v: Vec2Value, b?: number, w?: Vec2Value): Vec2;
    /**
     * Subtract linear combination of v and w: `a * v + b * w`
     */
    subCombine(a: number, v: Vec2Value, b: number, w: Vec2Value): Vec2;
    subMul(a: number, v: Vec2Value): Vec2;
    /**
     * Subtract a vector from this vector
     *
     * @returns this
     */
    sub(w: Vec2Value): Vec2;
    /**
     * Multiply this vector by a scalar.
     *
     * @returns this
     */
    mul(m: number): Vec2;
    /**
     * Get the length of this vector (the norm).
     *
     * For performance, use this instead of lengthSquared (if possible).
     */
    length(): number;
    /**
     * Get the length squared.
     */
    lengthSquared(): number;
    /**
     * Convert this vector into a unit vector.
     *
     * @returns old length
     */
    normalize(): number;
    /**
     * Returns a new unit vector from the provided vector.
     *
     * @returns new unit vector
     */
    static normalize(v: Vec2Value): Vec2;
    /**
     * Get the length of this vector (the norm).
     *
     * For performance, use this instead of lengthSquared (if possible).
     */
    static lengthOf(v: Vec2Value): number;
    /**
     * Get the length squared.
     */
    static lengthSquared(v: Vec2Value): number;
    static distance(v: Vec2Value, w: Vec2Value): number;
    static distanceSquared(v: Vec2Value, w: Vec2Value): number;
    static areEqual(v: Vec2Value, w: Vec2Value): boolean;
    /**
     * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
     */
    static skew(v: Vec2Value): Vec2;
    /** Dot product on two vectors */
    static dot(v: Vec2Value, w: Vec2Value): number;
    /** Cross product between two vectors */
    static cross(v: Vec2Value, w: Vec2Value): number;
    /** Cross product between a vector and a scalar */
    static cross(v: Vec2Value, w: number): Vec2;
    /** Cross product between a scalar and a vector */
    static cross(v: number, w: Vec2Value): Vec2;
    /** Cross product on two vectors */
    static crossVec2Vec2(v: Vec2Value, w: Vec2Value): number;
    /** Cross product on a vector and a scalar */
    static crossVec2Num(v: Vec2Value, w: number): Vec2;
    /** Cross product on a vector and a scalar */
    static crossNumVec2(v: number, w: Vec2Value): Vec2;
    /** Returns `a + (v x w)` */
    static addCross(a: Vec2Value, v: Vec2Value, w: number): Vec2;
    /** Returns `a + (v x w)` */
    static addCross(a: Vec2Value, v: number, w: Vec2Value): Vec2;
    /**
     * Returns `a + (v x w)`
     */
    static addCrossVec2Num(a: Vec2Value, v: Vec2Value, w: number): Vec2;
    /**
     * Returns `a + (v x w)`
     */
    static addCrossNumVec2(a: Vec2Value, v: number, w: Vec2Value): Vec2;
    static add(v: Vec2Value, w: Vec2Value): Vec2;
    /** @hidden @deprecated */
    static wAdd(a: number, v: Vec2Value, b: number, w: Vec2Value): Vec2;
    static combine(a: number, v: Vec2Value, b: number, w: Vec2Value): Vec2;
    static sub(v: Vec2Value, w: Vec2Value): Vec2;
    static mul(a: Vec2Value, b: number): Vec2;
    static mul(a: number, b: Vec2Value): Vec2;
    static mulVec2Num(a: Vec2Value, b: number): Vec2;
    static mulNumVec2(a: number, b: Vec2Value): Vec2;
    neg(): Vec2;
    static neg(v: Vec2Value): Vec2;
    static abs(v: Vec2Value): Vec2;
    static mid(v: Vec2Value, w: Vec2Value): Vec2;
    static upper(v: Vec2Value, w: Vec2Value): Vec2;
    static lower(v: Vec2Value, w: Vec2Value): Vec2;
    clamp(max: number): Vec2;
    static clamp(v: Vec2Value, max: number): Vec2;
    /** @hidden */
    static clampVec2(v: Vec2Value, min?: Vec2Value, max?: Vec2Value): Vec2Value;
    /**  @hidden @deprecated */
    static scaleFn(x: number, y: number): (v: Vec2Value) => Vec2;
    /**  @hidden @deprecated */
    static translateFn(x: number, y: number): (v: Vec2Value) => Vec2;
}
