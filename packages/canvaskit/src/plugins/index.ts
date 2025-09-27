import { IPreset } from "src/core/PluginService";
import RendererPlugin from './RendererPlugin'

export const BrowserEnvPresets:IPreset={
    name:'BrowserEnvPresets',
    apply(api){
        return {
            plugins:[RendererPlugin]
        }
    }
}