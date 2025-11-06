import { default as Definable } from './Definable';
import { default as Displayable } from '../../graphic/Displayable';
import { default as Path } from '../../graphic/Path';
export declare function hasClipPath(displayable: Displayable): boolean;
/**
 * Manages SVG clipPath elements.
 */
export default class ClippathManager extends Definable {
    private _refGroups;
    private _keyDuplicateCount;
    constructor(zrId: number, svgRoot: SVGElement);
    markAllUnused(): void;
    private _getClipPathGroup;
    /**
     * Update clipPath.
     *
     * @param displayable displayable element
     */
    update(displayable: Displayable, prevDisplayable: Displayable): SVGElement;
    /**
     * Create an SVGElement of displayable and create a <clipPath> of its
     * clipPath
     */
    updateDom(parentEl: SVGElement, clipPaths: Path[]): void;
    /**
     * Mark a single clipPath to be used
     *
     * @param displayable displayable element
     */
    markUsed(displayable: Displayable): void;
    removeUnused(): void;
}
