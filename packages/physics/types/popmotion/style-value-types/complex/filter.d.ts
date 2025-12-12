export declare const filter: {
    getAnimatableNone: (v: string) => string;
    test: (v: any) => boolean;
    parse: (v: string | number) => (number | import('..').Color)[];
    createTransformer: (v: string | number) => (v: Array<import('..').Color | number | string>) => string;
};
