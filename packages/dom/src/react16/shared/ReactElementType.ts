import { React$Element } from "./ReactTypes";

export type Source = {
  fileName: string,
  lineNumber: number,
};

export type ReactElement = {
  $$typeof: any,
  type: any,
  key: any,
  ref: any,
  props: any,
  _owner: any, // ReactInstance or ReactFiber

  // __DEV__
  _store: {
    validated: boolean,
  },
  _self: React$Element<any>,
  _shadowChildren: any,
  _source: Source,
};
