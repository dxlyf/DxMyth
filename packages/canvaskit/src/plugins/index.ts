import { IPreset } from "src/core/PluginService";
import InteractionPlugin from "./InteractionPlugin";
export const BrowserEnvPresets:IPreset={
    name:'BrowserEnvPresets',
    apply(api){
        return {
            plugins:[InteractionPlugin]
        }
    }
}