

type HandleContext = {
    stop: () => void
    remove: () => void
}
type Handle<T extends any[]> = (...args: [...T, context: HandleContext]) => void
type HandleItem<T extends any[]> = {
    fn: Handle<T>
    stage: number
    once: boolean
}
type Options = {
    stage?: number
    once?: boolean
}
type Unsubscribe = () => void
interface Signals<T extends any[]> {
    add(handle: Handle<T>, options?: Options): Unsubscribe
    remove(handle: Handle<T>): void
    dispatch(...args: T): void
    clear(): void
}
export function Signals<T extends any[]>(): Signals<T> {


    let all: HandleItem<T>[] = []
    const signals = {
        add(handle: Handle<T>, options?: Options) {
            options = { stage: 0, once: false, ...(options ?? {}) }

            let index = all.findIndex(h => (options.stage!) < h.stage)
            if (index !== -1) {
                all.splice(index, 0, { fn: handle, stage: options.stage!, once: options.once! })
            } else {
                all.push({ fn: handle, stage: options.stage!, once: options.once! })
            }
            let wasDeleted = false
            return () => {
                if (!wasDeleted) {
                    wasDeleted = true
                    signals.remove(handle)
                }
            }
        },
        remove(handle: Handle<T>): void {
            all = all.filter(h => h.fn !== handle)
        },
        dispatch(...args: T): void {
            let stoped = false, removed = false

            const context: HandleContext = {
                stop: () => {
                    stoped = true
                },
                remove: () => {
                    removed = true
                }
            }
            all.some(d => {
                d.fn(...args, context)
                if (removed||d.once) {
                    signals.remove(d.fn)
                }
                return stoped
            })
        },
        clear() {
            all.length = 0
        }
    } as Signals<T>
    return signals
}
