export type GetArgs<T>=T extends Array<any>?T:T extends void?[]:[T]


export interface DefaultConstructor<T,P=any> {
    new (...args:GetArgs<P>): T;
}
export type GetConstructorClass<T>=T extends new(...args:any[])=>any?T:new (...args:any[])=>T