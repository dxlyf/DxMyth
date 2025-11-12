import { Matrix2D, type Matrix2DLike } from 'src/math/Matrix2D'
import { CK, type CanvasKit } from 'src/canvaskit'

export enum PatternRepeat {
    repeat = 'repeat',
    noRepeat = 'no-repeat',
    repeatX = 'repeat-x',
    repeatY = 'repeat-y'
}
export class Pattern   {
    static isPattern(style: unknown) {
        if (style instanceof Pattern) {
            return true;
        }
        return false
    }
    ckImage: CanvasKit.Image | null = null
    _tileX: CanvasKit.TileMode
    _tileY: CanvasKit.TileMode
    image: CanvasImageSource | null = null
    repetition: string | null = PatternRepeat.repeat
    matrix?:Matrix2D
    _shader:CanvasKit.Shader|null=null
    isPattern=true
    type='Pattern'
    constructor(image: CanvasImageSource, repetition: string | null = PatternRepeat.repeat) {
        this.image = image;
        this.ckImage = CK.MakeImageFromCanvasImageSource(this.image!)
        this.repetition = repetition
        switch (repetition) {
            case 'repeat-x':
                this._tileX = CK.TileMode.Repeat;
                this._tileY = CK.TileMode.Decal;
                break;
            case 'repeat-y':
                this._tileX = CK.TileMode.Decal;
                this._tileY = CK.TileMode.Repeat;
                break;
            case 'repeat':
                this._tileX = CK.TileMode.Repeat;
                this._tileY = CK.TileMode.Repeat;
                break;
            case 'no-repeat':
                this._tileX = CK.TileMode.Decal;
                this._tileY = CK.TileMode.Decal;
                break;
            default:
                throw 'invalid repetition mode ' + repetition;
        }
    }
    copy(source: Pattern) {
        this.image = source.image
        this.repetition = source.repetition
        return this;
    }
    clone(): Pattern {
        return new Pattern(this.image!, this.repetition)
    }
    setTransform(matrix?:Matrix2D): void {
        if(!this.matrix){
            this.matrix=Matrix2D.identity()
        }
        if(matrix){
            this.matrix.copy(matrix)
        }
    }
    equals(other: Pattern): boolean {
        if (this.image !== other.image) return false
        if (this.repetition !== other.repetition) return false
        return true;
    }
    makeCKImage() {
        if (!this.ckImage) {
            this.ckImage = CK.MakeImageFromCanvasImageSource(this.image!)
        }
    }
    getShader(matrix?:Matrix2D) {
        if(this._shader){
            return this._shader
        }
        this._shader=this.ckImage.makeShaderCubic(this._tileX, this._tileY,1/3,1/3,this.matrix?this.matrix.toRowMajorOrderMatrix3x3():null)
        return this._shader
    }
   dispose() {
        this._shader?.delete();
        this._shader = null;
    };
}
