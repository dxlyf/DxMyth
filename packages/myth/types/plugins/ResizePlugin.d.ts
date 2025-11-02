import { Plugin } from '../../../../../../../../src/core/PluginManager';
import { IApplication } from '../../../../../../../../src/types/core/Application';
import { ExtensionType } from '../../../../../../../../src/extensions';
declare module '../types/core/Application.ts' {
    /**
     *  resizeTo: 控制画布是适应窗口(window)还是父元素(parent)
        fit: 控制内容如何适应容器：
            contain: 保持宽高比，完整显示内容
            cover: 保持宽高比，填满容器（可能裁剪）
            fill: 拉伸填满容器
            none: 使用原始尺寸
        */
    interface ApplicationOptions {
        canvas: HTMLCanvasElement;
        width?: number;
        height?: number;
        resizeTo?: HTMLElement | Window;
    }
}
declare class ResizePlugin extends Plugin<IApplication> {
    static name: string;
    static extension: ExtensionType;
    resizeId: number;
    width: number;
    height: number;
    resizeType: 'window' | 'element' | 'none';
    create(): void;
    init(): void;
    private setupResizeObserver;
    getContainerDimension(): void;
    handleResize: () => void;
    resize: () => void;
    destroy(): void;
}
export default ResizePlugin;
