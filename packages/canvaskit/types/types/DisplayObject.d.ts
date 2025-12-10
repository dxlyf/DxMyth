import { NodeEvents, NodeOptions } from './Node';
export interface DisplayObjectEvents extends NodeEvents {
}
export interface DisplayObjectStyle {
    opacity?: number;
}
export interface DisplayObjectOptions<Style extends DisplayObjectStyle = DisplayObjectStyle> extends NodeOptions {
    style?: Style;
    hitRect?: boolean;
}
