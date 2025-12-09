/** 3D vector */
export interface Vec3Value {
    x: number;
    y: number;
    z: number;
}
declare module "./Vec3" {
    /** @hidden @deprecated Use new keyword. */
    function Vec3(x: number, y: number, z: number): Vec3;
    /** @hidden @deprecated Use new keyword. */
    function Vec3(obj: Vec3Value): Vec3;
    /** @hidden @deprecated Use new keyword. */
    function Vec3(): Vec3;
}
/** 3D vector */
export declare class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    constructor(obj: Vec3Value);
    constructor();
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any): Vec3;
    /** @hidden */
    static neo(x: number, y: number, z: number): Vec3;
    static zero(): Vec3;
    static clone(v: Vec3Value): Vec3;
    /** @hidden */
    toString(): string;
    /** Does this vector contain finite coordinates? */
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    setZero(): Vec3;
    set(x: number, y: number, z: number): Vec3;
    add(w: Vec3Value): Vec3;
    sub(w: Vec3Value): Vec3;
    mul(m: number): Vec3;
    static areEqual(v: Vec3Value, w: Vec3Value): boolean;
    /** Dot product on two vectors */
    static dot(v: Vec3Value, w: Vec3Value): number;
    /** Cross product on two vectors */
    static cross(v: Vec3Value, w: Vec3Value): Vec3;
    static add(v: Vec3Value, w: Vec3Value): Vec3;
    static sub(v: Vec3Value, w: Vec3Value): Vec3;
    static mul(v: Vec3Value, m: number): Vec3;
    neg(): Vec3;
    static neg(v: Vec3Value): Vec3;
}
