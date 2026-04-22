import { IDispose } from './IDispose';
export interface IRenderer extends IDispose {
    type: string;
    domElement: Element;
}
