export type GetArgs<T>=T extends Array<any>?T:T extends void?[]:[T]
