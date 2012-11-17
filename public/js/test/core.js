/*!
 * Test Suite for JavaScript Class Library v0.1 (JSC v0.1)
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(window, undefined) {
    var testSuiteJSC = {
        _name : "JSC",

        /**
         * Test of JSC
         */
        JSC : function() {
            ok("undefined" != typeof JSC, "JSC must exist");
            ok("undefined" != typeof JSC.className, "Class name of JSC must be defined");
            ok("undefined" != typeof JSC.version, "Version of JSC must be defined");
        },

        /**
         * Test of JSC.id()
         */
        id : function() {
            var value_1 = JSC.id(), value_2 = JSC.id();
            equal(typeof value_1, "number", "Generated identifiers have to be number");
            equal(typeof value_2, "number", "Generated identifiers have to be number");
            notEqual(value_1, value_2, "Generated identifiers have to be unique");
        },

        /**
         * Test of JSC.tag()
         */
        tag : function() {
            var value_1 = {}, value_2 = {}, value_3 = {}, guid = -1;

            equal(value_1.guid, undefined, "Initial GUID");
            equal(value_2.guid, undefined, "Initial GUID");

            var ret_1 = JSC.tag(value_1);
            var ret_2 = JSC.tag(value_2);
            var ret_3 = JSC.tag(value_3, guid);
            var ret_4 = JSC.tag(JSC);
            var ret_5 = JSC.tag(JSC, guid);

            notEqual(ret_1, undefined, "A GUID have to be set");
            notEqual(ret_2, undefined, "A GUID have to be set");
            notEqual(ret_3, undefined, "A GUID have to be set");
            notEqual(ret_4, undefined, "A GUID have to be set");
            notEqual(ret_5, undefined, "A GUID have to be set");
            equal(ret_3, guid, "Got GUID must be equal to given one");
            equal(ret_4, JSC.guid, "Got GUID must be equal to given one");
            equal(ret_5, JSC.guid, "Got GUID must be equal to given one");

            equal(typeof ret_1, "number", "A GUID have to be a number");
            equal(typeof ret_2, "number", "A GUID have to be a number");
            equal(typeof ret_3, "number", "A GUID have to be a number");
            equal(typeof ret_4, "number", "A GUID have to be a number");
            equal(typeof ret_5, "number", "A GUID have to be a number");

            notEqual(value_1.guid, undefined, "A GUID have to be set");
            notEqual(value_2.guid, undefined, "A GUID have to be set");
            notEqual(value_3.guid, undefined, "A GUID have to be set");
            notEqual(JSC.guid, undefined, "A GUID have to be set");

            notEqual(ret_1, ret_2, "Generated identifiers have to be unique");
            notEqual(value_1.guid, value_2.guid, "Generated identifiers have to be unique");
        },

        /**
         * Test of JSC.type()
         */
        type : function() {
            // type of undefined
            var undef;
            equal(JSC.type(), "undefined", "Type of undefined");
            equal(JSC.type(undef), "undefined", "Type of undefined variable");
            equal(JSC.type(undefined), "undefined", "Type of undefined value");

            // type of Date
            equal(JSC.type(new Date()), "Date", "Type of Date value");

            // type of RexExp
            equal(JSC.type(new RegExp()), "RegExp", "Type of RegExp value");
            equal(JSC.type(/test/), "RegExp", "Type of RegExp value");

            // type of Boolean
            equal(JSC.type(new Boolean()), "Boolean", "Type of Boolean value");
            equal(JSC.type(true), "Boolean", "Type of Boolean value");
            equal(JSC.type(false), "Boolean", "Type of Boolean value");

            // type of String
            equal(JSC.type(new String()), "String", "Type of String value");
            equal(JSC.type(""), "String", "Type of String value");
            equal(JSC.type("test"), "String", "Type of String value");

            // type of Array
            equal(JSC.type(new Array()), "Array", "Type of Array value");
            equal(JSC.type([]), "Array", "Type of Array value");
            equal(JSC.type("1,2,3".split(',')), "Array", "Type of Array value");

            // type of Number
            equal(JSC.type(new Number()), "Number", "Type of Number value");
            equal(JSC.type(-1), "Number", "Type of Number value");
            equal(JSC.type(0), "Number", "Type of Number value");
            equal(JSC.type(10), "Number", "Type of Number value");
            equal(JSC.type(14.501), "Number", "Type of Number value");

            // type of Object
            equal(JSC.type(new Object()), "Object", "Type of Object value");
            equal(JSC.type({}), "Object", "Type of Object value");

            // type of Function
            equal(JSC.type(new Function()), "Function", "Type of Function value");
            equal(JSC.type(function(){}), "Function", "Type of Function value");
            equal(JSC.type(JSC.type), "Function", "Type of Function value");

            // type of Window
            equal(JSC.type(window), "Window", "Type of Window object");

            // type of Document
            equal(JSC.type(window.document), "Document", "Type of Window object");

            // type of Class/object build by the library
            var mokName = "JSCTypeClass";
            var mokClass = function(){};
            mokClass.prototype.className = mokClass.className = mokName;
            equal(JSC.type(mokClass), mokName, "Type of library created class");
            equal(JSC.type(new mokClass()), mokName, "Type of library created object");
        },

        /**
         * Test of JSC.isFunction()
         */
        isFunction : function() {
            equal(JSC.isFunction(undefined), false, "an undefined value must not be considered as a function");
            equal(JSC.isFunction(null), false, "a null value must not be considered as a function");
            equal(JSC.isFunction({}), false, "an object must not be considered as a function");
            equal(JSC.isFunction(new Object()), false, "an object must not be considered as a function");
            equal(JSC.isFunction([]), false, "an array must not be considered as a function");
            equal(JSC.isFunction(new Array()), false, "an array must not be considered as a function");
            equal(JSC.isFunction("function"), false, "a string must not be considered as a function");
            equal(JSC.isFunction(new String()), false, "a string must not be considered as a function");
            equal(JSC.isFunction(10), false, "a number must not be considered as a function");
            equal(JSC.isFunction(new Number()), false, "a number must not be considered as a function");
            equal(JSC.isFunction(true), false, "a boolean must not be considered as a function");
            equal(JSC.isFunction(new Boolean()), false, "a boolean must not be considered as a function");
            equal(JSC.isFunction(/xyz/), false, "a regex must not be considered as a function");
            equal(JSC.isFunction(new RegExp), false, "a regex must not be considered as a function");

            equal(JSC.isFunction(function(){}), true, "a function must be considered as a function");
            equal(JSC.isFunction(new Function()), true, "a function must be considered as a function");
            equal(JSC.isFunction(JSC.Class("A")), true, "a class definition must be considered as a function");
        },

        /**
         * Test of JSC.isAbstract()
         */
        isAbstract : function() {
            equal(JSC.isAbstract(undefined), false, "an undefined value must not be considered as an abstract function");
            equal(JSC.isAbstract(null), false, "a null value must not be considered as an abstract function");
            equal(JSC.isAbstract({}), false, "an object must not be considered as an abstract function");
            equal(JSC.isAbstract(new Object()), false, "an object must not be considered as an abstract function");
            equal(JSC.isAbstract([]), false, "an array must not be considered as an abstract function");
            equal(JSC.isAbstract(new Array()), false, "an array must not be considered as an abstract function");
            equal(JSC.isAbstract("function"), false, "a string must not be considered as an abstract function");
            equal(JSC.isAbstract(new String()), false, "a string must not be considered as an abstract function");
            equal(JSC.isAbstract(10), false, "a number must not be considered as an abstract function");
            equal(JSC.isAbstract(new Number()), false, "a number must not be considered as an abstract function");
            equal(JSC.isAbstract(true), false, "a boolean must not be considered as an abstract function");
            equal(JSC.isAbstract(new Boolean()), false, "a boolean must not be considered as an abstract function");
            equal(JSC.isAbstract(/xyz/), false, "a regex must not be considered as an abstract function");
            equal(JSC.isAbstract(new RegExp), false, "a regex must not be considered as an abstract function");
            equal(JSC.isAbstract(function(){}), false, "a standard function must not be considered as an abstract function");
            equal(JSC.isAbstract(new Function()), false, "a standard function must not be considered as an abstract function");
            equal(JSC.isAbstract(JSC.Class("A")), false, "a class definition must not be considered as an abstract function");

            equal(JSC.isAbstract(JSC.abstractMethod()), true, "an unnamed abstract function must be considered as an abstract function");
            equal(JSC.isAbstract(JSC.abstractMethod("test")), true, "a named abstract function must be considered as an abstract function");
        },

        /**
         * Test of JSC.isAttached()
         */
        isAttached : function() {
            equal(JSC.isAttached(undefined), false, "an undefined value must not be considered as an attached function");
            equal(JSC.isAttached(null), false, "a null value must not be considered as an attached function");
            equal(JSC.isAttached({}), false, "an object must not be considered as an attached function");
            equal(JSC.isAttached(new Object()), false, "an object must not be considered as an attached function");
            equal(JSC.isAttached([]), false, "an array must not be considered as an attached function");
            equal(JSC.isAttached(new Array()), false, "an array must not be considered as an attached function");
            equal(JSC.isAttached("function"), false, "a string must not be considered as an attached function");
            equal(JSC.isAttached(new String()), false, "a string must not be considered as an attached function");
            equal(JSC.isAttached(10), false, "a number must not be considered as an attached function");
            equal(JSC.isAttached(new Number()), false, "a number must not be considered as an attached function");
            equal(JSC.isAttached(true), false, "a boolean must not be considered as an attached function");
            equal(JSC.isAttached(new Boolean()), false, "a boolean must not be considered as an attached function");
            equal(JSC.isAttached(/xyz/), false, "a regex must not be considered as an attached function");
            equal(JSC.isAttached(new RegExp), false, "a regex must not be considered as an attached function");
            equal(JSC.isAttached(function(){}), false, "a standard function must not be considered as an attached function");
            equal(JSC.isAttached(new Function()), false, "a standard function must not be considered as an attached function");
            equal(JSC.isAttached(JSC.Class("A")), false, "a class definition must not be considered as an attached function");

            equal(JSC.isAttached(JSC.attach(function(){}, this)), true, "an unnamed attached function must be considered as an attached function");
            equal(JSC.isAttached(JSC.attach({test: function(){}}, "test")), true, "a named attached function must be considered as an attached function");
        },

        /**
         * Test of JSC.isInherited()
         */
        isInherited : function() {
            equal(JSC.isInherited(undefined), false, "an undefined value must not be considered as a function using inheritance");
            equal(JSC.isInherited(null), false, "a null value must not be considered as a function using inheritance");
            equal(JSC.isInherited({}), false, "an object must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Object()), false, "an object must not be considered as a function using inheritance");
            equal(JSC.isInherited([]), false, "an array must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Array()), false, "an array must not be considered as a function using inheritance");
            equal(JSC.isInherited("function"), false, "a string must not be considered as a function using inheritance");
            equal(JSC.isInherited(new String()), false, "a string must not be considered as a function using inheritance");
            equal(JSC.isInherited(10), false, "a number must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Number()), false, "a number must not be considered as a function using inheritance");
            equal(JSC.isInherited(true), false, "a boolean must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Boolean()), false, "a boolean must not be considered as a function using inheritance");
            equal(JSC.isInherited(/xyz/), false, "a regex must not be considered as a function using inheritance");
            equal(JSC.isInherited(new RegExp), false, "a regex must not be considered as a function using inheritance");
            equal(JSC.isInherited(function(){}), false, "a standard function must not be considered as a function using inheritance");
            equal(JSC.isInherited(new Function()), false, "a standard function must not be considered as a function using inheritance");
            equal(JSC.isInherited(JSC.Class("A")), false, "a class definition must not be considered as a function using inheritance");

            equal(JSC.isInherited(JSC.override(function(){this.inherited();}, function(){})), true, "an overriding function must be considered as a function using inheritance");
        },

        /**
         * Test of JSC.isArray()
         */
        isArray : function() {
            equal(JSC.isArray(undefined), false, "an undefined value must not be considered as an array");
            equal(JSC.isArray(null), false, "a null value must not be considered as an array");
            equal(JSC.isArray({}), false, "an object must not be considered as an array");
            equal(JSC.isArray(new Object()), false, "an object must not be considered as an array");
            equal(JSC.isArray(function(){}), false, "a function must not be considered as an array");
            equal(JSC.isArray(new Function()), false, "a function must not be considered as an array");
            equal(JSC.isArray(JSC.Class("A")), false, "a class definition must not be considered as an array");
            equal(JSC.isArray("array"), false, "a string must not be considered as an array");
            equal(JSC.isArray(new String()), false, "a string must not be considered as an array");
            equal(JSC.isArray(10), false, "a number must not be considered as an array");
            equal(JSC.isArray(new Number()), false, "a number must not be considered as an array");
            equal(JSC.isArray(true), false, "a boolean must not be considered as an array");
            equal(JSC.isArray(new Boolean()), false, "a boolean must not be considered as an array");
            equal(JSC.isArray(/xyz/), false, "a regex must not be considered as an array");
            equal(JSC.isArray(new RegExp), false, "a regex must not be considered as an array");

            equal(JSC.isArray([]), true, "an array must be considerer as an array");
            equal(JSC.isArray(new Array()), true, "an array must be considerer as an array");
        },

        /**
         * Test of JSC.isObject()
         */
        isObject : function() {
            equal(JSC.isObject(undefined), false, "an undefined value must not be considered as an object");
            equal(JSC.isObject(null), false, "a null value must not be considered as an object");
            equal(JSC.isObject([]), false, "an array must not be considered as an object");
            equal(JSC.isObject(new Array()), false, "an array must not be considered as an object");
            equal(JSC.isObject(function(){}), false, "a function must not be considered as an object");
            equal(JSC.isObject(new Function()), false, "a function must not be considered as an object");
            equal(JSC.isObject(JSC.Class("A")), false, "a class definition must not be considered as an object");
            equal(JSC.isObject("array"), false, "a string must not be considered as an object");
            equal(JSC.isObject(new String()), false, "a string must not be considered as an object");
            equal(JSC.isObject(10), false, "a number must not be considered as an object");
            equal(JSC.isObject(new Number()), false, "a number must not be considered as an object");
            equal(JSC.isObject(true), false, "a boolean must not be considered as an object");
            equal(JSC.isObject(new Boolean()), false, "a boolean must not be considered as an object");
            equal(JSC.isObject(/xyz/), false, "a regex must not be considered as an object");
            equal(JSC.isObject(new RegExp), false, "a regex must not be considered as an object");

            equal(JSC.isObject({}), true, "an object must be considerer as an object");
            equal(JSC.isObject(new Object()), true, "an object must be considerer as an object");
        },

        /**
         * Test of JSC.isString()
         */
        isString : function() {
            equal(JSC.isString(undefined), false, "an undefined value must not be considered as a string");
            equal(JSC.isString(null), false, "a null value must not be considered as a string");
            equal(JSC.isString({}), false, "an object must not be considered as a string");
            equal(JSC.isString(new Object()), false, "an object must not be considered as a string");
            equal(JSC.isString([]), false, "an array must not be considered as a string");
            equal(JSC.isString(new Array()), false, "an array must not be considered as a string");
            equal(JSC.isString(function(){}), false, "a function must not be considered as a string");
            equal(JSC.isString(JSC.Class("A")), false, "a class definition must not be considered as a string");
            equal(JSC.isString(new Function()), false, "a function must not be considered as a string");
            equal(JSC.isString(10), false, "a number must not be considered as a string");
            equal(JSC.isString(new Number()), false, "a number must not be considered as a string");
            equal(JSC.isString(true), false, "a boolean must not be considered as a string");
            equal(JSC.isString(new Boolean()), false, "a boolean must not be considered as a string");
            equal(JSC.isString(/xyz/), false, "a regex must not be considered as a string");
            equal(JSC.isString(new RegExp()), false, "a regex must not be considered as a string");

            equal(JSC.isString(""), true, "a string must be considered as a string");
            equal(JSC.isString(new String()), true, "a string must be considered as a string");
        },

        /**
         * Test of JSC.isBool()
         */
        isBool : function() {
            equal(JSC.isBool(undefined), false, "an undefined value must not be considered as a boolean");
            equal(JSC.isBool(null), false, "a null value must not be considered as a boolean");
            equal(JSC.isBool({}), false, "an object must not be considered as a boolean");
            equal(JSC.isBool(new Object()), false, "an object must not be considered as a boolean");
            equal(JSC.isBool([]), false, "an array must not be considered as a boolean");
            equal(JSC.isBool(new Array()), false, "an array must not be considered as a boolean");
            equal(JSC.isBool(function(){}), false, "a function must not be considered as a boolean");
            equal(JSC.isBool(JSC.Class("A")), false, "a class definition must not be considered as a boolean");
            equal(JSC.isBool(new Function()), false, "a function must not be considered as a boolean");
            equal(JSC.isBool(10), false, "a number must not be considered as a boolean");
            equal(JSC.isBool(new Number()), false, "a number must not be considered as a boolean");
            equal(JSC.isBool("true"), false, "a string must not be considered as a boolean");
            equal(JSC.isBool(new String()), false, "a boolean must not be considered as a boolean");
            equal(JSC.isBool(/xyz/), false, "a regex must not be considered as a boolean");
            equal(JSC.isBool(new RegExp()), false, "a regex must not be considered as a boolean");

            equal(JSC.isBool(true), true, "a boolean must be considered as a boolean");
            equal(JSC.isBool(false), true, "a boolean must be considered as a boolean");
            equal(JSC.isBool(new Boolean()), true, "a boolean must be considered as a boolean");
        },

        /**
         * Test of JSC.isNumeric()
         */
        isNumeric : function() {
            equal(JSC.isNumeric(undefined), false, "an undefined value must not be considered as a numeric value");
            equal(JSC.isNumeric(null), false, "a null value must not be considered as a numeric value");
            equal(JSC.isNumeric({}), false, "an object must not be considered as a numeric value");
            equal(JSC.isNumeric(new Object()), false, "an object must not be considered as a numeric value");
            equal(JSC.isNumeric([]), false, "an array must not be considered as a numeric value");
            equal(JSC.isNumeric(new Array()), false, "an array must not be considered as a numeric value");
            equal(JSC.isNumeric(function(){}), false, "a function must not be considered as a numeric value");
            equal(JSC.isNumeric(JSC.Class("A")), false, "a class definition must not be considered as a numeric value");
            equal(JSC.isNumeric(new Function()), false, "a function must not be considered as a numeric value");
            equal(JSC.isNumeric("ddd"), false, "a string must not be considered as a numeric value");
            equal(JSC.isNumeric(new String()), false, "a string must not be considered as a numeric value");
            equal(JSC.isNumeric(true), false, "a boolean must not be considered as a numeric value");
            equal(JSC.isNumeric(new Boolean()), false, "a boolean must not be considered as a numeric value");
            equal(JSC.isNumeric(/xyz/), false, "a regex must not be considered as a numeric value");
            equal(JSC.isNumeric(new RegExp()), false, "a regex must not be considered as a numeric value");

            equal(JSC.isNumeric("10"), true, "a string containing numbers must be considered as a numeric value");
            equal(JSC.isNumeric("1234.5678"), true, "a string containing decimal numbers must be considered as a numeric value");
            equal(JSC.isNumeric("1234.5678e124"), true, "a string containing decimal numbers must be considered as a numeric value");
            equal(JSC.isNumeric("1234ttt5678e124"), false, "a string containing numbers and other chars must not be considered as a numeric value");
            equal(JSC.isNumeric(10), true, "a number must be considered as a numeric value");
            equal(JSC.isNumeric(Math.PI), true, "Math.PI must be considered as a numeric value");
            equal(JSC.isNumeric(new Number()), true, "a number object must be considered as a numeric value");
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
            var exportable = "exported";
            ok("undefined" == typeof myTestExport, "Not exported variable must not exist in global context !");

            JSC.globalize("myTestExport", exportable);
            ok("undefined" != typeof myTestExport, "Exported variable must exist in global context !");
            equal(myTestExport, exportable, "Exported variable must equal source value !");

            exportable = {};
            exportable.className = "classExport";
            JSC.globalize(exportable);
            ok("undefined" != typeof classExport, "Exported class must exist in global context !");
            equal(classExport, exportable, "Exported class must equal source value !");

            exportable = {};
            JSC.globalize(true, exportable);
            ok("undefined" != typeof JSC.global("true"), "No string parameter must be converted to string when two parameters are given !");
            equal(JSC.global("true"), exportable, "Exported value must equal source value !");
        },

        /**
         * Test of JSC.global()
         */
        global : function() {
            var globalized = "globalized";
            ok("undefined" == typeof JSC.global("myTestGlobal"), "Local variable must not exist in global context !");

            JSC.globalize("myTestGlobal", globalized);
            ok("undefined" != typeof JSC.global("myTestGlobal"), "Global variable must exist in global context !");
            equal(JSC.global("myTestGlobal"), globalized, "Global variable must equal source value !");
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
         * Test of JSC.merge()
         */
        merge : function() {
            var o = {}, o1;

            o1 = JSC.merge();
            ok("object" == typeof(o1), "merging of no object must at least produce an object");
            equal(JSC.toString(o1), JSC.toString({}), "Merge result of void object");

            o1 = JSC.merge(o);
            equal(o, o1, "merge of a single object must return it at least");
            equal(JSC.toString(o1), JSC.toString({}), "Merge result of void object");

            o1 = JSC.merge(o, o);
            equal(o, o1, "merge of a single object must return it at least");
            equal(JSC.toString(o1), JSC.toString({}), "Merge result of void object");

            o1 = JSC.merge(true);
            ok("object" == typeof(o1), "merging of no object but a boolean must at least produce an object");
            equal(JSC.toString(o1), JSC.toString({}), "Merge result of void object");

            o1 = JSC.merge(o, {});
            equal(o, o1, "merge of an object with another void object must return it at least");
            equal(JSC.toString(o1), JSC.toString({}), "Merge result of void object");

            o.a = false;
            o1 = JSC.merge(o, {});
            equal(o, o1, "merge of an object with another void object must return it at least");
            equal(JSC.toString(o1), JSC.toString({a:false}), "Merge result of void object");

            o1 = JSC.merge(o, {
                a : true,
                b : {
                    a : false
                }
            });
            equal(o, o1, "merge of an object with another void object must return it at least");
            equal(JSC.toString(o1), JSC.toString({
                a : true,
                b : {
                    a : false
                }
            }), "Merge result");

            o1 = JSC.merge(o, {
                a : 10,
                b : {
                    a : 3
                },
                c : "tests"
            });
            equal(o, o1, "merge must return destination object");
            equal(JSC.toString(o1), JSC.toString({
                a : 10,
                b : {
                    a : 3
                },
                c : "tests"
            }), "Merge result");

            o1 = JSC.merge(o, true, {
                b : {
                    b : 4
                }
            });
            equal(o, o1, "merge must return destination object");
            equal(JSC.toString(o1), JSC.toString({
                a : 10,
                b : {
                    a : 3,
                    b : 4
                },
                c : "tests"
            }), "Merge result");

            o1 = JSC.merge(o, {
                c : {
                    f : 1
                }
            }, true, {
                b : {
                    c : true
                }
            });
            equal(o, o1, "merge must return destination object");
            equal(JSC.toString(o1), JSC.toString({
                a : 10,
                b : {
                    a : 3,
                    b : 4,
                    c : true
                },
                c : {
                    f : 1
                }
            }), "Merge result");

            o1 = JSC.merge(o, true, {
                b : {
                    d : false
                }
            }, false, {
                c : {
                    a : 4
                }
            });
            equal(o, o1, "merge must return destination object");
            equal(JSC.toString(o1), JSC.toString({
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
            }), "Merge result");
        },

        /**
         * Test of JSC.owned()
         */
        owned : function() {
            var A, B, a, b, o;

            A = new Function();
            A.prototype.a = true;

            B = new Function();
            B.prototype = new A();
            B.prototype.b = true;

            a = new A();
            a.aa = true;

            b = new B();
            b.bb = true;

            ok("undefined" != typeof a.a, "defined property must exist");
            ok("undefined" == typeof a.b, "not defined property must not exist");
            ok("undefined" != typeof a.aa, "added property must exist");
            ok("undefined" == typeof a.bb, "not added property must not exist");

            o = JSC.owned(a);
            ok("undefined" == typeof o.a, "defined property must not be tagged as owned");
            ok("undefined" != typeof o.aa, "added property must be tagged as owned");
            ok("undefined" == typeof o.b, "not defined property must not be tagged as owned");
            ok("undefined" == typeof o.bb, "not added property must not be tagged as owned");

            ok("undefined" != typeof b.a, "herited property must exist");
            ok("undefined" != typeof b.b, "defined property must exist");
            ok("undefined" == typeof b.aa, "not added property must not exist");
            ok("undefined" != typeof b.bb, "added property must exist");

            o = JSC.owned(b);
            ok("undefined" == typeof o.a, "defined property must not be tagged as owned");
            ok("undefined" == typeof o.aa, "not added property must be not tagged as owned");
            ok("undefined" == typeof o.b, "defined property must not be tagged as owned");
            ok("undefined" != typeof o.bb, "added property must be tagged as owned");
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
            equal(o1.fn.guid, undefined, "no GUID on method");

            o2.value = "2";
            o2.fn = JSC.attach(fn, o1);
            ok(JSC.isAttached(o2.fn), "Flag must be set to tell the method is context attached");
            ok(o1.fn.guid, "original method must have a GUID");
            ok(o2.fn.guid, "proxy method must have a GUID");
            equal(o1.fn.guid, o2.fn.guid, "GUIS of proxy and original methods must be equals");
            notEqual(o1.fn, o2.fn, "proxy and original methods must not be equals");

            o3.value = "3";
            o3.fn = JSC.attach(o1, "fn");
            ok(JSC.isAttached(o3.fn), "Flag must be set to tell the method is context attached");
            ok(o3.fn.guid, "proxy method must have a GUID");
            equal(o1.fn.guid, o3.fn.guid, "GUIS of proxy and original methods must be equals");
            notEqual(o1.fn, o3.fn, "proxy and original methods must not be equals");

            dummy = JSC.attach(undefined, o1);
            ok(dummy, "proxy method must have given, even if no one was given");
            ok(dummy.guid, "proxy method must have a GUID");

            dummy = JSC.attach(undefined, undefined);
            ok(dummy, "proxy method must have given, even if no one was given");
            ok(dummy.guid, "proxy method must have a GUID");

            dummy = JSC.attach(o1, "undefined");
            ok(dummy, "proxy method must have given, even if no one was given");
            ok(dummy.guid, "proxy method must have a GUID");

            dummy = JSC.attach(undefined, "undefined");
            ok(dummy, "proxy method must have given, even if no one was given");
            ok(dummy.guid, "proxy method must have a GUID");

            equal(o1.fn.guid, o3.fn.guid, "GUIS of proxy and original methods must be equals");
            notEqual(o1.fn, o3.fn, "proxy and original methods must not be equals");

            equal(o1.value, "1", "initial o1 value");
            o1.fn("test");
            equal(o1.value, "test", "o1 value must be affected by method call");

            equal(o2.value, "2", "initial o2 value");
            o2.fn("hello");
            equal(o1.value, "hello", "o1 value must be affected by method call");
            equal(o2.value, "2", "o2 value must not be affected by method call");

            equal(o3.value, "3", "initial o3 value");
            o3.fn("hi");
            equal(o1.value, "hi", "o1 value must be affected by method call");
            equal(o2.value, "2", "o2 value must not be affected by method call");
            equal(o3.value, "3", "o3 value must not be affected by method call");
        },

        /**
         * Test of JSC.innerAttach()
         */
        innerAttach : function() {
            var fn, o = {};

            fn = JSC.innerAttach("tag");
            notEqual(fn, JSC.noop, "attached function must not be equal to noop");
            notEqual(fn, JSC.tag, "attached function must not be equal to original one");
            equal(fn.guid, JSC.tag.guid, "attached function must have same id that original one");
            equal(fn.guid, JSC.innerAttach("tag").guid, "each attached function must have same id");
            equal(fn, JSC.innerAttach("tag"), "each attached function must be equal");
            notEqual(fn, JSC.innerAttach("tag", true), "when rewriting is required, attached function must not be equal to old one");

            equal(o.guid, undefined, "value before call");
            equal(fn(o), o.guid, "value after call");
            notEqual(o.guid, undefined, "value after call");
            ok("number" === typeof o.guid, "type of value after call");
        },

        /**
         * Test of JSC.abstractMethod()
         */
        abstractMethod : function() {
            var fn, name = "test", o = {}, throwed;

            fn = JSC.abstractMethod();
            ok(JSC.isFunction(fn), "abstract method must be a function");
            raises(fn, "calling of abstract method must throw an exception");
            ok(JSC.isAbstract(fn), "abstract method must be tagged as abstract");

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
            ok(throwed, "calling of named abstract method in object context must throw an exception");

            fn = JSC.abstractMethod(name);
            ok(JSC.isFunction(fn), "named abstract method must be a function");
            raises(fn, new RegExp(name), "calling of named abstract method must throw an exception");
            ok(JSC.isAbstract(fn), "named abstract method must be tagged as abstract");

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
            ok(throwed, "calling of named abstract method in object context must throw an exception");

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
            ok(throwed, "calling of named abstract method in object context must throw an exception");
        },

        /**
         * Test of JSC.override()
         */
        override : function() {
            var value, o1 = {}, o2 = {}, o3 = {}, o4 = {}, reOverride = /\binherited\b/, fn = function(p) {
                value = p + "1";
            };

            equal(JSC.override(), undefined, "overriding for nothing must return nothing");
            equal(JSC.override(fn), fn, "when no overriding, original method must be returned");
            equal(JSC.override(fn, fn), fn, "override of a method by itself must not produce an overriding method");
            equal(JSC.override(value = ""), value, "overriding with a string value must return the value unaltered");
            equal(JSC.override(value = new String()), value, "overriding with a string value must return the value unaltered");
            equal(JSC.override(value = true), value, "overriding with a boolean value must return the value unaltered");
            equal(JSC.override(value = new Boolean()), value, "overriding with a boolean value must return the value unaltered");
            equal(JSC.override(value = {}), value, "overriding with an objet value must return the value unaltered");
            equal(JSC.override(value = new Object()), value, "overriding with an objet value must return the value unaltered");
            equal(JSC.override(value = []), value, "overriding with an array value must return the value unaltered");
            equal(JSC.override(value = new Array()), value, "overriding with an array value must return the value unaltered");
            equal(JSC.override(value = /xyz/), value, "overriding with a RegExp value must return the value unaltered");
            equal(JSC.override(value = new RegExp()), value, "overriding with a RegExp value must return the value unaltered");
            equal(JSC.override(value = 10), value, "overriding with a number value must return the value unaltered");
            equal(JSC.override(value = new Number()), value, "overriding with a number value must return the value unaltered");

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
            equal(value, "", "value before call of initial method");
            equal(o1.fn, fn, "initial method must not be altered");
            ok(!JSC.isInherited(o1.fn), "method must not be tagged as overriding");
            ok(!reOverride.test(o1.fn), "initial method must not call inherited");
            o1.fn("test");
            equal(value, "test1", "call of initial method");

            value = "";
            equal(value, "", "value before call of 2 levels method");
            notEqual(o2.fn, fn, "2 levels method must be altered");
            ok(JSC.isInherited(o2.fn), "method must be tagged as overriding");
            ok(reOverride.test(o2.fn), "2 levels method must call inherited");
            o2.fn("try");
            equal(value, "try12", "call of 2 levels method");

            value = "";
            equal(value, "", "value before call of 3 levels method");
            notEqual(o3.fn, fn, "3 levels method must be altered");
            ok(JSC.isInherited(o3.fn), "method must be tagged as overriding");
            ok(reOverride.test(o3.fn), "3 levels method must call inherited");
            o3.fn("hello");
            equal(value, "hello123", "call of 3 levels method");

            value = "";
            equal(value, "", "value before call of 4 levels method");
            notEqual(o4.fn, fn, "4 levels method must be altered");
            ok(!JSC.isInherited(o4.fn), "method must not be tagged as overriding");
            ok(!reOverride.test(o4.fn), "4 levels method must not call inherited");
            o4.fn("final");
            equal(value, "final4", "call of 4 levels method");

            fn = function() {this.inherited();}
            equal(JSC.override(fn, fn), fn, "override of a method by itself must not produce an overriding method, even if inheritance is invoked !");
        },

        /**
         * Test of JSC.extend()
         */
        extend : function() {
            var A, B, a, b, value, throwed;

            throwed = false
            try {
                equal(JSC.extend(), undefined, "call of extend with no parameters must return undefined");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of extend with no parameters must not throw error");

            throwed = false
            try {
                equal(JSC.extend("Class"), "Class", "call of extend with no class must return given value");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of extend with no class must not throw error");

            A = new Function();
            A.prototype.a = true;
            A.prototype.f = function(){
                value = "A";
            };

            throwed = false
            try {
                equal(JSC.extend(A), A, "call of extend with only a class must return given class");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of extend with only a class must not throw error");


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
            ok(JSC.isInherited(B.prototype.f), "method must be tagged as overriding");

            value = "";
            a = new A();
            equal(value, "", "initial value after 'A' is instantiated");
            a.f();
            equal(value, "A", "altered value after call of 'A.f()'");

            value = "";
            b = new B();
            equal(b.a, false, "value of 'b.a'");
            equal(b.b, true, "value of 'b.b'");
            equal(b.c, "", "value of 'b.c'");
            equal(value, "", "initial value after 'B' is instantiated");
            b.f();
            equal(value, "AB", "altered value after call of 'B.f()'");
        },

        /**
         * Test of JSC.implement()
         */
        implement : function() {
            var i, a, value, throwed, A = function(){};
            A.className = "A";

            throwed = false
            try {
                equal(JSC.implement(), undefined, "call of implement with no parameters must return undefined");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of implement with no parameters must not throw error");

            throwed = false
            try {
                equal(JSC.implement("Class"), "Class", "call of implement with no class must return given value");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of implement with no class must not throw error");

            a = JSC.implement(A);
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");

            a = JSC.implement(A, "test");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test, "class must implement void interface 'test'");

            a = JSC.implement(A, []);
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");

            a = JSC.implement(A, [], "test2");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test2, "class must implement void interface 'test2'");

            a = JSC.implement(A, ["fn1"]);
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(JSC.isFunction(A.prototype.fn1), "class must implement interface method 'fn1'");
            ok(JSC.isAbstract(A.prototype.fn1), "method 'fn1' must be abstract");

            a = JSC.implement(A, ["fn2"], "test3");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test3, "class must implement void interface 'test3'");
            ok(JSC.isFunction(A.prototype.fn2), "class must implement interface method 'fn2'");
            ok(JSC.isAbstract(A.prototype.fn2), "method 'fn2' must be abstract");

            a = JSC.implement(A, {});
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");

            a = JSC.implement(A, {}, "test4");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test4, "class must implement void interface 'test4'");

            a = JSC.implement(A, {className: "test5"});
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test5, "class must implement void interface 'test5'");

            a = JSC.implement(A, {className: "test7"}, "test6");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test6, "class must implement void interface 'test6'");
            ok(undefined === A.interfaces.test7, "class must not implement interface 'test7'");

            a = JSC.implement(A, {
                fn3 : undefined,
                a1 : ""
            });
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(JSC.isFunction(A.prototype.fn3), "class must implement interface method 'fn3'");
            ok(JSC.isString(A.prototype.a1), "class must implement interface attribute 'a1'");
            ok(JSC.isAbstract(A.prototype.fn3), "method 'fn3' must be abstract");

            a = JSC.implement(A, {
                fn4 : function() {
                    value = "fn4";
                },
                a2 : 10
            }, "test7");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test7, "class must implement void interface 'test7'");
            ok(JSC.isFunction(A.prototype.fn4), "class must implement interface method 'fn4'");
            ok(JSC.isNumeric(A.prototype.a2), "class must implement interface attribute 'a2'");
            ok(!JSC.isAbstract(A.prototype.fn4), "method 'fn4' must not be abstract");

            a = JSC.implement(A, {
                className: "test8",
                fn5 : function() {
                    value = "fn5";
                },
                a3 : true
            });
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test8, "class must implement void interface 'test8'");
            ok(JSC.isFunction(A.prototype.fn5), "class must implement interface method 'fn5'");
            ok(JSC.isBool(A.prototype.a3), "class must implement interface attribute 'a3'");
            ok(!JSC.isAbstract(A.prototype.fn5), "method 'fn5' must not be abstract");

            a = JSC.implement(A, {
                className: "test10",
                fn6 : function() {
                    value = "fn6";
                },
                a4 : {}
            }, "test9");
            equal(a, A, "returned class must be equal to original one");
            equal(A.className, "A", "className must not be altered");
            ok(A.interfaces.test9, "class must implement void interface 'test9'");
            ok(undefined === A.interfaces.test10, "class must not implement interface 'test10'");
            ok(JSC.isFunction(A.prototype.fn6), "class must implement interface method 'fn6'");
            ok(JSC.isObject(A.prototype.a4), "class must implement interface attribute 'a4'");
            ok(!JSC.isAbstract(A.prototype.fn6), "method 'fn6' must not be abstract");

            a = new A();
            a.className = "A";
            for(i = 1; i < 7; i++) {
                ok(JSC.isFunction(a["fn" + i]), "instance must have method fn" + i);
            }
            for(i = 1; i < 5; i++) {
                ok(undefined != a["a" + i], "instance must have member a" + i);
            }

            for(i = 1; i < 4; i++) {
                throwed = false;
                try {
                    ok(JSC.isAbstract(a["fn" + i]), "method fn" + i + " must be tagged as abstract");
                    a["fn" + i]();
                } catch(e) {
                    throwed = true;
                    if( e instanceof JSCError ) {
                        equal(e.context, "A.fn" + i, "Error thrown must set right context for unnamed abstract method");
                    } else {
                        ok(false, "Throwed error is not an instance of JSCError !");
                    }
                }
                ok(throwed, "calling of abstract method fn" + i + " must throw an exception");
            }

            for(i = 4; i < 7; i++) {
                throwed = false;
                try {
                    a["fn" + i]();
                } catch(e) {
                    throwed = true;
                }
                ok(!throwed, "calling of concrete method fn" + i + " must not throw an exception");
                equal(value, "fn" + i, "value must be altered by a call fn" + i);
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
                equal(JSC.instanceOf(), false, "instance of nothing");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of instanceOf with no parameters must not throw error");

            throwed = false;
            try {
                equal(JSC.instanceOf(A), false, "nothing instance of class");
            } catch(e) {
                throwed = true;
            }
            ok(!throwed, "call of instanceOf with only one parameter must not throw error");

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
            notEqual(Class, undefined, "the returned class must be defined");
            ok(JSC.isFunction(Class), "the returned class must be a real class");
            equal(Class, myClass1, "the returned class must comply to needed one");
            notEqual(Class, myClass2, "the returned class must not comply to other class");

            Class = JSC.getClass(myClass2);
            notEqual(Class, undefined, "the returned class must be defined");
            ok(JSC.isFunction(Class), "the returned class must be a real class");
            equal(Class, myClass2, "the returned class must comply to needed one");
            notEqual(Class, myClass1, "the returned class must not comply to other class");

            equal(JSC.getClass(), undefined, "ask for a class with no parameter must return undefined");
            equal(JSC.getClass(name), undefined, "unknown class must reeturn undefined");

            JSC.globalize(name, myClass1);
            Class = JSC.getClass(name);
            notEqual(Class, undefined, "when the needed class is known the function must return it");
            equal(Class, myClass1, "the returned class must comply to needed one");
            notEqual(Class, myClass2, "the returned class must not comply to other class");

            JSC.globalize(name, name);
            Class = JSC.getClass(name);
            equal(Class, undefined, "ask for class that is not one must return undefined");
            ok(!JSC.isFunction(Class), "not class must not be considered as a class");

            notEqual(JSC.getClass(Array), undefined, "ask of native class Array must achieve with success");
            notEqual(JSC.getClass(Boolean), undefined, "ask of native class Boolean must achieve with success");
            notEqual(JSC.getClass(Date), undefined, "ask of native class Date must achieve with success");
            notEqual(JSC.getClass(Function), undefined, "ask of native class Function must achieve with success");
            notEqual(JSC.getClass(Number), undefined, "ask of native class Number must achieve with success");
            notEqual(JSC.getClass(Object), undefined, "ask of native class Object must achieve with success");
            notEqual(JSC.getClass(RegExp), undefined, "ask of native class RegExp must achieve with success");
            notEqual(JSC.getClass(String), undefined, "ask of native class String must achieve with success");
        },


        /**
         * Test of JSC.loadClass()
         */
        loadClass : function() {
            var name = "myClass", myClass1 = function(){this.value=1;}, myClass2 = function(){this.value=2;}, Class;

            Class = JSC.loadClass(myClass1);
            notEqual(Class, undefined, "the returned class must be defined");
            ok(JSC.isFunction(Class), "the returned class must be a real class");
            equal(Class, myClass1, "the returned class must comply to needed one");
            notEqual(Class, myClass2, "the returned class must not comply to other class");

            Class = JSC.loadClass(myClass2);
            notEqual(Class, undefined, "the returned class must be defined");
            ok(JSC.isFunction(Class), "the returned class must be a real class");
            equal(Class, myClass2, "the returned class must comply to needed one");
            notEqual(Class, myClass1, "the returned class must not comply to other class");

            raises(function(){
                JSC.loadClass();
            }, "ask for a class with no parameter must thow an error");
            raises(function(){
                JSC.loadClass(name);
            }, "unknown class must thow an error");

            JSC.globalize(name, myClass1);
            Class = JSC.loadClass(name);
            notEqual(Class, undefined, "when the needed class is known the function must return it");
            equal(Class, myClass1, "the returned class must comply to needed one");
            notEqual(Class, myClass2, "the returned class must not comply to other class");

            JSC.globalize(name, name);
            raises(function(){
                Class = JSC.loadClass(name);
            }, "ask for class that is not one must thow an error");

            notEqual(JSC.loadClass(Array), undefined, "ask of native class Array must achieve with success");
            notEqual(JSC.loadClass(Boolean), undefined, "ask of native class Boolean must achieve with success");
            notEqual(JSC.loadClass(Date), undefined, "ask of native class Date must achieve with success");
            notEqual(JSC.loadClass(Function), undefined, "ask of native class Function must achieve with success");
            notEqual(JSC.loadClass(Number), undefined, "ask of native class Number must achieve with success");
            notEqual(JSC.loadClass(Object), undefined, "ask of native class Object must achieve with success");
            notEqual(JSC.loadClass(RegExp), undefined, "ask of native class RegExp must achieve with success");
            notEqual(JSC.loadClass(String), undefined, "ask of native class String must achieve with success");
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
                    value = this.className + ".fn";
                }
            });
            equal(JSC.type(A), "A", "Type of a class must be its name");
            equal(value, undefined, "value must not be altered by class inheritance mechanism");

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
            equal(value, undefined, "value must not be altered by class inheritance mechanism");
            ok(JSC.isInherited(B.prototype.initialize), "method must be tagged as overriding");

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
                JSC.Class({
                    superClass : "undefinedClass",
                    className : "D",
                    initialize : function() {
                        value += "C";
                        this.inherited();
                    }
                })
            }, /\bundefinedClass\b/, "An error must be throwed when super class is unknown");
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
            }, /\bundefinedClass\b/, "An error must be throwed when super class is unknown");
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
            }, /\bundefinedClass\b/, "An error must be throwed when super class is unknown");
        }
    };

    runTestSuite(testSuiteJSC);
})(window);
