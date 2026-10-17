import test from 'node:test';
import assert from 'node:assert/strict';
import {projectGlobePoint} from '../dist/globe.js';
test('destination label follows the same rotating surface point',()=>{
 const a=projectGlobePoint(-88.2073,40.1106,900,-1.54);
 const b=projectGlobePoint(-88.2073,40.1106,900,-1.3);
 assert.ok(a[2]>0&&b[2]>0);
 assert.notEqual(a[0],b[0]);
 assert.notEqual(a[1],b[1]);
});
test('projection scales with the globe and identifies its rear hemisphere',()=>{
 const a=projectGlobePoint(-88.2073,40.1106,900,-1.54);
 const b=projectGlobePoint(-88.2073,40.1106,450,-1.54);
 assert.equal(b[0],a[0]/2);assert.equal(b[1],a[1]/2);
 assert.ok(projectGlobePoint(-88.2073,40.1106,900,-1.54+Math.PI)[2]<0);
});
