import { INode, NodeProps, NodeEvents } from "src/types/Node";
import { EventTarget } from 'src/core/EventTarget'
import { Transform } from "src/math/Transform";
import { merge } from "src/utils";
import { BoundingRect } from "src/math/BoundingRect";
import { NodeDrityFlag } from "src/constant";
import { IRenderer } from "src/types/Renderer";



export abstract class Node<Props extends NodeProps> extends EventTarget<NodeEvents> implements INode<Props> {
    type: string = 'Node'
    props: Props
    parent: INode<Props> | null = null
    children: INode<Props>[] = []
    transform = Transform.default()

    _bounds: BoundingRect | null = null
    _globalBounds: BoundingRect | null = null
    dirtyFlags: number = NodeDrityFlag.All
    constructor(props: Partial<Props> = {}) {
        super()
        this.setProps(props)
        this.transform.setProps(props)
        this.transform.onChange(() => {
            this.dirtyFlags = NodeDrityFlag.LocalBounds | NodeDrityFlag.GlobalBounds | NodeDrityFlag.Transform
        })
    }

    addDirtyFlags(flags: number): void {
        this.dirtyFlags |= flags
    }
    removeDirtyFlags(flags: Number): void {
        this.dirtyFlags &= ~flags
    }
    includeDirtyFlags(flags: number): boolean {
        return (this.dirtyFlags & flags) !== 0
    }
    hasDirtyFlags(flags: number): boolean {
        return (this.dirtyFlags & flags) === flags
    }
    setProps(props:Partial<Props>){
        merge({},this.props,props) 
    }
    getDefaultProps(): Props {
        return {} as Props
    }
    get position() {
        return this.transform.position
    }
    get scale() {
        return this.transform.scale
    }
    get skew() {
        return this.transform.skew
    }
    get origin() {
        return this.transform.origin
    }
    get rotation() {
        return this.transform.rotation
    }
    set rotation(value: number) {
        this.transform.rotation = value
    }
    get matrix() {
        return this.transform.matrix
    }
    get worldMatrix() {
        return this.transform.worldMatrix
    }
    get worldMatrixInvert() {
        return this.transform.worldMatrixInvert
    }
    get visible() {
        return this.props.visible
    }
    set visible(value: boolean) {
        this.props.visible = value
    }
    get opacity() {
        return this.props.opacity
    }
    set opacity(value: number) {
        this.props.opacity = value
    }
    get interactive() {
        return this.props.interactive
    }
    set interactive(value: boolean) {
        this.props.interactive = value
    }
    abstract calculateBounds(): BoundingRect
    getBounds(): BoundingRect {
        if (this.includeDirtyFlags(NodeDrityFlag.LocalBounds)) {
            this.removeDirtyFlags(NodeDrityFlag.LocalBounds)
            this.addDirtyFlags(NodeDrityFlag.GlobalBounds)
            this._bounds = this.calculateBounds()
        }
        return this._bounds
    }
    getGlobalBounds(): BoundingRect {
        if (this.includeDirtyFlags(NodeDrityFlag.LocalBounds|NodeDrityFlag.GlobalBounds)) {
            this.removeDirtyFlags(NodeDrityFlag.GlobalBounds)
            const localBounds = this.getBounds()
            if(!this._globalBounds){
                this._globalBounds=BoundingRect.default()
            }
            this._globalBounds.copy(localBounds).applyMatrix2D(this.worldMatrix)
        }
        return this._bounds
    }
    getChildAt(index: number): INode<Props> | null {
        return this.children[index]
    }
    addChild(child: INode<Props>): void {
        if (child.parent) {
            child.parent.removeChild(child)
        }
        child.parent = this
        child.transform.setParent(this.transform)
        this.children.push(child)
        this.emit('add:child')
    }
    removeChild(child: INode<Props>): void {
        if (child.parent === this) {
            let index = this.children.indexOf(child)
            if (index !== -1) {
                this.children.slice(index, 1)
                this.emit('remove:child')
            }
        }
    }
    insertChildAt(child: INode<Props>, index: number): void {
        if (child.parent) {
            child.parent.removeChild(child)
        }
        child.parent = this
        child.transform.setParent(this.transform)
        this.children.splice(index, 0, child)
    }
    hitTest(x: number, y: number): boolean {
        throw new Error("Method not implemented.");
    }
    shouldRender(): boolean {
        throw new Error("Method not implemented.");
    }
    traverse( callback:(node:INode<Props>)=>void ) {

		callback( this );

		const children = this.children;

		for ( let i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverse( callback );

		}

	}
    onBeforeUpdate(): void {
        throw new Error("Method not implemented.");
    }
    onUpdate(): void {
        throw new Error("Method not implemented.");
    }
    onAfterUpdate(): void {

        this.dirtyFlags = NodeDrityFlag.None
    }
    beforeRender(renderer: IRenderer): void {
        
    }
    render(renderer: IRenderer): void {

     
    }
    afterRender(renderer: IRenderer): void {
        
    }


}