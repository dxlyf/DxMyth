import {precacheFiberNode, updateFiberProps} from './ReactDOMComponentTree';
import {
  createElement,
  createTextNode,
  setInitialProperties,
  diffProperties,
  updateProperties,
  diffHydratedProperties,
  diffHydratedText,
  trapClickOnNonInteractiveElement,
  warnForUnmatchedText,
  warnForDeletedHydratableElement,
  warnForDeletedHydratableText,
  warnForInsertedHydratedElement,
  warnForInsertedHydratedText,
} from './ReactDOMComponent';
import {
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
} from '../../scheduler';

import { getChildNamespace } from '../shared/DOMNamespaces';
import {getSelectionInformation, restoreSelection} from './ReactInputSelection';
import setTextContent from './setTextContent';
import {
  isEnabled as ReactBrowserEventEmitterIsEnabled,
  setEnabled as ReactBrowserEventEmitterSetEnabled,
} from '../events/ReactBrowserEventEmitter';
import {
  ELEMENT_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from '../shared/HTMLNodeType';
import dangerousStyleValue from '../shared/dangerousStyleValue';

export {
  unstable_now as now,
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_shouldYield as shouldYield,
  unstable_cancelCallback as cancelDeferredCallback,
} from '../../scheduler';
export type Type = string;
export type Props = {
  autoFocus?: boolean,
  children?: mixed,
  hidden?: boolean,
  suppressHydrationWarning?: boolean,
  dangerouslySetInnerHTML?: mixed,
  style?: {
    display?: string,
  },
};

let SUPPRESS_HYDRATION_WARNING;

const SUSPENSE_START_DATA = '$';
const SUSPENSE_END_DATA = '/$';

const STYLE = 'style';

let eventsEnabled:boolean = null;
let selectionInformation:mixed = null;

function shouldAutoFocusHostComponent(type: string, props: Props): boolean {
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;
  }
  return false;
}
export type Container = Element | Document;
export type Instance = Element;
export type TextInstance = Text;
export type SuspenseInstance = Comment;
export type HydratableInstance = Instance | TextInstance | SuspenseInstance;
export type PublicInstance = Element | Text;
type HostContextDev = {
  namespace: string,
  ancestorInfo: mixed,
};
type HostContextProd = string;
export type HostContext = HostContextDev | HostContextProd;
export type UpdatePayload = Array<mixed>;
export type ChildSet = void; // Unused
export type TimeoutHandle = number;
export type NoTimeout = -1;


export function getRootHostContext(
  rootContainerInstance: Container,
): HostContext {
  let type;
  let namespace;
  const nodeType = rootContainerInstance.nodeType;
  switch (nodeType) {
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE: {
      type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
      let root = (rootContainerInstance as  any).documentElement;
      namespace = root ? root.namespaceURI : getChildNamespace(null, '');
      break;
    }
    default: {
      const container: any =
        nodeType === COMMENT_NODE
          ? rootContainerInstance.parentNode
          : rootContainerInstance;
      const ownNamespace = container.namespaceURI || null;
      type = container.tagName;
      namespace = getChildNamespace(ownNamespace, type);
      break;
    }
  }
  return namespace;
}

export function getChildHostContext(
  parentHostContext: HostContext,
  type: string,
  rootContainerInstance: Container,
): HostContext {

  const parentNamespace = ((parentHostContext as any) as HostContextProd);
  return getChildNamespace(parentNamespace, type);
}

export function getPublicInstance(instance: Instance): any {
  return instance;
}

export function prepareForCommit(containerInfo: Container): void {
   eventsEnabled = ReactBrowserEventEmitterIsEnabled();
  selectionInformation = getSelectionInformation();
   ReactBrowserEventEmitterSetEnabled(false);
}

export function resetAfterCommit(containerInfo: Container): void {
   restoreSelection(selectionInformation);
   selectionInformation = null;
   ReactBrowserEventEmitterSetEnabled(eventsEnabled);
   eventsEnabled = null;
}

export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  
  let parentNamespace: string;

    parentNamespace = ((hostContext as any) as HostContextProd);
  
  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace,
  );
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}

export function appendInitialChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  parentInstance.appendChild(child);
}

export function finalizeInitialChildren(
  domElement: Instance,
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
): boolean {
   setInitialProperties(domElement, type, props, rootContainerInstance);
  return shouldAutoFocusHostComponent(type, props);

}

export function prepareUpdate(
  domElement: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
) {

  return diffProperties(
    domElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
  );
  
}

export function shouldSetTextContent(type: string, props: Props): boolean {
  return (
    type === 'textarea' ||
    type === 'option' ||
    type === 'noscript' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    (typeof props.dangerouslySetInnerHTML === 'object' &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  );
}

export function shouldDeprioritizeSubtree(type: string, props: Props): boolean {
  return !!props.hidden;
}

export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
) {
   const textNode: TextInstance = createTextNode(text, rootContainerInstance);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}

export const isPrimaryRenderer = true;
// This initialization code may run even on server environments
// if a component just imports ReactDOM (e.g. for findDOMNode).
// Some environments might not have setTimeout or clearTimeout.
export const scheduleTimeout =
  typeof setTimeout === 'function' ? setTimeout : (undefined as any);
export const cancelTimeout =
  typeof clearTimeout === 'function' ? clearTimeout : (undefined as any);
export const noTimeout = -1;
export const schedulePassiveEffects = scheduleDeferredCallback;
export const cancelPassiveEffects = cancelDeferredCallback;

// -------------------
//     Mutation
// -------------------

export const supportsMutation = true;

export function commitMount(
  domElement: Instance,
  type: string,
  newProps: Props,
  internalInstanceHandle: Object,
): void {
  // Despite the naming that might imply otherwise, this method only
  // fires if there is an `Update` effect scheduled during mounting.
  // This happens if `finalizeInitialChildren` returns `true` (which it
  // does to implement the `autoFocus` attribute on the client). But
  // there are also other cases when this might happen (such as patching
  // up text content during hydration mismatch). So we'll check this again.
//   if (shouldAutoFocusHostComponent(type, newProps)) {
//     ((domElement as any)).focus();
//   }
}

export function commitUpdate(
  domElement: Instance,
  updatePayload: Array<mixed>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object,
): void {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
   updateFiberProps(domElement, newProps);
//   // Apply the diff to the DOM node.
   updateProperties(domElement, updatePayload, type, oldProps, newProps);
}

export function resetTextContent(domElement: Instance): void {
  setTextContent(domElement, '');
}

export function commitTextUpdate(
  textInstance: TextInstance,
  oldText: string,
  newText: string,
): void {
  textInstance.nodeValue = newText;
}

export function appendChild(
  parentInstance: Instance,
  child: Instance | TextInstance,
): void {
  parentInstance.appendChild(child);
}

export function appendChildToContainer(
  container: any,
  child: Instance | TextInstance,
): void {
  let parentNode;
  if (container.nodeType === COMMENT_NODE) {
    parentNode = (container.parentNode as any);
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    parentNode.appendChild(child);
  }
  // This container might be used for a portal.
  // If something inside a portal is clicked, that click should bubble
  // through the React tree. However, on Mobile Safari the click would
  // never bubble through the *DOM* tree unless an ancestor with onclick
  // event exists. So we wouldn't see it and dispatch it.
  // This is why we ensure that non React root containers have inline onclick
  // defined.
  // https://github.com/facebook/react/issues/11918
  const reactRootContainer = container._reactRootContainer;
  if (
    (reactRootContainer === null || reactRootContainer === undefined) &&
    parentNode.onclick === null
  ) {
    // TODO: This cast may not be sound for SVG, MathML or custom elements.
  //  trapClickOnNonInteractiveElement(((parentNode: any): HTMLElement));
  }
}

export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance | SuspenseInstance,
): void {
  parentInstance.insertBefore(child, beforeChild);
}

export function insertInContainerBefore(
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance | SuspenseInstance,
): void {
  if (container.nodeType === COMMENT_NODE) {
    (container.parentNode as any).insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}

export function removeChild(
  parentInstance: Instance,
  child: Instance | TextInstance | SuspenseInstance,
): void {
  parentInstance.removeChild(child);
}

export function removeChildFromContainer(
  container: Container,
  child: Instance | TextInstance | SuspenseInstance,
): void {
  if (container.nodeType === COMMENT_NODE) {
    (container.parentNode as any).removeChild(child);
  } else {
    container.removeChild(child);
  }
}

export function clearSuspenseBoundary(
  parentInstance: Instance,
  suspenseInstance: SuspenseInstance,
): void {
  let node:any = suspenseInstance;
  // Delete all nodes within this suspense boundary.
  // There might be nested nodes so we need to keep track of how
  // deep we are and only break out when we're back on top.
  let depth = 0;
  do {
    let nextNode = node.nextSibling;
    parentInstance.removeChild(node);
    if (nextNode && nextNode.nodeType === COMMENT_NODE) {
      let data = ((nextNode as any).data as string);
      if (data === SUSPENSE_END_DATA) {
        if (depth === 0) {
          parentInstance.removeChild(nextNode);
          return;
        } else {
          depth--;
        }
      } else if (data === SUSPENSE_START_DATA) {
        depth++;
      }
    }
    node = nextNode;
  } while (node);
  // TODO: Warn, we didn't find the end comment boundary.
}

export function clearSuspenseBoundaryFromContainer(
  container: Container,
  suspenseInstance: SuspenseInstance,
): void {
  if (container.nodeType === COMMENT_NODE) {
    clearSuspenseBoundary((container.parentNode as any), suspenseInstance);
  } else if (container.nodeType === ELEMENT_NODE) {
    clearSuspenseBoundary((container as any), suspenseInstance);
  } else {
    // Document nodes should never contain suspense boundaries.
  }
}

export function hideInstance(instance: Instance): void {
  // TODO: Does this work for all element types? What about MathML? Should we
  // pass host context to this method?
  instance = instance as HTMLElement;
  (instance as HTMLElement).style.display = 'none';
}

export function hideTextInstance(textInstance: TextInstance): void {
  textInstance.nodeValue = '';
}

export function unhideInstance(instance: Instance, props: Props): void {
  instance = ((instance as any)as HTMLElement);
  const styleProp = props[STYLE];
  const display =
    styleProp !== undefined &&
    styleProp !== null &&
    styleProp.hasOwnProperty('display')
      ? styleProp.display
      : null;
  (instance as HTMLElement).style.display = dangerousStyleValue('display', display);
}

export function unhideTextInstance(
  textInstance: TextInstance,
  text: string,
): void {
  textInstance.nodeValue = text;
}

