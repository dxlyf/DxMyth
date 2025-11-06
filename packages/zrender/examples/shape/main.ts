import {init,Rect} from 'src/all'



const zr = init(document.getElementById('zr') as HTMLElement,{
    width: 500,
    height: 500
})

const rect=new Rect({
    shape:{
        width:100,
        height:100
    },
    style:{
        fill:'red'
    },
    x:100,
    y:100
})
zr.add(rect)

const bounds=rect.getBoundingRect()
bounds.applyTransform(rect.getComputedTransform())
console.log('bounds',bounds)
const rect2=new Rect({
    shape:{
        width:bounds.width,
        height:bounds.height
    },
    style:{
        fill:'none',
        stroke:'blue',
        lineWidth:2
    },
    x:bounds.x,
    y:bounds.y
})
zr.add(rect2)