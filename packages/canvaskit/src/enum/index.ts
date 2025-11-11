 enum LineJoin {
    Miter = 'miter', //  miter 线连接
    Round = 'round',    //  round 线连接
    Bevel = 'bevel' //  bevel 线连接
}
 enum LineCap {
    Butt = 'butt',  //  butt 线帽
    Round = 'round', //  round 线帽
    Square = 'square', //  square 线帽
}
 enum FillRule {
    NonZero = 'nonzero', // 非零环绕规则
    EvenOdd = 'evenodd', // 奇偶环绕规则
}

 enum BorderStyle{
    Solid=0,// 实线
    Dashed=1,// 虚线模式
    Dotted=2// 点线模式
}
// 外边框，内边框，中间边框
 enum BorderSide{
    Outside=0,
    Inside=1,
    Middle=2
}


 enum PaintMode {
    Color=1, // 颜色
    Gradient=2, // 渐变模式
    Pattern=3  // 图案
}
 enum PaintStyle{
    None=0,
    Fill=1,// 填充模式
    Stroke=2// 描边模式
}
enum TextAlign{
    Start='start', // 文本对齐方式：左对齐
    End='end', // 文本对齐方式：右对齐
    Left='left', // 文本对齐方式：左对齐
    Right='right', // 文本对齐方式：右对齐
    Center='center', // 文本对齐方式：居中对齐
}
enum TextBaseline{
    Top='top', // 文本基线：顶部基线
    Hanging='hanging', // 文本基线：悬挂基线
    Middle='middle', // 文本基线：中间基线
    Alphabetic='alphabetic', // 文本基线：字母基线
    Ideographic='ideographic', // 文本基线：表意基线
    Bottom='bottom', // 文本基线：底部基线
}
enum TextRendering{
    Auto='auto', // 自动文本渲染
    OptimizeSpeed='optimizeSpeed', // 优化速度文本渲染
    OptimizeQuality='optimizeQuality', // 优化质量文本渲染
    GeometricPrecision='geometricPrecision', // 几何精度文本渲染
}

enum FontStretch{
    UltraCondensed='ultra-condensed', // 超压缩字体拉伸
    ExtraCondensed='extra-condensed', // 额外压缩字体拉伸
    Condensed='condensed', // 压缩字体拉伸
    SemiCondensed='semi-condensed', // 半压缩字体拉伸
    Normal='normal', // 正常字体拉伸
    SemiExpanded='semi-expanded', // 半扩展字体拉伸
    Expanded='expanded', // 扩展字体拉伸
    ExtraExpanded='extra-expanded', // 额外扩展字体拉伸
    UltraExpanded='ultra-expanded', // 超扩展字体拉伸
}
enum FontVariant{
    Normal='normal', // 正常字体变体
    SmallCaps='small-caps', // 小型大写字体变体
}
enum FontKerning{
    Auto='auto', // 自动字体间距
    Normal='normal', // 正常字体间距
}

export {
    FontKerning,
    FontStretch,
    FontVariant,
    TextRendering,
    TextAlign,
    TextBaseline,
    LineJoin,
    LineCap,
    FillRule,
    BorderStyle,
    BorderSide,
    PaintMode,
    PaintStyle,
}