import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceCloudTime} from '../dist/motion.js';
test('cloud motion continues beyond 45 seconds and after two minutes',()=>{
 assert.equal(advanceCloudTime(45,.03,true),45.03);
 assert.equal(advanceCloudTime(120,.03,true),120.03);
});
test('hidden and reduced-motion states do not advance the cloud image',()=>{
 assert.equal(advanceCloudTime(12,.03,false),12);
});
test('returning after a background-tab gap cannot jump the perspective',()=>{
 assert.equal(advanceCloudTime(10,5,true),10.05);
 assert.equal(advanceCloudTime(10,-1,true),10);
});
test('depth distortion stays bounded and every cloud band keeps moving forward',async()=>{
 const {cloudFrame}=await import('../dist/motion.js');
 for(let time=0;time<=3600;time+=.25){
  const a=cloudFrame(time),b=cloudFrame(time+.01);
  assert.ok(Math.abs(a.relief)<=.008);
  assert.ok(a.expansion>=0&&a.expansion<=.025);
  for(const depth of [0,.25,.5,.75,1])
   assert.ok(b.drift+b.relief*depth>a.drift+a.relief*depth);
 }
});
