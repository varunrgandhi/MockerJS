# Mocker.js 

## Mocker.js is a lightweight JavaScript mocking utility


This utility can be used to mock-out, stub-out or simply spy-on an object's method for testing purposes

* `Mocker.mock(...)` method will give you the ability to do the following in tests:
    * Track (spy on) calls to an object method.
    * Track (spy on) the inputs given to the object's method
    * Optionally replace (stub out) the method with a new method (no-op or special behavior)

* `Mocker.stub(...)` is a convenience method that stubs-out the method with a no-op method, while providing all spy flags

* `Mocker.spy(...)` is a convenience method that keeps the original method but provides only spy flags.


**Usage:**

Say the source code being tested calls a method on a object. 
However, in tests you want to mock out the behavior with something different.

```js
var testObj = {
    doSomething: function() {
        console.log("In real Do Something");
    }
}

// You can now mock out the testObj like this 
var mockMethod = Mocker.mock (testObj, "doSomething", function() {console.log("In mock do something.");});

// Execute the source code that would use testObj.doSomething()
// Now you can see the the real doSomething won't be called, but the new mock doSomething should be called.

mockMethod.called // = true

mockMethod.restore(); // Will clear all flags and reset original behaviors.
```

QUnit tests for the utility: https://cdn.rawgit.com/varunrgandhi/mockerjs/master/test/testRunner.html
