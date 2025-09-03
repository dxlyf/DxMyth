import {extensions,ExtensionType} from 'src/extensions'

import RendererPlugin  from './RendererPlugin'
import ResizePlugin  from './ResizePlugin'
import InteractivePlugin  from './InteractivePlugin'
import FontPlugin  from './FontPlugin'

extensions.add(RendererPlugin)
extensions.add(ResizePlugin)
extensions.add(InteractivePlugin)
extensions.add(FontPlugin)
export {
    RendererPlugin,
    ResizePlugin,
    InteractivePlugin,
    FontPlugin
}