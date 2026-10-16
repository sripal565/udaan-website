import test from 'node:test';
import assert from 'node:assert/strict';
import {heroFrame,flightFrame,arrivalFrame,loopFrame} from '../dist/motion.js';
test('window opens fully and headline clears before clouds take over',()=>{
 assert.equal(heroFrame(0).scale,1);assert.equal(heroFrame(0).copy,1);
 assert.equal(heroFrame(.35).copy,0);assert.equal(heroFrame(1).opacity,0);
 assert.equal(heroFrame(1).scale,4.4);
});
test('aircraft rises before receding, then drawing takes over without gap',()=>{
 assert.equal(flightFrame(0).y,110);assert.equal(flightFrame(.34).y,0);
 assert.equal(flightFrame(.34).scale,1.5);
 assert.equal(flightFrame(1).plane,0);assert.equal(flightFrame(1).spec,1);
 assert.ok(flightFrame(.72).plane+flightFrame(.72).spec>.5);
});
test('boarding pass clears and contact footer stays visible at end',()=>{
 assert.equal(arrivalFrame(0).passOpacity,0);assert.equal(arrivalFrame(.3).passOpacity,1);
 assert.equal(arrivalFrame(1).passOpacity,0);assert.equal(arrivalFrame(1).footer,1);
});
test('all frames remain finite and bounded during overscroll',()=>{
 for(const p of [-1,0,.2,.5,.8,1,2])for(const f of [heroFrame(p),flightFrame(p),arrivalFrame(p)])for(const value of Object.values(f))assert.ok(Number.isFinite(value));
});

test('cloud overlap starts before the boundary and swaps only after fading in',()=>{
 assert.equal(loopFrame(10,8).startNext,false);
 assert.equal(loopFrame(10,8.5).startNext,true);
 assert.equal(loopFrame(10,9.25).blend,.5);
 assert.equal(loopFrame(10,9.25).swap,false);
 assert.equal(loopFrame(10,10).blend,1);
 assert.equal(loopFrame(10,10).swap,true);
 assert.equal(loopFrame(NaN,0).startNext,false);
});
