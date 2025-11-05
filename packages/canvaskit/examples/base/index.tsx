import {CKEngine} from 'src'
import {Rect} from 'src'

const renderer=new CKEngine()
await renderer.init({
    canvas:document.querySelector('#canvas')!,
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
renderer.add(rect)
let rect2=new Rect({
     shape:{
        width:100,
        height:100,
     },
     style:{
        fillStyle:'#ff0000'
     },
     position:[100,220]
})
renderer.add(rect2)
renderer.render()
