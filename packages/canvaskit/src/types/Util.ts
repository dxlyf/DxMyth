export type GetArgs<T>=T extends Array<any>?T:T extends void?[]:[T]


export interface DefaultConstructor<T,P=any> {
    new (...args:GetArgs<P>): T;
}