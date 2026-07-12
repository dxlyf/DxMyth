
import { loadImage } from 'src/utils/loadImage'
import { ColorValue,Color } from 'src/math/Color'

export type IPattern = {
    type: 'pattern'
    elementType: 'image'
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y'
    source: CanvasImageSource
    clone(): Pattern
    copy(source: Pattern): void
}
export class Pattern implements IPattern{
    type:'pattern'='pattern'
    elementType:'image'
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y'='repeat'
    source: CanvasImageSource
    clone(): IPattern {
        throw new Error('Method not implemented.')
    }
    copy(source: IPattern): void {
        throw new Error('Method not implemented.')
    }

}
export class ImagePattern extends Pattern{
    static fromUrl(url:string){
        const pattern = new ImagePattern()
        loadImage(url).then((image)=>{
            pattern.source=image
        })
        return pattern
    }
    static fromImage(image:CanvasImageSource){
        const pattern = new ImagePattern()
        pattern.source=image
        return pattern
    }
    elementType:'image'='image'
    source: CanvasImageSource=null
    constructor(){
        super()
    }
    clone() {
        const pattern = new ImagePattern()
        pattern.copy(this)
        return pattern
    }
    copy(source: ImagePattern): void {
        this.source=source.source
        this.repeat=source.repeat
        this.elementType=source.elementType
        this.type=source.type
    }
}