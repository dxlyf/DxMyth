
export async function loadImage(url:string){
    const image = new Image()
    image.src=url
    await new Promise((resolve,reject)=>{
        image.onload=()=>{
            resolve(image)
        }
        image.onerror=()=>{
            reject(new Error('Failed to load image'))
        }
    })
    return image
}