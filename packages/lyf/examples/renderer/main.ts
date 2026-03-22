import { Lyf } from "src/lyf"

let lyf=new Lyf()

lyf.initialize({
    canvas:document.getElementById('canvas')!,
    rendererType:'svg',
    resizeTo:'window'
   // width:600,
  //  height:400,
})