import {isDevelopment} from './env'
export function warn(message:string){
   if(isDevelopment){
     console.warn(message)
   }
}
export function assert(message:string){
   if(isDevelopment){
     console.assert(message)
   }
}