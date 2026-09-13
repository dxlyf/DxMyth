export declare const parseTemplate: (str: string, util?: any) => (this: any, data?: any) => any;
export declare function parseTemplate2(text: string, settings: {
    evaluate?: RegExp;
    interpolate?: RegExp;
    escape?: RegExp;
    variable?: string;
}): {
    (this: any, data?: any): any;
    source: string;
};
