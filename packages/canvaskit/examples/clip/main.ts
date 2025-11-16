import { CKEngine,Circle,Rect,Group,Ellipse,GraphicPath, ClipPathUnits } from "src/index"

const engine=new CKEngine()
await engine.init({
    canvas:document.querySelector('#canvas')!,
    width:500,
    height:500,
    backgroundColor:'#efefef'
})
const circle=new Circle({
    style:{
        fillStyle:'red'
    },
    shape:{
     //   cx:150,
      //  cy:150,
        r:50,
    },
    position:[100,150]
})

//engine.add(circle)
const rect=new Rect({
    style:{
        clip:{
            object:circle,
           // clipPathUnits:ClipPathUnits.ObjectBoundingBox,
           // fillRule:'nonzero'
        },
        fillStyle:'red'
    },
    shape:{
        width:100,
        height:100,
    },
    position:[100,100]
})
engine.add(rect)

engine.start()