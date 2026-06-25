import { CENTER, FILL, STROKE } from "../constants.mjs";
import { classRegistry } from "../ClassRegistry.mjs";
import { Point } from "../Point.mjs";
import { invertTransform, multiplyTransformMatrices, qrDecompose } from "../util/misc/matrix.mjs";
import { parseTransformAttribute } from "./parseTransformAttribute.mjs";
import { Group } from "../shapes/Group.mjs";
import { removeTransformMatrixForSvgParsing } from "../util/transform_matrix_removal.mjs";
import { Gradient } from "../gradient/Gradient.mjs";
import { FabricImage } from "../shapes/Image.mjs";
import { getTagName } from "./getTagName.mjs";
import { getGradientDefs } from "./getGradientDefs.mjs";
import { getCSSRules } from "./getCSSRules.mjs";
//#region src/parser/elements_parser.ts
const findTag = (el) => classRegistry.getSVGClass(getTagName(el).toLowerCase());
var ElementsParser = class {
	constructor(elements, options, reviver, doc, clipPaths) {
		this.elements = elements;
		this.options = options;
		this.reviver = reviver;
		this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
		this.doc = doc;
		this.clipPaths = clipPaths;
		this.gradientDefs = getGradientDefs(doc);
		this.cssRules = getCSSRules(doc);
	}
	parse() {
		return Promise.all(this.elements.map((element) => this.createObject(element)));
	}
	async createObject(el) {
		const klass = findTag(el);
		if (klass) {
			const obj = await klass.fromElement(el, this.options, this.cssRules);
			this.resolveGradient(obj, el, FILL);
			this.resolveGradient(obj, el, STROKE);
			if (obj instanceof FabricImage && obj._originalElement) removeTransformMatrixForSvgParsing(obj, obj.parsePreserveAspectRatioAttribute());
			else removeTransformMatrixForSvgParsing(obj);
			await this.resolveClipPath(obj, el);
			this.reviver && this.reviver(el, obj);
			return obj;
		}
		return null;
	}
	extractPropertyDefinition(obj, property, storage) {
		const value = obj[property];
		if (typeof value !== "string") return;
		const regex = this.regexUrl;
		if (!regex.test(value)) return;
		regex.lastIndex = 0;
		const id = regex.exec(value)[1];
		regex.lastIndex = 0;
		return storage[id] ? {
			def: storage[id],
			id
		} : void 0;
	}
	resolveGradient(obj, el, property) {
		const gradientDefinition = this.extractPropertyDefinition(obj, property, this.gradientDefs);
		if (gradientDefinition) {
			const opacityAttr = el.getAttribute(property + "-opacity");
			const gradient = Gradient.fromElement(gradientDefinition.def, obj, {
				...this.options,
				opacity: opacityAttr
			});
			obj.set(property, gradient);
		}
	}
	async resolveClipPath(obj, usingElement, exactOwner, processedClipPaths = /* @__PURE__ */ new Set()) {
		if (typeof obj.clipPath !== "string") return;
		const clipPathDefinition = this.extractPropertyDefinition(obj, "clipPath", this.clipPaths);
		if (clipPathDefinition && !processedClipPaths.has(clipPathDefinition.id)) {
			const clipPathElements = clipPathDefinition.def;
			const objTransformInv = invertTransform(obj.calcTransformMatrix());
			const clipPathTag = clipPathElements[0].parentElement;
			let clipPathOwner = usingElement;
			while (!exactOwner && clipPathOwner.parentElement && clipPathOwner.getAttribute("clip-path") !== obj.clipPath) clipPathOwner = clipPathOwner.parentElement;
			clipPathOwner.parentElement.appendChild(clipPathTag);
			const finalTransform = parseTransformAttribute(`${clipPathOwner.getAttribute("transform") || ""} ${clipPathTag.getAttribute("originalTransform") || ""}`);
			clipPathTag.setAttribute("transform", `matrix(${finalTransform.join(",")})`);
			const updatedProcessedClipPaths = new Set(processedClipPaths);
			updatedProcessedClipPaths.add(clipPathDefinition.id);
			const container = await Promise.all(clipPathElements.map(async (clipPathElement) => {
				const enlivedClippath = await findTag(clipPathElement).fromElement(clipPathElement, this.options, this.cssRules);
				removeTransformMatrixForSvgParsing(enlivedClippath);
				enlivedClippath.fillRule = enlivedClippath.clipRule;
				delete enlivedClippath.clipRule;
				await this.resolveClipPath(enlivedClippath, clipPathElement, void 0, updatedProcessedClipPaths);
				return enlivedClippath;
			}));
			const clipPath = container.length === 1 ? container[0] : new Group(container);
			const gTransform = multiplyTransformMatrices(objTransformInv, clipPath.calcTransformMatrix());
			let outerClipPathOwner = clipPathOwner.parentElement;
			while (outerClipPathOwner && outerClipPathOwner.getAttribute("clip-path") !== obj.clipPath) outerClipPathOwner = outerClipPathOwner.parentElement;
			if (outerClipPathOwner && !clipPath.clipPath) clipPath.clipPath = obj.clipPath;
			if (clipPath.clipPath) {
				var _outerClipPathOwner, _outerClipPathOwner2;
				await this.resolveClipPath(clipPath, (_outerClipPathOwner = outerClipPathOwner) !== null && _outerClipPathOwner !== void 0 ? _outerClipPathOwner : clipPathOwner, (_outerClipPathOwner2 = outerClipPathOwner) !== null && _outerClipPathOwner2 !== void 0 ? _outerClipPathOwner2 : clipPathTag.getAttribute("clip-path") ? clipPathOwner : void 0, outerClipPathOwner ? processedClipPaths : updatedProcessedClipPaths);
			}
			const { scaleX, scaleY, angle, skewX, translateX, translateY } = qrDecompose(gTransform);
			clipPath.set({
				flipX: false,
				flipY: false
			});
			clipPath.set({
				scaleX,
				scaleY,
				angle,
				skewX,
				skewY: 0
			});
			clipPath.setPositionByOrigin(new Point(translateX, translateY), CENTER, CENTER);
			obj.clipPath = clipPath;
		} else {
			delete obj.clipPath;
			return;
		}
	}
};
//#endregion
export { ElementsParser };

//# sourceMappingURL=elements_parser.mjs.map