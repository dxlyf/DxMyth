import {parseTemplate} from './template'
export class MagicString {
    static template = parseTemplate
    source: string
    constructor(source: string = '') {
        this.source = source
    }
    private format(format: string, ...args: any[]) {
        return format.replace(/\{(\d+)\}/g, (match,index) => args[index])
    }
    appendFormat(format: string, ...args: any[]) {
        this.append(this.format(format, ...args))
    }
    appendLineFormat(format: string, ...args: any[]) {
        this.appendLine(this.format(format, ...args))
    }
    prependFormat(format: string, ...args: any[]) {
        this.prepend(this.format(format, ...args))
    }
    append(source: string) {
        this.source += source
    }
    appendLine(source: string) {
       if(this.source.length){
         this.source +='\n'+ source
       }else{
         this.source = source
       }
    }
    lineBreak() {
        this.append('\n')
    }
    prepend(source: string) {
        this.source = source + this.source
    }
    prependLine(source: string) {
        if(this.source.length){
          this.source = '\n'+ source + this.source
        }else{
          this.source = source + this.source
        }
    }
    replace(start: number, end: number, source: string) {
        this.source = this.source.slice(0, start) + source + this.source.slice(end)
    }
    insert(index: number, source: string) {
        this.source = this.source.slice(0, index) + source + this.source.slice(index)
    }
    toString() {
        return this.source
    }
    template(data: any, util?: any) {
        return MagicString.template(this.source, util)(data);
    }
}