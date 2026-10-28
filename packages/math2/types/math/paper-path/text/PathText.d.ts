import { Matrix } from '../basic/Matrix';
import { Rectangle } from '../basic/Rectangle';
import { PathItem } from '../path/PathItem';
import { TextItem, TextItemProps, TextLine } from './TextItem';
/** 构造 PathText 时可以传入的属性对象。 */
export interface PathTextProps extends TextItemProps {
    textPath?: PathItem | null;
    startOffset?: number;
    endOffset?: number | null;
    alignment?: string;
    spacing?: number;
}
export declare class PathText extends TextItem {
    /** 文字在路径上的起点偏移。 */
    _startOffset: number;
    /** 文字在路径上的终点偏移，null 表示到路径末尾。 */
    _endOffset: number | null;
    /** 字母的哪一部分落在路径上。 */
    _alignment: string;
    /** 字母之间额外增加的间距。 */
    _spacing: number;
    constructor(path?: PathItem | PathTextProps | null, orientation?: string);
    /** 文字在路径上的起点偏移。 */
    get startOffset(): number;
    set startOffset(value: number);
    /** 文字在路径上的终点偏移，null 表示到路径末尾。 */
    get endOffset(): number | null;
    set endOffset(value: number | null);
    /** 字母的哪一部分落在路径上：baseline / ascender / descender / center。 */
    get alignment(): string;
    set alignment(value: string);
    /** 字母之间额外增加的间距。 */
    get spacing(): number;
    set spacing(value: number);
    copyContent(source: PathText): void;
    /**
     * 把能放进 `startOffset`..`endOffset` 的文字排成一行，每个字母按其中点
     * 所在位置的切线旋转。
     */
    _layOut(): TextLine[];
    /** 每个字母的盒子随字母旋转后的并集。 */
    _getBounds(matrix?: Matrix | null): Rectangle;
}
