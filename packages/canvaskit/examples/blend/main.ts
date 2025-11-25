import {CK,type CanvasKit} from 'src'

const blends=['Clear',
    'Src',
    'Dst',
    'SrcOver',
    'DstOver',
    'SrcIn',
    'DstIn',
    'SrcOut',
    'DstOut',
    'SrcATop',
    'DstATop',
    'Xor',
    'Plus',
    'Modulate',
    'Screen',
    'Overlay',
    'Darken',
    'Lighten',
    'ColorDodge',
    'ColorBurn',
    'HardLight',
    'SoftLight',
    'Difference',
    'Exclusion',
    'Multiply',
    'Hue',
    'Saturation',
    'Color',
    'Luminosity']
const canvasDom=document.createElement('canvas') as HTMLCanvasElement
canvasDom.width=500
canvasDom.height=500
document.body.appendChild(canvasDom)
const ck=CK.MakeWebGLCanvasSurface(canvasDom,CK.ColorSpace.SRGB)
const canvas=ck.getCanvas()




