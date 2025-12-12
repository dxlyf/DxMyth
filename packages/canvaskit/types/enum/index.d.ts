declare enum LineJoin {
    Miter = "miter",//  miter 线连接
    Round = "round",//  round 线连接
    Bevel = "bevel"
}
declare enum LineCap {
    Butt = "butt",//  butt 线帽
    Round = "round",//  round 线帽
    Square = "square"
}
declare enum FillRule {
    NonZero = "nonzero",// 非零环绕规则
    EvenOdd = "evenodd"
}
declare enum BorderStyle {
    Solid = 0,// 实线
    Dashed = 1,// 虚线模式
    Dotted = 2
}
declare enum BorderSide {
    Outside = 0,
    Inside = 1,
    Middle = 2
}
declare enum PaintMode {
    Color = 1,// 颜色
    Gradient = 2,// 渐变模式
    Pattern = 3
}
declare enum PaintStyle {
    None = 0,
    Fill = 1,// 填充模式
    Stroke = 2
}
declare enum TextAlign {
    Start = "start",// 文本对齐方式：左对齐
    End = "end",// 文本对齐方式：右对齐
    Left = "left",// 文本对齐方式：左对齐
    Right = "right",// 文本对齐方式：右对齐
    Center = "center"
}
declare enum TextBaseline {
    Top = "top",// 文本基线：顶部基线
    Hanging = "hanging",// 文本基线：悬挂基线
    Middle = "middle",// 文本基线：中间基线
    Alphabetic = "alphabetic",// 文本基线：字母基线
    Ideographic = "ideographic",// 文本基线：表意基线
    Bottom = "bottom"
}
declare enum TextDirection {
    LTR = "ltr",// 从左到右文本方向
    RTL = "rtl"
}
declare enum TextRendering {
    Auto = "auto",// 自动文本渲染
    OptimizeSpeed = "optimizeSpeed",// 优化速度文本渲染
    OptimizeQuality = "optimizeQuality",// 优化质量文本渲染
    GeometricPrecision = "geometricPrecision"
}
declare enum FontStyle {
    Normal = "normal",// 正常字体样式
    Italic = "italic",// 斜体字体样式
    Oblique = "oblique"
}
declare enum FontStretch {
    UltraCondensed = "ultra-condensed",// 超压缩字体拉伸
    ExtraCondensed = "extra-condensed",// 额外压缩字体拉伸
    Condensed = "condensed",// 压缩字体拉伸
    SemiCondensed = "semi-condensed",// 半压缩字体拉伸
    Normal = "normal",// 正常字体拉伸
    SemiExpanded = "semi-expanded",// 半扩展字体拉伸
    Expanded = "expanded",// 扩展字体拉伸
    ExtraExpanded = "extra-expanded",// 额外扩展字体拉伸
    UltraExpanded = "ultra-expanded"
}
declare enum FontWeightType {
    THIN = 100,
    EXTRA_LIGHT = 200,
    LIGHT = 300,
    NORMAL = 400,
    MEDIUM = 500,
    SEMI_BOLD = 600,
    BOLD = 700,
    EXTRA_BOLD = 800,
    BLACK = 900
}
declare enum FontVariant {
    Normal = "normal",// 正常字体变体
    SmallCaps = "small-caps"
}
declare enum FontKerning {
    Auto = "auto",// 自动字体间距
    Normal = "normal"
}
declare enum FontDirection {
    Inherit = "inherit",// 继承方向
    Ltr = "ltr",// 从左到右方向
    Rtl = "rtl"
}
declare enum FontWeight {
    Normal = "normal",// 正常字体粗细
    Bold = "bold"
}
declare enum GlobalCompositeOperation {
    SourceOver = "source-over",// 源图像在目标图像上方绘制
    DestinationOver = "destination-over",// 目标图像在源图像上方绘制
    SourceIn = "source-in",// 源图像在目标图像内绘制
    DestinationIn = "destination-in",// 目标图像在源图像内绘制
    SourceOut = "source-out",// 源图像在目标图像外绘制
    DestinationOut = "destination-out",// 目标图像在源图像外绘制
    SourceAtop = "source-atop",// 源图像在目标图像上方绘制，目标图像在源图像外绘制的部分透明
    DestinationAtop = "destination-atop",// 目标图像在源图像上方绘制，源图像在目标图像外绘制的部分透明
    Xor = "xor",// 源图像与目标图像的异或操作
    Multiply = "multiply",// 源图像与目标图像的乘法操作
    Screen = "screen",// 源图像与目标图像的加法操作
    Overlay = "overlay",// 源图像与目标图像的叠加操作
    Darken = "darken",// 源图像与目标图像的变暗操作
    Lighten = "lighten",// 源图像与目标图像的变亮操作
    ColorDodge = "color-dodge",// 源图像与目标图像的颜色混合操作
    ColorBurn = "color-burn",// 源图像与目标图像的颜色混合操作
    HardLight = "hard-light",// 源图像与目标图像的颜色混合操作
    SoftLight = "soft-light",// 源图像与目标图像的颜色混合操作
    Difference = "difference",// 源图像与目标图像的颜色混合操作
    Exclusion = "exclusion",// 源图像与目标图像的颜色混合操作
    Hue = "hue",// 源图像与目标图像的颜色混合操作
    Saturation = "saturation",// 源图像与目标图像的颜色混合操作
    Color = "color",// 源图像与目标图像的颜色混合操作
    Luminosity = "luminosity",// 源图像与目标图像的颜色混合操作
    Copy = "copy",// 复制源图像
    Lighter = "lighter"
}
declare enum BlendMode {
    Normal = "normal",// 正常混合模式
    Multiply = "multiply",// 乘法混合模式
    Screen = "screen",// 加法混合模式
    Overlay = "overlay",// 叠加混合模式
    Darken = "darken",// 变暗混合模式
    Lighten = "lighten",// 变亮混合模式
    ColorDodge = "color-dodge",// 颜色混合模式
    ColorBurn = "color-burn",// 颜色混合模式
    HardLight = "hard-light",// 颜色混合模式
    SoftLight = "soft-light",// 颜色混合模式
    Difference = "difference",// 颜色混合模式
    Exclusion = "exclusion",// 颜色混合模式
    Hue = "hue",// 颜色混合模式
    Saturation = "saturation",// 颜色混合模式
    Color = "color",// 颜色混合模式
    Luminosity = "luminosity"
}
declare enum ClipPathUnits {
    UserSpaceOnUse = "userSpaceOnUse",// 用户空间 clipPathUnits  绝对坐标
    ObjectBoundingBox = "objectBoundingBox"
}
export { FontWeight, FontWeightType, FontStyle, ClipPathUnits, GlobalCompositeOperation, BlendMode, FontDirection, FontKerning, FontStretch, FontVariant, TextRendering, TextAlign, TextBaseline, TextDirection, LineJoin, LineCap, FillRule, BorderStyle, BorderSide, PaintMode, PaintStyle, };
