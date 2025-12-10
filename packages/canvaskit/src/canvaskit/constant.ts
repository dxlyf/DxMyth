import { CK,getCanvasKit} from './canvaskit'
type GetProp<T, K extends keyof T> = T[K]
let TextAlign={
} as GetProp<typeof CK,'TextAlign'>

export const initConstant=(ck:typeof CK)=>{
    TextAlign=ck.TextAlign

}
getCanvasKit().then(ck=>{
    initConstant(ck)
})
export default {
    TextAlign,
}