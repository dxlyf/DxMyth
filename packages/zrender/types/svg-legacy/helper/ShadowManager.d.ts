import { default as Definable } from './Definable';
import { default as Displayable } from '../../graphic/Displayable';
/**
 * Manages SVG shadow elements.
 *
 */
export default class ShadowManager extends Definable {
    private _shadowDomMap;
    private _shadowDomPool;
    constructor(zrId: number, svgRoot: SVGElement);
    /**
     * Add a new shadow tag in <defs>
     *
     * @param displayable  zrender displayable element
     * @return created DOM
     */
    private _getFromPool;
    /**
     * Update shadow.
     */
    update(svgElement: SVGElement, displayable: Displayable): void;
    /**
     * Remove DOM and clear parent filter
     */
    remove(svgElement: SVGElement, displayable: Displayable): void;
    /**
     * Update shadow dom
     *
     * @param displayable  zrender displayable element
     * @param shadowDom DOM to update
     */
    updateDom(svgElement: SVGElement, displayable: Displayable, shadowDom: SVGElement): void;
    removeUnused(): void;
}
