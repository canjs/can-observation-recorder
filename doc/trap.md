@function can-observation-recorder.trap trap
@parent can-observation-recorder/methods

@hide

@signature `Observation.trap()`
Trap all observations until the `untrap` function is called. The state of
traps prior to `Observation.trap()` will be restored when `untrap()` is called.

```js
var untrap = Observation.trap();

Observation.add(obj, "prop1");

var traps = untrap();
console.log(traps[0].obj === obj); // -> true
```

@return {can-observation-recorder.getTrapped} A function to get the trapped observations.
