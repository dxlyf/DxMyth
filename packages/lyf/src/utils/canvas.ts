import { isFiniteNumber } from './lang'

const createCanvas = (width: number, height: number, dpr: number = 1) => {
    const canvas = document.createElement('canvas')
    canvas.width = dpr * width >> 0
    canvas.height = dpr * height >> 0

    if(dpr>1){
        canvas.style.width=`${width}px`
        canvas.style.height=`${height}px`
    }
    return canvas
}

export {
    createCanvas
}
