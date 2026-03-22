
export function debounce<T extends (...args: any) => any>(fn: T, delay: number) {
    let timer: any = null
    return function (this:any,...args: Parameters<T>) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}