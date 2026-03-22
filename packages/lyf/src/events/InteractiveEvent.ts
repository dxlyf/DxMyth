import type {INode} from 'src/interface/INode'
export type InteractiveEventMap=Record<string,InteractiveEvent>
export type InteractiveHandle<E extends InteractiveEvent>=(e:E)=>void;

export class InteractiveEvent<E extends Event=Event,Data=any>{
    type:string;
    data?:Data
    nativeEvent:E;
    target?:INode
    currentTarget?:INode
    cancelable?:boolean=true;// 是否可以取消事件默认行为
    bubbles?:boolean=true;// 是否冒泡事件
    defaultPrevented=false; // 是否阻止默认事件
    cancelBubble=false; // 是否阻止事件冒泡
    isImmediateCancelBubble=false; // 是否阻止事件立即冒泡
    constructor(){

    }
    preventDefault(){
        this.defaultPrevented=true;
        this.nativeEvent?.preventDefault()
    }
    stopPropagation(){
        this.cancelBubble=true;
    }
    stopImmediatePropagation(){
        this.stopPropagation()
        this.isImmediateCancelBubble=true
    }
    composedPath(){
        const path:INode[]=[];
        let current:INode|undefined=this.target;
        while(current){
            path.push(current);
            current=current.parent;
        }
        return path;
    }
    

}
export namespace InteractiveEvent{
    export const create=<Data=any>(type:string,data?:Data)=>{
        const event=new InteractiveEvent<Event,Data>();
        event.type=type;
        event.data=data;
        return event;
    };
    export const formEvent=<E extends Event,Data=any>(e:E,data?:Data)=>{
        const event=new InteractiveEvent<E,Data>();
        event.type=e.type
        event.nativeEvent=e;
        event.data=data;
        return event;
    }
}
