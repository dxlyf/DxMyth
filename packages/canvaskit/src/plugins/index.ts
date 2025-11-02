import { IPreset } from "src/core/PluginService";

export const BrowserEnvPresets:IPreset={
    name:'BrowserEnvPresets',
    apply(api){
        return {
            plugins:[]
        }
    }
}