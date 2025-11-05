import { IDispose } from 'src/types/Dispose'
import {CK} from './canvaskit'
import type * as Canvaskit from './canvaskit'



class Path extends CK.Path implements IDispose{
    constructor(){
        super()
    }
    dispose(){
        if(!super.isDeleted()){
            super.delete()
        }
    }
}
