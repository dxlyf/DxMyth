import canvasKit,{type CanvasKit}  from 'src/canvaskit'

export class SkiaPath2D{
    _path:CanvasKit.Path
    constructor(){
        this._path=new canvasKit.ck.Path()
    }
    dispose(){
        this._path.delete()
    }
}