const invert = function(obj) {
  var result = {};
  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      result[obj[name]] = name;
    }
  }
  return result;
};
const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};
const unescapeMap = invert(escapeMap);
const createEscaper = function(map) {
  const escaper2 = function(match) {
    return map[match];
  };
  const source = "(?:" + Object.keys(map).join("|") + ")";
  const testRegexp = RegExp(source);
  const replaceRegexp = RegExp(source, "g");
  return function(string) {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper2) : string;
  };
};
const defaultUtil = {
  escape: createEscaper(escapeMap),
  unescape: createEscaper(unescapeMap)
};
const parseTemplate = function(str, util) {
  util = Object.assign({}, defaultUtil, util || {});
  let err = "";
  try {
    let func;
    const strFunc = `const __t_=[];
                with(obj){
                    __t_.push(\`${str.replace(/<%=([\s\S]+?)%>/g, "`,$1,`").replace(/<%-([\s\S]+?)%>/g, "`,_.escape($1),`").split("<%").join("`);").split("%>").join("__t_.push(`")}
                    \`);
                }
                return __t_.join('');`;
    func = new Function("obj", "_", strFunc);
    return function(data = {}) {
      return func.call(this, data, util);
    };
  } catch (e) {
    err = e.message;
  }
  return () => {
    return "< # ERROR: " + err + " # >";
  };
};
const templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
};
const noMatch = /(.)^/;
const escapes = {
  "'": "'",
  "\\": "\\",
  "\r": "r",
  "\n": "n",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
const escaper = /\\|'|\r|\n|\u2028|\u2029/g;
const escapeChar = function(match) {
  return "\\" + escapes[match];
};
const extend = function(targer, ...sources) {
  let i, len, options, name;
  for (i = 1, len = sources.length; i < len; i++) {
    options = sources[i];
    if (typeof options == "object") {
      for (name in options) {
        targer[name] = options[name];
      }
    }
  }
  return targer;
};
function parseTemplate2(text, settings) {
  settings = extend({}, templateSettings, settings);
  const matcher = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join("|") + "|$", "g");
  let index = 0;
  let source = "__p+='";
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escaper, escapeChar);
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
  if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
  source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
  let render;
  try {
    render = new Function(settings.variable || "obj", "_", source);
  } catch (e) {
    throw e;
  }
  const template = function(data = {}) {
    return render.call(this, data, defaultUtil);
  };
  const argument = settings.variable || "obj";
  template.source = "function(" + argument + "){\n" + source + "}";
  return template;
}
export {
  parseTemplate,
  parseTemplate2
};
