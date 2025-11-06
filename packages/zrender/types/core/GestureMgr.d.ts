import { ZRRawTouchEvent } from './types';
import { default as Displayable } from '../graphic/Displayable';
export declare class GestureMgr {
    private _track;
    constructor();
    recognize(event: ZRRawTouchEvent, target: Displayable, root: HTMLElement): {
        type: string;
        target: Displayable;
        event: ZRRawTouchEvent;
    };
    clear(): this;
    _doTrack(event: ZRRawTouchEvent, target: Displayable, root: HTMLElement): void;
    _recognize(event: ZRRawTouchEvent): {
        type: string;
        target: Displayable;
        event: ZRRawTouchEvent;
    };
}
