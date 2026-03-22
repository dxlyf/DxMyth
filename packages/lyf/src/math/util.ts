
export const PI=Math.PI
export const TWO_PI=PI*2
export const PI_2=PI*0.5
export const PI_4=PI*0.25
export const PI_8=PI*0.125

export const RAD_TO_DEG=180/PI
export const DEG_TO_RAD=PI/180
export const radToDeg=(radian:number)=>{
    const deg=radian*RAD_TO_DEG
    return deg
}
export const degToRad=(deg:number)=>{
    const radian=deg*DEG_TO_RAD
    return radian
}
export const easingFuncs={
    // 线性缓动
    linear: (t: number) => t,
    // 二次缓动 - 入
    easeInQuad: (t: number) => t * t,
    // 二次缓动 - 出
    easeOutQuad: (t: number) => t * (2 - t),
    // 二次缓动 - 入出
    easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // 三次缓动 - 入
    easeInCubic: (t: number) => t * t * t,
    // 三次缓动 - 出
    easeOutCubic: (t: number) => (--t) * t * t + 1,
    // 三次缓动 - 入出
    easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // 四次缓动 - 入
    easeInQuart: (t: number) => t * t * t * t,
    // 四次缓动 - 出
    easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
    // 四次缓动 - 入出
    easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // 正弦缓动 - 入
    easeInSine: (t: number) => 1 - Math.cos(t * PI_2),
    // 正弦缓动 - 出
    easeOutSine: (t: number) => Math.sin(t * PI_2),
    // 正弦缓动 - 入出
    easeInOutSine: (t: number) => -(Math.cos(PI * t) - 1) / 2,
    // 指数缓动 - 入
    easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    // 指数缓动 - 出
    easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    // 指数缓动 - 入出
    easeInOutExpo: (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    // 圆形缓动 - 入
    easeInCirc: (t: number) => 1 - Math.sqrt(1 - t * t),
    // 圆形缓动 - 出
    easeOutCirc: (t: number) => Math.sqrt(1 - (--t) * t),
    // 圆形缓动 - 入出
    easeInOutCirc: (t: number) => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2,
    // 弹性缓动 - 出
    easeOutElastic: (t: number) => {
        const c4 = (2 * PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    // 回弹缓动 - 出
    easeOutBack: (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    // 弹跳缓动 - 出
    easeOutBounce: (t: number) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    },
}
export const smoothStep=(a:number,b:number,x:number)=>{
    const t=clamp((x-a)/(b-a),0,1)
    return t * t * (3 - 2 * t)
}
export const mix=(a:number,b:number,c:number)=>{
    return clamp((c-a)/(b-a),0,1)
}
export const interpolate=(a:number,b:number,t:number)=>{
    return a+(b-a)*t
}
export const clamp=(value:number,min:number,max:number)=>{
    return Math.max(Math.min(value,max),min)
}
export const randomRange=(min:number,max:number)=>{
    return min+Math.random()*(max-min)
}
export const randomRangeInt=(min:number,max:number)=>{
    return Math.floor(min+Math.random()*(max-min+1))
}

export const equalsEpsilon=(a:number,b:number,epsilon:number=0.000001)=>{
    return Math.abs(a-b)<=epsilon
}
export const equals=(a:number,b:number)=>{
    return a===b
}
