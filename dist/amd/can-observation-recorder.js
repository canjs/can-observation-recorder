/*can-observation-recorder@0.0.0#can-observation-recorder*/
define([
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    var namespace = require('can-namespace');
    var stack = [];
    var observationRecorder = {
        stack: stack,
        makeDependenciesRecorder: function () {
            return {
                traps: null,
                keyDependencies: new Map(),
                valueDependencies: new Set(),
                ignore: 0
            };
        },
        start: function () {
            stack.push({
                traps: null,
                keyDependencies: new Map(),
                valueDependencies: new Set(),
                ignore: 0
            });
        },
        stop: function () {
            return stack.pop();
        },
        add: function (obj, event) {
            var top = stack[stack.length - 1];
            if (top && top.ignore === 0) {
                if (top.traps) {
                    top.traps.push([
                        obj,
                        event
                    ]);
                } else {
                    if (event === undefined) {
                        top.valueDependencies.add(obj);
                    } else {
                        var eventSet = top.keyDependencies.get(obj);
                        if (!eventSet) {
                            eventSet = new Set();
                            top.keyDependencies.set(obj, eventSet);
                        }
                        eventSet.add(event);
                    }
                }
            }
        },
        addMany: function (observes) {
            var top = stack[stack.length - 1];
            if (top) {
                if (top.traps) {
                    top.traps.push.apply(top.traps, observes);
                } else {
                    for (var i = 0, len = observes.length; i < len; i++) {
                        this.observe(observes[i][0], observes[i][1]);
                    }
                }
            }
        },
        ignore: function (fn) {
            return function () {
                if (stack.length) {
                    var top = stack[stack.length - 1];
                    top.ignore++;
                    var res = fn.apply(this, arguments);
                    top.ignore--;
                    return res;
                } else {
                    return fn.apply(this, arguments);
                }
            };
        },
        trap: function () {
            if (stack.length) {
                var top = stack[stack.length - 1];
                var oldTraps = top.traps;
                var traps = top.traps = [];
                return function () {
                    top.traps = oldTraps;
                    return traps;
                };
            } else {
                return function () {
                    return [];
                };
            }
        },
        trapsCount: function () {
            if (stack.length) {
                var top = stack[stack.length - 1];
                return top.traps.length;
            } else {
                return 0;
            }
        },
        isRecording: function () {
            var len = stack.length;
            var last = len && stack[len - 1];
            return last && last.ignore === 0 && last;
        }
    };
    if (namespace.observationRecorder) {
        throw new Error('You can\'t have two versions of can-observation-recorder, check your dependencies');
    } else {
        module.exports = namespace.observationRecorder = observationRecorder;
    }
});