declare function parseFontString(fontStr: string): {
    style: string;
    variant: string;
    weight: string;
    sizePx: number;
    family: string;
};
declare function getTypeface(fontstr: string): any;
declare function addToFontCache(typeface: any, descriptors: any): void;
declare function getFromFontCache(descriptors: any): any;
export { getTypeface, addToFontCache, getFromFontCache, parseFontString };
