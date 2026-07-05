import { Container,ContainerProps } from "./Container";


export class Group extends Container{
    type="Group"
    constructor(props?:ContainerProps){
        super(props)
    }
    shouldAddToRenderList(){
        return false
    }
}