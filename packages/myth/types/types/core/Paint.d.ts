import { Color } from '../../../../../../../../../src/image/Color';
import { Gradient } from '../../../../../../../../../src/image/Gradient';
import { Pattern } from '../../../../../../../../../src/image/Pattern';
import { IDisplayObject } from './DisplayObject';
export type PaintColor = string | Color | Gradient | Pattern | undefined | null;
export declare enum LineJoin {
    Miter = "miter",
    Round = "round",
    Bevel = "bevel"
}
export declare enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}
export declare enum FillRule {
    NonZero = "nonzero",
    EvenOdd = "evenodd"
}
export declare enum PaintType {
    Color = 1,
    Gradient = 2,
    Pattern = 3
}
export declare enum PaintStyle {
    None = 0,
    Fill = 1,// 填充模式
    Stroke = 2
}
export interface IPaint {
    style?: PaintStyle;
    type?: PaintType;
    color?: Color;
    width?: number;
    miterLimit?: number;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    fillRule?: FillRule;
    gradient?: Gradient;
    pattern?: Pattern;
}
export type RenderObject = {
    object: IDisplayObject;
    paints: IPaint[];
};
