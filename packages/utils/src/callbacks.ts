


/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
type CallbacksOptions = {
    once?: boolean; // 只执行一次
    memory?: boolean; // 保持记忆，最后一次的值会被记住
    unique?: boolean; // 确保回调只能被添加一次（列表中没有重复）
    stopOnFalse?: boolean; // 中断调用，当回调返回false时
};
type ListHandle<Args extends any[]=any> =(...args: Args) => any;
export class Callbacks<Args extends any[]=any,Context extends any=any> {
    // 标志要知道列表当前是否正在触发
    firing = false

    // 非遗忘列表的最后火值
    memory: any

    // 标志要知道清单是否已经被解雇
    fired = false

    // 标志以防止射击
    locked = false

    // 实际回调列表
    list: ListHandle<Args>[] = []

    // 可重复列表的执行数据队列
    queue: any[] = []

    // 当前发射回调的索引（根据需要通过add/删除修改）
    firingIndex = -1
    destroyedList=false
    options: Required<CallbacksOptions> = { once: false, memory: true, unique: true, stopOnFalse: false }
    constructor(options?: CallbacksOptions) {
        this.options = Object.assign(this.options, options ?? {})
    }
    // Fire callbacks
    private _fire() {
        const queue = this.queue
        //执行单射击
        this.locked = this.locked || this.options.once;

        // Execute callbacks for all pending executions,
        // respecting firingIndex overrides and runtime changes
        this.fired = this.firing = true;
        for (; queue.length; this.firingIndex = -1) {
            this.memory = queue.shift();
            while (++this.firingIndex < this.list.length) {

                // Run callback and check for early termination
                if (this.list[this.firingIndex].apply(this.memory[0], this.memory[1]) === false && this.options.stopOnFalse) {

                    // Jump to end and forget the data so .add doesn't re-fire
                    this.firingIndex = this.list.length;
                    this.memory = false;
                }
            }
        }

        // Forget the data if we're done with it
        if (!this.options.memory) {
            this.memory = false;
        }

        this.firing = false;

        // Clean up if we're done firing for good
        if (this.locked) {

            // Keep an empty list if we have data for future add calls
            if (this.memory) {
                this.list = [];

                // Otherwise, this object is spent
            } else {
                 this.list = [];
                 this.destroyedList=true
            }
        }
    }
    add(...args: (ListHandle<Args>|ListHandle<Args>[])[]) {

        if (!this.destroyedList) {

            // If we have memory from a past run, we should fire after adding
            if (this.memory && !this.firing) {
                this.firingIndex = this.list.length - 1;
                this.queue.push(this.memory);
            }

            args.forEach((arg) => {
                if (typeof arg === "function") {
                    if (!this.options.unique || !this.has(arg)) {
                        this.list.push(arg);
                    }
                } else if (arg && arg.length &&Array.isArray(arg)) {
                    // Inspect recursively
                    this.add(...arg);
                }
            });


            if (this.memory && !this.firing) {
                this._fire();
            }
        }
        return this;
    }
     // Remove a callback from the list
     remove(...args: ListHandle[]) {
        args.forEach((arg)=> {
            var index=0;
            while ((index = this.list.indexOf(arg,index)) > -1) {
                this.list.splice(index, 1);

                // Handle firing indexes
                if (index <= this.firingIndex) {
                    this.firingIndex--;
                }
            }
        });
        return this;
    }

    // Check if a given callback is in the list.
    // If no argument is given, return whether or not list has callbacks attached.
    has(fn:ListHandle) {
        return fn ?this.list.indexOf(fn)> -1 :this.list.length > 0;
    }

    // Remove all callbacks from the list
    empty() {
        if (this.list) {
            this.list = [];
        }
        return this;
    }

//禁用.fire和.add
    //流产任何当前/待处理的执行
    //清除所有回调和值
    disable() {
        this.locked =true
        this.queue = [];
        this.list=[] 
        this.destroyedList=true
        this.memory=null;
        return this;
    }
    disabled() {
        return this.destroyedList;
    }

    //禁用.fire
    //也禁用.ADD，除非我们有内存（因为它没有效果）
    //中止任何待处理的执行
    lock () {
        this.locked = true
        this.queue = [];
        if (!this.memory && !this.firing) {
            this.list =[]
            this.memory = null;
            this.destroyedList=true
        }
        return this;
    }
    // 用给定上下文和参数调用所有回调    
    fireWith(context:Context, args:Args) {
        if (!this.locked) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args] as any;
            this.queue.push(args);
            if (!this.firing) {
                this._fire();
            }
        }
        return this;
    }
    // 用给定参数调用所有回调   
    fire(...args:Args) {
        this.fireWith(this as any, args);
        return this;
    }

}
