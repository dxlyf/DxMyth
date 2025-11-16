import { CKEngine,Circle,Rect,Group,Ellipse,GraphicPath } from "src/index"

const engine=new CKEngine()
await engine.init({
    canvas:document.querySelector('#canvas')!,
    width:500,
    height:500
})

const ellipse=new Ellipse({
    style:{
        fillStyle:'red'
    },
    shape:{
        rx:50,
        ry:70,
    },
    position:[100,100]
})
engine.add(ellipse)
const ellipse3=new Ellipse({
    style:{
        fillStyle:'#ffff00'
    },
    shape:{
        rx:50,
        ry:70,
    },
    position:[100,150]
})
engine.add(ellipse3)

const ellipse2=new Ellipse({
    style:{
        fillStyle:'green'
    },
    shape:{
        rx:50,
        ry:70,
    },
    position:[150,100],
})
engine.add(ellipse2)

const path=new GraphicPath({
    position:[300,100]
})
path.beginPath()
path.rect(0,0,100,100)
path.moveTo(0,220)
path.arc(0,220,50,0,Math.PI*2)
path.drawPaint({
    fillStyle:'green',
})
engine.add(path)


engine.start()