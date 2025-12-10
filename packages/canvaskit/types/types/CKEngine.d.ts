import { CKEngine } from '../../../../../../../src/core/CKEngine';
import { PluginServiceOPtions } from '../../../../../../../src/core/PluginService';
import { CanvaskitRendererOptions } from '../../../../../../../src/types/Renderer';
export type CKEngineEvents = {
    init: [engine: CKEngine];
    update: [engine: CKEngine];
    render: [engine: CKEngine];
    dispose: [engine: CKEngine];
};
export type CKEngineOptions = {
    alwaysRefresh?: boolean;
    debug?: {
        showPerformance?: boolean;
        showBounds?: boolean;
    };
} & PluginServiceOPtions & CanvaskitRendererOptions;
export type CKEnginePluginHooks = {
    register: string;
};
export type CKEnginePluginMethods = {};
