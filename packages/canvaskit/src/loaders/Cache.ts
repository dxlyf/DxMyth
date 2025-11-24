import {LRUCache} from '../core/LRUCache'
const cache= new LRUCache();
export default {
    enable:true,
    add(key:string,value:any){
        if(!this.enable){
            return;
        }
        cache.set(key,value);
    },
    get(key:string){
        if(!this.enable){
            return undefined;
        }
        return cache.get(key);
    },
    has(key:string){
        return cache.has(key);
    },
    remove(key:string){
        cache.remove(key);
    },
    clear(){
        cache.clear();
    }
}