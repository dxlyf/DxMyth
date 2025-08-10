export default class TinyQueue {
    constructor(data?: any[], compare?: (a: any, b: any) => 0 | 1 | -1);
    data: any[];
    length: number;
    compare: (a: any, b: any) => 0 | 1 | -1;
    push(item: any): void;
    pop(): any;
    peek(): any;
    _up(pos: any): void;
    _down(pos: any): void;
}
