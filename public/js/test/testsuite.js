function runTestSuite(testSuite) {
    if( !testSuite ) {
        return;
    }

    runTestSuite.count = (runTestSuite.count || 0) + 1;
    module(testSuite._name || "testSuite#" + runTestSuite.count);

    var testName, testCount = 0;
    for(testName in testSuite) {
        if( "function" === typeof testSuite[testName]) {
            test(testName, testSuite[testName]);
        }
    }
}

function runTest(fn) {
    runTest.count = (runTest.count || 0) + 1;
    var name = (arguments.callee.caller.name || "test" + runTest.count).replace(/^test/, '');
    test(name, fn);
}
