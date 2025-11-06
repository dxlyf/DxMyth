import * as matrix from './matrix';
import * as vector from './vector';
declare class Transformable {
    parent: Transformable;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    rotation: number;
    /**
     * Will translated the element to the anchor position before applying other transforms.
     */
    anchorX: number;
    anchorY: number;
    /**
     * Origin of scale, rotation, skew
     */
    originX: number;
    originY: number;
    /**
     * Scale ratio
     */
    globalScaleRatio: number;
    transform: matrix.MatrixArray;
    invTransform: matrix.MatrixArray;
    /**
     * Get computed local transform
     */
    getLocalTransform(m?: matrix.MatrixArray): matrix.MatrixArray;
    /**
     * Set position from array
     */
    setPosition(arr: number[]): void;
    /**
     * Set scale from array
     */
    setScale(arr: number[]): void;
    /**
     * Set skew from array
     */
    setSkew(arr: number[]): void;
    /**
     * Set origin from array
     */
    setOrigin(arr: number[]): void;
    /**
     * If needs to compute transform
     */
    needLocalTransform(): boolean;
    /**
     * Update global transform
     */
    updateTransform(): void;
    private _resolveGlobalScaleRatio;
    /**
     * Get computed global transform
     * NOTE: this method will force update transform on all ancestors.
     * Please be aware of the potential performance cost.
     */
    getComputedTransform(): matrix.MatrixArray;
    setLocalTransform(m: vector.VectorArray): void;
    /**
     * 分解`transform`矩阵到`position`, `rotation`, `scale`
     */
    decomposeTransform(): void;
    /**
     * Get global scale
     */
    getGlobalScale(out?: vector.VectorArray): vector.VectorArray;
    /**
     * 变换坐标位置到 shape 的局部坐标空间
     */
    transformCoordToLocal(x: number, y: number): number[];
    /**
     * 变换局部坐标位置到全局坐标空间
     */
    transformCoordToGlobal(x: number, y: number): number[];
    getLineScale(): number;
    copyTransform(source: Transformable): void;
    static getLocalTransform(target: Transformable, m?: matrix.MatrixArray): matrix.MatrixArray;
    private static initDefaultProps;
}
export declare const TRANSFORMABLE_PROPS: readonly ["x", "y", "originX", "originY", "anchorX", "anchorY", "rotation", "scaleX", "scaleY", "skewX", "skewY"];
export type TransformProp = (typeof TRANSFORMABLE_PROPS)[number];
export declare function copyTransform(target: Partial<Pick<Transformable, TransformProp>>, source: Pick<Transformable, TransformProp>): void;
export default Transformable;
