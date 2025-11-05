import {Matrix2dLike} from '../math/Matrix2d'

export enum PatternRepeat{
    repeat='repeat',
    noRepeat='no-repeat',
    repeatX='repeat-x',
    repeatY='repeat-y'
}
export class Pattern implements CanvasPattern{
    static isPattern(style:unknown){
        if(style instanceof Pattern){
            return  true;
        }
        return false
    }
    image:CanvasImageSource|null=null
    repetition:string|null=PatternRepeat.repeat
    constructor(image: CanvasImageSource, repetition: string|null=PatternRepeat.repeat){
        this.image = image;
        this.repetition = repetition
    }
    copy(source:Pattern){
        this.image=source.image
        this.repetition=source.repetition
        return this;
    }
    clone():Pattern{
        return new Pattern(this.image!, this.repetition)
    }
    setTransform(transform?: Matrix2dLike|DOMMatrixInit): void {
        throw new Error("Method not implemented.");
    }
    equals(other: Pattern): boolean {
        if(this.image!==other.image) return false
        if(this.repetition!==other.repetition) return false
        return true;
    }
    toCanvasPattern(ctx:CanvasRenderingContext2D): CanvasPattern|null{
        if(!this.image){
            return null
        }
        const pattern=ctx.createPattern(this.image!, this.repetition)
        return pattern
    }

}
