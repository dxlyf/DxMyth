import { default as Path } from '../graphic/Path';
import { default as ZRImage } from '../graphic/Image';
import { default as TSpan } from '../graphic/TSpan';
export interface SVGProxy<T> {
    brush(el: T): void;
}
declare const svgPath: SVGProxy<Path>;
export { svgPath as path };
/***************************************************
 * IMAGE
 **************************************************/
declare const svgImage: SVGProxy<ZRImage>;
export { svgImage as image };
/***************************************************
 * TEXT
 **************************************************/
declare const svgText: SVGProxy<TSpan>;
export { svgText as text };
