import {CKEngine} from 'src'
import {Rect} from 'src'

const engine=new CKEngine()
await engine.init({
    canvas:document.querySelector('#canvas')!,
    dpr:1,
    width:500,
    height:500
})
let rect=new Rect({
     shape:{
        width:100,
        height:100,
     },
     style:{
        fillStyle:'#ffff00'
     },
     position:[100,100]
})
engine.add(rect)
let rect2=new Rect({
     shape:{
        width:100,
        height:100,
     },
     style:{
        strokeStyle:'#ff0000',
        lineWidth:10
     },
     position:[100,220]
})
engine.add(rect2)

let linear=engine.renderer.createLinearGradient(0,0,100,100)
linear.addColorStop(0,'#ffff00')
linear.addColorStop(1,'#ff0000')
let rect3=new Rect({
     shape:{
        width:100,
        height:100,
     },
     style:{
        fillStyle:linear
     },
     position:[220,100]
})
engine.add(rect3)
engine.render()
