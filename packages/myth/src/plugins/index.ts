import {extensions,ExtensionType} from 'src/extensions'

import RendererPlugin  from './RendererPlugin'
import ResizePlugin  from './ResizePlugin'
import InteractivePlugin  from './InteractivePlugin'

extensions.add(RendererPlugin)
extensions.add(ResizePlugin)
extensions.add(InteractivePlugin)
export {
    RendererPlugin,
    ResizePlugin,
    InteractivePlugin
}