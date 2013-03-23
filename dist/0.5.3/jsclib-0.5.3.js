/*!
 * JavaScript Class Library v0.5.3 (JSC v0.5.3)
 * Copyright 2013 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function($){
(function(installer){
    if( "function" === typeof define ) {
        define(installer);
    } else if( "undefined" !== typeof exports && "undefined" !== typeof module ) {
        module.exports = installer();
    } else {
        this.JSC = installer();
    }
})(function(undefined){
    var
        // reference to global context (Window object or other)
        _globalContext = this,

        // backup for previous value of the library entry point
        _backup = _globalContext.JSC,

        // counter used to generate unique identifier
        _guidCount = 0,

        // default name for anonymous classes
        _defaultClassName = "Class",

        // default error message when none given
        _defaultError = "Unexpected error !",

        // message of error thrown when abstract method is called
        _abstractCallError = "%s : This method is abstract and has to be overloaded !",

        // message of error thrown when needed class was not found
        _unknownClassError = "Class [%s] not found !",

        // message of error thrown when direct instantiation is tried on singleton or multiton
        _directInstanceError = "This class cannot be directly instantiated !",

        // list of installed plugins
        _plugins = {},

        // some void instances of native types
        _voidA = [],
        _voidO = {},
        _voidS = "",

        // get the native method used to slice array
        _arraySlice = _voidA.slice,

        // get the native method used to check properties added on the go (not in prototype)
        _hasOwn = _voidO.hasOwnProperty,

        // get the native toString method
        _toString = _voidO.toString,

        // RegEx used to extract name of type from native toString method
        _reType = /^\[object\s(.*)\]$/,

        // RegEx used to check if a method call parent one
        _reInherited = /xyz/.test(function(){xyz();}) ? /\binherited\b/ : /.*/,

        // RegEx used to trim source code in toString() context
        _reCode = /\s*([\(\)\[\]\{\};]+)\s*/g,

        // RegEx used to check for HTML strings (borrowed from jQuery)
        _reHTML = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // RegEx used to check for CSS selector strings
        _reCSS = /^([*]?[\s+>~]*[#.\w-\[:*]+[#.\w-\[\]=\(\)"'*~^$:]*)+$/,

        // RegEx used to check for valid URL
        _reURL = /^(((https?|ftps?):\/\/)((\w+:?\w*@)?(\S+)(:[0-9]+)?)?)?([\w-.\/]+[.\/])+([\w#!:.,;?+=&%@!\-\/])+$/,

        // RegEx used to math words boundaries in undescored names
        _reUndescore = /([a-z0-9]+)_([a-z0-9])/gi,

        // RegEx used to math words boundaries in camel case names
        _reCamelCase = /([a-z0-9]+)([A-Z])/g,

        // RegEx used to detect special chars in strings before use thems as part for RegEx
        _reNotText = /([^\w\s])/g,

        // RegEx used to encode string (stringify) (borrowed from json2.js)
        _reString = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

        // RegEx used to trim a string (borrowed from jQuery)
        _reTrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // RegEx used to clean input strings before JSON parsing (borrowed from json2.js)
        _reJsonValid = /^[\],:{}\s]*$/,
        _reJsonEscape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        _reJsonBracket = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        _reJsonDiscard = /(?:^|:|,)(?:\s*\[)+/g,

        // shorthand to type prefix string
        _typePrefix = "object ",

        // shorthand to some types strings
        _typeArray = "[" + _typePrefix + "Array]",
        _typeObject = "[" + _typePrefix + "Object]",
        _typeFunction = "[" + _typePrefix + "Function]",
        _typeString = "[" + _typePrefix + "String]",
        _typeBoolean = "[" + _typePrefix + "Boolean]",

        // simple function used to only get given value
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
                                           "." + (milli < 10 ? "00" + milli : (milli < 100 ? "0" + milli : milli)) +
                                           "Z";
        },

        // simple function used to compose a list of mapped values by types
        _getTypesMap = function(map){
            var i, types = {};
            if( map.length ) {
                // source map is an array
                for(i = 0; i < map.length; i++) {
                    types[ "[" + _typePrefix + map[i] + "]" ] = map[i];
                }
            } else {
                // source map is an object
                for(i in map) {
                    types[ "[" + _typePrefix + i + "]" ] = map[i];
                }
            }
            return types;
        },

        // translations map used to get real type from native toString method return
        _types = _getTypesMap(["Array", "Boolean", "Date", "Function", "Object", "Number", "RegExp", "String"]),

        // translations map used to convert a value to string literal with special chars protection
        _stringMap = _getIt({
            "\"" : "\\\"",
            "\\" : "\\\\",
            "\t" : "\\t",
            "\b" : "\\b",
            "\f" : "\\f",
            "\n" : "\\n",
            "\r" : "\\r"
        }),

        // string conversion map for some particular types
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
         * Core library entry.
         *
         * @namespace JSC
         */
        JSC = {
            /**
             * Library version.
             *
             * @constant
             * @type String
             */
            version : "0.5.3",

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
             * List of published interfaces.
             *
             * @see JSC.implement
             *
             * @type Object
             */
            Interfaces : {
                /**
                 * Add some methods to handle simple events management : only one handler by event.
                 */
                SimpleEvents : {
                    /**
                     * Set or get an event handler
                     *
                     * @param {String} eventName Name of the related event
                     * @param {Function} eventHandler The related function to call when event occurs
                     * @return {Function|SimpleEvents} Return the event related function in getter mode, or return the current instance in setter mode
                     */
                    on : function(eventName, eventHandler) {
                        eventName = JSC.compose("_on", eventName);
                        if( eventHandler ) {
                            if( JSC.isFunction(eventHandler) ) {
                                this[eventName] = eventHandler;
                            }
                            return this;
                        }
                        return this[eventName];
                    },

                    /**
                     * Remove an event handler
                     *
                     * @param {String} eventName Name of the related event
                     * @return {Function} Returns the removed event handler
                     */
                    off : function(eventName) {
                        eventName = JSC.compose("_on", eventName);
                        var eventHandler = this[eventName];
                        delete this[eventName];
                        return eventHandler;
                    },

                    /**
                     * Fire an event handler
                     *
                     * @param {String} eventName Name of the related event
                     * @return {Object} Returns the event handler result, or undefined
                     */
                    trigger : function(eventName) {
                        eventName = JSC.compose("_on", eventName);
                        return this[eventName] ? this[eventName].apply(this, _arraySlice.call(arguments, 1)) : undefined;
                    }
                },

                /**
                 * Define methods that must be implemented to handle "foreach" behavior
                 */
                Iterable : ["iterator", "each", "filter"]
            },

            /**
             * List of properties added in prototype of each class created with this library
             *
             * @see JSC.create
             *
             * @type Object
             */
            Prototypes : {
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
                attach : function(name, force) {
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
                }
            },

            /**
             * List of static properties added in each class created with this library
             *
             * @see JSC.create
             *
             * @type Object
             */
            Statics : {
                /**
                 * Static method to derive the class to a new one with extended definition
                 *
                 * @see JSC.create
                 *
                 * @param {String} className The name of the new class
                 * @param {Object} defs List of properties to add to class prototype
                 * @return {Function} Returns the class
                 */
                derive : function(className, defs) {
                    return JSC.create.apply(JSC, [this].concat(_arraySlice.call(arguments)));
                },

                /**
                 * Static method to extend the class
                 *
                 * @see JSC.extend
                 *
                 * @param {Object} defs List of properties to add to class prototype
                 * @return {Function} Returns the class
                 */
                extend : function(defs) {
                    JSC.extend(this.prototype, defs);
                    return this;
                },

                /**
                 * Static method to implement an interface on the class
                 *
                 * @see JSC.implement
                 *
                 * @param {Object} defs List of properties to add to class prototype
                 * @param {String} [interfaceName] Optional name for the interface
                 * @return {Function} Returns the class
                 */
                implement : function(defs, interfaceName) {
                    return JSC.implement(this, defs, interfaceName);
                },

                /**
                 * Static method to extend the class with statics members
                 *
                 * @see JSC.extend
                 *
                 * @param {Object} defs List of static properties to add to class
                 * @return {Function} Returns the class
                 */
                statics : function(defs) {
                    return JSC.extend(this, defs);
                },

                /**
                 * Call a method from the class with a particular context
                 *
                 * @param {String} methodName Name of the method to call
                 * @param {Object} [context] Optional context in which call the method (by default use the class)
                 * @return {Object} Returns the method call result
                 */
                method : function(methodName, context) {
                    return (this.prototype[methodName] || JSC.noop).apply(context || this, _arraySlice.call(arguments, 2));
                },

                /**
                 * Static method user to set the class body function
                 *
                 * @param {String|Function} [methodName] Optional name of static method or function to use as body for
                 *                                       the class function. By default, use a simple factory function
                 *                                       that creates instance of the class.
                 * @return {Function} Returns the class
                 */
                self : function(methodName) {
                    this.body = JSC.isString(methodName) ? this[methodName] : methodName || this.getInstance || function() {
                        return new this();
                    };
                    return this;
                },

                /**
                 * Static method used to convert the class to string
                 *
                 * @return {String} By default, returns the name of the class
                 */
                toString : function() {
                  return this.className;
                }
            },

            /**
             * Restore the old value for the library entry point in the global context.
             *
             * @return {Function} Returns the library entry point
             */
            noConflict : function() {
              _globalContext.JSC = _backup;
              return JSC;
            },

            /**
             * Helper used to protect definition by encapsulating it into an anonymous function.
             * The anonymous function receives at least one parameter : library entry point.
             * The extra parameters passed to helper are forwarded to anonymous function.
             *
             * @param {Function} installer The anonymous function wrapping the definition
             * @return {Object} Returns the result of installer function
             */
            helper : function(installer){
                if( JSC.isFunction(installer) ) {
                    // run the installer callback
                    var result = installer.apply(JSC, [JSC].concat(_arraySlice.call(arguments, 1)));

                    // have to export ?
                    if( undefined !== result && result.className ) {
                        JSC.globalize(result);
                    }
                }
                return result;
            },

            /**
             * An empty method to do nothing.
             */
            noop : function() {},

            /**
             * Generate or read unique identifier.
             *
             * @param {Object} [object] Optional object to tag with unique identifier
             * @param {Number} [guid] Optional identifier to set if none were already there
             * @return {Number} The unique identifier
             */
            id : function(object, guid) {
                if( undefined !== object && null !== object ) {
                    return object.guid || (JSC === object ? 0 : (object.guid = guid || ++ _guidCount));
                }
                return guid || ++ _guidCount;
            },

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
            make : function(type, defs, statics, globalize) {
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
                Class = "singleton" === t ? JSC.singleton(d) : "multiton" === t ? JSC.multiton(d) : JSC.create(d);

                // add optional static methods and properties
                s && Class.statics(s);

                // returns the new class, after have globalized it if needed
                return false !== g && Class.className ? JSC.globalize(Class) : Class;
            },

            /**
             * Creates a class with inheritance, polymorphism, overloading, etc.
             * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
             * All created classes implements the "attach" method, which can context attach each method of their instances.
             *
             * @see JSC.Prototypes
             * @see JSC.Statics
             * @see JSC.extend
             * @see JSC.overload
             * @see JSC.implement
             *
             * @param {Function} superClass Reference of the parent class
             * @param {String} className Name of the class to create
             * @param {Object} defs List of properties and methods for the new class
             * @return {Function} Returns the created class
             */
            create : function(superClass, className, defs) {
                // translate parameters
                var a, _className, _superClass, _defs = {}, args = _arraySlice.call(arguments);
                while( args.length ) {
                    a = args.shift();
                    if( a ) {
                        switch( _toString.call(a) ) {
                            // argument is a function, assume it is the parent class
                            case _typeFunction:
                                _superClass = a;
                                break;
                            // argument is a string, assume it is the name of the class
                            case _typeString:
                                _className = a;
                                break;
                            // argument is an aobject, assume it is a list properties
                            case _typeObject:
                                JSC.merge(_defs, a);
                                break;

                        }
                    }
                }

                // set superClass and className if given as separate arguments
                _superClass = _superClass || _defs.superClass;
                _className = _className || _defs.className;

                // build the class initializer
                var Class = function() {
                    var caller = arguments.callee.caller;

                    // called for inheritance ?
                    if( caller === JSC.create ) {
                        return this;
                    }

                    // construction of the instance ?
                    if( this instanceof Class ) {
                        // if the class implements singleton/multiton/factory pattern, instantiation is only allowed from the static method getInstance()
                        Class.getInstance && caller !== Class.getInstance && JSC.error(_directInstanceError, Class);

                        // call delegate constructor if exists
                        this.initialize && this.initialize.apply(this, arguments);
                        return this;
                    }

                    // class used as classical function
                    return Class.body ? Class.body.apply(Class, arguments) : undefined;
                };

                // set the class identity
                JSC.id(Class);
                Class.className = _className || _defaultClassName + Class.guid;

                // is a superClass defined ?
                if( _superClass ) {
                    // load super class
                    _superClass = JSC.loadClass(_superClass) || JSC.error(_unknownClassError.replace("%s", _superClass), "JSC");
                    Class.superClass = _superClass;

                    // process for inheritance
                    Class.prototype = new _superClass();
                    Class.prototype.constructor = Class;
                }

                // prepare interfaces entry and copy inherited ones from optional parent class
                Class.interfaces = _superClass && _superClass.interfaces ? JSC.merge({}, _superClass.interfaces) : {};

                // add default prototype properties
                for(a in JSC.Prototypes) {
                    if( !Class.prototype[a] ) {
                        Class.prototype[a] = JSC.Prototypes[a];
                    }
                }

                // add custom prototype properties
                JSC.extend(Class.prototype, _defs);

                // add statics properties
                return JSC.extend(Class, JSC.Statics);
            },

            /**
             * Creates a singleton class with inheritance, polymorphism, overloading, etc.
             * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
             * All created classes implements the "attach" method, that can context attach each method of its instances.
             *
             * Throws an error if the returned class is directly instantiated.
             *
             * @see JSC.create
             * @see JSC.Prototypes
             * @see JSC.Statics
             * @see JSC.extend
             * @see JSC.overload
             * @see JSC.implement
             *
             * @param {String} className Name of the singleton class to create
             * @param {Object} defs List of properties and methods for the new singleton class
             * @return {Function} Created singleton class
             */
            singleton : function(className, defs) {
                // build the class initializer and extend the new class with default behaviors
                var instance, Class = JSC.create(className, defs);

                // add static instance getter
                Class.getInstance = function() {
                    if( undefined === instance ) {
                        instance = new Class();
                    }
                    return instance;
                };

                // return the class after setting its body function as factory
                return Class.self();
            },

            /**
             * Creates a multiton class with inheritance, polymorphism, overloading, etc.
             * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
             * All created classes implements the "attach" method, that can context attach each method of its instances.
             *
             * Throws an error if the returned class is directly instantiated.
             *
             * @see JSC.create
             * @see JSC.Prototypes
             * @see JSC.Statics
             * @see JSC.extend
             * @see JSC.overload
             * @see JSC.implement
             *
             * @param {String} className Name of the multiton class to create
             * @param {Object} defs List of properties and methods for the new multiton class
             * @return {Function} Created multiton class
             */
            multiton : function(className, defs) {
                // build the class initializer and extend the new class with default behaviors
                var instances = {}, Class = JSC.create(className, defs);

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
                    var context = (this.className || "[unknownClass]") + "." + (name || "[unknownMethod]");
                    JSC.error(_abstractCallError.replace("%s", context), context);
                };
                fn._abstract = true;
                return fn;
            },

            /**
             * Wraps an overriding method that call overloaded version.
             * If a wrap function is built to handle inheritance, this function will be tagged with "inheritance" attribute,
             * set with boolean value "true".
             *
             * @param {Function} method Reference of the overriding method
             * @param {Object} oldMethod Reference of the overloaded method
             * @returns {Function} Return the wrap method containing overload process
             */
            overload : function(method, oldMethod) {
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
                    wrap._overload = true;
                    JSC.id(wrap, JSC.id(method));
                    return wrap;
                }
                return method;
            },

            /**
             * Call a method from another class with a particular context
             *
             * @param {Function} Class
             * @param {String} methodName
             * @param {Object} context
             * @return {Object} Returns the result of the call
             */
            method : function(Class, methodName, context) {
                // ensure to get a real class
                Class = JSC.loadClass(Class) || JSC.error(_unknownClassError.replace("%s", Class), "JSC");

                // get the needed method from the given class, then call it with the given context and parameters
                return (Class.prototype[methodName] || JSC.noop).apply(context || Class, _arraySlice.call(arguments, 3));
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
                    wrap = fn[context];
                    context = fn;
                    fn = wrap;
                }

                // need at least a function to attach
                fn = JSC.isFunction(fn) ? fn : JSC.noop;

                // produce a context attached function
                var args = _arraySlice.call(arguments, 2), wrap = function() {
                    return fn.apply(context, args.concat(_arraySlice.call(arguments)));
                };
                wrap._attached = true;

                // affect unique ID
                JSC.id(wrap, fn ? JSC.id(fn) : undefined);

                // and there is a context attached function...
                return wrap;
            },

            /**
             * Add methods and attributes to an existent class definition.
             * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
             *
             * @see JSC.overload
             *
             * @param {Object} proto The class definition to extend (in most cases, the class prototype)
             * @param {Object} defs List of properties and methods to add to the class definition
             * @return {Object} Return the class definition
             */
            extend : function(proto, defs) {
                // add methods and attributes
                if( proto ) {
                    for(var name in defs) {
                        if( name !== "className" && name !== "superClass" && _hasOwn.call(defs, name) ) {
                            proto[name] = JSC.overload(defs[name], proto[name]);
                        }
                    }
                }
                return proto;
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
             * @see JSC.overload
             * @see JSC.abstractMethod
             *
             * @param {Function} Class The class to extend with interface
             * @param {Object|Array} defs List of properties and methods of interface to add to the class
             * @param {String} [interfaceName] Optional name of the interface to implement (can be also set into defs)
             * @return {Function} Return the class
             */
            implement : function(Class, defs, interfaceName) {
                var i, method;

                if( Class && Class.prototype ) {
                    // inverted order for name and defs...
                    if( JSC.isString(defs)) {
                        i = interfaceName;
                        interfaceName = defs;
                        defs = i;
                    }

                    // try to load interface from registered ones if needed
                    if( interfaceName && !defs ) {
                        defs = JSC.Interfaces[interfaceName];
                    }

                    // implement all attributes listed in interface, when defined
                    if( defs ) {
                        // different behavior if definitions list is an array or an object
                        if( JSC.isArray(defs) ) {
                            // for array, each item is the name of method signature
                            // build an abstract method if the method does not exist into class definition
                            for(i = 0; i < defs.length; i++) {
                                method = defs[i];
                                if( undefined === Class.prototype[method] ) {
                                    Class.prototype[method] = JSC.abstractMethod(method);
                                }
                            }
                        } else {
                            // get name for this interface
                            interfaceName = interfaceName || defs.className;

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
                    if( interfaceName ) {
                        Class.interfaces = Class.interfaces || {};
                        Class.interfaces[interfaceName] = true;
                    }
                }
                return Class;
            },

            /**
             * Get the class name of an object or a class.
             *
             * @param {Object|Function} object The object or class from which get the class name
             * @return {String} Return the class name, or undefined if no instance
             */
            getClassName : function(object) {
                if( object ) {
                    // is a class ?
                    if( object.className ) {
                        return object.className;
                    }
                    // is an instance ?
                    if( object.constructor ) {
                        return object.constructor.className;
                    }
                }
                // no instance or class
                return undefined;
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
             * Get the name of parent class for an object or a class.
             *
             * @param {Object|Function} object The object or class from which get the name of parent class
             * @return {String} Return the name of parent class, or undefined if no instance
             */
            getSuperClassName : function(object) {
                object = JSC.getSuperClass(object);
                return object ? object.className : undefined;
            },

            /**
             * Get the parent class for an object or a class.
             *
             * @param {Object|Function} object The object or class from which get the parent class
             * @return {Function} Return the parent class
             */
            getSuperClass : function(object) {
                if( object ) {
                    // is a class ?
                    if( object.superClass ) {
                        return object.superClass;
                    }
                    // is an instance ?
                    if( object.constructor ) {
                        return object.constructor.superClass;
                    }
                }
                // no instance or class
                return undefined;
            },

            /**
             * Check if an object is an instance of a particular class or interface.
             *
             * @param {Object} object Object to check
             * @param {Function|String} Class Name of interface or Class to compare with instance
             * @return {Boolean} Return true if the given object is an instance of the class or interface
             */
            instanceOf : function(object, Class) {
                if( object && Class ) {
                    // get list of implemented interfaces
                    var interfaces = object.constructor && object.constructor.interfaces ? object.constructor.interfaces : object.interfaces || _voidO,
                        objectClassName = object.className, className;

                    // name of class or interface
                    if( JSC.isString(Class) ) {
                        // try to find class from implemented interfaces
                        if( interfaces[Class] || objectClassName === Class ) {
                            return true;
                        }

                        // try to load the class from global context
                        Class = JSC.getClass(Class);
                    }

                    // no class, no instance
                    if( !Class ) {
                        return false;
                    }
                    className = Class.className;

                    // check direct instance or interface
                    if( interfaces[className] || objectClassName === className ) {
                        return true;
                    }

                    // otherwise, it may be an indirect instance
                    return JSC.isFunction(Class) ? object instanceof Class : false;
                }
                return false;
            },

            /**
             * Get real type or class name of a given value.
             *
             * @param {Object} object Value from which get the type
             * @return {String} Type or class name of the value
             */
            type : function(object) {
                // zero-like value ?
                if( null == object ) {
                    return String(object);
                }

                // class created with this library ?
                if( object.className ) {
                    return object.className;
                }

                // instance of class created with this library ?
                if( object.constructor && object.constructor.className ) {
                    return object.constructor.className;
                }

                // detect type by object definition
                var string = _toString.call(object);
                return _types[string] || (_types[string] = (string.match(_reType) || [0, "Object"])[1]);
            },

            /**
             * Check if an object is a function.
             *
             * @param {Object} o Object to test
             * @return {Boolean} Return true if the given object is a function
             */
            isFunction : function(o) {
                return o && _typeFunction === _toString.call(o) ? true : false;
            },

            /**
             * Check if an object is a class definition.
             *
             * @param {Object} o Object to test
             * @return {Boolean} Return true if the given object is a class definition
             */
            isClass : function(o) {
                return o && o.className && _typeFunction === _toString.call(o) ? true : false;
            },

            /**
             * Check if an object is a class instance.
             *
             * @param {Object} o Object to test
             * @return {Boolean} Return true if the given object is a class instance
             */
            isInstance : function(o) {
                return o && o.constructor && o.constructor.className ? true : false;
            },

            /**
             * Check if a function is abstract.
             *
             * @param {Function} fn Function to test
             * @return {Boolean} Return true if the given function is abstract
             */
            isAbstract : function(fn) {
                return fn && fn._abstract ? true : false;
            },

            /**
             * Check if a function is an attached version.
             *
             * @param {Function} fn Function to test
             * @return {Boolean} Return true if the given function is an attached version
             */
            isAttached : function(fn) {
                return fn && fn._attached ? true : false;
            },

            /**
             * Check if a function use inheritance.
             *
             * @param {Function} fn Function to test
             * @return {Boolean} Return true if the given function use inheritance
             */
            isOverloaded : function(fn) {
                return fn && fn._overload ? true : false;
            },

            /**
             * Check if an object or function has been added/altered by a plugin.
             *
             * @param {Object|Function} fn Function to test
             * @return {Boolean} Return true if the given orbject or function has been added/altered by a plugin
             */
            isPlugin : function(fn) {
                return fn && fn._plugin ? true : false;
            },

            /**
             * Check if an object is an array.
             *
             * @param {Object} o Object to test
             * @return {Boolean} Return true if the given object is an array
             */
            isArray : Array.isArray || function(o) {
                return o && _typeArray === _toString.call(o) ? true : false;
            },

            /**
             * Check if a value is an object.
             *
             * @param {Object} o Value to test
             * @return {Boolean} Return true if the given value is an object
             */
            isObject : function(o) {
                return o && _typeObject === _toString.call(o) ? true : false;
            },

            /**
             * Check if an object is empty.
             *
             * @param {Object} object Object to test
             * @return {Boolean} Return true if the given object is empty
             */
            isEmptyObject : function(object) {
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
            },

            /**
             * Check if an object is a string.
             *
             * @param {Object} o Object to test
             * @return {Boolean} Return true if the given object is a string
             */
            isString : function(o) {
                return _voidS === o || (o && _typeString === _toString.call(o)) ? true : false;
            },

            /**
             * Check if an object is a boolean.
             *
             * @param {Object} o Object to test
             * @return {Boolean} Return true if the given object is a boolean
             */
            isBool : function(o) {
                return false === o || (o && _typeBoolean === _toString.call(o)) ? true : false;
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
             * Check if a string is a HTML code
             *
             * @param {String} text The string to check
             * @return {Boolean} Return true if the given text is HTML
             */
            isHTML : function(text) {
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
            },

            /**
             * Check if a string is a CSS selector
             *
             * @param {String} text
             * @return {Boolean} Return true if the given text is a CSS selector
             */
            isSelector : function(text) {
                if( JSC.isString(text) ) {
                    var match = _reCSS.exec(text.trim());
                    return match && match[0] ? true : false;
                }
                return false;
            },

            /**
             * Check if a string is a valid URL
             *
             * @param {String} text
             * @return {Boolean} Return true if the given text is a valid URL
             */
            isURL : function(text) {
                if( JSC.isString(text) ) {
                    var match = _reURL.exec(text.trim());
                    return match && match[0] ? true : false;
                }
                return false;
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
            jsonEncode : function(o) {
                o = JSC.jsonData(o);
                return undefined !== o ? JSC.toString(o) : _voidS;
            },

            /**
             * Parse and evaluate a string as a JSON representation.
             *
             * @param {String} s The string containing JSON data
             * @return {Object} Return JSON data evaluated or null if error
             */
            jsonDecode : function(s) {
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
            },

            /**
             * Compose a name from the given parts. Camelize the result name by parts.
             *
             * @param {String} text The first part of the name, other arguments will be appended
             * @return {String} Returns the composed name from the given arguments
             */
            compose : function(text) {
                var i, part;
                text = text || "";
                for(i = 1; i < arguments.length; i++) {
                    part = "" + arguments[i];
                    text += part.charAt(0).toUpperCase() + part.substr(1);
                }
                return text;
            },

            /**
             * Convert an undescore formatted name to camel case format.
             * Ex: "to_lower_case" => "toLowerCase"
             *
             * @param {String} text The string to format
             * @param {Boolean} all When true, force all first letters to upper case
             * @return {String} Return the formatted string
             */
            camelize : function(text, all) {
                text = (_voidS + (undefined === text ? _voidS : text)).replace(_reUndescore, function(substr, $1, $2){
                    return $1 + $2.toUpperCase();
                });
                return all ? text.charAt(0).toUpperCase() + text.substr(1) : text;
            },

            /**
             * Convert a camel case formatted name to undescore format.
             * Ex: "toLowerCase" => "to_lower_case"
             *
             * @param {String} text The string to format
             * @param {Boolean} toLowerCase When true, force text to lower case
             * @return {String} Return the formatted string
             */
            underscore : function(text, toLowerCase) {
                text = (_voidS + (undefined === text ? _voidS : text)).replace(_reCamelCase, "$1_$2");
                return toLowerCase ? text.toLowerCase() : text;
            },

            /**
             * Protect all special chars in a string to use it as part of a RegExp
             *
             * @param {String} text The string to format
             * @return {String} Return the formatted string
             */
            regex : function(text) {
                return (_voidS + (undefined === text ? _voidS : text)).replace(_reNotText, "\\$1");
            },

            /**
             * Throw an error.
             *
             * @see JSC.Error
             *
             * @param {String} msg Error message
             * @param {Object} [context] Optional error context
             * @throws Exception
             */
            error : function(msg, context) {
                throw new JSC.Error(msg, context);
            },

            /**
             * Export a variable to global context, or remove it.
             *
             * @param {String} name Name of exported variable in global context
             * @param {Object} value Value to export. If undefined, remove the value.
             * @return {Object} Return the exported or removed value
             */
            globalize : function(name, value) {
                // name is no given, assume it from "className" attribute (useful for classes)
                if( name && !JSC.isString(name) && undefined === value ) {
                    value = name;
                    name = name.className;
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
            },

            /**
             * Get a variable from global context.
             *
             * @param {String} name Name of variable to get from global context
             * @return {Object} Value of the global variable, or undefined
             */
            global : function(name) {
                return _breakIntoGlobal((_voidS + name).split("."));
            },

            /**
             * Sort an array of objects by specified keys.
             *
             * @param {Array} array The array to sort
             * @param {Array} keys The list of sort keys
             * @param {Boolean} trim Flag to enable removing of null/undefined entries
             * @return {Array} Return the sorted array
             */
            sort : function(array, keys, trim) {
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
                            if( undefined !== s ) {
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
             * @param {Object|Array} object Object or Array to iterate
             * @param {Function|String} walk Function or, when each processed item or property is an object, name of a method
             *                               into this object. Function receive three parameters : the index of the processed
             *                               item or property, the item or property itself, and the source object or array. When
             *                               a method's name is given, no parameter is sent, unless extra parameters are given.
             * @return {Object|Array} Return the given object or array
             */
            each : function(object, walk) {
                var i, args, method, entry, isArray = JSC.isArray(object);
                if( object && walk ) {
                    // particular handling for Iterable instances
                    if( JSC.instanceOf(object, "Iterable") ) {
                        return object.each.apply(object, arguments);
                    }

                    // different processing if the walk method is a function or a method's name
                    if( JSC.isFunction(walk) ) {
                        // function given, apply it on each entries of the given object
                        if( isArray ) {
                            // process an array
                            for(i = 0; i < object.length; i++) {
                                entry = object[i];
                                walk.call(entry, i, entry, object);
                            }
                        } else {
                            // process an object
                            for(i in object) {
                                entry = object[i];
                                walk.call(entry, i, entry, object);
                            }
                        }
                    } else {
                        // name of method given, extract extra parameters
                        args = _arraySlice.call(arguments, 2);
                        if( isArray ) {
                            // process each item of the array and call the inner method
                            for(i = 0; i < object.length; i++) {
                                entry = object[i];
                                method = entry[walk];
                                JSC.isFunction(method) && method.apply(entry, args);
                            }
                        } else {
                            // process each property of the object and call the inner method
                            for(i in object) {
                                entry = object[i];
                                method = entry[walk];
                                JSC.isFunction(method) && method.apply(entry, args);
                            }
                        }
                    }
                }
                return object;
            },

            /**
             * Filter values from an object or an array.
             *
             * @param {Object|Array} object Object from which extract the values
             * @param {Function|RegExp|Object} filter The filter callback
             * @param {String} [filterMethod] Optional name of the filter method when the filter is an object (default: filter)
             * @return {Object|Array} Return an object with the filtered values
             */
            filter : function(object, filter, filterMethod) {
                var i, isArray = JSC.isArray(object), result = isArray ? [] : {};
                if( object ) {
                    // particular handling for Iterable instances
                    if( JSC.instanceOf(object, "Iterable") ) {
                        return object.filter.apply(object, arguments);
                    }

                    // detect the filter mode
                    switch( JSC.type(filter) ) {
                        // the filter is a function, apply it on each entries of the given object
                        case "Function":
                            // different processing if the object is an array or not
                            if( isArray ) {
                                // received an array, filter its items
                                for(i = 0; i < object.length; i++) {
                                    if( filter.call(object, i, object[i], object) ) {
                                        result.push(object[i]);
                                    }
                                }
                            } else {
                                // received an object, filter its properties
                                for(i in object) {
                                    if( filter.call(object, i, object[i], object) ) {
                                        result[i] = object[i];
                                    }
                                }
                            }
                            break;

                        // the filter is a regex, apply it on each entry names or each entry value according to object's type
                        case "RegExp":
                            // different processing if the object is an array or not
                            if( isArray ) {
                                // received an array, filter its items
                                for(i = 0; i < object.length; i++) {
                                    if( filter.test("" + object[i]) ) {
                                        result.push(object[i]);
                                    }
                                }
                            } else {
                                // received an object, filter its properties
                                for(i in object) {
                                    if( filter.test(i) ) {
                                        result[i] = object[i];
                                    }
                                }
                            }
                            break;

                        // the filter is an object, it must contain a 'filter' method
                        case "Object":
                            // need a filter method
                            filterMethod = filterMethod || "filter";
                            if( !JSC.isFunction(filterMethod) ) {
                                filterMethod = filter[filterMethod];
                            }
                            if( JSC.isFunction(filterMethod) ) {
                                // different processing if the object is an array or not
                                if( isArray ) {
                                    // received an array, filter its items
                                    for(i = 0; i < object.length; i++) {
                                        if( filterMethod.call(filter, i, object[i], object) ) {
                                            result.push(object[i]);
                                        }
                                    }
                                } else {
                                    // received an object, filter its properties
                                    for(i in object) {
                                        if( filterMethod.call(filter, i, object[i], object) ) {
                                            result[i] = object[i];
                                        }
                                    }
                                }
                            }

                            break;

                        // for all other values, assume them as boolean and returns all object's entries if true, or none if false
                        default:
                            filter && JSC.merge(result, object);
                    }
                }
                return result;
            },

            /**
             * Get the properties added on the go for the given object (not herited).
             *
             * @param {Object} object Object from which extract the "on the go" properties
             * @return {Object} Return a new object that contains the "on the go" properties of given object
             */
            owned : function(object) {
                var name, result = {};
                if( object ) {
                    for(name in object) {
                        if( _hasOwn.call(object, name) ) {
                            result[name] = object[name];
                        }
                    }
                }
                return result;
            },

            /**
             * Check if a plugin is installed on the library
             *
             * @param {Number|String|Object} plugin The plugin identifier. It can be either the GUID, a name, or the plugin itself
             * @return {Boolean} Return true if the plugin is installed
             */
            isInstalled : function(plugin) {
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
                            guid = plugin.pluginName || JSC.id(plugin);
                        }
                    } else {
                        // the given value is a plugin's GUID
                        guid = plugin;
                    }
                }

                // check the GUID
                return !guid || _plugins[guid] ? true : false;
            },

            /**
             * Install a plugin on the library
             *
             * @param {Object} plugin A descriptor object for the plugin. It must contain the name of plugin into
             *                        the field 'pluginName', and the list of all plugin's properties.
             *                        On first level (i.e. the entries directly injected into JSC)
             *                        only objects and functions are allowed.
             * @return {Number} Return the GUID of the installed plugin, or 0 if the plugin cannot be installed
             */
            install : function(plugin) {
                var pluginName, name, plug, old, descriptor, guid = 0;

                // a descriptor object is needed, with name of the plugin
                if( JSC.isObject(plugin) && plugin.pluginName ) {
                    // get the plugin's identity
                    pluginName = plugin.pluginName;
                    guid = JSC.id(plugin);

                    // check if it is already installed
                    if( guid && !_plugins[pluginName] ) {
                        // store plugin installation descriptor
                        _plugins[guid] = _plugins[pluginName] = descriptor = {};
                        descriptor.pluginName = pluginName;
                        descriptor.guid = guid;

                        // process to plugin injection
                        for(name in plugin) {
                            // ignore name of plugin and GUID
                            if( "pluginName" !== name && "guid" !== name ) {
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
                                                JSC[name] = JSC.extend(old, plug);
                                            }
                                        } else if( JSC.isObject(old) ) {
                                            // the target and the plugin entries are both objects : merge target to plugin
                                            JSC[name] = JSC.extend(plug, old);
                                        } else {
                                            // target is not object or function, do just a straight copy
                                            JSC[name] = plug;
                                        }
                                    } else {
                                        // target does not exist, do just a straight copy
                                        JSC[name] = plug;
                                    }

                                    // ensure that the added/altered entry has plugin tag
                                    JSC[name]._plugin = guid;
                                }
                            }
                        }
                    }
                }
                return guid;
            },

            /**
             * Uninstall a plugin from the library
             *
             * @param {Number|String|Object} plugin The plugin identifier. It can be either the GUID, a name, or the plugin itself
             * @return {Boolean} Return true if the plugin is uninstalled
             */
            uninstall : function(plugin) {
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
                            guid = plugin.pluginName || JSC.id(plugin);
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
                            // ignore name of plugin and GUID
                            if( "pluginName" !== name && "guid" !== name ) {
                                // restore previous value if exist or simply delete the new one
                                if( undefined !== plugin[name] ) {
                                    JSC[name] = plugin[name];
                                } else {
                                    delete JSC[name];
                                }
                            }
                        }

                        // delete plugin's descriptor entries
                        delete _plugins[plugin.pluginName];
                        delete _plugins[plugin.guid];
                    } else {
                        // no plugin found, cannot uninstall
                        guid = 0;
                    }
                }

                // check the GUID
                return guid ? true : false;
            }
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
    JSC.Error = JSC.create(Error, "Error", {
       initialize : function(message, context) {
           this.message = message || _defaultError;
           this.context = context;
       }
    });

    // ensure existence of String.trim()
    if( !(_voidS.trim) ) {
        String.prototype.trim = function() {
            return this.replace(_reTrim, _voidS);
        };
    }

    var
        // load the "localStorage" entry, or stash its absence by a dummy object
        _localData = localStorage || {},

        // extract or create method to read a value from localStorage
        _getItem = _localData.getItem || function(name) {
            return this[name];
        },

        // extract or create method to write a value to localStorage
        _setItem = _localData.setItem || function(name, value) {
            this[name] = value;
        },

        // extract or create method to remove a value from localStorage
        _removeItem = _localData.removeItem || function(name) {
            undefined !== this[name] && delete this[name];
        },

        /**
         * Class definition with multiton pattern to wrap access to localStorage
         */
        LocalStorage = {
            /**
             * Name of class
             *
             * @type String
             */
            className : "LocalStorage",

            /**
             * Init the localStorage wrapper.
             *
             * @param {String} name Name of the entry point in the local storage. By default use the library name (JSC).
             */
            initialize : function(name) {
                this.name = name || this.name;
                this.load();
                localStorage && this.bindEvent(globalContext, "unload", JSC.attach(this, "store"));
            },

            /**
             * Load data from local storage
             *
             * @return {JSC.localStorage} Plugin entry point
             */
            load : function() {
                this.data = JSC.jsonDecode(_getItem.call(_localData, this.name)) || {};
            },

            /**
             * Store all the data from the wrapper to local storage
             *
             * @return {JSC.localStorage} Plugin entry point
             */
            store : function(){
                if( JSC.isEmptyObject(this.data) ) {
                    _removeItem.call(_localData, this.name);
                } else {
                    _setItem.call(_localData, this.name, JSC.jsonEncode(this.data));
                }
            },

            /**
             * Set data to local storage wrapper.
             *
             * @param {String} name Name of the entry to set
             * @param {Object} data Data to set in the entry
             * @return {JSC.localStorage} Plugin entry point
             */
            set : function(name, data) {
                this.data[name] = data;
                return this;
            },

            /**
             * Get data from local storage wrapper.
             *
             * @param {String} name Name of the entry to get
             * @return {Object} Return the data from the entry
             */
            get : function(name) {
                return this.data[name];
            },

            /**
             * Remove an entry from local storage wrapper.
             *
             * @param {String} name Name of the entry to remove
             * @return {Object} Return the removed data
             */
            remove : function(name) {
                var data = this.data[name];
                undefined !== data && delete this.data[name];
                return data;
            },

            /**
             * Erase all the data in the local storage wrapper.
             *
             * @return {JSC.localStorage} Plugin entry point
             */
            clear : function() {
                this.data = {};
                return this;
            },

            /**
             * Bind an event handler on an element for particular event name
             *
             * @param {Element} element Element on which bind the event
             * @param {String} eventName Name of the event to bind
             * @param {Function} eventHandler Handler to call when event is fired
             */
            bindEvent : function(element, eventName, eventHandler) {
                if( element.addEventListener ) {
                    element.addEventListener(eventName, eventHandler, false);
                } else if( element.attachEvent ) {
                    element.attachEvent("on" + eventName, eventHandler);
                }
            },

            /**
             * Name of the data set in local storage
             *
             * @type String
             */
            name : JSC.className,

            /**
             * Data set
             *
             * @type Object
             */
            data : null
        };

    // build and declare the class
    JSC.localStorage = JSC.multiton(LocalStorage);

    var
        // default error template used when an error occurs
        _errorTemplate = '<div class="error">An error has occurred !</div>',

        // void jQuery selection
        _voidJQ = $();

    /**
     * Class to handle HTML templating from JavaScript
     */
    JSC.Template = JSC.create({
        /**
         * Name of the class
         *
         * @constant
         * @type String
         */
        className : "Template",

        /**
         * Delegate constructor
         *
         * @constructor
         * @param {String} template A DOM identifier to load HTML fragment as a template, an HTML code, or an URL to get template
         */
        initialize : function(template) {
            this.renderTo = [];
            this.modifiers = {};
            this.postProcessors = {};
            template && this.load(template);
        },

        /**
         * Loads a template
         *
         * @param {String} template A DOM identifier to load HTML fragment as a template, an HTML code, or an URL to get template
         * @return {Template} Return the instance for chaining
         */
        load : function(template) {
            this.template = "";
            this.loaded = false;

            // load html from a known DOM element when selector is given...
            if( JSC.isString(template) ) {
                if( JSC.isHTML(template) ) {
                    // template is HTML, just copy
                    this.template = template;
                    this.loaded = true;
                } else if( JSC.isSelector(template) ) {
                    // template is a CSS selector, load related content
                    this.template = $(template).html();
                    this.loaded = true;
                } else if( JSC.isURL(template) ) {
                    // otherwise template is an URL, load it with AJAX
                    $.ajax({
                        url: template,
                        cache: false,
                        dataType: "text",
                        error: this.attach("_ajaxTemplateError"),
                        success: this.attach("_ajaxTemplateSuccess")
                    });
                    return this;
                } else {
                    // unknown format, assume error
                    this.template = this.errorTemplate;
                    this.loaded = true;
                }
            } else if( template && template.jquery ) {
                // template is a jQuery selection, load related content
                this.template = template.html();
                this.loaded = true;
            } else {
                // unknown format, assume error
                this.template = this.errorTemplate;
                this.loaded = true;
            }

            // compile template when loaded, fire optional triggers
            if( this.loaded ) {
                this.template = this.trigger("load", this.template, template, this) || this.template;
                this.compile();
                this.nodes = this.trigger("loaded", this.nodes, this.template, this) || this.nodes;
            }
            return this;
        },

        /**
         * Renders the loaded template
         *
         * @param {Object} data The dataset used to fill the template, or an URL to get data
         * @param {String|jQuery} [renderTo] Entry point in which render the template
         * @param {Boolean} [clean] Flag that force cleanning of the entry point
         * @return {Template|jQuery} Return the instance for chaining or filled elements when no entry point was given
         */
        render : function(data, renderTo, clean) {
            data = data || {};

            // process the render when entry point is given
            if( renderTo ) {
                // assume that the entry point is a jQuery selection
                renderTo = renderTo.jquery ? renderTo : $(renderTo);
                clean = clean ? true : false;

                // need to load distant data ?
                if( JSC.isString(data) ) {
                    if( JSC.isURL(data) ) {
                        // data is an URL, load it with AJAX
                        $.ajax({
                            url: data,
                            cache: false,
                            dataType: "json",
                            error: JSC.attach(this, "_ajaxDataError", renderTo, clean),
                            success: JSC.attach(this, "_ajaxDataSuccess", renderTo, clean)
                        });
                        return this;
                    } else {
                        // the dataset format is unknown, try to eval as JSON...
                        data = JSC.jsonDecode(data) || [];
                    }
                }

                // add descriptor for in-time rendering
                this.renderTo.push({
                    place : renderTo,
                    data : data,
                    clean : clean
                });

                // render and inject the filled template in given entry point if the template is already loaded
                // otherwise, il will be rendered when loaded
                return this.inject();
            }

            // no entry point given, just renders the template in memory and returns the result
            return this.compose(data);
        },

        /**
         * Fills the loaded template with data and renders it in each registered entry point
         *
         * @return {Template} Return the instance for chaining
         */
        inject : function() {
            if( this.loaded ) {
                // process each render registry
                while( this.renderTo.length ) {
                    // extract and remove one render registry
                    var nodes, entry = this.renderTo.splice(0, 1)[0];

                    // clean entry point when needed
                    entry.clean && entry.place.empty();

                    // do the rendering and fire optional trigger
                    nodes = this.compose(entry.data);
                    nodes = this.trigger("render", nodes, entry.data, this) || nodes;
                    entry.place.append(nodes);
                    this.trigger("append", entry.place, nodes, entry.data, this);
                }
            }
            return this;
        },

        /**
         * Callback used to handle errors while load a template with AJAX
         *
         * @private
         * @param {jqXHR} jqXHR Transport object
         * @param {String} textStatus A string describing the type of error that occurred
         * @param {String} errorThrown Optional exception object
         */
        _ajaxTemplateError : function(jqXHR, textStatus, errorThrown) {
            var template = this.errorTemplate;
            template = this.trigger("error", template, textStatus, jqXHR, errorThrown, this) || template;
            this.load(template).loaded && this.inject();
        },

        /**
         * Callback used to handle a template got with an AJAX loading
         *
         * @private
         * @param {String} template The received template
         * @param {String} textStatus A string describing the status
         * @param {jqXHR} jqXHR Transport object
         */
        _ajaxTemplateSuccess : function(template, textStatus, jqXHR) {
            template = this.trigger("success", template, textStatus, jqXHR, this) || template;
            this.load(template).loaded && this.inject();
        },

        /**
         * Callback used to handle errors while load a dataset with AJAX
         *
         * @private
         * @param {String|jQuery} [renderTo] Entry point in which render the template
         * @param {Boolean} [clean] Flag that force cleanning of the entry point
         * @param {jqXHR} jqXHR Transport object
         * @param {String} textStatus A string describing the type of error that occurred
         * @param {String} errorThrown Optional exception object
         */
        _ajaxDataError : function(renderTo, clean, jqXHR, textStatus, errorThrown) {
            var template = this.errorTemplate;
            template = this.trigger("dataError", renderTo, clean, textStatus, jqXHR, errorThrown, this) || template;
            if( renderTo ) {
                clean && renderTo.empty();
                renderTo.append($(template));
            }
        },

        /**
         * Callback used to handle a dataset got with an AJAX loading
         *
         * @private
         * @param {String|jQuery} [renderTo] Entry point in which render the template
         * @param {Boolean} [clean] Flag that force cleanning of the entry point
         * @param {String} data The received dataset
         * @param {String} textStatus A string describing the status
         * @param {jqXHR} jqXHR Transport object
         */
        _ajaxDataSuccess : function(renderTo, clean, data, textStatus, jqXHR) {
            data = this.trigger("dataSuccess", data, renderTo, clean, textStatus, jqXHR, this) || data;
            this.render(data, renderTo, clean);
        },

        /**
         * Compiles the loaded template
         *
         * @return {Template} Return the instance for chaining
         */
        compile : function() {
            this.nodes = this.template ? $(this.template) : _voidJQ;
            return this;
        },

        /**
         * Get a copy of the template
         *
         * @return {jQuery} Return a copy of the template
         */
        cloneTemplate : function() {
            if( this.nodes && this.nodes.length ) {
                return this.nodes.clone();
            }
            return _voidJQ;
        },

        /**
         * Fill the loaded template with data and returns the generated HTML code
         *
         * @param {Object} data The dataset from which get values
         * @param {jQuery} [nodes] The elements tree in which fill the values
         * @param {boolean} [isGlobal] Internal use only - Flag to indicate that the template is on global level
         * @return {jQuery} The rendered elements
         */
        compose : function(data, nodes, isGlobal) {
            var i, template, fragment, blocks, value, that = this;

            // assume arguments
            data = data || [];
            isGlobal = isGlobal || !nodes;
            nodes = nodes || this.cloneTemplate();

            // different processing according to type of the given dataset
            if( JSC.isArray(data) ) {
                // find optional sub-template
                template = nodes.find('[data-context="template"]');
                if( template.length ) {
                    // sub-template found, process it with the given dataset
                    template.each(function(){
                        var element = $(this);
                        element.append(that.compose(data, element.children().remove(), isGlobal));
                    });
                } else if( nodes.length ) {
                    // apply each data entry on a clone of the template and add the result to a rendering pool
                    blocks = _voidJQ;
                    for(i = 0; i < data.length; i++) {
                        // get a clone of the template and fill it with data
                        fragment = this.compose(data[i], i + 1 < data.length ? nodes.clone() : nodes);

                        // do a post process on the rendered template
                        isGlobal && this.globalPostProcess(fragment, data[i]);

                        // add the rendered template to the rendering pool
                        blocks = blocks.add(fragment);
                    }
                    nodes = blocks;
                }
            } else {
                // apply each data value on placeholders in the template
                for(i in data) {
                    value = this.modifiedData(i, data);
                    fragment = nodes.find('[data-name="' + i + '"]');

                    // different rendering according to type of the value
                    if( JSC.isArray(value) ) {
                        // special processing for array values : replace content in template by composed version
                        fragment.each(function(){
                            var element = $(this);
                            element.append(that.compose(value, element.children().remove()));
                        });
                    } else {
                        // just fill the placeholder with the related data
                        fragment.html(value);
                    }

                    // do a post process on the rendered fragment
                    this.postProcess(i, fragment, data);
                }

                // do a post process on the rendered template
                isGlobal && this.globalPostProcess(nodes, data);
            }
            return nodes;
        },

        /**
         * Get particular value from dataset, after related modifier has been applied on
         *
         * @param {String} name The name of the needed value
         * @param {Object} data The dataset from which get values
         * @return {Object} Return the modified value
         */
        modifiedData : function(name, data) {
            if( JSC.isFunction(this.modifiers[name]) ) {
                return this.modifiers[name].call(this, data[name], name, data, this);
            }
            return data[name];
        },

        /**
         * Do an optional post processing on the rendered fragment
         *
         * @param {String} name The name of the needed value
         * @param {jQuery} fragment The rendered fragment
         * @param {Object} data The related dataset
         * @return {jQuery} Return the modified fragment
         */
        postProcess : function(name, fragment, data) {
            if( JSC.isFunction(this.postProcessors[name]) ) {
                this.postProcessors[name].call(this, fragment, data, name, this);
            }
            return fragment;
        },

        /**
         * Do an optional post processing on the rendered template
         *
         * @param {jQuery} template The rendered template
         * @param {Object} data The related dataset
         * @return {jQuery} Return the modified fragment
         */
        globalPostProcess : function(template, data) {
            if( JSC.isFunction(this.globalPostProcessor) ) {
                this.globalPostProcessor.call(this, template, data, this);
            }
            return template;
        },

        /**
         * Set the list of modifiers used to handle formatting of particular data
         *
         * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
         *
         * @param {Object} modifiers The new list of modifiers
         * @return {Template} Return the instance for chaining
         */
        setModifiers : function(modifiers) {
            if( JSC.isObject(modifiers) ) {
                this.modifiers = modifiers;
            }
            return this;
        },

        /**
         * Get the list of modifiers used to handle formatting of particular data
         *
         * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
         *
         * @return {Object} The list of modifiers
         */
        getModifiers : function() {
            return this.modifiers;
        },

        /**
         * Set a particular data modifier
         *
         * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
         *
         * @param {String} name The name of data for which set the modifier
         * @param {Function} modifier The new modifier
         * @return {Template} Return the instance for chaining
         */
        setModifier : function(name, modifier) {
            if( JSC.isFunction(modifier) ) {
                this.modifiers[name] = modifier;
            }
            return this;
        },

        /**
         * Get a particular data modifier
         *
         * @type Function({Object} value, {String} name, {Object} data, {Template} tpl))
         *
         * @return {Function} The modifier
         */
        getModifier : function(name) {
            return this.modifiers[name];
        },

        /**
         * Set the list of post processors to apply on rendered template
         *
         * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
         *
         * @param {Object} postProcessors The new list of post processors
         * @return {Template} Return the instance for chaining
         */
        setPostProcessors : function(postProcessors) {
            if( JSC.isObject(postProcessors) ) {
                this.postProcessors = postProcessors;
            }
            return this;
        },

        /**
         * Get the list of post processors to apply on rendered template
         *
         * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
         *
         * @return {Object} The list of post processors
         */
        getPostProcessors : function() {
            return this.postProcessors;
        },

        /**
         * Set a particular post processor
         *
         * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
         *
         * @param {String} name The name of data for which set the post processor
         * @param {Function} postProcessor The new post processor
         * @return {Template} Return the instance for chaining
         */
        setPostProcessor : function(name, postProcessor) {
            if( JSC.isFunction(postProcessor) ) {
                this.postProcessors[name] = postProcessor;
            }
            return this;
        },

        /**
         * Get a particular post processor
         *
         * @type Function({jQuery} fragment, {Object} data, {String} name, {Template} tpl))
         *
         * @return {Function} The post processor
         */
        getPostProcessor : function(name) {
            return this.postProcessors[name];
        },

        /**
         * Set the global post processor
         *
         * @type Function({jQuery} template, {Object|Array} data, {Template} tpl))
         *
         * @param {Function} postProcessor The new global post processor
         * @return {Template} Return the instance for chaining
         */
        setGlobalPostProcessor : function(postProcessor) {
            if( JSC.isFunction(postProcessor) ) {
                this.globalPostProcessor = postProcessor;
            }
            return this;
        },

        /**
         * Get a particular post processor
         *
         * @type Function({jQuery} template, {Object|Array} data, {Template} tpl))
         *
         * @return {Function} The post processor
         */
        getGlobalPostProcessor : function(name) {
            return this.globalPostProcessor;
        },

        /**
         * Set or get the trigger fired before a rendered template is appended to an entry point
         *
         * @type Function({jQuery} nodes, {Object} data, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onRender : function(fn) {
            return this.on("render", fn);
        },

        /**
         * Set or get the trigger fired after a rendered template is appended to an entry point
         *
         * @type Function({jQuery} entry, {jQuery} nodes, {Object} data, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onAppend : function(fn) {
            return this.on("append", fn);
        },

        /**
         * Set or get the trigger fired after template is loaded
         *
         * @type Function({String} template, {String} source, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onLoad : function(fn) {
            return this.on("load", fn);
        },

        /**
         * Set or get the trigger fired after template is loaded and compiled
         *
         * @type Function({jQuery} nodes, {String} template, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onLoaded : function(fn) {
            return this.on("loaded", fn);
        },

        /**
         * Set or get the trigger fired after succesfull load of a template with AJAX
         *
         * @type Function({String} template, {String} textStatus, {jqXHR} jqXHR, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onSuccess : function(fn) {
            return this.on("success", fn);
        },

        /**
         * Set or get the trigger fired when error occurs on template loading with AJAX
         *
         * @type Function({String} template, {String} textStatus, {jqXHR} jqXHR, {String} errorThrown, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onError : function(fn) {
            return this.on("error", fn);
        },

        /**
         * Set or get the trigger fired after succesfull load of a dataset with AJAX
         *
         * @type Function({Object} data, {jQuery} renderTo, {Boolean} clean, {String} textStatus, {jqXHR} jqXHR, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onDataSuccess : function(fn) {
            return this.on("dataSuccess", fn);
        },

        /**
         * Set or get the trigger fired when error occurs on data loading with AJAX
         *
         * @type Function({jQuery} renderTo, {Boolean} clean, {String} textStatus, {jqXHR} jqXHR, {String} errorThrown, {Template} tpl)
         *
         * @param {Function} fn The related function to call when event occurs
         * @return {Function|Template} Return the event related function in getter mode, or return the current instance in setter mode
         */
        onDataError : function(fn) {
            return this.on("dataError", fn);
        },

        /**
         * Flag to indicate whether a template is loaded or not
         *
         * @type Boolean
         */
        loaded : false,

        /**
         * List of entry points in which render the template
         *
         * @type Array
         */
        renderTo : [],

        /**
         * HTML code of the template
         *
         * @type String
         */
        template : "",

        /**
         * HTML code of the template used when error occurs
         *
         * @type String
         */
        errorTemplate : _errorTemplate,

        /**
         * DOM elements compiled from template code
         *
         * @type jQuery
         */
        nodes : _voidJQ,

        /**
         * List of modifiers used to handle formatting of particular data
         *
         * @type Object
         */
        modifiers : null,

        /**
         * List of post processors to apply on rendered template
         *
         * @type Object
         */
        postProcessors : null,

        /**
         * Global post processor to apply on rendered template
         *
         * @type Function
         */
        globalPostProcessor : null
    });

    JSC.Template.implement("SimpleEvents").self(function(template) {
        return new this(template);
    });

    var
        // get the native method to slice array
        _arraySlice = [].slice,

        /**
         * Class to handle schemas
         */
        Schema = {
            /**
             * Name of the class
             *
             * @constant
             * @type String
             */
            className : "Schema",

            /**
             * Delegate constructor
             *
             * @constructor
             * @param {String} name Name of the represented node
             * @param {Object} nested Nested item
             */
            initialize : function(name, nested) {
                this.name = name;
                this.nested = nested;
                this.nodes = {};
            },

            /**
             * Rename the node
             *
             * @param {String} name Name of the represented node
             */
            rename : function(name) {
                this.name = name;
            },

            /**
             * Assign a nested item
             *
             * @param {Object} nested Nested item
             */
            nest : function(nested) {
                this.nested = nested;
            },

            /**
             * Find a node for given name and parent. If it does not exist, create it at appropriate place
             *
             * @param {String} name Name of the node to find
             * @param {String|Schema} parent Parent of the node
             * @return {Schema} Return the wanted node
             */
            node : function(name, parent) {
                var node = JSC.isObject(name) && name instanceof JSC.Schema ? name : this.find(name);
                return node || (parent ? this.node(parent) : this).add(name);
            },

            /**
             * Move a node to another place
             *
             * @param {String} name Name of the node to move
             * @param {String|Schema} to New parent of the node
             * @return {Schema} Return the moved node
             */
            move : function(name, to) {
                var node = this.remove(name);
                node && (to ? this.node(to) : this).add(node);
                return node;
            },

            /**
             * Add a node. If the node already exists, just return it.
             *
             * @param {String} name Name of the node to add
             * @return {Schema} Return the added node
             */
            add : function(name) {
                var node;

                // is a node given ?
                if( JSC.isObject(name) && name instanceof JSC.Schema ) {
                    // load the given node
                    node = name;
                    name = node.name;
                } else {
                    // try to find node in this, or create it
                    node = this.nodes[name] || JSC.Schema(name);
                }

                // force node in place, then return it
                this.nodes[name] = node;
                return node;
            },

            /**
             * Remove a node.
             *
             * @param {String} name Name of the node to remove
             * @return {Schema} Return the removed node
             */
            remove : function(name) {
                var i, node;
                if( name ) {
                    // wanted node is in this ?
                    if( this.nodes[name] ) {
                        node = this.nodes[name];
                        delete this.nodes[name];
                        return node;
                    }

                    // try to find in children
                    for(i in this.nodes) {
                        node = this.nodes[i].remove(name);
                        if( node ) {
                            return node;
                        }
                    }
                }
                return null;
            },

            /**
             * Find a node for a given name.
             *
             * @param {String} name Name of the node to find
             * @return {Schema} Return the wanted node, or null if not found
             */
            find : function(name) {
                var i, node;
                if( name ) {
                    // wanted node is in this ?
                    if( this.nodes[name] ) {
                        return this.nodes[name];
                    }

                    // try to find in children
                    for(i in this.nodes) {
                        node = this.nodes[i].find(name);
                        if( node ) {
                            return node;
                        }
                    }
                }
                return null;
            },

            /**
             * Call a function on each node, from root to leafs
             *
             * @type Function({Schema} node)
             *
             * @return {Schema} Return the current instance
             */
            walk : function(fn) {
                var name, node, args = _arraySlice.call(arguments, 0);

                // call on current node
                args[0] = this;
                fn.apply(this, args);

                // call on each child
                for(name in this.nodes) {
                    node = this.nodes[name];
                    node.walk.apply(node, arguments);
                }
                return this;
            },

            /**
             * Call a function on each node, from leafs to root
             *
             * @type Function({Schema} node)
             *
             * @return {Schema} Return the current instance
             */
            walkBack : function(fn) {
                var name, node, args = _arraySlice.call(arguments, 0);

                // call on each child
                for(name in this.nodes) {
                    node = this.nodes[name];
                    node.walkBack.apply(node, arguments);
                }

                // call on current node
                args[0] = this;
                fn.apply(this, args);
                return this;
            },

            /**
             * Name of the node
             *
             * @type String
             */
            name : null,

            /**
             * Nested item
             *
             * @type Object
             */
            nested : null,

            /**
             * List of nodes
             *
             * @type Object
             */
            nodes : null
        };

    JSC.Schema = JSC.create(Schema).self(function(name, nested) {
        return new this(name, nested);
    });

    /**
     * Class to handle benchmarks
     *
     * @todo Use delayed calls structure (setTimeout)
     * @todo Add handlers called to build particular context before measures
     * @todo Reduce default loops number, the measured test functions must implement a minimal heap of code to be visible in measure without run too many loops
     */
    JSC.Benchmark = JSC.create({
        /**
         * Name of the class
         *
         * @constant
         * @type String
         */
        className : "Benchmark",

        /**
         * Delegate constructor
         *
         * @constructor
         * @param {Object} config A config object to setup the benchmark
         */
        initialize : function(config) {
            // set initial config
            if( config ) {
                // load context values
                this.name = config.name || this.name;
                this.times = config.times || this.times;
                this.loops = config.loops || this.loops;
                this.benchs = config.benchs || [];

                // load event handlers
                this.setHandlers(config.handlers);
            }

            // fire event after benchmark initialize
            this.trigger("initialize", config, this);
        },

        /**
         * Run the benchmark
         */
        run : function() {
            var i, benchItem, result, handlers, measures = [];

            // fire event before the benchmark run
            this.trigger("beforeRun", this.benchs, this);

            // run measures for each bench
            for(i = 0; i < this.benchs.length; i++) {
                benchItem = this.benchs[i];

                // fire event before the bench measures
                this.trigger("beforeBench", benchItem, this);

                // do the bench measures
                try {
                    // is there a benchmark suite nested ?
                    if( benchItem.benchs ) {
                        // need event handlers in list
                        if( !handlers ) {
                            handlers = this.getHandlers();
                        }

                        // benchmark descriptor ?
                        if( !(benchItem instanceof JSC.Benchmark) ) {
                            // get a valid instance of benchmark suite
                            benchItem = JSC.Benchmark(JSC.merge(true, {
                                name : this.name,
                                times : this.times,
                                loops : this.loops,
                                handlers : handlers
                            }, benchItem));
                        } else {
                            // just custom the benchmark suite with handlers
                            benchItem.setHandlers(handlers);
                        }

                        // run the nested benchmark suite
                        result = benchItem.run();
                    } else {
                        // standard bench measures
                        result = this.bench(benchItem.name, benchItem.bench, benchItem.loops, benchItem.times);
                    }
                } catch(e) {
                    result = this.measureDetails(e, benchItem.name, benchItem.bench);
                }
                measures.push(result);

                // fire event after the bench measures
                this.trigger("afterBench", result, benchItem, this);
            }

            // fire event after the benchmark run
            this.trigger("afterRun", measures, this);

            return measures;
        },

        /**
         * Run a bench
         *
         * @param {String} name The measures' name
         * @param {Function} fn The function to measure
         * @param {Number} loops The number of times the function must be running to get an exploitable measure
         * @param {Number} times The number of times the measure must be taken
         * @return {Object} Returns the measure details
         * @throws JSC.Error
         */
        bench : function(name, fn, loops, times) {
            var i, details, measures = [];

            // validate the params
            times = times|| this.times;
            loops = loops || this.loops;
            if( !JSC.isFunction(fn) ) {
                JSC.error("A valid function is needed !");
            }

            // take measures
            for(i = 0; i < times; i++) {
                // fire event before the measures
                this.trigger("beforeMeasure", name, fn, this);

                // do the measures
                try {
                    measures.push(this.measure(fn, loops));
                    details = this.measureDetails(measures, name, fn);
                } catch(e) {
                    details = this.measureDetails(e, name, fn);
                }

                // fire event after the bench measures
                this.trigger("afterMeasure", details, this);
            }

            // compute detailed measures
            return details;
        },

        /**
         * Take a benchmark measure on a particular function.
         *
         * @param {Function} fn The function to measure
         * @param {Number} loops The number of times the function must be running to get an exploitable measure
         * @return {Number} Returns the duration for this measure
         * @throws JSC.Error
         */
        measure : function(fn, loops) {
            var i, t1, t2;

            // validate the params
            loops = loops || this.loops;
            if( !JSC.isFunction(fn) ) {
                JSC.error("A valid function is needed !");
            }

            // capture the begin timestamp
            t1 = this.timestamp();

            // run the function to measure
            for(i = 0; i < loops; i++) {
                fn();
            }

            // capture the end timestamp and compute duration
            t2 = this.timestamp();
            return t2 - t1;
        },

        /**
         * Get details for a list of measures
         *
         * @param {Array} measures The list of measures (a measure is a duration in milliseconds)
         * @param {String} name A name for the measures
         * @param {Function} bench The measured function
         * @return {Object} Returns the detailed measures
         */
        measureDetails : function(measures, name, bench) {
            var i, min, max, duration, measure, result = {};

            // measures are successful ?
            if( JSC.isArray(measures) ) {
                // compute detailed measures
                for(i = 0; i < measures.length; i++) {
                    measure = measures[i];
                    min = Math.min(min || measure, measure);
                    max = Math.max(max || measure, measure);
                    duration = (duration || 0) + measure;
                }

                // gathers the details
                JSC.merge(result, {
                    duration : duration,
                    average : duration / (measures.length || 1),
                    variation : max - min,
                    min : min,
                    max : max,
                    success : true
                });
            } else {
                // error occured on measures
                result.success = false;
            }

            // finalizes and returns the details
            return JSC.merge(result, {
                name : name,
                bench : bench,
                measures : measures
            });
        },

        /**
         * Get the current timestamp as a number of milliseconds since Epok (1970-01-01)
         *
         * @return {Number} The current timestamp
         */
        timestamp : function() {
            return (new Date()).getTime();
        },

        /**
         * Get event handlers
         *
         * @return {Object} Returns the list of installed event handlers
         */
        getHandlers : function() {
            var name, event, handlers = {};
            for(name in this) {
                if( "_on" === name.substr(0, 3) && JSC.isFunction(this[name]) ) {
                    event = name.charAt(3).toLowerCase() + name.substr(4);
                    handlers[event] = this[name];
                }
            }
            return handlers;
        },

        /**
         * Set event handlers
         *
         * @param {Object} handlers List of event handlers to install
         * @return {JSC.Benchmark}
         */
        setHandlers : function(handlers) {
            // fire event before add handlers
            if( false !== this.trigger("beforeHandlers", handlers, this) ) {
                // load event handlers
                if( handlers ) {
                    JSC.each(handlers, this.attach("on"));
                }
            }

            // fire event after handlers added
            this.trigger("afterHandlers", handlers, this);
            return this;
        },

        /**
         * Name of the benchmark
         *
         * @type String
         */
        name : "JavaScript Performance Benchmark",

        /**
         * Number of times the bench function is run to take a measure
         *
         * @type Number
         */
        loops : 1000000,

        /**
         * Number of times the measure is taken
         *
         * @type Number
         */
        times : 4,

        /**
         * The benchmark suite
         *
         * @type Array
         */
        benchs : null
    });

    JSC.Benchmark.implement("SimpleEvents").self(function(config) {
        return new this(config);
    });

    // exports public entries for the library
    return JSC;
});
})(jQuery);