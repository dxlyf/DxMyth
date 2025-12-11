import { CK, type CanvasKit } from 'src/canvaskit'
import { DisposableManager } from './Disposable'
function loadImageFromUrl(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = document.createElement('img')
        image.crossOrigin = 'anonymous'
        image.onload = () => {
            resolve(image)
        }
        image.onerror = (e) => {
            reject(e)
        }
        image.src = url
    })
}
function loadImageBitmapFromImageBitmapSource(imageData: ImageBitmapSource) {
    return createImageBitmap(imageData)
}
class Image {
    static default() {
        return new this()
    }
    static fromUrl(url: string) {
        let imageSource = this.default()
        loadImageFromUrl(url).then(img => {
            imageSource.setImage(img)
        })
        return imageSource
    }
    static fromImageSource(image: CanvasImageSource) {
        const imgSrc = this.default()
        return imgSrc.setImage(image)
    }

    static fromImageBitmapSource(imageData: ImageBitmapSource) {
        const imgSrc = this.default()
        loadImageBitmapFromImageBitmapSource(imageData).then(img => {
            imgSrc.setImage(img)
        })
        return imgSrc
    }
    sourceUrl: string = ''
    image: CanvasImageSource | null = null
    skImage: CanvasKit.Image | null = null
    complete: boolean = false;
    constructor(){
        DisposableManager.add(this)
    }
    cb: () => void
    shouldRenderer(): boolean {
        return this.image !== null && this.complete
    }
    onChange(cb: () => void) {
        this.cb = cb
    }
    width(){
        return this.skImage!.width()
    }
    height() {
        return this.skImage!.height()
    }
    setImage(image: CanvasImageSource) {
        this.image = image
        this.skImage = CK.MakeImageFromCanvasImageSource(image)
        this.complete = true;
        this.cb?.()

        return this
    }
    dispose() {
        this.skImage?.delete()
        this.image = null
        this.complete = false
    }
}
export {
    Image,
    loadImageFromUrl,
    loadImageBitmapFromImageBitmapSource
}