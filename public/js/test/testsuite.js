/*!
 * JavaScript unit tests runner for JavaScript Class Library v0.2 (JSC v0.2)
 *
 * Designed for QUnit
 *
 * Copyright 2012 Jean-Sebastien CONAN
 * Released under the MIT license
 */
(function(){
    /**
     * Tests runner using QUnit
     *
     * @param {Object} suite List of methods to run as unit tests
     * @param {Boolean} [auto] Optional flag to auto run the tests suite
     */
    TestSuite = function(suite, auto) {
        this.suite = suite || {};
        this.count = 0;
        this.index = this.constructor.count ++;

        auto && this.run();
    }
    TestSuite.count = 0;

    /**
     * Run all tests from the list
     */
    TestSuite.prototype.run = function() {
        module(this.suite._name || "testSuite#" + this.index);

        this.count = 0;
        for(var name in this.suite) {
            this.test(name);
        }
    };

    /**
     * Run a test from the list
     *
     * @param {String} name Name of the test to run after retrieving from the list
     */
    TestSuite.prototype.test = function(name) {
        this.runTest(this.suite[name], name);
    };

    /**
     * Run a test
     *
     * @param {Function} fn Function containing unit tests
     * @param {String} [name] Optional name of the unit test (by default try to take the name of the given function)
     */
    TestSuite.prototype.runTest = function(fn, name) {
        if( "function" === typeof fn) {
            name = name || (arguments.callee.caller.name || "test" + this.count).replace(/^test/, '');
            if( fn.async ) {
                asyncTest(name, fn);
            } else {
                test(name, fn);
            }
            this.count ++;
        }
    };

    /**
     * Tag a test function to be runned asynchronously.
     *
     * @param {Function} fn The function to be tagged
     * @return {Function} The tagged function
     */
    TestSuite.async = function(fn) {
        if( "function" === typeof fn) {
            fn.async = true;
        }
        return fn;
    };

    // export class
    this.TestSuite = TestSuite;
})();
