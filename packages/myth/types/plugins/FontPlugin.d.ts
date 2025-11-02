import { Plugin } from '../../../../../../../../src/core/PluginManager';
import { IApplication } from '../../../../../../../../src/types/core/Application';
import { ExtensionType } from '../../../../../../../../src/extensions';
import { FontMap } from '../../../../../../../../src/font';
declare module '../types/core/Application.ts' {
    interface IApplication {
        fonts: FontMap;
    }
}
declare module '../core/Application.ts' {
    interface Application {
        fonts: FontMap;
    }
}
declare class FontPlugin extends Plugin<IApplication> {
    static name: string;
    static extension: ExtensionType;
    resizeId: number;
    width: number;
    height: number;
    resizeType: 'window' | 'element' | 'none';
    create(): void;
    init(): void;
    destroy(): void;
}
export default FontPlugin;
