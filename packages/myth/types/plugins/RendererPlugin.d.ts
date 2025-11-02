import { Plugin } from '../../../../../../../../src/core/PluginManager';
import { IApplication } from '../../../../../../../../src/types/core/Application';
import { ExtensionType } from '../../../../../../../../src/extensions';
declare module '../types/core/Application.ts' {
    interface ApplicationOptions {
        renderMode?: 'canvas' | 'webgl';
    }
}
export default class extends Plugin<IApplication> {
    static name: string;
    static extension: ExtensionType;
    create(): void;
}
