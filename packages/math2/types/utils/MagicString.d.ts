export declare class MagicString {
    static template: (str: string, util?: any) => (this: any, data?: any) => any;
    source: string;
    constructor(source?: string);
    private format;
    appendFormat(format: string, ...args: any[]): void;
    appendLineFormat(format: string, ...args: any[]): void;
    prependFormat(format: string, ...args: any[]): void;
    append(source: string): void;
    appendLine(source: string): void;
    lineBreak(): void;
    prepend(source: string): void;
    prependLine(source: string): void;
    replace(start: number, end: number, source: string): void;
    insert(index: number, source: string): void;
    toString(): string;
    template(data: any, util?: any): any;
}
