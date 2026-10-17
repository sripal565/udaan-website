import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceCloudTime} from '../dist/motion.js';
test('cloud motion freezes at the approved 45-second endpoint',()=>{
 assert.equal(advanceCloudTime(44.99,.03,true),45);
 assert.equal(advanceCloudTime(45,.03,true),45);
});
test('hidden and reduced-motion states do not advance the cloud image',()=>{
 assert.equal(advanceCloudTime(12,.03,false),12);
});
test('returning after a background-tab gap cannot jump the perspective',()=>{
 assert.equal(advanceCloudTime(10,5,true),10.05);
 assert.equal(advanceCloudTime(10,-1,true),10);
});
