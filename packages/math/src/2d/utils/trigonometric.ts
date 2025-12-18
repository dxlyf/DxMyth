/***
 * 三角函数恒等式
 * 函数	反函数	倒数
中文	全写	简写	中文	全写	简写	中文	全写	简写
正弦	sine	sin	反正弦	arcsine	arcsin	余割	cosecant	csc
余弦	cosine	cos	反余弦	arccosine	arccos	正割	secant	sec
正切	tangent	tan	反正切	arctangent	arctan	余切	cotangent	cot
余切	cotangent	cot	反余切	arccotangent	arccot	正切	tangent	tan
正割	secant	sec	反正割	arcsecant	arcsec	余弦	cosine	cos
余割	cosecant	csc	反余割	arccosecant	arccsc	正弦	sine	sin

毕达哥拉斯三角恒等式如下：
cos^2 + sin^2 = 1
tan^2 + 1 = sec^2
cot^2 + 1 = csc^2

直角三角形:a(邻边),b(对边),c(斜边)
在坐标系中:x,y,r
倒角关系：
cos=x/r
sin=y/r
tan=y/x
cot=x/y
sec=1/cos
csc=1/sin

sin/cos=tan
sin=cos*tan
cos=sin/tan

角的和差恒等式:
sin(a+b)=sin(a)*cos(b)+cos(a)*sin(b)
cos(a+b)=cos(a)*cos(b)-sin(a)*sin(b)
tan(a+b)=tan(a)/sec(b)+tan(b)/sec(a)
cot(a+b)=sec(a)*sec(b)/(cos(a)*sin(b)-cos(b)*sin(a))

// 半倍角：
sin(x/2)=sqrt((1-cos)/2)
cos(x/2)=sqrt((1+cos)/2)
tan(x/2)=(1-cos)/sin=sin/(1+cos)=sqrt((1-cos)/(1+cos))
cot(x/2)=sqrt((1+cos)/(1-cos))
sec(x/2)=sqrt((2+sec)/(sec+1))
csc(x/2)=sqrt((2+sec)/(sec-1))


 */
const sin=(radian:number)=>{
    return Math.sin(radian);
}
const cos=(radian:number)=>{
    return Math.cos(radian);
}
const tan=(radian:number)=>{
    return Math.tan(radian);
}
const cot=(radian:number)=>{
    return 1/tan(radian);
}
const sec=(radian:number)=>{
    return 1/cos(radian);
}
const csc=(radian:number)=>{
    return 1/sin(radian);
}


const sinFromCos = (cos: number) => {
  return Math.sqrt(1 - cos ** 2);
}
const sinFromTan = (tan: number) => {
  return tan/Math.sqrt(1 + tan ** 2);
}
const sinFromCot = (cot: number) => {
  return 1/Math.sqrt(1 + cot ** 2);
}
const sinFromSec = (sec: number) => {
  return Math.sqrt(sec ** 2-1)/sec;
}
const sinFromCsc = (csc: number) => {
  return 1/csc
}

// 等式
const cosFromSin = (sin: number) => {
  return Math.sqrt(1 - sin ** 2);
}
const cosFromTan = (tan: number) => {
  return 1/Math.sqrt(1 + tan ** 2);
}
const cosFromCot = (cot: number) => {
  return cot/Math.sqrt(1 + cot ** 2);
}
const cosFromSec = (sec: number) => {
  return 1/sec
}
const cosFromCsc = (csc: number) => {
  return  Math.sqrt(csc ** 2-1)/csc;
}

const tanFromSin = (sin: number) => {
  return sin/Math.sqrt(1 - sin ** 2);
}
const tanFromCos = (cos: number) => {
  return Math.sqrt(1 - cos ** 2)/cos;
}
const tanFromCot = (cot: number) => {
  return 1/cot;
}
const tanFromSec = (sec: number) => {
  return Math.sqrt(sec**2-1);
}
const tanFromCsc = (csc: number) => {
  return 1/Math.sqrt(csc**2-1);
}

const cotFromSin = (sin: number) => {
  return Math.sqrt(1 - sin ** 2)/sin;
}
const cotFromCos = (cos: number) => {
  return cos/Math.sqrt(1 - cos ** 2);
}
const cotFromTan = (tan: number) => {
  return 1/tan;
}
const cotFromSec = (sec: number) => {
  return 1/Math.sqrt(sec**2-1);
}
const cotFromCsc = (csc: number) => {
  return Math.sqrt(csc**2-1);
}

const secFromSin = (sin: number) => {
  return 1/Math.sqrt(1 - sin ** 2);
}
const secFromCos = (cos: number) => {
  return 1/cos;
}
const secFromTan = (tan: number) => {
  return Math.sqrt(tan**2+1);
}
const secFromCot = (cot: number) => {
  return Math.sqrt(cot**2+1)/cot;
}
const secFromCsc = (csc: number) => {
  return csc/Math.sqrt(csc**2-1);
}

const cscFromSin = (sin: number) => {
  return 1/sin;
}
const cscFromCos = (cos: number) => {
  return 1/Math.sqrt(1 - cos ** 2);
}
const cscFromTan = (tan: number) => {
  return Math.sqrt(tan**2+1)/tan;
}
const cscFromCot = (cot: number) => {
  return Math.sqrt(cot**2+1);
}
const cscFromSec = (sec: number) => {
  return sec/Math.sqrt(sec**2-1);
}


export {
    sinFromCos,
    sinFromTan,
    sinFromCot,
    sinFromSec,
    sinFromCsc,

    cosFromSin,
    cosFromTan,
    cosFromCot,
    cosFromSec,
    cosFromCsc,

    tanFromSin,
    tanFromCos,
    tanFromCot,
    tanFromSec,
    tanFromCsc,

    cotFromSin,
    cotFromCos,
    cotFromTan,
    cotFromSec,
    cotFromCsc,

    secFromSin,
    secFromCos,
    secFromTan,
    secFromCot,
    secFromCsc,

    cscFromSin,
    cscFromCos,
    cscFromTan,
    cscFromCot,
    cscFromSec,
}