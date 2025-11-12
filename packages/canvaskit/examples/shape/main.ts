import { CKEngine,Circle,Rect,Group } from "src/index"

const engine=new CKEngine()
await engine.init({
    canvas:document.querySelector('#canvas')!,
    width:500,
    height:500
})
const group=new Group()
group.position.set(100,100)
const rect=new Rect({
    style:{
        fillStyle:'red'
    },
    shape:{
        x:50,
        y:50,
        width:100,
        height:200
    }
})
group.add(rect)



const circle=new Circle({
    silent:true,
    style:{
        fillStyle:'red'
    },
    shape:{
        r:50
    },
    position:[300,100]
})
group.add(rect)
group.add(circle)
circle.on('pointerdown',e=>{
   // e.stopImmediatePropagation()
    console.log('circle',e.x,e.y)
})
circle.on('pointerdown',e=>{
   
    console.log('circle2',e.x,e.y)
})
group.on('pointerdown',e=>{
    
    console.log('group',e.target?.type,e.x,e.y)
})
engine.add(group)


engine.render()