const invert = function (obj: Record<string, any>) {
    var result: Record<string, any> = {};
    for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
            result[obj[name]] = name;
        }
    }
    return result;
}
// List of HTML entities for escaping.
const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};
const unescapeMap = invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
const createEscaper = function (map: Record<string, any>) {
    const escaper = function (match: string) {
        return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    const source = '(?:' + Object.keys(map).join('|') + ')';
    const testRegexp = RegExp(source);
    const replaceRegexp = RegExp(source, 'g');
    return function (string: string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};
const defaultUtil = {
    escape: createEscaper(escapeMap),
    unescape: createEscaper(unescapeMap)
}
export const parseTemplate = function (str: string, util?: any) {
    util = Object.assign({}, defaultUtil, util || {})
    let err = "";
    try {
        let func: any;
        const strFunc = `const __t_=[];
                with(obj){
                    __t_.push(\`${str
                .replace(/<%=([\s\S]+?)%>/g, "`,$1,`")
                .replace(/<%-([\s\S]+?)%>/g, "`,_.escape($1),`")
                .split("<%").join("`);")
                .split("%>").join("__t_.push(`")}
                    \`);
                }
                return __t_.join('');`
        func = new Function("obj", '_', strFunc);
        return function (this: any, data: any = {}) {
            return func.call(this, data, util)
        }
    } catch (e: any) { err = e.message; }
    return () => {
        return "< # ERROR: " + err + " # >";
    }
}




const templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};
const noMatch = /(.)^/;
const escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};
const escaper = /\\|'|\r|\n|\u2028|\u2029/g;
const escapeChar = function (match:keyof typeof escapes) {
    return '\\' + escapes[match];
};
const extend = function (targer:any,...sources:any[]) {
    let i, len, options, name;
    for (i = 1, len = sources.length; i < len; i++) {
        options = sources[i];
        if (typeof options == 'object') {
            for (name in options) {
                targer[name] = options[name];
            }
        }
    }
    return targer;
}
export function parseTemplate2(text:string, settings:{evaluate?:RegExp, interpolate?:RegExp, escape?:RegExp, variable?:string}) {
    settings = extend({}, templateSettings, settings);
    const matcher = RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');
    let index = 0;
    let source = "__p+='";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar as any);
        index = offset + match.length;

        if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }
        return match;
    });
    source += "';\n";
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';
    let render:any;
    try {
         render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      //  e.source = source;
        throw e;
    }

    const template = function (this:any,data:any = {}) {
        return render.call(this, data, defaultUtil);
    };

    // Provide the compiled source as a convenience for precompilation.
    const argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
}