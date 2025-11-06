import { default as Displayable } from '../../graphic/Displayable';
/**
 * Manages elements that can be defined in <defs> in SVG,
 * e.g., gradients, clip path, etc.
 */
export default class Definable {
    nextId: number;
    protected _zrId: number;
    protected _svgRoot: SVGElement;
    protected _tagNames: string[];
    protected _markLabel: string;
    protected _domName: string;
    constructor(zrId: number, // zrender instance id
    svgRoot: SVGElement, // root of SVG document
    tagNames: string | string[], // possible tag names
    markLabel: string, // label name to make if the element
    domName?: string);
    /**
     * Get the <defs> tag for svgRoot; optionally creates one if not exists.
     *
     * @param isForceCreating if need to create when not exists
     * @return SVG <defs> element, null if it doesn't
     * exist and isForceCreating is false
     */
    getDefs(isForceCreating?: boolean): SVGDefsElement;
    /**
     * Update DOM element if necessary.
     *
     * @param element style element. e.g., for gradient,
     *                                it may be '#ccc' or {type: 'linear', ...}
     * @param onUpdate update callback
     */
    doUpdate<T>(target: T, onUpdate?: (target: T) => void): void;
    add(target: any): SVGElement;
    /**
     * Add gradient dom to defs
     *
     * @param dom DOM to be added to <defs>
     */
    addDom(dom: SVGElement): void;
    /**
     * Remove DOM of a given element.
     *
     * @param target Target where to attach the dom
     */
    removeDom<T>(target: T): void;
    /**
     * Get DOMs of this element.
     *
     * @return doms of this defineable elements in <defs>
     */
    getDoms(): SVGElement[];
    /**
     * Mark DOMs to be unused before painting, and clear unused ones at the end
     * of the painting.
     */
    markAllUnused(): void;
    /**
     * Mark a single DOM to be used.
     *
     * @param dom DOM to mark
     */
    markDomUsed(dom: SVGElement): void;
    markDomUnused(dom: SVGElement): void;
    isDomUnused(dom: SVGElement): boolean;
    /**
     * Remove unused DOMs defined in <defs>
     */
    removeUnused(): void;
    /**
     * Get SVG element.
     *
     * @param displayable displayable element
     * @return SVG element
     */
    getSvgElement(displayable: Displayable): SVGElement;
}
