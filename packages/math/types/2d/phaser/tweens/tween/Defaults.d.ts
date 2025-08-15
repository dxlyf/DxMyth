export default TWEEN_DEFAULTS;
export namespace Phaser {
    namespace Types {
        namespace Tweens {
            type TweenConfigDefaults = object;
        }
    }
}
declare namespace TWEEN_DEFAULTS {
    let targets: any;
    let delay: number;
    let duration: number;
    let ease: string;
    let easeParams: any;
    let hold: number;
    let repeat: number;
    let repeatDelay: number;
    let yoyo: boolean;
    let flipX: boolean;
    let flipY: boolean;
    let persist: boolean;
    let interpolation: any;
}
