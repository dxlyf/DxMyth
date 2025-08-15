
/**
 * expected argument lengths
 * @type {Object}
 */

const length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0} as const;

/**
 * segment pattern
 * @type {RegExp}
 */

const segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig

const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
/**
 * parse an svg path data string. Generates an Array
 * of commands where each command is an Array of the
 * form `[command, arg1, arg2, ...]`
 *
 * @param {String} path
 * @return {Array}
 */

function parse(path:string) {
	const data:any[] = []
    // @ts-expect-error
	path.replace(segment, function(_, command, commandValue){
		let type = command.toLowerCase()
		let args = parseValues(commandValue)

		// overloaded moveTo
		if (type == 'm' && args.length > 2) {
			data.push([command].concat(args.splice(0, 2)))
			type = 'l'
			command = command == 'm' ? 'l' : 'L'
		}

		while (true) {
			if (args.length == length[type as keyof typeof length]) {
				args.unshift(command)
				return data.push(args)
			}
			if (args.length < length[type as keyof typeof length]) throw new Error('malformed path data')
			data.push([command].concat(args.splice(0, length[type as keyof typeof length])))
		}
	})
	return data
}


function parseValues(args:string) {
	var numbers = args.match(number)
	return numbers ? numbers.map(Number) : []
}
export default parse;