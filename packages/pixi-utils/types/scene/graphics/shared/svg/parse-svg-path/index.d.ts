/**
 * expected argument lengths
 * @type {Object}
 */
/**
 * parse an svg path data string. Generates an Array
 * of commands where each command is an Array of the
 * form `[command, arg1, arg2, ...]`
 *
 * @param {String} path
 * @return {Array}
 */
declare function parse(path: string): any[];
export default parse;
