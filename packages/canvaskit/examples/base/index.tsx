import {CKEngine,MakeCanvas, Matrix2D} from 'src'
import {Rect} from 'src'
import { BorderSide } from 'src'

// const canvas=MakeCanvas(500,500)
// const ctx=canvas.getContext('2d')!

// const linear2=ctx.createLinearGradient(0,0,100,100)
// linear2.addColorStop(0,'#ff0000')
// linear2.addColorStop(0.5,'#00ff00')
// linear2.addColorStop(1,'#0000ff')
// ctx.beginPath()
// ctx.save()

// ctx.rect(0,0,100,100)

// ctx.fillStyle=linear2
// ctx.fill()

// let imgsrc=canvas.toDataURL('image/png',1.0)

// let img=new Image()
// img.src=imgsrc
// document.body.appendChild(img)
const engine=new CKEngine()
await engine.init({
    canvas:document.querySelector('#canvas')!,
   // dpr:1,
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
     position:[340,100]
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

let rect22=new Rect({
   shape:{
      width:100,
      height:100,
   },
   style:{
      strokeStyle:'#ff0000',
      lineWidth:10,
      borderSide:BorderSide.Outside
   },
   position:[100,340]
})
engine.add(rect22)
let rect223=new Rect({
   shape:{
      width:100,
      height:100,
   },
   style:{
      strokeStyle:'#ff0000',
      lineWidth:10,
      borderSide:BorderSide.Inside
   },
   position:[100,100]
})
engine.add(rect223)
let linear=engine.renderer.createLinearGradient(0,0,100,100)
linear.addColorStop(0,'#ff0000')
linear.addColorStop(0.5,'#00ff00')
linear.addColorStop(1,'#0000ff')

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



let radial=engine.renderer.createRadialGradient(1,1,0,1,1,1)
radial.addColorStop(0,'#ff0000')
radial.addColorStop(0.5,'#00ff00')
radial.addColorStop(1,'#0000ff')
radial.transform(Matrix2D.fromValues(50,0,0,50,0,0))
let rect4=new Rect({
     shape:{
        width:100,
        height:100,
     },
     style:{
        fillStyle:radial
     },
     position:[220,220]
})
engine.add(rect4)

let conic=engine.renderer.createConicGradient(0,50,50)
conic.addColorStop(0,'#ff0000')
conic.addColorStop(0.5,'#00ff00')
conic.addColorStop(1,'#0000ff')

let rect5=new Rect({
     shape:{
        width:100,
        height:100,
     },
     style:{
        fillStyle:conic
     },
     position:[220,340]
})
engine.add(rect5)
engine.render()
