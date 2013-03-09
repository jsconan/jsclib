/*!
 * Test Suite for JavaScript Class Library v0.5.2 (JSC 0.5.2)
 *
 * Copyright 2013 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(undefined) {
    var
        /**
         * Test version
         */
        versionToTest = "0.5.2",

        /**
         * The default name assigned to anonymous classes
         */
        defaultClassName = "Class",

        /**
         * Name of the prototype object
         */
        proto = "prototype",

        /**
         * Tests suite
         */
        suite = {
            _name : "JSC",

            /**
             * Test of JSC
             */
            JSC : function() {
                // identity check for JSC library entry point
                ok("function" === typeof JSC, "JSC must be a function");
                strictEqual(JSC.className, "JSC", "Class name of JSC must be defined");
                strictEqual(JSC.version, versionToTest, "Version of JSC must be defined and comply to the needed one");
                strictEqual(JSC.guid, 0, "GUID of JSC must be defined and comply to the needed one");

                // check of integrity of the tests suite about JSC
                for(var name in JSC) {
                    if( "function" === typeof JSC[name] ) {
                        ok("function" === typeof suite[name], "A test must be prepared for JSC." + name + "()");
                    }
                }

                // the JSC library entry point cannot be used as a class to instantiate an object
                mustThrow(function(){
                    new JSC();
                }, "JSC cannot be used as a class");

                // apply standard class tests with JSC default class builder
                testClassStandardSimpliest(JSC, "JSC()");
                testClassStandard(JSC);
            },

            /**
             * Test of JSC.noop()
             */
            noop : function() {
                ok("function" === typeof JSC.noop, "JSC.noop must be a function");
                strictEqual(JSC.noop(), undefined, "JSC.noop() must not return any value");
                strictEqual(JSC.noop("test"), undefined, "JSC.noop() must not return any value event when a parameter is given");
            },

            /**
             * Test of JSC.id()
             */
            id : function() {
                var value_1, value_2, value_3, guid, ret_1, ret_2, ret_3, ret_4;

                // call without parameters : just return a GUID
                value_1 = JSC.id();
                value_2 = JSC.id();
                equal(typeof value_1, "number", "JSC.id() must return a number #1");
                equal(typeof value_2, "number", "JSC.id() must return a number #2");
                notEqual(value_1, value_2, "The values returned by JSC.id() have to be unique and different each time");

                // check that there are no GUID assigned
                value_1 = {};
                value_2 = {};
                value_3 = [];
                ok("undefined" === typeof value_1.guid && "undefined" === typeof value_2.guid && "undefined" === typeof value_3.guid, "New objects must not have a global unique identifier");

                // call without value but a GUID
                guid = -1;
                equal(JSC.id(undefined, guid), guid, "JSC.id(undefined, guid) must return guid");
                equal(JSC.id(0, guid), guid, "JSC.id(0, guid) must return guid");
                equal(JSC.id(null, guid), guid, "JSC.id(null, guid) must return guid");

                // call with value to assign with GUID
                ret_1 = JSC.id(value_1);
                ret_2 = JSC.id(value_2);
                equal(typeof ret_1, "number", "JSC.id(value_1) must return a number");
                equal(typeof ret_2, "number", "JSC.id(value_2) must return a number");
                notEqual(ret_1, ret_2, "The values returned by JSC.id() have to be unique for a particular given value #1");

                // call with value to assign with GUID on already assigned value
                ret_3 = JSC.id(value_1);
                ret_4 = JSC.id(value_2);
                equal(typeof ret_3, "number", "JSC.id(value_3) must return a number");
                equal(typeof ret_4, "number", "JSC.id(value_4) must return a number");
                notEqual(ret_3, ret_4, "The values returned by JSC.id() have to be unique for a particular given value #2");
                equal(ret_1, ret_3, "JSC.id() must always return same number each time it is called for a same value #1");
                equal(ret_2, ret_4, "JSC.id() must always return same number each time it is called for a same value #2");
                equal(ret_1, value_1.guid, "A GUID have to be set #1");
                equal(ret_2, value_2.guid, "A GUID have to be set #2");

                // call with value to assign and particular GUID
                ret_1 = JSC.id(value_3, guid);
                equal(ret_1, guid, "When a guid is given to JSC.id(), it must be used");
                equal(ret_1, value_3.guid, "A GUID have to be set #3");

                // call on the library entry point
                guid = JSC.guid;
                ret_1 = JSC.id(JSC);
                ok(ret_1 === guid && JSC.guid === guid, "When applied on JSC, JSC.id() must not corrupt its GUID");
            },

            /**
             * Test of JSC.type()
             */
            type : function() {
                var undef, className = "aClass", aClass = JSC(className);

                // type of undefined value
                equal(JSC.type(), "undefined", "Type of undefined");
                equal(JSC.type(undef), "undefined", "Type of undefined variable");
                equal(JSC.type(undefined), "undefined", "Type of undefined value");

                // type of Date object
                equal(JSC.type(new Date()), "Date", "Type of Date instance");

                // type of RegEx object or value
                equal(JSC.type(new RegExp()), "RegExp", "Type of RegExp instance");
                equal(JSC.type(/test/), "RegExp", "Type of RegExp value");

                // type of Boolean object or value
                equal(JSC.type(new Boolean()), "Boolean", "Type of Boolean instance");
                equal(JSC.type(true), "Boolean", "Type of Boolean value true");
                equal(JSC.type(false), "Boolean", "Type of Boolean value false");

                // type of String object or value
                equal(JSC.type(new String()), "String", "Type of String instance");
                equal(JSC.type(""), "String", "Type of empty String value");
                equal(JSC.type("test"), "String", "Type of String value");

                // type of Array object or value
                equal(JSC.type(new Array()), "Array", "Type of Array instance");
                equal(JSC.type([]), "Array", "Type of empty Array value");
                equal(JSC.type([1,2,3]), "Array", "Type of Array value");
                equal(JSC.type("1,2,3".split(',')), "Array", "Type of result Array value");

                // type of Number object or value
                equal(JSC.type(new Number()), "Number", "Type of Number instance");
                equal(JSC.type(-1), "Number", "Type of Number negative value");
                equal(JSC.type(0), "Number", "Type of Number null value");
                equal(JSC.type(10), "Number", "Type of Number positive value");
                equal(JSC.type(14.501), "Number", "Type of Number float value");

                // type of Object object or value
                equal(JSC.type(new Object()), "Object", "Type of Object instance");
                equal(JSC.type({}), "Object", "Type of empty Object value");
                equal(JSC.type({test: 1}), "Object", "Type of Object value");

                // type of Function object or value
                equal(JSC.type(new Function()), "Function", "Type of Function instance");
                equal(JSC.type(function(){}), "Function", "Type of Function value");
                equal(JSC.type(JSC.type), "Function", "Type of an object's method");

                // type of generated class from the library
                equal(JSC.type(aClass), className, "Type of library created class");
                equal(JSC.type(new aClass()), className, "Type of library created object");
            },

            /**
             * Test of JSC.isFunction()
             */
            isFunction : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not a function
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
                equal(JSC.isFunction(new aClass()), false, "An instance of a class must be not considered as a function");

                // check response when value is a function
                equal(JSC.isFunction(function(){}), true, "A function must be considered as a function");
                equal(JSC.isFunction(new Function()), true, "A function must be considered as a function");
                equal(JSC.isFunction(aClass), true, "A class definition must be considered as a function");
            },

            /**
             * Test of JSC.isClass()
             */
            isClass : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not a class
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

                // check response when value is a class
                equal(JSC.isClass(aClass), true, "A class definition must be considered as a class");
                equal(JSC.isClass(new aClass()), false, "A class instance must not be considered as a class");
            },

            /**
             * Test of JSC.isInstance()
             */
            isInstance : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an instance of a generated class by the library
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

                // check response when value is an instance of a generated class by the library
                equal(JSC.isInstance(aClass), false, "A class definition must not be considered as a class instance");
                equal(JSC.isInstance(new aClass()), true, "A class instance must be considered as a class instance");
            },

            /**
             * Test of JSC.isAbstract()
             */
            isAbstract : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an abstract method
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
                equal(JSC.isAbstract(aClass), false, "A class definition must not be considered as an abstract function");
                equal(JSC.isAbstract(new aClass()), false, "A class instance must not be considered as an abstract function");

                // check response when value is an abstract method
                equal(JSC.isAbstract(JSC.abstractMethod()), true, "An unnamed abstract function must be considered as an abstract function");
                equal(JSC.isAbstract(JSC.abstractMethod("test")), true, "A named abstract function must be considered as an abstract function");
            },

            /**
             * Test of JSC.isAttached()
             */
            isAttached : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an attached method
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
                equal(JSC.isAttached(aClass), false, "A class definition must not be considered as an attached function");
                equal(JSC.isAttached(new aClass()), false, "A class instance must not be considered as an attached function");
                equal(JSC.isAttached((new aClass()).attach()), false, "When try to attach a void method, return function must not be considered as an attached function");
                equal(JSC.isAttached((new aClass()).attach("test")), false, "When try to attach a void method, return function must not be considered as an attached function");

                // check response when value is an attached method
                equal(JSC.isAttached(JSC.attach(function(){}, this)), true, "An unnamed attached function must be considered as an attached function");
                equal(JSC.isAttached(JSC.attach({test: function(){}}, "test")), true, "A named attached function must be considered as an attached function");
                equal(JSC.isAttached((new aClass()).attach("attach")), true, "A named attached function must be considered as an attached function");
                equal(JSC.isAttached((new aClass()).attach("attach", true)), true, "A named attached function must be considered as an attached function");
            },

            /**
             * Test of JSC.isOverloaded()
             */
            isOverloaded : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an overloaded method
                equal(JSC.isOverloaded(), false, "An undefined value must not be considered as an overloaded function");
                equal(JSC.isOverloaded(undefined), false, "An undefined value must not be considered as an overloaded function");
                equal(JSC.isOverloaded(null), false, "A null value must not be considered as an overloaded function");
                equal(JSC.isOverloaded({}), false, "An object must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new Object()), false, "An object must not be considered as an overloaded function");
                equal(JSC.isOverloaded([]), false, "An array must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new Array()), false, "An array must not be considered as an overloaded function");
                equal(JSC.isOverloaded("function"), false, "A string must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new String()), false, "A string must not be considered as an overloaded function");
                equal(JSC.isOverloaded(10), false, "A number must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new Number()), false, "A number must not be considered as an overloaded function");
                equal(JSC.isOverloaded(true), false, "A boolean must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new Boolean()), false, "A boolean must not be considered as an overloaded function");
                equal(JSC.isOverloaded(/xyz/), false, "A regex must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new RegExp()), false, "A regex must not be considered as an overloaded function");
                equal(JSC.isOverloaded(function(){}), false, "A standard function must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new Function()), false, "A standard function must not be considered as an overloaded function");
                equal(JSC.isOverloaded(aClass), false, "A class definition must not be considered as an overloaded function");
                equal(JSC.isOverloaded(new aClass()), false, "A class instance must not be considered as an overloaded function");

                // check response when value is an overloaded method
                equal(JSC.isOverloaded(JSC.overload(function(){this.inherited();}, function(){})), true, "An overriding function using inheritance must be considered as an overloaded function");
            },

            /**
             * Test of JSC.isPlugin()
             */
            isPlugin : function() {
                var className = "aClass", aClass = JSC(className), plugin = getIt({
                    pluginName : "isPluginCheck",
                    pluginMethod : function(){}
                });

                // check response when value is not an overloaded method
                equal(JSC.isPlugin(), false, "An undefined value must not be considered as a plugin function");
                equal(JSC.isPlugin(undefined), false, "An undefined value must not be considered as a plugin function");
                equal(JSC.isPlugin(null), false, "A null value must not be considered as a plugin function");
                equal(JSC.isPlugin({}), false, "An object must not be considered as a plugin function");
                equal(JSC.isPlugin(new Object()), false, "An object must not be considered as a plugin function");
                equal(JSC.isPlugin([]), false, "An array must not be considered as a plugin function");
                equal(JSC.isPlugin(new Array()), false, "An array must not be considered as a plugin function");
                equal(JSC.isPlugin("function"), false, "A string must not be considered as a plugin function");
                equal(JSC.isPlugin(new String()), false, "A string must not be considered as a plugin function");
                equal(JSC.isPlugin(10), false, "A number must not be considered as a plugin function");
                equal(JSC.isPlugin(new Number()), false, "A number must not be considered as a plugin function");
                equal(JSC.isPlugin(true), false, "A boolean must not be considered as a plugin function");
                equal(JSC.isPlugin(new Boolean()), false, "A boolean must not be considered as a plugin function");
                equal(JSC.isPlugin(/xyz/), false, "A regex must not be considered as a plugin function");
                equal(JSC.isPlugin(new RegExp()), false, "A regex must not be considered as a plugin function");
                equal(JSC.isPlugin(function(){}), false, "A standard function must not be considered as a plugin function");
                equal(JSC.isPlugin(new Function()), false, "A standard function must not be considered as a plugin function");
                equal(JSC.isPlugin(aClass), false, "A class definition must not be considered as a plugin function");
                equal(JSC.isPlugin(new aClass()), false, "A class instance must not be considered as a plugin function");

                // check response when value is an overloaded method
                ok(JSC.install(plugin), "Plugin must be installed");
                equal(JSC.isPlugin(JSC.pluginMethod), true, "A function added by a plugin must be considered as a plugin function");
                ok(JSC.uninstall(plugin), "Plugin must be uninstalled");
                equal(!JSC.isPlugin(JSC.pluginMethod), true, "A function removed by a plugin must not be considered as a plugin function");
            },

            /**
             * Test of JSC.isArray()
             */
            isArray : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an array
                equal(JSC.isArray(), false, "An undefined value must not be considered as an array");
                equal(JSC.isArray(undefined), false, "An undefined value must not be considered as an array");
                equal(JSC.isArray(null), false, "A null value must not be considered as an array");
                equal(JSC.isArray({}), false, "An object must not be considered as an array");
                equal(JSC.isArray(new Object()), false, "An object must not be considered as an array");
                equal(JSC.isArray(function(){}), false, "A function must not be considered as an array");
                equal(JSC.isArray(new Function()), false, "A function must not be considered as an array");
                equal(JSC.isArray("Array"), false, "A string must not be considered as an array");
                equal(JSC.isArray(new String()), false, "A string must not be considered as an array");
                equal(JSC.isArray(10), false, "A number must not be considered as an array");
                equal(JSC.isArray(new Number()), false, "A number must not be considered as an array");
                equal(JSC.isArray(true), false, "A boolean must not be considered as an array");
                equal(JSC.isArray(new Boolean()), false, "A boolean must not be considered as an array");
                equal(JSC.isArray(/xyz/), false, "A regex must not be considered as an array");
                equal(JSC.isArray(new RegExp()), false, "A regex must not be considered as an array");
                equal(JSC.isArray(aClass), false, "A class definition must not be considered as an array");
                equal(JSC.isArray(new aClass()), false, "A class instance must not be considered as an array");

                // check response when value is an array
                equal(JSC.isArray([]), true, "An array must be considerer as an array");
                equal(JSC.isArray(new Array()), true, "An array must be considerer as an array");
            },

            /**
             * Test of JSC.isObject()
             */
            isObject : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an object
                equal(JSC.isObject(), false, "An undefined value must not be considered as an object");
                equal(JSC.isObject(undefined), false, "An undefined value must not be considered as an object");
                equal(JSC.isObject(null), false, "A null value must not be considered as an object");
                equal(JSC.isObject([]), false, "An array must not be considered as an object");
                equal(JSC.isObject(new Array()), false, "An array must not be considered as an object");
                equal(JSC.isObject(function(){}), false, "A function must not be considered as an object");
                equal(JSC.isObject(new Function()), false, "A function must not be considered as an object");
                equal(JSC.isObject("Array"), false, "A string must not be considered as an object");
                equal(JSC.isObject(new String()), false, "A string must not be considered as an object");
                equal(JSC.isObject(10), false, "A number must not be considered as an object");
                equal(JSC.isObject(new Number()), false, "A number must not be considered as an object");
                equal(JSC.isObject(true), false, "A boolean must not be considered as an object");
                equal(JSC.isObject(new Boolean()), false, "A boolean must not be considered as an object");
                equal(JSC.isObject(/xyz/), false, "A regex must not be considered as an object");
                equal(JSC.isObject(new RegExp()), false, "A regex must not be considered as an object");
                equal(JSC.isObject(aClass), false, "A class definition must not be considered as an object");

                // check response when value is an object
                equal(JSC.isObject({}), true, "An object must be considerer as an object");
                equal(JSC.isObject(new Object()), true, "An object must be considerer as an object");
                equal(JSC.isObject(new aClass()), true, "A class instance must be considered as an object");
            },

            /**
             * Test of JSC.isEmptyObject()
             */
            isEmptyObject : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not an empty object
                equal(JSC.isEmptyObject(), false, "An undefined value must not be considered as an empty object");
                equal(JSC.isEmptyObject(undefined), false, "An undefined value must not be considered as an empty object");
                equal(JSC.isEmptyObject(null), false, "A null value must not be considered as an empty object");
                equal(JSC.isEmptyObject([]), false, "An array must not be considered as an empty object");
                equal(JSC.isEmptyObject(new Array()), false, "An array must not be considered as an empty object");
                equal(JSC.isEmptyObject(function(){}), false, "A function must not be considered as an empty object");
                equal(JSC.isEmptyObject(new Function()), false, "A function must not be considered as an empty object");
                equal(JSC.isEmptyObject("Array"), false, "A string must not be considered as an empty object");
                equal(JSC.isEmptyObject(new String()), false, "A string must not be considered as an empty object");
                equal(JSC.isEmptyObject(10), false, "A number must not be considered as an empty object");
                equal(JSC.isEmptyObject(new Number()), false, "A number must not be considered as an empty object");
                equal(JSC.isEmptyObject(true), false, "A boolean must not be considered as an empty object");
                equal(JSC.isEmptyObject(new Boolean()), false, "A boolean must not be considered as an empty object");
                equal(JSC.isEmptyObject(/xyz/), false, "A regex must not be considered as an empty object");
                equal(JSC.isEmptyObject(new RegExp()), false, "A regex must not be considered as an empty object");
                equal(JSC.isEmptyObject({test: 1}), false, "A filled object must not be considerer as an empty object");
                equal(JSC.isEmptyObject(aClass), false, "An empty class must not be considerer as an empty object");
                equal(JSC.isEmptyObject(new aClass()), false, "An instance of an empty class must not be considerer as an empty object");

                // check response when value is an empty object
                equal(JSC.isEmptyObject({}), true, "An empty object must be considerer as an empty object");
                equal(JSC.isEmptyObject(new Object()), true, "An empty object instance must be considerer as an empty object");
            },

            /**
             * Test of JSC.isString()
             */
            isString : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not a string
                equal(JSC.isString(), false, "An undefined value must not be considered as a string");
                equal(JSC.isString(undefined), false, "An undefined value must not be considered as a string");
                equal(JSC.isString(null), false, "A null value must not be considered as a string");
                equal(JSC.isString({}), false, "An object must not be considered as a string");
                equal(JSC.isString(new Object()), false, "An object must not be considered as a string");
                equal(JSC.isString([]), false, "An array must not be considered as a string");
                equal(JSC.isString(new Array()), false, "An array must not be considered as a string");
                equal(JSC.isString(function(){}), false, "A function must not be considered as a string");
                equal(JSC.isString(new Function()), false, "A function must not be considered as a string");
                equal(JSC.isString(10), false, "A number must not be considered as a string");
                equal(JSC.isString(new Number()), false, "A number must not be considered as a string");
                equal(JSC.isString(true), false, "A boolean must not be considered as a string");
                equal(JSC.isString(new Boolean()), false, "A boolean must not be considered as a string");
                equal(JSC.isString(/xyz/), false, "A regex must not be considered as a string");
                equal(JSC.isString(new RegExp()), false, "A regex must not be considered as a string");
                equal(JSC.isString(aClass), false, "A class definition must not be considered as a string");
                equal(JSC.isString(new aClass()), false, "A class instance must not be considered as a string");

                // check response when value is a string
                equal(JSC.isString(""), true, "A string must be considered as a string");
                equal(JSC.isString(new String()), true, "A string must be considered as a string");
            },

            /**
             * Test of JSC.isBool()
             */
            isBool : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not a boolean
                equal(JSC.isBool(), false, "An undefined value must not be considered as a boolean");
                equal(JSC.isBool(undefined), false, "An undefined value must not be considered as a boolean");
                equal(JSC.isBool(null), false, "A null value must not be considered as a boolean");
                equal(JSC.isBool({}), false, "An object must not be considered as a boolean");
                equal(JSC.isBool(new Object()), false, "An object must not be considered as a boolean");
                equal(JSC.isBool([]), false, "An array must not be considered as a boolean");
                equal(JSC.isBool(new Array()), false, "An array must not be considered as a boolean");
                equal(JSC.isBool(function(){}), false, "A function must not be considered as a boolean");
                equal(JSC.isBool(new Function()), false, "A function must not be considered as a boolean");
                equal(JSC.isBool(10), false, "A number must not be considered as a boolean");
                equal(JSC.isBool(new Number()), false, "A number must not be considered as a boolean");
                equal(JSC.isBool("true"), false, "A string must not be considered as a boolean");
                equal(JSC.isBool(new String()), false, "A boolean must not be considered as a boolean");
                equal(JSC.isBool(/xyz/), false, "A regex must not be considered as a boolean");
                equal(JSC.isBool(new RegExp()), false, "A regex must not be considered as a boolean");
                equal(JSC.isBool(aClass), false, "A class definition must not be considered as a boolean");
                equal(JSC.isBool(new aClass()), false, "A class instance must not be considered as a boolean");

                // check response when value is a boolean
                equal(JSC.isBool(true), true, "A boolean must be considered as a boolean");
                equal(JSC.isBool(false), true, "A boolean must be considered as a boolean");
                equal(JSC.isBool(new Boolean()), true, "A boolean must be considered as a boolean");
            },

            /**
             * Test of JSC.isNumeric()
             */
            isNumeric : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not a numeric
                equal(JSC.isNumeric(), false, "An undefined value must not be considered as a numeric value");
                equal(JSC.isNumeric(undefined), false, "An undefined value must not be considered as a numeric value");
                equal(JSC.isNumeric(null), false, "A null value must not be considered as a numeric value");
                equal(JSC.isNumeric({}), false, "An object must not be considered as a numeric value");
                equal(JSC.isNumeric(new Object()), false, "An object must not be considered as a numeric value");
                equal(JSC.isNumeric([]), false, "An array must not be considered as a numeric value");
                equal(JSC.isNumeric(new Array()), false, "An array must not be considered as a numeric value");
                equal(JSC.isNumeric(function(){}), false, "A function must not be considered as a numeric value");
                equal(JSC.isNumeric(new Function()), false, "A function must not be considered as a numeric value");
                equal(JSC.isNumeric("ddd"), false, "A string must not be considered as a numeric value");
                equal(JSC.isNumeric(new String()), false, "A string must not be considered as a numeric value");
                equal(JSC.isNumeric(true), false, "A boolean must not be considered as a numeric value");
                equal(JSC.isNumeric(new Boolean()), false, "A boolean must not be considered as a numeric value");
                equal(JSC.isNumeric(/xyz/), false, "A regex must not be considered as a numeric value");
                equal(JSC.isNumeric(new RegExp()), false, "A regex must not be considered as a numeric value");
                equal(JSC.isNumeric(aClass), false, "A class definition must not be considered as a numeric value");
                equal(JSC.isNumeric(new aClass()), false, "A class instance must not be considered as a numeric value");

                // check response when value is a numeric
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
                var className = "aClass", aClass = JSC(className);

                // check response when value is not null
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
                equal(JSC.isNull(new Function()), false, "A function must not be considered as a null value");
                equal(JSC.isNull("ddd"), false, "A string must not be considered as a null value");
                equal(JSC.isNull(new String()), false, "A string must not be considered as a null value");
                equal(JSC.isNull(true), false, "A boolean must not be considered as a null value");
                equal(JSC.isNull(new Boolean()), false, "A boolean must not be considered as a null value");
                equal(JSC.isNull(/xyz/), false, "A regex must not be considered as a null value");
                equal(JSC.isNull(new RegExp()), false, "A regex must not be considered as a null value");
                equal(JSC.isNull(aClass), false, "A class definition must not be considered as a null value");
                equal(JSC.isNull(new aClass()), false, "A class instance must not be considered as a null value");

                // check response when value is null
                equal(JSC.isNull(null), true, "A null value must be considered as a null value");
            },

            /**
             * Test of JSC.isUndef()
             */
            isUndef : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not undefined
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
                equal(JSC.isUndef(new Function()), false, "A function must not be considered as an undefined value");
                equal(JSC.isUndef("ddd"), false, "A string must not be considered as an undefined value");
                equal(JSC.isUndef(new String()), false, "A string must not be considered as an undefined value");
                equal(JSC.isUndef(true), false, "A boolean must not be considered as an undefined value");
                equal(JSC.isUndef(new Boolean()), false, "A boolean must not be considered as an undefined value");
                equal(JSC.isUndef(/xyz/), false, "A regex must not be considered as an undefined value");
                equal(JSC.isUndef(new RegExp()), false, "A regex must not be considered as an undefined value");
                equal(JSC.isUndef(aClass), false, "A class definition must not be considered as an undefined value");
                equal(JSC.isUndef(new aClass()), false, "A class instance must not be considered as an undefined value");

                // check response when value is undefined
                equal(JSC.isUndef(), true, "An undefined value must be considered as an undefined value");
                equal(JSC.isUndef(undefined), true, "An undefined value must be considered as an undefined value");
            },

            /**
             * Test of JSC.isVoid()
             */
            isVoid : function() {
                var className = "aClass", aClass = JSC(className);

                // check response when value is not null or undefined
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
                equal(JSC.isVoid(new Function()), false, "A function must not be considered as a null or undefined value");
                equal(JSC.isVoid("ddd"), false, "A string must not be considered as a null or undefined value");
                equal(JSC.isVoid(new String()), false, "A string must not be considered as a null or undefined value");
                equal(JSC.isVoid(true), false, "A boolean must not be considered as a null or undefined value");
                equal(JSC.isVoid(new Boolean()), false, "A boolean must not be considered as a null or undefined value");
                equal(JSC.isVoid(/xyz/), false, "A regex must not be considered as a null or undefined value");
                equal(JSC.isVoid(new RegExp()), false, "A regex must not be considered as a null or undefined value");
                equal(JSC.isVoid(aClass), false, "A class definition must not be considered as a null or undefined value");
                equal(JSC.isVoid(new aClass()), false, "A class instance must not be considered as a null or undefined value");

                // check response when value is null or undefined
                equal(JSC.isVoid(), true, "An undefined value must be considered as a null or undefined value");
                equal(JSC.isVoid(undefined), true, "An undefined value must be considered as a null or undefined value");
                equal(JSC.isVoid(null), true, "A null value must be considered as a null or undefined value");
            },

            /**
             * Test of JSC.isHTML()
             */
            isHTML : function() {
                var className = "aClass", aClass = JSC(className), testHTML_yes, testHTML_no;

                testHTML_yes = getIt(function(value) {
                    equal(JSC.isHTML(value), true, "The string \"" + value + "\" must be considered as an HTML string");
                });

                testHTML_no = getIt(function(value) {
                    equal(JSC.isHTML(value), false, "The string \"" + value + "\" must not be considered as an HTML string");
                });

                // check response when value is not an HTML string
                equal(JSC.isHTML(), false, "An undefined value must not be considered as an HTML string");
                equal(JSC.isHTML(undefined), false, "An undefined value must not be considered as an HTML string");
                equal(JSC.isHTML(null), false, "A null value must not be considered as an HTML string");
                equal(JSC.isHTML({}), false, "An object must not be considered as an HTML string");
                equal(JSC.isHTML(new Object()), false, "An object must not be considered as an HTML string");
                equal(JSC.isHTML([]), false, "An array must not be considered as an HTML string");
                equal(JSC.isHTML(new Array()), false, "An array must not be considered as an HTML string");
                equal(JSC.isHTML(function(){}), false, "A function must not be considered as an HTML string");
                equal(JSC.isHTML(new Function()), false, "A function must not be considered as an HTML string");
                equal(JSC.isHTML(10), false, "A number must not be considered as an HTML string");
                equal(JSC.isHTML(new Number()), false, "A number must not be considered as an HTML string");
                equal(JSC.isHTML(true), false, "A boolean must not be considered as an HTML string");
                equal(JSC.isHTML(new Boolean()), false, "A boolean must not be considered as an HTML string");
                equal(JSC.isHTML(/xyz/), false, "A regex must not be considered as an HTML string");
                equal(JSC.isHTML(new RegExp()), false, "A regex must not be considered as an HTML string");
                equal(JSC.isHTML(aClass), false, "A class definition must not be considered as an HTML string");
                equal(JSC.isHTML(new aClass()), false, "A class instance must not be considered as an HTML string");
                equal(JSC.isHTML(""), false, "a simple string must not be considered as an HTML string");
                equal(JSC.isHTML(new String()), false, "a simple string must not be considered as an HTML string");
                testHTML_no("this a text");
                testHTML_no("div");
                testHTML_no("div.class");
                testHTML_no("div#id");
                testHTML_no("input[type=text]");
                testHTML_no("input#id[type=text]");
                testHTML_no("input.class[type=text]");
                testHTML_no("input#id.class[type=text]");
                testHTML_no("page.html");
                testHTML_no("page.html?param=1");
                testHTML_no("page.html#dash");
                testHTML_no("page.html?param=1#dash");
                testHTML_no("/path/to/page.html");
                testHTML_no("/path/to/page.html?param=1");
                testHTML_no("/path/to/page.html#dash");
                testHTML_no("/path/to/page.html?param=1#dash");
                testHTML_no("www.domain.com/path/to/page.html");
                testHTML_no("www.domain.com/path/to/page.html?param=1");
                testHTML_no("www.domain.com/path/to/page.html#dash");
                testHTML_no("www.domain.com/path/to/page.html?param=1#dash");
                testHTML_no("http://www.domain.com/path/to/page.html");
                testHTML_no("http://www.domain.com/path/to/page.html?param=1");
                testHTML_no("http://www.domain.com/path/to/page.html#dash");
                testHTML_no("http://www.domain.com/path/to/page.html?param=1#dash");

                // check response when value is an HTML string
                testHTML_yes("<div>");
                testHTML_yes("<br>");
                testHTML_yes("<hr />");
                testHTML_yes("a text <span>with</span> <b>html</b>");
                testHTML_yes("<div>a text <span>with</span> <b>html</b></div>");
                testHTML_yes('<a href="http://www.domain.com/path/to/page.html?param=1#dash">a link</a>');
            },

            /**
             * Test of JSC.isSelector()
             */
            isSelector : function() {
                var className = "aClass", aClass = JSC(className), testSelector_yes, testSelector_no;

                testSelector_yes = getIt(function(value) {
                    equal(JSC.isSelector(value), true, "The string \"" + value + "\" must be considered as a CSS selector string");
                });

                testSelector_no = getIt(function(value) {
                    equal(JSC.isSelector(value), false, "The string \"" + value + "\" must not be considered as a CSS selector string");
                });

                // check response when value is not a CSS selector string
                equal(JSC.isSelector(), false, "An undefined value must not be considered as a CSS selector string");
                equal(JSC.isSelector(undefined), false, "An undefined value must not be considered as a CSS selector string");
                equal(JSC.isSelector(null), false, "A null value must not be considered as a CSS selector string");
                equal(JSC.isSelector({}), false, "An object must not be considered as a CSS selector string");
                equal(JSC.isSelector(new Object()), false, "An object must not be considered as a CSS selector string");
                equal(JSC.isSelector([]), false, "An array must not be considered as a CSS selector string");
                equal(JSC.isSelector(new Array()), false, "An array must not be considered as a CSS selector string");
                equal(JSC.isSelector(function(){}), false, "A function must not be considered as a CSS selector string");
                equal(JSC.isSelector(new Function()), false, "A function must not be considered as a CSS selector string");
                equal(JSC.isSelector(10), false, "A number must not be considered as a CSS selector string");
                equal(JSC.isSelector(new Number()), false, "A number must not be considered as a CSS selector string");
                equal(JSC.isSelector(true), false, "A boolean must not be considered as a CSS selector string");
                equal(JSC.isSelector(new Boolean()), false, "A boolean must not be considered as a CSS selector string");
                equal(JSC.isSelector(/xyz/), false, "A regex must not be considered as a CSS selector string");
                equal(JSC.isSelector(new RegExp()), false, "A regex must not be considered as a CSS selector string");
                equal(JSC.isSelector(aClass), false, "A class definition must not be considered as a CSS selector string");
                equal(JSC.isSelector(new aClass()), false, "A class instance must not be considered as a CSS selector string");
                equal(JSC.isSelector(""), false, "a simple string must not be considered as a CSS selector string");
                equal(JSC.isSelector(new String()), false, "a simple string must not be considered as a CSS selector string");
                testSelector_no("<div>");
                testSelector_no("<br>");
                testSelector_no("<hr />");
                testSelector_no("a text <span>with</span> <b>html</b>");
                testSelector_no("<div>a text <span>with</span> <b>html</b></div>");
                testSelector_no("page.html?param=1");
                testSelector_no("page.html?param=1#dash");
                testSelector_no("/path/to/page.html");
                testSelector_no("/path/to/page.html?param=1");
                testSelector_no("/path/to/page.html#dash");
                testSelector_no("/path/to/page.html?param=1#dash");
                testSelector_no("www.domain.com/path/to/page.html");
                testSelector_no("www.domain.com/path/to/page.html?param=1");
                testSelector_no("www.domain.com/path/to/page.html#dash");
                testSelector_no("www.domain.com/path/to/page.html?param=1#dash");
                testSelector_no("http://www.domain.com/path/to/page.html");
                testSelector_no("http://www.domain.com/path/to/page.html?param=1");
                testSelector_no("http://www.domain.com/path/to/page.html#dash");
                testSelector_no("http://www.domain.com/path/to/page.html?param=1#dash");

                // test cases
                var i, j, k, first, testCases = [
                    "*",
                    "div",
                    ".class",
                    "#id",
                    ":hover",
                    "::first-line",
                    ":not(span)",
                    "[name]",
                    "[name=value]",
                    "[value=\"some words\"]",
                    "[value~=\"some words\"]",
                    "[value^=\"some words\"]",
                    "[value$=\"some words\"]",
                    "[data-*=\"some words\"]"
                ];

                // check response when value is a CSS selector string
                for(i = 0; i < testCases.length; i++) {
                    // test a single expression
                    testSelector_yes(testCases[i]);

                    // compose expressions
                    for(j = 0; j < testCases.length; j++) {
                        if( i || j ) {
                            if( i != j ) {
                                testSelector_yes(testCases[i] + (!i || !j ? " " : "") + testCases[j]);
                            }

                            testSelector_yes(testCases[i] + " " + testCases[j]);
                            testSelector_yes(testCases[i] + " + " + testCases[j]);
                            testSelector_yes(testCases[i] + " > " + testCases[j]);
                            testSelector_yes(testCases[i] + " ~ " + testCases[j]);
                        }
                    }
                }
            },

            /**
             * Test of JSC.isURL()
             */
            isURL : function() {
                var className = "aClass", aClass = JSC(className), testURL_yes, testURL_no;

                testURL_yes = getIt(function(value) {
                    equal(JSC.isURL(value), true, "The string \"" + value + "\" must be considered as an URL string");
                });

                testURL_no = getIt(function(value) {
                    equal(JSC.isURL(value), false, "The string \"" + value + "\" must not be considered as an URL string");
                });

                // check response when value is not an URL string
                equal(JSC.isHTML(), false, "An undefined value must not be considered as an URL string");
                equal(JSC.isHTML(undefined), false, "An undefined value must not be considered as an URL string");
                equal(JSC.isHTML(null), false, "A null value must not be considered as an URL string");
                equal(JSC.isHTML({}), false, "An object must not be considered as an URL string");
                equal(JSC.isHTML(new Object()), false, "An object must not be considered as an URL string");
                equal(JSC.isHTML([]), false, "An array must not be considered as an URL string");
                equal(JSC.isHTML(new Array()), false, "An array must not be considered as an URL string");
                equal(JSC.isHTML(function(){}), false, "A function must not be considered as an URL string");
                equal(JSC.isHTML(new Function()), false, "A function must not be considered as an URL string");
                equal(JSC.isHTML(10), false, "A number must not be considered as an URL string");
                equal(JSC.isHTML(new Number()), false, "A number must not be considered as an URL string");
                equal(JSC.isHTML(true), false, "A boolean must not be considered as an URL string");
                equal(JSC.isHTML(new Boolean()), false, "A boolean must not be considered as an URL string");
                equal(JSC.isHTML(/xyz/), false, "A regex must not be considered as an URL string");
                equal(JSC.isHTML(new RegExp()), false, "A regex must not be considered as an URL string");
                equal(JSC.isHTML(aClass), false, "A class definition must not be considered as an URL string");
                equal(JSC.isHTML(new aClass()), false, "A class instance must not be considered as an URL string");
                equal(JSC.isHTML(""), false, "a simple string must not be considered as an URL string");
                equal(JSC.isHTML(new String()), false, "a simple string must not be considered as an URL string");
                testURL_no("this a text");
                testURL_no("div");
                testURL_no("div#id");
                testURL_no("input[type=text]");
                testURL_no("input#id[type=text]");
                testURL_no("input.class[type=text]");
                testURL_no("input#id.class[type=text]");
                testURL_no("<div>");
                testURL_no("<br>");
                testURL_no("<hr />");
                testURL_no("a text <span>with</span> <b>html</b>");
                testURL_no("<div>a text <span>with</span> <b>html</b></div>");
                testURL_no('<a href="http://www.domain.com/path/to/page.html?param=1#dash">a link</a>');

                // check response when value is an URL string
                testURL_yes("page.html");
                testURL_yes("page.html?param=1");
                testURL_yes("page.html?param=1,2,3");
                testURL_yes("page.html?param=1;2;3");
                testURL_yes("page.html#dash");
                testURL_yes("page.html?param=1#dash");
                testURL_yes("page.html?param=1,2,3#dash");
                testURL_yes("page.html?param=1;2;3#dash");
                testURL_yes("/page.html");
                testURL_yes("/page.html?param=1");
                testURL_yes("/page.html?param=1,2,3");
                testURL_yes("/page.html?param=1;2;3");
                testURL_yes("/page.html#dash");
                testURL_yes("/page.html?param=1#dash");
                testURL_yes("/page.html?param=1,2,3#dash");
                testURL_yes("/page.html?param=1;2;3#dash");
                testURL_yes("./page.html");
                testURL_yes("./page.html?param=1");
                testURL_yes("./page.html?param=1,2,3");
                testURL_yes("./page.html?param=1;2;3");
                testURL_yes("./page.html#dash");
                testURL_yes("./page.html?param=1#dash");
                testURL_yes("./page.html?param=1,2,3#dash");
                testURL_yes("./page.html?param=1;2;3#dash");
                testURL_yes("/path/to/page.html");
                testURL_yes("/path/to/page.html?param=1");
                testURL_yes("/path/to/page.html?param=1,2,3");
                testURL_yes("/path/to/page.html?param=1;2;3");
                testURL_yes("/path/to/page.html#dash");
                testURL_yes("/path/to/page.html?param=1#dash");
                testURL_yes("/path/to/page.html?param=1,2,3#dash");
                testURL_yes("/path/to/page.html?param=1;2;3#dash");
                testURL_yes("./path/to/page.html");
                testURL_yes("./path/to/page.html?param=1");
                testURL_yes("./path/to/page.html?param=1,2,3");
                testURL_yes("./path/to/page.html?param=1;2;3");
                testURL_yes("./path/to/page.html#dash");
                testURL_yes("./path/to/page.html?param=1#dash");
                testURL_yes("./path/to/page.html?param=1,2,3#dash");
                testURL_yes("./path/to/page.html?param=1;2;3#dash");
                testURL_yes("www.domain.com/path/to/page.html");
                testURL_yes("www.domain.com/path/to/page.html?param=1");
                testURL_yes("www.domain.com/path/to/page.html?param=1,2,3");
                testURL_yes("www.domain.com/path/to/page.html?param=1;2;3");
                testURL_yes("www.domain.com/path/to/page.html#dash");
                testURL_yes("www.domain.com/path/to/page.html?param=1#dash");
                testURL_yes("www.domain.com/path/to/page.html?param=1,2,3#dash");
                testURL_yes("www.domain.com/path/to/page.html?param=1;2;3#dash");
                testURL_yes("http://www.domain.com/path/to/page.html");
                testURL_yes("http://www.domain.com/path/to/page.html?param=1");
                testURL_yes("http://www.domain.com/path/to/page.html?param=1,2,3");
                testURL_yes("http://www.domain.com/path/to/page.html?param=1;2;3");
                testURL_yes("http://www.domain.com/path/to/page.html#dash");
                testURL_yes("http://www.domain.com/path/to/page.html?param=1#dash");
                testURL_yes("http://www.domain.com/path/to/page.html?param=1,2,3#dash");
                testURL_yes("http://www.domain.com/path/to/page.html?param=1;2;3#dash");
                testURL_yes("http://www.domain.com:user@p4ss3/path/to/page.html?param=1#dash");
                testURL_yes("http://www.domain.com:user@p4ss3/path/to/page.html?param=1,2,3#dash");
                testURL_yes("http://www.domain.com:user@p4ss3/path/to/page.html?param=1;2;3#dash");
                testURL_yes("/path/to/a/page/without/extension");
                testURL_yes("/path/to/a/page/without/extension?param=1");
                testURL_yes("/path/to/a/page/without/extension?param=1,2,3");
                testURL_yes("/path/to/a/page/without/extension?param=1;2;3");
                testURL_yes("/path/to/a/page/without/extension#dash");
                testURL_yes("/path/to/a/page/without/extension?param=1#dash");
                testURL_yes("/path/to/a/page/without/extension?param=1,2,3#dash");
                testURL_yes("/path/to/a/page/without/extension?param=1;2;3#dash");
                testURL_yes("./path/to/a/page/without/extension");
                testURL_yes("./path/to/a/page/without/extension?param=1");
                testURL_yes("./path/to/a/page/without/extension?param=1,2,3");
                testURL_yes("./path/to/a/page/without/extension?param=1;2;3");
                testURL_yes("./path/to/a/page/without/extension#dash");
                testURL_yes("./path/to/a/page/without/extension?param=1#dash");
                testURL_yes("./path/to/a/page/without/extension?param=1,2,3#dash");
                testURL_yes("./path/to/a/page/without/extension?param=1;2;3#dash");
                testURL_yes("www.domain.com/path/to/a/page/without/extension");
                testURL_yes("www.domain.com/path/to/a/page/without/extension?param=1");
                testURL_yes("www.domain.com/path/to/a/page/without/extension?param=1,2,3");
                testURL_yes("www.domain.com/path/to/a/page/without/extension?param=1;2;3");
                testURL_yes("www.domain.com/path/to/a/page/without/extension#dash");
                testURL_yes("www.domain.com/path/to/a/page/without/extension?param=1#dash");
                testURL_yes("www.domain.com/path/to/a/page/without/extension?param=1,2,3#dash");
                testURL_yes("www.domain.com/path/to/a/page/without/extension?param=1;2;3#dash");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension?param=1");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension?param=1,2,3");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension?param=1;2;3");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension#dash");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension?param=1#dash");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension?param=1,2,3#dash");
                testURL_yes("http://www.domain.com/path/to/a/page/without/extension?param=1;2;3#dash");
                testURL_yes("http://www.domain.com:user@p4ss3/path/to/a/page/without/extension?param=1#dash");
                testURL_yes("http://www.domain.com:user@p4ss3/path/to/a/page/without/extension?param=1,2,3#dash");
                testURL_yes("http://www.domain.com:user@p4ss3/path/to/a/page/without/extension?param=1;2;3#dash");
            },

            /**
             * Test of JSC.camelize()
             */
            camelize : function() {
                // wrap all test cases in a single function
                var testCamelize = getIt(function(value, result, resultAll){
                    resultAll = resultAll || result;
                    var displayValue = "string" === typeof value ? '"' + value + '"' : value,
                        displayResult = '"' + result + '"',
                        displayResultAll = '"' + resultAll + '"';
                    equal(JSC.camelize(value), result, "JSC.camelize(" + displayValue + ") must return " + displayResult);
                    equal(JSC.camelize(value, false), result, "JSC.camelize(" + displayValue + ", false) must return " + displayResult);
                    equal(JSC.camelize(value, true), resultAll, "JSC.camelize(" + displayValue + ", true) must return " + displayResultAll);
                });

                // process the test cases
                testCamelize(undefined, "");
                testCamelize(1, "1");
                testCamelize(4.2, "4.2");
                testCamelize("jsonData", "jsonData", "JsonData");
                testCamelize("isHTML", "isHTML", "IsHTML");
                testCamelize("is_HTML", "isHTML", "IsHTML");
                testCamelize("is_html", "isHtml", "IsHtml");
                testCamelize("to_lower_case", "toLowerCase", "ToLowerCase");
                testCamelize("to_lowerCase", "toLowerCase", "ToLowerCase");
                testCamelize("toLower_Case", "toLowerCase", "ToLowerCase");
            },

            /**
             * Test of JSC.underscore()
             */
            underscore : function() {
                // wrap all test cases in a single function
                var testUnderscore = getIt(function(value, result, resultLower){
                    resultLower = resultLower || result;
                    var displayValue = "string" === typeof value ? '"' + value + '"' : value,
                        displayResult = '"' + result + '"',
                        displayResultLower = '"' + resultLower + '"';
                    equal(JSC.underscore(value), result, "JSC.underscore(" + displayValue + ") must return " + displayResult);
                    equal(JSC.underscore(value, false), result, "JSC.underscore(" + displayValue + ", false) must return " + displayResult);
                    equal(JSC.underscore(value, true), resultLower, "JSC.underscore(" + displayValue + ", true) must return " + displayResultLower);
                });

                // process the test cases
                testUnderscore(undefined, "");
                testUnderscore(1, "1");
                testUnderscore(4.2, "4.2");
                testUnderscore("JsonData", "Json_Data", "json_data");
                testUnderscore("IsHTML", "Is_HTML", "is_html");
                testUnderscore("is_HTML", "is_HTML", "is_html");
                testUnderscore("is_html", "is_html", "is_html");
                testUnderscore("toLowerCase", "to_Lower_Case", "to_lower_case");
                testUnderscore("to_lowerCase", "to_lower_Case", "to_lower_case");
                testUnderscore("ToLower_Case", "To_Lower_Case", "to_lower_case");
            },

            /**
             * Test of JSC.regex()
             */
            regex : function() {
                // wrap all test cases in a single function
                var testRegex = getIt(function(value, result){
                    var displayValue = "string" === typeof value ? '"' + value + '"' : value,
                        displayResult = '"' + result + '"';
                    equal(JSC.regex(value), result, "JSC.regex(" + displayValue + ") must return " + displayResult);
                });

                // process the test cases
                testRegex(undefined, "");
                testRegex(1, "1");
                testRegex(4.2, "4\\.2");
                testRegex("isHTML", "isHTML");
                testRegex("is_html", "is_html");
                testRegex("{::}", "\\{\\:\\:\\}");
                testRegex("[a-z]", "\\[a\\-z\\]");
                testRegex("a text with (a) regex [into]", "a text with \\(a\\) regex \\[into\\]");
            },

            /**
             * Test of JSC.error()
             */
            error : function() {
                var i, defaultError = "Unexpected error !";

                // test default error message
                try {
                    JSC.error();
                } catch(e) {
                    ok(e instanceof Error, "Throwed error must be an instance of Error !");
                    ok(e instanceof JSC.Error, "Throwed error must be an instance of JSC.Error !");
                    equal(e.message, defaultError, "Default error message must be used");
                    equal(e.context, undefined, "No context must be set");
                }

                // tests many errors
                (function(list) {
                    for(i = 0; i < list.length; i++) {
                        try {
                            JSC.error(list[i].message, list[i].context);
                        } catch(e) {
                            ok(e instanceof Error, "Throwed error must be an instance of Error !");
                            ok(e instanceof JSC.Error, "Throwed error must be an instance of JSC.Error !");
                            equal(e.message, list[i].expectedMessage, "Expected message must be set to throwing #" + i);
                            equal(e.context, list[i].expectedContext, "Expected context must be set to throwing #" + i);
                        }
                    }
                })([{
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
                }]);
            },

            /**
             * Test of JSC.globalize()
             */
            globalize : function() {
                var ret, valueName, exportable = "exported";

                // call without arguments
                notThrow(function(){
                    ret = JSC.globalize();
                    strictEqual(ret, undefined, "JSC.globalize() must return nothing when no parameter is given");
                }, "Call of JSC.globalize() without parameter must not throw an exception");

                // check no existence of global variable
                ok("undefined" == typeof myTestExport, "Not exported variable must not exist in global context !");

                // export a string
                valueName = "myTestExport";
                ret = JSC.globalize(valueName, exportable);
                strictEqual(ret, exportable, "JSC.globalize() must return the given value");
                ok("undefined" != typeof myTestExport, "Exported variable must exist in global context !");
                strictEqual(myTestExport, exportable, "Exported variable must equal source value !");

                // remove global string variable
                ret = JSC.globalize(valueName);
                strictEqual(ret, exportable, "JSC.globalize() must return the removed value");
                ok("undefined" == typeof myTestExport, "The variable must be removed from global context !");

                // export a named object
                exportable = {};
                exportable.className = "classExport";
                ret = JSC.globalize(exportable);
                strictEqual(ret, exportable, "JSC.globalize() must return the given value");
                ok("undefined" != typeof classExport, "Exported class must exist in global context !");
                strictEqual(classExport, exportable, "Exported class must equal source value !");

                // remove global object variable
                ret = JSC.globalize(exportable.className);
                strictEqual(ret, exportable, "JSC.globalize() must return the removed value");
                ok("undefined" == typeof classExport, "The variable must be removed from global context !");

                // export an anonymous object
                exportable = {};
                ret = JSC.globalize(true, exportable);
                strictEqual(ret, exportable, "JSC.globalize() must return the given value");
                ok("undefined" != typeof JSC.global("true"), "No string parameter must be converted to string when two parameters are given !");
                strictEqual(JSC.global("true"), exportable, "Exported value must equal source value !");

                // remove global anonymous object variable
                ret = JSC.globalize("true");
                strictEqual(ret, exportable, "JSC.globalize() must return the removed value");
                strictEqual(JSC.global("true"), undefined, "The variable must be removed from global context !");

                // export a namespace value
                exportable = "test";
                valueName = "JSC.global.exported";
                ret = JSC.globalize(valueName, exportable);
                strictEqual(ret, exportable, "JSC.globalize() must return the given value");
                strictEqual(JSC.global(valueName), exportable, "Exported value must equal source value !");

                // remove a namespace value
                ret = JSC.globalize(valueName);
                strictEqual(ret, exportable, "JSC.globalize() must return the removed value");
                strictEqual(JSC.global(valueName), undefined, "The variable must be removed from global context !");

                // export a namespace value into an unknown context
                valueName = "JSC.unknown.exported";
                ret = JSC.globalize(valueName, exportable);
                strictEqual(ret, undefined, "JSC.globalize() must return undefined value");
                strictEqual(JSC.global(valueName), undefined, "Value must not be exported !");
            },

            /**
             * Test of JSC.global()
             */
            global : function() {
                var ret, globalized = "globalized";

                // call without arguments
                notThrow(function(){
                    ret = JSC.global();
                    strictEqual(ret, undefined, "JSC.global() must return nothing when no parameter is given");
                }, "Call of JSC.global() without parameter must not throw an exception");

                // variable must not be already global before test
                strictEqual(JSC.global("myTestGlobal"), undefined, "Local variable must not exist in global context !");

                // check access to global variable
                JSC.globalize("myTestGlobal", globalized);
                ret = JSC.global("myTestGlobal");
                ok("undefined" != typeof ret, "Global variable must exist in global context !");
                strictEqual(ret, globalized, "Global variable must equal source value !");
                strictEqual(JSC.global("myTestGlobal"), ret, "Each call of JSC.global() must return same value when same name is used !");
            },

            /**
             * Test of JSC.toString()
             */
            toString : function() {
                var date = dateUTC(2012, 12, 21, 23, 59, 59, 999), tz = "2012-12-21T23:59:59.999Z";

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
                equal(JSC.toString(date), tz, "JSC.toString(Date) must return the date under TZ notation");
            },

            /**
             * Test of JSC.jsonData()
             */
            jsonData : function() {
                var val, ret, exp, date = dateUTC(2013, 1, 1, 12, 30, 0, 500), tz = "2013-01-01T12:30:00.500Z";

                // test on simple values
                strictEqual(JSC.jsonData(), undefined, "undefined value");
                strictEqual(JSC.jsonData(new Function()), undefined, "function object");
                strictEqual(JSC.jsonData(function(){}), undefined, "function value");
                strictEqual(JSC.jsonData(/test/), undefined, "regexp value");
                strictEqual(JSC.jsonData(new RegExp()), undefined, "regexp object");
                strictEqual(JSC.jsonData(date), tz, "date object");
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

                // test on void array
                val = [];
                exp = [];
                ret = JSC.jsonData(val);
                deepEqual(ret, exp, "void array");
                notStrictEqual(ret, val, "void array must be cloned");

                // test on filled array
                val = getIt([1,2,null,"3",true,false,undefined,function(){},/exp/,date,{t:2},[1]]);
                exp = getIt([1,2,null,"3",true,false,tz,{t:2},[1]]);
                ret = JSC.jsonData(val);
                deepEqual(ret, exp, "full array");
                notStrictEqual(ret, val, "array must be cloned");
                notStrictEqual(ret[ret.length - 2], val[val.length - 2], "array contained object must be cloned");
                notStrictEqual(ret[ret.length - 1], val[val.length - 1], "array contained array must be cloned");

                // test on void object
                val = {};
                exp = {};
                ret = JSC.jsonData(val);
                deepEqual(ret, exp, "void object");
                notStrictEqual(ret, val, "void object must be cloned");

                // test on filled object
                val = getIt({
                    v1: 1,
                    v2: 2,
                    v3: null,
                    v4: "3",
                    v5: true,
                    v6: false,
                    v7: undefined,
                    v8: function(){},
                    v9: /exp/,
                    v10: date,
                    v11: {t:2},
                    v12: [1]
                });
                exp = getIt({
                    v1: 1,
                    v2: 2,
                    v3: null,
                    v4: "3",
                    v5: true,
                    v6: false,
                    v10: tz,
                    v11: {t:2},
                    v12: [1]
                });
                ret = JSC.jsonData(val);
                deepEqual(ret, exp, "full object");
                notStrictEqual(ret, val, "object must be cloned");
                notStrictEqual(ret.v11, val.v11, "object contained object must be cloned");
                notStrictEqual(ret.v12, val.v12, "object contained array must be cloned");
            },

            /**
             * Test of JSC.jsonEncode()
             */
            jsonEncode : function() {
                var val, ret, exp, date = dateUTC(2013, 1, 1, 12, 30, 0, 500), tz = '"2013-01-01T12:30:00.500Z"';

                // test on simple values
                strictEqual(JSC.jsonEncode(), "", "undefined value");
                strictEqual(JSC.jsonEncode(new Function()), "", "function object");
                strictEqual(JSC.jsonEncode(function(){}), "", "function value");
                strictEqual(JSC.jsonEncode(/test/), "", "regexp value");
                strictEqual(JSC.jsonEncode(new RegExp()), "", "regexp object");
                strictEqual(JSC.jsonEncode(date), tz  , "date object");

                equal(JSC.jsonEncode(true), "true", "boolean 'true' value");
                equal(JSC.jsonEncode(false), "false", "boolean 'false' value");
                equal(JSC.jsonEncode(null), "null", "null value");
                equal(JSC.jsonEncode(""), '""', "void string value");
                equal(JSC.jsonEncode("test"), '"test"', "string value");
                equal(JSC.jsonEncode(0), "0", "void number");
                equal(JSC.jsonEncode(10), "10", "positive number");
                equal(JSC.jsonEncode(-24), "-24", "negative number");
                equal(JSC.jsonEncode(3.14), "3.14", "decimal number");
                equal(JSC.jsonEncode(10/3), "" + (10/3), "decimal number");
                equal(JSC.jsonEncode(Infinity), "null", "decimal non finite number");
                equal(JSC.jsonEncode(3.14e-10), "3.14e-10", "decimal exposant number");

                // test on void array
                val = [];
                exp = "[]";
                ret = JSC.jsonEncode(val);
                equal(ret, exp, "void array");

                // test on filled array
                val = getIt([1,2,null,"3",true,false,undefined,function(){},/exp/,date,{t:2},[1]]);
                exp = '[1,2,null,"3",true,false,' + tz + ',{"t":2},[1]]';
                ret = JSC.jsonEncode(val);
                equal(ret, exp, "full array");

                // test on void object
                val = {};
                exp = "{}";
                ret = JSC.jsonEncode(val);
                equal(ret, exp, "void object");

                // test on filled object
                val = getIt({
                    v1: 1,
                    v2: 2,
                    v3: null,
                    v4: "3",
                    v5: true,
                    v6: false,
                    v7: undefined,
                    v8: function(){},
                    v9: /exp/,
                    v10: date,
                    v11: {t:2},
                    v12: [1]
                });
                exp = '{"v1":1,"v2":2,"v3":null,"v4":"3","v5":true,"v6":false,"v10":' + tz + ',"v11":{"t":2},"v12":[1]}';
                ret = JSC.jsonEncode(val);
                equal(ret, exp, "full object");
            },

            /**
             * Test of JSC.jsonDecode()
             */
            jsonDecode : function(s) {
                notThrow(function(){
                    // some extra tests functions
                    var
                        _isNull = getIt(function(value, message) {
                            strictEqual(JSC.jsonDecode(value), null, message || (typeof value) + " value");
                        }),

                        _isStrictEqual = getIt(function(value, expected, message) {
                            strictEqual(JSC.jsonDecode(value), expected, message);
                            strictEqual(JSC.jsonDecode("  " + value + "  "), expected, message + " (with padding)");
                        }),

                        _isDeepEqual = getIt(function(value, expected, message) {
                            deepEqual(JSC.jsonDecode(value), expected, message);
                            deepEqual(JSC.jsonDecode("  " + value + "  "), expected, message + " (with padding)");
                        });

                    // test non JSON values
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

                    // test simple JSON values
                    _isStrictEqual("10", 10, "string representing positive number");
                    _isStrictEqual("-24", -24, "string representing negative number");
                    _isStrictEqual("3.14", 3.14, "string representing decimal number");
                    _isStrictEqual("3.14e-10", 3.14e-10, "string representing decimal exposant number");
                    _isStrictEqual("true", true, "string representing boolean 'true'");
                    _isStrictEqual("false", false, "string representing boolean 'false'");
                    _isStrictEqual("null", null, "string representing null");

                    // test array JSON values
                    _isDeepEqual("[]", [], "string representing void array");
                    _isDeepEqual('[1,[2,3],{},true,null,"test",{"t":301.14,"v":null},null]', [1,[2,3],{},true,null,"test",{"t":301.14,"v":null},null], "string representing full array");
                    _isNull('[1,[2,3],{,true,null,"test",{"t":301.14,"v":null},null]', "string representing wrong array");

                    // test object JSON values
                    _isDeepEqual("{}", {}, "string representing void object");
                    _isDeepEqual('{"a":1,"b":null,"c":[],"d":{},"e":"","f":"tt","g":false,"h":true,"i":-20,"j":3.14,"k":[1,2,{},[],{"t":null,"i":[]}]}', {"a":1,"b":null,"c":[],"d":{},"e":"","f":"tt","g":false,"h":true,"i":-20,"j":3.14,"k":[1,2,{},[],{"t":null,"i":[]}]}, "string representing full object");
                    _isNull('{"a":1,"b":null,"c":[,"d":{},"e":"","f":"tt","g":false,"h":true,"i":-20,"j:3.14,"k":[1,2,{},[],"t":null,"i":[]}]}', "string representing wrong object");
                }, "JSC.jsonDecode() must not throw any error");
            },

            /**
             * Test of JSC.sort()
             */
            sort : function() {
                var val, exp;
                notThrow(function(){
                    // some extra tests functions
                    var
                        _isStrictEqual = getIt(function(value, message) {
                            strictEqual(JSC.sort(value), value, message);
                        }),

                        _isDeepEqual = getIt(function(value, keys, expected, message) {
                            var ret = JSC.sort(value, keys, true);
                            strictEqual(ret, value, message + ' - strict equal');
                            deepEqual(ret, expected, message + ' - deep equal');
                        }),

                        _toString = getIt(function() {
                            return (this.name || "") + '-' + (this.age || "");
                        });

                    // test on no arrays
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

                    // test on array of objects with gaps and not objects
                    val = getIt([
                        {name: "Bianca", age: 19, city: "Amsterdam", toString: _toString},
                        {name: "John", age: 19, city: "London", toString: _toString},
                        10,
                        {name: "Pierre", age: 22, city: "Paris", toString: _toString},
                        {name: "Frank", age: 22, city: "Berlin", toString: _toString},
                        undefined,
                        {name: "Pierre", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Edgar", age: 27, city: "London", toString: _toString},
                        null,
                        {name: "Patrick", age: 32, city: "Amsterdam", toString: _toString},
                        {name: "Jean", age: 21, city: "Paris", toString: _toString},
                        undefined,
                        {Name: "Paul", age: 22, city: "Berlin", toString: _toString},
                        {name: "Fritz", age: 23, City: "Berlin", toString: _toString},
                        {name: "Ann", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Charles", age: 45, city: "Luxembourg", toString: _toString},
                        20,
                    ]);
                    exp = getIt([
                        10,
                        20,
                        {name: "Fritz", age: 23, City: "Berlin", toString: _toString},
                        {name: "Bianca", age: 19, city: "Amsterdam", toString: _toString},
                        {name: "Patrick", age: 32, city: "Amsterdam", toString: _toString},
                        {Name: "Paul", age: 22, city: "Berlin", toString: _toString},
                        {name: "Frank", age: 22, city: "Berlin", toString: _toString},
                        {name: "John", age: 19, city: "London", toString: _toString},
                        {name: "Edgar", age: 27, city: "London", toString: _toString},
                        {name: "Ann", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Pierre", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Charles", age: 45, city: "Luxembourg", toString: _toString},
                        {name: "Jean", age: 21, city: "Paris", toString: _toString},
                        {name: "Pierre", age: 22, city: "Paris", toString: _toString}
                    ]);
                    _isDeepEqual(val, ["city", "age", "name"], exp, "array of objects");

                    // test on array of objects with no gaps
                    val = getIt([
                        {name: "Bianca", age: 19, city: "Amsterdam", toString: _toString},
                        {name: "John", age: 19, city: "London", toString: _toString},
                        {name: "Pierre", age: 22, city: "Paris", toString: _toString},
                        {name: "Frank", age: 22, city: "Berlin", toString: _toString},
                        {name: "Pierre", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Edgar", age: 27, city: "London", toString: _toString},
                        {name: "Patrick", age: 32, city: "Amsterdam", toString: _toString},
                        {name: "Jean", age: 21, city: "Paris", toString: _toString},
                        {Name: "Paul", age: 22, city: "Berlin", toString: _toString},
                        {name: "Fritz", age: 23, City: "Berlin", toString: _toString},
                        {name: "Ann", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Charles", age: 45, city: "Luxembourg", toString: _toString}
                    ]);
                    exp = getIt([
                        {Name: "Paul", age: 22, city: "Berlin", toString: _toString},
                        {name: "Ann", age: 23, city: "Luxembourg", toString: _toString},
                        {name: "Bianca", age: 19, city: "Amsterdam", toString: _toString},
                        {name: "Charles", age: 45, city: "Luxembourg", toString: _toString},
                        {name: "Edgar", age: 27, city: "London", toString: _toString},
                        {name: "Frank", age: 22, city: "Berlin", toString: _toString},
                        {name: "Fritz", age: 23, City: "Berlin", toString: _toString},
                        {name: "Jean", age: 21, city: "Paris", toString: _toString},
                        {name: "John", age: 19, city: "London", toString: _toString},
                        {name: "Patrick", age: 32, city: "Amsterdam", toString: _toString},
                        {name: "Pierre", age: 22, city: "Paris", toString: _toString},
                        {name: "Pierre", age: 23, city: "Luxembourg", toString: _toString}
                    ]);
                    _isDeepEqual(val, null, exp, "array of objects, no keys");
                }, "JSC.sort() must not throw any error");
            },

            /**
             * Test of JSC.shuffle()
             */
            shuffle : function() {
                var i, b, a = getIt([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                    len = a.length, asum = (len * (len + 1)) / 2, n = len / 2;

                // some extra tests functions
                var _sum = getIt(function(v) {
                    var s = 0, i = 0;
                    while( i < v.length ) {
                        s += v[i++];
                    }
                    return s;
                });

                // test on array
                for(i = 0; i < n; i++) {
                    b = JSC.shuffle(a.slice(0));
                    notDeepEqual(a, b, "Array must be shuffled !");
                    equal(len, b.length, "Length must be conserved");
                    equal(asum, _sum(b), "Sum must be conserved");
                }
            },

            /**
             * Test of JSC.merge()
             */
            merge : function() {
                var o = {}, a = [], o1;

                // no exception can be throwed
                notThrow(function(){
                    // call without parameters
                    o1 = JSC.merge();
                    ok("object" === typeof o1 && JSC.isEmptyObject(o1), "Merging of no object must at least produce an empty object");
                    deepEqual(o1, {}, "Merge result of empty object");

                    // call with an empty object
                    o1 = JSC.merge(o);
                    equal(o, o1, "Merge of a single object must return it at least");
                    deepEqual(o1, {}, "Merge result of empty object");

                    // call with an empty array
                    o1 = JSC.merge(a);
                    equal(a, o1, "Merge of a single array must return it at least");
                    deepEqual(o1, [], "Merge result of empty array");

                    // call with a empty object twice
                    o1 = JSC.merge(o, o);
                    equal(o, o1, "Merge of a single object twice must return it at least");
                    deepEqual(o1, {}, "Merge result of empty object");

                    // call with a empty array twice
                    o1 = JSC.merge(a, a);
                    equal(a, o1, "Merge of a single array twice must return it at least");
                    deepEqual(o1, [], "Merge result of empty array");

                    // call with no object but recursion
                    o1 = JSC.merge(true);
                    ok("object" == typeof(o1), "Merging of no object but a boolean must at least produce an object");
                    deepEqual(o1, {}, "Merge result of no object");

                    // call with two empty objects
                    o1 = JSC.merge(o, {});
                    equal(o, o1, "Merge of an object with another empty object must return it at least");
                    deepEqual(o1, {}, "Merge result of empty objects");

                    // call of an object with an empty array
                    o1 = JSC.merge(o, a);
                    equal(o, o1, "Merge of an object with an empty array must return it at least");
                    deepEqual(o1, {}, "Merge result of object and empty array");

                    // call of an array with an empty object
                    o1 = JSC.merge(a, o);
                    equal(a, o1, "Merge of an array with an empty object must return it at least");
                    deepEqual(o1, [], "Merge result of array and empty object");

                    // call with an object and an empty object
                    o.a = false;
                    o1 = JSC.merge(o, {});
                    equal(o, o1, "Merge of an object with another empty object must return it at least");
                    deepEqual(o1, {a:false}, "Merge result of empty object");

                    // call with a filled object
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

                     // call with another filled object, and no recursion
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

                    // call with another filled object and recursion
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

                    // call with another filled object and no recursion, another object and recursion
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

                    // call with another filled object and recursion, another object and no recursion
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
                }, "Call of JSC.merge() must not throw an exception");
            },

            /**
             * Test of JSC.each()
             */
            each : function() {
                var o1 = {}, o2 = {}, o3, a1 = [], a2 = [], a3, count, value,

                    // walk method
                    _walk = getIt(function(p1, p2) {
                        value = "" + value + this.value + p1 + p2;
                        count ++;
                    });

                // no exception can be throwed
                notThrow(function(){
                    // call without parameters
                    o3 = JSC.each();
                    equal(o3, undefined, "Undefined value must be returned when no parameters is used");

                    // call with only an empty object
                    o3 = JSC.each(o1);
                    equal(o1, o3, "Returned object must be equal to given one");

                    // call with an empty object and a numeric parameter
                    o3 = JSC.each(o1, 10);
                    equal(o1, o3, "Returned object must be equal to given one");

                    // call with an empty object and a boolean parameter
                    o3 = JSC.each(o1, true);
                    equal(o1, o3, "Returned object must be equal to given one");

                    // call with an empty object and another object
                    o3 = JSC.each(o1, {});
                    equal(o1, o3, "Returned object must be equal to given one");

                    // call with an empty object and an array
                    o3 = JSC.each(o1, []);
                    equal(o1, o3, "Returned object must be equal to given one");

                    // call with a filled object and a walk function
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

                    // call with a filled array and a walk function
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

                    // call with a filled collection of objects, and a member walk method
                    o1.it1 = getIt({value: 4, action: _walk});
                    o1.it2 = getIt({value: "t", action: _walk});
                    o1.it3 = getIt({value: 10, action: _walk});
                    count = 0;
                    value = "";
                    o3 = JSC.each(o1, "action", "b", ",");
                    equal(o1, o3, "Returned object must be equal to given one");
                    equal(count, 3, "Function must be called for each property of the object");
                    equal(value, "4b,tb,10b,", "Result of walking in object");

                    // call with a filled array of objects and a member walk method
                    a1 = [];
                    a1.push({value: 4, action: _walk});
                    a1.push({value: "t", action: _walk});
                    a1.push({value: 10, action: _walk});
                    count = 0;
                    value = "";
                    a3 = JSC.each(a1, "action", 7, ";");
                    equal(a1, a3, "Returned array must be equal to given one");
                    equal(count, a1.length, "Function must be called for each item of the array");
                    equal(value, "47;t7;107;", "Result of walking in array");
                }, "Call of JSC.each() must not throw an exception");
            },

            /**
             * Test of JSC.owned()
             */
            owned : function() {
                var A, B, a, b, o;

                // no exception can be throwed
                notThrow(function(){
                    // build some test classes, with prototyped members
                    A = new Function();
                    A[proto].a = true;

                    B = new Function();
                    B[proto] = new A();
                    B[proto].b = true;

                    // add instance owned members
                    a = new A();
                    a.aa = true;

                    b = new B();
                    b.bb = true;

                    // checks existence of prototyped ans owned members at right places
                    ok("undefined" != typeof a.a, "Defined property must exist");
                    ok("undefined" == typeof a.b, "Not defined property must not exist");
                    ok("undefined" != typeof a.aa, "Added property must exist");
                    ok("undefined" == typeof a.bb, "Not added property must not exist");

                    ok("undefined" != typeof b.a, "Herited property must exist");
                    ok("undefined" != typeof b.b, "Defined property must exist");
                    ok("undefined" == typeof b.aa, "Not added property must not exist");
                    ok("undefined" != typeof b.bb, "Added property must exist");

                    // call without arguments
                    o = JSC.owned();
                    ok("object" === typeof o && JSC.isEmptyObject(o), "JSC.owned() must return an empty object when no parameter is given");

                    // check of instance A
                    o = JSC.owned(a);
                    ok("undefined" == typeof o.a, "Defined property must not be tagged as owned");
                    ok("undefined" != typeof o.aa, "Added property must be tagged as owned");
                    ok("undefined" == typeof o.b, "Not defined property must not be tagged as owned");
                    ok("undefined" == typeof o.bb, "Not added property must not be tagged as owned");

                    // check of instance B
                    o = JSC.owned(b);
                    ok("undefined" == typeof o.a, "Defined property must not be tagged as owned");
                    ok("undefined" == typeof o.aa, "Not added property must be not tagged as owned");
                    ok("undefined" == typeof o.b, "Defined property must not be tagged as owned");
                    ok("undefined" != typeof o.bb, "Added property must be tagged as owned");
                }, "Call of JSC.owned() must not throw an exception");
            },

            /**
             * Test of JSC.attach()
             */
            attach : function() {
                var o1 = {}, o2 = {}, o3 = {}, dummy, noopId = JSC.id(JSC.noop),

                    // to-attach member method
                    _member = getIt(function(p) {
                        this.value = p;
                    });

                // prepare testbed
                o1.value = "1";
                o1.fn = _member;
                equal(o1.fn.guid, undefined, "No GUID on method");

                // attach on a first object
                o2.value = "2";
                o2.fn = JSC.attach(_member, o1);
                ok(JSC.isAttached(o2.fn), "Flag must be set to tell the method is context attached");
                ok(o1.fn.guid, "Original method must have a GUID");
                ok(o2.fn.guid, "Proxy method must have a GUID");
                equal(o1.fn.guid, o2.fn.guid, "GUID of proxy and original methods must be equals");
                notEqual(o1.fn, o2.fn, "Proxy and original methods must not be equals");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // attach on a second object
                o3.value = "3";
                o3.fn = JSC.attach(o1, "fn");
                ok(JSC.isAttached(o3.fn), "Flag must be set to tell the method is context attached");
                ok(o3.fn.guid, "Proxy method must have a GUID");
                equal(o1.fn.guid, o3.fn.guid, "GUID of proxy and original methods must be equals");
                notEqual(o1.fn, o3.fn, "Proxy and original methods must not be equals");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // attach no method on given context
                dummy = JSC.attach(undefined, o1);
                ok(JSC.isFunction(dummy), "Proxy method must be given, even if no one was given");
                ok(dummy.guid, "Proxy method must have a GUID");
                equal(dummy.guid, JSC.noop.guid, "Proxy method must have GUID of JSC.noop");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // call with undefined arguments
                dummy = JSC.attach(undefined, undefined);
                ok(JSC.isFunction(dummy), "Proxy method must be given, even if no one was given");
                ok(dummy.guid, "Proxy method must have a GUID");
                equal(dummy.guid, JSC.noop.guid, "Proxy method must have GUID of JSC.noop");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // call without arguments
                dummy = JSC.attach();
                ok(JSC.isFunction(dummy), "Proxy method must be given, even if no one was given");
                ok(dummy.guid, "Proxy method must have a GUID");
                equal(dummy.guid, JSC.noop.guid, "Proxy method must have GUID of JSC.noop");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // call with a given context and an unknown member name
                dummy = JSC.attach(o1, "undefined");
                ok(JSC.isFunction(dummy), "Proxy method must be given, even if no one was given");
                ok(dummy.guid, "Proxy method must have a GUID");
                equal(dummy.guid, JSC.noop.guid, "Proxy method must have GUID of JSC.noop");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // call with an undefined context and an unknown member name
                dummy = JSC.attach(undefined, "undefined");
                ok(JSC.isFunction(dummy), "Proxy method must be given, even if no one was given");
                ok(dummy.guid, "Proxy method must have a GUID");
                equal(dummy.guid, JSC.noop.guid, "Proxy method must have GUID of JSC.noop");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // call with a wrong parameter
                dummy = JSC.attach("undefined");
                ok(JSC.isFunction(dummy), "Proxy method must be given, even if no one was given");
                ok(dummy.guid, "Proxy method must have a GUID");
                equal(dummy.guid, JSC.noop.guid, "Proxy method must have GUID of JSC.noop");
                equal(JSC.noop.guid, noopId, "GUID of JSC.noop must not be altered")

                // checks results
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
             * Test of JSC.abstractMethod()
             */
            abstractMethod : function() {
                var fn, name = "test", o = {}, throwed;

                // get an anonymous abstract method
                fn = JSC.abstractMethod();
                ok(JSC.isFunction(fn), "Abstract method must be a function");
                raises(fn, "Calling of abstract method must throw an exception");
                ok(JSC.isAbstract(fn), "Abstract method must be tagged as abstract");

                // check abstract method in an object
                o.fn = fn;
                throwed = false;
                try {
                    o.fn();
                } catch(e) {
                    throwed = true;
                    if( e instanceof JSC.Error ) {
                        equal(e.context, "[unknownClass].[unknownMethod]", "Error thrown must set right context for unnamed abstract method");
                    } else {
                        ok(false, "Throwed error is not an instance of JSC.Error !");
                    }
                }
                ok(throwed, "Calling of named abstract method in object context must throw an exception");

                // get a named abstract method
                fn = JSC.abstractMethod(name);
                ok(JSC.isFunction(fn), "Named abstract method must be a function");
                raises(fn, "Calling of named abstract method must throw an exception");
                ok(JSC.isAbstract(fn), "Named abstract method must be tagged as abstract");

                // check abstract method in an object
                o.fn = fn;
                throwed = false;
                try {
                    o.fn();
                } catch(e) {
                    throwed = true;
                    if( e instanceof JSC.Error ) {
                        equal(e.context, "[unknownClass]." + name, "Error thrown must set right context for named abstract method");
                    } else {
                        ok(false, "Throwed error is not an instance of JSC.Error !");
                    }
                }
                ok(throwed, "Calling of named abstract method in object context must throw an exception");

                // check abstract method in an instance
                o.className = "A";
                throwed = false;
                try {
                    o.fn();
                } catch(e) {
                    throwed = true;
                    if( e instanceof JSC.Error ) {
                        equal(e.context, "A." + name, "Error thrown must set right context for named abstract method");
                    } else {
                        ok(false, "Throwed error is not an instance of JSC.Error !");
                    }
                }
                ok(throwed, "Calling of named abstract method in object context must throw an exception");
            },

            /**
             * Test of JSC.overload()
             */
            overload : function() {
                var value, o1 = {}, o2 = {}, o3 = {}, o4 = {}, o5 = {}, reOverload = /\binherited\b/,

                    // level1 no overload function
                    fn = getIt(function(p) {
                        value = p + "1";
                    }),

                    // level2 overload function
                    fn2 = getIt(function(p) {
                        this.inherited(p);
                        value += "2";
                    }),

                    // level2 overload function
                    fn3 = getIt(function(p) {
                        this.inherited(p);
                        value += "3";
                    }),

                    // level4 not overload function
                    fn4 = getIt(function(p) {
                        value += p + "4";
                    });

                // call with not overload functions or wrong arguments
                equal(JSC.overload(), undefined, "Overriding for nothing must return nothing");
                equal(JSC.overload(fn), fn, "When no overriding, original method must be returned");
                equal(JSC.overload(fn, fn), fn, "Overload of a method by itself must not produce an overriding method");
                equal(JSC.overload(value = ""), value, "Overriding with a string value must return the value unaltered");
                equal(JSC.overload(value = new String()), value, "Overriding with a string value must return the value unaltered");
                equal(JSC.overload(value = true), value, "Overriding with a boolean value must return the value unaltered");
                equal(JSC.overload(value = new Boolean()), value, "Overriding with a boolean value must return the value unaltered");
                equal(JSC.overload(value = {}), value, "Overriding with an objet value must return the value unaltered");
                equal(JSC.overload(value = new Object()), value, "Overriding with an objet value must return the value unaltered");
                equal(JSC.overload(value = []), value, "Overriding with an array value must return the value unaltered");
                equal(JSC.overload(value = new Array()), value, "Overriding with an array value must return the value unaltered");
                equal(JSC.overload(value = /xyz/), value, "Overriding with a RegExp value must return the value unaltered");
                equal(JSC.overload(value = new RegExp()), value, "Overriding with a RegExp value must return the value unaltered");
                equal(JSC.overload(value = 10), value, "Overriding with a number value must return the value unaltered");
                equal(JSC.overload(value = new Number()), value, "Overriding with a number value must return the value unaltered");

                // build testbed with fake objects
                value = "";
                o1.fn = JSC.overload(fn);
                o2.fn = JSC.overload(fn2, o1.fn);
                o3.fn = JSC.overload(fn3, o2.fn);
                o4.fn = JSC.overload(fn4, o3.fn);
                o5.fn = JSC.overload(fn2);

                // check overload by method adding
                value = "";
                equal(value, "", "Value before call of initial method");
                strictEqual(o1.fn, fn, "Initial method must not be altered");
                ok(!JSC.isOverloaded(o1.fn), "Method must not be tagged as overriding");
                ok(!reOverload.test(o1.fn), "Initial method must not call inherited");
                o1.fn("test");
                equal(value, "test1", "Call of initial method");

                // check overload of existing method
                value = "";
                equal(value, "", "Value before call of 2 levels method");
                ok(o2.fn.guid, "Method must have a GUID");
                equal(o2.fn.guid, fn2.guid, "GUID of added and source methods must be equals");
                notEqual(o2.fn.guid, o1.fn.guid, "GUID of overload and inherited methods must not be equals");
                notEqual(o2.fn, fn2, "2 levels method must be altered");
                ok(JSC.isOverloaded(o2.fn), "Method must be tagged as overriding");
                ok(reOverload.test(o2.fn), "2 levels method must call inherited");
                o2.fn("try");
                equal(value, "try12", "Call of 2 levels method");

                // check overload of existing overloaded method
                value = "";
                equal(value, "", "Value before call of 3 levels method");
                ok(o3.fn.guid, "Method must have a GUID");
                equal(o3.fn.guid, fn3.guid, "GUID of added and source methods must be equals");
                notEqual(o3.fn.guid, o1.fn.guid, "GUID of overload and second inherited methods must not be equals");
                notEqual(o3.fn.guid, o2.fn.guid, "GUID of overload and first inherited methods must not be equals");
                notEqual(o3.fn, fn3, "3 levels method must be altered");
                ok(JSC.isOverloaded(o3.fn), "Method must be tagged as overriding");
                ok(reOverload.test(o3.fn), "3 levels method must call inherited");
                o3.fn("hello");
                equal(value, "hello123", "Call of 3 levels method");

                // check replacement with no overload of existing method
                value = "";
                equal(value, "", "Value before call of 4 levels method");
                strictEqual(o4.fn, fn4, "4 levels method must not be altered");
                ok(!JSC.isOverloaded(o4.fn), "Method must not be tagged as overriding");
                ok(!reOverload.test(o4.fn), "4 levels method must not call inherited");
                o4.fn("final");
                equal(value, "final4", "Call of 4 levels method");

                // check overload a method that does not exists
                value = "";
                equal(value, "", "Value before call of 5 levels method");
                ok(o5.fn.guid, "Method must have a GUID");
                equal(o5.fn.guid, fn2.guid, "GUID of added and source methods must be equals");
                notEqual(o5.fn, fn, "2 levels method must be altered");
                ok(JSC.isOverloaded(o5.fn), "Method must be tagged as overriding");
                ok(reOverload.test(o5.fn), "5 levels method must call inherited");
                o5.fn("try");
                equal(value, "2", "Call of 5 levels method");

                // dummy overload function
                fn = getIt(function(){
                    this.inherited();
                });
                equal(JSC.overload(fn, fn), fn, "Overload of a method by itself must not produce an overriding method, even if inheritance is invoked !");
            },

            /**
             * Test of JSC.extend()
             */
            extend : function() {
                var A, B, a, b, value;

                // no exception can be throwed
                notThrow(function(){
                    // call without arguments
                    equal(JSC.extend(), undefined, "Call of extend with no parameters must return undefined");

                    // call with only a string value
                    equal(JSC.extend("Class"), "Class", "Call of extend with no class must return given value");

                    // build testbed
                    A = new Function();
                    A[proto].a = true;
                    A[proto].f = getIt(function(){
                        value = "A";
                    });
                    B = new Function();
                    B[proto] = new A();
                    B[proto].b = true;

                    // call with only a class
                    equal(JSC.extend(A), A, "Call of extend with only a class must return given class");

                    // call with a class to extend
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
                    ok(JSC.isOverloaded(B[proto].f), "Method must be tagged as overriding");

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

                }, "Call of JSC.extend() must not throw an exception");
            },

            /**
             * Test of JSC.implement()
             */
            implement : function() {
                var i, a, value, throwed, A = getIt(function(){});
                A.className = "A";

                // no exception can be throwed
                notThrow(function(){
                    // call without arguments
                    equal(JSC.implement(), undefined, "Call of implement with no parameters must return undefined");

                    // call with only a string value
                    equal(JSC.implement("Class"), "Class", "Call of implement with no class must return given value");
                }, "Call of JSC.implement() must not throw an exception");

                // call with only a class
                a = JSC.implement(A);
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");

                // call with a class and an interface name
                a = JSC.implement(A, "test");
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test, "Class must implement void interface 'test'");

                // call with a class and a void interface
                a = JSC.implement(A, []);
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");

                // call with a class and a void named interface
                a = JSC.implement(A, [], "test2");
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test2, "Class must implement void interface 'test2'");

                // call with a class and an anonymous interface with abstract member
                a = JSC.implement(A, ["fn1"]);
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(JSC.isFunction(A[proto].fn1), "Class must implement interface method 'fn1'");
                ok(JSC.isAbstract(A[proto].fn1), "Method 'fn1' must be abstract");

                // call with a class and a named interface with abstract member
                a = JSC.implement(A, ["fn2"], "test3");
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test3, "Class must implement void interface 'test3'");
                ok(JSC.isFunction(A[proto].fn2), "Class must implement interface method 'fn2'");
                ok(JSC.isAbstract(A[proto].fn2), "Method 'fn2' must be abstract");

                // call with a class and an anonymous void interface
                a = JSC.implement(A, {});
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");

                // call with a class and a void named interface
                a = JSC.implement(A, {}, "test4");
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test4, "Class must implement void interface 'test4'");

                // call with a class and a void named interface
                a = JSC.implement(A, {className: "test5"});
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test5, "Class must implement void interface 'test5'");

                // call with a class and a void named interface, name given twice
                a = JSC.implement(A, {className: "test7"}, "test6");
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test6, "Class must implement void interface 'test6'");
                ok(undefined === A.interfaces.test7, "Class must not implement interface 'test7'");

                // call with a class and an anonymous interface with concrete members
                a = JSC.implement(A, {
                    fn3 : undefined,
                    a1 : ""
                });
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(JSC.isFunction(A[proto].fn3), "Class must implement interface method 'fn3'");
                ok(JSC.isString(A[proto].a1), "Class must implement interface attribute 'a1'");
                ok(JSC.isAbstract(A[proto].fn3), "Method 'fn3' must be abstract");

                // call with a class and a named interface with concrete members
                a = JSC.implement(A, {
                    fn4 : function() {
                        value = "fn4";
                    },
                    a2 : 10
                }, "test7");
                equal(a, A, "Returned class must be equal to original one");
                equal(A.className, "A", "ClassName must not be altered");
                ok(A.interfaces.test7, "Class must implement void interface 'test7'");
                ok(JSC.isFunction(A[proto].fn4), "Class must implement interface method 'fn4'");
                ok(JSC.isNumeric(A[proto].a2), "Class must implement interface attribute 'a2'");
                ok(!JSC.isAbstract(A[proto].fn4), "Method 'fn4' must not be abstract");

                // call with a class and a named interface with concrete members
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
                ok(JSC.isFunction(A[proto].fn5), "Class must implement interface method 'fn5'");
                ok(JSC.isBool(A[proto].a3), "Class must implement interface attribute 'a3'");
                ok(!JSC.isAbstract(A[proto].fn5), "Method 'fn5' must not be abstract");

                // call with a class and a twice named interface with concrete members
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
                ok(JSC.isFunction(A[proto].fn6), "Class must implement interface method 'fn6'");
                ok(JSC.isObject(A[proto].a4), "Class must implement interface attribute 'a4'");
                ok(!JSC.isAbstract(A[proto].fn6), "Method 'fn6' must not be abstract");

                // check for beahavior on instances
                a = new A();
                a.className = "A";
                for(i = 1; i < 7; i++) {
                    ok(JSC.isFunction(a["fn" + i]), "Instance must have method fn" + i);
                }
                for(i = 1; i < 5; i++) {
                    ok(undefined != a["a" + i], "Instance must have member a" + i);
                }

                // check for abstract interface methods
                for(i = 1; i < 4; i++) {
                    throwed = false;
                    try {
                        ok(JSC.isAbstract(a["fn" + i]), "Method fn" + i + " must be tagged as abstract");
                        a["fn" + i]();
                    } catch(e) {
                        throwed = true;
                        if( e instanceof JSC.Error ) {
                            equal(e.context, "A.fn" + i, "Error thrown must set right context for unnamed abstract method");
                        } else {
                            ok(false, "Throwed error is not an instance of JSC.Error !");
                        }
                    }
                    ok(throwed, "Calling of abstract method fn" + i + " must throw an exception");
                }

                // check for concrete interface methods
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
             * Test of JSC.method()
             */
            method : function() {
                var methodResult, A, B, b;

                // build the test bed
                A = new Function();
                A[proto].value = "A";
                A[proto].method = getIt(function(value){
                    this.value = value || "";
                    return JSC.id(this);
                });

                B = new Function();
                B[proto].value = "B";
                b = new B();

                // call with only class
                notThrow(function(){
                    methodResult = JSC.method(A);
                    equal(methodResult, undefined, "JSC.method(Class) : An undefined result must be returned");
                }, "JSC must not throw any exception when calling 'method' without arguments");

                // call with unknown class
                mustThrow(JSC.method, "JSC must throw an exception when calling 'method' without arguments");
                mustThrow(JSC.method, "JSC must throw an exception when calling 'method' with an unknown class name", ["unknownClass"]);
                mustThrow(JSC.method, "JSC must throw an exception when calling 'method' with an unknown class name and a method name", ["unknownClass", "method"]);
                mustThrow(JSC.method, "JSC must throw an exception when calling 'method' with an unknown class name and complete params list", ["unknownClass", "method", {}]);

                // call with just a class and method name
                methodResult = JSC.method(A, "method");
                equal(methodResult, JSC.id(A), "JSC.method() : The class GUID must be returned when no context was given");
                equal(A.value, "", "JSC.method() : The called method must operate on the class when no context was given");
                delete A.value;

                // call with just a global class and method name
                JSC.globalize("A", A);
                notThrow(function(){
                    strictEqual(A.value, undefined, "Class context must be cleared");
                    methodResult = JSC.method("A", "method");
                    equal(methodResult, JSC.id(A), "JSC.method() : The class GUID must be returned when no context was given");
                    equal(A.value, "", "JSC.method() : The called method must operate on the class when no context was given");
                }, "JSC must not throw any exception when calling 'method' with known global class");
                JSC.globalize("A");

                // call with complete params list
                strictEqual(b.value, "B", "Check initial context");
                methodResult = JSC.method(A, "method", b);
                equal(methodResult, JSC.id(b), "JSC.method() : The context GUID must be returned ");
                equal(b.value, "", "JSC.method() : The called method must operate on the given context");

                // call with complete params list and extra param
                methodResult = JSC.method(A, "method", b, "test");
                equal(methodResult, JSC.id(b), "JSC.method() : The context GUID must be returned ");
                equal(b.value, "test", "JSC.method() : The called method must operate on the given context");

                // call with no context but other params
                methodResult = JSC.method(A, "method", null, "extra");
                equal(methodResult, JSC.id(A), "JSC.method() : The class GUID must be returned when no context was given");
                equal(A.value, "extra", "JSC.method() : The called method must operate on the class when no context was given");
                delete A.value;
            },

            /**
             * Test of JSC.instanceOf()
             */
            instanceOf : function() {
                // build test bed
                var value = "", Interface1, Interface2 = getIt({className : "Interface2"}),
                    A = JSC("A").implement("Interface1").implement(Interface2).implement([], "Interface3"),
                    B = JSC("B"),
                    C = JSC({
                        superClass : A,
                        className : "C"
                    }).implement("Interface4"),
                    a = new A(), b = new B(), c = new C();
                JSC.globalize(A);
                JSC.globalize(B);
                JSC.globalize(C);

                // no exception can be throwed
                notThrow(function(){
                    // call without arguments
                    equal(JSC.instanceOf(), false, "Instance of nothing");

                    // call with only one argument
                    equal(JSC.instanceOf(A), false, "Nothing instance of class");
                }, "Call of JSC.instanceOf() must not throw an exception");

                // checks for instance
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
                var name = "myClass", myClass1 = getIt(function(){this.value=1;}), myClass2 = getIt(function(){this.value=2;}), Class;

                // check with a given fake class
                Class = JSC.getClass(myClass1);
                notEqual(Class, undefined, "The returned class must be defined");
                ok(JSC.isFunction(Class), "The returned class must be a real class");
                equal(Class, myClass1, "The returned class must comply to needed one");
                notEqual(Class, myClass2, "The returned class must not comply to other class");

                // check with another fake class
                Class = JSC.getClass(myClass2);
                notEqual(Class, undefined, "The returned class must be defined");
                ok(JSC.isFunction(Class), "The returned class must be a real class");
                equal(Class, myClass2, "The returned class must comply to needed one");
                notEqual(Class, myClass1, "The returned class must not comply to other class");

                // call without arguments
                equal(JSC.getClass(), undefined, "Ask for a class with no parameter must return undefined");

                // call with an unknown class
                equal(JSC.getClass(name), undefined, "Unknown class must reeturn undefined");

                // check with known global class
                JSC.globalize(name, myClass1);
                Class = JSC.getClass(name);
                notEqual(Class, undefined, "When the needed class is known the function must return it");
                equal(Class, myClass1, "The returned class must comply to needed one");
                notEqual(Class, myClass2, "The returned class must not comply to other class");

                // check with global no class variable
                JSC.globalize(name, name);
                Class = JSC.getClass(name);
                equal(Class, undefined, "Ask for class that is not one must return undefined");
                ok(!JSC.isFunction(Class), "Not class must not be considered as a class");

                // check on no classes
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
                var name = "myClass", myClass1 = getIt(function(){this.value=1;}), myClass2 = getIt(function(){this.value=2;}), Class;

                // check a known local class
                Class = JSC.loadClass(myClass1);
                notEqual(Class, undefined, "The returned class must be defined");
                ok(JSC.isFunction(Class), "The returned class must be a real class");
                equal(Class, myClass1, "The returned class must comply to needed one");
                notEqual(Class, myClass2, "The returned class must not comply to other class");

                // check another known local class
                Class = JSC.loadClass(myClass2);
                notEqual(Class, undefined, "The returned class must be defined");
                ok(JSC.isFunction(Class), "The returned class must be a real class");
                equal(Class, myClass2, "The returned class must comply to needed one");
                notEqual(Class, myClass1, "The returned class must not comply to other class");

                // check with unknown class
                raises(function(){
                    JSC.loadClass();
                }, "Ask for a class with no parameter must thow an error");
                raises(function(){
                    JSC.loadClass(name);
                }, "Unknown class must thow an error");

                // check with a global known class
                JSC.globalize(name, myClass1);
                Class = JSC.loadClass(name);
                notEqual(Class, undefined, "When the needed class is known the function must return it");
                equal(Class, myClass1, "The returned class must comply to needed one");
                notEqual(Class, myClass2, "The returned class must not comply to other class");

                // check with a global no class variable
                JSC.globalize(name, name);
                raises(function(){
                    Class = JSC.loadClass(name);
                }, "Ask for class that is not one must thow an error");

                // check on no classes
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
             * Test of JSC.singleton()
             */
            singleton : function() {
                // apply singleton class tests with JSC.singleton class builder
                var generator = getIt(function(){
                    return JSC.singleton.apply(JSC, arguments);
                });
                testClassSingletonSimpliest(generator, "JSC.singleton()");
                testClassSingleton(generator);
            },

            /**
            * Test of JSC.multiton()
            */
            multiton: function() {
                // apply multiton class tests with JSC.multiton class builder
                var generator = getIt(function(){
                    return JSC.multiton.apply(JSC, arguments);
                });
                testClassSingletonSimpliest(generator, "JSC.singleton()");
                testClassMultiton(generator, "JSC.multiton()");
            },

            /**
            * Test of JSC.make()
            */
            make : function() {
                var aClass;

                // check for global context
                ok(undefined === JSC.global(defaultClassName), "Class with default name must not exists as global yet !");
                ok(undefined === JSC.global("standardClassA"), "Class 'standardClassA' must not exists as global yet !");
                ok(undefined === JSC.global("standardClassB"), "Class 'standardClassB' must not exists as global yet !");
                ok(undefined === JSC.global("standardClassC"), "Class 'standardClassC' must not exists as global yet !");
                ok(undefined === JSC.global("singletonClassA"), "Class 'singletonClassA' must not exists as global yet !");
                ok(undefined === JSC.global("singletonClassB"), "Class 'singletonClassB' must not exists as global yet !");
                ok(undefined === JSC.global("singletonClassC"), "Class 'singletonClassC' must not exists as global yet !");
                ok(undefined === JSC.global("multitonClassA"), "Class 'multitonClassA' must not exists as global yet !");
                ok(undefined === JSC.global("multitonClassB"), "Class 'multitonClassB' must not exists as global yet !");
                ok(undefined === JSC.global("multitonClassC"), "Class 'multitonClassC' must not exists as global yet !");

                // building class without definition
                notThrow(function(){
                    // with no definition
                    aClass = JSC.make();
                    testClassCommon(aClass, defaultClassName);

                    // with simple definition
                    aClass = JSC.make({value: null});
                    testClassCommon(aClass, defaultClassName);

                    // with more complete definition
                    aClass = JSC.make("", true, {value: 10}, 0, {version: 1});
                    testClassCommon(aClass, defaultClassName);
                    ok("undefined" === typeof aClass.value, "Class must not have static member affected from given definition");
                    ok("undefined" !== typeof aClass.version, "Class must have static member affected from given definition");
                }, "JSC.make() must not throw any exception when building a class without definition");

                // trying to create a class with a super class that does not exist
                mustThrow(function(){
                    JSC.make({
                        superClass : "undefinedClass"
                    })
                }, "JSC.make() must throw an error when trying to create a class with an unkwnown super class");

                // test JSC.make() in standard class context
                testClassStandard(function(){
                    var args = [].concat(Array[proto].slice.call(arguments));
                    return JSC.make.apply(JSC, args);
                });

                // test JSC.make() in singleton class context
                testClassSingleton(function(){
                    var args = ["singleton"].concat(Array[proto].slice.call(arguments));
                    return JSC.make.apply(JSC, args);
                });

                // test JSC.make() in multiton class context
                testClassMultiton(function(){
                    var args = ["multiton"].concat(Array[proto].slice.call(arguments));
                    return JSC.make.apply(JSC, args);
                });

                // check for global context
                ok(JSC.isClass(JSC.global(defaultClassName)), "Class with default name must exists as global now !");
                ok(JSC.isClass(JSC.global("standardClassA")), "Class 'standardClassA' must exists as global now !");
                ok(JSC.isClass(JSC.global("standardClassC")), "Class 'standardClassC' must exists as global now !");
                ok(JSC.isClass(JSC.global("singletonClassA")), "Class 'singletonClassA' must exists as global now !");
                ok(JSC.isClass(JSC.global("singletonClassC")), "Class 'singletonClassC' must exists as global now !");
                ok(JSC.isClass(JSC.global("multitonClassA")), "Class 'multitonClassA' must exists as global now !");
                ok(JSC.isClass(JSC.global("multitonClassC")), "Class 'multitonClassC' must exists as global now !");

                // clear global context
                JSC.globalize(defaultClassName);
                JSC.globalize("standardClassA");
                JSC.globalize("standardClassC");
                JSC.globalize("singletonClassA");
                JSC.globalize("singletonClassC");
                JSC.globalize("multitonClassA");
                JSC.globalize("multitonClassC");
            },

            /**
             * Test of JSC.basis()
             */
            basis : function() {
                // create a mok class
                var result, className = "aClass", aClass = getIt(function() {
                    return aClass.body ? aClass.body.apply(aClass, arguments) : undefined;
                });
                aClass.interfaces = {};

                // apply JSC class basis on the mok class
                result = JSC.basis(aClass, className);
                strictEqual(result, aClass, "The returned class must be equal to the given one");

                // the mok class with applied JSC class basis must operate as a common JSC generated class
                testClassCommon(aClass, className);
            },

            /**
             * Test of JSC.isInstalled()
             */
            isInstalled : function() {
                // only check wrong trivial situations, others are checked in 'JSC.install' test
                ok(JSC.isInstalled(), "Check if nothing is installed => true");
                ok(JSC.isInstalled(undefined), "Check if undefined is installed => true");
                ok(JSC.isInstalled({}), "Check if void plugin is installed => true");
                ok(!JSC.isInstalled({pluginName: "check"}), "Check if void named plugin is installed => false");
                ok(!JSC.isInstalled({guid: 99999999}), "Check if void identified plugin is installed => false");
                ok(JSC.isInstalled(""), "Check if plugin is installed with a void name => true");
                ok(!JSC.isInstalled("name"), "Check if plugin is installed with a name => false");
                ok(JSC.isInstalled(0), "Check if plugin is installed with the GUID of JSC => true");
                ok(JSC.isInstalled(JSC), "Check if JSC is installed => true");
                ok(!JSC.isInstalled(9999999), "Check if plugin is installed with an unknown GUID => false");
            },

            /**
             * Test of JSC.install()
             */
            install : function() {
                notThrow(function(){
                    var result;

                    // check wrong trivial situations
                    ok(!JSC.install(), "Try to install nothing => false");
                    ok(!JSC.install(undefined), "Try to install a plugin with wrong params => false");
                    ok(!JSC.install("myplugin"), "Try to install a plugin with only a name => false");
                    ok(!JSC.install(""), "Try to install a wrong named plugin with wrong params => false");
                    ok(!JSC.install({}), "Try to install a void plugin => false");
                    ok(!JSC.install(10), "Try to install a plugin by a GUID => false");
                    ok(!JSC.install(JSC), "Try to install JSC as plugin => false");
                    ok(!JSC.install(function(){}), "Try to install a function as plugin => false");

                    // check installation of a void named plugin
                    ok(JSC.install({pluginName: "myPlugin"}), "Try to install a plugin with a definitions list that only contains the name => true");
                    ok(JSC.isInstalled("myPlugin"), "myPlugin must be installed");
                    ok(JSC.uninstall("myPlugin"), "Uninstall a plugin by its name");
                    ok(!JSC.isInstalled("myPlugin"), "myPlugin must be uninstalled");

                    // anonymous plugin, just add new methods
                    var pluginAnonymousAdd = getIt({
                        pluginStuff1 : function() {
                            return Array[proto].slice.apply(arguments);
                        },
                        pluginStuff2 : function(a, b) {
                            return a + b;
                        }
                    });
                    ok(undefined === JSC.pluginStuff1, "Entry 'pluginStuff1' must not exist before plugin installation");
                    ok(undefined === JSC.pluginStuff2, "Entry 'pluginStuff2' must not exist before plugin installation");
                    result = JSC.install(pluginAnonymousAdd);
                    ok(!result, "Plugin must not be successfully installed");
                    ok(!JSC.isInstalled(pluginAnonymousAdd), "Plugin must not be installed");
                    ok(undefined === JSC.pluginStuff1, "Entry 'pluginStuff1' must not exist after plugin installation fail");
                    ok(undefined === JSC.pluginStuff2, "Entry 'pluginStuff2' must not exist after plugin installation fail");

                    // named plugin, new entry
                    var pluginStuffAdd = getIt({
                        pluginName : "pluginStuff",
                        entry1 : function(a) {
                            return a * a;
                        },
                        entry2 : function(a, b) {
                            return a * b;
                        }
                    });
                    ok(undefined === JSC.entry1, "Entry 'entry1' must not exist before plugin installation");
                    ok(undefined === JSC.entry2, "Entry 'entry2' must not exist before plugin installation");
                    result = JSC.install(pluginStuffAdd);
                    ok(result, "Plugin must be successfully installed");
                    ok(JSC.isInstalled(pluginStuffAdd.pluginName), "Check if plugin is installed, use its name");
                    ok(JSC.isInstalled(JSC.id(pluginStuffAdd)), "Check if plugin is installed, use its GUID");
                    ok(JSC.isInstalled(pluginStuffAdd), "Check if plugin is installed, use itself");
                    equal(result, JSC.id(pluginStuffAdd), "Result must be the plugin's GUID");
                    ok(JSC.isPlugin(JSC.entry1), "Entry 'entry1' must be added by plugin installation");
                    ok(JSC.isPlugin(JSC.entry2), "Entry 'entry2' must be added by plugin installation");
                    ok(!JSC.isOverloaded(JSC.entry1), "Entry 'entry1' must not be overloaded by plugin installation");
                    ok(!JSC.isOverloaded(JSC.entry2), "Entry 'entry2' must not be overloaded by plugin installation");
                    equal(JSC.entry1(3), 9, "Use check for plugin entry 'pluginStuff.entry1");
                    equal(JSC.entry2(3, 4), 12, "Use check for plugin entry 'pluginStuff.entry2");

                    // named plugin, update entry
                    var pluginStuffUpdate = getIt({
                        pluginName: "pluginStuff2",
                        entry1 : function(a) {
                            return this.inherited(a) * a;
                        },
                        entry2 : function(a, b) {
                            return a / b;
                        }
                    });
                    result = JSC.install(pluginStuffUpdate);
                    ok(result, "Plugin must be successfully installed");
                    ok(JSC.isInstalled(pluginStuffUpdate.pluginName), "Check if plugin is installed, use its name");
                    ok(JSC.isInstalled(JSC.id(pluginStuffUpdate)), "Check if plugin is installed, use its GUID");
                    ok(JSC.isInstalled(pluginStuffUpdate), "Check if plugin is installed, use itself");
                    equal(result, JSC.id(pluginStuffUpdate), "Result must be the plugin's GUID");
                    ok(JSC.isPlugin(JSC.entry1), "Entry 'entry1' must be added by plugin installation");
                    ok(JSC.isPlugin(JSC.entry2), "Entry 'entry2' must be added by plugin installation");
                    ok(JSC.isOverloaded(JSC.entry1), "Entry 'entry1' must be overloaded by plugin installation");
                    ok(!JSC.isOverloaded(JSC.entry2), "Entry 'entry2' must not be overloaded by plugin installation");
                    equal(JSC.entry1(3), 27, "Use check for plugin entry 'pluginStuff.entry1");
                    equal(JSC.entry2(6, 2), 3, "Use check for plugin entry 'pluginStuff.entry2");

                    // remove added plugins
                    JSC.uninstall(pluginStuffUpdate.pluginName);
                    ok(!JSC.isInstalled(pluginStuffUpdate), "Plugin must be uninstalled");
                    ok(JSC.isInstalled(pluginStuffAdd), "Overloaded plugin must still be installed");
                    ok(JSC.isPlugin(JSC.entry1), "Entry 'entry1' must still exist");
                    ok(JSC.isPlugin(JSC.entry2), "Entry 'entry2' must still exist");

                    JSC.uninstall(JSC.id(pluginStuffAdd));
                    ok(!JSC.isInstalled("pluginStuff"), "Plugin must be uninstalled");
                    ok(undefined === JSC.entry1, "Entry 'entry1' must not exist after plugin uninstallation");
                    ok(undefined === JSC.entry2, "Entry 'entry2' must not exist after plugin uninstallation");
                }, "No exception must be thrown when use of JSC plugin implementation !");
            },

            /**
             * Test of JSC.uninstall()
             */
            uninstall : function() {
                // only check wrong trivial situations, others are checked in 'JSC.install' test
                ok(!JSC.uninstall(), "Try to uninstall no plugin => false");
                ok(!JSC.uninstall(undefined), "Try to uninstall an undefined plugin => false");
                ok(!JSC.uninstall({}), "Try to uninstall a void plugin => false");
                ok(!JSC.uninstall({pluginName: "check"}), "Try to uninstall an unknown named plugin => false");
                ok(!JSC.uninstall({guid: 99999999}), "Try to uninstall an unknown identified plugin => false");
                ok(!JSC.uninstall(""), "Try to uninstall a plugin with a void name => false");
                ok(!JSC.uninstall("name"), "Try to uninstall a plugin with an unknown name => false");
                ok(!JSC.uninstall(0), "Try to uninstall a plugin with the GUID of JSC => false");
                ok(!JSC.uninstall(JSC), "Try to uninstall JSC as plugin => false");
                ok(!JSC.uninstall(9999999), "Try to uninstall a plugin with an unknown GUID => false");
            },

            /**
            * Test of JSC.Error()
            */
            Error : function() {
                var instance, msg = "Error Check", ctx = "Error Ctx";

                // identity check for JSC Error class
                ok("function" === typeof JSC.Error, "JSC.Error must be a function");
                ok(JSC.isClass(JSC.Error), "JSC.Error must be a class")
                strictEqual(JSC.Error.className, "JSC.Error", "Class name of JSC.Error must be defined");
                strictEqual(JSC.Error.guid, 1, "GUID of JSC.Error must be defined and comply to the needed one");

                // Check instantiation of JSC.Error
                notThrow(function(){
                    // base instantiation check
                    instance = new JSC.Error();
                    ok(instance instanceof JSC.Error, "Instance of JSC.Error check");
                    ok(instance instanceof Error, "Instance of JSC.Error must be also an instance of Error");
                    ok(undefined !== instance.message, "Message attribute must be set, even if no ones has been given !");
                    ok(undefined === instance.context, "No context given !");

                    // check instantiation with only message
                    instance = new JSC.Error(msg);
                    equal(instance.message, msg, "Message attribute must be equal to given one !");
                    ok(undefined === instance.context, "No context given !");

                    // check instantiation with both message and context
                    instance = new JSC.Error(msg, ctx);
                    equal(instance.message, msg, "Message attribute must be equal to given one !");
                    equal(instance.context, ctx, "Context attribute must be equal to given one !");

                    // check instantiation with only context
                    instance = new JSC.Error(undefined, ctx);
                    ok(undefined !== instance.message, "Message attribute must be set, even if no ones has been given !");
                    equal(instance.context, ctx, "Context attribute must be equal to given one !");
                }, "No exception must be thrown when instantiate JSC.Error");
            }
        };

    /**
     * Get an UTC date
     *
     * @param {Number} year
     * @param {Number} month
     * @param {Number} day
     * @param {Number} hours
     * @param {Number} minutes
     * @param {Number} seconds
     * @param {Number} milliseconds
     * @return {Date}
     */
    function dateUTC(year, month, day, hours, minutes, seconds, milliseconds) {
        var date = new Date();
        date.setUTCFullYear(year || 2012, (month || 1) - 1, day || 1);
        date.setUTCHours(hours || 0, minutes || 0, seconds || 0, milliseconds || 0);
        return date;
    }

    /**
     * Just get the value
     *
     * @param {Object} value The value to get
     * @return {Object} Return the given value
     */
    function getIt(value) {
        return value;
    }

    /**
     * Call a function which must not throw any exception and returns its result
     *
     * @param {Function} fn Function to call with exception handling
     * @param {String} [msg] Message to display for the test
     * @param {Array} [args] Optional arguments for the called function
     * @return {Object} Return the result of the called function
     */
    function notThrow(fn, msg, args) {
        var result, throwed = false;
        try {result = fn.apply(this, args || []);}
        catch(e) {throwed = true;}
        ok(!throwed, msg || "No exception must be thrown");
        return result;
    }

    /**
     * Call a function which must throw an exception
     *
     * @param {Function} fn Function to call with exception handling
     * @param {String} [msg] Message to display for the test
     * @param {Array} [args] Optional arguments for the called function
     */
    function mustThrow(fn, msg, args) {
        var throwed = false;
        try {fn.apply(this, args || []);}
        catch(e) {throwed = true;}
        ok(throwed, msg || "An exception must be thrown");
    }

    /**
     * Common class tests, called for each class test : test of return from a class method
     *
     * @param {Function} theClass The class to test
     * @param {Function} returnedClass The result of tested method
     * @param {String} className The name of the tested class
     * @param {String} [contextClassName] The name of the tested class
     */
    function testClassReturn(theClass, returnedClass, className, contextClassName) {
        var ctxMsg = (contextClassName || className) + "[return] : ";
        strictEqual(returnedClass, theClass, ctxMsg + "The returned class must be the same than the referrer");
    }

    /**
     * Common class tests, called for each class test : test of class integrity
     *
     * @param {Function} theClass The class to test
     * @param {Function} returnedClass The result of tested method
     * @param {String} className The name of the tested class
     * @param {String} [contextClassName] The name of the tested class
     */
    function testClassIntegrity(theClass, returnedClass, className, contextClassName) {
        var ctxMsg = (contextClassName || className) + "[integrity] : ";
        testClassReturn(theClass, returnedClass, className, contextClassName);
        equal(theClass.className, className, ctxMsg + "The name of the class as static member must be ok");
        equal(theClass[proto].className, className, ctxMsg + "The name of the class as prototype member must be ok");
    }

    /**
     * Common class tests, called for each class test : test of class method "rename()"
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassRename(theClass, className) {
        var returnedClass, otherName = "__another_class_name__", ctxMsg = className + "[rename] : ";

        // with another name
        returnedClass = theClass.rename(otherName);
        testClassIntegrity(theClass, returnedClass, otherName, className);

        // with void name
        returnedClass = theClass.rename("");
        testClassIntegrity(theClass, returnedClass, defaultClassName, className);

        // restore original name
        theClass.rename(className);

        // with no name
        returnedClass = theClass.rename();
        testClassIntegrity(theClass, returnedClass, defaultClassName, className);

        // restore original name
        theClass.rename(className);
    }

    /**
     * Common class tests, called for each class test : test of class method "self()"
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassSelf(theClass, className) {
        var returnedClass, bodyResult, bodyValue, oldGetInstance, oldBody, newBody = getIt(function(){
            bodyValue = this.className + ".body";
            return bodyValue;
        }), ctxMsg = className + "[self] : ";

        // keep old values, then remove them from the class
        oldGetInstance = theClass.getInstance;
        oldBody = theClass.body;
        delete theClass.body;
        delete theClass.getInstance;

        // with a given body
        returnedClass = theClass.self(newBody);
        testClassIntegrity(theClass, returnedClass, className);
        strictEqual(theClass.body, newBody, ctxMsg + "The body must be the same than the one given");
        bodyResult = theClass();
        equal(bodyValue, className + ".body", ctxMsg + "The altered value must be the same than required");
        equal(bodyResult, className + ".body", ctxMsg + "The result of the class call must be the same than required");

        // with no body and no getInstance
        returnedClass = theClass.self();
        testClassIntegrity(theClass, returnedClass, className);
        ok(JSC.isFunction(theClass.body),ctxMsg + "A default body must be present after no one was assigned and no getInstance method is present");

        // with no body but getInstance
        theClass.getInstance = newBody;
        returnedClass = theClass.self();
        testClassIntegrity(theClass, returnedClass, className);
        strictEqual(theClass.body, theClass.getInstance, ctxMsg + "The body must be the same than the getInstance method when no was assigned");
        bodyResult = theClass();
        equal(bodyValue, className + ".body", ctxMsg + "The altered value must be the same than required");
        equal(bodyResult, className + ".body", ctxMsg + "The result of the class call must be the same than required");

        // restore old values
        theClass.body = oldBody;
        theClass.getInstance = oldGetInstance;
    }

    /**
     * Common class tests, called for each class test : test of class method "statics()"
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassStatics(theClass, className) {
        var returnedClass, staticResult, staticValue = "__static__", ctxMsg = className + "[statics] : ";

        // call without arguments
        notThrow(function(){
            returnedClass = theClass.statics();
            testClassIntegrity(theClass, returnedClass, className);
        }, ctxMsg + "JSC must not throw any exception when calling 'statics' without arguments");

        // call with a definition list
        returnedClass = theClass.statics({
            aStaticMethod : function(){
                return this.className + " : " + this.aStaticValue;
            },
            aStaticValue : staticValue
        });
        testClassIntegrity(theClass, returnedClass, className);
        ok("function" === typeof theClass.aStaticMethod, ctxMsg + "Static method 'aStaticMethod' must be assigned to the class");
        ok("string" === typeof theClass.aStaticValue, ctxMsg + "Static value 'aStaticValue' must be assigned to the class");
        equal(theClass.aStaticValue, staticValue, ctxMsg + "check the value of the added static value");
        staticResult = theClass.aStaticMethod();
        equal(staticResult, className + " : " + staticValue, ctxMsg + "Test result of the added static method");

        // clean the class from added static member
        delete theClass.aStaticMethod;
        delete theClass.aStaticValue;
    }

    /**
     * Common class tests, called for each class test : test of class method "method()"
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassMethod(theClass, className) {
        var methodResult, methodValue, context = {}, ctxMsg = className + "[method] : ";

        // build the test bed
        context.className = "context";
        theClass[proto].aMethod = getIt(function(param) {
            methodValue = JSC.id(this) + "." + this.className + (param || "");
            return JSC.id(this);
        });

        // call without arguments
        notThrow(function(){
            methodResult = theClass.method();
            equal(methodResult, undefined, ctxMsg + "An undefined result must be returned");
            equal(methodValue, undefined, ctxMsg + "The witness variable must not be altered");
            testClassIntegrity(theClass, theClass, className);
        }, ctxMsg + "JSC must not throw any exception when calling 'method' without arguments");

        // call with wrong arguments
        notThrow(function(){
            (function(list){
                for(var i = 0; i < list.length; i++) {
                    methodResult = theClass.method(list[i]);
                    equal(methodResult, undefined, ctxMsg + "An undefined result must be returned");
                    equal(methodValue, undefined, ctxMsg + "The witness variable must not be altered");
                    testClassIntegrity(theClass, theClass, className);

                    methodResult = theClass.method(list[i], list[i]);
                    equal(methodResult, undefined, ctxMsg + "An undefined result must be returned");
                    equal(methodValue, undefined, ctxMsg + "The witness variable must not be altered");
                    testClassIntegrity(theClass, theClass, className);
                }
            })(["", "nothing", null, 10, true, false, undefined]);
        }, ctxMsg + "JSC must not throw any exception when calling 'method' with wrong arguments");


        // just the name of the method
        methodResult = theClass.method("aMethod");
        equal(methodResult, JSC.id(theClass), ctxMsg + "The class GUID must be returned when no context was given but the name of the method");
        equal(methodValue, JSC.id(theClass) + "." + className, ctxMsg + "The attempted value must be composed when no context was given but the name of the method");
        testClassIntegrity(theClass, theClass, className);

        // the name of the method and an extra param, but no context
        methodResult = theClass.method("aMethod", null, "test");
        equal(methodResult, JSC.id(theClass), ctxMsg + "The class GUID must be returned when no context was given but the name of the method and an extra parameter");
        equal(methodValue, JSC.id(theClass) + "." + className + "test", ctxMsg + "The attempted value must be composed when no context was given but the name of the method and an extra parameter");
        testClassIntegrity(theClass, theClass, className);

        // the name of the method and the context
        methodResult = theClass.method("aMethod", context);
        equal(methodResult, JSC.id(context), ctxMsg + "The class GUID must be returned when name of method and context were given");
        equal(methodValue, JSC.id(context) + "." + context.className, ctxMsg + "The attempted value must be composed when method and context were given");
        testClassIntegrity(theClass, theClass, className);

        // the name of the method, the context and an extra param
        methodResult = theClass.method("aMethod", context, "test");
        equal(methodResult, JSC.id(context), ctxMsg + "The class GUID must be returned when name of method and context were given, and an extra parameter");
        equal(methodValue, JSC.id(context) + "." + context.className + "test", ctxMsg + "The attempted value must be composed when method and context were given, and an extra parameter");
        testClassIntegrity(theClass, theClass, className);
    }

    /**
     * Common class tests, called for each class test : test of class method "implement()"
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassImplement(theClass, className) {
        // keep a copy of original interfaces and prototype, and force new ones
        var i, returnedClass, intrface, interfaceName, methodName, oldInterfaces = theClass.interfaces, oldPrototype = theClass[proto], ctxMsg = className + "[implement] : ";
        theClass.interfaces = {};
        theClass[proto] = {};
        for(i in oldPrototype) {
            theClass[proto][i] = oldPrototype[i];
        }

        // call without arguments
        notThrow(function(){
            returnedClass = theClass.implement();
            testClassIntegrity(theClass, returnedClass, className);
        }, ctxMsg + "JSC must not throw any exception when calling 'implement' without arguments");

        // call with only the name of an interface
        interfaceName = "test";
        returnedClass = theClass.implement(interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");

        // call with a void anonymous interface, under "names" mode
        returnedClass = theClass.implement([]);
        testClassIntegrity(theClass, returnedClass, className);

        // call with a void named interface, under "names" mode
        interfaceName = "test2";
        returnedClass = theClass.implement([], interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement void interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");

        // call with an anonymous interface, under "names" mode
        methodName = "fn_" + interfaceName;
        returnedClass = theClass.implement([methodName]);
        testClassIntegrity(theClass, returnedClass, className);
        ok(JSC.isFunction(theClass[proto][methodName]), ctxMsg + "Class must implement interface method '" + methodName + "'");
        ok(JSC.isAbstract(theClass[proto][methodName]), ctxMsg + "Method '" + methodName + "' must be abstract");
        mustThrow(theClass[proto][methodName], ctxMsg + "Method '" + methodName + "' cannot be called");

        // call with a named interface, under "names" mode
        interfaceName = "test3";
        methodName = "fn_" + interfaceName;
        returnedClass = theClass.implement([methodName], interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement named interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");
        ok(JSC.isFunction(theClass[proto][methodName]), ctxMsg + "Class must implement interface method '" + methodName + "'");
        ok(JSC.isAbstract(theClass[proto][methodName]), ctxMsg + "Method '" + methodName + "' must be abstract");
        mustThrow(theClass[proto][methodName], ctxMsg + "Method '" + methodName + "' cannot be called");

        // call with a void anonymous interface, under "definition" mode
        returnedClass = theClass.implement({});
        testClassIntegrity(theClass, returnedClass, className);

        // call with a void named interface, under "definition" mode
        interfaceName = "test4";
        returnedClass = theClass.implement({}, interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement void interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");

        // call with a void named interface where name is given in definition, under "definition" mode
        interfaceName = "test5";
        returnedClass = theClass.implement({className: interfaceName});
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement void interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");

        // call with a void named interface where name is given in definition and parameters, under "definition" mode
        interfaceName = "test6";
        returnedClass = theClass.implement({className: "test7"}, interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement void interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");
        interfaceName = "test7";
        ok(!theClass.interfaces[interfaceName], ctxMsg + "Class must not implement unknown interface '" + interfaceName + "'");
        ok(!JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must not be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");

        // call with a named interface and abstract method, under "definition" mode
        interfaceName = "test8";
        methodName = "fn_" + interfaceName;
        intrface = {};
        intrface[methodName] = undefined;
        returnedClass = theClass.implement(intrface, interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement named interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");
        ok(JSC.isFunction(theClass[proto][methodName]), ctxMsg + "Class must implement interface method '" + methodName + "'");
        ok(JSC.isAbstract(theClass[proto][methodName]), ctxMsg + "Method '" + methodName + "' must be abstract");
        mustThrow(theClass[proto][methodName], ctxMsg + "Method '" + methodName + "' cannot be called");

        // call with a named interface and defined method and attribute, under "definition" mode
        interfaceName = "test9";
        methodName = "fn_" + interfaceName;
        intrface = {};
        intrface.interfaceValue = interfaceName;
        intrface[methodName] = getIt(function() {
            return this.interfaceValue;
        });
        returnedClass = theClass.implement(intrface, interfaceName);
        testClassIntegrity(theClass, returnedClass, className);
        ok(theClass.interfaces[interfaceName], ctxMsg + "Class must implement named interface '" + interfaceName + "'");
        ok(JSC.instanceOf(theClass, interfaceName), ctxMsg + "The class must be checked as a instance of '" + interfaceName + "' by JSC.instanceOf()");
        ok(JSC.isFunction(theClass[proto][methodName]), ctxMsg + "Class must implement interface method '" + methodName + "'");
        ok(!JSC.isAbstract(theClass[proto][methodName]), ctxMsg + "Method '" + methodName + "' must not be abstract");
        notThrow(theClass[proto][methodName], ctxMsg + "Method '" + methodName + "' can be called");
        ok(undefined !== theClass[proto].interfaceValue, ctxMsg + "Class must implement interface member 'interfaceValue'");

        // restore original interfaces and prototype
        theClass.interfaces = oldInterfaces;
        theClass[proto] = oldPrototype;
    }

    /**
     * Common class tests, called for each class test : test of class method "extend()"
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassExtend(theClass, className) {
        // keep a copy of original interfaces and prototype, and force new ones
        var i, returnedClass, oldPrototype = theClass[proto], defs = getIt({
            fn0 : function(){},
            val0 : "0"
        }), ctxMsg = className + "[extend] : ";
        theClass[proto] = {};
        for(i in oldPrototype) {
            theClass[proto][i] = oldPrototype[i];
        }

        // call without arguments
        notThrow(function(){
            returnedClass = theClass.extend();
            testClassIntegrity(theClass, returnedClass, className);
        }, ctxMsg + "JSC must not throw any exception when calling 'extend' without arguments");

        // extend with some methods and attributes
        returnedClass = theClass.extend(defs);
        testClassIntegrity(theClass, returnedClass, className);
        strictEqual(theClass[proto].fn0, defs.fn0, ctxMsg + "The added method 'fn0' must be present after extend");
        strictEqual(theClass[proto].val0, defs.val0, ctxMsg + "The added attribute 'vla0' must be present after extend");
        ok(!JSC.isOverloaded(theClass[proto].fn0), ctxMsg + "The added method 'fn0' must not be tagged as overloaded");

        // extend with method present in all classes
        defs.attach = getIt(function() {});
        returnedClass = theClass.extend(defs);
        testClassIntegrity(theClass, returnedClass, className);
        ok(!JSC.isOverloaded(theClass[proto].attach), ctxMsg + "The overloader method 'attach' must not be tagged as overloaded since it do not call for inherited");
        ok(theClass[proto].attach === defs.attach, ctxMsg + "The overloader method 'attach' must be equal to given one since it do not call for inherited");
        ok(theClass[proto].attach !== oldPrototype.attach, ctxMsg + "The overloader method 'attach' must be different from overloaded one");

        // restore original version before next test
        theClass[proto].attach = oldPrototype.attach;
        defs.attach = getIt(function() {
            return this.inherited();
        });

        // extend with method present in all classes
        returnedClass = theClass.extend(defs);
        testClassIntegrity(theClass, returnedClass, className);
        ok(JSC.isOverloaded(theClass[proto].attach), ctxMsg + "The overloader method 'attach' must be tagged as overloaded since it call for inherited");
        ok(theClass[proto].attach !== defs.attach, ctxMsg + "The overloader method 'attach' must be different from given one since it call for inherited");
        ok(theClass[proto].attach !== oldPrototype.attach, ctxMsg + "The overloader method 'attach' must be different from overloaded one");

        // restore original prototype
        theClass[proto] = oldPrototype;
    }

    /**
     * Common class basis tests, called for each class test
     *
     * @param {String} className The name of the tested class
     * @param {Function} classGetter A class generator function
     * @param {Function} instanceGetter An instance generator function
     */
    function testClassBasis(className, classGetter, instanceGetter) {
        var instance, theClass, ctxMsg = className + "[basis] : ";

        // test Class.extend
        notThrow(function(){
            var privateValue, baseDefs = getIt({
                getPrivateValue : function() {
                    return privateValue;
                },
                setPrivateValue : function(value) {
                    privateValue = value;
                    return this;
                },
                aMethod : function() {
                    privateValue = "1";
                }
            }), ctxMsg = className + "[basis/extend] : ";

            // extend the class with a couple of methods
            theClass = classGetter();
            strictEqual(theClass.extend(baseDefs), theClass, ctxMsg + "The returned class must be the same than the related one !");
            instance = instanceGetter(theClass);
            ok(JSC.isFunction(instance.getPrivateValue), ctxMsg + "The method 'getPrivateValue' must exists !");
            ok(JSC.isFunction(instance.setPrivateValue), ctxMsg + "The method 'setPrivateValue' must exists !");
            strictEqual(instance.setPrivateValue(10), instance, ctxMsg + "The returned value of 'setPrivateValue' must be the instance in which the method has been called !");
            equal(instance.getPrivateValue(), 10, ctxMsg + "Check of method 'getPrivateValue'");
            instance.aMethod();
            equal(privateValue, "1", ctxMsg + "Check behavior of base added method 'aMethod'");

            // extend the class with an overloading method
            theClass = classGetter();
            theClass.extend(baseDefs);
            instance = instanceGetter(theClass);
            theClass.extend({
                aMethod : function() {
                    this.inherited();
                    privateValue += "2";
                }
            });
            instance.aMethod();
            equal(privateValue, "12", ctxMsg + "Check behavior of overloaded method 'aMethod' in existing instance");
            instance = instanceGetter(theClass);
            instance.aMethod();
            equal(privateValue, "12", ctxMsg + "Check behavior of overloaded method 'aMethod' in new instance");
        }, ctxMsg + "JSC must not throw any exception when calling the class method 'extend'");

        // test Class.implement
        notThrow(function(){
            var privateValue, baseDefs = getIt({
                infMethod : function() {
                    privateValue = "1";
                }
            }), ctxMsg = className + "[basis/implement] : ";

            // implement an interface on a class that already implement interface methods
            theClass = classGetter().extend(baseDefs);
            theClass.implement(["infMethod"]);
            notThrow(function(){
                instance = instanceGetter(theClass);
                instance.infMethod();
            }, ctxMsg + "The method 'infMethod' must not throw an exception, it must be a concrete method !");

            // implement an interface on a class that does not already implement interface methods
            theClass.implement(["absMethod"]);
            mustThrow(function(){
                instance = instanceGetter(theClass);
                instance.absMethod();
            }, ctxMsg + "The method 'absMethod' must throw an exception, it must be an abstract method !");

            // implement an interface with concrete methods
            theClass = classGetter();
            ok(undefined === theClass[proto].infMethod, ctxMsg + "The method 'infMethod' must not exist yet !");
            theClass.implement(baseDefs);
            ok(JSC.isFunction(theClass[proto].infMethod), ctxMsg + "The method 'infMethod' must exist !");
            notThrow(function(){
                instance = instanceGetter(theClass);
                instance.infMethod();
            }, ctxMsg + "The method 'infMethod' must not throw an exception, it must be a concrete method !");
        }, ctxMsg + "JSC must not throw any exception when calling the class method 'implement'");

        // test Class.method
        notThrow(function(){
            var result, otherClass, baseDefs = getIt({
                myId : function() {
                    return JSC.id(this);
                }
            }), ctxMsg = className + "[basis/method] : ";

            // build testbed
            theClass = classGetter().extend(baseDefs);
            otherClass = classGetter();
            ok(undefined === otherClass[proto].myId, ctxMsg + "The method 'myId' must not exist in other class !");
            ok(JSC.isFunction(theClass[proto].myId), ctxMsg + "The method 'myId' must exist !");
            instance = instanceGetter(otherClass);

            // call of method from a class in a particular context
            result = theClass.method("myId", instance);
            equal(result, JSC.id(instance), ctxMsg + "Result of called method must be the GUID of context instance");

            // call of method from a class with no context
            result = theClass.method("myId");
            equal(result, JSC.id(theClass), ctxMsg + "Result of called method must be the GUID of initial class");
        }, ctxMsg + "JSC must not throw any exception when calling the class method 'method'");

        // test instance.attach
        notThrow(function(){
            var result, attached, other, otherClass, baseDefs = getIt({
                myId : function() {
                    return JSC.id(this);
                }
            }), ctxMsg = className + "[basis/attach] : ";

            // build testbed
            theClass = classGetter().extend(baseDefs);
            otherClass = classGetter();
            ok(undefined === otherClass[proto].myId, ctxMsg + "The method 'myId' must not exist in other class !");
            ok(JSC.isFunction(theClass[proto].myId), ctxMsg + "The method 'myId' must exist !");
            instance = instanceGetter(theClass);
            other = instanceGetter(otherClass);
            attached = instance.attach("myId");

            // call of method from a class in a particular context
            result = attached.call(other);
            equal(result, JSC.id(instance), ctxMsg + "Result of called method must be the GUID of context instance");

            // call of method from a class with no context
            result = attached();
            equal(result, JSC.id(instance), ctxMsg + "Result of called method must be the GUID of initial class");

            // attach an unknown method
            attached = instance.attach("oups");
            ok(JSC.isFunction(attached), ctxMsg + "Unknown attached method must exist");
            result = attached();
            strictEqual(result, undefined, ctxMsg + "Result of called method must be undefined");
        }, ctxMsg + "JSC must not throw any exception when calling the method 'attach'");
    }

    /**
     * Common class tests, called for each class test
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     * @param {Function|String} superClass A reference or the name of the superClass
     */
    function testClassCommon(theClass, className, superClass) {
        var ctxMsg = className + "[common] : ";

        // test of class type
        ok("function" === typeof theClass, ctxMsg + "A class is a particular function");
        ok(JSC.isFunction(theClass), ctxMsg + "A class must be checked as a function by JSC.isFunction()");
        ok(JSC.isClass(theClass), ctxMsg + "A class must be checked as a class by JSC.isClass()");
        ok(!JSC.isObject(theClass), ctxMsg + "A class must not be checked as an object by JSC.isObject()");

        // presence check of needed statics methods
        (function(names){
            for(var i = 0; i < names.length; i++) {
                ok("function" === typeof theClass[names[i]], ctxMsg + "A class must have static method " + names[i] + "()");
            }
        })(["extend", "implement", "statics", "self", "rename"]);

        // presence check of needed statics objects
        (function(names){
            for(var i = 0; i < names.length; i++) {
                ok("object" === typeof theClass[names[i]], ctxMsg + "A class must have static attribute " + names[i] + "()");
            }
        })(["interfaces", "prototype"]);

        // presence check of needed prototyped methods
        (function(names){
            for(var i = 0; i < names.length; i++) {
                ok("function" === typeof theClass[proto][names[i]], ctxMsg + "A class must have prototyped method " + names[i] + "()");
            }
        })(["attach"]);

        // test of GUID
        ok("number" === typeof theClass.guid, ctxMsg + "A class must have a GUID member");
        ok(theClass.guid != 0, ctxMsg + "A class must have a valid GUID");

        // test of class identity
        equal(JSC.type(theClass), className, ctxMsg + "Type of a class must be itself");
        equal(theClass.className, className, ctxMsg + "Name of class must be specified as a static member");
        equal(theClass[proto].className, className, ctxMsg + "Name of class must be specified as a prototyped member");

        // optional test for inheritance
        if( superClass ) {
            // super class given, just get its name
            if( "function" === typeof superClass ) {
                superClass = superClass.className;
            }

            // inheritance check
            equal(theClass.superClass, superClass, ctxMsg + "Declared super class must be the same than the given parent class");
        }

        // test of class methods
        testClassRename(theClass, className);
        testClassSelf(theClass, className);
        testClassStatics(theClass, className);
        testClassMethod(theClass, className);
        testClassImplement(theClass, className);
        testClassExtend(theClass, className);
    }

    /**
     * Common singleton/multiton class tests
     *
     * @param {Function} theClass The class to test
     * @param {String} className The name of the tested class
     */
    function testClassCommonSingleton(theClass, className) {
        var instance, ctxMsg = className + "[common/singleton] : ";

        // test of singleton/multiton default structure
        ok(JSC.isFunction(theClass.getInstance), ctxMsg + "An instance builder must be defined on a singleton/multiton class !");
        ok(JSC.isFunction(theClass.body), ctxMsg + "A class body must be defined on a singleton/multiton class !");
        strictEqual(theClass.getInstance, theClass.body, ctxMsg + "Class body must be equal to getInstance !");

        // test of direct class construction avoiding
        mustThrow(function(){
            instance = new theClass();
        }, ctxMsg + "Direct instantiation is forbidden on singleton/multiton class !");
        ok(undefined === instance, ctxMsg + "No instance must be created by direct instantiation !");

        // test of factory
        notThrow(function(){
            instance = theClass();
            ok(instance, ctxMsg + "An instance must be built from factory !");
            ok(instance instanceof theClass, ctxMsg + "Instance built from factory must be an instance of the class !");
        }, ctxMsg + "No exception must be throwed when get an instance by factory !");
    }

    /**
     * Test standard classes in a simpliest context
     *
     * @param {Function} generator A callbak function called to create classes
     * @param {String} generatorName Name of the generator
     */
    function testClassStandardSimpliest(generator, generatorName) {
        // building class without definition
        notThrow(function(){
            var aClass, className = "aClass";

            // no definition
            aClass = generator();
            testClassCommon(aClass, defaultClassName);

            // just the name of the class
            aClass = generator(className);
            testClassCommon(aClass, className);
        }, generatorName + " must not throw any exception when building a class without definition");

        // trying to create a class with a super class that does not exist
        mustThrow(function(){
            generator({
                superClass : "undefinedClass"
            })
        }, generatorName + " must throw an error when trying to create a class with an unkwnown super class");
    }

    /**
     * Test standard classes
     *
     * @param {Function} generator A callbak function called to create classes
     */
    function testClassStandard(generator) {
        var className, classDefs, instance, markerValue, classGetter = getIt(function(){
            return generator(JSC.merge({}, classDefs));
        }), instanceGetter = getIt(function(theClass){
            return new theClass();
        }), ctxMsg = className + "[standard] : ";

        // base class creation
        markerValue = undefined;
        className = "standardClassA";
        classDefs = getIt({
            className : className,
            initialize : function() {
                markerValue = this._name("initialize");
            },
            fn : function() {
                this.fnValue += this.className + ".fnA";
            },
            fnValue : "",
            _name : function(context) {
                return this.className + (context ? "." + context : "");
            }
        });
        var standardClassA = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(standardClassA, className);

        // base class instance test
        instance = new standardClassA();
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, standardClassA, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        ok(instance instanceof standardClassA, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, standardClassA), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, undefined, ctxMsg + "No member attribute 'dummy'");
        instance.fn();
        equal(instance.fnValue, className + ".fnA",  ctxMsg + "Result of method call");
        testClassBasis(className, classGetter, instanceGetter);

        // first level child class creation
        markerValue = undefined;
        className = "standardClassB";
        classDefs = getIt({
            className : className,
            superClass : standardClassA,
            initialize : function() {
                this.inherited();
            },
            fn : function() {
                this.inherited();
                this.fnValue += this.className + ".fnB";
            },
            dummy : "member"
        });
        var standardClassB = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(standardClassB, className, standardClassA);
        ok(JSC.isOverloaded(standardClassB[proto].initialize), ctxMsg + "Method 'initialize' must be tagged as overloaded");
        ok(JSC.isOverloaded(standardClassB[proto].fn), ctxMsg + "Method 'fn' must be tagged as overloaded");

        // first level child class instance test
        instance = new standardClassB();
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, standardClassB, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        ok(instance instanceof standardClassA, ctxMsg + "'instance' must be an instance of class 'standardClassA'");
        ok(instance instanceof standardClassB, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, standardClassA), ctxMsg + "'instance' must be an instance of class 'standardClassA'");
        ok(JSC.instanceOf(instance, standardClassB), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, "member", ctxMsg + "Member attribute 'dummy' must exist");
        instance.fn();
        equal(instance.fnValue, className + ".fnA" + className + ".fnB",  ctxMsg + "Result of method call");
        testClassBasis(className, classGetter, instanceGetter);

        // second level child class creation
        markerValue = undefined;
        className = "standardClassC";
        JSC.globalize(standardClassB);
        classDefs = getIt({
            className : className,
            superClass : "standardClassB",
            fn : function() {
                this.fnValue += this.className + ".fnC";
            }
        });
        var standardClassC = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(standardClassC, className, standardClassB);
        ok(!JSC.isOverloaded(standardClassC[proto].fn), ctxMsg + "Method 'fn' must not be tagged as overloaded");

        // second level child class instance test
        instance = new standardClassC();
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, standardClassC, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        ok(instance instanceof standardClassA, ctxMsg + "'instance' must be an instance of class 'standardClassA'");
        ok(instance instanceof standardClassB, ctxMsg + "'instance' must be an instance of class 'standardClassB'");
        ok(instance instanceof standardClassC, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, standardClassA), ctxMsg + "'instance' must be an instance of class 'standardClassA'");
        ok(JSC.instanceOf(instance, standardClassB), ctxMsg + "'instance' must be an instance of class 'standardClassB'");
        ok(JSC.instanceOf(instance, standardClassC), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, "member", ctxMsg + "Member attribute 'dummy' must exist");
        instance.fn();
        equal(instance.fnValue, className + ".fnC",  ctxMsg + "Result of method call");
        testClassBasis(className, classGetter, instanceGetter);
        JSC.globalize("standardClassB");
    }

    /**
     * Test singleton classes in a simpliest context
     *
     * @param {Function} generator A callbak function called to create classes
     * @param {String} generatorName Name of the generator
     */
    function testClassSingletonSimpliest(generator, generatorName) {
        // building class without definition
        notThrow(function(){
            var aClass, className = "aClass";

            // no definition
            aClass = generator();
            testClassCommon(aClass, defaultClassName);
            testClassCommonSingleton(aClass, defaultClassName);

            // just the name of the class
            aClass = generator(className);
            testClassCommon(aClass, className);
            testClassCommonSingleton(aClass, className);
        }, generatorName + " must not throw any exception when building a class without definition");

        // trying to create a class with a super class that does not exist
        mustThrow(function(){
            generator({
                superClass : "undefinedClass"
            })
        }, generatorName + " must throw an error when trying to create a class with an unkwnown super class");
    }

    /**
     * Test singleton classes
     *
     * @param {Function} generator A callbak function called to create classes
     */
    function testClassSingleton(generator) {
        var i, className, classDefs, instance, markerValue, classGetter = getIt(function(){
            return generator(JSC.merge({}, classDefs));
        }), instanceGetter = getIt(function(theClass){
            return theClass.getInstance();
        }), ctxMsg = className + "[singleton] : ";

        // base class creation
        markerValue = undefined;
        className = "singletonClassA";
        classDefs = getIt({
            className : className,
            initialize : function() {
                markerValue = this._name("initialize");
            },
            fn : function() {
                this.fnValue += this.className + ".fnA";
            },
            fnValue : "",
            _name : function(context) {
                return this.className + (context ? "." + context : "");
            }
        });
        var singletonClassA = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(singletonClassA, className);
        testClassCommonSingleton(singletonClassA, className);

        // base class instance test
        instance = singletonClassA.getInstance();
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, singletonClassA, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        ok(instance instanceof singletonClassA, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, singletonClassA), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, undefined, ctxMsg + "No member attribute 'dummy'");
        instance.fn();
        equal(instance.fnValue, className + ".fnA",  ctxMsg + "Result of method call");
        for(i = 0; i < 4; i++) {
            strictEqual(singletonClassA.getInstance(i), instance, ctxMsg + "Only one instance must be created in a singleton");
            strictEqual(singletonClassA.getInstance(i).guid, instance.guid, ctxMsg + "Only one instance must be created in a singleton");
        }
        testClassBasis(className, classGetter, instanceGetter);

        // first level child class creation
        markerValue = undefined;
        className = "singletonClassB";
        classDefs = getIt({
            className : className,
            superClass : singletonClassA,
            initialize : function() {
                this.inherited();
            },
            fn : function() {
                this.inherited();
                this.fnValue += this.className + ".fnB";
            },
            dummy : "member"
        });
        var singletonClassB = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(singletonClassB, className, singletonClassA);
        testClassCommonSingleton(singletonClassB, className);
        ok(JSC.isOverloaded(singletonClassB[proto].initialize), ctxMsg + "Method 'initialize' must be tagged as overloaded");
        ok(JSC.isOverloaded(singletonClassB[proto].fn), ctxMsg + "Method 'fn' must be tagged as overloaded");

        // first level child class instance test
        instance = singletonClassB.getInstance();
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, singletonClassB, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        notStrictEqual(instance, singletonClassA.getInstance(), ctxMsg + "Built instance must be different to those from other singleton classes");
        ok(instance instanceof singletonClassA, ctxMsg + "'instance' must be an instance of class 'singletonClassA'");
        ok(instance instanceof singletonClassB, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, singletonClassA), ctxMsg + "'instance' must be an instance of class 'singletonClassA'");
        ok(JSC.instanceOf(instance, singletonClassB), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, "member", ctxMsg + "Member attribute 'dummy' must exist");
        instance.fn();
        equal(instance.fnValue, className + ".fnA" + className + ".fnB",  ctxMsg + "Result of method call");
        for(i = 0; i < 4; i++) {
            strictEqual(singletonClassB.getInstance(i), instance, ctxMsg + "Only one instance must be created in a singleton");
            strictEqual(singletonClassB.getInstance(i).guid, instance.guid, ctxMsg + "Only one instance must be created in a singleton");
        }
        testClassBasis(className, classGetter, instanceGetter);

        // second level child class creation
        markerValue = undefined;
        className = "singletonClassC";
        JSC.globalize(singletonClassB);
        classDefs = getIt({
            className : className,
            superClass : "singletonClassB",
            fn : function() {
                this.fnValue += this.className + ".fnC";
            }
        });
        var singletonClassC = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(singletonClassC, className, singletonClassB);
        testClassCommonSingleton(singletonClassC, className);
        ok(!JSC.isOverloaded(singletonClassC[proto].fn), ctxMsg + "Method 'fn' must not be tagged as overloaded");

        // second level child class instance test
        instance = singletonClassC.getInstance();
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, singletonClassC, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        notStrictEqual(instance, singletonClassA.getInstance(), ctxMsg + "Built instance must be different to those from other singleton classes");
        notStrictEqual(instance, singletonClassB.getInstance(), ctxMsg + "Built instance must be different to those from other singleton classes");
        ok(instance instanceof singletonClassA, ctxMsg + "'instance' must be an instance of class 'singletonClassA'");
        ok(instance instanceof singletonClassB, ctxMsg + "'instance' must be an instance of class 'singletonClassB'");
        ok(instance instanceof singletonClassC, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, singletonClassA), ctxMsg + "'instance' must be an instance of class 'singletonClassA'");
        ok(JSC.instanceOf(instance, singletonClassB), ctxMsg + "'instance' must be an instance of class 'singletonClassB'");
        ok(JSC.instanceOf(instance, singletonClassC), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, "member", ctxMsg + "Member attribute 'dummy' must exist");
        instance.fn();
        equal(instance.fnValue, className + ".fnC",  ctxMsg + "Result of method call");
        for(i = 0; i < 4; i++) {
            strictEqual(singletonClassC.getInstance(i), instance, ctxMsg + "Only one instance must be created in a singleton");
            strictEqual(singletonClassC.getInstance(i).guid, instance.guid, ctxMsg + "Only one instance must be created in a singleton");
        }
        testClassBasis(className, classGetter, instanceGetter);
        JSC.globalize("singletonClassB");
    }

    /**
     * Test multiton classes
     *
     * @param {Function} generator A callbak function called to create classes
     */
    function testClassMultiton(generator) {
        var i, className, classDefs, instance, markerValue, classGetter = getIt(function(){
            return generator(JSC.merge({}, classDefs));
        }), instanceGetter = getIt(function(theClass){
            return theClass.getInstance("basis");
        }), ctxMsg = className + "[multiton] : ";

        // base class creation
        markerValue = undefined;
        className = "multitonClassA";
        classDefs = getIt({
            className : className,
            initialize : function() {
                markerValue = this._name("initialize");
            },
            fn : function() {
                this.fnValue += this.className + ".fnA";
            },
            fnValue : "",
            _name : function(context) {
                return this.className + (context ? "." + context : "");
            }
        });
        var multitonClassA = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(multitonClassA, className);
        testClassCommonSingleton(multitonClassA, className);

        // base class instance test
        instance = multitonClassA.getInstance("A");
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, multitonClassA, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        ok(instance instanceof multitonClassA, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, multitonClassA), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, undefined, ctxMsg + "No member attribute 'dummy'");
        instance.fn();
        equal(instance.fnValue, className + ".fnA",  ctxMsg + "Result of method call");
        for(i = 0; i < 4; i++) {
            strictEqual(multitonClassA.getInstance("A"), instance, ctxMsg + "Only one instance must be created in a multiton for a given key");
            strictEqual(multitonClassA.getInstance("A").guid, instance.guid, ctxMsg + "Only one instance must be created in a multiton for a given key");
        }
        notStrictEqual(multitonClassA.getInstance("a"), instance, ctxMsg + "Another key must produce another instance in multiton pattern");
        notStrictEqual(multitonClassA.getInstance("a").guid, instance.guid, ctxMsg + "Another key must produce another instance in multiton pattern");
        for(i = 0; i < 4; i++) {
            notStrictEqual(multitonClassA.getInstance(i), instance, ctxMsg + "Only one instance must be created in a multiton for a given key");
            instance = multitonClassA.getInstance(i);
        }
        testClassBasis(className, classGetter, instanceGetter);

        // first level child class creation
        markerValue = undefined;
        className = "multitonClassB";
        classDefs = getIt({
            className : className,
            superClass : multitonClassA,
            initialize : function() {
                this.inherited();
            },
            fn : function() {
                this.inherited();
                this.fnValue += this.className + ".fnB";
            },
            dummy : "member"
        });
        var multitonClassB = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(multitonClassB, className, multitonClassA);
        testClassCommonSingleton(multitonClassB, className);
        ok(JSC.isOverloaded(multitonClassB[proto].initialize), ctxMsg + "Method 'initialize' must be tagged as overloaded");
        ok(JSC.isOverloaded(multitonClassB[proto].fn), ctxMsg + "Method 'fn' must be tagged as overloaded");

        // first level child class instance test
        instance = multitonClassB.getInstance("B");
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, multitonClassB, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        notStrictEqual(instance, multitonClassA.getInstance("B"), className + " : Built instance must be different to those from other multiton classes");
        ok(instance instanceof multitonClassA, ctxMsg + "'instance' must be an instance of class 'multitonClassA'");
        ok(instance instanceof multitonClassB, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, multitonClassA), ctxMsg + "'instance' must be an instance of class 'multitonClassA'");
        ok(JSC.instanceOf(instance, multitonClassB), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, "member", ctxMsg + "Member attribute 'dummy' must exist");
        instance.fn();
        equal(instance.fnValue, className + ".fnA" + className + ".fnB",  ctxMsg + "Result of method call");
        for(i = 0; i < 4; i++) {
            strictEqual(multitonClassB.getInstance("B"), instance, ctxMsg + "Only one instance must be created in a multiton for a given key");
            strictEqual(multitonClassB.getInstance("B").guid, instance.guid, ctxMsg + "Only one instance must be created in a multiton for a given key");
        }
        notStrictEqual(multitonClassB.getInstance("b"), instance, ctxMsg + "Another key must produce another instance in multiton pattern");
        notStrictEqual(multitonClassB.getInstance("b").guid, instance.guid, ctxMsg + "Another key must produce another instance in multiton pattern");
        for(i = 0; i < 4; i++) {
            notStrictEqual(multitonClassB.getInstance(i), instance, ctxMsg + "Only one instance must be created in a multiton for a given key");
            instance = multitonClassB.getInstance(i);
        }
        testClassBasis(className, classGetter, instanceGetter);

        // second level child class creation
        markerValue = undefined;
        className = "multitonClassC";
        JSC.globalize(multitonClassB);
        classDefs = getIt({
            className : className,
            superClass : "multitonClassB",
            fn : function() {
                this.fnValue += this.className + ".fnC";
            }
        });
        var multitonClassC = generator(classDefs);
        equal(markerValue, undefined, ctxMsg + "Marker value must not be altered by class inheritance mechanism")
        testClassCommon(multitonClassC, className, multitonClassB);
        testClassCommonSingleton(multitonClassC, className);
        ok(!JSC.isOverloaded(multitonClassC[proto].fn), ctxMsg + "Method 'fn' must not be tagged as overloaded");

        // second level child class instance test
        instance = multitonClassC.getInstance("C");
        equal(JSC.type(instance), className, ctxMsg + "Type of a class instance must be its class name");
        equal(instance.constructor, multitonClassC, ctxMsg + "A reference to the class must be present into the built instance");
        equal(markerValue, className + ".initialize", ctxMsg + "Value after base class creation");
        notStrictEqual(instance, multitonClassA.getInstance("C"), ctxMsg + "Built instance must be different to those from other multiton classes");
        notStrictEqual(instance, multitonClassB.getInstance("C"), ctxMsg + "Built instance must be different to those from other multiton classes");
        ok(instance instanceof multitonClassA, ctxMsg + "'instance' must be an instance of class 'multitonClassA'");
        ok(instance instanceof multitonClassB, ctxMsg + "'instance' must be an instance of class 'multitonClassB'");
        ok(instance instanceof multitonClassC, ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.instanceOf(instance, multitonClassA), ctxMsg + "'instance' must be an instance of class 'multitonClassA'");
        ok(JSC.instanceOf(instance, multitonClassB), ctxMsg + "'instance' must be an instance of class 'multitonClassB'");
        ok(JSC.instanceOf(instance, multitonClassC), ctxMsg + "'instance' must be an instance of class '" + className + "'");
        ok(JSC.isFunction(instance.initialize), ctxMsg + "Member method 'initialize' must exist");
        ok(JSC.isFunction(instance.fn), ctxMsg + "Member method 'fn' must exist");
        equal(instance.dummy, "member", ctxMsg + "Member attribute 'dummy' must exist");
        instance.fn();
        equal(instance.fnValue, className + ".fnC",  ctxMsg + "Result of method call");
        for(i = 0; i < 4; i++) {
            strictEqual(multitonClassC.getInstance("C"), instance, ctxMsg + "Only one instance must be created in a multiton for a given key");
            strictEqual(multitonClassC.getInstance("C").guid, instance.guid, ctxMsg + "Only one instance must be created in a multiton for a given key");
        }
        notStrictEqual(multitonClassC.getInstance("c"), instance, ctxMsg + "Another key must produce another instance in multiton pattern");
        notStrictEqual(multitonClassC.getInstance("c").guid, instance.guid, ctxMsg + "Another key must produce another instance in multiton pattern");
        for(i = 0; i < 4; i++) {
            notStrictEqual(multitonClassC.getInstance(i), instance, ctxMsg + "Only one instance must be created in a multiton for a given key");
            instance = multitonClassC.getInstance(i);
        }
        testClassBasis(className, classGetter, instanceGetter);
        JSC.globalize("multitonClassB");
    }

    // run the tests suite
    new TestSuite(suite, true);
})();
