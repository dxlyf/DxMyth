import type { FabricObject } from '../shapes/Object/FabricObject';
import type { LoadImageOptions } from '../util';
import type { CSSRules, TSvgReviverCallback } from './typedefs';
import type { ParsedViewboxTransform } from './applyViewboxTransform';
type NotParsedFabricObject = FabricObject & {
    clipPath?: string | FabricObject['clipPath'];
    clipRule?: CanvasFillRule;
};
export declare class ElementsParser {
    elements: Element[];
    options: LoadImageOptions & ParsedViewboxTransform;
    reviver?: TSvgReviverCallback;
    regexUrl: RegExp;
    doc: Document;
    clipPaths: Record<string, Element[]>;
    gradientDefs: Record<string, SVGGradientElement>;
    cssRules: CSSRules;
    constructor(elements: Element[], options: LoadImageOptions & ParsedViewboxTransform, reviver: TSvgReviverCallback | undefined, doc: Document, clipPaths: Record<string, Element[]>);
    parse(): Promise<Array<FabricObject | null>>;
    createObject(el: Element): Promise<FabricObject | null>;
    extractPropertyDefinition(obj: NotParsedFabricObject, property: 'fill' | 'stroke', storage: Record<string, SVGGradientElement>): {
        def: SVGGradientElement;
        id: string;
    } | undefined;
    extractPropertyDefinition(obj: NotParsedFabricObject, property: 'clipPath', storage: Record<string, Element[]>): {
        def: Element[];
        id: string;
    } | undefined;
    resolveGradient(obj: NotParsedFabricObject, el: Element, property: 'fill' | 'stroke'): void;
    resolveClipPath(obj: NotParsedFabricObject, usingElement: Element, exactOwner?: Element, processedClipPaths?: Set<string>): Promise<void>;
}
export {};
//# sourceMappingURL=elements_parser.d.ts.map