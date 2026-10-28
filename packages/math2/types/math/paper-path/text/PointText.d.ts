import { Point } from '../basic/Point';
import { Rectangle } from '../basic/Rectangle';
import { Matrix } from '../basic/Matrix';
import { TextItem, TextItemProps, TextLine } from './TextItem';
export declare class PointText extends TextItem {
    /** 文本的起点。 */
    _point: Point;
    constructor(props?: TextItemProps | Point | null, point?: Point);
    /** 文本的起点（返回副本）。 */
    get point(): Point;
    set point(point: Point);
    _setPoint(point: Point): void;
    /**
     * 按段落排版：每段一行或多行，行基线从 0 开始逐行下移自身的行高，
     * 段与段之间再加上 `spaceBefore` / `spaceAfter` 中较大的那个。
     */
    _layOut(): TextLine[];
    /**
     * 所有行的包围盒并集，平移到 `_point`；带 `matrix` 时用四个角变换后再
     * 求包围盒（没有 Item 矩阵，`_point` 即位置）。
     */
    _getBounds(matrix?: Matrix | null, options?: any): Rectangle;
}
