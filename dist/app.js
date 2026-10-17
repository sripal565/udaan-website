import {clamp, between, smooth, heroFrame, flightFrame, arrivalFrame, loopFrame} from './motion.js';
import {startGlobe} from './globe.js';
const $ = selector => document.querySelector(selector);
const reducedQuery=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=reducedQuery.matches;
document.documentElement.classList.add('js-ready');
const hero=$('.hero-track'),about=$('.about'),flight=$('.flight-track'),arrival=$('.arrival-track'),header=$('.header'),cta=$('.floating-cta');
const set=(el,name,value)=>el.style.setProperty(name,value);
const progress=el=>clamp(-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight));
// Wrap words without changing the accessible reading order.
const manifesto=$('.manifesto');
const lines=manifesto.innerHTML.split(/<br\s*\/?>/i);
manifesto.innerHTML=lines.map(line=>line.split(' ').map(word=>`<span class="word">${word}</span>`).join(' ')).join('<br>');
const words=[...manifesto.querySelectorAll('.word')];
let pending=false;
function updateScroll(){
 pending=false;
 const h=heroFrame(progress(hero));
 if(!reduced){set(hero,'--window-scale',h.scale);set(hero,'--window-opacity',h.opacity);set(hero,'--hero-opacity',h.copy);set(hero,'--hero-y',`${h.y}px`);}
 const intro=about.getBoundingClientRect();
 set($('.voyage'),'--shade',clamp((innerHeight-intro.top)/(innerHeight*.9))*.8);
 const reveal=clamp((innerHeight*.82-manifesto.getBoundingClientRect().top)/(innerHeight*.65));
 words.forEach((word,i)=>word.classList.toggle('revealed',reduced||reveal>i/words.length));
 const f=flightFrame(progress(flight));
 if(!reduced){set(flight,'--plane-y',`${f.y}vh`);set(flight,'--plane-scale',f.scale);set(flight,'--plane-opacity',f.plane);set(flight,'--title-opacity',f.title);set(flight,'--spec-opacity',f.spec);set(flight,'--spec-y',`${(1-f.spec)*25}px`);}
 const a=arrivalFrame(progress(arrival));
 if(!reduced){set(arrival,'--pass-y',`${a.passY}vh`);set(arrival,'--pass-opacity',a.passOpacity);set(arrival,'--pass-rotate',`${-6+progress(arrival)*12}deg`);set(arrival,'--footer-opacity',a.footer);set(arrival,'--footer-y',`${(1-a.footer)*30}px`);set(arrival,'--global-y',`${-progress(arrival)*40}px`);set(arrival,'--label-opacity',1-a.footer);}
 const at=flight.getBoundingClientRect(), experience=$('.experience').getBoundingClientRect();
 header.classList.toggle('ink',(at.top<70&&at.bottom>70)||(experience.top<70&&experience.bottom>70));
 const footerVisible=reduced?$('.footer').getBoundingClientRect().top<innerHeight*.85:a.footer>.65;
 cta.classList.toggle('at-footer',footerVisible);
 cta.tabIndex=footerVisible?-1:0;
 $('.footer').inert=reduced?false:a.footer<.9;
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(updateScroll);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);updateScroll();
// Native dialog provides focus trapping, Escape handling, and inert background content.
const menu=$('#menu'),menuToggle=$('.menu-toggle');
function closeMenu(){menu.close();document.body.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus({preventScroll:true});}
menuToggle.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');menuToggle.setAttribute('aria-expanded','true');});
$('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('cancel',()=>{document.body.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');});
menu.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{closeMenu();}));
const posters=['THE<br>STAGE<br>IS YOURS.','FIND<br>YOUR<br>PEOPLE.','FUEL<br>THE<br>FLIGHT.'];
const items=[...document.querySelectorAll('.experience-item')];
items.forEach((item,index)=>item.querySelector('button').addEventListener('click',()=>{
 const opening=item.querySelector('button').getAttribute('aria-expanded')!=='true';
 items.forEach((other,i)=>{const active=i===index&&opening;other.classList.toggle('is-open',active);other.querySelector('button').setAttribute('aria-expanded',String(active));other.querySelector('.plus').textContent=active?'−':'+';other.querySelector('.accordion-panel').hidden=!active;});
 if(opening){$('.experience-art').dataset.scene=String(index);$('.art-type').innerHTML=posters[index];}
 schedule();
}));
// Two forward-only decoders overlap for 0.8 source seconds. The next clip starts at zero
// while the current clip finishes; swapping layers avoids a hard backward cut.
const videos=[$('.video-a'),$('.video-b')];
let active=0,blending=false,mediaVisible=true;
const overlap=.8;
function playSafe(video){const playing=video.play();if(playing)playing.catch(()=>{});}
function resetVideos(){videos.forEach(v=>{v.pause();v.currentTime=0;v.style.opacity='0';});active=0;blending=false;}
function startVideos(){if(reduced||document.hidden||!mediaVisible)return;videos[active].style.opacity='1';playSafe(videos[active]);if(blending)playSafe(videos[1-active]);}
function tickVideo(){
 const current=videos[active],next=videos[1-active];
 if(!reduced&&!document.hidden&&mediaVisible&&Number.isFinite(current.duration)){
  const frame=loopFrame(current.duration,current.currentTime,overlap);
  if(!blending&&frame.startNext&&next.readyState>=2){next.currentTime=0;playSafe(next);blending=true;}
  if(blending){const blend=frame.blend;current.style.opacity=String(active===0?1:1-blend);next.style.opacity=String(active===0?blend:1);if(frame.swap||current.ended){current.pause();current.currentTime=0;current.style.opacity='0';active=1-active;videos[active].style.opacity='1';blending=false;}}
  else if(current.ended){current.currentTime=0;playSafe(current);}
 }
 requestAnimationFrame(tickVideo);
}
videos.forEach(v=>{v.muted=true;v.playbackRate=.5;v.addEventListener('loadeddata',startVideos,{once:true});});
const videoObserver=new IntersectionObserver(([entry])=>{mediaVisible=entry.isIntersecting;if(mediaVisible)startVideos();else videos.forEach(v=>v.pause());},{threshold:0});videoObserver.observe($('.voyage'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());else startVideos();});
reducedQuery.addEventListener('change',()=>{reduced=reducedQuery.matches;resetVideos();if(!reduced)startVideos();schedule();});
startVideos();requestAnimationFrame(tickVideo);
// Pointer interactions enhance the page, without intercepting native scrolling.
if(matchMedia('(pointer:fine)').matches&&!reduced){
 const cursor=$('.cursor');let x=-100,y=-100,cx=-100,cy=-100,inside=false;
 addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;inside=true;cursor.style.opacity='1';cursor.classList.toggle('hovering',!!e.target.closest('a,button'));},{passive:true});
 document.addEventListener('pointerleave',()=>{inside=false;cursor.style.opacity='0';});
 const magnetic=$('.magnetic');
 magnetic.addEventListener('pointermove',e=>{const r=magnetic.getBoundingClientRect();magnetic.style.translate=`${(e.clientX-r.left-r.width/2)*.12}px ${(e.clientY-r.top-r.height/2)*.16}px`;});
 magnetic.addEventListener('pointerleave',()=>{magnetic.style.translate='0 0';});
 function pointerFrame(){if(inside){cx+=(x-cx)*.2;cy+=(y-cy)*.2;cursor.style.left=`${cx}px`;cursor.style.top=`${cy}px`;}requestAnimationFrame(pointerFrame);}requestAnimationFrame(pointerFrame);
}
function clock(){ $('#local-time').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());}
clock();setInterval(clock,30000);$('#year').textContent=new Date().getFullYear();
startGlobe($('#globe'),reducedQuery);
