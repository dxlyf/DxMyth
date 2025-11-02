import {vec2,vec3,mat2d,mat3,glMatrix} from 'gl-matrix'
import {Vector2} from './Vector2'
import {Matrix2D} from './Matrix2D'

export const toDegree=glMatrix.toDegree
export const toRadian=glMatrix.toRadian

export {
    vec2,
    vec3,
    mat2d,
    mat3,
    glMatrix as utils,
    Vector2,
    Matrix2D,
}