import { KeyframeConfig } from './Keyframe';
export interface AnimationTrackConfig {
    /** 属性名 */
    property: string;
    /** 关键帧列表 */
    keyframes: KeyframeConfig[];
    /** 目标对象 */
    target: Record<string, any>;
}
export declare class AnimationTrack {
    /** 属性名 */
    readonly property: string;
    /** 目标对象 */
    readonly target: Record<string, any>;
    /** 初始值（动画开始前快照） */
    private _startValue;
    /** 关键帧运行时数据 */
    private _keyframes;
    /** 是否已准备（已调用 prepare） */
    private _prepared;
    constructor(config: AnimationTrackConfig);
    /** 是否有关键帧 */
    get hasKeyframes(): boolean;
    /** 最后一个关键帧的时间（毫秒） */
    get endTime(): number;
    /**
     * 根据归一化进度计算并写入属性值
     * @param percent - 总动画进度 [0, 1]
     */
    tick(percent: number): void;
    /** 获取指定进度的值（不写入 target） */
    getValueAt(percent: number): unknown;
    /** 重置到初始值 */
    reset(): void;
}
