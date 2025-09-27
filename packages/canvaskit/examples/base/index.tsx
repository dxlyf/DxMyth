import {Application} from 'src'

let app=new Application({
    canvas:document.getElementById('canvas')! as HTMLCanvasElement,
    width:500,
    height:500
})
app.initialize()