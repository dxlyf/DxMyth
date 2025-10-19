
/**
 
计划
Fiber节点：表示工作单元，包含组件类型、props、stateNode（DOM节点）、child、sibling、return、alternate（用于双缓存）、hooks链表等。

Lane模型：用位运算表示优先级，用于调度。

调度器：根据优先级调度更新，使用requestIdleCallback或setTimeout模拟。

渲染阶段：分为协调（Reconcile）和提交（Commit）两个阶段。协调阶段可以中断，提交阶段不能中断。

Hook实现：每个Hook都有特定的数据结构，并按照调用顺序存储在Fiber的hooks链表中。

代码结构
createElement：创建虚拟DOM元素。

render：初始化渲染，创建根Fiber，开始调度。

scheduleUpdate：调度更新。

workLoop：工作循环，处理Fiber节点。

performUnitOfWork：处理当前Fiber单元，返回下一个Fiber单元。

reconcileChildren：协调子节点，生成新的Fiber树。

commitRoot：提交阶段，将Fiber树更新到DOM。

useState、useEffect等Hook的实现。

 */
const hasOwn = Object.hasOwn
type ReactElement = {
    $$typeof:any
    type: string | Function,
    key: string | number | null,
    props: any
}
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
    return {
        $$typeof:Symbol.for('react.element'),
        type,
        key,
        props: props
    } as ReactElement
}

function createTextElement(text: any) {
    return {
        type: 'TEXT_ELEMENT',
        props: { nodeValue: text, children: [] },
        key: null,
    } as any;
}
function isPrimitive(value: any) {
    const type = typeof value
    return type === 'string' || type === 'number' || type === 'boolean'
}

function isFunction(value: any) {
    return typeof value === 'function'
}

let workInProgressRoot: FiberNode | null = null; // 正在工作的根Fiber
let currentRoot: FiberNode | null = null; // 当前页面对应的根Fiber
let nextUnitOfWork: FiberNode | null = null; // 下一个工作单元
let pendingCommit: null | FiberNode = null; // 等待提交的Fiber


// Lane 优先级
const NoLane = 0b0000000000000000000000000000000;
const SyncLane = 0b0000000000000000000000000000001;

// Fiber 标签
const HostRoot = 3; // 根Fiber
const HostComponent = 5; // 原生DOM组件
const FunctionComponent = 6; // 函数组件
const ContextComponent = 7; // Context组件

// Effect 标签
const NoFlags = 0b00000000000000000000000000;
const Placement = 0b00000000000000000000000010;
const Update = 0b00000000000000000000000100;
const Deletion = 0b00000000000000000000001000;
const Layout = 0b00000000000000000000010000; // useLayoutEffect
const Passive = 0b00000000000000000000100000; // useEffect

// Hook 标签
const HookLayout = 0b01;
const HookPassive = 0b10;

class FiberNode {
    tag: any;
    key: any;
    type: any;
    stateNode: any;

    return: any
    child: any
    sibling: any

    pendingProps: any
    memoizedProps: any
    memoizedState: any
    alternate: any
    effectTag: any
    nextEffect: any
    firstEffect: any
    lastEffect: any
    lanes: any
    childLanes: any
    updateQueue: any
    hooks: any = null
    constructor(tag: any, pendingProps: any, key: any) {
        this.tag = tag; // 组件类型
        this.key = key;
        this.type = null; // 组件函数或DOM标签
        this.stateNode = null; // 对应的DOM节点或类组件实例

        this.return = null; // 父Fiber
        this.child = null; // 第一个子Fiber
        this.sibling = null; // 下一个兄弟Fiber

        this.pendingProps = pendingProps; // 新的Props
        this.memoizedProps = null; // 旧的Props
        this.memoizedState = null; // 旧的State（对于函数组件，是Hook链表）

        this.alternate = null; // 对应的current Fiber或workInProgress Fiber

        this.effectTag = NoFlags; // 副作用标签
        this.firstEffect = null; // 第一个有副作用的子Fiber
        this.lastEffect = null; // 最后一个有副作用的子Fiber
        this.nextEffect = null; // 下一个有副作用的Fiber

        this.lanes = NoLane; // 优先级
        this.childLanes = NoLane;

        this.updateQueue = null; // 更新队列
    }
}
function createFiberFromElement(element: ReactElement) {
    const elementType=element.type
    let fiberTag
    switch(typeof elementType){
        case 'function':
            fiberTag=FunctionComponent
            break
        case 'string':
            fiberTag=HostComponent
            break
    }
    if(!fiberTag&&element.$$typeof===Symbol.for('react.provider')){
        fiberTag=ContextComponent
    }
    let fiber=new FiberNode(fiberTag,element.props,element.key)
    fiber.type=element.type
    return fiber;
}
let isWorking = false;
let nextFlushedLane = NoLane;

function scheduleUpdate(lane: any) {
    // 将lane合并到根Fiber的lanes
    workInProgressRoot.lanes = mergeLanes(workInProgressRoot.lanes, lane);
    if (!isWorking) {
        isWorking = true;
        // 开始工作循环
        requestIdleCallback(workLoop);
    }
}

function workLoop(deadline:IdleDeadline) {
    while (nextUnitOfWork && deadline.timeRemaining() > 1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    if (!nextUnitOfWork && workInProgressRoot) {
        // 协调阶段结束，进入提交阶段
        pendingCommit = workInProgressRoot;
        commitRoot();
        workInProgressRoot = null;
        isWorking = false;
    } else {
        requestIdleCallback(workLoop);
    }
}

function performUnitOfWork(unitOfWork:FiberNode) {
    // 开始处理当前Fiber
    const current = unitOfWork.alternate;
    let next = beginWork(current, unitOfWork);

    if (next === null) {
        // 如果没有子节点，则完成当前节点
        next = completeUnitOfWork(unitOfWork);
    }

    return next;
}
function beginWork(current: FiberNode, workInProgress: FiberNode) {
    switch (workInProgress.tag) {
        case FunctionComponent: {
            const Component = workInProgress.type;
            const props = workInProgress.pendingProps;
            return updateFunctionComponent(current, workInProgress, Component, props);
        }
        case HostComponent: {
            const type = workInProgress.type;
            const props = workInProgress.pendingProps;
            return updateHostComponent(current, workInProgress, type, props);
        }
        default:
            return null;
    }
}

function updateFunctionComponent(current: FiberNode | null, workInProgress: FiberNode, Component: Function, props: any) {
    // 设置当前正在工作的Fiber
    currentlyRenderingFiber = workInProgress;
    workInProgress.hooks = [];
    hookIndex = 0;

    const children = Component(props);
    reconcileChildren(current, workInProgress, children);
    return workInProgress.child;
}

function updateHostComponent(current: FiberNode | null, workInProgress: FiberNode, type: string, props: any) {
    if (!workInProgress.stateNode) {
        workInProgress.stateNode = createDOMElement(workInProgress, type, props);
    }
    reconcileChildren(current, workInProgress, props.children);
    return workInProgress.child;
}

function createDOMElement(fiber: FiberNode, type: string, props: any) {
    const dom = type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(type);

    updateDOMProperties(dom, {}, props);
    return dom;
}

function updateDOMProperties(dom:HTMLElement, prevProps:any, nextProps:any) {
    // 处理属性更新，包括事件
    // 简化处理：移除旧属性，添加新属性
    for (let name in prevProps) {
        if (name !== 'children' && !nextProps.hasOwnProperty(name)) {
            if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[name]);
            } else {
                dom[name] = '';
            }
        }
    }
    for (let name in nextProps) {
        if (name !== 'children') {
            if (name.startsWith('on')) {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, nextProps[name]);
            } else {
                dom[name] = nextProps[name];
            }
        }
    }
}
function completeUnitOfWork(unitOfWork: any) {
    // 完成当前节点，并寻找下一个节点
    let completedWork = unitOfWork;
    do {
        const current = completedWork.alternate;
        const returnFiber = completedWork.return;

        // 完成当前节点的工作
        completeWork(current, completedWork);

        // 收集effect list
        if (returnFiber !== null) {
            if (returnFiber.firstEffect === null) {
                returnFiber.firstEffect = completedWork.firstEffect;
            }
            if (completedWork.lastEffect !== null) {
                if (returnFiber.lastEffect !== null) {
                    returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
                }
                returnFiber.lastEffect = completedWork.lastEffect;
            }

            const effectTag = completedWork.effectTag;
            if (effectTag > 0) {
                if (returnFiber.lastEffect !== null) {
                    returnFiber.lastEffect.nextEffect = completedWork;
                } else {
                    returnFiber.firstEffect = completedWork;
                }
                returnFiber.lastEffect = completedWork;
            }
        }

        // 寻找兄弟节点
        const siblingFiber = completedWork.sibling;
        if (siblingFiber !== null) {
            return siblingFiber;
        }

        // 没有兄弟节点，则返回父节点，继续完成父节点
        completedWork = returnFiber;
    } while (completedWork !== null);

    return null;
}
function reconcileChildren(current: null | FiberNode, workInProgress: FiberNode, nextChildren: FiberNode | FiberNode[]) {
    if (!nextChildren) return;

    let currentChild = current ? current.child : null;
    let previousNewFiber = null;

    // 简化：将children转为数组
    const newChildren = Array.isArray(nextChildren) ? nextChildren : [nextChildren];

    for (let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i];
        const newFiber = createChildFiber(workInProgress, child);

        if (currentChild) {
            // 简化：直接复用Fiber
            newFiber.alternate = currentChild;
            currentChild = currentChild.sibling;
        }

        if (i === 0) {
            workInProgress.child = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
    }
}

function createChildFiber(returnFiber: FiberNode, element: ReactElement | null) {

    if (!element) return null;

    const fiber = new FiberNode(
        typeof element.type === 'function' ? FunctionComponent : HostComponent,
        element.props,
        element.key
    );
    fiber.type = element.type;
    fiber.return = returnFiber;
    return fiber;
}
function completeWork(current: null | FiberNode, workInProgress: FiberNode) {
    // 主要是处理DOM属性等
    if (workInProgress.tag === HostComponent) {
        // 如果存在新的DOM节点，则更新属性
        if (workInProgress.stateNode && current) {
            updateDOMProperties(
                workInProgress.stateNode,
                current.memoizedProps,
                workInProgress.pendingProps
            );
        }
    }
}
function commitRoot() {
    const finishedWork = pendingCommit;
    pendingCommit = null;

    // 提交所有副作用
    commitWork(finishedWork.firstEffect);
    currentRoot = finishedWork;
}

function commitWork(effect) {
    while (effect) {
        commitEffect(effect);
        effect = effect.nextEffect;
    }
}

function commitEffect(effect) {
    const tag = effect.effectTag;
    if (tag & Placement) {
        // 插入节点
        const parent = effect.return.stateNode;
        const node = effect.stateNode;
        parent.appendChild(node);
    }
    if (tag & Update) {
        // 更新节点
        const current = effect.alternate;
        commitUpdate(effect, current.memoizedProps, effect.pendingProps);
    }
    if (tag & Deletion) {
        // 删除节点
        const parent = effect.return.stateNode;
        const node = effect.stateNode;
        parent.removeChild(node);
    }
    // 重置effectTag
    effect.effectTag = NoFlags;
}

function commitUpdate(fiber: FiberNode, prevProps: any, nextProps: any) {
    if (fiber.tag === HostComponent) {
        updateDOMProperties(fiber.stateNode, prevProps, nextProps);
    }
}

let currentlyRenderingFiber: FiberNode | null = null; // 当前正在渲染的Fiber
let hookIndex = 0; // 当前Hook的索引

type Hook = {
    memoizedState: any,
    baseState: any,
    queue: any,
    next: null | Hook
}
function mountHook() {
    const hook: Hook = {
        memoizedState: null, // 当前状态
        baseState: null, // 基础状态
        queue: null, // 更新队列
        next: null, // 下一个Hook
    };

    if (currentlyRenderingFiber.hooks === null) {
        currentlyRenderingFiber.hooks = hook;
    } else {
        let lastHook = currentlyRenderingFiber.hooks;
        while (lastHook.next !== null) {
            lastHook = lastHook.next;
        }
        lastHook.next = hook;
    }
    return hook;
}

function updateHook() {
    const current = currentlyRenderingFiber.alternate;
    if (current && current.hooks) {
        // 更新时，从current Fiber中获取对应的Hook
        let currentHook = current.hooks;
        for (let i = 0; i < hookIndex; i++) {
            currentHook = currentHook.next;
        }
        return currentHook;
    } else {
        return mountHook();
    }
}
function useState(initialState) {
    const hook = updateHook();
    if (hook.memoizedState === null) {
        hook.memoizedState = initialState;
    }

    const dispatch = (action) => {
        const update = {
            action,
            next: null,
        };
        if (hook.queue === null) {
            hook.queue = update;
        } else {
            let lastUpdate = hook.queue;
            while (lastUpdate.next !== null) {
                lastUpdate = lastUpdate.next;
            }
            lastUpdate.next = update;
        }
        // 调度更新
        scheduleUpdate(SyncLane);
    };

    return [hook.memoizedState, dispatch];
}
function useEffect(create, deps) {
    const hook = updateHook();
    const nextDeps = deps === undefined ? null : deps;
  
    if (hook.memoizedState !== null) {
      const [prevDestroy, prevDeps] = hook.memoizedState;
      if (nextDeps !== null) {
        if (areHookInputsEqual(nextDeps, prevDeps)) {
          hookIndex++;
          return;
        }
      }
    }
  
    hook.memoizedState = [create, nextDeps];
    currentlyRenderingFiber.effectTag |= Passive;
  }
  
  function areHookInputsEqual(nextDeps, prevDeps) {
    if (prevDeps === null) return false;
    for (let i = 0; i < nextDeps.length; i++) {
      if (nextDeps[i] !== prevDeps[i]) return false;
    }
    return true;
  }
  function useLayoutEffect(create, deps) {
    const hook = updateHook();
    const nextDeps = deps === undefined ? null : deps;
  
    if (hook.memoizedState !== null) {
      const [prevDestroy, prevDeps] = hook.memoizedState;
      if (nextDeps !== null) {
        if (areHookInputsEqual(nextDeps, prevDeps)) {
          hookIndex++;
          return;
        }
      }
    }
  
    hook.memoizedState = [create, nextDeps];
    currentlyRenderingFiber.effectTag |= Layout;
  }
  function useMemo(create, deps) {
    const hook = updateHook();
    const nextDeps = deps === undefined ? null : deps;
  
    if (hook.memoizedState !== null) {
      const [prevValue, prevDeps] = hook.memoizedState;
      if (nextDeps !== null) {
        if (areHookInputsEqual(nextDeps, prevDeps)) {
          hookIndex++;
          return prevValue;
        }
      }
    }
  
    const newValue = create();
    hook.memoizedState = [newValue, nextDeps];
    return newValue;
  }
  
  function useCallback(callback, deps) {
    return useMemo(() => callback, deps);
  }
  // 简化版Context
const contextStack = [];

function createContext(defaultValue:any) {
  const context:any = {
    _currentValue: defaultValue,
    Provider: null,
    Consumer: null,
  };
  context.Provider = {
    type: context,
    $$typeof: Symbol.for('react.provider'),
  };
  return context;
}

function useContext(context:any) {
  // 简化：从当前Fiber向上查找Provider
  let fiber = currentlyRenderingFiber;
  while (fiber !== null) {
    if (fiber.type === context.Provider) {
      return context._currentValue;
    }
    fiber = fiber.return;
  }
  return context._currentValue;
}
function mergeLanes(a:number, b:number) {
    return a | b;
  }
function render(element: ReactElement, container: HTMLElement) {
    workInProgressRoot = new FiberNode(HostRoot, null, null);
    workInProgressRoot.stateNode = container;
    workInProgressRoot.updateQueue = [];

    // 创建初始的workInProgress Fiber树
    const initialFiber = createFiberFromElement(element);
    workInProgressRoot.child = initialFiber;
    initialFiber.return = workInProgressRoot;

    currentRoot = workInProgressRoot;

    nextUnitOfWork = workInProgressRoot;
    scheduleUpdate(SyncLane);
}