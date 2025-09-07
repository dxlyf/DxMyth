
function loadImage(url:string){
    return new Promise<HTMLImageElement>((resolve,reject)=>{
        const image=new Image()
        image.onload=()=>{
            resolve(image)
        }
        image.onerror=(e)=>{
            reject(e)
        }
        image.src=url
    })
}
export class ImageSource{
    static default(){
        return new this()
    }
    static fromUrl(url:string){
        let imageSource=this.default()
        loadImage(url).then(img=>{
            imageSource.set(img)
        })
        return imageSource
    }
    static fromImage(image:CanvasImageSource){
        const imgSrc=this.default()
        return imgSrc.set(image)
    }

    static fromImageData(imageData:ImageBitmap){
        const imgSrc=this.default()
        createImageBitmap(imageData).then(img=>{
            imgSrc.set(img)
        })
        return imgSrc
    }
    sourceUrl:string=''
    source:CanvasImageSource|null=null
    complete:boolean=false;
    cb:()=>void
    shouldRenderer():boolean{
        return this.source!==null&&this.complete
    }
    onChange(cb:()=>void){
        this.cb=cb
    }
    from(source:string|CanvasImageSource){
        if(typeof source==='string'){
            if(this.sourceUrl!==source){
                this.complete=false
                this.sourceUrl=source
                loadImage(source).then(img=>{
                    this.set(img)
                })
            }
        }else{
            if(this.source!==source){
                this.set(source)
            }
        }
        return this;
    }
    set(image:CanvasImageSource){
        this.source=image
        this.complete=true;
        this.cb?.()
        return this
    }
}