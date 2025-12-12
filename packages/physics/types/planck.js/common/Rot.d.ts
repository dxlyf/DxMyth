import { Vec2, Vec2Value } from './Vec2';
export interface RotValue {
    /** sin(angle) */
    s: number;
    /** cos(angle) */
    c: number;
}
declare module "./Rot" {
    /** @hidden @deprecated Use new keyword. */
    function Rot(angle: number): Rot;
    /** @hidden @deprecated Use new keyword. */
    function Rot(obj: RotValue): Rot;
    /** @hidden @deprecated Use new keyword. */
    function Rot(): Rot;
}
/** Rotation */
export declare class Rot {
    /** sin(angle) */
    s: number;
    /** cos(angle) */
    c: number;
    /** Initialize from an angle in radians. */
    constructor(angle?: number | RotValue);
    /** @hidden */
    static neo(angle: number): Rot;
    static clone(rot: RotValue): Rot;
    static identity(): Rot;
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    /** Set to the identity rotation. */
    setIdentity(): void;
    set(angle: number | RotValue): void;
    setRot(angle: RotValue): void;
    /** Set using an angle in radians. */
    setAngle(angle: number): void;
    /** Get the angle in radians. */
    getAngle(): number;
    /** Get the x-axis. */
    getXAxis(): Vec2;
    /** Get the y-axis. */
    getYAxis(): Vec2;
    /** Multiply two rotations: q * r */
    static mul(rot: RotValue, m: RotValue): Rot;
    /** Rotate a vector */
    static mul(rot: RotValue, m: Vec2Value): Vec2;
    /** Multiply two rotations: q * r */
    static mulRot(rot: RotValue, m: RotValue): Rot;
    /** Rotate a vector */
    static mulVec2(rot: RotValue, m: Vec2Value): Vec2;
    static mulSub(rot: RotValue, v: Vec2Value, w: Vec2Value): Vec2;
    /** Transpose multiply two rotations: qT * r */
    static mulT(rot: RotValue, m: RotValue): Rot;
    /** Inverse rotate a vector */
    static mulT(rot: RotValue, m: Vec2Value): Vec2;
    /** Transpose multiply two rotations: qT * r */
    static mulTRot(rot: RotValue, m: RotValue): Rot;
    /** Inverse rotate a vector */
    static mulTVec2(rot: RotValue, m: Vec2Value): Vec2;
}
