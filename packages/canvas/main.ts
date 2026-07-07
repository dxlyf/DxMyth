import {CanvasRenderer} from 'src/renderer/canvas/CanvasRenderer'
import Stats from 'src/utils/stats'
const canvas=document.createElement('canvas')
document.body.appendChild(canvas)

const renderer=new CanvasRenderer({
    canvas:canvas,
    width:500,
    height:500,
    dpr:window.devicePixelRatio
})
// renderer.setStyles({
//     fillStyle:'red',
//     font:'40px sans-serif',
// })
// renderer.fillText('Hell world',100,100)
const count=5000;

const random=(min:number,max:number)=>{
    return Math.floor(min+(max-min)*Math.random())
}
const rects=Array.from({length:count},()=>({
    x:random(0,500),
    y:random(0,500),
    w:random(40,100),
    h:random(40,100),

    fillStyle:'#'+Math.random().toString(16).slice(-6),
    speed:random(1,5),
    update:function(){
         this.x+=this.speed
         if(this.x>500){
            this.x=0
         }
    }
}))
const p=Stats()
document.body.appendChild(p.domElement)

const test=(ctx:CanvasRenderer)=>{

   ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
   ctx.setTransform(renderer.dpr,0,0,renderer.dpr,0,0)
   rects.forEach(d=>{
        ctx.save()
        ctx.translate(d.x,d.y)
        ctx.beginPath()
        // ctx.setStyles({
        //     fillStyle:d.fillStyle
        // })
        ctx.fillStyle=d.fillStyle
        ctx.rect(0,0,d.w,d.h)
        ctx.fill()
        d.update()
        ctx.restore()
   })
}
const loop=()=>{
    p.update()

    test(renderer.ctx)
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)