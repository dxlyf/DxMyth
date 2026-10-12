import { Matrix2D } from './Matrix2D';
import { Disposable } from '../utils/Disposable';
export declare class Pattern extends Disposable {
    static fromUrl(url: string): Pattern;
    static fromImage(image: CanvasImageSource): Pattern;
    type: 'pattern';
    elementType: 'image';
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y';
    source: CanvasImageSource;
    matrix: Matrix2D;
    ref: any;
    constructor(image?: CanvasImageSource, repeat?: 'repeat' | 'repeat-x' | 'repeat-y');
    clone(): Pattern;
    copy(source: Pattern): void;
    onDispose(): void;
}
