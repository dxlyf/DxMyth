import { IDisplayObject } from '../../../../../../../../src/types/core/DisplayObject';
import { IPaint, PaintColor, RenderObject } from '../../../../../../../../src/types/core/Paint';
import { IViewport } from '../../../../../../../../src/types/core/Viewport';
export declare function isValidStyle(style: PaintColor): boolean;
export declare function getPaintType(style: PaintColor): Partial<IPaint>;
export declare function getFillPaint(object: IDisplayObject): IPaint | null;
export declare function getStrokePaint(object: IDisplayObject): IPaint;
type RenderListConfig = {
    objects: IDisplayObject[];
    dpr: number;
    viewport: IViewport;
};
/**
 * 获取最终需要渲染的对象列表

 * @param object
 */
export declare function getRendertList(config: RenderListConfig): RenderObject[];
export {};
