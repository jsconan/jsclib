/*!
 * JavaScript Class Library v0.1 (JSC v0.1)
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(window, undefined){
    var
        // extract correct document reference
        document = window.document,

        // counter used to generate unique identifier
        _guidCount = 0,

        // default error message when none given
        _defaultError = "Unexpected error !",

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

        // RegEx to encode string (stringify)
        _reString = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

        // translations map to stringify a string
        _stringMap = {
            '"' : '\\"',
            '\\' : '\\\\',
            '\t' : '\\t',
            '\b' : '\\b',
            '\f' : '\\f',
            '\n' : '\\n',
            '\r' : '\\r'
        };

    // add some natives types to translations map of types
    (function(list){
        for(var i = 0; i < list.length; i++) {
            _types[ "[object " + list[i] + "]" ] = list[i];
        }
    })(["Array", "Boolean", "Date", "Function", "Object", "Number", "RegExp", "String"]);

    // fix type of some globals
    window.className = "Window";
    document.className = "Document";

    /**
     * Custom Error class for the library
     */
    var JSCError = function(message, context) {
        this.message = message;
        this.context = context;
    };
    JSCError.prototype = new Error();
    JSCError.prototype.className = JSCError.className = "JSCError";

    /**
     * Core library entry.
     *
     * @exports JSC
     * @namespace JSC
     * @version 0.1
     */
    var JSC = {
        /**
         * Library version.
         *
         * @constant
         * @type String
         */
        version : "0.1",

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
         * Generate unique identifier.
         *
         * @return {Number} Generated unique identifier
         */
        id : function() {
            return ++ _guidCount;
        },

        /**
         * Tag an object with unique identifier.
         *
         * @see JSC.id
         *
         * @param {Object} o Object to tag with unique identifier
         * @param {Number} [guid] Optional identifier to set if none were already there
         * @return {Number} Identifier of tagged object
         */
        tag : function(o, guid) {
            return o ? o.guid || (this === o ? o.guid : (o.guid = guid || this.id())) : undefined;
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
         * Check if a function is abstract.
         *
         * @param {Function} fn Function to test
         * @return {Boolean} Return true if the given function is abstract
         */
        isAbstract : function(fn) {
            return fn && this.isFunction(fn) && fn.abstractMethod ? true : false;
        },

        /**
         * Check if a function is an attached version.
         *
         * @param {Function} fn Function to test
         * @return {Boolean} Return true if the given function is an attached version
         */
        isAttached : function(fn) {
            return fn && this.isFunction(fn) && fn.attached ? true : false;
        },

        /**
         * Check if a function use inheritance.
         *
         * @param {Function} fn Function to test
         * @return {Boolean} Return true if the given function use inheritance
         */
        isInherited : function(fn) {
            return fn && this.isFunction(fn) && fn.inheritance ? true : false;
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
            if( !this.isString(n) ) {
                if( "undefined" === typeof v ) {
                    v = n;
                    n = n.className;
                }
                n = "" + n;
            }

            // export to global context
            window[n] = v;
            return v;
        },

        /**
         * Get a variable from global context.
         *
         * @param {String} n Name of variable to get from global context
         * @return {Object} Value of the global variable, or undefined
         */
        global : function(n) {
            return window[n];
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
                if( this.isBool(o) ) {
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
                            if( this.isObject(s) ) {
                                dest[n] = this.merge(recurse, this.isObject(d) ? d : {}, s);
                                continue;
                            } else if( this.isArray(s) ) {
                                dest[n] = this.merge(recurse, this.isArray(d) ? d : [], s);
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
            if( fn && this.isString(context) ) {
                var method = fn[context];
                context = fn;
                fn = method;
            }

            // produce a context attached function
            var wrap = this.noop;
            if( this.isFunction(fn) ) {
                var args = _arraySlice.call(arguments, 2);
                wrap = function() {
                    return fn.apply(context, args.concat(_arraySlice.call(arguments)));
                };
                wrap.attached = true;
            }

            // affect unique ID
            this.tag(wrap, fn ? this.tag(fn) : undefined);

            // and there is a context attached function...
            return wrap;
        },

        /**
         * Attach a method to current instance (assume the "this" keyword refer to right owner instance).
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
            var cacheName = "__cache__" + name;
            if( this[name] ) {
                // search in the cache for existing one
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
                JSC.error(context + " : This method is abstract and have to be overridden !", context);
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
            if( method !== oldMethod && this.isFunction(method) && _reInherited.test(method) ) {
                oldMethod = this.isFunction(oldMethod) ? oldMethod : JSC.noop;
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
                        Class.prototype[name] = superClass ? this.override(defs[name], superClass.prototype[name]) : defs[name];
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
                                Class.prototype[method] = this.abstractMethod(method);
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
                                Class.prototype[i] = undefined === method ? this.abstractMethod(i) : method;
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
                if( this.isString(c) ) {
                    // try to find class from implemented interfaces
                    if( interfaces[c] || c === o.className ) {
                        return true;
                    }

                    // try to load the class from global context
                    Class = this.getClass(c);
                    if( Class ) {
                        c = Class;
                    } else {
                        // nothing found !
                        return false;
                    }
                }

                // class or interface definition
                if( this.isFunction(c) ) {
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
            var Class = this.isString(className) ? this.global(className) : className;
            return this.isFunction(Class) ? Class : undefined;
        },

        /**
         * Get or load a class from its name. Throws an exception if no class comply.
         *
         * @param {String|Function} className Class or name of the class to get or load
         * @return {Function} Return the class
         * @throws Exception
         */
        loadClass : function(className) {
            return this.getClass(className) || this.error("Class [" + className + "] not found !", "JSC.loadClass");
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
         * @param {Object} defs List of properties and methods for the class to be
         * @return {Function} Created class
         */
        Class : function(className, defs) {
            // all parameters can be given in one single object
            if( className && !this.isString(className) ) {
                defs = className;
                className = defs.className;
            }

            // build the class initializer
            var Class = function() {
                // contruct for inheritance ?
                if( arguments.callee.caller === _extendClass ) {
                    return this;
                }

                // set the instance identity
                this.className = className;
                this.guid = JSC.id();

                // call delegate constructor
                this.initialize && this.initialize.apply(this, arguments);
                return this;
            };

            // extend the new class with default behaviors
            return _extendClass(Class, className, defs);
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
         * @param {Object} defs List of properties and methods for the singleton class to be
         * @return {Function} Created singleton class
         */
        Singleton : function(className, defs) {
            // all parameters can be given in one single object
            if( className && !this.isString(className) ) {
                defs = className;
                className = defs.className;
            }

            // build the class initializer
            var Class = function() {
                // contruct for inheritance ?
                if( arguments.callee.caller === _extendClass ) {
                    return this;
                }

                // instantiation is only allowed from getInstance
                if( arguments.callee.caller !== Class.getInstance ) {
                    JSC.error("This class cannot be directly instantiated", className);
                }

                // set the instance identity
                this.className = className;
                this.guid = JSC.id();

                // call delegate constructor
                this.initialize && this.initialize.apply(this, arguments);
                return this;
            };

            // add static instance getter
            Class.getInstance = function() {
                if( undefined === this.__instance ) {
                    this.__instance = new Class();
                }
                return this.__instance;
            };

            // extend the new class with default behaviors
            return _extendClass(Class, className, defs);
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
         * @param {Object} defs List of properties and methods for the multiton class to be
         * @return {Function} Created multiton class
         */
        Multiton : function(className, defs) {
            // all parameters can be given in one single object
            if( className && !this.isString(className) ) {
                defs = className;
                className = defs.className;
            }

            // build the class initializer
            var Class = function() {
                // contruct for inheritance ?
                if( arguments.callee.caller === _extendClass ) {
                    return this;
                }

                // instantiation is only allowed from getInstance
                if( arguments.callee.caller !== Class.getInstance ) {
                    JSC.error("This class cannot be directly instantiated", className);
                }

                // set the instance identity
                this.className = className;
                this.guid = JSC.id();

                // call delegate constructor
                this.initialize && this.initialize.apply(this, arguments);
                return this;
            };

            // add static instance getter
            Class.getInstance = function(key) {
                var skey = "" + key;
                this.__instances = this.__instances || {};
                if( undefined === this.__instances[skey] ) {
                    this.__instances[skey] = new Class(key);
                }
                return this.__instances[skey];
            };

            // extend the new class with default behaviors
            return _extendClass(Class, className, defs);
        },

        /**
         * Return a string represensation of a given value.
         * If no paramereter is given, return name and version of JSC object.
         *
         * @return {String} Return a string representation
         */
        toString : function() {
            if( arguments.length ) {
                var i, c, v = arguments[0], s = "";
                if( !v ) {
                    // representation of a zero-like value
                    return "undefined" === typeof v ? "undefined" : false === v ? "false" : null === v ? "null": "" + v;
                }

                switch( _toString.call(v) ) {
                    // representation of a string
                    case "[object String]":
                        if( _reString.test(v) ) {
                            s =  '"' + v.replace(_reString, function(ch) {
                                var c = _stringMap[ch];
                                return c ? c : '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).substr(-4);
                            }) + '"'
                        } else {
                            s = '"' + v + '"';
                        }
                        break;

                    // representation of an object
                    case "[object Object]":
                        s = "{";
                        for(i in v) {
                            s += (s.length > 1 ?',' : '') + this.toString(i) + ':' + this.toString(v[i]);
                        }
                        s += "}";
                        break;

                    // representation of an  array
                    case "[object Array]":
                        s = "[";
                        for(i = 0; i < v.length; i++) {
                            s += (s.length > 1 ?',' : '') + this.toString(v[i]);
                        }
                        s += "]";
                        break;

                    // representation of a function
                    case "[object Function]":
                        s = v.toString().replace(_reCode, '$1');
                        break;

                    // representation of a regular expression
                    case "[object RegExp]":
                        s = '/' + v.source + '/' + (v.global ? 'g' : '') + (v.ignoreCase ? 'i' : '');
                        break;

                    // representation of scalar value
                    default:
                        s = v.toString();
                }
                return s;
            }
            return this.className + " " + this.version;
        },

        /**
         * An empty method to do nothing.
         */
        noop : function() {}
    };

    /**
     * Private method to extend a class with default behaviors.
     * All methods introducing inheritance will be tagged with "inheritance" attribute, set with boolean value "true".
     * All created classes implements the "attach" method, that can context attach each method of its instances.
     *
     * @see JSC.extend
     * @see JSC.override
     * @see JSC.innerAttach
     *
     * @private
     *
     * @param {Function} Class Class to extend
     * @param {String} className Name of the class
     * @param {Object} defs List of properties and methods
     * @return {Function} The updated class
     */
    function _extendClass(Class, className, defs) {
        var superClass;

        // definitions list ?
        if( defs ) {
            // is a superClass defined ?
            if( defs.superClass ) {
                // load super class
                superClass = JSC.loadClass(defs.superClass);
                !superClass && JSC.error("Class [" + defs.superClass + "] is unknown !", "JSC.Class");
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
        }
        Class.implement = function(defs, name) {
            return JSC.implement(this, defs, name);
        }
        Class.interfaces = superClass && superClass.interfaces ? JSC.merge({}, superClass.interfaces) : {};
        Class.prototype.attach = JSC.innerAttach;

        // set the class identity
        Class.prototype.className = Class.className = className;
        Class.guid = JSC.id();
        return Class;
    }

    // exports public entries for the library
    JSC.globalize(JSC);
    JSC.globalize(JSCError);
})(window);
