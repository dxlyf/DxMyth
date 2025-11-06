import { default as Definable } from './Definable';
import { default as Displayable } from '../../graphic/Displayable';
import { PatternObject } from '../../graphic/Pattern';
/**
 * Manages SVG pattern elements.
 *
 * @param   zrId    zrender instance id
 * @param   svgRoot root of SVG document
 */
export default class PatternManager extends Definable {
    constructor(zrId: number, svgRoot: SVGElement);
    /**
     * Create new pattern DOM for fill or stroke if not exist,
     * but will not update pattern if exists.
     *
     * @param svgElement   SVG element to paint
     * @param displayable  zrender displayable element
     */
    addWithoutUpdate(svgElement: SVGElement, displayable: Displayable): void;
    /**
     * Add a new pattern tag in <defs>
     *
     * @param   pattern zr pattern instance
     */
    add(pattern: PatternObject): SVGElement;
    /**
     * Update pattern.
     *
     * @param pattern zr pattern instance or color string
     */
    update(pattern: PatternObject | string): void;
    /**
     * Update pattern dom
     *
     * @param pattern zr pattern instance
     * @param patternDom DOM to update
     */
    updateDom(pattern: PatternObject, patternDom: SVGElement): void;
    /**
     * Mark a single pattern to be used
     *
     * @param displayable displayable element
     */
    markUsed(displayable: Displayable): void;
}
