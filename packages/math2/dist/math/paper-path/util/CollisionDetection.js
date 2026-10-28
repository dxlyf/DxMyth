function findItemBoundsCollisions(items1, items2, tolerance) {
  function getBounds(items) {
    const bounds = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].bounds;
      bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
    }
    return bounds;
  }
  const bounds1 = getBounds(items1), bounds2 = !items2 || items2 === items1 ? bounds1 : getBounds(items2);
  return findBoundsCollisions(bounds1, bounds2, tolerance || 0);
}
function findCurveBoundsCollisions(curves1, curves2, tolerance) {
  function getBounds(curves) {
    const min = Math.min, max = Math.max, bounds = new Array(curves.length);
    for (let i = 0; i < curves.length; i++) {
      const v = curves[i];
      bounds[i] = [
        min(v[0], v[2], v[4], v[6]),
        min(v[1], v[3], v[5], v[7]),
        max(v[0], v[2], v[4], v[6]),
        max(v[1], v[3], v[5], v[7])
      ];
    }
    return bounds;
  }
  const bounds1 = getBounds(curves1), bounds2 = !curves2 || curves2 === curves1 ? bounds1 : getBounds(curves2);
  return findBoundsCollisions(bounds1, bounds2, tolerance || 0);
}
function findBoundsCollisions(boundsA, boundsB, tolerance = 0, sweepVertical) {
  const self = !boundsB || boundsA === boundsB, allBounds = self ? boundsA : boundsA.concat(boundsB), lengthA = boundsA.length, lengthAll = allBounds.length;
  function binarySearch(indices, coord, value) {
    let lo = 0, hi = indices.length;
    while (lo < hi) {
      const mid = hi + lo >>> 1;
      if (allBounds[indices[mid]][coord] < value) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo - 1;
  }
  const pri0 = sweepVertical ? 1 : 0, pri1 = pri0 + 2, sec0 = sweepVertical ? 0 : 1, sec1 = sec0 + 2;
  const allIndicesByPri0 = new Array(lengthAll);
  for (let i = 0; i < lengthAll; i++) {
    allIndicesByPri0[i] = i;
  }
  allIndicesByPri0.sort((i1, i2) => allBounds[i1][pri0] - allBounds[i2][pri0]);
  const activeIndicesByPri1 = [], allCollisions = new Array(lengthA);
  for (let i = 0; i < lengthAll; i++) {
    const curIndex = allIndicesByPri0[i], curBounds = allBounds[curIndex], origIndex = self ? curIndex : curIndex - lengthA, isCurrentA = curIndex < lengthA, isCurrentB = self || !isCurrentA, curCollisions = isCurrentA ? [] : null;
    if (activeIndicesByPri1.length) {
      const pruneCount = binarySearch(
        activeIndicesByPri1,
        pri1,
        curBounds[pri0] - tolerance
      ) + 1;
      activeIndicesByPri1.splice(0, pruneCount);
      const curSec1 = curBounds[sec1], curSec0 = curBounds[sec0];
      for (let j = 0; j < activeIndicesByPri1.length; j++) {
        const activeIndex = activeIndicesByPri1[j], activeBounds = allBounds[activeIndex], isActiveA = activeIndex < lengthA, isActiveB = self || activeIndex >= lengthA;
        if ((isCurrentA && isActiveB || isCurrentB && isActiveA) && (curSec1 >= activeBounds[sec0] - tolerance && curSec0 <= activeBounds[sec1] + tolerance)) {
          if (isCurrentA && isActiveB) {
            curCollisions.push(
              self ? activeIndex : activeIndex - lengthA
            );
          }
          if (isCurrentB && isActiveA) {
            allCollisions[activeIndex].push(origIndex);
          }
        }
      }
    }
    if (isCurrentA) {
      if (boundsA === boundsB) {
        curCollisions.push(curIndex);
      }
      allCollisions[curIndex] = curCollisions;
    }
    if (activeIndicesByPri1.length) {
      const curPri1 = curBounds[pri1], index = binarySearch(activeIndicesByPri1, pri1, curPri1);
      activeIndicesByPri1.splice(index + 1, 0, curIndex);
    } else {
      activeIndicesByPri1.push(curIndex);
    }
  }
  for (let i = 0; i < allCollisions.length; i++) {
    const collisions = allCollisions[i];
    if (collisions) {
      collisions.sort((i1, i2) => i1 - i2);
    }
  }
  return allCollisions;
}
export {
  findBoundsCollisions,
  findCurveBoundsCollisions,
  findItemBoundsCollisions
};
