
import { loadImage } from 'src/utils/loadResource'
import { Matrix2D } from './Matrix2D'


export class Pattern {
     static fromUrl(url:string){
        const pattern = new Pattern()
        loadImage(url).then((image)=>{
            pattern.source=image
        })
        return pattern
    }
    static fromImage(image:CanvasImageSource){
        const pattern = new Pattern()
        pattern.source=image
        return pattern
    }
    type:'pattern'='pattern'
    elementType:'image'
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y'='repeat'
    source: CanvasImageSource
    matrix:Matrix2D
    ref:any
    constructor(image?:CanvasImageSource,repeat:'repeat' | 'repeat-x' | 'repeat-y'='repeat'){
        this.source=image||null
        this.repeat=repeat||'repeat'
    }
    clone(): Pattern {
        const pattern = new Pattern(this.source,this.repeat)
        pattern.copy(this)
        return pattern
    }
    copy(source: Pattern): void {
        this.source=source.source
        this.repeat=source.repeat
        this.matrix=source.matrix?.clone()
    }

}
