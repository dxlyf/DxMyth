/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import {
  REACT_CONCURRENT_MODE_TYPE,
  REACT_FRAGMENT_TYPE,
  REACT_PROFILER_TYPE,
  REACT_STRICT_MODE_TYPE,
  REACT_SUSPENSE_TYPE,
} from '../shared/ReactSymbols';

import {Component, PureComponent} from './ReactBaseClasses';
import {createRef} from './ReactCreateRef';
import {forEach, map, count, toArray, only} from './ReactChildren';
import {
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
} from './ReactElement';
import {createContext} from './ReactContext';
import {lazy} from './ReactLazy';
import forwardRef from './forwardRef';
import memo from './memo';
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from './ReactHooks';

import ReactSharedInternals from './ReactSharedInternals';

const Children={
      map,
    forEach,
    count,
    toArray,
    only,
}
const ReactVersion='16.8.6'
const React = {
  Children,

  createRef,
  Component,
  PureComponent,

  createContext,
  forwardRef,
  lazy,
  memo,

  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,

  createElement:createElement,
  cloneElement:cloneElement,
  createFactory: createFactory,
  isValidElement: isValidElement,

  version: ReactVersion,

  unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
  unstable_Profiler: REACT_PROFILER_TYPE,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
};

export default React;
export {
  Children,
  createRef,
  Component,
  PureComponent,

  createContext,
  forwardRef,
  lazy,
  memo,

  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  REACT_FRAGMENT_TYPE as Fragment,
  REACT_STRICT_MODE_TYPE as StrictMode,
  REACT_SUSPENSE_TYPE as Suspense,
  createElement,
  cloneElement,
  createFactory,
  isValidElement,
  ReactVersion as version,
  REACT_CONCURRENT_MODE_TYPE as  unstable_ConcurrentMode,
  REACT_PROFILER_TYPE as unstable_Profiler,
  ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
}