import { _defineProperty } from "../_virtual/_@oxc-project_runtime@0.137.0/helpers/esm/defineProperty.mjs";
import { config } from "./config.mjs";
import { classRegistry } from "./ClassRegistry.mjs";
import { Point } from "./Point.mjs";
import { uid } from "./util/internals/uid.mjs";
import { degreesToRadians } from "./util/misc/radiansDegreesConversion.mjs";
import { pickBy } from "./util/misc/pick.mjs";
import { toFixed } from "./util/misc/toFixed.mjs";
import { escapeXml } from "./util/lang_string.mjs";
import { rotateVector } from "./util/misc/vectors.mjs";
import { Color } from "./color/Color.mjs";
import { reNum } from "./parser/constants.mjs";
//#region src/Shadow.ts
const reOffsetsAndBlur = new RegExp("(?:\\s|^)(-?\\d+(?:\\.\\d*)?(?:px)?(?:\\s?|$))?(-?\\d+(?:\\.\\d*)?(?:px)?(?:\\s?|$))?(" + reNum + "?(?:px)?)?(?:\\s?|$)(?:$|\\s)");
const shadowDefaultValues = {
	color: "rgb(0,0,0)",
	blur: 0,
	offsetX: 0,
	offsetY: 0,
	affectStroke: false,
	includeDefaultValues: true,
	nonScaling: false
};
var Shadow = class Shadow {
	constructor(arg0 = {}) {
		const options = typeof arg0 === "string" ? Shadow.parseShadow(arg0) : arg0;
		Object.assign(this, Shadow.ownDefaults, options);
		this.id = uid();
	}
	/**
	* @param {String} value Shadow value to parse
	* @return {Object} Shadow object with color, offsetX, offsetY and blur
	*/
	static parseShadow(value) {
		const shadowStr = value.trim(), [, offsetX = 0, offsetY = 0, blur = 0] = (reOffsetsAndBlur.exec(shadowStr) || []).map((value) => parseFloat(value) || 0);
		return {
			color: (shadowStr.replace(reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(),
			offsetX,
			offsetY,
			blur
		};
	}
	/**
	* Returns a string representation of an instance
	* @see http://www.w3.org/TR/css-text-decor-3/#text-shadow
	* @return {String} Returns CSS3 text-shadow declaration
	*/
	toString() {
		return [
			this.offsetX,
			this.offsetY,
			this.blur,
			this.color
		].join("px ");
	}
	/**
	* Returns SVG representation of a shadow
	* @param {FabricObject} object
	* @return {String} SVG representation of a shadow
	*/
	toSVG(object) {
		const offset = rotateVector(new Point(this.offsetX, this.offsetY), degreesToRadians(-object.angle)), BLUR_BOX = 20, NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS, color = new Color(this.color);
		let fBoxX = 40, fBoxY = 40;
		if (object.width && object.height) {
			fBoxX = toFixed((Math.abs(offset.x) + this.blur) / object.width, NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
			fBoxY = toFixed((Math.abs(offset.y) + this.blur) / object.height, NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
		}
		if (object.flipX) offset.x *= -1;
		if (object.flipY) offset.y *= -1;
		return `<filter id="SVGID_${escapeXml(this.id)}" y="-${fBoxY}%" height="${100 + 2 * fBoxY}%" x="-${fBoxX}%" width="${100 + 2 * fBoxX}%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="${toFixed(this.blur ? this.blur / 2 : 0, NUM_FRACTION_DIGITS)}"></feGaussianBlur>\n\t<feOffset dx="${toFixed(offset.x, NUM_FRACTION_DIGITS)}" dy="${toFixed(offset.y, NUM_FRACTION_DIGITS)}" result="oBlur" ></feOffset>\n\t<feFlood flood-color="${color.toRgb()}" flood-opacity="${color.getAlpha()}"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n`;
	}
	/**
	* Returns object representation of a shadow
	* @return {Object} Object representation of a shadow instance
	*/
	toObject() {
		const data = {
			color: this.color,
			blur: this.blur,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			affectStroke: this.affectStroke,
			nonScaling: this.nonScaling,
			type: this.constructor.type
		};
		const defaults = Shadow.ownDefaults;
		return this.includeDefaultValues ? data : pickBy(data, (value, key) => value !== defaults[key]);
	}
	static async fromObject(options) {
		return new this(options);
	}
};
_defineProperty(Shadow, "ownDefaults", shadowDefaultValues);
_defineProperty(Shadow, "type", "shadow");
classRegistry.setClass(Shadow, "shadow");
//#endregion
export { Shadow };

//# sourceMappingURL=Shadow.mjs.map