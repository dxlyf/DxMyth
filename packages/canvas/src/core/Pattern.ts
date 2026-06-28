import { Matrix2D } from "../math/Matrix2D"

export class Pattern   {
    type: string
    matrix?: Matrix2D
    image?: CanvasImageSource
    repetition?: string | null
    setTransform(matrix: Matrix2D): void {
        this.matrix = matrix
    }
    clone(){
        return new (this.constructor as typeof Pattern)().copy(this)
    }
    copy(source:Pattern){
        if(source.matrix){
            if(!this.matrix){
                this.matrix=Matrix2D.identity()
            }
            this.matrix.copy(source.matrix)
        }
        this.image=source.image
        this.repetition=source.repetition
        return this
    }
}

