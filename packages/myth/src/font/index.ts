import * as opentype from '@dxyl/utils/opentype'
import fontFile from 'src/assets/font/ARIAL.TTF?url'
import { ExtensionType } from 'src/extensions'

export type FontExtension = {
    type: string,
    name: string,
    fontUrl: string
}
// 字体资源文件映射配置
export const Fonts = [{
    type: ExtensionType.Font,
    name: 'Arial',
    ref: {
        fontUrl: fontFile
    }
}] as const;
export type FontObjects = typeof Fonts[number]
export type FontMap = {
    [K in FontObjects['name']]: opentype.Font
}

