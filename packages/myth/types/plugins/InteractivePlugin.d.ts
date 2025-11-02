import { Plugin } from '../../../../../../../../src/core/PluginManager';
import { IApplication } from '../../../../../../../../src/types/core/Application';
import { ExtensionType } from '../../../../../../../../src/extensions';
import { EventHandle } from '../../../../../../../../src/input/EventHandle';
declare module '../types/core/Application.ts' {
    interface ApplicationOptions {
        interactive?: boolean;
    }
}
export default class extends Plugin<IApplication> {
    static name: string;
    static extension: ExtensionType;
    interactives: EventHandle<any, any>[];
    init(): void;
    onUpdate: () => void;
    onResize: () => void;
    destroy(): void;
}
