import { DisplayObjectOptions, DisplayObjectEvents } from '../../../../../../../src/types/DisplayObject';
import { Node } from './Node';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
/**
 * 显示对象基类
*/
declare abstract class DisplayObject<Options extends DisplayObjectOptions = DisplayObjectOptions> extends Node<Options, DisplayObjectEvents> {
    type: string;
    constructor(options?: Options);
    init(): void;
    getDefaultProps(): Options[];
    get style(): Options['style'];
    setStyle(style: Options['style']): void;
    dirtyStyle(): void;
    shouldRender(): boolean;
    hitPath(x: number, y: number): boolean;
    hit(x: number, y: number): boolean;
    abstract innerCalcBounds(): void;
    renderBefore(renderer: CanvaskitRenderer): void;
    /**
     * renderer.render
     *   object.render
     * renderer.renderObject
     *   object.renderBefore
     *   object.startDraw
     *   object.draw
     *   object.endDraw
     *   object.renderAfter
     *
     * 渲染对象
     * @param renderer 渲染器
     */
    render(renderer: CanvaskitRenderer): void;
    startDraw(renderer: CanvaskitRenderer): void;
    draw(renderer: CanvaskitRenderer): void;
    endDraw(renderer: CanvaskitRenderer): void;
    renderAfter(renderer: CanvaskitRenderer): void;
}
export { DisplayObject };
