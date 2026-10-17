export function projectGlobePoint(lon,lat,size,rotation,tilt=.32,r=size*.43) {
 const rad=Math.PI/180,a=lon*rad-rotation,b=lat*rad;
 const x=Math.cos(b)*Math.sin(a),y=Math.sin(b)*Math.cos(tilt)-Math.cos(b)*Math.cos(a)*Math.sin(tilt),z=Math.sin(b)*Math.sin(tilt)+Math.cos(b)*Math.cos(a)*Math.cos(tilt);
 return [size/2+r*x,size/2-r*y,z];
}
export async function startGlobe(canvas, reducedMotion) {
 const label=canvas.parentElement.querySelector('.globe-label');
 if(label)label.hidden=true;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;
 let land;
 try { const response = await fetch('assets/land.geojson'); land = await response.json(); } catch { land = null; }
 let visible = false, angle = -1.54, last = 0, frame;
 const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, {rootMargin:'100px'});
 observer.observe(canvas);
 let size=900, ratio=1;
 function resize() { size=Math.min(1100,canvas.clientWidth); ratio=Math.min(devicePixelRatio||1,2); canvas.width=size*ratio;canvas.height=size*ratio; }
 resize(); addEventListener('resize',resize);
 const rad = Math.PI / 180;
 function project(lon,lat,r,rotation,tilt=.32) {
  return projectGlobePoint(lon,lat,size,rotation,tilt,r);
 }
 function line(points,r,rotation,color,width=1) {
  ctx.beginPath(); let started=false;
  points.forEach(([lon,lat])=>{const [x,y,z]=project(lon,lat,r,rotation); if(z>0){if(started)ctx.lineTo(x,y);else ctx.moveTo(x,y);started=true;}else started=false;});
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
 }
 function draw(now) {
  frame=requestAnimationFrame(draw);
  const dt=Math.min((now-last)/1000,.05);last=now;
  if(!visible || document.hidden)return;
  if(!reducedMotion.matches)angle+=dt*.013;
  ctx.setTransform(ratio,0,0,ratio,0,0); ctx.clearRect(0,0,size,size);
  const r=size*.43;
  const gradient=ctx.createRadialGradient(size*.34,size*.3,r*.05,size*.55,size*.58,r);
  gradient.addColorStop(0,'#23172f');gradient.addColorStop(.7,'#140d20');gradient.addColorStop(1,'#0c0712');
  ctx.beginPath();ctx.arc(size/2,size/2,r,0,Math.PI*2);ctx.fillStyle=gradient;ctx.fill();ctx.strokeStyle='#7d609c30';ctx.lineWidth=1;ctx.stroke();
  // Fine latitude and longitude circles make the silhouette readable even if map data fails.
  for(let lat=-60;lat<=60;lat+=30)line(Array.from({length:181},(_,i)=>[-180+i*2,lat]),r,angle,'#ccc1ef0c',.7);
  for(let lon=-180;lon<180;lon+=30)line(Array.from({length:91},(_,i)=>[lon,-90+i*2]),r,angle,'#ccc1ef0c',.7);
  if(land) for(const f of land.features) {
   const polygons=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];
   for(const polygon of polygons)for(const ring of polygon){
    // Small rings can be filled when entirely on the front hemisphere; large clipped coastlines remain outlined.
    const pts=ring.map(([lon,lat])=>project(lon,lat,r,angle));
    if(pts.every(p=>p[2]>0)){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle='#9d83ba55';ctx.fill();}
    line(ring,r,angle,'#b29acb70',.7);
   }
  }
  const destination=[-88.2073,40.1106];
  for(const origin of [[-118,34],[-74,41],[-0.1,51],[72.8,19],[103.8,1.3]]) {
   const points=[];
   // A lifted spherical arc; these are illustrative routes, not a participant map.
   const toVec=([lo,la])=>[Math.cos(la*rad)*Math.cos(lo*rad),Math.cos(la*rad)*Math.sin(lo*rad),Math.sin(la*rad)];
   const a=toVec(origin),b=toVec(destination);
   const omega=Math.acos(Math.max(-1,Math.min(1,a.reduce((sum,v,i)=>sum+v*b[i],0))));
   let previous=false;ctx.beginPath();
   for(let i=0;i<=64;i++){const t=i/64,s=Math.sin(omega)||1;const v=a.map((x,j)=>(Math.sin((1-t)*omega)*x+Math.sin(t*omega)*b[j])/s);const lon=Math.atan2(v[1],v[0])/rad,lat=Math.atan2(v[2],Math.hypot(v[0],v[1]))/rad;const [x,y,z]=project(lon,lat,r*(1+.16*Math.sin(t*Math.PI)),angle);if(z>0){previous?ctx.lineTo(x,y):ctx.moveTo(x,y);previous=true;}else previous=false;}
   ctx.strokeStyle='#b6a0ce55';ctx.lineWidth=.8;ctx.stroke();
  }
  const [dx,dy,dz]=project(...destination,r,angle);
  if(label){
   label.hidden=dz<=0;
   label.style.setProperty('--globe-label-x',`${canvas.offsetLeft-canvas.clientWidth/2+dx}px`);
   label.style.setProperty('--globe-label-y',`${canvas.offsetTop+dy}px`);
  }
  if(dz>0){ctx.beginPath();ctx.arc(dx,dy,2.7,0,Math.PI*2);ctx.fillStyle='#e4d8fa';ctx.shadowColor='#ccc1ef';ctx.shadowBlur=15;ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(dx,dy,8,0,Math.PI*2);ctx.strokeStyle='#ccc1ef66';ctx.stroke();}
 }
 frame=requestAnimationFrame(draw);
 return ()=>{cancelAnimationFrame(frame);observer.disconnect();removeEventListener('resize',resize);};
}
