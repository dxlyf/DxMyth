import { _defineProperty } from "../../_virtual/_@oxc-project_runtime@0.137.0/helpers/esm/defineProperty.mjs";
import { classRegistry } from "../ClassRegistry.mjs";
import { BaseFilter } from "./BaseFilter.mjs";
import { fragmentSource } from "./shaders/vibrance.mjs";
//#region src/filters/Vibrance.ts
const vibranceDefaultValues = { vibrance: 0 };
/**
* Vibrance filter class
* @example
* const filter = new Vibrance({
*   vibrance: 1
* });
* object.filters.push(filter);
* object.applyFilters();
*/
var Vibrance = class extends BaseFilter {
	getFragmentSource() {
		return fragmentSource;
	}
	/**
	* Apply the Vibrance operation to a Uint8ClampedArray representing the pixels of an image.
	*
	* @param {Object} options
	* @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
	*/
	applyTo2d({ imageData: { data } }) {
		const adjust = -this.vibrance;
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const max = Math.max(r, g, b);
			const avg = (r + g + b) / 3;
			const amt = Math.abs(max - avg) * 2 / 255 * adjust;
			data[i] += max === r ? 0 : (max - r) * amt;
			data[i + 1] += max === g ? 0 : (max - g) * amt;
			data[i + 2] += max === b ? 0 : (max - b) * amt;
		}
	}
	/**
	* Send data from this filter to its shader program's uniforms.
	*
	* @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
	* @param {TWebGLUniformLocationMap} uniformLocations A map of string uniform names to WebGLUniformLocation objects
	*/
	sendUniformData(gl, uniformLocations) {
		gl.uniform1f(uniformLocations.uVibrance, -this.vibrance);
	}
	isNeutralState() {
		return this.vibrance === 0;
	}
};
_defineProperty(Vibrance, "type", "Vibrance");
_defineProperty(Vibrance, "defaults", vibranceDefaultValues);
_defineProperty(Vibrance, "uniformLocations", ["uVibrance"]);
classRegistry.setClass(Vibrance);
//#endregion
export { Vibrance };

//# sourceMappingURL=Vibrance.mjs.map