
const hasOwn = Object.hasOwn


type ReactElement = {
    $$typeof:any
    type: any,
    key: string | number | null,
    ref:any
    props: any
}
type WorkTag=number
const FunctionComponent = 0;
const HostRoot = 3;
const HostComponent = 5;
const HostText = 6;
const Fragment = 7;
const ContextConsumer = 9;
const ContextProvider = 10;

const REACT_ELEMENT_TYPE=Symbol.for('react.element');
const REACT_FRAGMENT_TYPE=Symbol.for('react.fragment');
const REACT_CONTEXT_TYPE =Symbol.for('react.context');

function createElement(type: any, config: any, ...children: any) {
    const props: any = {}
    let key = null
    if (config) {
        for (const key in config) {
            if (key === 'key') {
                continue
            }
            props[key] = config[key]
        }
        if (hasOwn(config, 'key')) {
            key = config.key + ''
        }
    }
    const childrenLength = children.length
    if (childrenLength > 0) {
        if (childrenLength === 1) {
            props.children = children[0]
        } else {
            props.children = children
        }
    }
    return reactElement(type,key,props)
}

function reactElement(type:ReactElement['type'], key:ReactElement['key'], props:ReactElement['props']) {
  const refProp = props.ref;

  const ref = refProp !== undefined ? refProp : null;

  let element:ReactElement={
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref,
      props,
    };
  

  return element;
}
class FiberNode{
    //   Instance
    tag:WorkTag
    type: any=null;
    elementType:any=null
    key: any;
    stateNode:any=null
    // Fiber
    return: FiberNode|null = null;
    child: FiberNode | null = null;
    sibling: FiberNode | null = null
    index: number = 0;

    ref:any = null;
    refCleanup:any = null;

    pendingProps: any
    memoizedProps: any = null
    updateQueue: any = null
    memoizedState: any = null
    dependencies: any=null

    //Effects
    flags: number = 0
    subtreeFlags: number = 0
    deletions: FiberNode[] | null = null

    lanes: number = 0
    childLanes: number = 0

    alternate: FiberNode | null = null



    constructor(tag:WorkTag,pendingProps:any,key:any){
        this.tag=tag
        this.key=key
        this.pendingProps=pendingProps
    }
}
function createFiberImplClass(
    tag: WorkTag,
    pendingProps: any,
    key: null | string,
  ): FiberNode {
    // $FlowFixMe[invalid-constructor]: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, pendingProps, key);
  }
function createFiberFromText(content:string):FiberNode{
    const fiber=new FiberNode(HostText,content,null)
    fiber.elementType=String
    return fiber
}
function createFiberFromElement(element:ReactElement):FiberNode{
    let elementType=element.type
    let tag:WorkTag
    if(typeof elementType==='string'){
        tag=HostComponent
    }else if(typeof elementType==='function'){
        tag=FunctionComponent
    }else{
        switch(elementType.$$typeof){
            case REACT_CONTEXT_TYPE:
                tag=ContextProvider
                break
            case REACT_FRAGMENT_TYPE:
                tag=Fragment
                break
            default:
                break

        }
    }
    const fiber=new FiberNode(tag,element.props,element.key)
    fiber.elementType=elementType
    fiber.type=elementType
    return fiber
}

let workInProgressRoot:FiberNode|null=null
let currentRoot:FiberNode|null=null
let nextUnitOfWork:FiberNode|null=null
function performUnitOfWork(workInProgress: FiberNode): FiberNode | null {
    const current = workInProgress.alternate
    // 1. 执行当前任务
    let next=beginWork(current, workInProgress)

    return next
}
function workLoop(deadline:IdleDeadline) {
    let shouldYield = deadline.timeRemaining() < 1;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot();
    }else{
        requestIdleCallback(workLoop);
    }
}
function beginWork(current:FiberNode|null, workInProgress: FiberNode): FiberNode | null {

}
function commitRoot() {

}
function scheduleUpdate(){
    
}
function render(element:ReactElement, container:HTMLElement) {

    let current=createFiberFromElement(element)
    workInProgressRoot=new FiberNode(HostRoot,{children:current},null)
    workInProgressRoot.stateNode=container
    current.return=workInProgressRoot
    
    nextUnitOfWork=current
}