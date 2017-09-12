/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function fail(why) { throw new Error(why); }

function mapKV(o, f) {
  return o && Object.keys(o).sort().map(function (k) { return f(k, o[k]); });
}

function nq(q, s, h) {
  if (!h) { fail('Event handler cannot be false-y'); }
  if (typeof h !== 'function') { fail('Event handler must be a function'); }
  var l = q[s];
  if (!l) { l = q[s] = []; }
  l.push(h);
}

function asap(e, q, v, h, nx) {
  var s = ':' + v, a = q[s];   // first once's arguments
  if (a) { return (h && h.apply(e, a)); }
  function saveArgs() { q[s] = arguments; }
  if (a === undefined) {
    q[s] = false;
    nx(v, saveArgs);
  }
  if (h) { nx(v, h); }
}

function subscribe(q, e, t) {
  if (e) {
    if (e === t) { return e; }
    fail('Already subscribed to another EventEmitter.');
  }
  if (!t) { fail('Expected an EventEmitter, not some false-y value.'); }
  mapKV(q, function (k, l) {
    var m = k.slice(0, 1), v = k.slice(1);
    if (m === '1') { return l.forEach(function (h) { t.once(v, h); }); }
    if (m === '*') { return l.forEach(function (h) { t.on(v, h); }); }
  });
  return t;
}


function futureOn(opt) {
  opt = (opt || false);
  var obj = (opt.obj || {}), q = Object.create(null), e = null;
  // q = queues, e = emitter, v = event name, h = handler
  obj.on = function on(v, h) { return (e ? e.on(v, h) : nq(q, '*' + v, h)); };
  function nx(v, h) { return (e ? e.once(v, h) : nq(q, '1' + v, h)); }
  obj.once = nx;
  obj.asap = function (v, h) { asap(e, q, v, h, nx); };
  obj.sub = function (t) { e = subscribe(q, e, t); };
  return obj;
}



















module.exports = futureOn;
