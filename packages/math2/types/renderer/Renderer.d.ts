import { EventEmitter } from '../events/EventEmitter';
import { PathBuilder } from '../math/PathBuilder';
import { Paint } from './Paint';
export type RendererEvents = {
    resize: [renderer: Renderer];
};
export interface RendererConstructor {
    new (): Renderer;
}
export type RendererInitProps = {
    domElement: HTMLElement;
    width: number;
    height: number;
    dpr: number;
};
export declare abstract class Renderer extends EventEmitter<RendererEvents> {
    width: number;
    height: number;
    dpr: number;
    abstract domElement: HTMLElement;
    constructor();
    abstract preInit(options: RendererInitProps): Promise<void>;
    init(options: RendererInitProps): Promise<void>;
    setDpr(dpr: number): void;
    updateSize(updateStyle?: boolean): void;
    setSize(width: number, height: number, dpr?: number): void;
    abstract drawPath(path: PathBuilder, paint: Paint): void;
    abstract fillText(text: string, x: number, y: number, paint: Paint): void;
}
