

import type {LazyComponent, Thenable} from '../shared/ReactLazyComponent';

import {Resolved, Rejected, Pending} from '../shared/ReactLazyComponent';

export function resolveDefaultProps(Component: any, baseProps: Object): Object {
  if (Component && Component.defaultProps) {
    // Resolve default props. Taken from ReactElement
    const props = Object.assign({}, baseProps);
    const defaultProps = Component.defaultProps;
    for (let propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
    return props;
  }
  return baseProps;
}

export function readLazyComponentType<T>(lazyComponent: LazyComponent<T>): T {
  const status = lazyComponent._status;
  const result = lazyComponent._result;
  switch (status) {
    case Resolved: {
      const Component: T = result;
      return Component;
    }
    case Rejected: {
      const error: mixed = result;
      throw error;
    }
    case Pending: {
      const thenable: Thenable<T, mixed> = result;
      throw thenable;
    }
    default: {
      lazyComponent._status = Pending;
      const ctor = lazyComponent._ctor;
      const thenable = ctor();
      thenable.then(
        moduleObject => {
          if (lazyComponent._status === Pending) {
            const defaultExport = moduleObject.default;
            lazyComponent._status = Resolved;
            lazyComponent._result = defaultExport;
          }
        },
        error => {
          if (lazyComponent._status === Pending) {
            lazyComponent._status = Rejected;
            lazyComponent._result = error;
          }
        },
      );
      // Handle synchronous thenables.
      switch (lazyComponent._status as any) {
        case Resolved:
          return lazyComponent._result;
        case Rejected:
          throw lazyComponent._result;
      }
      lazyComponent._result = thenable;
      throw thenable;
    }
  }
}
