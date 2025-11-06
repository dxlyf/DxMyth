import { default as Path } from './Path';
import { default as PathProxy } from '../core/PathProxy';
export interface CompoundPathShape {
    paths: Path[];
}
export default class CompoundPath extends Path {
    type: string;
    shape: CompoundPathShape;
    private _updatePathDirty;
    beforeBrush(): void;
    buildPath(ctx: PathProxy | CanvasRenderingContext2D, shape: CompoundPathShape): void;
    afterBrush(): void;
    getBoundingRect(): any;
}
