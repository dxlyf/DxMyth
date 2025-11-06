import { default as Definable } from './Definable';
import { default as Displayable } from '../../graphic/Displayable';
import { GradientObject } from '../../graphic/Gradient';
/**
 * Manages SVG gradient elements.
 *
 * @param   zrId    zrender instance id
 * @param   svgRoot root of SVG document
 */
export default class GradientManager extends Definable {
    constructor(zrId: number, svgRoot: SVGElement);
    /**
     * Create new gradient DOM for fill or stroke if not exist,
     * but will not update gradient if exists.
     *
     * @param svgElement   SVG element to paint
     * @param displayable  zrender displayable element
     */
    addWithoutUpdate(svgElement: SVGElement, displayable: Displayable): void;
    /**
     * Add a new gradient tag in <defs>
     *
     * @param   gradient zr gradient instance
     */
    add(gradient: GradientObject): SVGElement;
    /**
     * Update gradient.
     *
     * @param gradient zr gradient instance or color string
     */
    update(gradient: GradientObject | string): void;
    /**
     * Update gradient dom
     *
     * @param gradient zr gradient instance
     * @param dom DOM to update
     */
    updateDom(gradient: GradientObject, dom: SVGElement): void;
    /**
     * Mark a single gradient to be used
     *
     * @param displayable displayable element
     */
    markUsed(displayable: Displayable): void;
}
