
<!--#echo json="package.json" key="name" underline="=" -->
future-on-pmb
=============
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Subscribe to events right now, independent of whether the event emitter
already exists.
<!--/#echo -->


Usage
-----

from [test.usage.js](test.usage.js):

<!--#include file="test.usage.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="58" -->
```javascript
var futureOn = require('future-on-pmb'),
  makeClock = require('event-test-clock-pmb').flavors.quarterSeconds,
  clock = null,
  standIn = futureOn();

// There's no testClock yet, but standIn already takes pre-orders.
standIn.once('beginTest', test.log.l8r(['Test begins.']));
standIn.on('halfSec', test.log.l8r(['Half a second has passed.']));
// .asap works like package `late-once-pmb`:
standIn.asap('morning', test.log.l8r(['Wake up!']));
// .asap without an event handler just arranges observation of the event:
standIn.asap('noon');

function lateSubscribe() {
  test.log('Subscribing late.');
  standIn.asap('morning', test.log.l8r(['Yawn.']));
  standIn.asap('noon', test.log.l8r(['Lunchtime!']));
  standIn.once('halfSec', test.log.l8r(['Hello.']));
}

standIn.on('created', test.log.l8r(['This will never fire.']));
clock = makeClock();
clock.emit('created', 'Now we have a clock!');
// standIn can only forward events that occur after we subscribed it
// to the EventEmitter:
standIn.sub(clock);
clock.emit('beginTest', 'Godspeed!');

// You can still subscribe via standIn even then.
standIn.on('fullSec', function (t) { test.log({ time_sec: t }); });

clock.schedule([ 'abs',
  1, function () { clock.emit('morning'); },
  3, function () { clock.emit('noon'); },
  5, lateSubscribe,
  7, function () { clock.emit('night'); },
  9, function () { clock.emit('morning'); },
  11, function () { clock.emit('noon'); },
  15, function () { test.verify(); },
  ]);

test.verify = function () {
  clock.stop();
  equal.lists(test.log(), [
    [ 'Test begins.', 'Godspeed!' ], 'Wake up!',
    [ 'Half a second has passed.', 1 ],
    [ 'Half a second has passed.', 2 ], { time_sec: 1 },
    'Subscribing late.', 'Yawn.', 'Lunchtime!',
    [ 'Half a second has passed.', 3 ], [ 'Hello.', 3 ],
    [ 'Half a second has passed.', 4 ], { time_sec: 2 },
    [ 'Half a second has passed.', 5 ],
    [ 'Half a second has passed.', 6 ], { time_sec: 3 },
    [ 'Half a second has passed.', 7 ],
  ]);
  test.ok();
};
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* needs more/better tests and docs
* no support for `.off()` yet. PRs welcome.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
