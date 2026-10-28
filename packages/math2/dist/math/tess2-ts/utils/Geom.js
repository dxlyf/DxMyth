import { assert } from "./assert.js";
class Geom {
  static vertEq(u, v) {
    return u.s === v.s && u.t === v.t;
  }
  /* Returns TRUE if u is lexicographically <= v. */
  static vertLeq(u, v) {
    return u.s < v.s || u.s === v.s && u.t <= v.t;
  }
  /* Versions of VertLeq, EdgeSign, EdgeEval with s and t transposed. */
  static transLeq(u, v) {
    return u.t < v.t || u.t === v.t && u.s <= v.s;
  }
  static edgeGoesLeft(e) {
    return Geom.vertLeq(e.Dst, e.Org);
  }
  static edgeGoesRight(e) {
    return Geom.vertLeq(e.Org, e.Dst);
  }
  static vertL1dist(u, v) {
    return Math.abs(u.s - v.s) + Math.abs(u.t - v.t);
  }
  //TESSreal tesedgeEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static edgeEval(u, v, w) {
    assert(Geom.vertLeq(u, v) && Geom.vertLeq(v, w));
    var gapL = v.s - u.s;
    var gapR = w.s - v.s;
    if (gapL + gapR > 0) {
      if (gapL < gapR) {
        return v.t - u.t + (u.t - w.t) * (gapL / (gapL + gapR));
      } else {
        return v.t - w.t + (w.t - u.t) * (gapR / (gapL + gapR));
      }
    }
    return 0;
  }
  //TESSreal tesedgeSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static edgeSign(u, v, w) {
    assert(Geom.vertLeq(u, v) && Geom.vertLeq(v, w));
    var gapL = v.s - u.s;
    var gapR = w.s - v.s;
    if (gapL + gapR > 0) {
      return (v.t - w.t) * gapL + (v.t - u.t) * gapR;
    }
    return 0;
  }
  /***********************************************************************
   * Define versions of EdgeSign, EdgeEval with s and t transposed.
   */
  //TESSreal testransEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static transEval(u, v, w) {
    assert(Geom.transLeq(u, v) && Geom.transLeq(v, w));
    var gapL = v.t - u.t;
    var gapR = w.t - v.t;
    if (gapL + gapR > 0) {
      if (gapL < gapR) {
        return v.s - u.s + (u.s - w.s) * (gapL / (gapL + gapR));
      } else {
        return v.s - w.s + (w.s - u.s) * (gapR / (gapL + gapR));
      }
    }
    return 0;
  }
  //TESSreal testransSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static transSign(u, v, w) {
    assert(Geom.transLeq(u, v) && Geom.transLeq(v, w));
    var gapL = v.t - u.t;
    var gapR = w.t - v.t;
    if (gapL + gapR > 0) {
      return (v.s - w.s) * gapL + (v.s - u.s) * gapR;
    }
    return 0;
  }
  //int tesvertCCW( TESSvertex *u, TESSvertex *v, TESSvertex *w )
  static vertCCW(u, v, w) {
    return u.s * (v.t - w.t) + v.s * (w.t - u.t) + w.s * (u.t - v.t) >= 0;
  }
  /* Given parameters a,x,b,y returns the value (b*x+a*y)/(a+b),
   * or (x+y)/2 if a==b==0.  It requires that a,b >= 0, and enforces
   * this in the rare case that one argument is slightly negative.
   * The implementation is extremely stable numerically.
   * In particular it guarantees that the result r satisfies
   * MIN(x,y) <= r <= MAX(x,y), and the results are very accurate
   * even when a and b differ greatly in magnitude.
   */
  static interpolate(a, x, b, y) {
    return a = a < 0 ? 0 : a, b = b < 0 ? 0 : b, a <= b ? b === 0 ? (x + y) / 2 : x + (y - x) * (a / (a + b)) : y + (x - y) * (b / (a + b));
  }
  /*
  	#ifndef FOR_TRITE_TEST_PROGRAM
  	#define Interpolate(a,x,b,y)	RealInterpolate(a,x,b,y)
  	#else
  
  	// Claim: the ONLY property the sweep algorithm relies on is that
  	// MIN(x,y) <= r <= MAX(x,y).  This is a nasty way to test that.
  	#include <stdlib.h>
  	extern int RandomInterpolate;
  
  	double Interpolate( double a, double x, double b, double y)
  	{
  		printf("*********************%d\n",RandomInterpolate);
  		if( RandomInterpolate ) {
  			a = 1.2 * drand48() - 0.1;
  			a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
  			b = 1.0 - a;
  		}
  		return RealInterpolate(a,x,b,y);
  	}
  	#endif*/
  static intersect(o1, d1, o2, d2, v) {
    var z1, z2;
    var t;
    if (!Geom.vertLeq(o1, d1)) {
      t = o1;
      o1 = d1;
      d1 = t;
    }
    if (!Geom.vertLeq(o2, d2)) {
      t = o2;
      o2 = d2;
      d2 = t;
    }
    if (!Geom.vertLeq(o1, o2)) {
      t = o1;
      o1 = o2;
      o2 = t;
      t = d1;
      d1 = d2;
      d2 = t;
    }
    if (!Geom.vertLeq(o2, d1)) {
      v.s = (o2.s + d1.s) / 2;
    } else if (Geom.vertLeq(d1, d2)) {
      z1 = Geom.edgeEval(o1, o2, d1);
      z2 = Geom.edgeEval(o2, d1, d2);
      if (z1 + z2 < 0) {
        z1 = -z1;
        z2 = -z2;
      }
      v.s = Geom.interpolate(z1, o2.s, z2, d1.s);
    } else {
      z1 = Geom.edgeSign(o1, o2, d1);
      z2 = -Geom.edgeSign(o1, d2, d1);
      if (z1 + z2 < 0) {
        z1 = -z1;
        z2 = -z2;
      }
      v.s = Geom.interpolate(z1, o2.s, z2, d2.s);
    }
    if (!Geom.transLeq(o1, d1)) {
      t = o1;
      o1 = d1;
      d1 = t;
    }
    if (!Geom.transLeq(o2, d2)) {
      t = o2;
      o2 = d2;
      d2 = t;
    }
    if (!Geom.transLeq(o1, o2)) {
      t = o1;
      o1 = o2;
      o2 = t;
      t = d1;
      d1 = d2;
      d2 = t;
    }
    if (!Geom.transLeq(o2, d1)) {
      v.t = (o2.t + d1.t) / 2;
    } else if (Geom.transLeq(d1, d2)) {
      z1 = Geom.transEval(o1, o2, d1);
      z2 = Geom.transEval(o2, d1, d2);
      if (z1 + z2 < 0) {
        z1 = -z1;
        z2 = -z2;
      }
      v.t = Geom.interpolate(z1, o2.t, z2, d1.t);
    } else {
      z1 = Geom.transSign(o1, o2, d1);
      z2 = -Geom.transSign(o1, d2, d1);
      if (z1 + z2 < 0) {
        z1 = -z1;
        z2 = -z2;
      }
      v.t = Geom.interpolate(z1, o2.t, z2, d2.t);
    }
  }
}
export {
  Geom
};
