declare function _default(props: any): CrossFade;
export default _default;
declare class CrossFade {
    static defaultProps: {
        ease: any;
    };
    onStart(): void;
    fader: any;
    update(): any;
}
