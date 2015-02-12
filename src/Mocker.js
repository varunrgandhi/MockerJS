/**
 *
 * Mocker.js is a very lightweight JavaScript mocking utility
 * This utility can be used to mock-out, stub-out or simply spy-on an object's method.
 *
 ** Mocker.mock(...) method will give you the ability to do the following in tests:
 *** Track (spy on) calls to an object method.
 *** Track (spy on) the inputs given to the object's method
 *** Optionally replace (stub out) the method with a new method (no-op or special behavior)
 *
 ** Mocker.stub(...) is a convenience method that stubs-out the method with a no-op method, while providing all spy flags
 *
 ** Mocker.spy(...) is a convenience method that keeps the original method but provides only spy flags.
 *
 *
 * @static
 * @param {object} obj - The object to spy on
 * @param {string} methodName - name of the method to spy on
 * @param {Function} [newMethod=originalMethod] - an @optional function that will be called in place
 *                                                of the actual object method. If not provided the
 *                                                original method will be used
 * @return {Function} delegateMethod - The new method that was installed on the object.
 *                                     This object has all the details saved on it.
 */
(function(window) {
    window.Mocker = {
        mock: function(obj, methodName, newMethod) {
            if (!obj || !methodName || !(obj[methodName]) || !(obj[methodName] instanceof Function)) {
                throw new Error('Must provide object and a method name of that object.');
            }
            if (newMethod && !(newMethod instanceof Function)) {
                throw new Error('New method provided must be a Function');
            }

            var originalMethod = obj[methodName];

            // create a new function that will act as the delegate
            var delegateMethod = function() {
                obj[methodName].called = true;
                obj[methodName].calledWith = arguments;
                // Setup properties arg1, arg2 ... argN for easy access
                for (var i = 0; i < arguments.length; ++i) {
                    obj[methodName]["arg" + (i + 1)] = arguments[i];
                }
                return obj[methodName].methodToCall.apply(obj, arguments);
            };

            // Setup stub vs original method as needed
            if (!newMethod) {
                delegateMethod.methodToCall = originalMethod;
            } else {
                delegateMethod.methodToCall = newMethod;
            }

            // Setup spy flags 
            delegateMethod.called = false;
            delegateMethod.calledWith = {};

            // stash away the original method for restoring purposes
            delegateMethod.originalMethod = originalMethod;
            delegateMethod.restore = function() {
                // reset the object with the original method
                obj[methodName] = obj[methodName].originalMethod;
            }

            // Replace original object method with the delegate method. 
            obj[methodName] = delegateMethod;
            return delegateMethod;
        },

        stub: function(obj, methodName) {
            return Mocker.mock(obj, methodName, function() {});
        },

        spy: function(obj, methodName) {
            return Mocker.mock(obj, methodName);
        },
    };

}(window))