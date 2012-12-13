/*!
 * Test Suite for JavaScript Class Library v0.2.4 (JSC 0.2.4)
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(undefined) {
    var suite = {
        _name : "JSC",

        /**
         * Test of JSC
         */
        JSC : function() {
            equal(typeof JSC, "object", "JSC must be an object");
            equal(JSC.className, "JSC", "Class name of JSC must be defined");
            equal(JSC.version, "0.2.4", "Version of JSC must be defined");
            equal(JSC.guid, 0, "GUID of JSC must be defined");
        },

        /**
         * Test of JSC.id()
         */
        id : function() {
            var value_1 = JSC.id(),
                value_2 = JSC.id(),
                value_3 = [],
                guid = -1,
                ret_1, ret_2, ret_3, ret_4;

            equal(typeof value_1, "number", "JSC.id() must return a number #1");
            equal(typeof value_2, "number", "JSC.id() must return a number #2");
            notEqual(value_1, value_2, "The values returned by JSC.id() have to be unique and different each time");

            value_1 = {};
            value_2 = {};
            ok("undefined" === typeof value_1.guid && "undefined" === typeof value_2.guid && "undefined" === typeof value_3.guid, "New objects must not have a global unique identifier");

            equal(JSC.id(undefined, guid), guid, "JSC.id(undefined, guid) must return guid");

            ret_1 = JSC.id(value_1);
            ret_2 = JSC.id(value_2);

            equal(typeof ret_1, "number", "JSC.id(value_1) must return a number");
            equal(typeof ret_2, "number", "JSC.id(value_2) must return a number");
            notEqual(ret_1, ret_2, "The values returned by JSC.id() have to be unique for a particular given value #1");

            ret_3 = JSC.id(value_1);
            ret_4 = JSC.id(value_2);
            equal(typeof ret_3, "number", "JSC.id(value_3) must return a number");
            equal(typeof ret_4, "number", "JSC.id(value_4) must return a number");
            notEqual(ret_3, ret_4, "The values returned by JSC.id() have to be unique for a particular given value #2");
            equal(ret_1, ret_3, "JSC.id() must always return same number each time it is called for a same value #1");
            equal(ret_2, ret_4, "JSC.id() must always return same number each time it is called for a same value #2");

            equal(ret_1, value_1.guid, "A GUID have to be set #1");
            equal(ret_2, value_2.guid, "A GUID have to be set #2");

            ret_1 = JSC.id(value_3, guid);
            equal(ret_1, guid, "When a guid is given to JSC.id(), it must be used");
            equal(ret_1, value_3.guid, "A GUID have to be set #3");

            guid = JSC.guid;
            ret_1 = JSC.id(JSC);
            ok(ret_1 === guid && JSC.guid === guid, "When applied on JSC, JSC.id() must not corrupt its GUID");
        },

        /**
         * Test of JSC.type()
         */
        type : function() {
            var undef, A = JSC.Class("A");

            equal(JSC.type(), "undefined", "Type of undefined");
            equal(JSC.type(undef), "undefined", "Type of undefined variable");
            equal(JSC.type(undefined), "undefined", "Type of undefined value");

            equal(JSC.type(new Date()), "Date", "Type of Date instance");

            equal(JSC.type(new RegExp()), "RegExp", "Type of RegExp instance");
            equal(JSC.type(/test/), "RegExp", "Type of RegExp value");

            equal(JSC.type(new Boolean()), "Boolean", "Type of Boolean instance");
            equal(JSC.type(true), "Boolean", "Type of Boolean value true");
            equal(JSC.type(false), "Boolean", "Type of Boolean value false");

            equal(JSC.type(new String()), "String", "Type of String instance");
            equal(JSC.type(""), "String", "Type of empty String value");
            equal(JSC.type("test"), "String", "Type of String value");

            equal(JSC.type(new Array()), "Array", "Type of Array instance");
            equal(JSC.type([]), "Array", "Type of empty Array value");
            equal(JSC.type([1,2,3]), "Array", "Type of Array value");
            equal(JSC.type("1,2,3".split(',')), "Array", "Type of result Array value");

            equal(JSC.type(new Number()), "Number", "Type of Number instance");
            equal(JSC.type(-1), "Number", "Type of Number negative value");
            equal(JSC.type(0), "Number", "Type of Number null value");
            equal(JSC.type(10), "Number", "Type of Number positive value");
            equal(JSC.type(14.501), "Number", "Type of Number float value");

            equal(JSC.type(new Object()), "Object", "Type of Object instance");
            equal(JSC.type({}), "Object", "Type of empty Object value");
            equal(JSC.type({test: 1}), "Object", "Type of Object value");

            equal(JSC.type(new Function()), "Function", "Type of Function instance");
            equal(JSC.type(function(){}), "Function", "Type of Function value");
            equal(JSC.type(JSC.type), "Function", "Type of an object's method");

            equal(JSC.type(A), "A", "Type of library created class");
            equal(JSC.type(new A()), "A", "Type of library created object");
        },

        /**
         * Test of JSC.isFunction()
         */
        isFunction : function() {
            var A = JSC.Class("A");

            equal(JSC.isFunction(), false, "An undefined value must not be considered as a function");
            equal(JSC.isFunction(undefined), false, "An undefined value must not be considered as a function");
            equal(JSC.isFunction(null), false, "A null value must not be considered as a function");
            equal(JSC.isFunction({}), false, "An object must not be considered as a function");
            equal(JSC.isFunction(new Object()), false, "An object must not be considered as a function");
            equal(JSC.isFunction([]), false, "An array must not be considered as a function");
            equal(JSC.isFunction(new Array()), false, "An array must not be considered as a function");
            equal(JSC.isFunction("function"), false, "A string must not be considered as a function");
            equal(JSC.isFunction(new String()), false, "A string must not be considered as a function");
            equal(JSC.isFunction(10), false, "A number must not be considered as a function");
            equal(JSC.isFunction(new Number()), false, "A number must not be considered as a function");
            equal(JSC.isFunction(true), false, "A boolean must not be considered as a function");
            equal(JSC.isFunction(new Boolean()), false, "A boolean must not be considered as a function");
            equal(JSC.isFunction(/xyz/), false, "A regex must not be considered as a function");
            equal(JSC.isFunction(new RegExp()), false, "A regex must not be considered as a function");
            equal(JSC.isFunction(new A()), false, "An instance of a class must be not considered as a function");

            equal(JSC.isFunction(function(){}), true, "A function must be considered as a function");
            equal(JSC.isFunction(new Function()), true, "A function must be considered as a function");
            equal(JSC.isFunction(A), true, "A class definition must be considered as a function");
        },

        /**
         * Test of JSC.isClass()
         */
        isClass : function() {
            var A = JSC.Class("A");

            equal(JSC.isClass(), false, "An undefined value must not be considered as a class");
            equal(JSC.isClass(undefined), false, "An undefined value must not be considered as a class");
            equal(JSC.isClass(null), false, "A null value must not be considered as a class");
            equal(JSC.isClass({}), false, "An object must not be considered as a class");
            equal(JSC.isClass(new Object()), false, "An object must not be considered as a class");
            equal(JSC.isClass([]), false, "An array must not be considered as a class");
            equal(JSC.isClass(new Array()), false, "An array must not be considered as a class");
            equal(JSC.isClass("function"), false, "A string must not be considered as a class");
            equal(JSC.isClass(new String()), false, "A string must not be considered as a class");
            equal(JSC.isClass(10), false, "A number must not be considered as a class");
            equal(JSC.isClass(new Number()), false, "A number must not be considered as a class");
            equal(JSC.isClass(true), false, "A boolean must not be considered as a class");
            equal(JSC.isClass(new Boolean()), false, "A boolean must not be considered as a class");
            equal(JSC.isClass(/xyz/), false, "A regex must not be considered as a class");
            equal(JSC.isClass(new RegExp()), false, "A regex must not be considered as a class");
            equal(JSC.isClass(function(){}), false, "A function must not be considered as a class");
            equal(JSC.isClass(new Function()), false, "A function must not be considered as a class");

            equal(JSC.isClass(A), true, "A class definition must be considered as a class");
            equal(JSC.isClass(new A()), false, "A class instance must not be considered as a class");
        },

        /**
         * Test of JSC.isInstance()
         */
        isInstance : function() {
            var A = JSC.Class("A");

            equal(JSC.isInstance(), false, "An undefined value must not be considered as a class instance instance");
            equal(JSC.isInstance(undefined), false, "An undefined value must not be considered as a class instance instance");
            equal(JSC.isInstance(null), false, "A null value must not be considered as a class instance");
            equal(JSC.isInstance({}), false, "An object must not be considered as a class instance");
            equal(JSC.isInstance(new Object()), false, "An object must not be considered as a class instance");
            equal(JSC.isInstance([]), false, "An array must not be considered as a class instance");
            equal(JSC.isInstance(new Array()), false, "An array must not be considered as a class instance");
            equal(JSC.isInstance("function"), false, "A string must not be considered as a class instance");
            equal(JSC.isInstance(new String()), false, "A string must not be considered as a class instance");
            equal(JSC.isInstance(10), false, "A number must not be considered as a class instance");
            equal(JSC.isInstance(new Number()), false, "A number must not be considered as a class instance");
            equal(JSC.isInstance(true), false, "A boolean must not be considered as a class instance");
            equal(JSC.isInstance(new Boolean()), false, "A boolean must not be considered as a class instance");
            equal(JSC.isInstance(/xyz/), false, "A regex must not be considered as a class instance");
            equal(JSC.isInstance(new RegExp), false, "A regex must not be considered as a class instance");
            equal(JSC.isInstance(function(){}), false, "A function must not be considered as a class instance");
            equal(JSC.isInstance(new Function()), false, "A function must not be considered as a class instance");

            equal(JSC.isInstance(A), false, "A class definition must not be considered as a class instance");
            equal(JSC.isInstance(new A()), true, "A class instance must be considered as a class instance");
        },

        /**
         * Test of JSC.isAbstract()
         */
        isAbstract : function() {
            var A = JSC.Class("A");

            equal(JSC.isAbstract(), false, "An undefined value must not be considered as an abstract function");
            equal(JSC.isAbstract(undefined), false, "An undefined value must not be considered as an abstract function");
            equal(JSC.isAbstract(null), false, "A null value must not be considered as an abstract function");
            equal(JSC.isAbstract({}), false, "An object must not be considered as an abstract function");
            equal(JSC.isAbstract(new Object()), false, "An object must not be considered as an abstract function");
            equal(JSC.isAbstract([]), false, "An array must not be considered as an abstract function");
            equal(JSC.isAbstract(new Array()), false, "An array must not be considered as an abstract function");
            equal(JSC.isAbstract("function"), false, "A string must not be considered as an abstract function");
            equal(JSC.isAbstract(new String()), false, "A string must not be considered as an abstract function");
            equal(JSC.isAbstract(10), false, "A number must not be considered as an abstract function");
            equal(JSC.isAbstract(new Number()), false, "A number must not be considered as an abstract function");
            equal(JSC.isAbstract(true), false, "A boolean must not be considered as an abstract function");
            equal(JSC.isAbstract(new Boolean()), false, "A boolean must not be considered as an abstract function");
            equal(JSC.isAbstract(/xyz/), false, "A regex must not be considered as an abstract function");
            equal(JSC.isAbstract(new RegExp()), false, "A regex must not be considered as an abstract function");
            equal(JSC.isAbstract(function(){}), false, "A standard function must not be considered as an abstract function");
            equal(JSC.isAbstract(new Function()), false, "A standard function must not be considered as an abstract function");
            equal(JSC.isAbstract(A), false, "A class definition must not be considered as an abstract function");
            equal(JSC.isAbstract(new A()), false, "A class instance must not be considered as an abstract function");

            equal(JSC.isAbstract(JSC.abstractMethod()), true, "An unnamed abstract function must be considered as an abstract function");
            equal(JSC.isAbstract(JSC.abstractMethod("test")), true, "A named abstract function must be considered as an abstract function");
        },

        /**
         * Test of JSC.isAttached()
         */
        isAttached : function() {
            var A = JSC.Class("A");

            equal(JSC.isAttached(), false, "An undefined value must not be considered as an attached function");
            equal(JSC.isAttached(undefined), false, "An undefined value must not be considered as an attached function");
            equal(JSC.isAttached(null), false, "A null value must not be considered as an attached function");
            equal(JSC.isAttached({}), false, "An object must not be considered as an attached function");
            equal(JSC.isAttached(new Object()), false, "An object must not be considered as an attached function");
            equal(JSC.isAttached([]), false, "An array must not be considered as an attached function");
            equal(JSC.isAttached(new Array()), false, "An array must not be considered as an attached function");
            equal(JSC.isAttached("function"), false, "A string must not be considered as an attached function");
            equal(JSC.isAttached(new String()), false, "A string must not be considered as an attached function");
            equal(JSC.isAttached(10), false, "A number must not be considered as an attached function");
            equal(JSC.isAttached(new Number()), false, "A number must not be considered as an attached function");
            equal(JSC.isAttached(true), false, "A boolean must not be considered as an attached function");
            equal(JSC.isAttached(new Boolean()), false, "A boolean must not be considered as an attached function");
            equal(JSC.isAttached(/xyz/), false, "A regex must not be considered as an attached function");
            equal(JSC.isAttached(new RegExp()), false, "A regex must not be considered as an attached function");
            equal(JSC.isAttached(function(){}), false, "A standard function must not be considered as an attached function");
            equal(JSC.isAttached(new Function()), false, "A standard function must not be considered as an attached function");
            equal(JSC.isAttached(A), false, "A class definition must not be considered as an attached function");
            equal(JSC.isAttached(new A()), false, "A class instance must not be considered as an attached function");

            equal(JSC.isAttached(JSC.attach(function(){}, this)), true, "An unnamed attached function must be considered as an attached function");
            equal(JSC.isAttached(JSC.attach({test: function(){}}, "test")), true, "A named attached function must be considered as an attached function");
        },

        /**
         * Test of JSC.isInherited()
         */
        isInherited : function() {
            var A = JSC.Class("A");

            equal(JSC.isInherited(), false, "An undefined value must not be considered as a function using inheritance");
            equal(JSC.isInherited(undefined), false, "An undefined value must not be considered as a function using inheritance");
            equal(JSC.isInherited(null), false, "A null value must not be considered as a function using inheritance");
            equal(JSC.isInherited({}), false, "An object must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Object()), false, "An object must not be considered as a function using inheritance");
            equal(JSC.isInherited([]), false, "An array must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Array()), false, "An array must not be considered as a function using inheritance");
            equal(JSC.isInherited("function"), false, "A string must not be considered as a function using inheritance");
            equal(JSC.isInherited(new String()), false, "A string must not be considered as a function using inheritance");
            equal(JSC.isInherited(10), false, "A number must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Number()), false, "A number must not be considered as a function using inheritance");
            equal(JSC.isInherited(true), false, "A boolean must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Boolean()), false, "A boolean must not be considered as a function using inheritance");
            equal(JSC.isInherited(/xyz/), false, "A regex must not be considered as a function using inheritance");
            equal(JSC.isInherited(new RegExp()), false, "A regex must not be considered as a function using inheritance");
            equal(JSC.isInherited(function(){}), false, "A standard function must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Function()), false, "A standard function must not be considered as a function using inheritance");
            equal(JSC.isInherited(A), false, "A class definition must not be considered as a function using inheritance");
            equal(JSC.isInherited(new A()), false, "A class instance must not be considered as a function using inheritance");

            equal(JSC.isInherited(JSC.override(function(){this.inherited();}, function(){})), true, "An overriding function must be considered as a function using inheritance");
        },

        /**
         * Test of JSC.isArray()
         */
        isArray : function() {
            var A = JSC.Class("A");

            equal(JSC.isArray(), false, "An undefined value must not be considered as an array");
            equal(JSC.isArray(undefined), false, "An undefined value must not be considered as an array");
            equal(JSC.isArray(null), false, "A null value must not be considered as an array");
            equal(JSC.isArray({}), false, "An object must not be considered as an array");
            equal(JSC.isArray(new Object()), false, "An object must not be considered as an array");
            equal(JSC.isArray(function(){}), false, "A function must not be considered as an array");
            equal(JSC.isArray(new Function()), false, "A function must not be considered as an array");
            equal(JSC.isArray(JSC.Class("A")), false, "A class definition must not be considered as an array");
            equal(JSC.isArray("Array"), false, "A string must not be considered as an array");
            equal(JSC.isArray(new String()), false, "A string must not be considered as an array");
            equal(JSC.isArray(10), false, "A number must not be considered as an array");
            equal(JSC.isArray(new Number()), false, "A number must not be considered as an array");
            equal(JSC.isArray(true), false, "A boolean must not be considered as an array");
            equal(JSC.isArray(new Boolean()), false, "A boolean must not be considered as an array");
            equal(JSC.isArray(/xyz/), false, "A regex must not be considered as an array");
            equal(JSC.isArray(new RegExp()), false, "A regex must not be considered as an array");
            equal(JSC.isArray(A), false, "A class definition must not be considered as an array");
            equal(JSC.isArray(new A()), false, "A class instance must not be considered as an array");

            equal(JSC.isArray([]), true, "An array must be considerer as an array");
            equal(JSC.isArray(new Array()), true, "An array must be considerer as an array");
        },

        /**
         * Test of JSC.isObject()
         */
        isObject : function() {
            var A = JSC.Class("A");

            equal(JSC.isObject(), false, "An undefined value must not be considered as an object");
            equal(JSC.isObject(undefined), false, "An undefined value must not be considered as an object");
            equal(JSC.isObject(null), false, "A null value must not be considered as an object");
            equal(JSC.isObject([]), false, "An array must not be considered as an object");
            equal(JSC.isObject(new Array()), false, "An array must not be considered as an object");
            equal(JSC.isObject(function(){}), false, "A function must not be considered as an object");
            equal(JSC.isObject(new Function()), false, "A function must not be considered as an object");
            equal(JSC.isObject(JSC.Class("A")), false, "A class definition must not be considered as an object");
            equal(JSC.isObject("Array"), false, "A string must not be considered as an object");
            equal(JSC.isObject(new String()), false, "A string must not be considered as an object");
            equal(JSC.isObject(10), false, "A number must not be considered as an object");
            equal(JSC.isObject(new Number()), false, "A number must not be considered as an object");
            equal(JSC.isObject(true), false, "A boolean must not be considered as an object");
            equal(JSC.isObject(new Boolean()), false, "A boolean must not be considered as an object");
            equal(JSC.isObject(/xyz/), false, "A regex must not be considered as an object");
            equal(JSC.isObject(new RegExp()), false, "A regex must not be considered as an object");
            equal(JSC.isObject(A), false, "A class definition must not be considered as an object");

            equal(JSC.isObject({}), true, "An object must be considerer as an object");
            equal(JSC.isObject(new Object()), true, "An object must be considerer as an object");
            equal(JSC.isObject(new A()), true, "A class instance must be considered as an object");
        },

        /**
         * Test of JSC.isEmptyObject()
         */
        isEmptyObject : function() {
            var A = JSC.Class("A");

            equal(JSC.isEmptyObject(), false, "An undefined value must not be considered as an empty object");
            equal(JSC.isEmptyObject(undefined), false, "An undefined value must not be considered as an empty object");
            equal(JSC.isEmptyObject(null), false, "A null value must not be considered as an empty object");
            equal(JSC.isEmptyObject([]), false, "An array must not be considered as an empty object");
            equal(JSC.isEmptyObject(new Array()), false, "An array must not be considered as an empty object");
            equal(JSC.isEmptyObject(function(){}), false, "A function must not be considered as an empty object");
            equal(JSC.isEmptyObject(new Function()), false, "A function must not be considered as an empty object");
            equal(JSC.isEmptyObject(JSC.Class("A")), false, "A class definition must not be considered as an empty object");
            equal(JSC.isEmptyObject("Array"), false, "A string must not be considered as an empty object");
            equal(JSC.isEmptyObject(new String()), false, "A string must not be considered as an empty object");
            equal(JSC.isEmptyObject(10), false, "A number must not be considered as an empty object");
            equal(JSC.isEmptyObject(new Number()), false, "A number must not be considered as an empty object");
            equal(JSC.isEmptyObject(true), false, "A boolean must not be considered as an empty object");
            equal(JSC.isEmptyObject(new Boolean()), false, "A boolean must not be considered as an empty object");
            equal(JSC.isEmptyObject(/xyz/), false, "A regex must not be considered as an empty object");
            equal(JSC.isEmptyObject(new RegExp()), false, "A regex must not be considered as an empty object");
            equal(JSC.isEmptyObject({test: 1}), false, "A filled object must not be considerer as an empty object");
            equal(JSC.isEmptyObject(A), false, "An empty class must not be considerer as an empty object");
            equal(JSC.isEmptyObject(new A()), false, "An instance of an empty class must not be considerer as an empty object");

            equal(JSC.isEmptyObject({}), true, "An empty object must be considerer as an empty object");
            equal(JSC.isEmptyObject(new Object()), true, "An empty object instance must be considerer as an empty object");
        },

        /**
         * Test of JSC.isString()
         */
        isString : function() {
            var A = JSC.Class("A");

            equal(JSC.isString(), false, "An undefined value must not be considered as a string");
            equal(JSC.isString(undefined), false, "An undefined value must not be considered as a string");
            equal(JSC.isString(null), false, "A null value must not be considered as a string");
            equal(JSC.isString({}), false, "An object must not be considered as a string");
            equal(JSC.isString(new Object()), false, "An object must not be considered as a string");
            equal(JSC.isString([]), false, "An array must not be considered as a string");
            equal(JSC.isString(new Array()), false, "An array must not be considered as a string");
            equal(JSC.isString(function(){}), false, "A function must not be considered as a string");
            equal(JSC.isString(JSC.Class("A")), false, "A class definition must not be considered as a string");
            equal(JSC.isString(new Function()), false, "A function must not be considered as a string");
            equal(JSC.isString(10), false, "A number must not be considered as a string");
            equal(JSC.isString(new Number()), false, "A number must not be considered as a string");
            equal(JSC.isString(true), false, "A boolean must not be considered as a string");
            equal(JSC.isString(new Boolean()), false, "A boolean must not be considered as a string");
            equal(JSC.isString(/xyz/), false, "A regex must not be considered as a string");
            equal(JSC.isString(new RegExp()), false, "A regex must not be considered as a string");
            equal(JSC.isString(A), false, "A class definition must not be considered as a string");
            equal(JSC.isString(new A()), false, "A class instance must not be considered as a string");

            equal(JSC.isString(""), true, "A string must be considered as a string");
            equal(JSC.isString(new String()), true, "A string must be considered as a string");
        },

        /**
         * Test of JSC.isBool()
         */
        isBool : function() {
            var A = JSC.Class("A");

            equal(JSC.isBool(), false, "An undefined value must not be considered as a boolean");
            equal(JSC.isBool(undefined), false, "An undefined value must not be considered as a boolean");
            equal(JSC.isBool(null), false, "A null value must not be considered as a boolean");
            equal(JSC.isBool({}), false, "An object must not be considered as a boolean");
            equal(JSC.isBool(new Object()), false, "An object must not be considered as a boolean");
            equal(JSC.isBool([]), false, "An array must not be considered as a boolean");
            equal(JSC.isBool(new Array()), false, "An array must not be considered as a boolean");
            equal(JSC.isBool(function(){}), false, "A function must not be considered as a boolean");
            equal(JSC.isBool(JSC.Class("A")), false, "A class definition must not be considered as a boolean");
            equal(JSC.isBool(new Function()), false, "A function must not be considered as a boolean");
            equal(JSC.isBool(10), false, "A number must not be considered as a boolean");
            equal(JSC.isBool(new Number()), false, "A number must not be considered as a boolean");
            equal(JSC.isBool("true"), false, "A string must not be considered as a boolean");
            equal(JSC.isBool(new String()), false, "A boolean must not be considered as a boolean");
            equal(JSC.isBool(/xyz/), false, "A regex must not be considered as a boolean");
            equal(JSC.isBool(new RegExp()), false, "A regex must not be considered as a boolean");
            equal(JSC.isBool(A), false, "A class definition must not be considered as a boolean");
            equal(JSC.isBool(new A()), false, "A class instance must not be considered as a boolean");

            equal(JSC.isBool(true), true, "A boolean must be considered as a boolean");
            equal(JSC.isBool(false), true, "A boolean must be considered as a boolean");
            equal(JSC.isBool(new Boolean()), true, "A boolean must be considered as a boolean");
        },

        /**
         * Test of JSC.isNumeric()
         */
        isNumeric : function() {
            var A = JSC.Class("A");

            equal(JSC.isNumeric(), false, "An undefined value must not be considered as a numeric value");
            equal(JSC.isNumeric(undefined), false, "An undefined value must not be considered as a numeric value");
            equal(JSC.isNumeric(null), false, "A null value must not be considered as a numeric value");
            equal(JSC.isNumeric({}), false, "An object must not be considered as a numeric value");
            equal(JSC.isNumeric(new Object()), false, "An object must not be considered as a numeric value");
            equal(JSC.isNumeric([]), false, "An array must not be considered as a numeric value");
            equal(JSC.isNumeric(new Array()), false, "An array must not be considered as a numeric value");
            equal(JSC.isNumeric(function(){}), false, "A function must not be considered as a numeric value");
            equal(JSC.isNumeric(JSC.Class("A")), false, "A class definition must not be considered as a numeric value");
            equal(JSC.isNumeric(new Function()), false, "A function must not be considered as a numeric value");
            equal(JSC.isNumeric("ddd"), false, "A string must not be considered as a numeric value");
            equal(JSC.isNumeric(new String()), false, "A string must not be considered as a numeric value");
            equal(JSC.isNumeric(true), false, "A boolean must not be considered as a numeric value");
            equal(JSC.isNumeric(new Boolean()), false, "A boolean must not be considered as a numeric value");
            equal(JSC.isNumeric(/xyz/), false, "A regex must not be considered as a numeric value");
            equal(JSC.isNumeric(new RegExp()), false, "A regex must not be considered as a numeric value");
            equal(JSC.isNumeric(A), false, "A class definition must not be considered as a numeric value");
            equal(JSC.isNumeric(new A()), false, "A class instance must not be considered as a numeric value");

            equal(JSC.isNumeric("10"), true, "A string containing numbers must be considered as a numeric value");
            equal(JSC.isNumeric("1234.5678"), true, "A string containing decimal numbers must be considered as a numeric value");
            equal(JSC.isNumeric("1234.5678e124"), true, "A string containing decimal numbers must be considered as a numeric value");
            equal(JSC.isNumeric("1234ttt5678e124"), false, "A string containing numbers and other chars must not be considered as a numeric value");
            equal(JSC.isNumeric(10), true, "A number must be considered as a numeric value");
            equal(JSC.isNumeric(Math.PI), true, "Math.PI must be considered as a numeric value");
            equal(JSC.isNumeric(new Number()), true, "A number object must be considered as a numeric value");
        },

        /**
         * Test of JSC.isNull()
         */
        isNull : function() {
            var A = JSC.Class("A");

            equal(JSC.isNull(), false, "An undefined value must not be considered as a null value");
            equal(JSC.isNull(undefined), false, "An undefined value must not be considered as a null value");
            equal(JSC.isNull("10"), false, "A string containing numbers must not be considered as a null value");
            equal(JSC.isNull("1234.5678"), false, "A string containing decimal numbers must not be considered as a null value");
            equal(JSC.isNull("1234.5678e124"), false, "A string containing decimal numbers must not be considered as a null value");
            equal(JSC.isNull("1234ttt5678e124"), false, "A string containing numbers and other chars must not be considered as a null value");
            equal(JSC.isNull(10), false, "A number must not be considered as a null value");
            equal(JSC.isNull(Math.PI), false, "Math.PI must not be considered as a null value");
            equal(JSC.isNull(new Number()), false, "A number object must not be considered as a null value");
            equal(JSC.isNull({}), false, "An object must not be considered as a null value");
            equal(JSC.isNull(new Object()), false, "An object must not be considered as a null value");
            equal(JSC.isNull([]), false, "An array must not be considered as a null value");
            equal(JSC.isNull(new Array()), false, "An array must not be considered as a null value");
            equal(JSC.isNull(function(){}), false, "A function must not be considered as a null value");
            equal(JSC.isNull(JSC.Class("A")), false, "A class definition must not be considered as a null value");
            equal(JSC.isNull(new Function()), false, "A function must not be considered as a null value");
            equal(JSC.isNull("ddd"), false, "A string must not be considered as a null value");
            equal(JSC.isNull(new String()), false, "A string must not be considered as a null value");
            equal(JSC.isNull(true), false, "A boolean must not be considered as a null value");
            equal(JSC.isNull(new Boolean()), false, "A boolean must not be considered as a null value");
            equal(JSC.isNull(/xyz/), false, "A regex must not be considered as a null value");
            equal(JSC.isNull(new RegExp()), false, "A regex must not be considered as a null value");
            equal(JSC.isNull(A), false, "A class definition must not be considered as a null value");
            equal(JSC.isNull(new A()), false, "A class instance must not be considered as a null value");

            equal(JSC.isNull(null), true, "A null value must be considered as a null value");
        },

        /**
         * Test of JSC.isUndef()
         */
        isUndef : function() {
            var A = JSC.Class("A");

            equal(JSC.isUndef(null), false, "A null value must not be considered as an undefined value");
            equal(JSC.isUndef("10"), false, "A string containing numbers must not be considered as an undefined value");
            equal(JSC.isUndef("1234.5678"), false, "A string containing decimal numbers must not be considered as an undefined value");
            equal(JSC.isUndef("1234.5678e124"), false, "A string containing decimal numbers must not be considered as an undefined value");
            equal(JSC.isUndef("1234ttt5678e124"), false, "A string containing numbers and other chars must not be considered as an undefined value");
            equal(JSC.isUndef(10), false, "A number must not be considered as an undefined value");
            equal(JSC.isUndef(Math.PI), false, "Math.PI must not be considered as an undefined value");
            equal(JSC.isUndef(new Number()), false, "A number object must not be considered as an undefined value");
            equal(JSC.isUndef({}), false, "An object must not be considered as an undefined value");
            equal(JSC.isUndef(new Object()), false, "An object must not be considered as an undefined value");
            equal(JSC.isUndef([]), false, "An array must not be considered as an undefined value");
            equal(JSC.isUndef(new Array()), false, "An array must not be considered as an undefined value");
            equal(JSC.isUndef(function(){}), false, "A function must not be considered as an undefined value");
            equal(JSC.isUndef(JSC.Class("A")), false, "A class definition must not be considered as an undefined value");
            equal(JSC.isUndef(new Function()), false, "A function must not be considered as an undefined value");
            equal(JSC.isUndef("ddd"), false, "A string must not be considered as an undefined value");
            equal(JSC.isUndef(new String()), false, "A string must not be considered as an undefined value");
            equal(JSC.isUndef(true), false, "A boolean must not be considered as an undefined value");
            equal(JSC.isUndef(new Boolean()), false, "A boolean must not be considered as an undefined value");
            equal(JSC.isUndef(/xyz/), false, "A regex must not be considered as an undefined value");
            equal(JSC.isUndef(new RegExp()), false, "A regex must not be considered as an undefined value");
            equal(JSC.isUndef(A), false, "A class definition must not be considered as an undefined value");
            equal(JSC.isUndef(new A()), false, "A class instance must not be considered as an undefined value");

            equal(JSC.isUndef(), true, "An undefined value must be considered as an undefined value");
            equal(JSC.isUndef(undefined), true, "An undefined value must be considered as an undefined value");
        },

        /**
         * Test of JSC.isVoid()
         */
        isVoid : function() {
            var A = JSC.Class("A");

            equal(JSC.isVoid("10"), false, "A string containing numbers must not be considered as a null or undefined value");
            equal(JSC.isVoid("1234.5678"), false, "A string containing decimal numbers must not be considered as a null or undefined value");
            equal(JSC.isVoid("1234.5678e124"), false, "A string containing decimal numbers must not be considered as a null or undefined value");
            equal(JSC.isVoid("1234ttt5678e124"), false, "A string containing numbers and other chars must not be considered as a null or undefined value");
            equal(JSC.isVoid(10), false, "A number must not be considered as a null or undefined value");
            equal(JSC.isVoid(Math.PI), false, "Math.PI must not be considered as a null or undefined value");
            equal(JSC.isVoid(new Number()), false, "A number object must not be considered as a null or undefined value");
            equal(JSC.isVoid({}), false, "An object must not be considered as a null or undefined value");
            equal(JSC.isVoid(new Object()), false, "An object must not be considered as a null or undefined value");
            equal(JSC.isVoid([]), false, "An array must not be considered as a null or undefined value");
            equal(JSC.isVoid(new Array()), false, "An array must not be considered as a null or undefined value");
            equal(JSC.isVoid(function(){}), false, "A function must not be considered as a null or undefined value");
            equal(JSC.isVoid(JSC.Class("A")), false, "A class definition must not be considered as a null or undefined value");
            equal(JSC.isVoid(new Function()), false, "A function must not be considered as a null or undefined value");
            equal(JSC.isVoid("ddd"), false, "A string must not be considered as a null or undefined value");
            equal(JSC.isVoid(new String()), false, "A string must not be considered as a null or undefined value");
            equal(JSC.isVoid(true), false, "A boolean must not be considered as a null or undefined value");
            equal(JSC.isVoid(new Boolean()), false, "A boolean must not be considered as a null or undefined value");
            equal(JSC.isVoid(/xyz/), false, "A regex must not be considered as a null or undefined value");
            equal(JSC.isVoid(new RegExp()), false, "A regex must not be considered as a null or undefined value");
            equal(JSC.isVoid(A), false, "A class definition must not be considered as a null or undefined value");
            equal(JSC.isVoid(new A()), false, "A class instance must not be considered as a null or undefined value");

            equal(JSC.isVoid(), true, "An undefined value must be considered as a null or undefined value");
            equal(JSC.isVoid(undefined), true, "An undefined value must be considered as a null or undefined value");
            equal(JSC.isVoid(null), true, "A null value must be considered as a null or undefined value");
        },

        /**
         * Test of JSC.error()
         */
        error : function() {
            var i, list, defaultError = "Unexpected error !";

            try {
                JSC.error();
            } catch(e) {
                if( e instanceof JSCError ) {
                    equal(e.message, defaultError, "Default error message must be used");
                    equal(e.context, undefined, "No context must be set");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }

            list = [{
                message : "",
                context : undefined,
                expectedMessage : defaultError,
                expectedContext : undefined
            },{
                message : undefined,
                context : undefined,
                expectedMessage : defaultError,
                expectedContext : undefined
            },{
                message : undefined,
                context : "context",
                expectedMessage : defaultError,
                expectedContext : "context"
            },{
                message : null,
                context : null,
                expectedMessage : defaultError,
                expectedContext : null
            },{
                message : 0,
                context : null,
                expectedMessage : defaultError,
                expectedContext : null
            },{
                message : false,
                context : undefined,
                expectedMessage : defaultError,
                expectedContext : undefined
            },{
                message : true,
                context : undefined,
                expectedMessage : true,
                expectedContext : undefined
            },{
                message : "An error has occurred !",
                context : "test",
                expectedMessage : "An error has occurred !",
                expectedContext : "test"
            }]

            for(i = 0; i < list.length; i++) {
                try {
                    JSC.error(list[i].message, list[i].context);
                } catch(e) {
                    if( e instanceof JSCError ) {
                        equal(e.message, list[i].expectedMessage, "Expected message must be set to throwing #" + i);
                        equal(e.context, list[i].expectedContext, "Expected context must be set to throwing #" + i);
                    } else {
                        ok(false, "Throwed error is not an instance of JSCError !");
                    }
                }
            }
        },

        /**
         * Test of JSC.globalize()
         */
        globalize : function() {
            var exportable = "exported", throwed = false, ret = true;

            try {
                ret = JSC.globalize();
            } catch(e) {
                throwed = true;
            }
            equal(ret, undefined, "JSC.globalize() must return nothing when no parameter is given");
            ok(!throwed, "Call of JSC.globalize() without parameter must not throw an exception");

            ok("undefined" == typeof myTestExport, "Not exported variable must not exist in global context !");

            ret = JSC.globalize("myTestExport", exportable);
            equal(ret, exportable, "JSC.globalize() must return the given value");
            ok("undefined" != typeof myTestExport, "Exported variable must exist in global context !");
            equal(myTestExport, exportable, "Exported variable must equal source value !");

            exportable = {};
            exportable.className = "classExport";
            ret = JSC.globalize(exportable);
            equal(ret, exportable, "JSC.globalize() must return the given value");
            ok("undefined" != typeof classExport, "Exported class must exist in global context !");
            equal(classExport, exportable, "Exported class must equal source value !");

            exportable = {};
            ret = JSC.globalize(true, exportable);
            equal(ret, exportable, "JSC.globalize() must return the given value");
            ok("undefined" != typeof JSC.global("true"), "No string parameter must be converted to string when two parameters are given !");
            equal(JSC.global("true"), exportable, "Exported value must equal source value !");
        },

        /**
         * Test of JSC.global()
         */
        global : function() {
            var globalized = "globalized", throwed = false, ret = true;

            try {
                ret = JSC.global();
            } catch(e) {
                throwed = true;
            }
            equal(ret, undefined, "JSC.global() must return nothing when no parameter is given");
            ok(!throwed, "Call of JSC.global() without parameter must not throw an exception");

            ok("undefined" == typeof JSC.global("myTestGlobal"), "Local variable must not exist in global context !");

            JSC.globalize("myTestGlobal", globalized);
            ret = JSC.global("myTestGlobal");
            ok("undefined" != typeof ret, "Global variable must exist in global context !");
            equal(ret, globalized, "Global variable must equal source value !");
            equal(JSC.global("myTestGlobal"), ret, "Each call of JSC.global() must return same value when same name is used !");
        },

        /**
         * Test of JSC.toString()
         */
        toString : function() {
            equal(JSC.toString(), JSC.className + " " + JSC.version, "JSC.toString() must return name and version");
            equal(JSC.toString(undefined), "undefined", "JSC.toString(undefined) must return 'undefined'");
            equal(JSC.toString(true), "true", "JSC.toString(true) must return 'true'");
            equal(JSC.toString(false), "false", "JSC.toString(false) must return 'false'");
            equal(JSC.toString(null), "null", "JSC.toString(null) must return 'null'");
            equal(JSC.toString(""), '""', "JSC.toString('') must return '\"\"'");
            equal(JSC.toString('\ttext\n"hello"\\'), '"\\ttext\\n\\"hello\\"\\\\"', 'JSC.toString(\'\\ttext\\n"hello"\\\\\') must return \'"\\ttext\\n\\"hello\\"\\\\"\'');
            equal(JSC.toString(10), '10', "JSC.toString(10) must return '10'");
            equal(JSC.toString(3.14), '3.14', "JSC.toString(3.14) must return '3.14'");
            equal(JSC.toString(/^\[object\s(.*)\]$/gi), '/^\\[object\\s(.*)\\]$/gi', "JSC.toString(/^\\[object\\s(.*)\\]$/gi) must return '/^\\[object\\s(.*)\\]$/gi'");
            equal(JSC.toString(function(){alert("hello");}), "function(){alert(\"hello\");}", "JSC.toString(function(){alert('hello');}) must return 'function(){alert('hello');}'");
            equal(JSC.toString([]), "[]", "JSC.toString([]) must return '[]'");
            equal(JSC.toString([{},{}]), "[{},{}]", "JSC.toString([{},{}]) must return '[{},{}]'");
            equal(JSC.toString({}), "{}", "JSC.toString({}) must return '{}'");
            equal(JSC.toString({a:true,b:[{}],d:"test"}), '{"a":true,"b":[{}],"d":"test"}', "JSC.toString({\"a\":true,\"b\":[{}],\"d\":\"test\"}) must return '{\"a\":true,\"b\":[{}],\"d\":\"test\"}'");
        },

        /**
         * Test of JSC.jsonData()
         */
        jsonData : function() {
            var val, ret, exp;
            strictEqual(JSC.jsonData(), undefined, "undefined value");
            strictEqual(JSC.jsonData(new Function()), undefined, "function object");
            strictEqual(JSC.jsonData(function(){}), undefined, "function value");
            strictEqual(JSC.jsonData(/test/), undefined, "regexp value");
            strictEqual(JSC.jsonData(new RegExp()), undefined, "regexp object");
            strictEqual(JSC.jsonData(new Date()), undefined, "date object");
            strictEqual(JSC.jsonData(true), true, "boolean 'true' value");
            strictEqual(JSC.jsonData(false), false, "boolean 'false' value");
            strictEqual(JSC.jsonData(null), null, "null value");
            strictEqual(JSC.jsonData(""), "", "void string value");
            strictEqual(JSC.jsonData("test"), "test", "string value");
            strictEqual(JSC.jsonData(0), 0, "void number");
            strictEqual(JSC.jsonData(10), 10, "positive number");
            strictEqual(JSC.jsonData(-24), -24, "negative number");
            strictEqual(JSC.jsonData(3.14), 3.14, "decimal number");
            strictEqual(JSC.jsonData(10/3), 10/3, "decimal number");
            strictEqual(JSC.jsonData(Infinity), null, "decimal non finite number");
            strictEqual(JSC.jsonData(3.14e-10), 3.14e-10, "decimal exposant number");

            val = [];
            exp = [];
            ret = JSC.jsonData(val);
            deepEqual(ret, exp, "void array");
            notStrictEqual(ret, val, "void array must be cloned");

            val = [1,2,null,"3",true,false,undefined,function(){},/exp/,new Date(),{t:2},[1]];
            exp = [1,2,null,"3",true,false,{t:2},[1]];
            ret = JSC.jsonData(val);
            deepEqual(ret, exp, "full array");
            notStrictEqual(ret, val, "array must be cloned");
            notStrictEqual(ret[ret.length - 2], val[val.length - 2], "array contained object must be cloned");
            notStrictEqual(ret[ret.length - 1], val[val.length - 1], "array contained array must be cloned");

            val = {};
            exp = {};
            ret = JSC.jsonData(val);
            deepEqual(ret, exp, "void object");
            notStrictEqual(ret, val, "void object must be cloned");

            val = {
                v1: 1,
                v2: 2,
                v3: null,
                v4: "3",
                v5: true,
                v6: false,
                v7: undefined,
                v8: function(){},
                v9: /exp/,
                v10: new Date(),
                v11: {t:2},
                v12: [1]
            };
            exp = {
                v1: 1,
                v2: 2,
                v3: null,
                v4: "3",
                v5: true,
                v6: false,
                v11: {t:2},
                v12: [1]
            };
            ret = JSC.jsonData(val);
            deepEqual(ret, exp, "full object");
            notStrictEqual(ret, val, "object must be cloned");
            notStrictEqual(ret.v11, val.v11, "object contained object must be cloned");
            notStrictEqual(ret.v12, val.v12, "object contained array must be cloned");
        },

        /**
         * Test of JSC.jsonString()
         */
        jsonString : function() {
            var val, ret, exp;

            strictEqual(JSC.jsonString(), "", "undefined value");
            strictEqual(JSC.jsonString(new Function()), "", "function object");
            strictEqual(JSC.jsonString(function(){}), "", "function value");
            strictEqual(JSC.jsonString(/test/), "", "regexp value");
            strictEqual(JSC.jsonString(new RegExp()), "", "regexp object");
            strictEqual(JSC.jsonString(new Date()), "", "date object");

            equal(JSC.jsonString(true), "true", "boolean 'true' value");
            equal(JSC.jsonString(false), "false", "boolean 'false' value");
            equal(JSC.jsonString(null), "null", "null value");
            equal(JSC.jsonString(""), '""', "void string value");
            equal(JSC.jsonString("test"), '"test"', "string value");
            equal(JSC.jsonString(0), "0", "void number");
            equal(JSC.jsonString(10), "10", "positive number");
            equal(JSC.jsonString(-24), "-24", "negative number");
            equal(JSC.jsonString(3.14), "3.14", "decimal number");
            equal(JSC.jsonString(10/3), "" + (10/3), "decimal number");
            equal(JSC.jsonString(Infinity), "null", "decimal non finite number");
            equal(JSC.jsonString(3.14e-10), "3.14e-10", "decimal exposant number");

            val = [];
            exp = "[]";
            ret = JSC.jsonString(val);
            equal(ret, exp, "void array");

            val = [1,2,null,"3",true,false,undefined,function(){},/exp/,new Date(),{t:2},[1]];
            exp = '[1,2,null,"3",true,false,{"t":2},[1]]';
            ret = JSC.jsonString(val);
            equal(ret, exp, "full array");

            val = {};
            exp = "{}";
            ret = JSC.jsonString(val);
            equal(ret, exp, "void object");

            val = {
                v1: 1,
                v2: 2,
                v3: null,
                v4: "3",
                v5: true,
                v6: false,
                v7: undefined,
                v8: function(){},
                v9: /exp/,
                v10: new Date(),
                v11: {t:2},
                v12: [1]
            };
            exp = '{"v1":1,"v2":2,"v3":null,"v4":"3","v5":true,"v6":false,"v11":{"t":2},"v12":[1]}';
            ret = JSC.jsonString(val);
            equal(ret, exp, "full object");
        },

        /**
         * Test of JSC.jsonParse()
         */
        jsonParse : function(s) {
            var throwed = false;
            try {
                function _isNull(value, message) {
                    strictEqual(JSC.jsonParse(value), null, message || (typeof value) + " value");
                }

                function _isStrictEqual(value, expected, message) {
                    strictEqual(JSC.jsonParse(value), expected, message);
                    strictEqual(JSC.jsonParse("  " + value + "  "), expected, message + " (with padding)");
                }

                function _isDeepEqual(value, expected, message) {
                    deepEqual(JSC.jsonParse(value), expected, message);
                    deepEqual(JSC.jsonParse("  " + value + "  "), expected, message + " (with padding)");
                }

                _isNull();
                _isNull(null);
                _isNull(10);
                _isNull(14.8);
                _isNull(true);
                _isNull(false);
                _isNull(function(){});
                _isNull(new Date());
                _isNull(/test/);
                _isNull([]);
                _isNull([1.8, "f"]);
                _isNull({});
                _isNull({t1:1, t2:""});

                _isNull("", "void string value");
                _isNull("  ", "blank string value");
                _isNull("FALSE", "wrong boolean string value");
                _isNull("test is test", "misc string value");
                _isNull("function(){return 1;}", "string representing function");
                _isNull("/xyz/", "string representing regexp");
                _isNull("" + (new Date()), "string representing date");

                _isStrictEqual("10", 10, "string representing positive number");
                _isStrictEqual("-24", -24, "string representing negative number");
                _isStrictEqual("3.14", 3.14, "string representing decimal number");
                _isStrictEqual("3.14e-10", 3.14e-10, "string representing decimal exposant number");
                _isStrictEqual("true", true, "string representing boolean 'true'");
                _isStrictEqual("false", false, "string representing boolean 'false'");
                _isStrictEqual("null", null, "string representing null");

                _isDeepEqual("[]", [], "string representing void array");
                _isDeepEqual('[1,[2,3],{},true,null,"test",{"t":301.14,"v":null},null]', [1,[2,3],{},true,null,"test",{"t":301.14,"v":null},null], "string representing full array");
                _isNull('[1,[2,3],{,true,null,"test",{"t":301.14,"v":null},null]', "string representing wrong array");

                _isDeepEqual("{}", {}, "string representing void object");
                _isDeepEqual('{"a":1,"b":null,"c":[],"d":{},"e":"","f":"tt","g":false,"h":true,"i":-20,"j":3.14,"k":[1,2,{},[],{"t":null,"i":[]}]}', {"a":1,"b":null,"c":[],"d":{},"e":"","f":"tt","g":false,"h":true,"i":-20,"j":3.14,"k":[1,2,{},[],{"t":null,"i":[]}]}, "string representing full object");
                _isNull('{"a":1,"b":null,"c":[,"d":{},"e":"","f":"tt","g":false,"h":true,"i":-20,"j:3.14,"k":[1,2,{},[],"t":null,"i":[]}]}', "string representing wrong object");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "JSC.jsonParse() must not throw any error");
        },

        /**
         * Test of JSC.sort()
         */
        sort : function() {
            var val, exp, throwed = false;
            try {
                function _isStrictEqual(value, message) {
                    strictEqual(JSC.sort(value), value, message);
                }
                function _isDeepEqual(value, keys, expected, message) {
                    var ret = JSC.sort(value, keys);
                    strictEqual(ret, value, message + ' - strict equal');
                    deepEqual(ret, expected, message + ' - deep equal');
                }
                function tos() {
                    return (this.name || "") + '-' + (this.age || "");
                }

                _isStrictEqual(undefined, "undefined value");
                _isStrictEqual(null, "null value");
                _isStrictEqual(10, "number value");
                _isStrictEqual("10", "string value");
                _isStrictEqual(true, "boolean value");
                _isStrictEqual({}, "void object value");
                _isStrictEqual({k:1}, "object value");
                _isStrictEqual([], "void array");
                _isStrictEqual(function(){}, "void function");
                _isStrictEqual(/test/, "regex");

                _isDeepEqual([9,8,2], null, [2,8,9], "array of numbers");
                _isDeepEqual([9,8,2], ["k", "v"], [2,8,9], "array of numbers, and dummy keys");

                val = [
                    {name: "Bianca", age: 19, city: "Amsterdam", toString: tos},
                    {name: "John", age: 19, city: "London", toString: tos},
                    10,
                    {name: "Pierre", age: 22, city: "Paris", toString: tos},
                    {name: "Frank", age: 22, city: "Berlin", toString: tos},
                    {name: "Pierre", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Edgar", age: 27, city: "London", toString: tos},
                    null,
                    {name: "Patrick", age: 32, city: "Amsterdam", toString: tos},
                    {name: "Jean", age: 21, city: "Paris", toString: tos},
                    {Name: "Paul", age: 22, city: "Berlin", toString: tos},
                    {name: "Fritz", age: 23, City: "Berlin", toString: tos},
                    {name: "Ann", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Charles", age: 45, city: "Luxembourg", toString: tos},
                    20
                ];
                exp = [
                    null,
                    10,
                    20,
                    {name: "Fritz", age: 23, City: "Berlin", toString: tos},
                    {name: "Bianca", age: 19, city: "Amsterdam", toString: tos},
                    {name: "Patrick", age: 32, city: "Amsterdam", toString: tos},
                    {Name: "Paul", age: 22, city: "Berlin", toString: tos},
                    {name: "Frank", age: 22, city: "Berlin", toString: tos},
                    {name: "John", age: 19, city: "London", toString: tos},
                    {name: "Edgar", age: 27, city: "London", toString: tos},
                    {name: "Ann", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Pierre", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Charles", age: 45, city: "Luxembourg", toString: tos},
                    {name: "Jean", age: 21, city: "Paris", toString: tos},
                    {name: "Pierre", age: 22, city: "Paris", toString: tos}
                ];
                _isDeepEqual(val, ["city", "age", "name"], exp, "array of objects");

                val = [
                    {name: "Bianca", age: 19, city: "Amsterdam", toString: tos},
                    {name: "John", age: 19, city: "London", toString: tos},
                    {name: "Pierre", age: 22, city: "Paris", toString: tos},
                    {name: "Frank", age: 22, city: "Berlin", toString: tos},
                    {name: "Pierre", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Edgar", age: 27, city: "London", toString: tos},
                    {name: "Patrick", age: 32, city: "Amsterdam", toString: tos},
                    {name: "Jean", age: 21, city: "Paris", toString: tos},
                    {Name: "Paul", age: 22, city: "Berlin", toString: tos},
                    {name: "Fritz", age: 23, City: "Berlin", toString: tos},
                    {name: "Ann", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Charles", age: 45, city: "Luxembourg", toString: tos}
                ];
                exp = [
                    {Name: "Paul", age: 22, city: "Berlin", toString: tos},
                    {name: "Ann", age: 23, city: "Luxembourg", toString: tos},
                    {name: "Bianca", age: 19, city: "Amsterdam", toString: tos},
                    {name: "Charles", age: 45, city: "Luxembourg", toString: tos},
                    {name: "Edgar", age: 27, city: "London", toString: tos},
                    {name: "Frank", age: 22, city: "Berlin", toString: tos},
                    {name: "Fritz", age: 23, City: "Berlin", toString: tos},
                    {name: "Jean", age: 21, city: "Paris", toString: tos},
                    {name: "John", age: 19, city: "London", toString: tos},
                    {name: "Patrick", age: 32, city: "Amsterdam", toString: tos},
                    {name: "Pierre", age: 22, city: "Paris", toString: tos},
                    {name: "Pierre", age: 23, city: "Luxembourg", toString: tos}
                ];
                _isDeepEqual(val, null, exp, "array of objects, no keys");

            } catch(e) {
                throwed = true;
                console.log(e)
            }
            ok(!throwed, "JSC.sort() must not throw any error");
        },

        /**
         * Test of JSC.shuffle()
         */
        shuffle : function() {
            var i, b, a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], len = a.length, asum = (len * (len + 1)) / 2, n = len / 2;

            function sum(v) {
                var s = 0, i = 0;
                while( i < v.length ) {
                    s += v[i++];
                }
                return s;
            }

            for(i = 0; i < n; i++) {
                b = JSC.shuffle(a.slice(0));
                notDeepEqual(a, b, "Array must be shuffled !");
                equal(len, b.length, "Length must be conserved");
                equal(asum, sum(b), "Sum must be conserved");
            }
        },

        /**
         * Test of JSC.merge()
         */
        merge : function() {
            var o = {}, o1;

            o1 = JSC.merge();
            ok("object" === typeof o1 && JSC.isEmptyObject(o1), "Merging of no object must at least produce an empty object");
            deepEqual(o1, {}, "Merge result of empty object");

            o1 = JSC.merge(o);
            equal(o, o1, "Merge of a single object must return it at least");
            deepEqual(o1, {}, "Merge result of empty object");

            o1 = JSC.merge(o, o);
            equal(o, o1, "Merge of a single object must return it at least");
            deepEqual(o1, {}, "Merge result of empty object");

            o1 = JSC.merge(true);
            ok("object" == typeof(o1), "Merging of no object but a boolean must at least produce an object");
            deepEqual(o1, {}, "Merge result of empty object");

            o1 = JSC.merge(o, {});
            equal(o, o1, "Merge of an object with another empty object must return it at least");
            deepEqual(o1, {}, "Merge result of empty object");

            o.a = false;
            o1 = JSC.merge(o, {});
            equal(o, o1, "Merge of an object with another empty object must return it at least");
            deepEqual(o1, {a:false}, "Merge result of empty object");

            o1 = JSC.merge(o, {
                a : true,
                b : {
                    a : false
                }
            });
            equal(o, o1, "Merge of an object with another empty object must return it at least");
            deepEqual(o1, {
                a : true,
                b : {
                    a : false
                }
            }, "Merge result");

            o1 = JSC.merge(o, {
                a : 10,
                b : {
                    a : 3
                },
                c : "tests"
            });
            equal(o, o1, "Merge must return destination object");
            deepEqual(o1, {
                a : 10,
                b : {
                    a : 3
                },
                c : "tests"
            }, "Merge result");

            o1 = JSC.merge(o, true, {
                b : {
                    b : 4
                }
            });
            equal(o, o1, "Merge must return destination object");
            deepEqual(o1, {
                a : 10,
                b : {
                    a : 3,
                    b : 4
                },
                c : "tests"
            }, "Merge result");

            o1 = JSC.merge(o, {
                c : {
                    f : 1
                }
            }, true, {
                b : {
                    c : true
                }
            });
            equal(o, o1, "Merge must return destination object");
            deepEqual(o1, {
                a : 10,
                b : {
                    a : 3,
                    b : 4,
                    c : true
                },
                c : {
                    f : 1
                }
            }, "Merge result");

            o1 = JSC.merge(o, true, {
                b : {
                    d : false
                }
            }, false, {
                c : {
                    a : 4
                }
            });
            equal(o, o1, "Merge must return destination object");
            deepEqual(o1, {
                a : 10,
                b : {
                    a : 3,
                    b : 4,
                    c : true,
                    d : false
                },
                c : {
                    a : 4
                }
            }, "Merge result");
        },

        /**
         * Test of JSC.each()
         */
        each : function() {
            var o1 = {}, o2 = {}, o3, a1 = [], a2 = [], a3, throwed, count, value, fn = function(p1, p2) {
                value = "" + value + this.value + p1 + p2;
                count ++;
            };

            throwed = false;
            try {
                o3 = JSC.each();
                equal(o3, undefined, "Undefined value must be returned when no parameters is used");

                o3 = JSC.each(o1);
                equal(o1, o3, "Returned object must be equal to given one");

                o3 = JSC.each(o1, 10);
                equal(o1, o3, "Returned object must be equal to given one");

                o3 = JSC.each(o1, true);
                equal(o1, o3, "Returned object must be equal to given one");

                o3 = JSC.each(o1, {});
                equal(o1, o3, "Returned object must be equal to given one");

                o3 = JSC.each(o1, []);
                equal(o1, o3, "Returned object must be equal to given one");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "No error must be throwed when no, or wrong, parameters is given")

            /**/
            o1.it1 = 4;
            o1.it2 = "t";
            o1.it3 = true;

            count = 0;
            o3 = JSC.each(o1, function(i, item, src){
                equal(item, this, "Processed property but be equal to this");
                equal(src, o1, "Declared source object must be equal to iterated object");
                o2[i] = item;
                count ++;
            });

            equal(o1, o3, "Returned object must be equal to given one");
            equal(count, 3, "Function must be called for each property of the object");
            deepEqual(o1, o2, "Result of walking in object");

            /**/
            a1.push("dd");
            a1.push(true);
            a1.push(45);
            a1.push({});

            count = 0;
            a3 = JSC.each(a1, function(i, item, src){
                equal(item, this, "Processed item but be equal to this");
                equal(src, a1, "Declared source array must be equal to iterated array");
                a2[i] = item;
                count ++;
            });

            equal(a1, a3, "Returned array must be equal to given one");
            equal(count, a1.length, "Function must be called for each item of the array");
            equal(a2.length, a1.length, "Result array must have same length of walked array");
            deepEqual(a1, a2, "Result of walking in array");

            /**/
            o1.it1 = {value: 4, action: fn};
            o1.it2 = {value: "t", action: fn};
            o1.it3 = {value: 10, action: fn};

            count = 0;
            value = "";
            o3 = JSC.each(o1, "action", "b", ",");

            equal(o1, o3, "Returned object must be equal to given one");
            equal(count, 3, "Function must be called for each property of the object");
            equal(value, "4b,tb,10b,", "Result of walking in object");

            /**/
            a1 = [];
            a1.push({value: 4, action: fn});
            a1.push({value: "t", action: fn});
            a1.push({value: 10, action: fn});

            count = 0;
            value = "";
            a3 = JSC.each(a1, "action", 7, ";");

            equal(a1, a3, "Returned array must be equal to given one");
            equal(count, a1.length, "Function must be called for each item of the array");
            equal(value, "47;t7;107;", "Result of walking in array");
        },

        /**
         * Test of JSC.owned()
         */
        owned : function() {
            var A, B, a, b, o, throwed = false;

            A = new Function();
            A.prototype.a = true;

            B = new Function();
            B.prototype = new A();
            B.prototype.b = true;

            a = new A();
            a.aa = true;

            b = new B();
            b.bb = true;

            ok("undefined" != typeof a.a, "Defined property must exist");
            ok("undefined" == typeof a.b, "Not defined property must not exist");
            ok("undefined" != typeof a.aa, "Added property must exist");
            ok("undefined" == typeof a.bb, "Not added property must not exist");

            try {
                o = JSC.owned();
            } catch(e) {
                throwed = true;
            }
            ok("object" === typeof o && JSC.isEmptyObject(o), "JSC.owned() must return an empty object when no parameter is given");
            ok(!throwed, "Call of JSC.owned() without parameter must not throw an exception");

            o = JSC.owned(a);
            ok("undefined" == typeof o.a, "Defined property must not be tagged as owned");
            ok("undefined" != typeof o.aa, "Added property must be tagged as owned");
            ok("undefined" == typeof o.b, "Not defined property must not be tagged as owned");
            ok("undefined" == typeof o.bb, "Not added property must not be tagged as owned");

            ok("undefined" != typeof b.a, "Herited property must exist");
            ok("undefined" != typeof b.b, "Defined property must exist");
            ok("undefined" == typeof b.aa, "Not added property must not exist");
            ok("undefined" != typeof b.bb, "Added property must exist");

            o = JSC.owned(b);
            ok("undefined" == typeof o.a, "Defined property must not be tagged as owned");
            ok("undefined" == typeof o.aa, "Not added property must be not tagged as owned");
            ok("undefined" == typeof o.b, "Defined property must not be tagged as owned");
            ok("undefined" != typeof o.bb, "Added property must be tagged as owned");
        },

        /**
         * Test of JSC.attach()
         */
        attach : function() {
            var o1 = {}, o2 = {}, o3 = {}, dummy, fn = function(p) {
                this.value = p;
            };

            o1.value = "1";
            o1.fn = fn;
            equal(o1.fn.guid, undefined, "No GUID on method");

            o2.value = "2";
            o2.fn = JSC.attach(fn, o1);
            ok(JSC.isAttached(o2.fn), "Flag must be set to tell the method is context attached");
            ok(o1.fn.guid, "Original method must have a GUID");
            ok(o2.fn.guid, "Proxy method must have a GUID");
            equal(o1.fn.guid, o2.fn.guid, "GUID of proxy and original methods must be equals");
            notEqual(o1.fn, o2.fn, "Proxy and original methods must not be equals");

            o3.value = "3";
            o3.fn = JSC.attach(o1, "fn");
            ok(JSC.isAttached(o3.fn), "Flag must be set to tell the method is context attached");
            ok(o3.fn.guid, "Proxy method must have a GUID");
            equal(o1.fn.guid, o3.fn.guid, "GUID of proxy and original methods must be equals");
            notEqual(o1.fn, o3.fn, "Proxy and original methods must not be equals");

            dummy = JSC.attach(undefined, o1);
            ok(dummy, "Proxy method must have given, even if no one was given");
            ok(dummy.guid, "Proxy method must have a GUID");

            dummy = JSC.attach(undefined, undefined);
            ok(dummy, "Proxy method must have given, even if no one was given");
            ok(dummy.guid, "Proxy method must have a GUID");

            dummy = JSC.attach();
            ok(dummy, "Proxy method must have given, even if no one was given");
            ok(dummy.guid, "Proxy method must have a GUID");

            dummy = JSC.attach(o1, "undefined");
            ok(dummy, "Proxy method must have given, even if no one was given");
            ok(dummy.guid, "Proxy method must have a GUID");

            dummy = JSC.attach(undefined, "undefined");
            ok(dummy, "Proxy method must have given, even if no one was given");
            ok(dummy.guid, "Proxy method must have a GUID");

            equal(o1.fn.guid, o3.fn.guid, "GUID of proxy and original methods must be equals");
            notEqual(o1.fn, o3.fn, "Proxy and original methods must not be equals");

            equal(o1.value, "1", "Initial o1 value");
            o1.fn("test");
            equal(o1.value, "test", "Value of o1 must be affected by method call");

            equal(o2.value, "2", "Initial o2 value");
            o2.fn("hello");
            equal(o1.value, "hello", "Value of o1 must be affected by method call");
            equal(o2.value, "2", "Value of o2 must not be affected by method call");

            equal(o3.value, "3", "Initial o3 value");
            o3.fn("hi");
            equal(o1.value, "hi", "Value of o1 must be affected by method call");
            equal(o2.value, "2", "Value of o2 must not be affected by method call");
            equal(o3.value, "3", "Value of o3 must not be affected by method call");
        },

        /**
         * Test of JSC.innerAttach()
         */
        innerAttach : function() {
            var fn, throwed = false;

            try {
                fn = JSC.innerAttach();
            } catch(e) {
                throwed = true;
            }
            ok(JSC.isFunction(fn), "JSC.innerAttach() must return a function even when no parameter is given");
            ok(!throwed, "Call of JSC.innerAttach() without parameter must not throw an exception");

            JSC.myValue = "";
            JSC.myFunction = function(){
                this.myValue = "myFunction";
            }

            fn = JSC.innerAttach("myFunction");
            notEqual(fn, JSC.noop, "Attached function must not be equal to noop");
            notEqual(fn, JSC.myFunction, "Attached function must not be equal to original one");
            equal(fn.guid, JSC.myFunction.guid, "Attached function must have same id that original one");
            equal(fn.guid, JSC.innerAttach("myFunction").guid, "Each attached function must have same id");
            equal(fn, JSC.innerAttach("myFunction"), "Each attached function must be equal");
            notEqual(fn, JSC.innerAttach("myFunction", true), "When rewriting is required, attached function must not be equal to old one");

            equal(JSC.myValue, "", "Value before call");
            fn();
            equal(JSC.myValue, "myFunction", "Value after call");

            delete JSC.myValue;
            delete JSC.myFunction;
        },

        /**
         * Test of JSC.abstractMethod()
         */
        abstractMethod : function() {
            var fn, name = "test", o = {}, throwed;

            fn = JSC.abstractMethod();
            ok(JSC.isFunction(fn), "Abstract method must be a function");
            raises(fn, "Calling of abstract method must throw an exception");
            ok(JSC.isAbstract(fn), "Abstract method must be tagged as abstract");

            o.fn = fn;
            throwed = false;
            try {
                o.fn();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "[unknownClass].[unknownMethod]", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "Calling of named abstract method in object context must throw an exception");

            fn = JSC.abstractMethod(name);
            ok(JSC.isFunction(fn), "Named abstract method must be a function");
            raises(fn, "Calling of named abstract method must throw an exception");
            ok(JSC.isAbstract(fn), "Named abstract method must be tagged as abstract");

            o.fn = fn;
            throwed = false;
            try {
                o.fn();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "[unknownClass]." + name, "Error thrown must set right context for named abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "Calling of named abstract method in object context must throw an exception");

            o.className = "A";
            throwed = false;
            try {
                o.fn();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "A." + name, "Error thrown must set right context for named abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "Calling of named abstract method in object context must throw an exception");
        },

        /**
         * Test of JSC.override()
         */
        override : function() {
            var value, o1 = {}, o2 = {}, o3 = {}, o4 = {}, reOverride = /\binherited\b/, fn = function(p) {
                value = p + "1";
            };

            equal(JSC.override(), undefined, "Overriding for nothing must return nothing");
            equal(JSC.override(fn), fn, "When no overriding, original method must be returned");
            equal(JSC.override(fn, fn), fn, "Override of a method by itself must not produce an overriding method");
            equal(JSC.override(value = ""), value, "Overriding with a string value must return the value unaltered");
            equal(JSC.override(value = new String()), value, "Overriding with a string value must return the value unaltered");
            equal(JSC.override(value = true), value, "Overriding with a boolean value must return the value unaltered");
            equal(JSC.override(value = new Boolean()), value, "Overriding with a boolean value must return the value unaltered");
            equal(JSC.override(value = {}), value, "Overriding with an objet value must return the value unaltered");
            equal(JSC.override(value = new Object()), value, "Overriding with an objet value must return the value unaltered");
            equal(JSC.override(value = []), value, "Overriding with an array value must return the value unaltered");
            equal(JSC.override(value = new Array()), value, "Overriding with an array value must return the value unaltered");
            equal(JSC.override(value = /xyz/), value, "Overriding with a RegExp value must return the value unaltered");
            equal(JSC.override(value = new RegExp()), value, "Overriding with a RegExp value must return the value unaltered");
            equal(JSC.override(value = 10), value, "Overriding with a number value must return the value unaltered");
            equal(JSC.override(value = new Number()), value, "Overriding with a number value must return the value unaltered");

            value = "";
            o1.fn = JSC.override(fn);
            o2.fn = JSC.override(function(p) {
                this.inherited(p);
                value += "2";
            }, o1.fn);
            o3.fn = JSC.override(function(p) {
                this.inherited(p);
                value += "3";
            }, o2.fn);
            o4.fn = JSC.override(function(p) {
                value += p + "4";
            }, o3.fn);

            value = "";
            equal(value, "", "Value before call of initial method");
            equal(o1.fn, fn, "Initial method must not be altered");
            ok(!JSC.isInherited(o1.fn), "Method must not be tagged as overriding");
            ok(!reOverride.test(o1.fn), "Initial method must not call inherited");
            o1.fn("test");
            equal(value, "test1", "Call of initial method");

            value = "";
            equal(value, "", "Value before call of 2 levels method");
            notEqual(o2.fn, fn, "2 levels method must be altered");
            ok(JSC.isInherited(o2.fn), "Method must be tagged as overriding");
            ok(reOverride.test(o2.fn), "2 levels method must call inherited");
            o2.fn("try");
            equal(value, "try12", "Call of 2 levels method");

            value = "";
            equal(value, "", "Value before call of 3 levels method");
            notEqual(o3.fn, fn, "3 levels method must be altered");
            ok(JSC.isInherited(o3.fn), "Method must be tagged as overriding");
            ok(reOverride.test(o3.fn), "3 levels method must call inherited");
            o3.fn("hello");
            equal(value, "hello123", "Call of 3 levels method");

            value = "";
            equal(value, "", "Value before call of 4 levels method");
            notEqual(o4.fn, fn, "4 levels method must be altered");
            ok(!JSC.isInherited(o4.fn), "Method must not be tagged as overriding");
            ok(!reOverride.test(o4.fn), "4 levels method must not call inherited");
            o4.fn("final");
            equal(value, "final4", "Call of 4 levels method");

            fn = function() {this.inherited();}
            equal(JSC.override(fn, fn), fn, "Override of a method by itself must not produce an overriding method, even if inheritance is invoked !");
        },

        /**
         * Test of JSC.extend()
         */
        extend : function() {
            var A, B, a, b, value, throwed;

            throwed = false
            try {
                equal(JSC.extend(), undefined, "Call of extend with no parameters must return undefined");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of extend with no parameters must not throw error");

            throwed = false
            try {
                equal(JSC.extend("Class"), "Class", "Call of extend with no class must return given value");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of extend with no class must not throw error");

            A = new Function();
            A.prototype.a = true;
            A.prototype.f = function(){
                value = "A";
            };

            throwed = false
            try {
                equal(JSC.extend(A), A, "Call of extend with only a class must return given class");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of extend with only a class must not throw error");


            B = new Function();
            B.prototype = new A();
            B.prototype.b = true;
            b = JSC.extend(B, {
                a : false,
                c : "",
                f : function(){
                    this.inherited();
                    value += "B";
                }
            }, A);
            ok(JSC.isFunction(b), "Class.extend() must return the class");
            equal(b, B, "Resturn of Class.extend() must be equal to the class");
            ok(JSC.isInherited(B.prototype.f), "Method must be tagged as overriding");

            value = "";
            a = new A();
            equal(value, "", "Initial value after 'A' is instantiated");
            a.f();
            equal(value, "A", "Altered value after call of 'A.f()'");

            value = "";
            b = new B();
            equal(b.a, false, "Value of 'b.a'");
            equal(b.b, true, "Value of 'b.b'");
            equal(b.c, "", "Value of 'b.c'");
            equal(value, "", "Initial value after 'B' is instantiated");
            b.f();
            equal(value, "AB", "Altered value after call of 'B.f()'");
        },

        /**
         * Test of JSC.implement()
         */
        implement : function() {
            var i, a, value, throwed, A = function(){};
            A.className = "A";

            throwed = false
            try {
                equal(JSC.implement(), undefined, "Call of implement with no parameters must return undefined");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of implement with no parameters must not throw error");

            throwed = false
            try {
                equal(JSC.implement("Class"), "Class", "Call of implement with no class must return given value");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of implement with no class must not throw error");

            a = JSC.implement(A);
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");

            a = JSC.implement(A, "test");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test, "Class must implement void interface 'test'");

            a = JSC.implement(A, []);
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");

            a = JSC.implement(A, [], "test2");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test2, "Class must implement void interface 'test2'");

            a = JSC.implement(A, ["fn1"]);
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(JSC.isFunction(A.prototype.fn1), "Class must implement interface method 'fn1'");
            ok(JSC.isAbstract(A.prototype.fn1), "Method 'fn1' must be abstract");

            a = JSC.implement(A, ["fn2"], "test3");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test3, "Class must implement void interface 'test3'");
            ok(JSC.isFunction(A.prototype.fn2), "Class must implement interface method 'fn2'");
            ok(JSC.isAbstract(A.prototype.fn2), "Method 'fn2' must be abstract");

            a = JSC.implement(A, {});
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");

            a = JSC.implement(A, {}, "test4");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test4, "Class must implement void interface 'test4'");

            a = JSC.implement(A, {className: "test5"});
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test5, "Class must implement void interface 'test5'");

            a = JSC.implement(A, {className: "test7"}, "test6");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test6, "Class must implement void interface 'test6'");
            ok(undefined === A.interfaces.test7, "Class must not implement interface 'test7'");

            a = JSC.implement(A, {
                fn3 : undefined,
                a1 : ""
            });
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(JSC.isFunction(A.prototype.fn3), "Class must implement interface method 'fn3'");
            ok(JSC.isString(A.prototype.a1), "Class must implement interface attribute 'a1'");
            ok(JSC.isAbstract(A.prototype.fn3), "Method 'fn3' must be abstract");

            a = JSC.implement(A, {
                fn4 : function() {
                    value = "fn4";
                },
                a2 : 10
            }, "test7");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test7, "Class must implement void interface 'test7'");
            ok(JSC.isFunction(A.prototype.fn4), "Class must implement interface method 'fn4'");
            ok(JSC.isNumeric(A.prototype.a2), "Class must implement interface attribute 'a2'");
            ok(!JSC.isAbstract(A.prototype.fn4), "Method 'fn4' must not be abstract");

            a = JSC.implement(A, {
                className: "test8",
                fn5 : function() {
                    value = "fn5";
                },
                a3 : true
            });
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test8, "Class must implement void interface 'test8'");
            ok(JSC.isFunction(A.prototype.fn5), "Class must implement interface method 'fn5'");
            ok(JSC.isBool(A.prototype.a3), "Class must implement interface attribute 'a3'");
            ok(!JSC.isAbstract(A.prototype.fn5), "Method 'fn5' must not be abstract");

            a = JSC.implement(A, {
                className: "test10",
                fn6 : function() {
                    value = "fn6";
                },
                a4 : {}
            }, "test9");
            equal(a, A, "Returned class must be equal to original one");
            equal(A.className, "A", "ClassName must not be altered");
            ok(A.interfaces.test9, "Class must implement void interface 'test9'");
            ok(undefined === A.interfaces.test10, "Class must not implement interface 'test10'");
            ok(JSC.isFunction(A.prototype.fn6), "Class must implement interface method 'fn6'");
            ok(JSC.isObject(A.prototype.a4), "Class must implement interface attribute 'a4'");
            ok(!JSC.isAbstract(A.prototype.fn6), "Method 'fn6' must not be abstract");

            a = new A();
            a.className = "A";
            for(i = 1; i < 7; i++) {
                ok(JSC.isFunction(a["fn" + i]), "Instance must have method fn" + i);
            }
            for(i = 1; i < 5; i++) {
                ok(undefined != a["a" + i], "Instance must have member a" + i);
            }

            for(i = 1; i < 4; i++) {
                throwed = false;
                try {
                    ok(JSC.isAbstract(a["fn" + i]), "Method fn" + i + " must be tagged as abstract");
                    a["fn" + i]();
                } catch(e) {
                    throwed = true;
                    if( e instanceof JSCError ) {
                        equal(e.context, "A.fn" + i, "Error thrown must set right context for unnamed abstract method");
                    } else {
                        ok(false, "Throwed error is not an instance of JSCError !");
                    }
                }
                ok(throwed, "Calling of abstract method fn" + i + " must throw an exception");
            }

            for(i = 4; i < 7; i++) {
                throwed = false;
                try {
                    a["fn" + i]();
                } catch(e) {
                    throwed = true;
                }
                ok(!throwed, "Calling of concrete method fn" + i + " must not throw an exception");
                equal(value, "fn" + i, "Value must be altered by a call fn" + i);
            }
        },

        /**
         * Test of JSC.instanceOf()
         */
        instanceOf : function() {
            var a, b, c, value = "", throwed, A = function(){}, B = function(){}, C, Interface1, Interface2 = {};
            A.className = "A";
            B.className = "B";
            Interface2.className = "Interface2";

            JSC.implement(A, "Interface1");
            JSC.implement(A, Interface2);
            JSC.implement(A, [], "Interface3");

            C = JSC.Class({
                superClass : A,
                className : "C"
            })
            C.implement("Interface4");

            JSC.globalize(A);
            JSC.globalize(B);
            JSC.globalize(C);

            a = new A();
            b = new B();
            c = new C();

            throwed = false;
            try {
                equal(JSC.instanceOf(), false, "Instance of nothing");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of instanceOf with no parameters must not throw error");

            throwed = false;
            try {
                equal(JSC.instanceOf(A), false, "Nothing instance of class");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "Call of instanceOf with only one parameter must not throw error");

            ok(JSC.instanceOf(A, A), "'A' is a fake instance of class 'A'");
            ok(JSC.instanceOf(A, "A"), "'A' is a fake instance of class 'A'");
            ok(!JSC.instanceOf(C, A), "'C' is not an instance of class 'A'");
            ok(!JSC.instanceOf(C, "A"), "'C' is not an instance of class 'A'");
            ok(!JSC.instanceOf(undefined, A), "'undefined' is not an instance of class 'A'");
            ok(!JSC.instanceOf(undefined, "A"), "'undefined' is not an instance of class 'A'");
            ok(!JSC.instanceOf(value, A), "not onject is not an instance of class 'A'");
            ok(!JSC.instanceOf(value, "A"), "not object is not an instance of class 'A'");
            ok(JSC.instanceOf(a, A), "'a' is an instance of class 'A'");
            ok(JSC.instanceOf(a, "A"), "'a' is an instance of class 'A'");
            ok(JSC.instanceOf(c, A), "'c' is an instance of class 'A'");
            ok(JSC.instanceOf(c, "A"), "'c' is an instance of class 'A'");
            ok(!JSC.instanceOf(a, B), "'a' is not an instance of class 'B'");
            ok(!JSC.instanceOf(a, "B"), "'a' is not an instance of class 'B'");
            ok(!JSC.instanceOf(c, B), "'c' is not an instance of class 'B'");
            ok(!JSC.instanceOf(c, "B"), "'c' is not an instance of class 'B'");
            ok(!JSC.instanceOf(b, A), "'b' is not an instance of class 'A'");
            ok(!JSC.instanceOf(b, "A"), "'b' is not an instance of class 'A'");
            ok(!JSC.instanceOf(b, C), "'b' is not an instance of class 'C'");
            ok(!JSC.instanceOf(b, "C"), "'b' is not an instance of class 'C'");
            ok(!JSC.instanceOf(a, Interface1), "'a' is not an instance of unknown class 'Interface1'");
            ok(!JSC.instanceOf(c, Interface1), "'c' is not an instance of unknown class 'Interface1'");
            ok(JSC.instanceOf(a, "Interface1"), "'a' is an instance of interface 'Interface1'");
            ok(JSC.instanceOf(c, "Interface1"), "'c' is an instance of interface 'Interface1'");
            ok(!JSC.instanceOf(b, "Interface1"), "'b' is not an instance of interface 'Interface1'");
            ok(JSC.instanceOf(a, Interface2), "'a' is an instance of interface 'Interface2'");
            ok(JSC.instanceOf(c, Interface2), "'c' is an instance of interface 'Interface2'");
            ok(!JSC.instanceOf(b, Interface2), "'b' is not an instance of interface 'Interface2'");
            ok(JSC.instanceOf(a, "Interface2"), "'a' is an instance of interface 'Interface2'");
            ok(JSC.instanceOf(c, "Interface2"), "'c' is an instance of interface 'Interface2'");
            ok(!JSC.instanceOf(b, "Interface2"), "'b' is not an instance of interface 'Interface2'");
            ok(JSC.instanceOf(a, "Interface3"), "'a' is an instance of interface 'Interface3'");
            ok(JSC.instanceOf(c, "Interface3"), "'c' is an instance of interface 'Interface3'");
            ok(!JSC.instanceOf(b, "Interface3"), "'b' is not an instance of interface 'Interface3'");
            ok(!JSC.instanceOf(a, "Interface4"), "'a' is not an instance of interface 'Interface4'");
            ok(!JSC.instanceOf(b, "Interface4"), "'b' is not an instance of interface 'Interface4'");
            ok(JSC.instanceOf(c, "Interface4"), "'c' is an instance of interface 'Interface4'");
        },

        /**
         * Test of JSC.getClass()
         */
        getClass : function() {
            var name = "myClass", myClass1 = function(){this.value=1;}, myClass2 = function(){this.value=2;}, Class;

            Class = JSC.getClass(myClass1);
            notEqual(Class, undefined, "The returned class must be defined");
            ok(JSC.isFunction(Class), "The returned class must be a real class");
            equal(Class, myClass1, "The returned class must comply to needed one");
            notEqual(Class, myClass2, "The returned class must not comply to other class");

            Class = JSC.getClass(myClass2);
            notEqual(Class, undefined, "The returned class must be defined");
            ok(JSC.isFunction(Class), "The returned class must be a real class");
            equal(Class, myClass2, "The returned class must comply to needed one");
            notEqual(Class, myClass1, "The returned class must not comply to other class");

            equal(JSC.getClass(), undefined, "Ask for a class with no parameter must return undefined");
            equal(JSC.getClass(name), undefined, "Unknown class must reeturn undefined");

            JSC.globalize(name, myClass1);
            Class = JSC.getClass(name);
            notEqual(Class, undefined, "When the needed class is known the function must return it");
            equal(Class, myClass1, "The returned class must comply to needed one");
            notEqual(Class, myClass2, "The returned class must not comply to other class");

            JSC.globalize(name, name);
            Class = JSC.getClass(name);
            equal(Class, undefined, "Ask for class that is not one must return undefined");
            ok(!JSC.isFunction(Class), "Not class must not be considered as a class");

            notEqual(JSC.getClass(Array), undefined, "Ask of native class Array must achieve with success");
            notEqual(JSC.getClass(Boolean), undefined, "Ask of native class Boolean must achieve with success");
            notEqual(JSC.getClass(Date), undefined, "Ask of native class Date must achieve with success");
            notEqual(JSC.getClass(Function), undefined, "Ask of native class Function must achieve with success");
            notEqual(JSC.getClass(Number), undefined, "Ask of native class Number must achieve with success");
            notEqual(JSC.getClass(Object), undefined, "Ask of native class Object must achieve with success");
            notEqual(JSC.getClass(RegExp), undefined, "Ask of native class RegExp must achieve with success");
            notEqual(JSC.getClass(String), undefined, "Ask of native class String must achieve with success");
        },


        /**
         * Test of JSC.loadClass()
         */
        loadClass : function() {
            var name = "myClass", myClass1 = function(){this.value=1;}, myClass2 = function(){this.value=2;}, Class;

            Class = JSC.loadClass(myClass1);
            notEqual(Class, undefined, "The returned class must be defined");
            ok(JSC.isFunction(Class), "The returned class must be a real class");
            equal(Class, myClass1, "The returned class must comply to needed one");
            notEqual(Class, myClass2, "The returned class must not comply to other class");

            Class = JSC.loadClass(myClass2);
            notEqual(Class, undefined, "The returned class must be defined");
            ok(JSC.isFunction(Class), "The returned class must be a real class");
            equal(Class, myClass2, "The returned class must comply to needed one");
            notEqual(Class, myClass1, "The returned class must not comply to other class");

            raises(function(){
                JSC.loadClass();
            }, "Ask for a class with no parameter must thow an error");
            raises(function(){
                JSC.loadClass(name);
            }, "Unknown class must thow an error");

            JSC.globalize(name, myClass1);
            Class = JSC.loadClass(name);
            notEqual(Class, undefined, "When the needed class is known the function must return it");
            equal(Class, myClass1, "The returned class must comply to needed one");
            notEqual(Class, myClass2, "The returned class must not comply to other class");

            JSC.globalize(name, name);
            raises(function(){
                Class = JSC.loadClass(name);
            }, "Ask for class that is not one must thow an error");

            notEqual(JSC.loadClass(Array), undefined, "Ask of native class Array must achieve with success");
            notEqual(JSC.loadClass(Boolean), undefined, "Ask of native class Boolean must achieve with success");
            notEqual(JSC.loadClass(Date), undefined, "Ask of native class Date must achieve with success");
            notEqual(JSC.loadClass(Function), undefined, "Ask of native class Function must achieve with success");
            notEqual(JSC.loadClass(Number), undefined, "Ask of native class Number must achieve with success");
            notEqual(JSC.loadClass(Object), undefined, "Ask of native class Object must achieve with success");
            notEqual(JSC.loadClass(RegExp), undefined, "Ask of native class RegExp must achieve with success");
            notEqual(JSC.loadClass(String), undefined, "Ask of native class String must achieve with success");
        },

        /**
         * Test of JSC.Class()
         */
        Class : function() {
            var value, A, B, C, D, a, b, c, d, fn, throwed;

            try {
                A = JSC.Class();
                ok(JSC.isFunction(A), "Class definition must be returned when no parameter is given to builder");
            } catch(e) {
                ok(false, "Class builder must be call without parameters");
            }

            try {
                A = JSC.Class("AA");
                ok(JSC.isFunction(A), "Class definition must be returned when only name parameter is given to builder");
                equal(JSC.type(A), "AA", "Type of a class must be its name");
            } catch(e) {
                ok(false, "Class builder must be call with only name parameter");
            }

            value = undefined;
            A = JSC.Class("A", {
                initialize : function() {
                    value += "A";
                },
                fn : function() {
                    this.fnValue = this.className + ".fn";
                    value = this.fnValue;
                },
                fnValue : ""
            });
            equal(JSC.type(A), "A", "Type of a class must be its name");
            equal(value, undefined, "Value must not be altered by class inheritance mechanism");
            equal(A.prototype.className, "A", "Prototype of className in class definition");

            value = undefined;
            B = JSC.globalize(JSC.Class({
                superClass : A,
                className : "B",
                initialize : function() {
                    this.inherited();
                    value += "B";
                },
                value : "member"
            }));
            equal(JSC.type(B), "B", "Type of a class must be its name");
            equal(value, undefined, "Value must not be altered by class inheritance mechanism");
            ok(JSC.isInherited(B.prototype.initialize), "Method must be tagged as overriding");
            equal(B.prototype.className, "B", "Prototype of className in class definition");

            value = undefined;
            C = JSC.Class({
                superClass : "B",
                className : "C"
            }).extend({
                fn2 : function() {
                    this.value = "fn2";
                }
            }).implement({
                className : 'Interface1',
                fn3 : function() {
                    this.value = "fn3";
                }
            }).implement(["fn4", "fn5"], 'Interface2');
            ok(JSC.isFunction(C), "Class.extend() must return the class");
            ok(C.interfaces.Interface1, "class must implement interface Interface1");
            ok(C.interfaces.Interface2, "class must implement interface Interface2");
            ok(JSC.isFunction(C.prototype.fn2), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn3), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn4), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn5), "method fn2 must be implemented");
            equal(JSC.type(C), "C", "Type of a class must be its name");
            equal(value, undefined, "value must not be altered by class inheritance mechanism");
            equal(C.prototype.className, "C", "Prototype of className in class definition");

            value = undefined;
            D = JSC.Class("D", {
                superClass : C,
                className : "truc",
                initialize : function() {
                    value += "D";
                    this.inherited();
                },
                fn : function() {
                    this.inherited();
                }
            });
            equal(JSC.type(D), "D", "Type of a class must be its name");
            equal(D.className, "D", "Class name must be equal to name parameter, even if given in definition list");
            equal(value, undefined, "value must not be altered by class inheritance mechanism");
            ok(JSC.isInherited(D.prototype.initialize), "method must be tagged as overriding");
            ok(JSC.isInherited(D.prototype.fn), "method must be tagged as overriding");
            equal(D.prototype.className, "D", "Prototype of className in class definition");

            value = "";
            a = new A();
            equal(JSC.type(a), "A", "Type of a class instance must be its class name");
            equal(a.constructor, A, "a reference to the class must be present into the built instance");
            equal(value, "A", "value after base class creation");
            ok(a instanceof A, "'a' must be an instance of class 'A'");
            ok(JSC.instanceOf(a, A), "'a' must be an instance of class 'A'");
            ok(JSC.isFunction(a.initialize), "member method must exist");
            ok(JSC.isFunction(a.fn), "member method must exist");
            equal(a.value, undefined, "no member attribute");

            value = "";
            b = new B();
            equal(JSC.type(b), "B", "Type of a class instance must be its class name");
            equal(b.constructor, B, "a reference to the class must be present into the built instance");
            equal(value, "AB", "value after first sub-class creation");
            ok(b instanceof A, "'b' must be an instance of class 'A'");
            ok(b instanceof B, "'b' must be an instance of class 'B'");
            ok(JSC.instanceOf(b, A), "'b' must be an instance of class 'A'");
            ok(JSC.instanceOf(b, B), "'b' must be an instance of class 'B'");
            ok(JSC.instanceOf(b, "B"), "'b' must be an instance of class 'B'");
            ok(JSC.isFunction(b.initialize), "member method must exist");
            ok(JSC.isFunction(b.fn), "member method must exist");
            equal(b.value, "member", "member attribute must exist");

            value = "";
            c = new C();
            equal(JSC.type(c), "C", "Type of a class instance must be its class name");
            equal(c.constructor, C, "a reference to the class must be present into the built instance");
            equal(value, "AB", "value after second sub-class creation");
            ok(c instanceof A, "'c' must be an instance of class 'A'");
            ok(c instanceof B, "'c' must be an instance of class 'B'");
            ok(c instanceof C, "'c' must be an instance of class 'C'");
            ok(JSC.instanceOf(c, A), "'c' must be an instance of class 'A'");
            ok(JSC.instanceOf(c, B), "'c' must be an instance of class 'B'");
            ok(JSC.instanceOf(c, "B"), "'c' must be an instance of class 'B'");
            ok(JSC.instanceOf(c, C), "'c' must be an instance of class 'C'");
            ok(JSC.instanceOf(c, "Interface1"), "'c' must be an instance of interface 'Interface1'");
            ok(JSC.isFunction(c.initialize), "member method must exist");
            ok(JSC.isFunction(c.fn), "member method fn must exist");
            ok(JSC.isFunction(c.fn2), "member method fn2 must exist");
            ok(JSC.isFunction(c.fn3), "member method fn3 must exist");
            ok(JSC.isFunction(c.fn4), "member method fn4 must exist");
            ok(JSC.isFunction(c.fn5), "member method fn5 must exist");
            equal(c.value, "member", "member attribute must exist");
            c.fn2();
            equal(c.value, "fn2", "member attribute must be altered by fn2");
            c.fn3();
            equal(c.value, "fn3", "member attribute must be altered by fn3");

            throwed = false;
            try {
                c.fn4();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "C.fn4", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "calling of abstract method fn4 must throw an exception");

            throwed = false;
            try {
                c.fn5();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "C.fn5", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "calling of abstract method fn5 must throw an exception");

            value = "";
            d = new D();
            equal(JSC.type(d), "D", "Type of a class instance must be its class name");
            equal(d.constructor, D, "a reference to the class must be present into the built instance");
            equal(value, "DAB", "value after second sub-class creation");
            ok(d instanceof A, "'d' must be an instance of class 'A'");
            ok(d instanceof B, "'d' must be an instance of class 'B'");
            ok(d instanceof C, "'d' must be an instance of class 'C'");
            ok(d instanceof D, "'d' must be an instance of class 'D'");
            ok(JSC.instanceOf(d, A), "'d' must be an instance of class 'A'");
            ok(JSC.instanceOf(d, B), "'d' must be an instance of class 'B'");
            ok(JSC.instanceOf(d, "B"), "'d' must be an instance of class 'B'");
            ok(JSC.instanceOf(d, C), "'d' must be an instance of class 'C'");
            ok(JSC.instanceOf(d, D), "'d' must be an instance of class 'D'");
            ok(JSC.instanceOf(d, "Interface1"), "'d' must be an instance of interface 'Interface1'");
            ok(JSC.isFunction(d.initialize), "member method must exist");
            ok(JSC.isFunction(d.fn), "member method must exist");
            equal(d.value, "member", "member attribute must exist");

            value = "";
            a.fn();
            equal(value, "A.fn", "value alterred by member function");

            fn = a.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, a.fn, "attached function must not be equal to original one");
            equal(fn.guid, a.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, a.attach("fn").guid, "each attached function must have same id");
            equal(fn, a.attach("fn"), "each attached function must be equal");
            notEqual(fn, a.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            a.fnValue = "";
            fn();
            equal(value, "A.fn", "value alterred by member function");
            equal(a.fnValue, "A.fn", "fnValue alterred by member function");

            value = "";
            b.fn();
            equal(value, "B.fn", "value alterred by member function");

            fn = b.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, b.fn, "attached function must not be equal to original one");
            equal(fn.guid, b.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, b.attach("fn").guid, "each attached function must have same id");
            equal(fn, b.attach("fn"), "each attached function must be equal");
            notEqual(fn, b.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            b.fnValue = "";
            fn();
            equal(value, "B.fn", "value alterred by member function");
            equal(b.fnValue, "B.fn", "fnValue alterred by member function");

            value = "";
            c.fn();
            equal(value, "C.fn", "value alterred by member function");

            fn = c.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, c.fn, "attached function must not be equal to original one");
            equal(fn.guid, c.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, c.attach("fn").guid, "each attached function must have same id");
            equal(fn, c.attach("fn"), "each attached function must be equal");
            notEqual(fn, c.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            c.fnValue = "";
            fn();
            equal(value, "C.fn", "value alterred by member function");
            equal(c.fnValue, "C.fn", "fnValue alterred by member function");


            raises(function(){
                JSC.Class({
                    superClass : "undefinedClass",
                    className : "D",
                    initialize : function() {
                        value += "C";
                        this.inherited();
                    }
                })
            }, "An error must be throwed when super class is unknown");
        },

        /**
         * Test of JSC.Singleton()
         */
        Singleton : function() {
            var value, i, A, B, C, D, a, b, c, d, fn, throwed;

            try {
                A = JSC.Singleton();
                ok(JSC.isFunction(A), "Singleton class definition must be returned when no parameter is given to builder");
            } catch(e) {
                ok(false, "Singleton class builder must be call without parameters");
            }

            try {
                A = JSC.Singleton("AA");
                ok(JSC.isFunction(A), "Singleton class definition must be returned when only name parameter is given to builder");
                equal(JSC.type(A), "AA", "Type of a singleton class must be its name");
            } catch(e) {
                ok(false, "Singleton class builder must be call with only name parameter");
            }

            value = undefined;
            A = JSC.Singleton("A", {
                initialize : function() {
                    value += "A";
                },
                fn : function() {
                    value = this.className + ".fn";
                }
            });
            equal(JSC.type(A), "A", "Type of a singleton class must be its name");
            equal(value, undefined, "value must not be altered by singleton class inheritance mechanism");

            value = undefined;
            B = JSC.globalize(JSC.Singleton({
                superClass : A,
                className : "B",
                initialize : function() {
                    this.inherited();
                    value += "B";
                },
                value : "member"
            }));
            equal(JSC.type(B), "B", "Type of a singleton class must be its name");
            equal(value, undefined, "value must not be altered by singleton class inheritance mechanism");
            ok(JSC.isInherited(B.prototype.initialize), "method must be tagged as overriding");

            value = undefined;
            C = JSC.Singleton({
                superClass : "B",
                className : "C"
            }).extend({
                fn2 : function() {
                    this.value = "fn2";
                }
            }).implement({
                className : 'Interface1',
                fn3 : function() {
                    this.value = "fn3";
                }
            }).implement(["fn4", "fn5"], 'Interface2');
            ok(JSC.isFunction(C), "Class.extend() must return the class");
            ok(C.interfaces.Interface1, "class must implement interface Interface1");
            ok(C.interfaces.Interface2, "class must implement interface Interface2");
            ok(JSC.isFunction(C.prototype.fn2), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn3), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn4), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn5), "method fn2 must be implemented");
            equal(JSC.type(C), "C", "Type of a singleton class must be its name");
            equal(value, undefined, "value must not be altered by singleton class inheritance mechanism");

            value = undefined;
            D = JSC.Singleton("D", {
                superClass : C,
                className : "truc",
                initialize : function() {
                    value += "D";
                    this.inherited();
                },
                fn : function() {
                    this.inherited();
                }
            });
            equal(JSC.type(D), "D", "Type of a singleton class must be its name");
            equal(D.className, "D", "Class name must be equal to name parameter, even if given in definition list");
            equal(value, undefined, "value must not be altered by singleton class inheritance mechanism");
            ok(JSC.isInherited(D.prototype.initialize), "method must be tagged as overriding");
            ok(JSC.isInherited(D.prototype.fn), "method must be tagged as overriding");

            value = "";
            throwed = false;
            try {
                a = new A();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === a, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on singleton class");
            equal(value, "", "value must not be altered by singleton direct instantiation avoiding");

            a = A.getInstance();
            equal(JSC.type(a), "A", "Type of a class instance must be its class name");
            equal(a.constructor, A, "a reference to the class must be present into the built instance");
            equal(value, "A", "value after base class creation");
            ok(a instanceof A, "'a' must be an instance of class 'A'");
            ok(JSC.instanceOf(a, A), "'a' must be an instance of class 'A'");
            ok(JSC.isFunction(a.initialize), "member method must exist");
            ok(JSC.isFunction(a.fn), "member method must exist");
            equal(a.value, undefined, "no member attribute");
            for(i = 0; i < 4; i++) {
                equal(A.getInstance(i), a, "only one instance must be created in a singleton");
                equal(A.getInstance(i).guid, a.guid, "only one instance must be created in a singleton");
            }

            value = "";
            throwed = false;
            try {
                b = new B();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === b, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on singleton class");
            equal(value, "", "value must not be altered by singleton direct instantiation avoiding");

            b = B.getInstance();
            equal(JSC.type(b), "B", "Type of a class instance must be its class name");
            equal(b.constructor, B, "a reference to the class must be present into the built instance");
            equal(value, "AB", "value after first sub-class creation");
            ok(b instanceof A, "'b' must be an instance of class 'A'");
            ok(b instanceof B, "'b' must be an instance of class 'B'");
            ok(JSC.instanceOf(b, A), "'b' must be an instance of class 'A'");
            ok(JSC.instanceOf(b, B), "'b' must be an instance of class 'B'");
            ok(JSC.instanceOf(b, "B"), "'b' must be an instance of class 'B'");
            ok(JSC.isFunction(b.initialize), "member method must exist");
            ok(JSC.isFunction(b.fn), "member method must exist");
            equal(b.value, "member", "member attribute must exist");
            for(i = 0; i < 4; i++) {
                equal(B.getInstance(i), b, "only one instance must be created in a singleton");
                equal(B.getInstance(i).guid, b.guid, "only one instance must be created in a singleton");
            }

            value = "";
            throwed = false;
            try {
                c = new C();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === c, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on singleton class");
            equal(value, "", "value must not be altered by singleton direct instantiation avoiding");

            c = C.getInstance();
            equal(JSC.type(c), "C", "Type of a class instance must be its class name");
            equal(c.constructor, C, "a reference to the class must be present into the built instance");
            equal(value, "AB", "value after second sub-class creation");
            ok(c instanceof A, "'c' must be an instance of class 'A'");
            ok(c instanceof B, "'c' must be an instance of class 'B'");
            ok(c instanceof C, "'c' must be an instance of class 'C'");
            ok(JSC.instanceOf(c, A), "'c' must be an instance of class 'A'");
            ok(JSC.instanceOf(c, B), "'c' must be an instance of class 'B'");
            ok(JSC.instanceOf(c, "B"), "'c' must be an instance of class 'B'");
            ok(JSC.instanceOf(c, C), "'c' must be an instance of class 'C'");
            ok(JSC.instanceOf(c, "Interface1"), "'c' must be an instance of interface 'Interface1'");
            ok(JSC.isFunction(c.initialize), "member method must exist");
            ok(JSC.isFunction(c.fn), "member method fn must exist");
            ok(JSC.isFunction(c.fn2), "member method fn2 must exist");
            ok(JSC.isFunction(c.fn3), "member method fn3 must exist");
            ok(JSC.isFunction(c.fn4), "member method fn4 must exist");
            ok(JSC.isFunction(c.fn5), "member method fn5 must exist");
            equal(c.value, "member", "member attribute must exist");
            c.fn2();
            equal(c.value, "fn2", "member attribute must be altered by fn2");
            c.fn3();
            equal(c.value, "fn3", "member attribute must be altered by fn3");
            for(i = 0; i < 4; i++) {
                equal(C.getInstance(i), c, "only one instance must be created in a singleton");
                equal(C.getInstance(i).guid, c.guid, "only one instance must be created in a singleton");
            }

            throwed = false;
            try {
                c.fn4();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "C.fn4", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "calling of abstract method fn4 must throw an exception");

            throwed = false;
            try {
                c.fn5();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "C.fn5", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "calling of abstract method fn5 must throw an exception");

            value = "";
            throwed = false;
            try {
                d = new D();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === d, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on singleton class");
            equal(value, "", "value must not be altered by singleton direct instantiation avoiding");

            d = D.getInstance();
            equal(JSC.type(d), "D", "Type of a class instance must be its class name");
            equal(d.constructor, D, "a reference to the class must be present into the built instance");
            equal(value, "DAB", "value after second sub-class creation");
            ok(d instanceof A, "'d' must be an instance of class 'A'");
            ok(d instanceof B, "'d' must be an instance of class 'B'");
            ok(d instanceof C, "'d' must be an instance of class 'C'");
            ok(d instanceof D, "'d' must be an instance of class 'D'");
            ok(JSC.instanceOf(d, A), "'d' must be an instance of class 'A'");
            ok(JSC.instanceOf(d, B), "'d' must be an instance of class 'B'");
            ok(JSC.instanceOf(d, "B"), "'d' must be an instance of class 'B'");
            ok(JSC.instanceOf(d, C), "'d' must be an instance of class 'C'");
            ok(JSC.instanceOf(d, D), "'d' must be an instance of class 'D'");
            ok(JSC.instanceOf(d, "Interface1"), "'d' must be an instance of interface 'Interface1'");
            ok(JSC.isFunction(d.initialize), "member method must exist");
            ok(JSC.isFunction(d.fn), "member method must exist");
            equal(d.value, "member", "member attribute must exist");
            for(i = 0; i < 4; i++) {
                equal(D.getInstance(i), d, "only one instance must be created in a singleton");
                equal(D.getInstance(i).guid, d.guid, "only one instance must be created in a singleton");
            }

            value = "";
            a.fn();
            equal(value, "A.fn", "value alterred by member function");

            fn = a.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, a.fn, "attached function must not be equal to original one");
            equal(fn.guid, a.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, a.attach("fn").guid, "each attached function must have same id");
            equal(fn, a.attach("fn"), "each attached function must be equal");
            notEqual(fn, a.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            fn();
            equal(value, "A.fn", "value alterred by member function");

            value = "";
            b.fn();
            equal(value, "B.fn", "value alterred by member function");

            fn = b.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, b.fn, "attached function must not be equal to original one");
            equal(fn.guid, b.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, b.attach("fn").guid, "each attached function must have same id");
            equal(fn, b.attach("fn"), "each attached function must be equal");
            notEqual(fn, b.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            fn();
            equal(value, "B.fn", "value alterred by member function");

            value = "";
            c.fn();
            equal(value, "C.fn", "value alterred by member function");

            fn = c.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, c.fn, "attached function must not be equal to original one");
            equal(fn.guid, c.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, c.attach("fn").guid, "each attached function must have same id");
            equal(fn, c.attach("fn"), "each attached function must be equal");
            notEqual(fn, c.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            fn();
            equal(value, "C.fn", "value alterred by member function");

            raises(function(){
                JSC.Singleton({
                    superClass : "undefinedClass",
                    className : "D",
                    initialize : function() {
                        value += "C";
                        this.inherited();
                    }
                })
            }, "An error must be throwed when super class is unknown");
        },

        /**
         * Test of JSC.Multiton()
         */
        Multiton: function() {
            var value, i, A, B, C, D, a, aa, b, bb, c, cc, d, dd, fn, throwed;

            try {
                A = JSC.Multiton();
                ok(JSC.isFunction(A), "Multiton class definition must be returned when no parameter is given to builder");
            } catch(e) {
                ok(false, "Multiton class builder must be call without parameters");
            }

            try {
                A = JSC.Multiton("AA");
                ok(JSC.isFunction(A), "Multiton class definition must be returned when only name parameter is given to builder");
                equal(JSC.type(A), "AA", "Type of a multiton class must be its name");
            } catch(e) {
                ok(false, "Multiton class builder must be call with only name parameter");
            }

            value = undefined;
            A = JSC.Multiton("A", {
                initialize : function() {
                    value += "A";
                },
                fn : function() {
                    value = this.className + ".fn";
                }
            });
            equal(JSC.type(A), "A", "Type of a multiton class must be its name");
            equal(value, undefined, "value must not be altered by multiton class inheritance mechanism");

            value = undefined;
            B = JSC.globalize(JSC.Multiton({
                superClass : A,
                className : "B",
                initialize : function() {
                    this.inherited();
                    value += "B";
                },
                value : "member"
            }));
            equal(JSC.type(B), "B", "Type of a multiton class must be its name");
            equal(value, undefined, "value must not be altered by multiton class inheritance mechanism");
            ok(JSC.isInherited(B.prototype.initialize), "method must be tagged as overriding");

            value = undefined;
            C = JSC.Multiton({
                superClass : "B",
                className : "C"
            }).extend({
                fn2 : function() {
                    this.value = "fn2";
                }
            }).implement({
                className : 'Interface1',
                fn3 : function() {
                    this.value = "fn3";
                }
            }).implement(["fn4", "fn5"], 'Interface2');
            ok(JSC.isFunction(C), "Class.extend() must return the class");
            ok(C.interfaces.Interface1, "class must implement interface Interface1");
            ok(C.interfaces.Interface2, "class must implement interface Interface2");
            ok(JSC.isFunction(C.prototype.fn2), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn3), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn4), "method fn2 must be implemented");
            ok(JSC.isFunction(C.prototype.fn5), "method fn2 must be implemented");
            equal(JSC.type(C), "C", "Type of a multiton class must be its name");
            equal(value, undefined, "value must not be altered by multiton class inheritance mechanism");

            value = undefined;
            D = JSC.Multiton("D", {
                superClass : C,
                className : "truc",
                initialize : function() {
                    value += "D";
                    this.inherited();
                },
                fn : function() {
                    this.inherited();
                }
            });
            equal(JSC.type(D), "D", "Type of a multiton class must be its name");
            equal(D.className, "D", "Class name must be equal to name parameter, even if given in definition list");
            equal(value, undefined, "value must not be altered by multiton class inheritance mechanism");
            ok(JSC.isInherited(D.prototype.initialize), "method must be tagged as overriding");
            ok(JSC.isInherited(D.prototype.fn), "method must be tagged as overriding");

            value = "";
            throwed = false;
            try {
                a = new A();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === a, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on multiton class");
            equal(value, "", "value must not be altered by multiton direct instantiation avoiding");

            a = A.getInstance("a");
            equal(JSC.type(a), "A", "Type of a class instance must be its class name");
            equal(a.constructor, A, "a reference to the class must be present into the built instance");
            equal(value, "A", "value after base class creation");
            ok(a instanceof A, "'a' must be an instance of class 'A'");
            ok(JSC.instanceOf(a, A), "'a' must be an instance of class 'A'");
            ok(JSC.isFunction(a.initialize), "member method must exist");
            ok(JSC.isFunction(a.fn), "member method must exist");
            equal(a.value, undefined, "no member attribute");
            for(i = 0; i < 4; i++) {
                equal(A.getInstance("a"), a, "only one instance must be created in a multiton for a given key");
                equal(A.getInstance("a").guid, a.guid, "only one instance must be created in a multiton for a given key");
            }
            notEqual(aa = A.getInstance(), a, "another key must produce another instance in multiton pattern");
            notEqual(A.getInstance().guid, a.guid, "another key must produce another instance in multiton pattern");
            equal(A.getInstance(), aa, "only one instance must be created in a multiton for a given key");
            equal(A.getInstance().guid, aa.guid, "only one instance must be created in a multiton for a given key");
            for(i = 0; i < 4; i++) {
                notEqual(aa = A.getInstance(i), a, "another key must produce another instance in multiton pattern");
                notEqual(A.getInstance(i).guid, a.guid, "another key must produce another instance in multiton pattern");
                equal(A.getInstance(i), aa, "only one instance must be created in a multiton for a given key");
                equal(A.getInstance(i).guid, aa.guid, "only one instance must be created in a multiton for a given key");
            }

            value = "";
            throwed = false;
            try {
                b = new B();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === b, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on multiton class");
            equal(value, "", "value must not be altered by multiton direct instantiation avoiding");

            b = B.getInstance("b");
            equal(JSC.type(b), "B", "Type of a class instance must be its class name");
            equal(b.constructor, B, "a reference to the class must be present into the built instance");
            equal(value, "AB", "value after first sub-class creation");
            ok(b instanceof A, "'b' must be an instance of class 'A'");
            ok(b instanceof B, "'b' must be an instance of class 'B'");
            ok(JSC.instanceOf(b, A), "'b' must be an instance of class 'A'");
            ok(JSC.instanceOf(b, B), "'b' must be an instance of class 'B'");
            ok(JSC.instanceOf(b, "B"), "'b' must be an instance of class 'B'");
            ok(JSC.isFunction(b.initialize), "member method must exist");
            ok(JSC.isFunction(b.fn), "member method must exist");
            equal(b.value, "member", "member attribute must exist");
            for(i = 0; i < 4; i++) {
                equal(B.getInstance("b"), b, "only one instance must be created in a multiton for a given key");
                equal(B.getInstance("b").guid, b.guid, "only one instance must be created in a multiton for a given key");
            }
            notEqual(bb = B.getInstance(), b, "another key must produce another instance in multiton pattern");
            notEqual(B.getInstance().guid, b.guid, "another key must produce another instance in multiton pattern");
            equal(B.getInstance(), bb, "only one instance must be created in a multiton for a given key");
            equal(B.getInstance().guid, bb.guid, "only one instance must be created in a multiton for a given key");
            for(i = 0; i < 4; i++) {
                notEqual(bb = B.getInstance(i), b, "another key must produce another instance in multiton pattern");
                notEqual(B.getInstance(i).guid, b.guid, "another key must produce another instance in multiton pattern");
                equal(B.getInstance(i), bb, "only one instance must be created in a multiton for a given key");
                equal(B.getInstance(i).guid, bb.guid, "only one instance must be created in a multiton for a given key");
            }

            value = "";
            throwed = false;
            try {
                c = new C();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === c, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on multiton class");
            equal(value, "", "value must not be altered by multiton direct instantiation avoiding");

            c = C.getInstance("c");
            equal(JSC.type(c), "C", "Type of a class instance must be its class name");
            equal(c.constructor, C, "a reference to the class must be present into the built instance");
            equal(value, "AB", "value after second sub-class creation");
            ok(c instanceof A, "'c' must be an instance of class 'A'");
            ok(c instanceof B, "'c' must be an instance of class 'B'");
            ok(c instanceof C, "'c' must be an instance of class 'C'");
            ok(JSC.instanceOf(c, A), "'c' must be an instance of class 'A'");
            ok(JSC.instanceOf(c, B), "'c' must be an instance of class 'B'");
            ok(JSC.instanceOf(c, "B"), "'c' must be an instance of class 'B'");
            ok(JSC.instanceOf(c, C), "'c' must be an instance of class 'C'");
            ok(JSC.instanceOf(c, "Interface1"), "'c' must be an instance of interface 'Interface1'");
            ok(JSC.isFunction(c.initialize), "member method must exist");
            ok(JSC.isFunction(c.fn), "member method fn must exist");
            ok(JSC.isFunction(c.fn2), "member method fn2 must exist");
            ok(JSC.isFunction(c.fn3), "member method fn3 must exist");
            ok(JSC.isFunction(c.fn4), "member method fn4 must exist");
            ok(JSC.isFunction(c.fn5), "member method fn5 must exist");
            equal(c.value, "member", "member attribute must exist");
            c.fn2();
            equal(c.value, "fn2", "member attribute must be altered by fn2");
            c.fn3();
            equal(c.value, "fn3", "member attribute must be altered by fn3");
            for(i = 0; i < 4; i++) {
                equal(C.getInstance("c"), c, "only one instance must be created in a multiton for a given key");
                equal(C.getInstance("c").guid, c.guid, "only one instance must be created in a multiton for a given key");
            }
            notEqual(cc = C.getInstance(), c, "another key must produce another instance in multiton pattern");
            notEqual(C.getInstance().guid, c.guid, "another key must produce another instance in multiton pattern");
            equal(C.getInstance(), cc, "only one instance must be created in a multiton for a given key");
            equal(C.getInstance().guid, cc.guid, "only one instance must be created in a multiton for a given key");
            for(i = 0; i < 4; i++) {
                notEqual(cc = C.getInstance(i), c, "another key must produce another instance in multiton pattern");
                notEqual(C.getInstance(i).guid, c.guid, "another key must produce another instance in multiton pattern");
                equal(C.getInstance(i), cc, "only one instance must be created in a multiton for a given key");
                equal(C.getInstance(i).guid, cc.guid, "only one instance must be created in a multiton for a given key");
            }

            throwed = false;
            try {
                c.fn4();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "C.fn4", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "calling of abstract method fn4 must throw an exception");

            throwed = false;
            try {
                c.fn5();
            } catch(e) {
                throwed = true;
                if( e instanceof JSCError ) {
                    equal(e.context, "C.fn5", "Error thrown must set right context for unnamed abstract method");
                } else {
                    ok(false, "Throwed error is not an instance of JSCError !");
                }
            }
            ok(throwed, "calling of abstract method fn5 must throw an exception");

            value = "";
            throwed = false;
            try {
                d = new D();
            } catch(e) {
                throwed = true;
            }
            ok(undefined === d, "no instance must be created by direct instantiation");
            ok(throwed, "An exception must be throwed when direct instantiation attempts is made on multiton class");
            equal(value, "", "value must not be altered by multiton direct instantiation avoiding");

            d = D.getInstance("d");
            equal(JSC.type(d), "D", "Type of a class instance must be its class name");
            equal(d.constructor, D, "a reference to the class must be present into the built instance");
            equal(value, "DAB", "value after second sub-class creation");
            ok(d instanceof A, "'d' must be an instance of class 'A'");
            ok(d instanceof B, "'d' must be an instance of class 'B'");
            ok(d instanceof C, "'d' must be an instance of class 'C'");
            ok(d instanceof D, "'d' must be an instance of class 'D'");
            ok(JSC.instanceOf(d, A), "'d' must be an instance of class 'A'");
            ok(JSC.instanceOf(d, B), "'d' must be an instance of class 'B'");
            ok(JSC.instanceOf(d, "B"), "'d' must be an instance of class 'B'");
            ok(JSC.instanceOf(d, C), "'d' must be an instance of class 'C'");
            ok(JSC.instanceOf(d, D), "'d' must be an instance of class 'D'");
            ok(JSC.instanceOf(d, "Interface1"), "'d' must be an instance of interface 'Interface1'");
            ok(JSC.isFunction(d.initialize), "member method must exist");
            ok(JSC.isFunction(d.fn), "member method must exist");
            equal(d.value, "member", "member attribute must exist");
            for(i = 0; i < 4; i++) {
                equal(D.getInstance("d"), d, "only one instance must be created in a multiton for a given key");
                equal(D.getInstance("d").guid, d.guid, "only one instance must be created in a multiton for a given key");
            }
            notEqual(dd = D.getInstance(), d, "another key must produce another instance in multiton pattern");
            notEqual(D.getInstance().guid, d.guid, "another key must produce another instance in multiton pattern");
            equal(D.getInstance(), dd, "only one instance must be created in a multiton for a given key");
            equal(D.getInstance().guid, dd.guid, "only one instance must be created in a multiton for a given key");
            for(i = 0; i < 4; i++) {
                notEqual(dd = D.getInstance(i), d, "another key must produce another instance in multiton pattern");
                notEqual(D.getInstance(i).guid, d.guid, "another key must produce another instance in multiton pattern");
                equal(D.getInstance(i), dd, "only one instance must be created in a multiton for a given key");
                equal(D.getInstance(i).guid, dd.guid, "only one instance must be created in a multiton for a given key");
            }

            value = "";
            a.fn();
            equal(value, "A.fn", "value alterred by member function");

            fn = a.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, a.fn, "attached function must not be equal to original one");
            equal(fn.guid, a.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, a.attach("fn").guid, "each attached function must have same id");
            equal(fn, a.attach("fn"), "each attached function must be equal");
            notEqual(fn, a.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            fn();
            equal(value, "A.fn", "value alterred by member function");

            value = "";
            b.fn();
            equal(value, "B.fn", "value alterred by member function");

            fn = b.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, b.fn, "attached function must not be equal to original one");
            equal(fn.guid, b.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, b.attach("fn").guid, "each attached function must have same id");
            equal(fn, b.attach("fn"), "each attached function must be equal");
            notEqual(fn, b.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            fn();
            equal(value, "B.fn", "value alterred by member function");

            value = "";
            c.fn();
            equal(value, "C.fn", "value alterred by member function");

            fn = c.attach("fn");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, c.fn, "attached function must not be equal to original one");
            equal(fn.guid, c.fn.guid, "attached function must have same id that original one");
            equal(fn.guid, c.attach("fn").guid, "each attached function must have same id");
            equal(fn, c.attach("fn"), "each attached function must be equal");
            notEqual(fn, c.attach("fn", true), "when rewriting is required, attached function must not be equal to old one");

            value = "";
            fn();
            equal(value, "C.fn", "value alterred by member function");

            raises(function(){
                JSC.Multiton({
                    superClass : "undefinedClass",
                    className : "D",
                    initialize : function() {
                        value += "C";
                        this.inherited();
                    }
                })
            }, "An error must be throwed when super class is unknown");
        },

        /**
         * Test of JSC.Make()
         */
        Make : function() {
            var value, A, B, C, D, a, b, c, d, e, f, fn, throwed, version = 0;

            throwed = false;
            try {
                A = JSC.Make();
            } catch(e) {
                throwed = true;
            }
            ok(JSC.isFunction(A), "Class definition must be returned when no parameter is given to builder");
            ok(!throwed, "Class builder must be call without parameters");

            throwed = false;
            try {
                A = JSC.Make({value: null});
                a = new A();
            } catch(e) {
                throwed = true;
            }
            ok(JSC.isFunction(A), "Class definition must be returned when simple definition is given to builder");
            ok(!throwed, "Class builder must be call with simple definition");
            ok("undefined" === typeof A.value, "Class must not have static member affected from given definition");
            ok("undefined" !== typeof a.value, "Instance must have member affected from given definition");

            throwed = false;
            value = 3;
            try {
                A = JSC.Make("", true, {value: value}, 0, {version: ++ version});
                a = new A();
            } catch(e) {
                throwed = true;
            }
            ok(JSC.isFunction(A), "Class definition must be returned when simple definition is given to builder");
            ok(!throwed, "Class builder must be call with simple definition");
            ok("undefined" === typeof A.value, "Class must not have static member affected from given definition");
            ok("undefined" !== typeof A.version, "Class must have static member affected from given definition");
            equal(A.version, version, "Static member a new class must be equal to expected value");
            equal(a.value, value, "Instance must have member affected from given definition");

            throwed = false;
            value = 5;
            try {
                A = JSC.Make(0, {value: value}, {version: ++ version}, "singleton");
                a = A.getInstance();
                b = A.getInstance();
                c = A.getInstance();
            } catch(e) {
                throwed = true;
            }
            ok(JSC.isFunction(A), "Class definition must be returned when simple definition is given to builder");
            ok(!throwed, "Class builder must be call with simple definition");
            ok("undefined" === typeof A.value, "Class must not have static member affected from given definition");
            ok("undefined" !== typeof A.version, "Class must have static member affected from given definition");
            equal(A.version, version, "Static member a new class must be equal to expected value");
            equal(a.value, value, "Instance must have member affected from given definition");
            ok(a === b && a === c && a.guid === b.guid && a.guid === c.guid, "Each call of getInstance must return same instance");

            throwed = false;
            try {
                new A();
            } catch(e) {
                throwed = true;
            }
            ok(throwed, "Class must be a singleton and not be directly instantiable");

            throwed = false;
            value = 20;
            try {
                A = JSC.Make("multiton", {value: value}, true, {version: ++ version});
                a = A.getInstance(1);
                b = A.getInstance(1);
                c = A.getInstance(2);
                d = A.getInstance(2);
                e = A.getInstance(3);
                f = A.getInstance(3);
            } catch(e) {
                throwed = true;
            }
            ok(JSC.isFunction(A), "Class definition must be returned when simple definition is given to builder");
            ok(!throwed, "Class builder must be call with simple definition");
            ok("undefined" === typeof A.value, "Class must not have static member affected from given definition");
            ok("undefined" !== typeof A.version, "Class must have static member affected from given definition");
            equal(A.version, version, "Static member a new class must be equal to expected value");
            equal(a.value, value, "Instance must have member affected from given definition");
            ok(a === b && a.guid === b.guid, "Each call of getInstance for key 1 must return same instance");
            ok(c === d && c.guid === d.guid, "Each call of getInstance for key 2 must return same instance");
            ok(e === f && e.guid === f.guid, "Each call of getInstance for key 3 must return same instance");
            ok(a !== c && a !== e && c !== e && a.guid !== c.guid && a.guid !== e.guid && c.guid !== e.guid, "Calls of getInstance for different keys must return different instances");

            throwed = false;
            try {
                new A();
            } catch(e) {
                throwed = true;
            }
            ok(throwed, "Class must be a multiton and not be directly instantiable");


            throwed = false;
            value = "local";
            try {
                A = JSC.Make({className: "AMake", value: value}, false, {version: ++ version}, "");
                a = new A();
            } catch(e) {
                throwed = true;
            }
            ok(!JSC.global("AMake"), "Class must not be global");
            ok(JSC.isFunction(A), "Class definition must be returned when simple definition is given to builder");
            ok(!throwed, "Class builder must be call with simple definition");
            ok("undefined" === typeof A.value, "Class must not have static member affected from given definition");
            ok("undefined" !== typeof A.version, "Class must have static member affected from given definition");
            equal(A.version, version, "Static member a new class must be equal to expected value");
            equal(a.value, value, "Instance must have member affected from given definition");

            throwed = false;
            value = "global";
            try {
                A = JSC.Make({className: "AMake", value: value}, {version: ++ version}, "");
                a = new AMake();
            } catch(e) {
                throwed = true;
            }
            ok(JSC.global("AMake"), "Class must be global");
            ok(JSC.isFunction(A), "Class definition must be returned when simple definition is given to builder");
            ok(!throwed, "Class builder must be call with simple definition");
            ok("undefined" === typeof A.value, "Class must not have static member affected from given definition");
            ok("undefined" !== typeof A.version, "Class must have static member affected from given definition");
            equal(A.version, version, "Static member a new class must be equal to expected value");
            equal(a.value, value, "Instance must have member affected from given definition");
        }
    };
    new TestSuite(suite, true);
})();
