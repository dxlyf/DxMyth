import type {IPlugin} from 'src/core/PluginService'
import { PluginService } from 'src/core/PluginService';
import type { CKEnginePluginHooks,CKEnginePluginMethods} from 'src/types/CKEngine';



export default {
    name:'InteractionPlugin',
    apply(api) {
     

    }
} as IPlugin<CKEnginePluginHooks,CKEnginePluginMethods>
