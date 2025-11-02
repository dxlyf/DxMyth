import { Element } from './Element';
import { IDisplayObject } from '../../../../../../../../src/types/core/DisplayObject';
import { ContainerProps, ContainerEvents, IContainer } from '../../../../../../../../src/types/core/Container';
/**
 * 容器类，用于管理子元素。
 */
export declare class Container<Props extends ContainerProps = ContainerProps, Events extends ContainerEvents = ContainerEvents> extends Element<Props, Events> implements IContainer<Props> {
    type: string;
    _displayList: IDisplayObject<Props>[] | null;
    shouldAddToDisplayList(): boolean;
    getDisplayList(): IDisplayObject<Props>[];
}
