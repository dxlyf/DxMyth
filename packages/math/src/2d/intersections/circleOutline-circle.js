import circlePoint from './circle-point'

export default function circleOutlineCircle(xc, yc, rc, xco, yco, rco, thickness)
{
    if (circlePoint(xc, yc, rc, xco, yco))
    {
        return true
    }

}