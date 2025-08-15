export default Class;
/**
 * Creates a new class with the given descriptor.
 * The constructor, defined by the name `initialize`,
 * is an optional function. If unspecified, an anonymous
 * function will be used which calls the parent class (if
 * one exists).
 *
 * You can also use `Extends` and `Mixins` to provide subclassing
 * and inheritance.
 *
 * @class Phaser.Class
 * @constructor
 * @param {Object} definition a dictionary of functions for the class
 * @example
 *
 *      var MyClass = new Phaser.Class({
 *
 *          initialize: function() {
 *              this.foo = 2.0;
 *          },
 *
 *          bar: function() {
 *              return this.foo + 5;
 *          }
 *      });
 */
declare function Class(definition: Object): any;
declare class Class {
    /**
     * Creates a new class with the given descriptor.
     * The constructor, defined by the name `initialize`,
     * is an optional function. If unspecified, an anonymous
     * function will be used which calls the parent class (if
     * one exists).
     *
     * You can also use `Extends` and `Mixins` to provide subclassing
     * and inheritance.
     *
     * @class Phaser.Class
     * @constructor
     * @param {Object} definition a dictionary of functions for the class
     * @example
     *
     *      var MyClass = new Phaser.Class({
     *
     *          initialize: function() {
     *              this.foo = 2.0;
     *          },
     *
     *          bar: function() {
     *              return this.foo + 5;
     *          }
     *      });
     */
    constructor(definition: Object);
}
declare namespace Class {
    export { extend };
    export { mixin };
    export let ignoreFinals: boolean;
}
/**
 * Extends the given `myClass` object's prototype with the properties of `definition`.
 *
 * @function extend
 * @ignore
 * @param {Object} ctor The constructor object to mix into.
 * @param {Object} definition A dictionary of functions for the class.
 * @param {boolean} isClassDescriptor Is the definition a class descriptor?
 * @param {Object} [extend] The parent constructor object.
 */
declare function extend(ctor: Object, definition: Object, isClassDescriptor: boolean, extend?: Object): void;
/**
 * Applies the given `mixins` to the prototype of `myClass`.
 *
 * @function mixin
 * @ignore
 * @param {Object} myClass The constructor object to mix into.
 * @param {Object|Array<Object>} mixins The mixins to apply to the constructor.
 */
declare function mixin(myClass: Object, mixins: Object | Array<Object>): void;
