import { default as Path, PathStyleProps } from '../graphic/Path';
import { default as ZRImage, ImageStyleProps } from '../graphic/Image';
import { default as TSpan, TSpanStyleProps } from '../graphic/TSpan';
type AllStyleOption = PathStyleProps | TSpanStyleProps | ImageStyleProps;
export default function mapStyleToAttrs(updateAttr: (key: string, val: string | number) => void, style: AllStyleOption, el: Path | TSpan | ZRImage, 
/**
 * Will try not to set the attribute if it's using default value if not using forceUpdate.
 * Mainly for reduce the generated size in svg-ssr mode.
 */
forceUpdate: boolean): void;
export {};
