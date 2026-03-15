
import ReactSharedInternals from '../shared/ReactSharedInternals';
import {
  HostRoot,
  HostPortal,
  HostText,
  Fragment,
  ContextProvider,
  ContextConsumer,
} from '../shared/ReactWorkTags';
import describeComponentFrame from '../shared/describeComponentFrame';
import getComponentName from '../shared/getComponentName';
import { Fiber } from './ReactFiber';

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

type LifeCyclePhase = 'render' | 'getChildContext';

function describeFiber(fiber: Fiber): string {
  switch (fiber.tag) {
    case HostRoot:
    case HostPortal:
    case HostText:
    case Fragment:
    case ContextProvider:
    case ContextConsumer:
      return '';
    default:
      const owner = fiber._debugOwner;
      const source = fiber._debugSource;
      const name = getComponentName(fiber.type);
      let ownerName = null;
      if (owner) {
        ownerName = getComponentName(owner.type);
      }
      return describeComponentFrame(name, source, ownerName);
  }
}

export function getStackByFiberInDevAndProd(workInProgress: Fiber): string {
  let info = '';
  let node = workInProgress;
  do {
    info += describeFiber(node);
    node = node.return;
  } while (node);
  return info;
}

export let current: Fiber | null = null;
export let phase: LifeCyclePhase | null = null;
