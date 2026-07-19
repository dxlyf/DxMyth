
export async function loadImage(url: string): Promise<HTMLImageElement> {
    const image = new Image()
    image.src = url
    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    })
    return image
}

export async function loadJSON<T = any>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to load JSON: ${url} (${response.status})`)
    }
    return response.json()
}

export async function loadText(url: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to load text: ${url} (${response.status})`)
    }
    return response.text()
}

export async function loadBlob(url: string): Promise<Blob> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to load blob: ${url} (${response.status})`)
    }
    return response.blob()
}

export async function loadArrayBuffer(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to load array buffer: ${url} (${response.status})`)
    }
    return response.arrayBuffer()
}

export async function loadAudio(url: string): Promise<HTMLAudioElement> {
    const audio = new Audio()
    audio.src = url
    await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve()
        audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`))
    })
    return audio
}

export async function loadVideo(url: string): Promise<HTMLVideoElement> {
    const video = document.createElement('video')
    video.src = url
    await new Promise<void>((resolve, reject) => {
        video.oncanplaythrough = () => resolve()
        video.onerror = () => reject(new Error(`Failed to load video: ${url}`))
    })
    return video
}

/** 批量加载资源，全部成功才返回，任一失败则 reject */
export async function loadResources(
    urls: string[],
    loader: (url: string) => Promise<any>
): Promise<any[]> {
    return Promise.all(urls.map(loader))
}
