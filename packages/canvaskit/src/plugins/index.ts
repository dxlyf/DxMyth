import { IPreset } from "src/core/PluginService";
import InteractionPlugin from "./InteractionPlugin";
import DebugPlugin from "./DebugPlugin";
export const BrowserEnvPresets:IPreset={
    name:'BrowserEnvPresets',
    apply(api){
        return {
            plugins:[DebugPlugin,InteractionPlugin]
        }
    }
}
export {
    InteractionPlugin,
    DebugPlugin,
}