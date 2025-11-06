const OBSERVED_ERROR = {}

type TransactionWrapper={
    initialize:()=>void,
    close:(initData:any)=>void
}
/**
         * 以AOP模式执行，在前置函数与后置函数中间执行
         * 给目标函数添加一系列的前置和后置函数，对目标函数进行功能增强或者代码环境保护。
         * **/
export abstract class Transaction {
    transactionWrappers:TransactionWrapper[]
    wrapperInitData:any[]
    constructor() {
        this.reinitializeTransaction()
    }
    /**
    *@desc 事件包装，事务都创建前置initialize函数和后置close函数
     @abstract
    **/
    abstract getTransactionWrappers():TransactionWrapper[]
    _isInTransaction = false;
    isInTransaction() {
        return !!this._isInTransaction; // 事务正在执行中
    }
    reinitializeTransaction() {
        this.transactionWrappers = this.getTransactionWrappers();
        if (this.wrapperInitData) {
            this.wrapperInitData.length = 0;
        } else {
            this.wrapperInitData = [];
        }
        this._isInTransaction = false;
    }
    perform(method:Function, scope:any, a?:any, b?:any, c?:any, d?:any, e?:any, f?:any) {
        if(this.isInTransaction){
            return
        }
        let errorThrown;
        let ret;
        try {
            this._isInTransaction = true
            errorThrown = true;
            this.initializeAll(0);
            ret = method.call(scope, a, b, c, d, e, f);
            errorThrown = false;
        } finally {
            try {
                if (errorThrown) {
                    try {
                        this.closeAll(0);
                    } catch (err) { }
                } else {
                    this.closeAll(0);
                }
            } finally {
                this._isInTransaction = false;
            }
        }
        return ret;
    }
    initializeAll(startIndex:number) {
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
            var wrapper = transactionWrappers[i];
            try {
                this.wrapperInitData[i] = OBSERVED_ERROR;
                this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
            } finally {
                // 如果执行initialize的过程出错，就是初始化下一个
                if (this.wrapperInitData[i] === OBSERVED_ERROR) {
                    try {
                        this.initializeAll(i + 1);
                    } catch (err) { }
                }
            }
        }
    }
    closeAll(startIndex:number) {
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
            var wrapper = transactionWrappers[i];
            var initData = this.wrapperInitData[i];
            var errorThrown;
            try {

                errorThrown = true;
                if (initData !== OBSERVED_ERROR && wrapper.close) {
                    wrapper.close.call(this, initData);
                }
                errorThrown = false;
            } finally {
                if (errorThrown) {
                    try {
                        this.closeAll(i + 1);
                    } catch (e) { }
                }
            }
        }
        this.wrapperInitData.length = 0;
    }
}
