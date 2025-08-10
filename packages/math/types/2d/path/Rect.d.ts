import { Vector2 } from '../math/vec2';
export declare class PointIterator<T = any> {
    length: number;
    private advance;
    private _currentIndex;
    data: T[];
    constructor(data: T[], length?: number, ccw?: boolean, startIndex?: number);
    get current(): T;
    get(index?: number): T;
    next(moveIndex?: number): T;
}
export declare class OvalPointIterator extends PointIterator<Vector2> {
    constructor(oval: Rect, ccw?: boolean, startIndex?: number);
}
export declare class RectPointIterator extends PointIterator<Vector2> {
    constructor(rect: Rect, ccw?: boolean, startIndex?: number);
}
export declare class Rect {
    static default(): Rect;
    static from(pt: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }): Rect;
    static fromXYWH(x: number, y: number, width: number, height: number): Rect;
    static fromLTRB(left: number, top: number, right: number, bottom: number): Rect;
    left: number;
    top: number;
    right: number;
    bottom: number;
    constructor(left?: number, top?: number, right?: number, bottom?: number);
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    get halfWidth(): number;
    get halfHeight(): number;
    get cx(): number;
    get cy(): number;
    isEmpty(): boolean;
    copy(source: Rect): this;
    clone(): Rect;
    offset(dx: number, dy: number): this;
    isSorted(): boolean;
    isFinite(): boolean;
    makeSorted(): Rect;
}
