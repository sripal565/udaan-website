import {advanceCloudTime,cloudFrame} from './motion.js?v=7';

// One untouched photograph, with the same continuous depth field approved in the study.
// Rigid forward travel carries the photograph; depth relief stays bounded to prevent cumulative shearing.
export function startClouds(canvas, reducedMotion) {
 const container=canvas.closest('.voyage');
 let gl,program,texture,uniforms,ready=false,failed=false,visible=true;
 let elapsed=0,last=0,frame=0,dirty=true;
 const vertex='attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}';
 const fragment=`precision highp float;
 varying vec2 v_uv;
 uniform sampler2D u_image;
 uniform vec2 u_resolution;
 uniform vec3 u_motion;
 void main(){
  vec2 screen=vec2(v_uv.x,1.-v_uv.y);
  float screenAspect=u_resolution.x/u_resolution.y;
  float imageAspect=3.;
  vec2 crop=vec2(min(1.,screenAspect/imageAspect),min(1.,imageAspect/screenAspect));
  vec2 uv=vec2(.5)+(screen-vec2(.5))*crop;
  float horizon=.43;
  float below=max(0.,uv.y-horizon)/(1.-horizon);
  float depth=pow(clamp(below,0.,1.),1.65);
  float expansion=u_motion.z*depth;
  uv.x=.5+(uv.x-.5)/(1.+expansion)+u_motion.x+u_motion.y*depth;
  uv.y=horizon+(uv.y-horizon)/(1.+expansion*.8);
  gl_FragColor=texture2D(u_image,vec2(fract(uv.x),clamp(uv.y,.001,.999)));
 }`;
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 function fallback(){failed=true;ready=false;stop();canvas.classList.remove('is-ready');canvas.parentElement.classList.remove('has-cloud-canvas');canvas.dataset.renderer='css';}
 function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error('Cloud shader compilation failed');return shader;}
 function resize(){
  if(!ready)return;
  const bounds=canvas.parentElement.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,matchMedia('(max-width:700px)').matches?1.5:2);
  canvas.width=Math.max(1,Math.round(bounds.width*ratio));canvas.height=Math.max(1,Math.round(bounds.height*ratio));
  gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);dirty=true;wake();
 }
 function draw(now){
  frame=0;
  if(!ready||failed||!visible||document.hidden||reducedMotion.matches){last=0;return;}
  const previous=elapsed;
  elapsed=advanceCloudTime(elapsed,last?(now-last)/1000:0,true);last=now;
  if(dirty||elapsed!==previous){const motion=cloudFrame(elapsed);gl.uniform3f(uniforms.motion,motion.drift,motion.relief,motion.expansion);gl.drawArrays(gl.TRIANGLES,0,6);dirty=false;canvas.classList.add('is-ready');canvas.parentElement.classList.add('has-cloud-canvas');canvas.dataset.renderer='webgl';canvas.dataset.motionTime=elapsed.toFixed(2);}
  frame=requestAnimationFrame(draw);
 }
 function wake(){if(ready&&!failed&&visible&&!document.hidden&&!reducedMotion.matches&&!frame){last=0;frame=requestAnimationFrame(draw);}}
 async function initialize(){
  if(ready||failed||gl||reducedMotion.matches)return;
  gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
  if(!gl){fallback();return;}
  try{
   program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Cloud shader linking failed');gl.useProgram(program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
   const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
   const image=new Image();image.src='assets/cloud-perspective.png';await image.decode();
   if(failed)return;
   if(image.naturalWidth>gl.getParameter(gl.MAX_TEXTURE_SIZE))throw new Error('Cloud texture exceeds device limit');
   texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   uniforms={resolution:gl.getUniformLocation(program,'u_resolution'),motion:gl.getUniformLocation(program,'u_motion')};
   ready=true;resize();
  }catch{fallback();}
 }
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){initialize();wake();}else stop();});observer.observe(container);
 const onVisibility=()=>document.hidden?stop():wake();
 const onPreference=()=>{if(reducedMotion.matches){stop();canvas.classList.remove('is-ready');canvas.parentElement.classList.remove('has-cloud-canvas');}else{dirty=true;initialize();resize();wake();}};
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();});
 addEventListener('resize',resize);document.addEventListener('visibilitychange',onVisibility);reducedMotion.addEventListener('change',onPreference);
 initialize();
 return ()=>{stop();observer.disconnect();removeEventListener('resize',resize);document.removeEventListener('visibilitychange',onVisibility);reducedMotion.removeEventListener('change',onPreference);if(gl&&!failed){gl.deleteTexture(texture);gl.deleteProgram(program);}};
}
