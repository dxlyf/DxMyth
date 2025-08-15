import {SyncHook,SyncBailHook,AsyncSeriesBailHook,ContextTap} from './src/index'

 
interface Context{
    service:IRenderService
}
interface IRenderService{
    draw():void

}
class Context{
    service:IRenderService
}
class CanvasService implements IRenderService{
    constructor(public ctx:Context){
    }
    draw(){
        console.log('canvas draw')
    }
}
class WebGpuService implements IRenderService{
    constructor(public ctx:Context){
    }
    draw(){
        console.log('Webgpu draw')
    }
}
const hooks={
    service:new SyncBailHook<[ctx:Context],IRenderService>,
    resize:new SyncHook<[width:number,height:number]>()

}

hooks.service.tap({name:'canvas-service',context:true},()=>{
    
    return new CanvasService(ctx)
})
hooks.service.tap({
    name:'gpu-service',
    stage:-1 // 覆盖canvas-service插件
},(ctx)=>{
    return new WebGpuService(ctx)
})


let ctx=new Context()
ctx.service=hooks.service.call(ctx)!
ctx.service.draw()
// or
hooks.service.callAsync(ctx,(err,service)=>{
    if(err) {
        throw 'No service created'
    }
    ctx.service=service!
    ctx.service.draw()
})

hooks.resize.tap('resize',((width,height)=>{
    console.log(width,height)
}))
hooks.resize.tap('resize2',((width,height)=>{
    console.log('resize2',width,height)
}))
hooks.resize.callAsync(100,200,()=>{
    console.log('done')
})

