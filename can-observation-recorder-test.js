var QUnit = require('steal-qunit');
var observationRecorder = require('./can-observation-recorder');

QUnit.module('can-observation-recorder');

QUnit.test('basics', function(){
    var foo = {};
    var bar = {};
  observationRecorder.start();

  observationRecorder.add(foo, "event1");
  observationRecorder.add(bar);

  var dependencies = observationRecorder.stop();
  QUnit.ok(dependencies.keyDependencies.get(foo), "has foo in key deps");
  QUnit.ok(dependencies.keyDependencies.get(foo).has("event1"), "has foo event1 ");
  QUnit.ok(dependencies.valueDependencies.has(bar), "has foo in key depes");
});
