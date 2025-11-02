import { ExtensionType } from '../../../../../../../../src/extensions';
import * as opentype from '@dxyl/utils/opentype';
export type FontExtension = {
    type: string;
    name: string;
    fontUrl: string;
};
export declare const Fonts: readonly [{
    readonly type: ExtensionType.Font;
    readonly name: "Arial";
    readonly ref: {
        readonly fontUrl: string;
    };
}];
export type FontObjects = typeof Fonts[number];
export type FontMap = {
    [K in FontObjects['name']]: opentype.Font;
};
