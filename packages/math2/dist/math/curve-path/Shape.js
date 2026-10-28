import { Path } from "./Path.js";
import { generateUUID } from "./Utils.js";
class Shape extends Path {
  /** 形状的 UUID */
  uuid;
  /** 孔洞列表（孔洞绕向需与外轮廓相反 CW/CCW） */
  holes = [];
  constructor(points) {
    super(points);
    this.uuid = generateUUID();
    this.type = "Shape";
  }
  /** 返回每个孔洞轮廓的点数组 */
  getPointsHoles(divisions) {
    const holesPts = [];
    for (let i = 0, l = this.holes.length; i < l; i++) {
      holesPts[i] = this.holes[i].getPoints(divisions);
    }
    return holesPts;
  }
  /** 返回形状及孔洞的轮廓点数据 */
  extractPoints(divisions) {
    return {
      shape: this.getPoints(divisions),
      holes: this.getPointsHoles(divisions)
    };
  }
  copy(source) {
    super.copy(source);
    this.holes = [];
    for (let i = 0, l = source.holes.length; i < l; i++) {
      this.holes.push(source.holes[i].clone());
    }
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.uuid = this.uuid;
    data.holes = [];
    for (let i = 0, l = this.holes.length; i < l; i++) {
      data.holes.push(this.holes[i].toJSON());
    }
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.uuid = json.uuid ?? this.uuid;
    this.holes = [];
    const list = json.holes ?? [];
    for (let i = 0, l = list.length; i < l; i++) {
      this.holes.push(new Path().fromJSON(list[i]));
    }
    return this;
  }
}
export {
  Shape
};
