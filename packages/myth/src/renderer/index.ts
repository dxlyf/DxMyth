import {CanvasRenderer} from './canvas/CanvasRenderer'
import {WebglRenderer} from './webgl/WebglRenderer'
import {extensions,ExtensionType} from 'src/extensions'


extensions.add({
    type:ExtensionType.Renderer,
    name:'canvas',
    ref:CanvasRenderer
},{
    type:ExtensionType.Renderer,
    name:'webgl',
    ref:WebglRenderer
})
export {
    CanvasRenderer,
    WebglRenderer
}