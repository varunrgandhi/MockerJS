QUnit.module("Mocker.js tests");

QUnit.test("test Mocker object created", function(assert) {
    assert.ok(Mocker, "Mocker not found");
    assert.ok(Mocker.mock instanceof Function, "Mocker.mock not valid");
    assert.ok(Mocker.spy instanceof Function, "Mocker.spy not valid");
    assert.ok(Mocker.stub instanceof Function, "Mocker.stub not valid");
});

QUnit.test("test Mocker.mock method - spy", function(assert) {

    // Setup
    var blahCalled = false;
    var expectedRetVal = "test ret val";
    var testObj = {
        blah: function() {
            blahCalled = true;
            return expectedRetVal;
        }
    }
    var originalMethod = testObj.blah;

    // Mock
    var stubby = Mocker.spy(testObj, "blah");

    // pre conditions
    assert.ok(!testObj.blah.called, "spy flag: called is not false");
    assert.deepEqual(testObj.blah.calledWith, {}, "spy flag: calledWith is not empty");
    assert.deepEqual(testObj.blah.originalMethod, originalMethod, "Original method is not saved");
    assert.deepEqual(testObj.blah.methodToCall, originalMethod, "Method to call will be orginal method");

    // execute 
    expectedArgs = {
        a: 1
    };
    actualRetVal = testObj.blah(expectedArgs);

    // Verify
    assert.ok(testObj.blah.called, "spy flag: called is not true");
    assert.deepEqual(testObj.blah.calledWith[0], expectedArgs, "spy flag: calledWith is not expected");
    assert.deepEqual(testObj.blah.arg1, expectedArgs, "spy flag: arg<num> is not expected");
    assert.ok(blahCalled, "Orginal method was executed");
    assert.equal(actualRetVal, expectedRetVal, "Return values were correct");

    // Restore
    testObj.blah.restore();

    // Verify post restore
    assert.deepEqual(testObj.blah, originalMethod, "Original method is not restored");

});

QUnit.test("test Mocker.mock method - stub", function(assert) {

    // Setup
    var testObj = {
        blah: function() {}
    }
    var originalMethod = testObj.blah;
    var stubCalled = false;
    var expectedStubRetVal = "test ret val";
    var stubMethod = function() {
        stubCalled = true;
        return expectedStubRetVal
    }

    // Mock
    var stubby = Mocker.mock(testObj, "blah", stubMethod);

    // pre conditions
    assert.ok(!testObj.blah.called, "spy flag: called is not false");
    assert.deepEqual(testObj.blah.calledWith, {}, "spy flag: calledWith is not empty");
    assert.deepEqual(testObj.blah.originalMethod, originalMethod, "Original method is not saved");
    assert.deepEqual(testObj.blah.methodToCall, stubMethod, "Method to call is not the stub method");

    // execute 
    expectedArgs = {
        a: 1
    };
    actualRetVal = testObj.blah(expectedArgs);

    // Verify
    assert.ok(testObj.blah.called, "spy flag: called is not true");
    assert.deepEqual(testObj.blah.calledWith[0], expectedArgs, "spy flag: calledWith is not expected");
    assert.deepEqual(testObj.blah.arg1, expectedArgs, "spy flag: arg<num> is not expected");
    assert.ok(stubCalled, "Stub method was executed");
    assert.equal(actualRetVal, expectedStubRetVal, "Return values were correct");

    // Restore
    testObj.blah.restore();

    // Verify post restore
    assert.deepEqual(testObj.blah, originalMethod, "Original method is not restored");

});