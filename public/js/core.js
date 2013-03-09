/*!
 * JavaScript Class Library v0.5.2 (JSC v0.5.2)
 *
 * Copyright 2013 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(undefined){
    var
        // reference to global context (Window object or other)
        _globalContext = this,

        // counter used to generate unique identifier
        _guidCount = 0,

        // default name for anonymous classes
        _defaultClassName = "Class",

        // default error message when none given
        _defaultError = "Unexpected error !",

        // message of error throwed when abstract method is called
        _abstractCallError = "%s : This method is abstract and has to be overloaded !",

        // message of error throwed when needed class was not found
        _unknownClassError = "Class [%s] not found !",

        // message of error throwed when direct instantiation is attempted on singleton or multiton
        _directInstanceError = "This class cannot be directly instantiated !",

        // name of the field containing name of classes
        _classNameField = "className",

        // name of the field containing name of plugins
        _pluginNameField = "pluginName",

        // name of the GUID field
        _guidField = "guid",

        // flag used to tag abstract methods
        _flagAbstract = "_abstract",

        // flag used to tag attached methods
        _flagAttached = "_attached",

        // flag used to tag overloaded methods
        _flagOverload = "_overload",

        // flag used to tag plugin methods
        _flagPlugin = "_plugin",

        // list of installed plugins
        _plugins = {},

        // some void instances of native types
        _voidA = [],
        _voidO = {},
        _voidS = "",

        // get the native method to slice array
        _arraySlice = _voidA.slice,

        // get the native method to check properties added on the go
        _hasOwn = _voidO.hasOwnProperty,

        // get the native toString method
        _toString = _voidO.toString,

        // RegEx to extract name of type from native toString method
        _reType = /^\[object\s(.*)\]$/,

        // RegEx to check if a method call parent one
        _reInherited = /xyz/.test(function(){xyz();}) ? /\binherited\b/ : /.*/,

        // RegEx to trim source code in toString() context
        _reCode = /\s*([\(\)\[\]\{\};]+)\s*/g,

        // RegEx to check for HTML strings (borrowed from jQuery)
        _reHTML = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // RegEx to check for CSS selector strings
        _reCSS = /^([*]?[\s+>~]*[#.\w-\[:*]+[#.\w-\[\]=\(\)"'*~^$:]*)+$/,

        // RegEx to check for valid URL
        _reURL = /^(((https?|ftps?):\/\/)((\w+:?\w*@)?(\S+)(:[0-9]+)?)?)?([\w-.\/]+[.\/])+([\w#!:.,;?+=&%@!\-\/])+$/,

        // RegEx to math words boundaries in undescored names
        _reBoundUndescore = /([a-z0-9]+)_([a-z0-9])/gi,

        // RegEx to math words boundaries in camel case names
        _reBoundCamelCase = /([a-z0-9]+)([A-Z])/g,

        // RegEx to detect special chars in strings before use thems as part for RegEx
        _reNotText = /([^\w\s])/g,

        // RegEx to encode string (stringify) (borrowed from json2.js)
        _reString = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

        // RegEx to trim a string (borrowed from jQuery)
        _reTrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // RegEx to clean input strings before JSON parsing (borrowed from json2.js)
        _reJsonValid = /^[\],:{}\s]*$/,
        _reJsonEscape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        _reJsonBracket = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        _reJsonDiscard =/(?:^|:|,)(?:\s*\[)+/g,

        // shorthand to type prefix string
        _typePrefix = "object ",

        // shorthand to some types strings
        _typeArray = "[" + _typePrefix + "Array]",
        _typeObject = "[" + _typePrefix + "Object]",
        _typeFunction = "[" + _typePrefix + "Function]",
        _typeString = "[" + _typePrefix + "String]",
        _typeBoolean = "[" + _typePrefix + "Boolean]",

        // a simple function to only get given value
        _getIt = function(v) {
            return v;
        },

        // convert a Date to TZ notation
        _tzDate = function(date) {
            var month = date.getUTCMonth() + 1, day = date.getUTCDate(),
                hours = date.getUTCHours(), minutes = date.getUTCMinutes(), seconds = date.getUTCSeconds(),
                milli = date.getUTCMilliseconds();
            return date.getUTCFullYear() + "-" + (month < 10 ? "0" + month : month) +
                                        "-" + (day < 10 ? "0" + day : day) +
                                        "T" + (hours < 10 ? "0" + hours : hours) +
                                        ":" + (minutes < 10 ? "0" + minutes : minutes) +
                                        ":" + (seconds < 10 ? "0" + seconds : seconds) +
                                        "." + (milli < 10 ? "00" + milli : (milli < 100 ? "0" + milli : milli)) + "Z";
        },

        // a simple function to compose a map for types
        _getTypesMap = function(map){
            var type, types = {};
            for(type in map) {
                types[ "[" + _typePrefix + type + "]" ] = map[type];
            }
            return types;
        },

        // translations map to get real type from native toString method returns
        _types = (function(list){
            var i, types = {};
            for(i = 0; i < list.length; i++) {
                types[ "[" + _typePrefix + list[i] + "]" ] = list[i];
            }
            return types;
        })(["Array", "Boolean", "Date", "Function", "Object", "Number", "RegExp", "String"]),

        // translations map to stringify a string
        _stringMap = {
            "\"" : "\\\"",
            "\\" : "\\\\",
            "\t" : "\\t",
            "\b" : "\\b",
            "\f" : "\\f",
            "\n" : "\\n",
            "\r" : "\\r"
        },

        // stringify map for some particular types
        _toStringMap = _getTypesMap({
            // representation of a string (logic borrowed from json2.js)
            String : function(s) {
                return _reString.test(s) ? '"' + s.replace(_reString, function(ch) {
                    var c = _stringMap[ch];
                    return c ? c : "\\u" + ("0000" + ch.charCodeAt(0).toString(16)).substr(-4);
                }) + '"' : '"' + s + '"';
            },

            // representation of an object
            Object : function(o) {
                var k, s = "{";
                for(k in o) {
                    if( _hasOwn.call(o, k) ) {
                        s += (s.length > 1 ? "," : _voidS) + JSC.toString(k) + ":" + JSC.toString(o[k]);
                    }
                }
                return s + "}";
            },

            // representation of an array
            Array : function(a) {
                var i, s = "[";
                for(i = 0; i < a.length; i++) {
                    s += (s.length > 1 ? "," : _voidS) + JSC.toString(a[i]);
                }
                return s + "]";
            },

            // representation of a date
            Date : _tzDate,

            // representation of a function
            Function : function(f) {
                return f.toString().replace(_reCode, "$1");
            },

            // representation of a regular expression
            RegExp : function(r) {
                return "/" + r.source + "/" + (r.global ? "g" : _voidS) + (r.ignoreCase ? "i" : _voidS);
            }
        }),

        // getter map for JSON compatible types
        _jsonMap = _getTypesMap({
            // basic types, just copy
            Number : function(n) {
                return isFinite(n) ? n : null;
            },
            String : _getIt,
            Boolean : _getIt,
            Date : _tzDate,

            // objects, do a clone
            Object : function(o) {
                var k, v, json = {};
                for(k in o) {
                    if( _hasOwn.call(o, k) ) {
                        v = JSC.jsonData(o[k]);
                        if( undefined !== v ) {
                            json[k] = v;
                        }
                    }
                }
                return json;
            },

            // arrays, do a clone
            Array : function(a) {
                var i, v, json = [];
                for(i = 0; i < a.length; i++) {
                    v = JSC.jsonData(a[i]);
                    if( undefined !== v ) {
                        json.push(v);
                    }
                }
                return json;
            }
        }),

        // get a global value by a recursive path (array of names)
        _breakIntoGlobal = function(path) {
            var i, value = _globalContext;
            for(i = 0; value && i < path.length; i++) {
                value = value[path[i]];
            }
            return value;
        },

        /**
         * Core library entry. Creates a class with inheritance, polymorphism, overloading, etc.
         * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
         * All created classes implements the "attach" method, that can context attach each method of its instances.
         *
         * @see JSC.basis
         * @see JSC.extend
         * @see JSC.overload
         * @see JSC.implement
         * @see JSC.statics
         *
         * @param {String} className Name of the class to create
         * @param {Object} defs List of properties and methods for the new class
         * @return {Function} Created class
         */
        JSC = function(className, defs) {
            var Class, superClass;

            // no instantiation allowed for this function !
            if( this instanceof JSC ) {
                JSC.error(_directInstanceError, JSC);
            }

            // all parameters can be given in one single object
            if( className && !JSC.isString(className) ) {
                defs = className;
                className = defs[_classNameField];
            }

            // build the class initializer
            Class = function() {
                var caller = arguments.callee.caller;

                // called for inheritance ?
                if( caller === JSC ) {
                    return this;
                }

                // construction of the instance ?
                if( this instanceof Class ) {
                    // if the class implements singleton/multiton/factory pattern, instantiation is only allowed from the static method getInstance()
                    Class.getInstance && caller !== Class.getInstance && JSC.error(_directInstanceError, Class);

                    // set the instance identity
                    this[_guidField] = JSC.id();

                    // call delegate constructor if exists
                    this.initialize && this.initialize.apply(this, arguments);
                    return this;
                }

                // class used as classical function
                return Class.body ? Class.body.apply(Class, arguments) : undefined;
            };

            // definitions list ?
            if( defs ) {
                // is a superClass defined ?
                if( defs.superClass ) {
                    // load super class
                    superClass = JSC.loadClass(defs.superClass) || JSC.error(_unknownClassError.replace("%s", defs.superClass), "JSC");
                    delete defs.superClass;

                    // process for inheritance
                    Class.prototype = new superClass();
                    Class.prototype.constructor = Class;
                }

                // add methods and attributes
                JSC.extend(Class, defs, superClass);

                // keep superclass info into the class
                if( superClass ) {
                    Class.superClass = superClass[_classNameField] || JSC.type(superClass);
                    defs.superClass = superClass;
                }
            }

            // prepare interfaces entry and copy inherited ones from optional parent class
            Class.interfaces = superClass && superClass.interfaces ? JSC.merge({}, superClass.interfaces) : {};

            // add some default members and set the class identity
            return JSC.basis(Class, className);
        };

    // ensure existence of String.trim()
    if( !(_voidS.trim) ) {
        String.prototype.trim = function() {
            return this.replace(_reTrim, _voidS);
        };
    }

    /**
     * Library version.
     *
     * @constant
     * @type String
     */
    JSC.version = "0.5.2";

    /**
     * Class name.
     *
     * @constant
     * @type String
     */
    JSC[_classNameField] = "JSC";

    /**
     * Global unique identifier.
     *
     * @constant
     * @type Number
     */
    JSC[_guidField] = 0;

    /**
     * An empty method to do nothing.
     */
    JSC.noop = function() {};

    /**
     * Generate or read unique identifier.
     *
     * @param {Object} [object] Optional object to tag with unique identifier
     * @param {Number} [guid] Optional identifier to set if none were already there
     * @return {Number} The unique identifier
     */
    JSC.id = function(object, guid) {
        if( undefined !== object && null !== object ) {
            return object[_guidField] || (JSC === object ? 0 : (object[_guidField] = guid || ++ _guidCount));
        }
        return guid || ++ _guidCount;
    };

    /**
     * Get real type or class name of a given value.
     *
     * @param {Object} object Value from which get the type
     * @return {String} Type or class name of the value
     */
    JSC.type = function(object) {
        // zero-like value ?
        if( null == object ) {
            return String(object);
        }

        // instance or class created with this library ?
        if( object[_classNameField] ) {
            return object[_classNameField];
        }

        // detect type by object definition
        var string = _toString.call(object);
        return _types[string] || (_types[string] = (string.match(_reType) || [0, "Object"])[1]);
    };

    /**
     * Check if an object is a function.
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given object is a function
     */
    JSC.isFunction = function(o) {
        return o && _typeFunction === _toString.call(o) ? true : false;
    };

    /**
     * Check if an object is a class definition.
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given object is a class definition
     */
    JSC.isClass = function(o) {
        return o && o[_classNameField] && _typeFunction === _toString.call(o) ? true : false;
    };

    /**
     * Check if an object is a class instance.
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given object is a class instance
     */
    JSC.isInstance = function(o) {
        return o && o[_classNameField] && _typeFunction !== _toString.call(o) ? true : false;
    };

    /**
     * Check if a function is abstract.
     *
     * @param {Function} fn Function to test
     * @return {Boolean} Return true if the given function is abstract
     */
    JSC.isAbstract = function(fn) {
        return fn && fn[_flagAbstract] ? true : false;
    };

    /**
     * Check if a function is an attached version.
     *
     * @param {Function} fn Function to test
     * @return {Boolean} Return true if the given function is an attached version
     */
    JSC.isAttached = function(fn) {
        return fn && fn[_flagAttached] ? true : false;
    };

    /**
     * Check if a function use inheritance.
     *
     * @param {Function} fn Function to test
     * @return {Boolean} Return true if the given function use inheritance
     */
    JSC.isOverloaded = function(fn) {
        return fn && fn[_flagOverload] ? true : false;
    };

    /**
     * Check if an object or function has been added/altered by a plugin.
     *
     * @param {Object|Function} fn Function to test
     * @return {Boolean} Return true if the given orbject or function has been added/altered by a plugin
     */
    JSC.isPlugin = function(fn) {
        return fn && fn[_flagPlugin] ? true : false;
    };

    /**
     * Check if an object is an array.
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given object is an array
     */
    JSC.isArray = Array.isArray || function(o) {
        return o && _typeArray === _toString.call(o) ? true : false;
    };

    /**
     * Check if a value is an object.
     *
     * @param {Object} o Value to test
     * @return {Boolean} Return true if the given value is an object
     */
    JSC.isObject = function(o) {
        return o && _typeObject === _toString.call(o) ? true : false;
    };

    /**
     * Check if an object is empty.
     *
     * @param {Object} object Object to test
     * @return {Boolean} Return true if the given object is empty
     */
    JSC.isEmptyObject = function(object) {
        // only true objects can be checked as empty
        if( !JSC.isObject(object) ) {
            return false;
        }

        // if we find at least a property or method into the given object, it is not empty !
        for(var name in object) {
            return false;
        }

        // the given object can be considered empty
        return true;
    };

    /**
     * Check if an object is a string.
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given object is a string
     */
    JSC.isString = function(o) {
        return _voidS === o || (o && _typeString === _toString.call(o)) ? true : false;
    };

    /**
     * Check if an object is a boolean.
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given object is a boolean
     */
    JSC.isBool = function(o) {
        return false === o || (o && _typeBoolean === _toString.call(o)) ? true : false;
    };

    /**
     * Check if a value is numeric
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given value is numeric
     */
    JSC.isNumeric = function(o) {
        return !isNaN(parseFloat(o)) && isFinite(o);
    };

    /**
     * Check if a value is null
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given value is null
     */
    JSC.isNull = function(o) {
        return o === null;
    };

    /**
     * Check if a value is undefined
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given value is undefined
     */
    JSC.isUndef = function(o) {
        return o === undefined;
    };

    /**
     * Check if a value is null or undefined
     *
     * @param {Object} o Object to test
     * @return {Boolean} Return true if the given value is null or undefined
     */
    JSC.isVoid = function(o) {
        return o === undefined || o === null;
    };

    /**
     * Check if a string is a HTML code
     *
     * @param {String} text The string to check
     * @return {Boolean} Return true if the given text is HTML
     */
    JSC.isHTML = function(text) {
        if( JSC.isString(text) ) {
            // detect HTML in text, logic borrowed from jQuery
            var match;
            text = text.trim();
            if( "<" === text.charAt(0) && ">" === text.charAt(text.length - 1) && text.length >= 3 ) {
                // assume that strings that start and end with <> are HTML and skip the regex check
                match = [null, text, null];
            } else {
                // check presence of HTML in text
                match = _reHTML.exec(text);
            }
            return match && match[1] ? true : false;
        }
        return false;
    };

    /**
     * Check if a string is a CSS selector
     *
     * @param {String} text
     * @return {Boolean} Return true if the given text is a CSS selector
     */
    JSC.isSelector = function(text) {
        if( JSC.isString(text) ) {
            var match = _reCSS.exec(text.trim());
            return match && match[0] ? true : false;
        }
        return false;
    };

    /**
     * Check if a string is a valid URL
     *
     * @param {String} text
     * @return {Boolean} Return true if the given text is a valid URL
     */
    JSC.isURL = function(text) {
        if( JSC.isString(text) ) {
            var match = _reURL.exec(text.trim());
            return match && match[0] ? true : false;
        }
        return false;
    };

    /**
     * Convert an undescore formatted name to camel case format.
     * Ex: "to_lower_case" => "toLowerCase"
     *
     * @param {String} text The string to format
     * @param {Boolean} all When true, force all first letters to upper case
     * @return {String} Return the formatted string
     */
    JSC.camelize = function(text, all) {
        text = (_voidS + (undefined === text ? _voidS : text)).replace(_reBoundUndescore, function(substr, $1, $2){
            return $1 + $2.toUpperCase();
        });
        return all ? text.charAt(0).toUpperCase() + text.substr(1) : text;
    };

    /**
     * Convert a camel case formatted name to undescore format.
     * Ex: "toLowerCase" => "to_lower_case"
     *
     * @param {String} text The string to format
     * @param {Boolean} toLowerCase When true, force text to lower case
     * @return {String} Return the formatted string
     */
    JSC.underscore = function(text, toLowerCase) {
        text = (_voidS + (undefined === text ? _voidS : text)).replace(_reBoundCamelCase, "$1_$2");
        return toLowerCase ? text.toLowerCase() : text;
    };

    /**
     * Protect all special chars in a string to use it as part of a RegExp
     *
     * @param {String} text The string to format
     * @return {String} Return the formatted string
     */
    JSC.regex = function(text) {
        return (_voidS + (undefined === text ? _voidS : text)).replace(_reNotText, "\\$1");
    };

    /**
     * Throw an error.
     *
     * @param {String} msg Error message
     * @param {Object} [context] Optional error context
     * @throws Exception
     */
    JSC.error = function(msg, context) {
        throw new JSC.Error(msg, context);
    };

    /**
     * Export a variable to global context, or remove it.
     *
     * @param {String} name Name of exported variable in global context
     * @param {Object} value Value to export. If undefined, remove the value.
     * @return {Object} Return the exported or removed value
     */
    JSC.globalize = function(name, value) {
        // name is no given, assume it from "className" attribute (useful for classes)
        if( name && !JSC.isString(name) && undefined === value ) {
            value = name;
            name = name[_classNameField];
        }

        // extract path from name
        var path = [];
        name += _voidS;
        if( name.indexOf(".") ) {
            path = name.split(".");
            name = path.pop();
        }
        path = _breakIntoGlobal(path);

        // check if it is an export or a deletion
        if( path ) {
            if( undefined !== value ) {
                path[name] = value;
            } else {
                // delete from global context
                value = path[name];
                delete path[name];
            }
        } else {
            value = undefined;
        }
        return value;
    };

    /**
     * Get a variable from global context.
     *
     * @param {String} name Name of variable to get from global context
     * @return {Object} Value of the global variable, or undefined
     */
    JSC.global = function(name) {
        return _breakIntoGlobal((_voidS + name).split("."));
    };

    /**
     * Return a string representation of a given value.
     * If no parameter is given, return name and version of JSC object.
     *
     * @return {String} Return a string representation
     */
    JSC.toString = function() {
        if( arguments.length ) {
            var t, v = arguments[0];
            if( !v && _voidS !== v ) {
                // representation of a zero-like value
                return String(v);
            } else {
                // representation of typed value
                t = _toString.call(v);
                return _toStringMap[t] ? _toStringMap[t](v) : v.toString();
            }
        }

        // by default, when no value is given, return name and version of the library
        return JSC[_classNameField] + " " + JSC.version;
    };

    /**
     * Extract JSON compatible data from an object.
     * Compatible types are : String, Boolean, Number, Array, Object and the null value.
     *
     * @param {Object} o
     * @return {Object} Return a clone object containing only JSON compatible types
     */
    JSC.jsonData = function(o) {
        if( o ) {
            var t = _toString.call(o);
            return _jsonMap[t] ? _jsonMap[t](o) : undefined;
        }
        return o;
    };

    /**
     * Convert an object to a JSON string representation.
     *
     * @param {Object} o Object to convert
     * @return {String} Return the JSON string
     */
    JSC.jsonEncode = function(o) {
        o = JSC.jsonData(o);
        return undefined !== o ? JSC.toString(o) : _voidS;
    };

    /**
     * Parse and evaluate a string as a JSON representation.
     *
     * @param {String} s The string containing JSON data
     * @return {Object} Return JSON data evaluated or null if error
     */
    JSC.jsonDecode = function(s) {
        // need at least a string
        if( JSC.isString(s) ) {
            // avoid error, always return null if received data is not valid JSON
            try {
                // need no leading or trailing whitespaces
                s = s.trim();
                if( s ) {
                    // check browser support for native JSON parsing
                    if( _globalContext.JSON && _globalContext.JSON.parse ) {
                        return _globalContext.JSON.parse(s);
                    }

                    // no browser support, try to evaluate the code after cleaning (logic borrowed from json2.js and jQuery)
                    if( _reJsonValid.test(s.replace(_reJsonEscape, "@").replace(_reJsonBracket, "]").replace(_reJsonDiscard, _voidS)) ) {
                        return (new Function("return " + s + ";"))();
                    }
                }
            } catch( e ) {}
        }
        return null;
    };

    /**
     * Sort an array of objects by specified keys.
     *
     * @param {Array} array The array to sort
     * @param {Array} keys The list of sort keys
     * @param {Boolean} trim Flag to enable removing of null/undefined entries
     * @return {Array} Return the sorted array
     */
    JSC.sort = function(array, keys, trim) {
        var i, k, ka, kb, v, va, vb;

        // only performed on arrays
        if( JSC.isArray(array) ) {
            // need a list of sort keys
            keys = !keys ? [] : JSC.isArray(keys) ? keys : [keys];
            if( keys.length ) {
                // sort by the given sort keys
                array.sort(function(a, b){
                    // check items : need valid objects to compare
                    va = JSC.isVoid(a);
                    vb = JSC.isVoid(b);
                    if( !va && !vb ) {
                        // both are valid objects, compare values by sort keys
                        // assume all compared values are present in both objects
                        v = false;
                        for(i = 0; i < keys.length; i++) {
                            // load value to compare in both objects
                            k = keys[i];
                            ka = a[k];
                            kb = b[k];

                            // checks the valuesâ€‹â€‹, they must not be empty
                            va = JSC.isVoid(ka);
                            vb = JSC.isVoid(kb);
                            if( !va && !vb ) {
                                // both values are present, check difference
                                if( ka < kb ) {
                                    return -1;
                                }
                                if( ka > kb ) {
                                    return 1;
                                }

                                // both values seems equal, next compare
                                continue;
                            } else if( va && vb ) {
                                // both values are not present
                                v = true;
                            } else {
                                // valid objects are placed above other values
                                return va ? -1 : 1;
                            }
                        }

                        // all compared values seem to be equals, or are not present
                        return v ? (a < b ? -1 : a > b ? 1 : 0) : 0;
                    } else {
                        // valid objects are placed above other values
                        return va ? -1 : vb ? 1 : 0;
                    }
                });
            } else {
                // native sort...
                array.sort();
            }

            // remove null/undefined values if needed
            // after sorting, this kind of values are at begin or end of the array
            if( trim ) {
                i = 0;
                k = array.length - 1;
                if( i <= k ) {
                    va = vb = true;
                    while( i <= k ) {
                        if( va ) {
                            if( JSC.isVoid(array[i]) ) {
                                i ++;
                            } else {
                                va = false;
                            }
                        }
                        if( vb ) {
                            if( JSC.isVoid(array[k]) ) {
                                k --;
                            } else {
                                vb = false;
                            }
                        }
                        if( !va && !vb ) {
                            break;
                        }
                    }
                }
                i && array.splice(0, i);
                k < array.length - 1 && array.splice(k, array.length - k);
            }
        }
        return array;
    };

    /**
     * Shuffle an array.
     *
     * @param {Array} array The array to shuffle
     * @return {Array} Return the shuffled array
     */
    JSC.shuffle = function(array){
        // only performed on arrays
        if( JSC.isArray(array) ) {
            var i = array.length, j, k;
            while( i ) {
                j = parseInt(Math.random() * --i);
                k = array[i];
                array[i] = array[j];
                array[j] = k;
            }
        }
        return array;
    };

    /**
     * Merge one or more objects, with optional recursivity.
     * First object given will be the destination, all others will be merged to it,
     * each one overwriting existing properties.
     * When a boolean value is given as parameter, it will change recursive option
     * (true to enable recursivity, false to disable).
     *
     * @param {Object} o Destination object, to which merge all next parameters
     * @return {Object} Return merged object
     */
    JSC.merge = function(o) {
        // walk each argument
        var dest, i, n, d, s, recurse = false;
        for(i = 0; i < arguments.length; i++) {
            o = arguments[i];

            // argument is boolean, assume it is recursive option
            if( JSC.isBool(o) ) {
                recurse = o;
            } else if( !dest ) {
                // no destination already defined
                dest = o;
            } else {
                // merge of argument to destination
                for(n in o) {
                    d = dest[n];
                    s = o[n];
                    if( recurse && s ) {
                        // different behavior for objects and arrays
                        if( JSC.isObject(s) ) {
                            dest[n] = JSC.merge(recurse, JSC.isObject(d) ? d : {}, s);
                            continue;
                        } else if( JSC.isArray(s) ) {
                            dest[n] = JSC.merge(recurse, JSC.isArray(d) ? d : [], s);
                            continue;
                        }
                    }

                    // ignore undefined values
                    if( undefined !== s ) {
                        dest[n] = s;
                    }
                }
            }
        }
        return dest || {};
    };

    /**
     * Call a function on each property of an object or each item of an array.
     *
     * @param {Object|Array} o Object or Array to iterate
     * @param {Function|String} f Function or, when each processed item or property is an object, name of a method
     *                            into this object. Function receive three parameters : the index of the processed
     *                            item or property, the item or property itself, and the source object or array.
     *                            When a method's name is given, no parameter is sent, unless extra parameters are given.
     * @return {Object|Array} Return the given object or array
     */
    JSC.each = function(o, f) {
        var i, args, fn, it;
        if( o && f ) {
            if( JSC.isArray(o) ) {
                // process an array
                if( JSC.isFunction(f) ) {
                    // function given, apply it on each item of the array
                    for(i = 0; i < o.length; i++) {
                        it = o[i];
                        f.call(it, i, it, o);
                    }
                } else {
                    // name of method given, extract extra parameters
                    args = _arraySlice.call(arguments, 2);

                    // process each item of the array and call the inner method
                    for(i = 0; i < o.length; i++) {
                        it = o[i];
                        fn = it[f];
                        JSC.isFunction(fn) && fn.apply(it, args);
                    }
                }
            } else {
                // process an object
                if( JSC.isFunction(f) ) {
                    // function given, apply it on each property of the object
                    for(i in o) {
                        it = o[i];
                        f.call(it, i, it, o);
                    }
                } else {
                    // name of method given, extract extra parameters
                    args = _arraySlice.call(arguments, 2);

                    // process each property of the object and call the inner method
                    for(i in o) {
                        it = o[i];
                        fn = it[f];
                        JSC.isFunction(fn) && fn.apply(it, args);
                    }
                }
            }
        }
        return o;
    };

    /**
     * Get the properties added on the go for the given object (not herited).
     *
     * @param {Object} object Object from which extract the "on the go" properties
     * @return {Object} Return a new object that contains the "on the go" properties of given object
     */
    JSC.owned = function(object) {
        var name, result = {};
        if( object ) {
            for(name in object) {
                if( _hasOwn.call(object, name) ) {
                    result[name] = object[name];
                }
            }
        }
        return result;
    };

    /**
     * Attach a function to particular context (on which the "this" keyword refer to).
     * Tag the wrap function with "attached" attribute, set with boolean value "true".
     *
     * @param {Function|Object} fn Function to attach to the context, or context to attach
     * @param {Object|String} context Context to attach to the function, or name of a method into given context
     * @returns {Function} Return attached version of the given function
     */
    JSC.attach = function(fn, context) {
        var wrap, args;

        // attach a method to its parent object ?
        if( fn && JSC.isString(context) ) {
            wrap = fn[context];
            context = fn;
            fn = wrap;
        }

        // need at least a function to attach
        fn = JSC.isFunction(fn) ? fn : JSC.noop;

        // produce a context attached function
        args = _arraySlice.call(arguments, 2);
        wrap = function() {
            return fn.apply(context, args.concat(_arraySlice.call(arguments)));
        };
        wrap[_flagAttached] = true;

        // affect unique ID
        JSC.id(wrap, fn ? JSC.id(fn) : undefined);

        // and there is a context attached function...
        return wrap;
    };

    /**
     * Produce an abstract method. When called, it will throw an exception.
     * Tag the built function with "abstractMethod" attribute, set with boolean value "true".
     *
     * @param {String} [name] Optional name for the new abstract method
     * @return {Function} New abstract method
     */
    JSC.abstractMethod = function(name) {
        var fn = function() {
            var context = (this[_classNameField] || "[unknownClass]") + "." + (name || "[unknownMethod]");
            JSC.error(_abstractCallError.replace("%s", context), context);
        };
        fn[_flagAbstract] = true;
        return fn;
    };

    /**
     * Wraps an overriding method that call overloaded version.
     * If a wrap function is built to handle inheritance, this function will be tagged with "inheritance" attribute,
     * set with boolean value "true".
     *
     * @param {Function} method Reference of the overriding method
     * @param {Object} oldMethod Reference of the overloaded method
     * @returns {Function} Return the wrap method containing overload process
     */
    JSC.overload = function(method, oldMethod) {
        // only if both parameters are functions, not equals and overriding method invoke inheritance
        if( method !== oldMethod && JSC.isFunction(method) && _reInherited.test(method) ) {
            oldMethod = JSC.isFunction(oldMethod) ? oldMethod : JSC.noop;
            var wrap = function() {
                var ret, tmp = this.inherited;
                this.inherited = oldMethod;
                ret = method.apply(this, arguments);
                this.inherited = tmp;
                return ret;
            };
            wrap[_flagOverload] = true;
            JSC.id(wrap, JSC.id(method));
            return wrap;
        }
        return method;
    };

    /**
     * Add methods and attributes to an existent class definition.
     * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
     *
     * @see JSC.overload
     *
     * @param {Function} Class The class to extend
     * @param {Object} defs List of properties and methods to add to the class
     * @param {Function} superClass Super class for the class to extend
     * @return {Function} Return the class
     */
    JSC.extend = function(Class, defs, superClass) {
        // add methods and attributes
        if( Class && Class.prototype ) {
            for(var name in defs) {
                if( _hasOwn.call(defs, name) ) {
                    Class.prototype[name] = superClass ? JSC.overload(defs[name], superClass.prototype[name]) : defs[name];
                }
            }
        }
        return Class;
    };

    /**
     * Implements an interface into a class definition (add abstract methods signatures).
     * This can be done with a list of method names (Array) or a list of method definitions (Object}.
     * Existings methods or attributes will not be overwrited. When an array of method names is used,
     * each added method will be abstract. When an object containing methods and attributes is used,
     * each member that is undefined will be translated to abstract method.
     *
     * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
     * All abstract methods will be tagged with "abstractMethod" attribute, set with boolean value "true".
     *
     * @see JSC.overload
     * @see JSC.abstractMethod
     *
     * @param {Function} Class The class to extend with interface
     * @param {Object|Array} defs List of properties and methods of interface to add to the class
     * @param {String} [interfaceName] Optional name of the interface to implement (can be also set into defs)
     * @return {Function} Return the class
     */
    JSC.implement = function(Class, defs, interfaceName) {
        var i, method;

        if( Class && Class.prototype ) {
            // inverted order for name and defs...
            if( JSC.isString(defs)) {
                i = interfaceName;
                interfaceName = defs;
                defs = i;
            }

            if( defs ) {
                // different behavior if definitions list is an array or an object
                if( JSC.isArray(defs) ) {
                    // for array, each item is the name of method signature
                    // build an abstract method if the method does not exist into class definition
                    for(i = 0; i < defs.length; i++) {
                        method = defs[i];
                        if( undefined === Class.prototype[method] && _classNameField !== method ) {
                            Class.prototype[method] = JSC.abstractMethod(method);
                        }
                    }
                } else {
                    // get name for this interface
                    interfaceName = interfaceName || defs[_classNameField];

                    // for object, each item is a concrete method or an attribute
                    // copy the method or the attribute if it does not exist into class definition
                    // when method to add is undefined, build an abstract method
                    for(i in defs) {
                        method = defs[i];
                        if( undefined === Class.prototype[i] && _classNameField !== i ) {
                            Class.prototype[i] = undefined === method ? JSC.abstractMethod(i) : method;
                        }
                    }
                }
            }

            // register interface by its name, if given
            if( interfaceName ) {
                Class.interfaces = Class.interfaces || {};
                Class.interfaces[interfaceName] = true;
            }
        }
        return Class;
    };

    /**
     * Call a method from another class with a particular context
     *
     * @param {Function} Class
     * @param {String} methodName
     * @param {Object} context
     * @return {Object} Returns the result of the call
     */
    JSC.method = function(Class, methodName, context) {
        // ensure to get a real class
        Class = JSC.loadClass(Class) || JSC.error(_unknownClassError.replace("%s", Class), "JSC");

        // get the needed method from the given class, then call it with the given context and parameters
        return (Class.prototype[methodName] || JSC.noop).apply(context || Class, _arraySlice.call(arguments, 3));
    };

    /**
     * Check if an object is an instance of a particular class or interface.
     *
     * @param {Object} object Object to check
     * @param {Function|String} Class Name of interface or Class to compare with instance
     * @return {Boolean} Return true if the given object is an instance of the class or interface
     */
    JSC.instanceOf = function(object, Class) {
        if( object && Class ) {
            // get list of implemented interfaces
            var interfaces = object.constructor && object.constructor.interfaces ? object.constructor.interfaces : object.interfaces || _voidO,
            objectClassName = object[_classNameField], className;

            // name of class or interface
            if( JSC.isString(Class) ) {
                // try to find class from implemented interfaces
                if( interfaces[Class] || Class === objectClassName ) {
                    return true;
                }

                // try to load the class from global context
                Class = JSC.getClass(Class);
                if( !Class ) {
                    // nothing found !
                    return false;
                }
            }
            className = Class[_classNameField];

            // class or interface definition
            if( JSC.isFunction(Class) ) {
                return object instanceof Class || interfaces[className] || objectClassName === className ? true : false;
            }

            // try to find class from implemented interfaces
            return interfaces[className] || objectClassName === className ? true : false;
        }
        return false;
    };

    /**
     * Get a class from its name.
     *
     * @param {String|Function} className Class or name of the class to get
     * @return {Function} Return the class
     */
    JSC.getClass = function(className) {
        var Class = JSC.isString(className) ? JSC.global(className) : className;
        return JSC.isFunction(Class) ? Class : undefined;
    };

    /**
     * Get or load a class from its name. Throws an exception if no class comply.
     *
     * @param {String|Function} className Class or name of the class to get or load
     * @return {Function} Return the class
     * @throws Exception
     */
    JSC.loadClass = function(className) {
        return JSC.getClass(className) || JSC.error(_unknownClassError.replace("%s", className), "JSC.loadClass");
    };

    /**
     * Create a singleton class with inheritance, polymorphism, overloading, etc.
     * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
     * All created classes implements the "attach" method, that can context attach each method of its instances.
     *
     * Throws an error if the returned class is directly instantiated.
     *
     * @see JSC
     * @see JSC.basis
     * @see JSC.extend
     * @see JSC.overload
     * @see JSC.implement
     * @see JSC.statics
     *
     * @param {String} className Name of the singleton class to create
     * @param {Object} defs List of properties and methods for the new singleton class
     * @return {Function} Created singleton class
     */
    JSC.singleton = function(className, defs) {
        // build the class initializer and extend the new class with default behaviors
        var instance, Class = JSC(className, defs);

        // add static instance getter
        Class.getInstance = function() {
            if( undefined === instance ) {
                instance = new Class();
            }
            return instance;
        };

        // return the class after setting its body function as factory
        return Class.self();
    };

    /**
     * Create a multiton class with inheritance, polymorphism, overloading, etc.
     * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
     * All created classes implements the "attach" method, that can context attach each method of its instances.
     *
     * Throws an error if the returned class is directly instantiated.
     *
     * @see JSC
     * @see JSC.basis
     * @see JSC.extend
     * @see JSC.overload
     * @see JSC.implement
     * @see JSC.statics
     *
     * @param {String} className Name of the multiton class to create
     * @param {Object} defs List of properties and methods for the new multiton class
     * @return {Function} Created multiton class
     */
    JSC.multiton = function(className, defs) {
        // build the class initializer and extend the new class with default behaviors
        var instances = {}, Class = JSC(className, defs);

        // add static instance getter
        Class.getInstance = function(key) {
            var skey = _voidS + key;
            if( undefined === instances[skey] ) {
                instances[skey] = new Class(key);
            }
            return instances[skey];
        };

        // return the class after setting its body function as factory
        return Class.self();
    };

    /**
     * Make a new class with inheritance, polymorphism, overloading, etc.
     * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
     * All created classes implements the "attach" method, that can context attach each method of its instances.
     *
     * @see JSC
     * @see JSC.singleton
     * @see JSC.multiton
     * @see JSC.basis
     * @see JSC.extend
     * @see JSC.overload
     * @see JSC.implement
     * @see JSC.statics
     *
     * @param {String} type Type of class to create : "classic", "singleton", "multiton"
     * @param {Object} [defs] List of properties and methods for the new class
     * @param {Object} [statics] List of static properties and methods for the new class
     * @param {Boolean} [globalize] Flag for enabling (true) or not (false) the export to global context (by default : true)
     * @return {Function} Created class
     */
    JSC.make = function(type, defs, statics, globalize) {
        var Class, i, a, t, d, s, g;

        // arguments can be given out of order
        for(i = 0; i < arguments.length; i++) {
            a = arguments[i];
            switch( typeof a ) {
                // no argument, go next one
                case "undefined":
                    break;

                // string argument stands for "type"
                case "string":
                    t = a.toLowerCase();
                    break;

                // boolean argument stands for "globalize"
                case "boolean":
                    g = a;
                    break;

                // other argument (object or not) stands for "defs", when is first, or "statics", when is second
                default:
                    if( d ) {
                        s = a;
                    } else {
                        d = a;
                    }
            }
        }

        // create the class according given type
        Class = "singleton" === t ? JSC.singleton(d) : "multiton" === t ? JSC.multiton(d) : JSC(d);

        // add optional static methods and properties
        s && Class.statics(s);

        // returns the new class, after have globalized it if needed
        return false !== g && Class[_classNameField] ? JSC.globalize(Class) : Class;
    };

    /**
     * Add some default members on a class and set its identity
     *
     * @see JSC
     *
     * @param {Function} Class The class to extend with default members
     * @param {String} className Name of the class to create
     * @return {Function} Return the class
     */
    JSC.basis = function(Class, className) {
        // static method to extend the class
        Class.extend = function(defs) {
            return JSC.extend(this, defs, this);
        };

        // static method to implement an interface on the class
        Class.implement = function(defs, interfaceName) {
            return JSC.implement(this, defs, interfaceName);
        };

        // static method to extend the class with statics members
        Class.statics = function(defs) {
            return JSC.merge(this, defs);
        };

        // call a method from the class with a particular context
        Class.method = function(methodName, context) {
            return (this.prototype[methodName] || JSC.noop).apply(context || this, _arraySlice.call(arguments, 2));
        };

        // static method to set the class body function
        Class.self = function(methodName) {
            this.body = JSC.isString(methodName) ? this[methodName] : methodName || this.getInstance || function() {
                return new this();
            };
            return this;
        };

        // static method to rename the class
        Class.rename = function(className) {
            this.prototype[_classNameField] = this[_classNameField] = className || _defaultClassName;
            return this;
        };

        /**
         * Attach a method to the class instance with a wrapper function, to ensure the "this" keyword always refer
         * to right owner instance. Use internal cache to keep copy of attached versions.
         *
         * @see JSC.attach
         *
         * @param {String} name Name of the method to attach. If it does not exist, use JSC.noop in place
         * @param {Boolean} force Flag to force cache rewriting
         * @return {Function} Return instance attached method
         */
        Class.prototype.attach = function(name, force) {
            if( name && this[name] ) {
                // search in the cache for existing one
                var cacheName = "__cache__" + name;
                if( force || !this[cacheName] ) {
                    // fill the cache with new attached method
                    this[cacheName] = JSC.attach.apply(JSC, [this, name].concat(_arraySlice.call(arguments, 2)));
                }
                return this[cacheName];
            } else {
                // always return a function, even if needed one does not exist
                return JSC.noop;
            }
        };

        // set the class identity
        JSC.id(Class.rename(className));
        return Class;
    };

    /**
     * Check if a plugin is installed on the library
     *
     * @param {Number|String|Object} plugin The plugin identifier. It can be either the GUID, a name, or the plugin itself
     * @return {Boolean} Return true if the plugin is installed
     */
    JSC.isInstalled = function(plugin) {
        var guid;

        // check only for valid identifiers, otherwise assume that plugin is installed
        if( plugin ) {
            // accept GUID, name or plugin descriptors
            if( isNaN(plugin) ) {
                if( JSC.isString(plugin) ) {
                    // the given value is a plugin's name
                    guid = plugin;
                } else if( JSC.isObject(plugin) && !JSC.isEmptyObject(plugin) ) {
                    // the plugin is given, get its name or GUID
                    guid = plugin[_pluginNameField] || JSC.id(plugin);
                }
            } else {
                // the given value is a plugin's GUID
                guid = plugin;
            }
        }

        // check the GUID
        return !guid || _plugins[guid] ? true : false;
    };

    /**
     * Install a plugin on the library
     *
     * @param {Object} plugin A descriptor object for the plugin. It must contain the name of plugin into
     *                        the field 'pluginName', and the list of all plugin's properties.
     *                        On first level (i.e. the entries directly injected into JSC)
     *                        only objects and functions are allowed.
     * @return {Number} Return the GUID of the installed plugin, or 0 if the plugin cannot be installed
     */
    JSC.install = function(plugin) {
        var pluginName, name, plug, old, descriptor, guid = 0;

        // a descriptor object is needed, with name of the plugin
        if( JSC.isObject(plugin) && plugin[_pluginNameField] ) {
            // get the plugin's identity
            pluginName = plugin[_pluginNameField];
            guid = JSC.id(plugin);

            // check if it is already installed
            if( guid && !_plugins[pluginName] ) {
                // store plugin installation descriptor
                _plugins[guid] = _plugins[pluginName] = descriptor = {};
                descriptor[_pluginNameField] = pluginName;
                descriptor[_guidField] = guid;

                // process to plugin injection
                for(name in plugin) {
                    // ignore name of plugin and GUID
                    if( _pluginNameField === name || _guidField === name ) {
                        continue;
                    }

                    // load only plugin members that are object or function
                    plug = plugin[name];
                    if( JSC.isObject(plug) || JSC.isFunction(plug) ) {
                        // keep a link to old target entry
                        descriptor[name] = old = JSC[name];

                        // target entry already exists ?
                        if( old ) {
                            // particular processing according to target's type
                            if( JSC.isFunction(old) ) {
                                if( JSC.isFunction(plug) ) {
                                    // the target and the plugin entries are both functions : make overload
                                    JSC[name] = JSC.overload(plug, old);
                                } else {
                                    // the target entry is a function, but plugin one is an object : merge plugin into the target
                                    JSC[name] = JSC.merge(old, plug);
                                }
                            } else if( JSC.isObject(old) ) {
                                // the target and the plugin entries are both objects : merge target to plugin
                                JSC[name] = JSC.merge(plug, old);
                            } else {
                                // target is not object or function, do just a straight copy
                                JSC[name] = plug;
                            }
                        } else {
                            // target does not exist, do just a straight copy
                            JSC[name] = plug;
                        }

                        // ensure that the added/altered entry has plugin tag
                        JSC[name][_flagPlugin] = guid;
                    }
                }
            }
        }
        return guid;
    };

    /**
     * Uninstall a plugin from the library
     *
     * @param {Number|String|Object} plugin The plugin identifier. It can be either the GUID, a name, or the plugin itself
     * @return {Boolean} Return true if the plugin is uninstalled
     */
    JSC.uninstall = function(plugin) {
        var guid, name;

        // process only valid identifiers
        if( plugin ) {
            // accept GUID, name or plugin descriptors
            if( isNaN(plugin) ) {
                if( JSC.isString(plugin) ) {
                    // the given value is a plugin's name
                    guid = plugin;
                } else if( JSC.isObject(plugin) && !JSC.isEmptyObject(plugin) ) {
                    // the plugin is given, get its name or GUID
                    guid = plugin[_pluginNameField] || JSC.id(plugin);
                }
            } else {
                // the given value is a plugin's GUID
                guid = plugin;
            }

            // retrieve the plugin
            plugin = _plugins[guid];
            if( plugin ) {
                // remove entries added by the plugin
                for(name in plugin) {
                    if( undefined !== plugin[name] ) {
                        JSC[name] = plugin[name];
                    } else {
                        delete JSC[name];
                    }
                }

                // delete plugin's descriptor entries
                delete _plugins[plugin[_pluginNameField]];
                delete _plugins[plugin[_guidField]];
            } else {
                // no plugin found, cannot uninstall
                guid = 0;
            }
        }

        // check the GUID
        return guid ? true : false;
    };

    /**
     * Custom Error class for the library
     *
     * @see JSC.error
     *
     * @class JSC.Error
     *
     * @param {String} message The message for the error
     * @param {Object} context The context of this error
     */
    JSC.Error = JSC({
       className : "JSC.Error",
       superClass : Error,
       initialize : function(message, context) {
           this.message = message || _defaultError;
           this.context = context;
       }
    });

    // exports public entries for the library
    JSC.globalize(JSC);
})();
