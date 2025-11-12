import type { CKEngine } from "src/core/CKEngine"
import type { PluginServiceOPtions } from "src/core/PluginService"
import type { CanvaskitRendererOptions } from "src/types/Renderer"


export type CKEngineEvents={
    init:[engine:CKEngine] // 初始化完成
    update:[engine:CKEngine] // 更新前
    render:[engine:CKEngine]
    dispose:[engine:CKEngine] // 销毁前
}
export type CKEngineOptions={
    debug?:{
        showBounds?:boolean
    }
 
}&PluginServiceOPtions&CanvaskitRendererOptions

export type CKEnginePluginHooks={
    register:string
}
export type CKEnginePluginMethods={

}



