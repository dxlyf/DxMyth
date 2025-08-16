import {m2d} from '@dxyl/math'

export function clz32Len(x:number) {
    return 31-Math.clz32(x|0)
}

export default m2d.utils