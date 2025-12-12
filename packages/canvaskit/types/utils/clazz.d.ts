export declare function mixinClass(base: {
    new (...args: any[]): any;
}, ...mixin: {
    new (...args: any[]): any;
}[]): new (...args: any[]) => any;
export declare const inherit: (child: any, parent: any, copyStatic?: boolean) => void;
export type ClazzType<T, P = any> = new (...args: P extends Array<any> ? P : [P]) => T;
export interface RegisterClassType {
    type?: string;
    subType?: string;
}
export declare const mixinRegisterClass: (Base?: any) => {
    new (...args: any[]): {
        [x: string]: any;
    };
    [x: string]: any;
    registerClass(clazz: any): void;
    getClass<T>(mainType: string, subType?: string): T | null;
    hasClass(mainType: string, subType?: string): boolean;
};
