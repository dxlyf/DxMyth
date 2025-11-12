import { CKEngine } from "src/core/CKEngine";
import { IPlugin } from "src/core/PluginService";
import { CKEnginePluginHooks, CKEnginePluginMethods } from "src/types/CKEngine";

export default {
    name: 'DebugPlugin',
    apply(api) {

        if(!api.ctx.options.debug?.showBounds){
      
            api.ctx.on('init',(engine)=>{
                engine.renderer.on('object:rendered',info=>{
                        const obj=info.object
                        const rnederer=info.renderer
                        const bounds=obj.globalBounds.clone()
                      //  const matrix=obj.worldMatrix
                      //  bounds.applyMatrix(matrix)
                        rnederer.save()
                        rnederer.beginPath()
                        rnederer.strokeStyle='#00ff00'
                        rnederer.lineWidth=2
                        rnederer.rect(bounds.left,bounds.top,bounds.width,bounds.height)
                        rnederer.stroke()
                        rnederer.restore()
                })
            })
        }

    }
} as IPlugin<CKEngine, CKEnginePluginHooks, CKEnginePluginMethods>
