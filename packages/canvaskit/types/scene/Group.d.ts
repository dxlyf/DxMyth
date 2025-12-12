import { NodeOptions } from '../../../../../../../src/types/Node';
import { Node } from './Node';
export declare class Group extends Node {
    type: string;
    isGroup: boolean;
    constructor(options?: NodeOptions);
    shouldAddToPendingRenderList(): boolean;
    innerCalcBounds(): void;
}
