/*!
 * JavaScript Class Library v0.2.4 (JSC v0.2.4)
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(undefined){
    var
        // reference to global context (Window object or other)
        globalContext = this,

        // counter used to generate unique identifier
        _guidCount = 0,

        // default error message when none given
        _defaultError = "Unexpected error !",

        // message of error throwed when abstract method is called
        _abstractCallError = "%s : This method is abstract and have to be overridden !",

        // message of error throwed when needed class was not found
        _unknownClassError = "Class [%s] not found !",

        // message of error throwed when direct instantiation is attempted on singleton or multiton
        _directInstanceError = "This class cannot be directly instantiated !",

        // some void instances of native types
        _voidA = [],
        _voidO = {},

        // get the native method to slice array
        _arraySlice = _voidA.slice,

        // get the native method to check properties added on the go
        _hasOwn = _voidO.hasOwnProperty,

        // get the native toString method
        _toString = _voidO.toString,

        // translations map to get real type from native toString method returns
        _types = {},

        // RegEx to extract name of type from native toString method
        _reType = /^\[object\s(.*)\]$/,

        // RegEx to check if a method call parent one
        _reInherited = /inherited/.test(function(){this.inherited();}) ? /\binherited\b/ : /.*/,

        // RegEx to trim source code in toString() context
        _reCode = /\s*([\(\)\[\]\{\};]+)\s*/g,

        // RegEx to encode string (stringify) (borrowed from json2.js)
        _reString = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

        // RegEx to trim a string (borrowed from jQuery)
        _reTrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // RegEx to clean input strings before JSON parsing (borrowed from json2.js)
        _reJsonValid = /^[\],:{}\s]*$/,
        _reJsonEscape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        _reJsonBracket = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        _reJsonDiscard =/(?:^|:|,)(?:\s*\[)+/g,

        // translations map to stringify a string
        _stringMap = {
            '"' : '\\"',
            '\\' : '\\\\',
            '\t' : '\\t',
            '\b' : '\\b',
            '\f' : '\\f',
            '\n' : '\\n',
            '\r' : '\\r'
        },

        // stringify map for some particular types
        _toStringMap = {
            // representation of a string (logic borrowed from json2.js)
            "[object String]" : function(s) {
                return _reString.test(s) ? '"' + s.replace(_reString, function(ch) {
                    var c = _stringMap[ch];
                    return c ? c : '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).substr(-4);
                }) + '"' : '"' + s + '"';
            },

            // representation of an object
            "[object Object]" : function(o) {
                var k, s = "{";
                for(k in o) {
                    if( _hasOwn.call(o, k) ) {
                        s += (s.length > 1 ? ',' : '') + JSC.toString(k) + ':' + JSC.toString(o[k]);
                    }
                }
                return s + "}";
            },

            // representation of an array
            "[object Array]" : function(a) {
                var i, s = "[";
                for(i = 0; i < a.length; i++) {
                    s += (s.length > 1 ? ',' : '') + JSC.toString(a[i]);
                }
                return s + "]";
            },

            // representation of a function
            "[object Function]" : function(f) {
                return f.toString().replace(_reCode, '$1');
            },

            // representation of a regular expression
            "[object RegExp]" : function(r) {
                return '/' + r.source + '/' + (r.global ? 'g' : '') + (r.ignoreCase ? 'i' : '');
            }
        },

        // a simple function to only get given value
        _getIt = function(v) {
            return v;
        },

        // getter map for JSON compatible types
        _jsonMap = {
            // basic types, just copy
            "[object Number]" : function(n) {
                return isFinite(n) ? n : null;
            },
            "[object String]" : _getIt,
            "[object Boolean]" : _getIt,

            // objects, do a clone
            "[object Object]" : function(o) {
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
            "[object Array]" : function(a) {
                var i, v, json = [];
                for(i = 0; i < a.length; i++) {
                    v = JSC.jsonData(a[i]);
                    if( undefined !== v ) {
                        json.push(v);
                    }
                }
                return json;
            }
        };

    // add some natives types to translations map of types
    (function(list){
        for(var i = 0; i < list.length; i++) {
            _types[ "[object " + list[i] + "]" ] = list[i];
        }
    })(["Array", "Boolean", "Date", "Function", "Object", "Number", "RegExp", "String"]);

    // ensure existence of String.trim()
    if( !("".trim) ) {
        String.prototype.trim = function() {
            return this.replace(_reTrim, '');
        };
    }

    /**
     * Custom Error class for the library
     */
    var JSCError = function(message, context) {
        this.message = message;
        this.context = context;
    };
    JSCError.prototype = new Error();
    JSCError.prototype.constructor = JSCError;
    JSCError.prototype.className = JSCError.className = "JSCError";

    /**
     * Core library entry.
     *
     * @exports JSC
     * @namespace JSC
     * @version 0.2.3
     */
    var JSC = {
        /**
         * Library version.
         *
         * @constant
         * @type String
         */
        version : "0.2.4",

        /**
         * Class name.
         *
         * @constant
         * @type String
         */
        className : "JSC",

        /**
         * Global unique identifier.
         *
         * @constant
         * @type Number
         */
        guid : 0,

        /**
         * An empty method to do nothing.
         */
        noop : function() {},

        /**
         * Generate or read unique identifier.
         *
         * @param {Object} [o] Optional object to tag with unique identifier
         * @param {Number} [guid] Optional identifier to set if none were already there
         * @return {Number} The unique identifier
         */
        id : function(o, guid) {
            if( "undefined" !== typeof o ) {
                return o.guid || (JSC === o ? o.guid : (o.guid = guid || ++ _guidCount));
            }

            return guid || ++ _guidCount;
        },

        /**
         * Get real type or class name of a given value.
         *
         * @param {Object} o Value from which get the type
         * @return {String} Type or class name of the value
         */
        type : function(o) {
            // zero-like value ?
            if( null == o ) {
                return String(o);
            }

            // instance or class created with this library ?
            if( o.className ) {
                return o.className;
            }

            // detect type by object definition
            var string = _toString.call(o);
            return _types[string] || (_types[string] = (string.match(_reType) || [0, "Object"])[1]);
        },

        /**
         * Check if an object is a function.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is a function
         */
        isFunction : function(o) {
            return o && "[object Function]" === _toString.call(o) ? true : false;
        },

        /**
         * Check if an object is a class definition.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is a class definition
         */
        isClass : function(o) {
            return o && o.className && "[object Function]" === _toString.call(o) ? true : false;
        },

        /**
         * Check if an object is a class instance.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is a class instance
         */
        isInstance : function(o) {
            return o && o.className && "[object Function]" !== _toString.call(o) ? true : false;
        },

        /**
         * Check if a function is abstract.
         *
         * @param {Function} fn Function to test
         * @return {Boolean} Return true if the given function is abstract
         */
        isAbstract : function(fn) {
            return fn && JSC.isFunction(fn) && fn.abstractMethod ? true : false;
        },

        /**
         * Check if a function is an attached version.
         *
         * @param {Function} fn Function to test
         * @return {Boolean} Return true if the given function is an attached version
         */
        isAttached : function(fn) {
            return fn && JSC.isFunction(fn) && fn.attached ? true : false;
        },

        /**
         * Check if a function use inheritance.
         *
         * @param {Function} fn Function to test
         * @return {Boolean} Return true if the given function use inheritance
         */
        isInherited : function(fn) {
            return fn && JSC.isFunction(fn) && fn.inheritance ? true : false;
        },

        /**
         * Check if an object is an array.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is an array
         */
        isArray : Array.isArray || function(o) {
            return o && "[object Array]" === _toString.call(o) ? true : false;
        },

        /**
         * Check if a value is an object.
         *
         * @param {Object} o Value to test
         * @return {Boolean} Return true if the given value is an object
         */
        isObject : function(o) {
            return o && "[object Object]" === _toString.call(o) ? true : false;
        },

        /**
         * Check if an object is empty.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is empty
         */
        isEmptyObject : function(o) {
            // only true objects can be checked as empty
            if( !JSC.isObject(o) ) {
                return false;
            }

            // if we find at least a property or method into the given object, it is not empty !
            for(var k in o) {
                return false;
            }

            // the given object can be considered empty
            return true;
        },

        /**
         * Check if an object is a string.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is a string
         */
        isString : function(o) {
            return "" === o || (o && "[object String]" === _toString.call(o)) ? true : false;
        },

        /**
         * Check if an object is a boolean.
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given object is a boolean
         */
        isBool : function(o) {
            return false === o || (o && "[object Boolean]" === _toString.call(o)) ? true : false;
        },

        /**
         * Check if a value is numeric
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given value is numeric
         */
        isNumeric : function(o) {
            return !isNaN(parseFloat(o)) && isFinite(o);
        },

        /**
         * Check if a value is null
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given value is null
         */
        isNull : function(o) {
            return o === null;
        },

        /**
         * Check if a value is undefined
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given value is undefined
         */
        isUndef : function(o) {
            return o === undefined;
        },

        /**
         * Check if a value is null or undefined
         *
         * @param {Object} o Object to test
         * @return {Boolean} Return true if the given value is null or undefined
         */
        isVoid : function(o) {
            return o === undefined || o === null;
        },

        /**
         * Throw an error.
         *
         * @param {String} msg Error message
         * @param {Object} [context] Optional error context
         * @throws Exception
         */
        error : function(msg, context) {
            throw new JSCError(msg || _defaultError, context);
        },

        /**
         * Export a variable to global context.
         *
         * @param {String} n Name of exported variable in global context
         * @param {Object} v Value to export
         * @return {Object} Exported value
         */
        globalize : function(n, v) {
            // name is no given, assume it from "className" attribute (useful for classes)
            if( n && !JSC.isString(n) && "undefined" === typeof v ) {
                v = n;
                n = n.className;
            }

            // export to global context
            globalContext["" + n] = v;
            return v;
        },

        /**
         * Get a variable from global context.
         *
         * @param {String} n Name of variable to get from global context
         * @return {Object} Value of the global variable, or undefined
         */
        global : function(n) {
            return globalContext[n];
        },

        /**
         * Return a string representation of a given value.
         * If no parameter is given, return name and version of JSC object.
         *
         * @return {String} Return a string representation
         */
        toString : function() {
            if( arguments.length ) {
                var t, v = arguments[0];
                if( !v && "" !== v ) {
                    // representation of a zero-like value
                    return String(v);
                } else {
                    // representation of typed value
                    t = _toString.call(v);
                    return _toStringMap[t] ? _toStringMap[t](v) : v.toString();
                }
            }

            // by default, when no value is given, return name and version of the library
            return JSC.className + " " + JSC.version;
        },

        /**
         * Extract JSON compatible data from an object.
         * Compatible types are : String, Boolean, Number, Array, Object and the null value.
         *
         * @param {Object} o
         * @return {Object} Return a clone object containing only JSON compatible types
         */
        jsonData : function(o) {
            if( o ) {
                var t = _toString.call(o);
                return _jsonMap[t] ? _jsonMap[t](o) : undefined;
            }
            return o;
        },

        /**
         * Convert an object to a JSON string representation.
         *
         * @param {Object} o Object to convert
         * @return {String} Return the JSON string
         */
        jsonString : function(o) {
            o = JSC.jsonData(o);
            return undefined !== o ? JSC.toString(o) : "";
        },

        /**
         * Parse and evaluate a string as a JSON representation.
         *
         * @param {String} s The string containing JSON data
         * @return {Object} Return JSON data evaluated or null if error
         */
        jsonParse : function(s) {
            // need at least a string
            if( s && "string" === typeof s ) {
                // avoid error, always return null if received data is not valid JSON
                try {
                    // need no leading or trailing whitespaces
                    s = s.trim();
                    if( s ) {
                        // check browser support for native JSON parsing
                        if( globalContext.JSON && globalContext.JSON.parse ) {
                            return globalContext.JSON.parse(s);
                        }

                        // no browser support, try to evaluate the code after cleaning (logic borrowed from json2.js and jQuery)
                        if( _reJsonValid.test(s.replace(_reJsonEscape, '@').replace(_reJsonBracket, ']').replace(_reJsonDiscard, '')) ) {
                            return (new Function("return " + s + ";"))();
                        }
                    }
                } catch( e ) {}
            }
            return null;
        },

        /**
         * Sort an array of objects by specified keys.
         *
         * @param {Array} array The array to sort
         * @param {Array} keys The list of sort keys
         * @return {Array} Return the sorted array
         */
        sort : function(array, keys) {
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
                            // assume all compare values are present in both objects
                            v = false;
                            for(i = 0; i < keys.length; i++) {
                                // load value to compare in both objects
                                k = keys[i];
                                ka = a[k];
                                kb = b[k];

                                // check values, they have to be not void
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
            }
            return array;
        },

        /**
         * Shuffle an array.
         *
         * @param {Array} array The array to shuffle
         * @return {Array} Return the shuffled array
         */
        shuffle : function(array){
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
        },

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
        merge : function(o) {
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
                        if( s !== undefined ) {
                            dest[n] = s;
                        }
                    }
                }
            }
            return dest || {};
        },

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
        each : function(o, f) {
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
        },

        /**
         * Get the properties added on the go for the given object (not herited).
         *
         * @param {Object} o Object from which extract the "on the go" properties
         * @return {Object} Return a new object that contains the "on the go" properties of given object
         */
        owned : function(o) {
            var k, r = {};
            if( o ) {
                for(k in o) {
                    if( _hasOwn.call(o, k) ) {
                        r[k] = o[k];
                    }
                }
            }
            return r;
        },

        /**
         * Attach a function to particular context (on which the "this" keyword refer to).
         * Tag the wrap function with "attached" attribute, set with boolean value "true".
         *
         * @param {Function|Object} fn Function to attach to the context, or context to attach
         * @param {Object|String} context Context to attach to the function, or name of a method into given context
         * @returns {Function} Return attached version of the given function
         */
        attach : function(fn, context) {
            // attach a method to its parent object ?
            if( fn && JSC.isString(context) ) {
                var method = fn[context];
                context = fn;
                fn = method;
            }

            // produce a context attached function
            var wrap = JSC.noop;
            if( JSC.isFunction(fn) ) {
                var args = _arraySlice.call(arguments, 2);
                wrap = function() {
                    return fn.apply(context, args.concat(_arraySlice.call(arguments)));
                };
                wrap.attached = true;
            }

            // affect unique ID
            JSC.id(wrap, fn ? JSC.id(fn) : undefined);

            // and there is a context attached function...
            return wrap;
        },

        /**
         * Attach a method to current instance (ensure the "this" keyword refer to right owner instance).
         * Use internal cache to keep copy of attached versions.
         * This function will be bound to each created class by this library.
         * Tag the wrap function with "attached" attribute, set with boolean value "true".
         *
         * @see JSC.attach
         *
         * @param {String} name Name of the method to attach. If it does not exist, use JSC.noop in place
         * @param {Boolean} force Flag to force cache rewriting
         * @return {Function} Return instance attached method
         */
        innerAttach : function(name, force) {
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
        },

        /**
         * Produce an abstract method. When called, it will throw an exception.
         * Tag the built function with "abstractMethod" attribute, set with boolean value "true".
         *
         * @param {String} [name] Optional name for the new abstract method
         * @return {Function} New abstract method
         */
        abstractMethod : function(name) {
            var fn = function() {
                var context = (this.className || "[unknownClass]") + '.' + (name || "[unknownMethod]");
                JSC.error(_abstractCallError.replace("%s", context), context);
            };
            fn.abstractMethod = true;
            return fn;
        },

        /**
         * Wrap an overriding method that call overrided version.
         * If a wrap function is built to handle inheritance, this function will be tagged with "inheritance" attribute,
         * set with boolean value "true".
         *
         * @param {Function} method Reference of the overriding method
         * @param {Object} oldMethod Reference of the overrided method
         * @returns {Function} Return the wrap method containing override process
         */
        override : function(method, oldMethod) {
            // only if both parameters are functions, not equals and overriding method invoke inheritance
            if( method !== oldMethod && JSC.isFunction(method) && _reInherited.test(method) ) {
                oldMethod = JSC.isFunction(oldMethod) ? oldMethod : JSC.noop;
                var wrap = function() {
                    var tmp = this.inherited;
                    this.inherited = oldMethod;
                    var ret = method.apply(this, arguments);
                    this.inherited = tmp;
                    return ret;
                };
                wrap.inheritance = true;
                return wrap;
            }
            return method;
        },

        /**
         * Add methods and attributes to an existent class definition.
         * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
         *
         * @see JSC.override
         *
         * @param {Function} Class The class to extend
         * @param {Object} defs List of properties and methods to add to the class
         * @param {Function} superClass Super class for the class to extend
         * @return {Function} Return the class
         */
        extend : function(Class, defs, superClass) {
            // add methods and attributes
            if( Class && Class.prototype ) {
                for(var name in defs) {
                    if( _hasOwn.call(defs, name) ) {
                        Class.prototype[name] = superClass ? JSC.override(defs[name], superClass.prototype[name]) : defs[name];
                    }
                }
            }
            return Class;
        },

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
         * @see JSC.override
         * @see JSC.abstractMethod
         *
         * @param {Function} Class The class to extend with interface
         * @param {Object|Array} defs List of properties and methods of interface to add to the class
         * @param {String} [name] Optional name of the interface to implement (can be also set into defs)
         * @return {Function} Return the class
         */
        implement : function(Class, defs, name) {
            var i, method;

            if( Class && Class.prototype ) {
                // inverted order for name and defs...
                if( JSC.isString(defs)) {
                    var tmp = name;
                    name = defs;
                    defs = tmp;
                }

                if( defs ) {
                    // different behavior if definitions list is an array or an object
                    if( JSC.isArray(defs) ) {
                        // for array, each item is the name of method signature
                        // build an abstract method if the method does not exist into class definition
                        for(i = 0; i < defs.length; i++) {
                            method = defs[i];
                            if( undefined === Class.prototype[method] && "className" !== method ) {
                                Class.prototype[method] = JSC.abstractMethod(method);
                            }
                        }
                    } else {
                        // get name for this interface
                        name = name || defs.className;

                        // for object, each item is a concrete method or an attribute
                        // copy the method or the attribute if it does not exist into class definition
                        // when method to add is undefined, build an abstract method
                        for(i in defs) {
                            method = defs[i];
                            if( undefined === Class.prototype[i] && "className" !== i ) {
                                Class.prototype[i] = undefined === method ? JSC.abstractMethod(i) : method;
                            }
                        }
                    }
                }

                // register interface by its name, if given
                if( name ) {
                    Class.interfaces = Class.interfaces || {};
                    Class.interfaces[name] = true;
                }
            }
            return Class;
        },

        /**
         * Check if an object is an instance of a particular class or interface.
         *
         * @param {Object} o Object to check
         * @param {Function|String} c Name of interface or Class to compare with instance
         * @return {Boolean} Return true if the given object is an instance of the class or interface
         */
        instanceOf : function(o, c) {
            var Class, interfaces;
            if( o && c ) {
                // get list of implemented interfaces
                interfaces = o.constructor && o.constructor.interfaces ? o.constructor.interfaces : o.interfaces || _voidO;

                // name of class or interface
                if( JSC.isString(c) ) {
                    // try to find class from implemented interfaces
                    if( interfaces[c] || c === o.className ) {
                        return true;
                    }

                    // try to load the class from global context
                    Class = JSC.getClass(c);
                    if( Class ) {
                        c = Class;
                    } else {
                        // nothing found !
                        return false;
                    }
                }

                // class or interface definition
                if( JSC.isFunction(c) ) {
                    return o instanceof c || interfaces[c.className] || o.className === c.className ? true : false;
                }

                // try to find class from implemented interfaces
                return interfaces[c.className] || o.className === c.className ? true : false;
            }
            return false;
        },

        /**
         * Get a class from its name.
         *
         * @param {String|Function} className Class or name of the class to get
         * @return {Function} Return the class
         */
        getClass : function(className) {
            var Class = JSC.isString(className) ? JSC.global(className) : className;
            return JSC.isFunction(Class) ? Class : undefined;
        },

        /**
         * Get or load a class from its name. Throws an exception if no class comply.
         *
         * @param {String|Function} className Class or name of the class to get or load
         * @return {Function} Return the class
         * @throws Exception
         */
        loadClass : function(className) {
            return JSC.getClass(className) || JSC.error(_unknownClassError.replace("%s", className), "JSC.loadClass");
        },

        /**
         * Create a class with inheritance, polymorphism, overriding, etc.
         * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
         * All created classes implements the "attach" method, that can context attach each method of its instances.
         *
         * @see JSC.extend
         * @see JSC.override
         * @see JSC.innerAttach
         *
         * @param {String} className Name of the class to create
         * @param {Object} defs List of properties and methods for the new class
         * @return {Function} Created class
         */
        Class : function(className, defs) {
            var Class, superClass;

            // all parameters can be given in one single object
            if( className && !JSC.isString(className) ) {
                defs = className;
                className = defs.className;
            }

            // build the class initializer
            Class = function() {
                // called for inheritance ?
                if( arguments.callee.caller === JSC.Class ) {
                    return this;
                }

                // if the class implements singleton/multiton/factory pattern, instantiation is only allowed from the static method getInstance()
                Class.getInstance && arguments.callee.caller !== Class.getInstance && JSC.error(_directInstanceError, className);

                // set the instance identity
                this.guid = JSC.id();

                // call delegate constructor if exists
                this.initialize && this.initialize.apply(this, arguments);
                return this;
            };

            // definitions list ?
            if( defs ) {
                // is a superClass defined ?
                if( defs.superClass ) {
                    // load super class
                    superClass = JSC.loadClass(defs.superClass) || JSC.error(_unknownClassError.replace("%s", defs.superClass), "JSC.Class");
                    defs.superClass = superClass.className || JSC.type(superClass);

                    // process for inheritance
                    Class.prototype = new superClass();
                    Class.prototype.constructor = Class;
                }

                // add methods and attributes
                JSC.extend(Class, defs, superClass);
            }

            // add some default behaviors
            Class.extend = function(defs) {
                return JSC.extend(this, defs, superClass);
            };
            Class.implement = function(defs, name) {
                return JSC.implement(this, defs, name);
            };
            Class.statics = function(defs) {
                return JSC.merge(this, defs);
            };
            Class.interfaces = superClass && superClass.interfaces ? JSC.merge({}, superClass.interfaces) : {};
            Class.prototype.attach = JSC.innerAttach;

            // set the class identity
            Class.prototype.className = Class.className = className;
            Class.guid = JSC.id();
            return Class;
        },

        /**
         * Create a singleton class with inheritance, polymorphism, overriding, etc.
         * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
         * All created classes implements the "attach" method, that can context attach each method of its instances.
         *
         * Throws an error if the returned class is directly instantiated.
         *
         * @see JSC.extend
         * @see JSC.override
         * @see JSC.innerAttach
         *
         * @param {String} className Name of the singleton class to create
         * @param {Object} defs List of properties and methods for the new singleton class
         * @return {Function} Created singleton class
         */
        Singleton : function(className, defs) {
            // build the class initializer and extend the new class with default behaviors
            var Class = JSC.Class(className, defs);

            // add static instance getter
            Class.getInstance = function() {
                if( undefined === this.__instance ) {
                    this.__instance = new Class();
                }
                return this.__instance;
            };

            return Class;
        },

        /**
         * Create a multiton class with inheritance, polymorphism, overriding, etc.
         * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
         * All created classes implements the "attach" method, that can context attach each method of its instances.
         *
         * Throws an error if the returned class is directly instantiated.
         *
         * @see JSC.extend
         * @see JSC.override
         * @see JSC.innerAttach
         *
         * @param {String} className Name of the multiton class to create
         * @param {Object} defs List of properties and methods for the new multiton class
         * @return {Function} Created multiton class
         */
        Multiton : function(className, defs) {
            // build the class initializer and extend the new class with default behaviors
            var Class = JSC.Class(className, defs);

            // add static instance getter
            Class.getInstance = function(key) {
                var skey = "" + key;
                this.__instances = this.__instances || {};
                if( undefined === this.__instances[skey] ) {
                    this.__instances[skey] = new Class(key);
                }
                return this.__instances[skey];
            };

            return Class;
        },

        /**
         * Make a new class with inheritance, polymorphism, overriding, etc.
         * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
         * All created classes implements the "attach" method, that can context attach each method of its instances.
         *
         * @see JSC.Class
         * @see JSC.Singleton
         * @see JSC.Multiton
         * @see JSC.extend
         * @see JSC.override
         * @see JSC.innerAttach
         *
         * @param {String} type Type of class to create : "classic", "singleton", "multiton"
         * @param {Object} [defs] List of properties and methods for the new class
         * @param {Object} [statics] List of static properties and methods for the new class
         * @param {Boolean} [globalize] Flag for enabling (true) or not (false) the export to global context (by default : true)
         * @return {Function} Created class
         */
        Make : function(type, defs, statics, globalize) {
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
            Class = "singleton" === t ? JSC.Singleton(d) : "multiton" === t ? JSC.Multiton(d) : JSC.Class(d);

            // add optional static methods and properties
            s && Class.statics(s);

            // returns the new class, after have globalized it if needed
            return false !== g && Class.className ? JSC.globalize(Class) : Class;
        }
    };

    // exports public entries for the library
    JSC.globalize(JSC);
    JSC.globalize(JSCError);
})();
