/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterQuantize-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Quantize filter effect.
 * See {@link Phaser.Filters.Quantize}.
 *
 * @class FilterQuantize
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterQuantize = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterQuantize (manager)
    {
        BaseFilterShader.call(this, 'FilterQuantize', manager, null, ShaderSourceFS);
    },

    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uSteps', controller.steps);
        programManager.setUniform('uGamma', controller.gamma);
        programManager.setUniform('uOffset', controller.offset);
        programManager.setUniform('uMode', controller.mode);
        programManager.setUniform('uDither', controller.dither);
    }
});

module.exports = FilterQuantize;
