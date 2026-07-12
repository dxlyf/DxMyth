


export type OptionProps<Context, Value, Parameters = Value> = {
    default?(ctx: Context): Value // 默认状态值
    update?(ctx: Context, current: Value, prev: Value): boolean // 更新状态
    map?(ctx: Context, value: Parameters): Value // 映射参数到状态值
    equals?(ctx: Context, current: Value, prev: Value): boolean // 状态值是否相等
}
export class Option<Context, Value, Parameters=Value> {
    ctx: Context
    private current: Value
    options: OptionProps<Context, Value, Parameters>
    dirty: boolean = false
    version: number = 0
    constructor(context: Context, options: OptionProps<Context, Value, Parameters>) {
        this.ctx = context
        this.options = options
        this.current = this.options.default ? this.options.default(this.ctx) : null
    }
    // 重置状态值为默认值
    default() {
        this.update(this.options.default ? this.options.default(this.ctx) : null,true)
    }
    markDrity(){
        this.dirty=true
    }
    refresh() {
        this.update(this.current,true)
    }
    get() {
        return this.current
    }
    map(value: Parameters): Value {
        if (this.options.map) {
            return this.options.map(this.ctx, value)
        }
        return value as unknown as Value
    }
    equals(current: Value, prev: Value): boolean {
        if (this.options.equals) {
            return this.options.equals(this.ctx, current, prev)
        }
        return current === prev
    }
    update(value: Value,forceUpdate:boolean=false) {
        const prevValue = this.current
        if (forceUpdate||this.dirty || !this.equals(prevValue, value)) {
            this.dirty = false
            this.version++
            this.current = value
            this.options.update?.(this.ctx, this.current, prevValue)
            return true
        }
        return false
    }
    set(param: Parameters) {
        const value = this.map(param)
        return this.update(value)
    }
    copy(source: Option<Context, Value, Parameters>) {
        this.ctx = source.ctx
        this.current = source.current
        this.dirty = source.dirty
        this.version = source.version
        this.options = { ...source.options }
        return this
    }
    clone() {
        return new Option(this.ctx, this.options).copy(this)
    }
}

