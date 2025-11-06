/**
 * The algoritm is learnt from
 * https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/
 * And we made some optimization for matrix inversion.
 * Other similar approaches:
 * "cv::getPerspectiveTransform", "Direct Linear Transformation".
 */
/**
 * Usage:
 * ```js
 * const transformer = buildTransformer(
 *     [10, 44, 100, 44, 100, 300, 10, 300],
 *     [50, 54, 130, 14, 140, 330, 14, 220]
 * );
 * const out = [];
 * transformer && transformer([11, 33], out);
 * ```
 *
 * Notice: `buildTransformer` may take more than 10ms in some Android device.
 *
 * @param src source four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @param dest destination four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @return transformer If fail, return null/undefined.
 */
export declare function buildTransformer(src: number[], dest: number[]): (out: number[], srcPointX: number, srcPointY: number) => void;
