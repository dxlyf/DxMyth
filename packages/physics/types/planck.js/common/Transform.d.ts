import { Vec2, Vec2Value } from './Vec2';
import { Rot, RotValue } from './Rot';
export type TransformValue = {
    p: Vec2Value;
    q: RotValue;
};
declare module "./Transform" {
    /** @hidden @deprecated Use new keyword. */
    function Transform(position?: Vec2Value, rotation?: number): Transform;
}
/**
 * A transform contains translation and rotation. It is used to represent the
 * position and orientation of rigid frames. Initialize using a position vector
 * and a rotation.
 */
export declare class Transform {
    /** position */
    p: Vec2;
    /** rotation */
    q: Rot;
    constructor(position?: Vec2Value, rotation?: number);
    static clone(xf: Transform): Transform;
    /** @hidden */
    static neo(position: Vec2Value, rotation: Rot): Transform;
    static identity(): Transform;
    /** Set this to the identity transform */
    setIdentity(): void;
    /** Set position and angle */
    set(position: Vec2Value, rotation: number): void;
    /** Copy from another transform */
    set(xf: TransformValue): void;
    /** Set position and angle */
    setNum(position: Vec2Value, rotation: number): void;
    setTransform(xf: TransformValue): void;
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    static mul(a: TransformValue, b: Vec2Value): Vec2;
    static mul(a: TransformValue, b: TransformValue): Transform;
    static mulAll(a: Transform, b: Vec2Value[]): Vec2[];
    static mulAll(a: Transform, b: Transform[]): Transform[];
    /** @hidden @deprecated */
    static mulFn(a: TransformValue): (b: Vec2Value) => Vec2;
    static mulVec2(a: TransformValue, b: Vec2Value): Vec2;
    static mulXf(a: TransformValue, b: TransformValue): Transform;
    static mulT(a: TransformValue, b: Vec2Value): Vec2;
    static mulT(a: TransformValue, b: TransformValue): Transform;
    static mulTVec2(a: TransformValue, b: Vec2Value): Vec2;
    static mulTXf(a: TransformValue, b: TransformValue): Transform;
}
