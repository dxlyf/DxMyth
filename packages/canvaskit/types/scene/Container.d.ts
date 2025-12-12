import { ContainerOptions, ContainerOptionsEvents } from '../../../../../../../src/types/Container';
import { Node } from './Node';
import { BoundingRect } from '../../../../../../../src/math/BoundingRect';
import { DisplayObject } from './DisplayObject';
import { CKEngine } from '../../../../../../../src/core/CKEngine';
declare class Container extends Node<ContainerOptions, ContainerOptionsEvents> {
    type: string;
    _owner: CKEngine;
    _interactionRenderList: DisplayObject[];
    constructor(engine: CKEngine, options?: ContainerOptions);
    get engine(): CKEngine;
    innerCalcBounds(): void;
    shouldAddToPendingRenderList(): boolean;
    updateRenderList({ viewport, delta }: {
        viewport: BoundingRect;
        delta: number;
    }): DisplayObject[];
}
export { Container };
