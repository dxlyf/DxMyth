import {type CanvasKit,CK } from "src/canvaskit"
import { BoundingRect } from "src/math/BoundingRect"

type CommandParameter={
    moveTo:[number,number]
    lineTo:[number,number]
    quadTo:[number,number,number,number]
    cubicTo:[number,number,number,number,number,number]
    conicTo:[number,number,number,number,number]
    arcTo:[number,number,number,number,number]
    rect:[number,number,number,number]
    close:[]
}
type CommandType = keyof CommandParameter
type CommandData=[CommandType,...CommandParameter[CommandType]]

enum SegmentType{
    Line=1,
    Quad=1<<1,
    Cubic=1<<2,
    Conic=1<<3,
    Arc=1<<4,
    Rect=1<<5,
}
const SegmentTypeMap={
    quadTo:SegmentType.Quad,
    cubicTo:SegmentType.Cubic,
    conicTo:SegmentType.Conic,
    arcTo:SegmentType.Arc,
    rect:SegmentType.Rect,
 
}
class ProxyPath{
    segmentType:number
    cmds:CommandData[] = []
    lastPosition:number[] = [0,0]
    _bounds:BoundingRect|null = null
    _computeTightBounds:BoundingRect|null = null
    constructor() {
       
    }
    add(type:CommandType,...params:CommandParameter[CommandType]){
        this.cmds.push([type,...params])
        this._bounds=null
        this._computeTightBounds=null
    }
    moveTo(x:number,y:number){
        this.add('moveTo',x,y)
    }
    lineTo(x:number,y:number){
        this.add('lineTo',x,y)
    }
    quadraticCurveTo(cp1x:number,cp1y:number,x:number,y:number){
        this.add('quadTo',cp1x,cp1y,x,y)
    }
    cubicCurveTo(cp1x:number,cp1y:number,cp2x:number,cp2y:number,x:number,y:number){
        this.add('cubicTo',cp1x,cp1y,cp2x,cp2y,x,y)
    }
    conicTo(cp1x:number,cp1y:number,x:number,y:number,w:number){
        this.add('conicTo',cp1x,cp1y,x,y,w)
    }
    arcTo(x1:number,y1:number,x2:number,y2:number,radius:number){
        this.add('arcTo',x1,y1,x2,y2,radius)
    }
    rect(x:number,y:number,width:number,height:number){
        this.add('rect',x,y,width,height)
    }
    closePath(){
        this.add('close')
    }
    getBounds(){
        if(!this._bounds){
            this._bounds=new BoundingRect()
            const path=CK.Path.getPool()
            this.toCKPath(path)
            const bounds=path.getBounds()
            this._bounds.fromRect(bounds[0],bounds[1],bounds[2],bounds[3])
            path.releasePool()
        }
        return this._bounds
    }
    computeTightBounds(){
        if(!this._computeTightBounds){
            this._computeTightBounds=new BoundingRect()
            const path=CK.Path.getPool()
            this.toCKPath(path)
            const bounds=path.computeTightBounds()
            this._computeTightBounds.fromRect(bounds[0],bounds[1],bounds[2],bounds[3])
            path.releasePool()
        }
        return this._computeTightBounds
    }
    toCKPath(path:CanvasKit.Path){
        for(const cmd of this.cmds){
            const [type,...params]=cmd
            if(path[type as keyof CanvasKit.Path]){
                (path[type as keyof CanvasKit.Path] as (...args:any[])=>void)(...params)
            }
        }
        return path
    }
}

export {
    ProxyPath
}