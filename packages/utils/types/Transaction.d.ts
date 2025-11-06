type TransactionWrapper = {
    initialize: () => void;
    close: (initData: any) => void;
};
/**
         * 以AOP模式执行，在前置函数与后置函数中间执行
         * 给目标函数添加一系列的前置和后置函数，对目标函数进行功能增强或者代码环境保护。
         * **/
export declare abstract class Transaction {
    transactionWrappers: TransactionWrapper[];
    wrapperInitData: any[];
    constructor();
    /**
    *@desc 事件包装，事务都创建前置initialize函数和后置close函数
     @abstract
    **/
    abstract getTransactionWrappers(): TransactionWrapper[];
    _isInTransaction: boolean;
    isInTransaction(): boolean;
    reinitializeTransaction(): void;
    perform(method: Function, scope: any, a?: any, b?: any, c?: any, d?: any, e?: any, f?: any): any;
    initializeAll(startIndex: number): void;
    closeAll(startIndex: number): void;
}
export {};
