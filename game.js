'use strict';
/* Kelly's Giraffe Adventure Vol. 5: Midnight Zoo Escape - original synthesized night-time score + SFX (WebAudio, no samples) */
const AU=(function(){
const A={ctx:null,muted:false,cur:null,next:0,step:0,timer:null,song:null};
const mf=m=>440*Math.pow(2,(m-69)/12);
function imp(c,sec,dec){const r=c.sampleRate,n=r*sec|0,b=c.createBuffer(2,n,r);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dec)}return b}
A.init=function(){if(this.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=this.ctx=new C();
 this.master=c.createGain();this.master.gain.value=this.muted?0:0.8;const comp=c.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=3.5;
 this.master.connect(comp);comp.connect(c.destination);
 this.rev=c.createConvolver();this.rev.buffer=imp(c,1.8,2.6);const rg=c.createGain();rg.gain.value=0.22;this.rev.connect(rg);rg.connect(this.master);
 this.mus=c.createGain();this.mus.gain.value=0.42;this.mus.connect(this.master);const mr=c.createGain();mr.gain.value=0.5;this.mus.connect(mr);mr.connect(this.rev);
 this.sfx=c.createGain();this.sfx.gain.value=0.8;this.sfx.connect(this.master);
 const n=c.sampleRate;this.noise=c.createBuffer(1,n,n);const d=this.noise.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1}catch(e){this.ctx=null}};
A.unlock=function(){this.init();if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume().catch(()=>{})};
A.setMuted=function(m){this.muted=m;if(this.master)this.master.gain.setTargetAtTime(m?0:0.8,this.ctx.currentTime,0.05)};
/* --- voices --- */
function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
function osc(type,f,t,dur,peak,out,a=0.004){const c=A.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);env(g,t,a,peak,dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+a+dur+0.05);return o}
function marimba(m,t,v,out){const f=mf(m);osc('sine',f,t,0.45,0.32*v,out);osc('sine',f*4,t,0.08,0.09*v,out);osc('triangle',f*2,t,0.16,0.06*v,out)}
function kalimba(m,t,v,out){const f=mf(m);osc('sine',f,t,0.9,0.22*v,out,0.002);osc('sine',f*5.4,t,0.05,0.05*v,out)}
function bass(m,t,d,v,out){const c=A.ctx,o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(m);fl.type='lowpass';fl.frequency.setValueAtTime(900,t);fl.frequency.exponentialRampToValueAtTime(180,t+d);env(g,t,0.01,0.28*v,d);o.connect(fl);fl.connect(g);g.connect(out);o.start(t);o.stop(t+d+0.1)}
function pad(m,t,d,v,out){const c=A.ctx;for(const det of[-7,7]){const o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(m);o.detune.value=det;fl.type='lowpass';fl.frequency.value=1100;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.035*v,t+d*0.3);g.gain.linearRampToValueAtTime(0.0001,t+d);o.connect(fl);fl.connect(g);g.connect(out);o.start(t);o.stop(t+d+0.05)}}
function drum(t,f0,f1,d,v,out){const c=A.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);env(g,t,0.002,0.7*v,d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+0.05)}
function nz(t,d,v,fq,type,out,q=1){const c=A.ctx,s=c.createBufferSource(),g=c.createGain(),fl=c.createBiquadFilter();s.buffer=A.noise;fl.type=type||'highpass';fl.frequency.value=fq||6000;fl.Q.value=q;env(g,t,0.002,v,d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t,Math.random()*0.5);s.stop(t+d+0.05)}
/* --- songs: tempo, scale root, chords (semitone offsets from root), lead pattern seed, groove --- */
const SONGS={
 title:{bpm:92,root:62,ch:[[0,3,7],[-4,0,3],[-2,2,5],[-5,-1,2]],seed:1531,lead:'kal',gr:'soft'},
 w1:{bpm:112,root:64,ch:[[0,4,7],[-3,0,4],[5,9,12],[7,11,14]],seed:2211,lead:'kal',gr:'afro'},
 w2:{bpm:106,root:60,ch:[[0,4,7],[5,9,12],[-3,0,4],[7,11,14]],seed:3307,lead:'mar',gr:'afro'},
 w3:{bpm:100,root:67,ch:[[0,3,7],[-4,0,3],[-2,2,5],[0,3,7]],seed:4401,lead:'kal',gr:'soft'},
 w4:{bpm:118,root:62,ch:[[0,4,7],[-5,-1,2],[-3,0,4],[5,9,12]],seed:5509,lead:'mar',gr:'jungle'},
 w5:{bpm:126,root:65,ch:[[0,4,7],[5,9,12],[-3,0,4],[7,11,14]],seed:6613,lead:'kal',gr:'afro'},
 boss:{bpm:142,root:57,ch:[[0,3,7],[0,3,7],[1,5,8],[-1,3,6]],seed:7719,lead:'mar',gr:'boss'},
 win:{bpm:120,root:64,ch:[[0,4,7],[5,9,12],[7,11,14],[0,4,7]],seed:8811,lead:'kal',gr:'afro'},
 /* Happy Birthday (traditional, public domain) as a kalimba music box in 3/4; one step = an 8th note */
 bday:{bpm:50,root:65,len:6,start:46,ch:[[0,4,7],[-5,-1,2],[-5,-1,2],[0,4,7],[0,4,7],[5,9,12],[-5,-1,2],[0,4,7]],
  notes:[[-3,2],[-5,2],[0,2],[-1,4],[-5,1],[-5,1],[-3,2],[-5,2],[2,2],[0,4],[-5,1],[-5,1],[7,2],[4,2],[0,2],[-1,2],[-3,2],[5,1],[5,1],[4,2],[0,2],[2,2],[0,4],[-5,1],[-5,1]],lead:'kal',gr:'waltz'}};
for(const k in SONGS){const S=SONGS[k];if(S.notes){S.tune=[];for(const[n,d]of S.notes){S.tune.push(n);for(let i=1;i<d;i++)S.tune.push(null)}}}
function rngS(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function mkLead(S){const r=rngS(S.seed),bars=[];const pent=[0,2,4,7,9,12,14,16];for(let b=0;b<4;b++){const n=[];let p=2+(r()*3|0);for(let i=0;i<16;i++){const on=(i%4===0)||(r()<(i%2?0.28:0.55));if(on){p=Math.max(0,Math.min(7,p+((r()*5|0)-2)));n.push(pent[p])}else n.push(null)}bars.push(n)}return bars}
for(const k in SONGS)if(!SONGS[k].tune)SONGS[k].mel=mkLead(SONGS[k]);
function tick(){const c=A.ctx;if(!c||!A.song)return;const S=A.song,sp=60/S.bpm/4;
 if(S.tune){while(A.next<c.currentTime+0.15){const t=A.next,n=S.tune.length,st=A.step%n,i=st%S.len,bar=(st/S.len)|0,ch=S.ch[bar%S.ch.length],R=S.root,out=A.mus;
  if(i===0){pad(R+ch[0],t,sp*6,0.8,out);pad(R+ch[1],t,sp*6,0.6,out);pad(R+ch[2],t,sp*6,0.6,out);bass(R-24+ch[0],t,sp*1.8,0.8,out)}
  if(i===2||i===4){marimba(R+ch[1],t,0.28,out);marimba(R+ch[2],t,0.24,out)}
  const m=S.tune[st];if(m!==null&&m!==undefined){kalimba(R+12+m,t,1,out);kalimba(R+24+m,t+0.002,0.35,out);marimba(R+m,t,0.35,out)}
  if(i===0)drum(t,110,50,0.25,0.35,out);
  A.next+=sp;A.step++}return}
 while(A.next<c.currentTime+0.15){const t=A.next,i=A.step%16,bar=(A.step>>4)%4,ch=S.ch[bar],R=S.root,out=A.mus,big=(A.step>>6)%2;
  if(i===0){pad(R+ch[0],t,sp*16,1,out);pad(R+ch[1],t,sp*16,0.8,out);pad(R+ch[2],t,sp*16,0.7,out)}
  if(i%4===0||(S.gr!=='soft'&&i===10))bass(R-24+ch[i===8?2:0],t,sp*(i===10?1.5:3),1,out);
  const m=S.mel[bar][i];if(m!==null&&(S.gr!=='soft'||i%2===0)){const mm=R+12+m;(S.lead==='kal'?kalimba:marimba)(mm,t,big?1:0.85,out);if(big&&i%8===0)kalimba(mm+12,t+sp*0.5,0.5,out)}
  if(i%2===1&&S.gr!=='soft')marimba(R+ch[(i>>1)%3]+12,t,0.35,out);
  if(S.gr==='afro'){if(i===0||i===6||i===10)drum(t,150,55,0.22,0.9,out);if(i===4||i===12)drum(t,340,180,0.12,0.6,out);nz(t,0.04,i%2?0.05:0.09,7000,'highpass',out)}
  else if(S.gr==='jungle'){if(i%4===0||i===14)drum(t,130,48,0.25,1,out);if(i===3||i===7||i===11)drum(t,420,260,0.09,0.55,out);nz(t,0.05,i%4===2?0.12:0.05,5000,'bandpass',out,2)}
  else if(S.gr==='boss'){if(i%4===0||i===6)drum(t,120,40,0.3,1.1,out);if(i===4||i===12)nz(t,0.14,0.28,1800,'bandpass',out,0.8);nz(t,0.03,0.06,8000,'highpass',out)}
  else{if(i===0||i===8)drum(t,110,50,0.3,0.55,out);if(i%4===2)nz(t,0.06,0.04,6500,'highpass',out)}
  A.next+=sp;A.step++}}
A.music=function(name){this.init();if(!this.ctx)return;if(this.cur===name)return;this.cur=name;this.song=SONGS[name]||null;this.step=this.song&&this.song.start||0;this.next=this.ctx.currentTime+0.08;
 if(!this.timer)this.timer=setInterval(tick,40)};
A.stop=function(){this.cur=null;this.song=null};
const FX={
 jump(t,o){osc('square',380,t,0.09,0.08,o).frequency.exponentialRampToValueAtTime(760,t+0.09)},
 land(t,o){drum(t,120,60,0.08,0.35,o)},
 punch(t,o){nz(t,0.06,0.3,1400,'bandpass',o,1.5);drum(t,200,90,0.07,0.5,o)},
 kick(t,o){nz(t,0.09,0.35,900,'bandpass',o,1.2);drum(t,170,60,0.12,0.7,o)},
 bonk(t,o){drum(t,500,220,0.08,0.6,o);marimba(79,t,0.6,o)},
 ram(t,o){nz(t,0.25,0.3,700,'lowpass',o);osc('sawtooth',140,t,0.22,0.12,o).frequency.exponentialRampToValueAtTime(70,t+0.22)},
 pound(t,o){drum(t,90,30,0.4,1.1,o);nz(t,0.3,0.3,500,'lowpass',o)},
 tongue(t,o){osc('sine',300,t,0.14,0.2,o).frequency.exponentialRampToValueAtTime(900,t+0.12)},
 slurp(t,o){osc('sine',900,t,0.18,0.18,o).frequency.exponentialRampToValueAtTime(250,t+0.18);nz(t,0.1,0.06,3000,'bandpass',o,3)},
 gem(t,o){kalimba(88,t,0.9,o);kalimba(95,t+0.05,0.7,o)},
 star(t,o){[84,88,91,96,100].forEach((m,i)=>kalimba(m,t+i*0.06,0.9,o))},
 heart(t,o){[76,81,84].forEach((m,i)=>marimba(m,t+i*0.07,0.9,o))},
 hurt(t,o){osc('square',300,t,0.25,0.12,o).frequency.exponentialRampToValueAtTime(90,t+0.25);nz(t,0.1,0.15,1500,'bandpass',o)},
 kill(t,o){drum(t,600,120,0.12,0.6,o);kalimba(84,t+0.03,0.6,o)},
 hit(t,o){drum(t,200,70,0.2,1,o);nz(t,0.18,0.35,1200,'bandpass',o,0.8)},
 roar(t,o){const x=osc('sawtooth',110,t,0.7,0.16,o,0.05);x.frequency.linearRampToValueAtTime(70,t+0.7);nz(t,0.7,0.2,600,'bandpass',o,0.7)},
 laugh(t,o){for(let i=0;i<5;i++)osc('square',520-i*30,t+i*0.09,0.06,0.07,o)},
 cp(t,o){[72,76,79,84].forEach((m,i)=>marimba(m,t+i*0.08,0.8,o))},
 swing(t,o){nz(t,0.2,0.12,2500,'bandpass',o,1)},
 grab(t,o){marimba(91,t,0.7,o);drum(t,700,500,0.04,0.3,o)},
 crack(t,o){nz(t,0.22,0.4,1800,'bandpass',o,0.7);drum(t,160,50,0.2,0.7,o)},
 splash(t,o){nz(t,0.4,0.3,1200,'lowpass',o)},
 throw(t,o){nz(t,0.12,0.12,3000,'bandpass',o,2)},
 menu(t,o){marimba(84,t,0.5,o)},
 clear(t,o){[72,76,79,84,79,84,88].forEach((m,i)=>marimba(m,t+i*0.1,1,o))},
 over(t,o){[67,63,60,55].forEach((m,i)=>marimba(m,t+i*0.18,1,o))},
 free(t,o){[72,79,84,88,91,96].forEach((m,i)=>kalimba(m,t+i*0.08,1,o))},
 life(t,o){[79,84,88,91,96].forEach((m,i)=>marimba(m,t+i*0.06,1,o))}};
A.fx=function(n){if(typeof SIM!=='undefined'&&SIM||!this.ctx||this.muted)return;const f=FX[n];if(f)try{f(this.ctx.currentTime+0.005,this.sfx)}catch(e){}};
return A})();

/* ===== core: canvas, layout, input (touch / keys / gamepad), art, helpers ===== */
const $=id=>document.getElementById(id);
const cv=$('cv'),c=cv.getContext('2d');
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rand=(a,b)=>a+Math.random()*(b-a),sgn=v=>v<0?-1:1;
const TS=40,VH=400,GRAV=2200;
const QS=new URLSearchParams(location.search);
const SAVE_KEY='kga5_save';let save={};try{save=JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')||{}}catch(e){save={}}
save.reached=save.reached||0;save.stars=save.stars||{};save.best=save.best||0;
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save))}catch(e){}}
AU.muted=!!save.muted;
let W=0,H=0,DPR=1,S=1,VV=400,viewW=800,gameH=400,portrait=false,SAFE={t:0,r:0,b:0,l:0};
let state='boot',G=null,frame=0,SIM=0;
function readSafe(){const p=$('sp');if(!p)return;const cs=getComputedStyle(p);SAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0}}
function resize(){W=innerWidth;H=Math.round(window.visualViewport?Math.min(innerHeight,visualViewport.height):innerHeight);DPR=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);portrait=H>W*1.08;readSafe();
 if(portrait){const vw=clamp(W,380,470);S=W/vw;gameH=Math.round(H*0.62);VV=gameH/S}
 else{VV=VH;S=H/VH;gameH=H}
 viewW=W/S;layoutPad();document.body.classList.toggle('portrait',portrait)}
let PADR={act:null,jump:null};
function layoutPad(){const pad=$('pad'),ba=$('bAct'),bj=$('bJump'),hint=$('swipeHint');if(!pad)return;
 /* NES-style pair (Peter, Oct 31 2026): ACTION (green, left) and JUMP (orange, right) side by side at the bottom right,
    level with each other, both the size of Vol 2's green ACTION button; always above the iPhone home bar / Safari toolbar */
 if(portrait){const top=gameH,ph=H-top;pad.style.top=top+'px';pad.style.height=ph+'px';
  const big=Math.round(clamp(ph*0.36,92,124)),sz=Math.round(big*0.84),gap=Math.round(sz*0.2);let bot=Math.round(clamp(ph*0.14,18,46))+SAFE.b;
  if(bot+sz>ph-8)bot=Math.max(SAFE.b+6,ph-sz-8);
  Object.assign(bj.style,{width:sz+'px',height:sz+'px',left:'',right:(16+SAFE.r)+'px',bottom:bot+'px'});
  Object.assign(ba.style,{width:sz+'px',height:sz+'px',left:'',right:(16+SAFE.r+sz+gap)+'px',bottom:bot+'px'});
  hint.style.display='';Object.assign(hint.style,{top:'12px',left:(14+SAFE.l)+'px',right:(16+SAFE.r+sz*2+gap+12)+'px'})}
 else{pad.style.top='0';pad.style.height=H+'px';const big=Math.round(clamp(H*0.21,72,96)),sz=Math.round(big*0.82),gap=Math.round(sz*0.18),bot=12+SAFE.b;
  Object.assign(bj.style,{width:sz+'px',height:sz+'px',left:'',right:(14+SAFE.r)+'px',bottom:bot+'px'});
  Object.assign(ba.style,{width:sz+'px',height:sz+'px',left:'',right:(14+SAFE.r+sz+gap)+'px',bottom:bot+'px'});
  hint.style.display='none'}
 requestAnimationFrame(()=>{const r=e=>{const b=e.getBoundingClientRect();return{x:b.left,y:b.top,w:b.width,h:b.height}};PADR.act=r(ba);PADR.jump=r(bj)})}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,120));
if(window.visualViewport)visualViewport.addEventListener('resize',resize);
/* ---------- input ---------- */
const K={L:0,R:0,U:0,D:0,J:0,A:0,Y:0};const KP={J:0,A:0,Y:0};const VIRT={jump:0,act:0},VIRTP={jump:0,act:0};const TOUCH=new Map();let swipeJump=0;
const inp={L:0,R:0,U:0,D:0,jumpP:0,jump:0,actP:0,act:0,ramP:0};let lastJ=0,lastA=0,lastY=0;
const KEYMAP={ArrowLeft:'L',KeyA:'L',ArrowRight:'R',KeyD:'R',ArrowUp:'U',KeyW:'U',ArrowDown:'D',KeyS:'D',Space:'J',KeyZ:'J',KeyX:'A',KeyJ:'A',KeyC:'Y',KeyK:'Y'};
addEventListener('keydown',e=>{AU.unlock();if(e.target&&e.target.tagName==='INPUT')return;const k=KEYMAP[e.code];
 if(document.body.classList.contains('uiopen')){if(!e.repeat)uiKey(e);if(k||e.code==='Enter')e.preventDefault();return}
 if(k){if(!K[k]&&k in KP)KP[k]=1;K[k]=1;e.preventDefault()}
 if(e.code==='KeyP'||e.code==='Escape'){if(state==='play')pauseGame()}
 if(e.code==='KeyM')toggleMute()});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)K[k]=0});
function swipeDir(t){const dx=t.x-t.ax,dy=t.y-t.ay,d=Math.hypot(dx,dy),o={};if(d<14)return o;if(d>44){t.ax=t.x-dx/d*44;t.ay=t.y-dy/d*44}
 const s=Math.round(Math.atan2(dy,dx)/(Math.PI/4));if(s===0||s===1||s===-1)o.R=1;if(s===4||s===-4||s===3||s===-3)o.L=1;if(s===2||s===1||s===3)o.D=1;if(s===-2||s===-1||s===-3)o.U=1;return o}
function tStart(id,x,y){AU.unlock();TOUCH.set(id,{x,y,ax:x,ay:y,z:{}})}
function tMove(id,x,y){const t=TOUCH.get(id);if(!t)return;t.x=x;t.y=y;const before=t.z.U;t.z=swipeDir(t);if(t.z.U&&!before)swipeJump=1}
function tEnd(id){TOUCH.delete(id)}
function clearInput(){TOUCH.clear();for(const k in K)K[k]=0;for(const k in KP)KP[k]=0;VIRT.jump=VIRT.act=VIRTP.jump=VIRTP.act=0;swipeJump=0;document.querySelectorAll('#pad .big.on').forEach(b=>b.classList.remove('on'))}
function bindSurface(el){el.addEventListener('touchstart',e=>{if(state!=='play')return;e.preventDefault();for(const t of e.changedTouches)tStart(t.identifier,t.clientX,t.clientY)},{passive:false});
 el.addEventListener('touchmove',e=>{if(state!=='play')return;e.preventDefault();for(const t of e.changedTouches)tMove(t.identifier,t.clientX,t.clientY)},{passive:false});
 el.addEventListener('touchend',e=>{for(const t of e.changedTouches)tEnd(t.identifier)},{passive:false});el.addEventListener('touchcancel',e=>{for(const t of e.changedTouches)tEnd(t.identifier)});
 let md=false;el.addEventListener('mousedown',e=>{if(state!=='play')return;md=true;tStart('m',e.clientX,e.clientY)});addEventListener('mousemove',e=>{if(md)tMove('m',e.clientX,e.clientY)});addEventListener('mouseup',()=>{if(md){md=false;tEnd('m')}})}
function bindBtn(el,k){const on=e=>{e.preventDefault();e.stopPropagation();AU.unlock();if(!VIRT[k])VIRTP[k]=1;VIRT[k]=1;el.classList.add('on')},off=e=>{e.preventDefault();e.stopPropagation();VIRT[k]=0;el.classList.remove('on')};
 el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off,{passive:false});el.addEventListener('touchcancel',off,{passive:false});
 el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);el.addEventListener('contextmenu',e=>e.preventDefault())}
addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(state==='play')pauseGame()}});
/* ---------- gamepad (standard mapping; USB or Bluetooth, desktop or phone) ---------- */
const GP={on:false,L:0,R:0,U:0,D:0,J:0,A:0,Y:0,id:'',prev:{}};let gpIdx=0,gpSeen=false;
function pollPad(){let pads=[];try{pads=navigator.getGamepads?navigator.getGamepads():[]}catch(e){}let p=null;for(const q of pads||[])if(q&&q.connected!==false&&q.buttons&&q.buttons.length){p=q;break}
 if(!p){if(GP.on){GP.on=false;toast('Controller disconnected')}GP.L=GP.R=GP.U=GP.D=GP.J=GP.A=GP.Y=0;return}
 if(!GP.on){GP.on=true;GP.id=p.id||'';if(!gpSeen){gpSeen=true}toast('🎮 Controller connected');refreshCtlHint()}
 const b=i=>!!(p.buttons[i]&&(p.buttons[i].pressed||p.buttons[i].value>0.5)),ax=i=>p.axes&&p.axes.length>i?p.axes[i]:0;
 const x=ax(0),y=ax(1);GP.L=b(14)||x<-0.4?1:0;GP.R=b(15)||x>0.4?1:0;GP.U=b(12)||y<-0.55?1:0;GP.D=b(13)||y>0.55?1:0;
 GP.J=b(0)?1:0;GP.A=(b(2)||b(1)||b(5)||b(7))?1:0;GP.Y=(b(3)||b(4)||b(6))?1:0;
 const now={st:b(9),bk:b(8),a:b(0),b:b(1),u:GP.U,d:GP.D,l:GP.L,r:GP.R},pr=GP.prev;const edge=k=>now[k]&&!pr[k];GP.prev=now;
 if(edge('st')){if(state==='play')pauseGame();else if(state==='pause')resumeGame()}
 if(edge('bk'))toggleMute();
 if(document.body.classList.contains('uiopen')){if(edge('u')||edge('l'))gpFocus(gpIdx-1);if(edge('d')||edge('r'))gpFocus(gpIdx+1);
  if(edge('a')){const t=document.querySelector('#ui .gpf')||document.querySelector('#ui [data-a]');if(t)t.click()}
  if(edge('b')){const bk=document.querySelector('#ui [data-a="back"],#ui [data-a="resume"]');if(bk)bk.click()}}}
addEventListener('gamepadconnected',()=>pollPad());
function gpFocus(i,ns){const bs=[...document.querySelectorAll('#ui [data-a]')];if(!bs.length)return;gpIdx=(i+bs.length)%bs.length;bs.forEach((b,j)=>b.classList.toggle('gpf',j===gpIdx));if(!ns){try{bs[gpIdx].scrollIntoView({block:'nearest'})}catch(e){}AU.fx('menu')}}
function uiKey(e){const nav={ArrowDown:1,ArrowRight:1,KeyS:1,KeyD:1,ArrowUp:-1,ArrowLeft:-1,KeyW:-1,KeyA:-1}[e.code];
 if(nav){gpFocus(gpIdx+(document.querySelector('#ui .gpf')?nav:0))}
 else if(e.code==='Enter'||e.code==='Space'||e.code==='KeyZ'){const t=document.querySelector('#ui .gpf')||document.querySelector('#ui [data-a]');if(t)t.click()}
 else if(e.code==='Escape'||e.code==='Backspace'||e.code==='KeyP'){const bk=document.querySelector('#ui [data-a="back"],#ui [data-a="resume"]');if(bk)bk.click()}}
function readInput(){pollPad();let L=K.L||GP.L,R=K.R||GP.R,U=K.U||GP.U,D=K.D||GP.D;for(const t of TOUCH.values()){if(t.z.L)L=1;if(t.z.R)R=1;if(t.z.U)U=1;if(t.z.D)D=1}
 if(window.__BOT&&G&&state==='play'){const b=botInput();L=b.L;R=b.R;U=b.U;D=b.D;b.J&&(KP.J=1);b.Jh&&(K.J=1);b.A&&(KP.A=1);b.Y&&(KP.Y=1);if(!b.Jh&&window.__BOTJ)K.J=0;window.__BOTJ=b.Jh}
 inp.L=L&&!R?1:0;inp.R=R&&!L?1:0;inp.U=U?1:0;inp.D=D?1:0;
 const j=!!(K.J||GP.J||VIRT.jump||VIRTP.jump||KP.J);inp.jumpP=((j&&!lastJ)||swipeJump||KP.J||VIRTP.jump)?1:0;inp.jump=j||swipeJump?1:0;lastJ=j;swipeJump=0;
 const a=!!(K.A||GP.A||VIRT.act||VIRTP.act||KP.A);inp.actP=(a&&!lastA)||KP.A||VIRTP.act?1:0;inp.act=a?1:0;lastA=a;
 const y=!!(K.Y||GP.Y||KP.Y);inp.ramP=(y&&!lastY)||KP.Y?1:0;lastY=y;
 VIRTP.jump=VIRTP.act=0;KP.J=KP.A=KP.Y=0}
/* ---------- art ---------- */
const IMG={},META={};
function loadArt(onp){return fetch('art/meta.json?v='+VERSION).then(r=>r.json()).then(m=>{Object.assign(META,m);const ns=Object.keys(m);let done=0;
 return Promise.all(ns.map(n=>new Promise(res=>{const im=new Image();im.onload=()=>{IMG[n]=im;done++;onp&&onp(done/ns.length);res()};im.onerror=()=>{done++;res()};im.src='art/'+n+'.webp?v='+VERSION})))}).catch(()=>{})}
/* draw sprite anchored bottom-center; art is authored at 2 image px per world unit */
function spr(n,x,y,sc=1,flip=false,alpha=1,rot=0,ay=1){const im=IMG[n];if(!im)return;const w=im.width*0.5*sc,h=im.height*0.5*sc;c.save();c.translate(x,y);if(rot)c.rotate(rot);if(flip)c.scale(-1,1);if(alpha<1)c.globalAlpha*=alpha;c.drawImage(im,-w/2,-h*ay,w,h);c.restore()}
function sprH(n,sc=1){const im=IMG[n];return im?im.height*0.5*sc:0}
const TINT={};function tinted(n,col){const k=n+col;if(TINT[k])return TINT[k];const im=IMG[n];if(!im)return null;const cc=document.createElement('canvas');cc.width=im.width;cc.height=im.height;const x=cc.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle=col;x.fillRect(0,0,cc.width,cc.height);return TINT[k]=cc}
function sprT(n,col,x,y,sc=1,flip=false,alpha=1){const im=tinted(n,col);if(!im)return;const w=im.width*0.5*sc,h=im.height*0.5*sc;c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.globalAlpha*=alpha;c.drawImage(im,-w/2,-h,w,h);c.restore()}
/* ---------- fx ---------- */
function P(o){if(SIM)return o;if(G.parts.length<420)G.parts.push(o);return o}
function burst(x,y,n,cols,sp=240,life=0.6,size=3,grav=600){for(let i=0;i<n;i++){const a=Math.random()*TAU,v=sp*(0.3+Math.random()*0.7);P({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*0.25,l:life*(0.5+Math.random()*0.7),m:life,s:size*(0.5+Math.random()),c:cols[i%cols.length],g:grav})}}
function dust(x,y,n=6,col='rgba(230,200,150,.8)'){for(let i=0;i<n;i++)P({x:x+rand(-12,12),y:y-rand(0,6),vx:rand(-60,60),vy:-rand(10,60),l:rand(0.35,0.7),m:0.7,s:rand(5,10),c:col,g:-30,puff:1})}
function ring(x,y,col,r=50,life=0.35,w=5){P({ring:1,x,y,l:life,m:life,s:r,c:col,w,vx:0,vy:0,g:0})}
function stars(x,y,n=6){burst(x,y,n,['#fff6a0','#ffd23a','#fff'],200,0.6,4,300)}
function ftxt(x,y,s,col='#fff',big=0){if(SIM)return;for(const t of G.texts)if(Math.abs(t.x-x)<120&&Math.abs(t.y-y)<26&&t.l>0.7)y-=26;G.texts.push({x,y,s,c:col,l:1.1,m:1.1,big})}
function shake(a){if(SIM)return;G.shake=Math.max(G.shake,a)}
function hitstop(t){if(SIM)return;G.hs=Math.max(G.hs,t)}
function flash(col,a=0.6){if(SIM)return;G.flash={c:col,a}}
let toastT=0;function toast(s,ms=1800){const t=$('toast');if(!t)return;t.textContent=s;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms)}
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const ovr=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
/* respawn fix (Oct 30): blinking pit falls are free; respawn backs up onto solid ground */
function rfOk(x,row,w){const a=Math.floor((x-w/2)/TS),b=Math.floor((x+w/2)/TS);for(let t=a;t<=b;t++){if(!solidK(tileAt(t,row)))return false;for(let r=1;r<=2;r++){const k=tileAt(t,row-r);if(solidK(k)||k===5||k===6)return false}}return true}
function rfBack(s,fx,w){const row=Math.floor((s.y+1)/TS),d=sgn(fx-s.x)||1;let ex=s.x;for(let i=0;i<80;i++){if(!rfOk(ex+d*4,row,w))break;ex+=d*4}const need=w*2,dist=Math.abs(ex-s.x);if(rfOk(s.x,row,w)&&dist>=need)return s.x;for(let k=Math.max(0,need-dist);k<TS*30;k+=4){if(rfOk(s.x-d*k,row,w)&&rfOk(s.x-d*k-d*w,row,w))return s.x-d*k}return s.x}
function rfRestore(p){const s=p.rfSafe||(G.cp?{x:G.cp.x,y:G.cp.y}:{x:3*TS,y:9*TS});p.x=rfBack(s,p.x,p.w);p.y=s.y;p.vx=0;p.vy=0;p.pound=0;p.ram=0;p.ledge=null;p.onG=false;p.inv=Math.max(p.inv,1);camUpdate(0,true)}
function bx(o){return{x:o.x-o.w/2,y:o.y-o.h,w:o.w,h:o.h}}

/* ===== worlds, levels, chunk builder ===== */
const ROWS=12,LVH=ROWS*TS;
const WORLDS=[
 {name:'Moonlit Gates',bg:'bg1',ter:'ter1',top:'#3f7a3c',top2:'#24502a',edge:'#1a2430',plank:'#9a6a3e',song:'w1',amb:'fireflies',sky:'#0e1a40',fog:'rgba(60,90,200,.10)'},
 {name:'Elephant Yard',bg:'bg2',ter:'ter2',top:'#4a7a34',top2:'#2a5022',edge:'#20160c',plank:'#8a5a2a',song:'w2',amb:'fireflies',sky:'#0e1a40',fog:'rgba(60,90,200,.10)'},
 {name:'Penguin Pool',bg:'bg3',ter:'ter3',top:'#f4f8ff',top2:'#bcd4f0',edge:'#203050',plank:'#7a8aa8',song:'w3',amb:'snow',sky:'#10204a',fog:'rgba(120,170,255,.10)'},
 {name:'Koala Grove',bg:'bg4',ter:'ter4',top:'#5a9a3a',top2:'#2e6a2a',edge:'#14200e',plank:'#8a6a3a',song:'w4',amb:'fireflies',sky:'#0c1a30',fog:'rgba(80,160,120,.08)'},
 {name:'Gift Shop Plaza',bg:'bg5',ter:'ter5',top:'#c86aa8',top2:'#8a3a7a',edge:'#2a1030',plank:'#b07a4e',song:'w5',amb:'sparkle',sky:'#2a1048',fog:'rgba(200,90,220,.07)'}];
const BOSSES=[
 {k:'sweep',name:'SERGEANT SWEEPBOT',hp:5},
 {k:'net',name:'NETTIE THE NET-BOT',hp:7},
 {k:'hover',name:'HOVER-KEEPER 3000',hp:8},
 {k:'mega',name:'HEAD KEEPER MEGA-BOT',hp:10}];
/* friends: freed from cages, follow the giraffe, ACTION calls their help */
const PALS={ele:{name:'ELLIE THE ELEPHANT',short:'Ellie',body:'ele_body',gap:62,lv:0},pen:{name:'PERCY THE PENGUIN',short:'Percy',body:'pen_body',gap:44,lv:2},koa:{name:'KIKI THE KOALA',short:'Kiki',body:'koa_body',gap:46,lv:4}};
const PAL_ORDER=['ele','pen','koa'];
const LEVELS=[
 {name:'Moonlit Gates',w:0,ch:['start','sign:Shh! It is midnight at the zoo. The Mega-Bot locked Peter and the birthday cake in the gift shop! Swipe and hold to move. Tap JUMP to jump.','flat','sign:Tap ACTION near gems, peanuts or beetles and your long TONGUE slurps them up!','beetle','tree*','pbot','sign:Double-tap ACTION for a NECK RAM. It smashes cracked rocks and robots!','wall','cp','sign:Ellie the Elephant is locked in a cage! BONK it with ACTION (or RAM it) to set her free.','cage:ele','sign:Dry moat ahead! Stand at the edge and tap ACTION. Ellie sprays water and logs float up!','spray*','pbot','swing1*','feast','end']},
 {name:'Elephant Yard',w:1,ch:['start','sign:Ellie helps in fights too. Tap ACTION near a robot and she blasts it with water!','pbot','steps*','spray','hyena','cp','sign:Cliff too tall? Jump at it and hold UP (or push toward it) to NECK GRAB the edge!','ledge','swing1*','beetle','spray*','cp','drone','feast','boss:0']},
 {name:'Penguin Pool',w:2,ch:['start','sign:Brrr, icy paths! Percy the Penguin is locked up near the pool.','plat*','drone','pbot','cp','cage:pen','sign:Gate with a low gap? Tap ACTION. Percy belly-slides under and flips the switch!','gate*','owl','spray','cp','bricks*','pbot','feast','end']},
 {name:'Icy Slide',w:2,ch:['start','sign:In the air, hold DOWN and tap ACTION to NECK POUND through cracked bricks!','gate','drone','spray*','cp','owl','bricks','swing2*','cp','gate','pbot','feast*','boss:1']},
 {name:'Koala Grove',w:3,ch:['start','sign:Kiki the Koala is somewhere in the lantern grove. Bonk her cage open!','monkey*','vines','cp','pbot','cage:koa','sign:Tall fence with a switch up high? Tap ACTION. Kiki climbs the pole and slaps it!','climb*','owl','swing2','cp','gate','beetle','feast*','end']},
 {name:'Treetop Lanterns',w:3,ch:['start','plat','climb*','owl','swing2','cp','monkey','spray*','drone','cp','vines*','feast','boss:2']},
 {name:'Night Safari Trail',w:1,ch:['start','sign:All three friends are with you! ACTION calls whoever can help.','hyena','gate*','armad','spray','cp','climb','ledge*','pbot','cp','swing3*','thorns','feast','end']},
 {name:'Carousel Plaza',w:4,ch:['start','sign:Thorny rose beds hurt! Hop over them.','thorns*','pbot','climb','swing2','cp','monkey','gate','spray*','cp','armad','mound*','drone','feast','end']},
 {name:'The Gift Shop',w:4,ch:['start','pbot','spray','cp','gate*','owl','climb*','cp','mound*','feast','sign:The Mega-Bot has Peter and the cake! RAM or STOMP it when it is dizzy. Watch out for flying wrenches!','boss:3']}];
LEVELS.forEach((L,i)=>{L.n=LEVELS.slice(0,i+1).filter(q=>q.w===L.w).length});
/* tiles: 0 air, 1 ground, 2 one-way plank, 3 cracked brick, 4 rock block, 5 thorns, 6 water, 7 iron zoo fence (unbreakable) */
function buildLevel(li){const L=LEVELS[li],R=rng(5000+li*77),cols=[];let x=0,h=9;
 const T=[],ents=[],signs=[],hooks=[],gems=[],stars=[],cps=[],helps=[],lamps=[];let boss=null,cage=null,goal=null;
 const col=(top,kind=1)=>{const a=new Array(ROWS).fill(0);if(top<ROWS)for(let y=top;y<ROWS;y++)a[y]=kind;T.push(a);return T.length-1};
 const flat=n=>{for(let i=0;i<n;i++){col(h);if(T.length%13===5&&R()<0.8)lamps.push({x:(T.length-1)*TS+TS/2,y:h*TS})}};
 const pit=(n,water)=>{for(let i=0;i<n;i++){const a=new Array(ROWS).fill(0);if(water){a[ROWS-1]=6;a[ROWS-2]=6}T.push(a)}};
 const set=(cx,cy,k)=>{if(T[cx]&&cy>=0&&cy<ROWS)T[cx][cy]=k};
 const plank=(cx,cy,n)=>{for(let i=0;i<n;i++)set(cx+i,cy,2)};
 const gem=(cx,cy)=>gems.push({x:cx*TS+TS/2,y:cy*TS+TS/2,t:R()*6});
 const arc=(cx,cy,n)=>{for(let i=0;i<n;i++)gem(cx+i,cy-Math.round(Math.sin(i/(n-1||1)*Math.PI)*1.5))};
 const foe=(k,cx,cy,o={})=>ents.push(Object.assign({k,x:cx*TS+TS/2,y:cy*TS},o));
 const star=(cx,cy)=>stars.push({x:cx*TS+TS/2,y:cy*TS+TS/2,id:stars.length});
 const food=(cx,cy,k='peanuts')=>ents.push({k:'food',f:k,x:cx*TS+TS/2,y:cy*TS+TS/2});
 for(const raw of L.ch){let name=raw,arg='';if(raw.includes(':')){[name,arg]=[raw.slice(0,raw.indexOf(':')),raw.slice(raw.indexOf(':')+1)]}
  const st=name.endsWith('*');if(st)name=name.slice(0,-1);const x0=T.length;
  switch(name){
  case 'start':flat(8);break;
  case 'sign':flat(2);signs.push({x:(T.length-1)*TS,y:h*TS,text:arg});flat(3);break;
  case 'flat':flat(4);arc(T.length-3,h-2,4);flat(6);if(R()<0.6)foe('pbot',T.length-3,h);break;
  case 'hyena':flat(5);arc(x0+1,h-2,4);foe('hyena',T.length-2,h);flat(5);foe('hyena',T.length-2,h);break;
  case 'pbot':flat(5);arc(x0+1,h-2,4);foe('pbot',T.length-2,h);flat(5);foe('pbot',T.length-2,h);flat(1);break;
  case 'porc':flat(4);foe('porc',T.length-1,h);flat(6);arc(x0+3,h-3,4);break;
  case 'armad':flat(4);foe('armad',T.length+3,h);flat(10);arc(x0+5,h-3,4);break;
  case 'steps':for(let i=0;i<3;i++){h-=1;flat(3);gem(T.length-2,h-1)}if(st)star(T.length-2,h-4);flat(3);for(let i=0;i<3;i++){h+=1;flat(2)}break;
  case 'pit':flat(2);pit(4);gem(T.length-2,h-3);gem(T.length-3,h-3.5|0);flat(4);break;
  case 'plat':flat(2);plank(T.length,h-3,3);flat(3);plank(T.length,h-5,3);gem(T.length+1,h-6);flat(3);if(st)star(T.length-1,h-7);flat(3);break;
  case 'feast':flat(2);for(let i=0;i<8;i++)gem(T.length+i,h-1-((i%2)));food(T.length+4,h-4,'bananas');flat(10);if(st)star(T.length-5,h-5);plank(T.length-7,h-3,3);break;
  case 'cp':flat(3);cps.push({x:(T.length-1)*TS+TS/2,y:h*TS,on:false});flat(3);break;
  case 'wall':flat(3);for(let i=0;i<2;i++){const cx=col(h);for(let y=h-5;y<h;y++)set(cx,y,4)}gem(T.length+1,h-1);flat(5);break;
  case 'tree':flat(3);food(T.length,h-4);food(T.length+2,h-5);if(st)star(T.length+1,h-6);flat(5);foe('hyena',T.length-1,h);flat(2);break;
  case 'swing1':flat(2);{const g=9;hooks.push({x:(T.length+g/2)*TS,y:(h-5)*TS});for(let i=0;i<5;i++)gem(T.length+2+i,h-3);if(st)star(T.length+g/2|0,h-7);pit(g,L.w===2)}flat(4);break;
  case 'swing2':flat(2);{const g=14;hooks.push({x:(T.length+4)*TS,y:(h-5)*TS},{x:(T.length+10)*TS,y:(h-5)*TS});arc(T.length+5,h-3,4);if(st)star(T.length+7,h-6);pit(g,L.w===2)}flat(4);break;
  case 'swing3':flat(2);{const g=19;hooks.push({x:(T.length+4)*TS,y:(h-5)*TS},{x:(T.length+9.5)*TS,y:(h-6)*TS},{x:(T.length+15)*TS,y:(h-5)*TS});arc(T.length+6,h-3,7);if(st)star(T.length+9,h-8);pit(g,false)}flat(4);break;
  case 'water':flat(2);pit(5,true);plank(T.length-3,h,2);gem(T.length-3,h-2);gem(T.length-2,h-2);flat(4);break;
  case 'owl':flat(6);foe('owl',T.length-2,h-4);flat(6);arc(x0+4,h-2,5);break;
  case 'drone':flat(5);foe('drone',T.length-2,h-2);flat(5);arc(x0+3,h-4,4);if(st)star(x0+6,h-6);break;
  case 'monkey':flat(3);plank(T.length,h-4,3);foe('monkey',T.length+1,h-4);flat(4);if(st)star(T.length-3,h-7);gem(T.length-3,h-5);flat(5);break;
  case 'bricks':flat(2);{const s0=T.length;flat(8);for(let y=h-3;y<h;y++){set(s0,y,1);set(s0+7,y,1)}for(let i=1;i<7;i++){set(s0+i,h-3,3);gem(s0+i,h-1)}if(st)star(s0+4,h-2);gem(s0+3,h-4);gem(s0+4,h-4)}flat(3);break;
  case 'mound':flat(3);{const cx=T.length;for(let i=0;i<3;i++){col(h);for(let y=h-4;y<h;y++)set(cx+i,y,3)}if(st)star(cx+1,h-6);gem(cx,h-5);gem(cx+2,h-5)}flat(3);foe('porc',T.length-1,h);flat(3);break;
  case 'vines':flat(2);{const s0=T.length;const h0=h;h=h0-1;flat(3);pit(3);h=h0-2;flat(3);pit(5);hooks.push({x:(s0+11.5)*TS,y:(h0-7)*TS});if(st)star(s0+11.5,h0-8);arc(s0,h0-3,5);arc(s0+6,h0-4,3);h=h0;flat(3)}flat(3);break;
  case 'cliff':flat(2);for(let i=0;i<3;i++){h-=2;flat(3);gem(T.length-2,h-1)}flat(4);foe('hyena',T.length-2,h);for(let i=0;i<3;i++){h+=2;flat(2)}if(st)star(x0+10,h-9);break;
  case 'thorns':flat(3);{const s=T.length;flat(7);for(let i=1;i<6;i++)set(s+i,h-1,5);plank(s+1,h-4,2);plank(s+4,h-4,2);if(st)star(s+3,h-6);arc(s+1,h-5,5)}flat(3);break;
  case 'beetle':flat(4);foe('beetle',T.length-1,h);flat(4);arc(x0+2,h-2,4);foe('beetle',T.length-1,h);flat(3);break;
  case 'ledge':{flat(3);const up=h>=7?5:3;gem(T.length-2,h-1);h-=up;flat(6);gem(T.length-4,h-1);gem(T.length-3,h-1);if(st)star(T.length-3,h-3);foe('beetle',T.length-2,h);h+=up;flat(4);break}
  case 'cage':flat(5);cage={x:(T.length-1)*TS,y:h*TS,hp:3,pal:arg||'ele'};flat(9);break;
  /* Ellie: a dry moat too wide to jump; spraying fills it and logs float up */
  case 'spray':{flat(4);const s0=T.length,g=9;pit(g);const logs=li===1?[[s0,h,9]]:[[s0+1,h,2],[s0+4,h,2],[s0+7,h,1]];
   helps.push({k:'ele',kind:'moat',x:s0*TS,s0,g,row:h,logs,fill:0,done:0});for(let i=0;i<g;i++)gem(s0+i,h-2-(i%3===1?1:0));if(st)star(s0+4,h-4);flat(5);break}
  /* Percy: iron fence with a low gap; he slides under and flips the switch on the far side */
  case 'gate':{flat(4);const gx=T.length;col(h);for(let y=0;y<h-1;y++)set(gx,y,7);flat(3);const sx=(T.length-1)*TS+TS/2;flat(3);
   helps.push({k:'pen',kind:'gate',x:gx*TS,gx,gy0:0,gy1:h-1,sw:{x:sx,y:h*TS},done:0});gem(gx+2,h-1);gem(gx+3,h-1);if(st)star(gx+4,h-3);break}
  /* Kiki: tall iron fence, switch at the top of a pole beside it */
  case 'climb':{flat(4);const px=T.length;flat(2);const gx=T.length;col(h);for(let y=0;y<h;y++)set(gx,y,7);flat(5);
   helps.push({k:'koa',kind:'pole',x:gx*TS,gx,gy0:0,gy1:h,pole:{x:px*TS+TS/2,y:h*TS,top:(h-6)*TS},sw:{x:px*TS+TS/2,y:(h-6)*TS},done:0});
   arc(gx+1,h-2,4);if(st)star(gx+3,h-4);break}
  case 'end':flat(5);goal={x:(T.length-2)*TS,y:h*TS};flat(8);break;
  case 'boss':{flat(2);const a=T.length;h=9;flat(26);
   const bi=+arg,bk=BOSSES[bi].k;boss={i:bi,x0:a*TS,x1:(a+26)*TS,y:h*TS};
   if(bk==='net'){hooks.push({x:(a+8)*TS,y:(h-5)*TS},{x:(a+18)*TS,y:(h-5)*TS});plank(a+3,h-4,3);plank(a+20,h-4,3)}
   if(bk==='hover'){plank(a+5,h-3,3);plank(a+18,h-3,3)}
   if(bk==='mega'){plank(a+4,h-4,4);plank(a+18,h-4,4)}
   flat(6);break}
  default:flat(4)}
 }
 return{T,ents,signs,hooks,gems,stars,cps,helps,lamps,boss,cage,goal,cols:T.length,W:T.length*TS}}
function tileAt(tx,ty){if(tx<0)return 1;if(!G||tx>=G.L.cols)return 1;if(ty<0)return G.L.T[tx][0]===7?7:0;if(ty>=ROWS)return 0;return G.L.T[tx][ty]}
const solidK=k=>k===1||k===3||k===4||k===7;

/* ===== player: Kelly's giraffe ===== */
const PH={foot:{w:28,h:76,spd:235,acc:1900,jv:640,hold:0.6},ride:{w:58,h:90,spd:300,acc:2100,jv:690,hold:0.6}};
function newPlayer(x,y,mode){return{x,y,vx:0,vy:0,face:1,onG:false,mode,hp:3,maxhp:3,inv:0,coy:0,jbuf:0,holdJ:0,atk:0,atkK:'',atkHit:null,lastTap:-9,ram:0,ramDx:0,ramDy:0,ramCd:0,pound:0,swing:null,tng:0,tngT:null,anim:0,land:0,dead:0,w:PH[mode].w,h:PH[mode].h,squash:0,swCd:0,ledge:null,lgCd:0}}
function setMode(p,m){p.mode=m;p.w=PH[m].w;p.h=PH[m].h}
function headPt(p){return p.mode==='ride'?{x:p.x+p.face*34,y:p.y-p.h+6}:{x:p.x+p.face*8,y:p.y-p.h+10}}
/* tile collision (axis separated) */
function collideX(o){const b=bx(o),y0=Math.floor((b.y+2)/TS),y1=Math.floor((b.y+b.h-2)/TS);
 if(o.vx>0){const tx=Math.floor((b.x+b.w)/TS);for(let ty=y0;ty<=y1;ty++)if(solidK(tileAt(tx,ty))){o.x=tx*TS-o.w/2-0.01;return tx}}
 else if(o.vx<0){const tx=Math.floor(b.x/TS);for(let ty=y0;ty<=y1;ty++)if(solidK(tileAt(tx,ty))){o.x=(tx+1)*TS+o.w/2+0.01;return tx}}
 return null}
function collideY(o,py,drop){const b=bx(o),x0=Math.floor((b.x+2)/TS),x1=Math.floor((b.x+b.w-2)/TS);o.onG=false;
 if(o.vy>=0){const ty=Math.floor(o.y/TS);for(let tx=x0;tx<=x1;tx++){const k=tileAt(tx,ty);if(solidK(k)||(k===2&&!drop&&py<=ty*TS+1)){o.y=ty*TS;o.vy=0;o.onG=true;return{tx,ty,k}}}}
 else{const ty=Math.floor(b.y/TS);for(let tx=x0;tx<=x1;tx++){const k=tileAt(tx,ty);if(solidK(k)){o.y=(ty+1)*TS+o.h;o.vy=0;return{tx,ty,k,up:1}}}}
 return null}
function breakTile(tx,ty,why){if(SIM)return false;const k=tileAt(tx,ty);if(k!==3&&k!==4)return false;G.L.T[tx][ty]=0;const x=tx*TS+TS/2,y=ty*TS+TS/2;
 burst(x,y,14,k===3?['#c8743a','#8a4a20','#e8a060']:['#9a9aa8','#6c6c7c','#d8d8e0'],260,0.7,5,1400);AU.fx('crack');shake(5);addScore(20,x,y,false);return true}
function addScore(n,x,y,show=true){G.score+=n;if(show)ftxt(x,y,'+'+n,'#fff6c0')}
function addGem(x,y){G.gems++;G.lvGems++;addScore(50,x,y,false);AU.fx('gem');burst(x,y,6,['#7aff7a','#d0ffd0','#30d050'],140,0.4,3,200);
 if(G.gems>=100){G.gems-=100;G.lives++;AU.fx('life');ftxt(x,y-20,'1UP!','#7aff7a',1)}}
function hurtPlayer(p,src){if(SIM){p.simHurt=1;return}if(p.inv>0||p.dead||G.won)return;if(window.__GOD){p.inv=0.3;return}p.hp--;p.inv=1.5;AU.fx('hurt');shake(8);flash('#ff3030',0.35);hitstop(0.06);
 const d=src?sgn(p.x-src):-p.face;p.vx=d*280;p.vy=-420;p.ram=0;p.pound=0;p.swing=null;p.atk=0;
 if(p.hp<=0)killPlayer(p)}
function killPlayer(p,why){if(SIM){p.dead=1;return}if(p.dead)return;if(window.__GOD&&why!=='fall'){p.hp=p.maxhp;return}p.dead=1;p.hp=0;p.vx=0;p.vy=-600;AU.fx(why==='water'?'splash':'hurt');G.deadT=1.6;G.deaths++}
function startAttack(p,k){p.atk=k==='kick'?0.32:k==='bonk'?0.22:0.2;p.atkK=k;p.atkHit=new Set();AU.fx(k==='kick'?'kick':k==='bonk'?'bonk':'punch');if(k==='kick'&&!p.onG)p.vy=Math.min(p.vy,-120)}
function attackBox(p){const r=p.atkK==='kick'?56:p.atkK==='bonk'?54:40;if(p.mode==='ride')return{x:p.face>0?p.x+10:p.x-10-r-20,y:p.y-p.h-6,w:r+20,h:56};return{x:p.face>0?p.x:p.x-r,y:p.y-p.h+10,w:r,h:44}}
function ramBox(p){if(p.ramDy<0)return{x:p.x-34,y:p.y-p.h-30,w:68,h:70};return{x:p.face>0?p.x:p.x-80,y:p.y-p.h,w:80,h:p.h-10}}
function nearHook(p){if(p.mode!=='ride'||p.swCd>0)return null;const hp=headPt(p);let best=null,bd=120;for(const h of G.L.hooks){const d=Math.hypot(h.x-hp.x,h.y-hp.y);if(d<bd&&h.y<p.y-20){bd=d;best=h}}return best}
function tongueTarget(p){if(p.mode!=='ride')return null;const hp=headPt(p);let best=null,bd=150;
 const test=(o,kind)=>{const dx=(o.x-hp.x)*p.face,dy=o.y-hp.y;if(dx<-20||dy>40)return;const d=Math.hypot(dx,dy);if(d<bd){bd=d;best={o,kind}}};
 for(const e of G.ents){if(e.dead)continue;if(e.k==='food')test(e,'food');else if(EDEF[e.k]&&EDEF[e.k].eat)test({x:e.x,y:e.y-e.h/2,e},'bug')}for(const s of G.L.stars)if(!s.got)test(s,'star');
 if(!best)for(const g of G.L.gems)if(!g.got&&g.y<p.y-p.h+10)test(g,'gem');return best}
function findLedge(p){if(p.onG||p.swing||p.ledge||p.lgCd>0||p.pound)return null;const dir=p.face,fx=p.x+dir*(p.w/2+6),tx=Math.floor(fx/TS);
 for(let ty=Math.floor((p.y-p.h-48)/TS);ty<=Math.floor((p.y-24)/TS);ty++){if(ty<1)continue;const k=tileAt(tx,ty);if(!solidK(k))continue;if(solidK(tileAt(tx,ty-1))||solidK(tileAt(tx,ty-2)))continue;
  const top=ty*TS;if(top<p.y-p.h-48||top>p.y-24)continue;if(solidK(tileAt(Math.floor((p.x)/TS),ty-1))||solidK(tileAt(Math.floor((p.x)/TS),ty-2)))return null;return{tx,ty,x:dir>0?tx*TS+p.w/2+4:(tx+1)*TS-p.w/2-4,y:top}}return null}
function startLedge(p,l){p.ledge={sx:p.x,sy:p.y,x:l.x,y:l.y,t:0};p.vx=p.vy=0;p.ram=0;p.pound=0;p.atk=0;AU.fx('grab');if(!SIM){dust(l.x,l.y,4);ftxt(l.x,l.y-p.h-14,'NECK GRAB!','#9ff0ff')}}
function doAction(p){const now=G.t;const dbl=now-p.lastTap<0.3;p.lastTap=now;
 if(!p.onG){const lg=findLedge(p);if(lg){startLedge(p,lg);return}}
 if(p.swing)return;const hk=nearHook(p);if(hk&&!p.onG){grabHook(p,hk);return}
 const hn=helpNear();if(hn&&!dbl&&startHelp(hn)){p.lastTap=-9;return}
 if(dbl&&p.onG&&G.L.helps&&G.L.helps.some(h=>h.active&&!h.done&&Math.abs(h.x-p.x)<320)){p.lastTap=-9;return}
 const tt=tongueTarget(p);if(tt&&!dbl){p.tng=0.3;p.tngT=tt;AU.fx('tongue');return}
 if(!p.onG&&inp.D){startPound(p);return}
 if(inp.U){startRam(p,-1);return}
 if(dbl){startRam(p,0);return}
 if(hk){grabHook(p,hk);return}
 if(combatHelp(p))return;
 startAttack(p,'bonk')}
function startRam(p,dy){if(p.ramCd>0||p.mode!=='ride')return;p.ram=dy<0?0.24:0.3;p.ramDy=dy;p.ramDx=dy<0?0:p.face;p.atk=0;AU.fx('ram');p.ramHit=new Set();
 if(dy<0){p.vy=-780;p.vx*=0.4}else{p.vx=p.face*660;p.vy=Math.min(p.vy,0)}dust(p.x-p.face*20,p.y,5)}
function startPound(p){p.pound=1;p.vy=950;p.vx*=0.2;p.ram=0;AU.fx('swing')}
function grabHook(p,h){const hp=headPt(p);const dx=p.x-h.x,dy=(p.y-p.h*0.55)-h.y;const L=clamp(Math.hypot(dx,dy),70,120);
 p.swing={h,L,a:Math.atan2(dx,dy),av:(p.vx*Math.cos(Math.atan2(dx,dy))-p.vy*Math.sin(Math.atan2(dx,dy)))/L};p.ram=0;p.pound=0;AU.fx('grab');p.vy=0}
function releaseSwing(p,jump){const s=p.swing;if(!s)return;const tv=s.av*s.L;p.vx=clamp(Math.cos(s.a)*tv,-560,560);p.vy=clamp(-Math.sin(s.a)*tv,-700,600)-(jump?330:0);p.swing=null;p.swCd=0.3;if(jump)AU.fx('jump');if(Math.abs(p.vx)>20)p.face=sgn(p.vx)}
function updatePlayer(p,dt){const C=PH[p.mode];p.anim+=dt;p.inv=Math.max(0,p.inv-dt);p.ramCd=Math.max(0,p.ramCd-dt);p.swCd=Math.max(0,p.swCd-dt);p.squash=Math.max(0,p.squash-dt*4);
 if(p.dead){p.vy+=GRAV*dt;p.y+=p.vy*dt;return}
 p.lgCd=Math.max(0,p.lgCd-dt);
 if(p.ledge){const l=p.ledge;l.t+=dt;const k=Math.min(1,l.t/0.3),e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;p.x=lerp(l.sx,l.x,e);p.y=lerp(l.sy,l.y,Math.min(1,e*1.3));if(k>=1){p.x=l.x;p.y=l.y;p.ledge=null;p.onG=true;p.vy=0;p.vx=p.face*60;p.lgCd=0.25;p.squash=0.4}return}
 if(G.cut){p.vx=0;p.vy+=GRAV*dt;const py=p.y;p.y+=p.vy*dt;collideY(p,py);return}
 /* swing */
 if(p.swing){const s=p.swing;let acc=-(GRAV/s.L)*Math.sin(s.a);const pump=(inp.R?1:0)-(inp.L?1:0);acc+=pump*4.2*Math.cos(s.a)*(Math.abs(s.a)<1.1?1:0.2);
  s.av+=acc*dt;s.av*=(1-0.12*dt);s.av=clamp(s.av,-6,6);s.a+=s.av*dt;s.a=clamp(s.a,-1.45,1.45);
  p.x=s.h.x+Math.sin(s.a)*s.L;p.y=s.h.y+Math.cos(s.a)*s.L+p.h*0.55;if(Math.abs(s.av)>0.3)p.face=sgn(s.av*Math.cos(s.a));
  if(inp.jumpP||inp.actP&&G.t-p.lastTap>0.15){releaseSwing(p,inp.jumpP);p.lastTap=G.t}
  else{const b=bx(p);if(solidAt(b)){releaseSwing(p,false);p.vx*=-0.3}}
  if(p.swing&&Math.random()<0.1&&Math.abs(s.av)>2)AU.fx('swing');return}
 /* horizontal */
 const want=(inp.R?1:0)-(inp.L?1:0);
 if(p.ram>0&&p.ramDy===0){p.ram-=dt;p.vx=p.ramDx*660;p.vy=0;if(Math.random()<0.6)dust(p.x-p.face*30,p.y,1);if(p.ram<=0){p.ramCd=0.22;p.vx=p.face*C.spd}}
 else{if(p.ram>0){p.ram-=dt;if(p.ram<=0)p.ramCd=0.2}
  const ctl=p.onG?1:0.75;if(want){const v0=p.vx;if(Math.abs(v0)>C.spd&&sgn(v0)===want)p.vx=sgn(v0)*Math.max(C.spd,Math.abs(v0)-(p.onG?1400:500)*dt);else{p.vx+=want*C.acc*ctl*dt;if(Math.abs(p.vx)>C.spd)p.vx=sgn(p.vx)*C.spd}if(p.atk<=0||p.mode==='ride')p.face=want}
  else{const f=(p.onG?2400:500)*dt;p.vx=Math.abs(p.vx)<=f?0:p.vx-sgn(p.vx)*f}}
 /* jump */
 p.coy=p.onG?0.1:p.coy-dt;p.jbuf=inp.jumpP?0.12:p.jbuf-dt;
 if(p.jbuf>0&&p.coy>0&&p.pound===0){p.vy=-C.jv;p.coy=0;p.jbuf=0;p.holdJ=1;AU.fx('jump');dust(p.x,p.y,5);p.squash=0.6}
 if(!inp.jump)p.holdJ=0;
 const rising=p.vy<0;let g=GRAV;if(p.holdJ&&rising)g*=C.hold;if(p.ram>0&&p.ramDy===0)g=0;if(p.pound)g=0;
 /* action */
 if(inp.actP)doAction(p);if(inp.ramP&&p.mode==='ride')startRam(p,inp.U?-1:0);
 if(p.atk>0)p.atk-=dt;if(p.tng>0){p.tng-=dt;if(p.tngT&&p.tng<0.18){const t=p.tngT;p.tngT=null;collectTongue(t)}}
 /* integrate */
 p.vy=Math.min(p.vy+g*dt,p.pound?950:1100);
 p.x+=p.vx*dt;const hx=collideX(p);if(hx!==null){if(p.ram>0&&p.ramDy===0){const b=bx(p),y0=Math.floor(b.y/TS),y1=Math.floor((b.y+b.h-2)/TS);let br=false;for(let ty=y0;ty<=y1;ty++)br=breakTile(hx,ty)||br;if(!br){p.ram=0;p.ramCd=0.25;shake(4);AU.fx('bonk');p.vx=-p.face*120}}else p.vx=0}
 const py=p.y;p.y+=p.vy*dt;const wasG=p.onG;const hy=collideY(p,py,inp.D&&!p.pound&&p.onG);
 if(hy&&hy.up){if(p.ram>0||p.vy<=0){let br=breakTile(hy.tx,hy.ty);const b=bx(p);for(let tx=Math.floor(b.x/TS);tx<=Math.floor((b.x+b.w)/TS);tx++)if(tx!==hy.tx)br=breakTile(tx,hy.ty)||br;if(br&&p.ram>0)p.vy=-300}}
 if(hy&&!hy.up&&p.pound){let br=false;const b=bx(p);for(let tx=Math.floor((b.x+2)/TS);tx<=Math.floor((b.x+b.w-2)/TS);tx++)br=breakTile(tx,hy.ty)||br;
  if(br){p.onG=false;p.vy=600}else{p.pound=0;shake(10);AU.fx('pound');ring(p.x,p.y,'rgba(255,240,200,.9)',90,0.35,6);dust(p.x,p.y,12);poundWave(p)}}
 if(p.onG&&!wasG&&py<p.y+1){p.squash=0.5;if(p.vy===0&&!p.pound)AU.fx('land')}
 if(p.onG)p.pound=0;
 if(!p.onG&&!p.dead&&(inp.U||(want===p.face&&p.vy>-60))){const lg=findLedge(p);if(lg)startLedge(p,lg)}
 /* hazards */
 const b=bx(p);for(let tx=Math.floor(b.x/TS);tx<=Math.floor((b.x+b.w)/TS);tx++)for(let ty=Math.floor(b.y/TS);ty<=Math.floor((b.y+b.h-1)/TS);ty++){const k=tileAt(tx,ty);
  if(k===5&&p.y>ty*TS+14)hurtPlayer(p,tx*TS+TS/2);if(k===6&&p.y>ty*TS+16){splash(p.x,ty*TS);if(p.inv>0&&!p.dead&&!SIM){rfRestore(p);return}killPlayer(p,'water');return}}
 if(p.onG&&!p.ledge&&!SIM&&rfOk(p.x,Math.floor((p.y+1)/TS),p.w+TS))p.rfSafe={x:p.x,y:p.y};
 if(p.y>LVH+120){if(p.inv>0&&!p.dead&&!SIM){rfRestore(p);return}killPlayer(p,'fall')}
 if(G.arena){const a=G.arena;if(p.x<a.x0+p.w/2){p.x=a.x0+p.w/2;p.vx=Math.max(0,p.vx)}if(p.x>a.x1-p.w/2){p.x=a.x1-p.w/2;p.vx=Math.min(0,p.vx)}}
 if(p.x<p.w/2)p.x=p.w/2}
function solidAt(b){for(let tx=Math.floor(b.x/TS);tx<=Math.floor((b.x+b.w)/TS);tx++)for(let ty=Math.floor(b.y/TS);ty<=Math.floor((b.y+b.h)/TS);ty++)if(solidK(tileAt(tx,ty)))return true;return false}
function splash(x,y){if(SIM)return;burst(x,y,18,['#9ad8ff','#e0f6ff','#4aa8ff'],320,0.7,4,1200);ring(x,y,'rgba(200,240,255,.8)',50,0.4,4)}
function collectTongue(t){const o=t.o;if(t.kind==='food'){o.dead=1;const p=G.p;if(p.hp<p.maxhp){p.hp++;AU.fx('heart');ftxt(o.x,o.y,'+1 HEART','#ff8aa0')}else{addScore(200,o.x,o.y);AU.fx('slurp')}burst(o.x,o.y,8,['#7ad04a','#c0f080'],160,0.5,3,300)}
 else if(t.kind==='bug'){if(!o.e.dead){hitEnemy(o.e,'yum');AU.fx('slurp')}}
 else if(t.kind==='star')getStar(o);else if(t.kind==='gem'){o.got=1;addGem(o.x,o.y)}}
function getStar(s){if(s.got)return;s.got=1;G.lvStars[s.id]=1;addScore(1000,s.x,s.y);AU.fx('star');stars(s.x,s.y,14);ftxt(s.x,s.y-20,'GOLD STAR!','#ffe060',1)}


/* ===== friends: Ellie the Elephant, Percy the Penguin, Kiki the Koala ===== */
const RIGD={"ele": {"w": 155, "h": 134, "hy": 108, "legs": [30, 49, 71, 91], "len": 25, "wid": 15, "col": "#a1b9c9"}, "koa": {"w": 97, "h": 84, "hy": 61, "legs": [13, 30, 50, 71], "len": 22, "wid": 11, "col": "#938f8c"}, "pen": {"w": 61, "h": 100}};
function palAvail(k){return !!(G&&G.pals&&G.pals.some(q=>q.k===k))}
function palOf(k){return G.pals.find(q=>q.k===k)}
function addPal(k,x,y){if(palAvail(k))return null;const q={k,x,y,face:1,ph:Math.random(),amp:0,air:0,busy:null,cd:0,pose:null};G.pals.push(q);return q}
function initPals(li){G.pals=[];for(const k of PAL_ORDER)if(PALS[k].lv<li)addPal(k,G.p.x,G.p.y);resetTrail(true)}
function resetTrail(snap){const p=G.p;G.trail=[];for(let i=40;i>0;i--)G.trail.push({x:Math.max(20,p.x-i*6),y:p.y,air:0});G.trail.push({x:p.x,y:p.y,air:0});
 if(snap)G.pals.forEach((q,i)=>{const t=trailAt(palDist(i));q.x=t.x;q.y=t.y;q.busy=null;q.face=1})}
function palDist(i){let d=34;for(let j=0;j<=i;j++)d+=PALS[G.pals[j].k].gap;return d}
function trailAt(D){const T=G.trail;let i=T.length-1,acc=0;while(i>0){const a=T[i],b=T[i-1],l=Math.hypot(a.x-b.x,a.y-b.y);if(acc+l>=D){const k=(D-acc)/l;return{x:lerp(a.x,b.x,k),y:lerp(a.y,b.y,k),air:a.air||b.air}}acc+=l;i--}return T[0]}
function helpRange(h,p){if(h.done||h.active||!palAvail(h.k))return false;const d=h.x-p.x;return h.kind==='moat'?(d>-30&&d<280):(d>-10&&d<300)}
function helpNear(){if(!G||!G.L.helps)return null;const p=G.p;let best=null;for(const h of G.L.helps)if(helpRange(h,p)&&(!best||Math.abs(h.x-p.x)<Math.abs(best.x-p.x)))best=h;return best}
function curPal(){const hn=helpNear();if(hn)return hn.k;const bz=G.pals.find(q=>q.busy&&q.busy.h);if(bz)return bz.k;for(let i=G.pals.length-1;i>=0;i--)if(!G.pals[i].busy)return G.pals[i].k;return G.pals.length?G.pals[G.pals.length-1].k:null}
function startHelp(h){const q=palOf(h.k);if(!q||q.busy)return false;h.active=1;q.busy={h,t:0,ph:'go'};AU.fx('free');ftxt(G.p.x,G.p.y-G.p.h-30,PALS[h.k].short.toUpperCase()+' TO THE RESCUE!','#9ff0ff',1);return true}
function groundY(x,fromY){const tx=Math.floor(x/TS);for(let ty=Math.max(0,Math.floor(fromY/TS)-1);ty<ROWS;ty++){const k=tileAt(tx,ty);if(solidK(k)||k===2)return ty*TS}return fromY}
function foeAhead(p,range){let best=null,bd=range;for(const e of G.ents){if(e.dead||e.k==='food')continue;const dx=(e.x-p.x)*p.face;if(dx<-30||dx>range||Math.abs((e.y-e.h/2)-(p.y-40))>110)continue;if(dx<bd){bd=dx;best=e}}return best}
function combatHelp(p){if(!G.pals.length)return false;const k=curPal();const q=palOf(k);if(!q||q.busy||q.cd>0)return false;
 const b=G.boss,bossNear=b&&b.st!=='dead'&&b.st!=='intro'&&Math.abs(b.x-p.x)<320;const e=foeAhead(p,k==='koa'?260:300);if(!e&&!bossNear)return false;
 q.cd=0.8;if(k==='ele'){q.busy={kind:'jet',t:0,dir:p.face,hit:new Set()};AU.fx('splash');ftxt(q.x,q.y-80,'SPLASH!','#9ad8ff')}
 else if(k==='pen'){q.x=p.x-p.face*10;q.y=p.y;q.busy={kind:'dash',t:0,dir:p.face,hit:new Set()};AU.fx('ram');ftxt(p.x,p.y-110,'BELLY SLIDE!','#9ad8ff')}
 else{const tg=e||b;q.busy={kind:'pounce',t:0,x0:q.x,y0:q.y,tg,hit:0};AU.fx('jump');ftxt(q.x,q.y-70,'KOALA POUNCE!','#c8ffb0')}
 return true}
function palHitFoes(q,box,how,set){for(const e of G.ents){if(e.dead||e.k==='food'||set&&set.has(e))continue;if(ovr(box,bx(e))){set&&set.add(e);hitEnemy(e,how)}}
 const b=G.boss;if(b&&b.st!=='dead'&&b.st!=='intro'&&!(set&&set.has(b))&&ovr(box,{x:b.x-b.w/2,y:b.y-b.h,w:b.w,h:b.h})){set&&set.add(b);if(bossOpen(b))damageBoss(b,0,how);else{b.inv=Math.max(b.inv,0.2);ftxt(b.x,b.y-b.h-10,'WAIT TILL DIZZY!','#fff')}}}
function openFence(h){const T=G.L.T;for(let y=h.gy0;y<h.gy1;y++){T[h.gx][y]=0;burst(h.gx*TS+TS/2,y*TS+TS/2,4,['#5a6070','#9aa0b0','#ffd23a'],220,0.6,4,900)}h.done=1;h.swOn=1;AU.fx('crack');shake(8);ftxt(h.gx*TS,h.gy1*TS-150,'GATE OPEN!','#7aff7a',1)}
function fillMoat(h){const T=G.L.T;for(let i=0;i<h.g;i++){T[h.s0+i][ROWS-1]=6;T[h.s0+i][ROWS-2]=6}for(const[cx,cy,n]of h.logs)for(let i=0;i<n;i++)T[cx+i][cy]=2;h.done=1;AU.fx('splash');ftxt(h.x+h.g*TS/2,h.row*TS-110,'LOGS UP!','#7aff7a',1)}
function palWalk(q,tx,ty,dt,spd){const dx=tx-q.x;const st=Math.sign(dx)*Math.min(Math.abs(dx),spd*dt);q.x+=st;q.y+=(ty-q.y)*Math.min(1,dt*12);if(Math.abs(st)>0.3)q.face=sgn(st);q.mv=Math.abs(st)/dt;return Math.abs(dx)<4}
function updPals(dt){const p=G.p;if(!G.pals)return;const T=G.trail,last=T[T.length-1];
 if(!p.dead&&Math.hypot(p.x-last.x,p.y-last.y)>4){T.push({x:p.x,y:p.y,air:!p.onG&&!p.ledge?1:0});if(T.length>700)T.splice(0,T.length-700)}
 G.pals.forEach((q,i)=>{q.cd=Math.max(0,q.cd-dt);q.pose=null;q.mv=0;const B=q.busy;
  if(!B){const t=trailAt(palDist(i));const ox=q.x;q.x+=(t.x-q.x)*Math.min(1,dt*9);q.y+=(t.y-q.y)*Math.min(1,dt*9);q.air=t.air;const v=(q.x-ox)/dt;q.mv=Math.abs(v);if(Math.abs(q.x-ox)>0.25)q.face=sgn(v)}
  else{B.t+=dt;q.air=0;const h=B.h;
   if(B.kind==='jet'){q.pose='spray';q.face=B.dir;if(B.t>0.1&&B.t<0.6){for(let n=0;n<3;n++)P({x:q.x+B.dir*30,y:q.y-50,vx:B.dir*rand(420,620),vy:rand(-160,-40),l:0.5,m:0.5,s:rand(3,6),c:['#bfe8ff','#7ac8ff','#fff'][n],g:700});
     palHitFoes(q,{x:B.dir>0?q.x:q.x-320,y:q.y-140,w:320,h:150},'splash',B.hit)}if(B.t>0.75)q.busy=null}
   else if(B.kind==='dash'){q.pose='slide';q.face=B.dir;if(B.t<0.6){q.x+=B.dir*560*dt;if(collideX({x:q.x,y:q.y,w:30,h:20,vx:B.dir})!==null)B.t=0.6;q.y=groundY(q.x,q.y-10);palHitFoes(q,{x:q.x-26,y:q.y-34,w:52,h:34},'kick',B.hit);if(Math.random()<0.6)dust(q.x-B.dir*20,q.y,1,'rgba(220,240,255,.8)')}else{q.pose=null;if(palWalk(q,trailAt(palDist(i)).x,trailAt(palDist(i)).y,dt,420)||B.t>2)q.busy=null}}
   else if(B.kind==='pounce'){const tg=B.tg,k=Math.min(1,B.t/0.42);if(!B.hit){const tx=tg.x,ty=tg.y-(tg.h||40)*0.5;q.x=lerp(B.x0,tx,k);q.y=lerp(B.y0,ty,k)-Math.sin(k*Math.PI)*90;q.face=sgn(tx-B.x0)||1;q.pose='slap';q.air=1;
     if(k>=1){B.hit=1;if(tg===G.boss){palHitFoes(q,{x:tg.x-tg.w/2,y:tg.y-tg.h,w:tg.w,h:tg.h},'bonk',null)}else if(!tg.dead)hitEnemy(tg,'bonk');stars(q.x,q.y-20,6)}}
    else{const t=trailAt(palDist(i));q.y=Math.min(q.y+380*dt,groundY(q.x,q.y));if(palWalk(q,t.x,q.y,dt,380)||B.t>2.2)q.busy=null}}
   else if(h&&h.kind==='moat'){const wx=h.x-26,wy=h.row*TS;
    if(B.ph==='go'){if(palWalk(q,wx,wy,dt,300)){B.ph='spray';B.t=0}}
    else if(B.ph==='spray'){q.pose='spray';q.face=1;h.fill=Math.min(1,B.t/1.6);for(let n=0;n<3;n++)P({x:q.x+34,y:q.y-58,vx:rand(260,520),vy:rand(-320,-120),l:0.8,m:0.8,s:rand(3,6),c:['#bfe8ff','#7ac8ff','#fff'][n],g:900});if(Math.random()<0.15)AU.fx('splash');if(B.t>=1.6){fillMoat(h);B.ph='back';B.t=0}}
    else{const t=trailAt(palDist(i));if(palWalk(q,t.x,t.y,dt,300)||B.t>2.5){q.busy=null}}}
   else if(h&&h.kind==='gate'){const gy=h.gy1*TS;
    if(B.ph==='go'){if(palWalk(q,h.x-44,gy,dt,280)){B.ph='slide';B.t=0;AU.fx('ram')}}
    else if(B.ph==='slide'){q.pose='slide';q.face=1;q.x+=440*dt;q.y=gy;if(Math.random()<0.5)dust(q.x-20,q.y,1,'rgba(220,240,255,.8)');if(q.x>=h.sw.x-30){q.x=h.sw.x-30;B.ph='flip';B.t=0;AU.fx('grab')}}
    else if(B.ph==='flip'){q.face=1;q.pose='flap';if(B.t>0.35&&!h.done)openFence(h);if(B.t>0.8){B.ph='back';B.t=0}}
    else{const t=trailAt(palDist(i));if(palWalk(q,t.x,t.y,dt,300)||B.t>3){q.busy=null}}}
   else if(h&&h.kind==='pole'){const P0=h.pole;
    if(B.ph==='go'){if(palWalk(q,P0.x-14,P0.y,dt,280)){B.ph='climb';B.t=0}}
    else if(B.ph==='climb'){q.pose='climb';q.face=1;q.x=P0.x-14;const k=Math.min(1,B.t/1.4);q.y=lerp(P0.y,P0.top+70,k)+Math.sin(B.t*18)*2;if(Math.random()<0.2)AU.fx('grab');if(k>=1){B.ph='slap';B.t=0}}
    else if(B.ph==='slap'){q.pose='climbslap';q.face=1;if(B.t>0.25&&!h.done)openFence(h);if(B.t>0.6){B.ph='down';B.t=0}}
    else if(B.ph==='down'){q.pose='climb';q.y=Math.min(P0.y,q.y+520*dt);if(q.y>=P0.y){B.ph='back';B.t=0}}
    else{const t=trailAt(palDist(i));if(palWalk(q,t.x,t.y,dt,300)||B.t>3){q.busy=null}}}
   else q.busy=null}
  const sp=q.k==='ele'?70:q.k==='pen'?38:44;q.amp+=(((q.mv>18&&!q.air&&!q.pose)?1:0)-q.amp)*Math.min(1,dt*10);if(q.mv>2)q.ph=(q.ph+Math.min(2.4,q.mv/sp)*dt)%1});
 if(G.palBanner)G.palBanner.t-=dt}
/* drawing: rigged walkers with real leg motion (legs swing in a lateral sequence; feet lift on the forward swing) */
function palLeg(hx,hy,a,lift,len,wid,col,line,toe){const L=len-lift,ex=hx+Math.sin(a)*L,ey=hy+Math.cos(a)*L;c.lineCap='round';c.strokeStyle=line;c.lineWidth=wid+4;c.beginPath();c.moveTo(hx,hy);c.lineTo(ex,ey);c.stroke();c.strokeStyle=col;c.lineWidth=wid;c.beginPath();c.moveTo(hx,hy);c.lineTo(ex,ey);c.stroke();
 if(toe==='ele'){c.fillStyle='#f4ecd8';for(let i=-1;i<=1;i++){c.beginPath();c.ellipse(ex+i*wid*0.28+wid*0.12,ey+wid*0.32,wid*0.13,wid*0.1,0,0,TAU);c.fill()}}
 else{c.fillStyle=line;c.beginPath();c.ellipse(ex+wid*0.25,ey+wid*0.3,wid*0.62,wid*0.34,0,0,TAU);c.fill()}}
function shade(hex,f){const n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;return'rgb('+(r*f|0)+','+(g*f|0)+','+(b*f|0)+')'}
function drawQuad(q,key,x,y,flip){const im=IMG[key+'_body'],R=RIGD[key];if(!im)return;const t=q.ph*TAU,amp=q.air?0:q.amp,bob=amp*2.2*Math.abs(Math.cos(t));
 c.save();c.translate(x,y);c.scale(flip?-0.5:0.5,0.5);const ox=-im.width/2,top=-(R.hy+R.len)-bob,hy=-R.len-bob-R.wid*0.35;
 const col=R.col,dk=shade(col,0.78),line=key==='ele'?'#3a4256':'#3c3a3e',off=[0.5,0,0.75,0.25];
 const leg=(i,back)=>{const ph=t*1+off[i]*TAU,sw=q.air?(i<2?0.35:-0.35):amp*0.42*Math.sin(ph),lift=q.air?R.len*0.2:amp*R.len*0.28*Math.max(0,Math.cos(ph));palLeg(ox+R.legs[i],hy,sw,lift,R.len+R.wid*0.35,R.wid*(back?0.92:1),back?dk:col,line,key)};
 leg(0,true);leg(2,true);c.drawImage(im,ox,top);leg(1,false);leg(3,false);c.restore()}
function drawPen(q,x,y,flip){const t=q.ph*TAU,amp=q.air?0:q.amp;if(q.air&&!q.pose){spr('pen_flap',x,y,1,flip,1,Math.sin(G.t*20)*0.05);return}
 const im=IMG.pen_body;if(!im)return;c.save();c.translate(x,y);c.scale(flip?-0.5:0.5,0.5);
 const foot=(k)=>{const ph=t+k*Math.PI,fx=(k?-9:10)+amp*9*Math.sin(ph),fy=-amp*5*Math.max(0,Math.cos(ph));c.fillStyle='#b8560a';c.beginPath();c.ellipse(fx+4,fy-3,14,6.5,0,0,TAU);c.fill();c.fillStyle='#ffa21a';c.beginPath();c.ellipse(fx+5,fy-4.5,12,5,0,0,TAU);c.fill()};
 foot(1);c.save();c.translate(0,-8);c.rotate(amp*0.13*Math.sin(t));c.drawImage(im,-im.width/2,-im.height);c.restore();foot(0);c.restore()}
function drawPal(q){const fl=q.face<0;let x=q.x,y=q.y+2;
 if(!q.air&&!q.pose){c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y,q.k==='ele'?34:18,5,0,0,TAU);c.fill()}
 if(q.pose==='spray'){spr('ele_spray',x,y,1,fl);return}
 if(q.pose==='slide'){spr('pen_slide',x,y+2,1,fl);return}
 if(q.pose==='flap'){spr('pen_flap',x,y,1,fl,1,Math.sin(G.t*24)*0.06);return}
 if(q.pose==='climb'){spr('koa_climb',x,y,1,fl,1,Math.sin(G.t*18)*0.04);return}
 if(q.pose==='climbslap'||q.pose==='slap'){spr('koa_slap',x,y,1,fl);return}
 if(q.k==='pen')drawPen(q,x,y,fl);else drawQuad(q,q.k,x,y,fl)}
function drawHelps(vis){const L=G.L;for(const h of L.helps){if(!vis(h.x))continue;
 if(h.kind==='moat'){const x0=h.s0*TS,x1=(h.s0+h.g)*TS;
  if(!h.done){const g=c.createLinearGradient(0,h.row*TS,0,LVH+60);g.addColorStop(0,'rgba(10,14,30,0)');g.addColorStop(1,'rgba(6,8,20,.85)');c.fillStyle=g;c.fillRect(x0,h.row*TS,x1-x0,LVH-h.row*TS+60);
   const wl=lerp(LVH+50,(ROWS-2)*TS+4,h.fill||0);if(h.fill>0){const wg=c.createLinearGradient(0,wl,0,LVH+60);wg.addColorStop(0,'rgba(80,180,240,.92)');wg.addColorStop(1,'rgba(10,50,120,.96)');c.fillStyle=wg;c.fillRect(x0,wl,x1-x0,LVH+60-wl)}
   for(const[cx,cy,n]of h.logs){const ly=lerp(LVH+30,cy*TS,h.fill||0)+Math.sin(G.t*3+cx)*2;c.fillStyle='#6a4422';rr(cx*TS,ly,n*TS,14,7);c.fill();c.fillStyle='#9a6a3a';rr(cx*TS+2,ly+2,n*TS-4,5,3);c.fill()}}
  /* little stone fountain spout at the edge */
  const fx=x0-10,fy=h.row*TS;c.fillStyle='#5a6478';rr(fx-12,fy-26,22,26,5);c.fill();c.fillStyle='#8a94a8';rr(fx-14,fy-30,26,7,3);c.fill();c.fillStyle='#3a4050';c.fillRect(fx+6,fy-20,12,6);
  if(h.done&&Math.random()<0.3)P({x:fx+18,y:fy-17,vx:rand(40,90),vy:rand(-60,0),l:0.6,m:0.6,s:3,c:'#bfe8ff',g:600})}
 else if(h.kind==='gate'){spr(h.swOn?'sw_on':'sw_off',h.sw.x,h.sw.y,0.8);}
 else if(h.kind==='pole'){const P0=h.pole;c.fillStyle='#c8b89a';rr(P0.x-7,P0.top+10,14,P0.y-P0.top-10,6);c.fill();c.fillStyle='rgba(90,70,50,.45)';for(let yy=P0.top+30;yy<P0.y;yy+=26)c.fillRect(P0.x-7,yy,14,3);c.strokeStyle='#4a3a2a';c.lineWidth=2;c.strokeRect(P0.x-7,P0.top+10,14,P0.y-P0.top-10);
  spr(h.swOn?'sw_on':'sw_off',P0.x+14,P0.top+36,0.7)}
 if(!h.done&&!h.active&&G.p&&helpRange(h,G.p)){const q=palOf(h.k);const tx=h.kind==='pole'?h.pole.x:h.x,ty=(h.kind==='pole'?h.pole.top:h.kind==='gate'?h.gy1*TS-140:h.row*TS-120)+Math.sin(G.t*5)*4;
  c.textAlign='center';c.font='17px "Lilita One",sans-serif';c.lineWidth=5;c.strokeStyle='#0a1430';const t1='TAP ACTION!',t2=PALS[h.k].short+(h.kind==='moat'?' sprays water':h.kind==='gate'?' slides under':' climbs up');c.strokeText(t1,tx,ty);c.fillStyle='#7aff7a';c.fillText(t1,tx,ty);c.font='14px "Lilita One",sans-serif';c.strokeText(t2,tx,ty+18);c.fillStyle='#fff';c.fillText(t2,tx,ty+18)}}}
function drawLampGlow(x,y,r,a){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,'rgba(255,220,140,'+a+')');g.addColorStop(0.4,'rgba(255,180,80,'+(a*0.35)+')');g.addColorStop(1,'rgba(255,160,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore()}

/* ===== enemies, items, projectiles ===== */
const EDEF={beetle:{w:40,h:26,spd:48,pts:100,eat:1},drone:{w:34,h:30,spd:0,pts:150,fly:1},hyena:{w:54,h:48,spd:75,pts:100},pbot:{w:44,h:44,spd:62,pts:150,bot:1},porc:{w:42,h:38,spd:32,pts:150,spiky:1},owl:{w:56,h:44,spd:90,pts:150,fly:1},monkey:{w:46,h:52,spd:0,pts:150},armad:{w:40,h:38,spd:0,pts:200}};
function spawnEnts(){G.ents=[];for(const e of G.L.ents){const o=Object.assign({},e);if(o.k==='food'){o.t=Math.random()*6;G.ents.push(o);continue}
 const d=EDEF[o.k];Object.assign(o,{w:d.w,h:d.h,vx:-d.spd,vy:0,face:-1,hp:1,t:Math.random()*3,st:'walk',x0:o.x,y0:o.y,cd:1+Math.random(),onG:false});if(o.k==='armad')o.st='curl';G.ents.push(o)}}
function enemyActive(e){return Math.abs(e.x-G.p.x)<viewW*0.75+200}
function updEnemies(dt){const p=G.p;
 for(const e of G.ents){if(e.dead){if(e.dying){e.dying-=dt;e.vy+=GRAV*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.rot=(e.rot||0)+dt*8}continue}
  if(e.k==='food'){e.t+=dt;if(!p.dead&&ovr(bx({x:e.x,y:e.y+18,w:34,h:36}),bx(p))){G.p.tngT={o:e,kind:'food'};collectTongue(G.p.tngT);G.p.tngT=null}continue}
  if(!enemyActive(e))continue;e.t+=dt;e.stun=Math.max(0,(e.stun||0)-dt);
  if(e.k==='hyena'||e.k==='porc'||e.k==='beetle'||e.k==='pbot'){if(e.stun>0){e.vx=0}else if(Math.abs(e.vx)<1)e.vx=-EDEF[e.k].spd*(e.face||-1)*-1;
   e.vy+=GRAV*dt;e.x+=e.vx*dt;const hx=collideX(e);if(hx!==null){e.vx=-e.vx}const py=e.y;e.y+=e.vy*dt;collideY(e,py);
   if(e.onG){const ahead=e.x+sgn(e.vx)*(e.w/2+4);const tx=Math.floor(ahead/TS),ty=Math.floor((e.y+4)/TS);const k=tileAt(tx,ty);if(!(solidK(k)||k===2))e.vx=-e.vx}
   if(e.vx)e.face=sgn(e.vx);if(e.y>LVH+80)e.dead=1}
  else if(e.k==='drone'){e.x=e.x0+Math.sin(e.t*1.1)*90;e.y=e.y0+Math.sin(e.t*3.2)*12;e.face=Math.cos(e.t*1.1)>0?1:-1}
  else if(e.k==='owl'){if(!e.st||e.st==='walk')e.st='fly';
   if(e.st==='fly'){e.x=e.x0+Math.sin(e.t*0.9)*120;e.y=e.y0+Math.sin(e.t*2.2)*14;e.face=Math.cos(e.t*0.9)>0?1:-1;e.cd-=dt;
    if(e.cd<=0&&Math.abs(p.x-e.x)<240&&p.y>e.y+40&&!p.dead){e.st='dive';e.tx=p.x;e.ty=p.y-30;e.face=sgn(p.x-e.x);AU.fx('throw')}}
   else if(e.st==='dive'){const dx=e.tx-e.x,dy=e.ty-e.y,d=Math.hypot(dx,dy);if(d<12){e.st='rise'}else{e.x+=dx/d*360*dt;e.y+=dy/d*360*dt}}
   else{const y=e.y0;e.y-=200*dt;if(e.y<=y){e.y=y;e.st='fly';e.cd=2.4;e.x0=e.x-Math.sin(e.t*0.9)*120}}}
  else if(e.k==='monkey'){e.face=sgn(p.x-e.x);e.cd-=dt;if(e.cd<=0&&Math.abs(p.x-e.x)<460&&!p.dead){e.cd=2.3;e.thr=0.35;const tx=p.x+p.vx*0.5,dx=tx-e.x;const T=0.9;G.shots.push({k:'banana',x:e.x,y:e.y-40,vx:dx/T,vy:-(GRAV*0.5*T)+(p.y-30-(e.y-40))/T,r:14,g:1,rot:0});AU.fx('throw')}e.thr=Math.max(0,(e.thr||0)-dt)}
  else if(e.k==='armad'){if(e.st==='curl'){e.vy+=GRAV*dt;const py=e.y;e.y+=e.vy*dt;collideY(e,py);if(Math.abs(p.x-e.x)<380&&!p.dead&&e.stun<=0){e.st='roll';e.vx=sgn(p.x-e.x)*290;AU.fx('ram')}}
   else{e.vy+=GRAV*dt;e.x+=e.vx*dt;if(collideX(e)!==null){e.vx=-e.vx;shake(2)}const py=e.y;e.y+=e.vy*dt;collideY(e,py);e.rot=(e.rot||0)+e.vx*dt/20;if(e.stun>0){e.vx*=0.9;if(e.stun<0.1)e.st='curl'}
    if(e.y>LVH+80)e.dead=1;if(Math.abs(p.x-e.x)>700){e.st='curl';e.vx=0}}}
  /* player interactions */
  if(p.dead)continue;const eb=bx(e),pb=bx(p);
  if(p.ram>0&&ovr(ramBox(p),eb)){hitEnemy(e,'ram');continue}
  if(p.atk>0&&!p.atkHit.has(e)&&ovr(attackBox(p),eb)){p.atkHit.add(e);if(e.k==='armad'&&e.st==='roll'&&p.atkK==='punch'){e.vx=-e.vx;e.stun=0.6;AU.fx('bonk');continue}hitEnemy(e,p.atkK);continue}
  if(ovr(pb,eb)){const fromTop=p.vy>60&&p.y-eb.y<26;
   if(fromTop&&!(EDEF[e.k].spiky)){if(e.k==='armad'&&e.st==='roll'){e.stun=1.6;e.vx*=0.3;bounce(p);AU.fx('bonk');continue}hitEnemy(e,'stomp');bounce(p);continue}
   if(p.pound&&fromTop){hitEnemy(e,'pound');continue}
   if(p.swing&&!EDEF[e.k].spiky){hitEnemy(e,'kick');continue}
   if(e.k==='armad'&&e.st!=='roll'){p.x+=sgn(p.x-e.x)*3;continue}
   hurtPlayer(p,e.x)}}
 G.ents=G.ents.filter(e=>!e.dead||e.dying>0||e.k==='food'&&!e.dead)}
function bounce(p){p.vy=inp.jump?-720:-480;p.holdJ=inp.jump?1:0;p.pound=0;p.squash=0.5}
function hitEnemy(e,how){e.dead=1;e.dying=1.2;e.vy=-520;e.vx=sgn(e.x-G.p.x)*220;const pts=EDEF[e.k].pts*(G.combo>0?2:1);G.combo=1.2;addScore(pts,e.x,e.y-e.h);AU.fx('kill');hitstop(0.04);
 stars(e.x,e.y-e.h/2,8);ring(e.x,e.y-e.h/2,'rgba(255,255,255,.8)',36,0.25,4);const words={splash:'SPLASH!',ram:'RAM!',stomp:'STOMP!',kick:'KICK!',punch:'POW!',bonk:'BONK!',pound:'POUND!',yum:'YUM!'};ftxt(e.x,e.y-e.h-22,words[how]||'POW!','#ffe060');shake(3)}
function poundWave(p){for(const e of G.ents){if(e.dead||e.k==='food')continue;if(Math.abs(e.x-p.x)<120&&Math.abs(e.y-p.y)<50)hitEnemy(e,'pound')}if(G.boss)bossPound(p)}
function updShots(dt){const p=G.p;for(const s of G.shots){s.t=(s.t||0)+dt;
  if(s.k==='wave'){s.x+=s.vx*dt;s.l-=dt;if(s.l<=0)s.dead=1;const tx=Math.floor((s.x+sgn(s.vx)*14)/TS),ty=Math.floor((s.y+4)/TS);if(!solidK(tileAt(tx,ty))&&tileAt(tx,ty)!==2)s.dead=1;
   if(!p.dead&&Math.abs(p.x-s.x)<22+p.w/2&&p.y>s.y-30&&p.y<=s.y+4&&!p.swing)hurtPlayer(p,s.x);if(Math.random()<0.5)dust(s.x,s.y,1,'rgba(255,220,160,.8)');continue}
  if(s.g)s.vy+=GRAV*0.5*dt*(s.k==='feather'?0:1);s.x+=s.vx*dt;s.y+=s.vy*dt;s.rot=(s.rot||0)+dt*(s.k==='wrench'?12:6);
  if(s.y>LVH+60||s.t>6)s.dead=1;const tx=Math.floor(s.x/TS),ty=Math.floor(s.y/TS);if(solidK(tileAt(tx,ty))&&s.k!=='feather'){s.dead=1;burst(s.x,s.y,6,s.k==='wrench'?['#d8dce8','#8a90a0']:s.k==='netball'?['#f4ecd8','#c8bca0']:['#ffe060','#c8a020'],140,0.4,3);continue}
  if(p.dead)continue;
  if(p.ram>0||p.atk>0&&p.mode==='ride'){const rb=p.ram>0?ramBox(p):attackBox(p);if(ovr(rb,{x:s.x-s.r,y:s.y-s.r,w:s.r*2,h:s.r*2})){s.dead=1;stars(s.x,s.y,5);addScore(30,s.x,s.y);AU.fx('bonk');continue}}
  if(ovr(bx(p),{x:s.x-s.r*0.8,y:s.y-s.r*0.8,w:s.r*1.6,h:s.r*1.6})){s.dead=1;hurtPlayer(p,s.x)}}
 G.shots=G.shots.filter(s=>!s.dead)}
function updItems(dt){const p=G.p;if(p.dead)return;const pb=bx(p);const pad=p.mode==='ride'?10:4;const big={x:pb.x-pad,y:pb.y-pad,w:pb.w+pad*2,h:pb.h+pad*2};
 for(const g of G.L.gems){if(g.got)continue;if(Math.abs(g.x-p.x)>90)continue;if(ovr(big,{x:g.x-12,y:g.y-12,w:24,h:24})){g.got=1;addGem(g.x,g.y)}}
 for(const s of G.L.stars){if(s.got)continue;if(ovr(big,{x:s.x-16,y:s.y-16,w:32,h:32}))getStar(s)}
 for(const cp of G.L.cps){if(!cp.on&&p.x>cp.x-10){cp.on=true;G.cp=cp;AU.fx('cp');ftxt(cp.x,cp.y-110,'CHECKPOINT!','#7aff7a',1);burst(cp.x,cp.y-90,12,['#ff5050','#ffe060','#fff'],200,0.6,3)}}
 G.sign=null;for(const s of G.L.signs){if(Math.abs(p.x-s.x)<120){G.sign=s;s.seen=1}}
 if(G.L.goal&&!G.won&&p.x>G.L.goal.x-20)levelClear();
 if(G.L.cage&&!G.L.cage.open){const cg=G.L.cage,cb={x:cg.x-50,y:cg.y-100,w:100,h:100};cg.cd=Math.max(0,(cg.cd||0)-1/60);let hit=0;
  if(p.atk>0&&!p.atkHit.has(cg)&&ovr(attackBox(p),cb)){p.atkHit.add(cg);hit=1}if(p.ram>0&&cg.cd<=0&&ovr(ramBox(p),cb)){hit=2;cg.cd=0.4;p.ram=0;p.ramCd=0.25;p.vx=-p.face*160}
  if(hit){cg.hp-=hit;cg.sh=0.3;AU.fx('crack');shake(5);burst(cg.x,cg.y-50,10,['#9aa0b0','#5a6070','#ffd23a'],220,0.6,4,1200);if(cg.hp<=0)openCage()}
  if(p.x>cb.x-p.w/2+6){p.x=cb.x-p.w/2+6;p.vx=Math.min(0,p.vx)}}}

/* ===== bosses ===== */
const BSZ={sweep:{w:96,h:150,sc:1},net:{w:76,h:150,sc:1},hover:{w:110,h:110,sc:1},mega:{w:100,h:175,sc:1}};
function startBoss(){const A=G.L.boss,D=BOSSES[A.i],z=BSZ[D.k];G.arena={x0:A.x0,x1:A.x1};
 const b=G.boss={i:A.i,k:D.k,name:D.name,hp:D.hp,max:D.hp,x:A.x1-160,y:A.y,vx:0,vy:0,w:z.w,h:z.h,face:-1,st:'intro',t:0,inv:0,flash:0,ph:1,n:0,gy:A.y,onG:true};
 if(b.k==='hover'){b.y=A.y-200;b.onG=false}if(b.k==='net'){b.perch=1;b.x=A.x0+21.5*TS;b.y=A.y-4*TS}
 AU.music('boss');AU.fx(b.k==='mega'?'laugh':'roar');G.bossIntro=2.2;shake(6)}
function bossOpen(b){return b.st==='dizzy'}
function damageBoss(b,n,how){if(b.inv>0||b.st==='intro'||b.st==='dead'||b.st==='dive'&&b.k==='croc'&&b.sub)return false;const dz=bossOpen(b);const dmg=dz?n+1:n;b.hp-=dmg;b.inv=0.7;b.flash=0.2;AU.fx('hit');shake(9);hitstop(0.08);
 stars(b.x,b.y-b.h*0.7,12);ftxt(b.x,b.y-b.h-24,dz?'CRITICAL!':(how==='stomp'?'STOMP!':'HIT!'),dz?'#ff9a40':'#ffe060',1);addScore(dz?500:250,b.x,b.y-b.h);
 if(b.k==='mega'&&b.ph===1&&b.hp<=b.max/2){b.ph=2;b.st='rage';b.t=0;AU.fx('roar');flash('#ff4020',0.4);ftxt(b.x,b.y-b.h-50,'THE MEGA-BOT IS STEAMING MAD!','#ff6040',1)}
 if(b.hp<=0){b.hp=0;b.st='dead';b.t=0;G.shots.length=0;for(const e of G.ents)if(!e.dead&&e.k!=='food')hitEnemy(e,'pound');AU.fx('roar');shake(16);flash('#fff',0.7);G.slow=1.2}
 else if(!dz&&(b.k==='sweep'||b.k==='mega')&&how!=='stomp'){/* knock back a bit */b.x+=sgn(b.x-G.p.x)*30}
 return true}
function bossPound(p){const b=G.boss;if(!b)return;if(Math.abs(b.x-p.x)<130&&Math.abs(b.y-p.y)<60&&b.st==='dizzy')damageBoss(b,1,'pound')}
function wave(x,y,dir,spd=330){G.shots.push({k:'wave',x,y,vx:dir*spd,l:2.6,r:16})}
function lob(k,x,y,tx,ty,T,r=14){G.shots.push({k,x,y,vx:(tx-x)/T,vy:-(GRAV*0.5*T)+(ty-y)/T,r,g:1})}
function bossGround(b,dt){b.vy+=GRAV*dt;b.y+=b.vy*dt;if(b.y>=b.gy){if(b.vy>300){shake(8);dust(b.x,b.y,10)}b.y=b.gy;const land=b.vy>300;b.vy=0;b.onG=true;return land}b.onG=false;return false}
function updBoss(dt){const b=G.boss,p=G.p,A=G.arena;if(!b)return;b.t+=dt;b.inv=Math.max(0,b.inv-dt);b.flash=Math.max(0,b.flash-dt);const ph2=b.hp<=b.max/2;const dirP=sgn(p.x-b.x);
 if(b.st==='intro'){if(b.k!=='hover'&&b.k!=='net')bossGround(b,dt);if(b.t>1.6){b.st='idle';b.t=0}return}
 if(b.st==='dead'){b.vy+=GRAV*0.4*dt;if(b.k==='hover'){b.y=Math.min(b.gy,b.y+200*dt)}else bossGround(b,dt);if(b.t>0.3&&Math.random()<0.3)stars(b.x+rand(-40,40),b.y-rand(20,b.h),3);if(b.t>2.2&&!G.won)bossBeaten();return}
 if(b.st==='dizzy'){if(b.k==='hover'){b.y=Math.min(b.gy,b.y+400*dt)}else bossGround(b,dt);if(b.t>(b.dz||1.6)){b.st=b.k==='hover'?'rise':(b.k==='net'?'climb':'idle');b.t=0;b.n=0}}
 else if(b.k==='sweep'){
  if(b.st==='idle'){bossGround(b,dt);b.face=dirP;if(b.t>(ph2?1.0:1.4)){b.n++;if(b.n%3===0){b.st='hop';b.t=0;b.vy=-780;AU.fx('roar')}else{b.st='wind';b.t=0}}}
  else if(b.st==='wind'){b.x+=Math.sin(b.t*60)*1.5;if(b.t>0.45){b.st='charge';b.t=0;b.vx=b.face*(ph2?380:340);AU.fx('ram')}}
  else if(b.st==='charge'){bossGround(b,dt);b.x+=b.vx*dt;if(Math.random()<0.5)dust(b.x-b.face*40,b.y,1);if(b.x<A.x0+b.w/2||b.x>A.x1-b.w/2){b.x=clamp(b.x,A.x0+b.w/2,A.x1-b.w/2);b.st='dizzy';b.t=0;b.dz=ph2?2.2:2.6;shake(12);AU.fx('crack');stars(b.x+b.face*40,b.y-b.h*0.8,10)}}
  else if(b.st==='hop'){const land=bossGround(b,dt);if(land){wave(b.x-40,b.y,-1);wave(b.x+40,b.y,1);if(ph2){b.st='hop2';b.t=0;b.vy=-600}else{b.st='idle';b.t=0}AU.fx('pound')}}
  else if(b.st==='hop2'){const land=bossGround(b,dt);if(land){wave(b.x-40,b.y,-1,420);wave(b.x+40,b.y,1,420);b.st='idle';b.t=0;AU.fx('pound')}}}
 else if(b.k==='croc'){const pool={x0:A.x0+10*TS,x1:A.x0+17*TS};
  if(b.st==='idle'){bossGround(b,dt);b.face=dirP;b.x+=b.face*70*dt;if(b.x>pool.x0-50&&b.x<pool.x1+50)b.x-=b.face*140*dt;
   if(Math.abs(p.x-b.x)<170&&b.t>0.5){b.st='bite';b.t=0;AU.fx('roar')}else if(b.t>2.4){b.st='dive';b.t=0;b.sub=0;b.tx=(pool.x0+pool.x1)/2}}
  else if(b.st==='bite'){if(b.t<0.35){b.x-=b.face*30*dt}else if(b.t<0.7){b.x+=b.face*520*dt}else{b.st='idle';b.t=0;b.n++;if(b.n%2===0){b.st='dizzy';b.t=0;b.dz=1.2}}
   if((b.x<pool.x1&&b.x>pool.x0)){b.x=b.face>0?pool.x0-1:pool.x1+1}b.x=clamp(b.x,A.x0+50,A.x1-50)}
  else if(b.st==='dive'){if(!b.sub){const d=b.tx-b.x;b.face=sgn(d);b.x+=sgn(d)*Math.min(Math.abs(d),300*dt);b.y=b.gy-Math.abs(Math.sin(b.t*8))*10;if(Math.abs(d)<4){b.sub=1;b.t=0;splash(b.x,b.gy+20);AU.fx('splash')}}
   else{b.y=b.gy+90;b.x=b.tx+Math.sin(b.t*3)*60;if(b.t>1.3){b.st='leap';b.t=0;b.sub=0;const T=1.0;b.vx=(clamp(p.x,A.x0+60,A.x1-60)-b.x)/T;b.vy=-GRAV*0.5*T-90/T;b.y=b.gy+20;splash(b.x,b.gy+20);AU.fx('splash');b.face=sgn(b.vx)}}}
  else if(b.st==='leap'){b.x+=b.vx*dt;b.vy+=GRAV*dt;b.y+=b.vy*dt;const inPool=b.x>pool.x0&&b.x<pool.x1;if(b.vy>0&&b.y>=b.gy&&!inPool){b.y=b.gy;b.vy=0;shake(10);wave(b.x-40,b.y,-1);wave(b.x+40,b.y,1);b.st='dizzy';b.t=0;b.dz=ph2?1.3:1.7;AU.fx('pound')}
   else if(b.vy>0&&b.y>b.gy+30&&inPool){b.st='dive';b.sub=1;b.t=0.4;b.tx=b.x;splash(b.x,b.gy+20)}}}
 else if(b.k==='net'){const perchX=[A.x0+4.5*TS,A.x0+21.5*TS],perchY=b.gy-4*TS;
  if(b.st==='idle'){if(b.perch){b.y=perchY;b.face=dirP;if(b.t>0.6){b.st='throw';b.t=0;b.n=0}}else{bossGround(b,dt);if(b.t>0.4){b.st='climb';b.t=0}}}
  else if(b.st==='throw'){b.face=dirP;if(b.t>(ph2?0.55:0.8)){b.t=0;b.n++;b.thr=0.3;const T=0.95;lob('netball',b.x+b.face*30,b.y-130,p.x+p.vx*0.4,p.y-20,T,16);if(ph2){lob('netball',b.x+b.face*30,b.y-130,p.x-90,p.y-20,T,16);lob('netball',b.x+b.face*30,b.y-130,p.x+90,p.y-20,T,16)}AU.fx('throw');
    if(b.n>=(ph2?4:3)){b.st='leapdown';b.t=0;b.perch=0;const T2=0.8;b.vx=(clamp(p.x,A.x0+80,A.x1-80)-b.x)/T2;b.vy=-400;AU.fx('roar')}}b.thr=Math.max(0,(b.thr||0)-dt)}
  else if(b.st==='leapdown'){b.x+=b.vx*dt;const land=bossGround(b,dt);if(land){wave(b.x-40,b.y,-1);wave(b.x+40,b.y,1);b.st='dizzy';b.t=0;b.dz=ph2?1.5:1.9;AU.fx('pound')}}
  else if(b.st==='climb'){if(!b.cl){b.cl=1;b.tp=Math.abs(b.x-perchX[0])>Math.abs(b.x-perchX[1])?0:1;b.tp=1-b.tp;const tx=perchX[b.tp],T=0.9;b.vx=(tx-b.x)/T;b.vy=-(GRAV*0.5*T)+(perchY-b.y)/T;b.face=sgn(b.vx)}
   b.x+=b.vx*dt;b.vy+=GRAV*dt;b.y+=b.vy*dt;if(b.vy>0&&b.y>=perchY){b.y=perchY;b.vy=0;b.perch=1;b.cl=0;b.st='idle';b.t=0;b.x=perchX[b.tp]}}}
 else if(b.k==='hover'){const hy=b.gy-210;
  if(b.st==='idle'||b.st==='rise'){if(b.st==='rise'){b.y-=260*dt;if(b.y<=hy){b.y=hy;b.st='idle';b.t=0}}else{b.y=hy+Math.sin(b.t*2)*16}
   b.x+=Math.cos(b.t*0.8)*160*dt;b.x=clamp(b.x,A.x0+80,A.x1-80);b.face=dirP;
   if(b.st==='idle'){b.cd=(b.cd||1.2)-dt;if(b.cd<=0){b.cd=ph2?1.0:1.4;b.n++;for(let i=-1;i<=1;i++){const a=Math.atan2(p.y-40-b.y,p.x-b.x)+i*0.28;G.shots.push({k:'feather',x:b.x,y:b.y-40,vx:Math.cos(a)*300,vy:Math.sin(a)*300,r:10,g:0,rot:a})}AU.fx('throw');
    if(b.n>=(ph2?2:3)){b.st='tele';b.t=0;b.n=0;AU.fx('roar')}}}}
  else if(b.st==='tele'){b.y-=30*dt;b.face=dirP;if(b.t>0.6){b.st='dive';b.t=0;b.tx=p.x;b.ty=b.gy;const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);b.vx=dx/d*640;b.vy=dy/d*640}}
  else if(b.st==='dive'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.x=clamp(b.x,A.x0+60,A.x1-60);if(b.y>=b.gy){b.y=b.gy;shake(12);dust(b.x,b.y,14,'rgba(255,255,255,.9)');wave(b.x-40,b.y,-1,300);wave(b.x+40,b.y,1,300);b.st='dizzy';b.t=0;b.dz=ph2?1.6:2.0;AU.fx('pound')}}}
 else if(b.k==='mega'){
  if(b.st==='rage'){bossGround(b,dt);b.x+=Math.sin(b.t*50)*2;if(b.t>1.2){b.st='idle';b.t=0}}
  else if(b.st==='idle'){bossGround(b,dt);b.face=dirP;if(b.t>(ph2?0.9:1.2)){b.n++;const m=b.n%4;b.st=m===1?'throw':m===2?'leap':m===3?(G.ents.filter(e=>!e.dead&&e.k==='pbot').length<1?'summon':'throw'):'leap';b.t=0;b.c=0}}
  else if(b.st==='throw'){bossGround(b,dt);b.face=dirP;if(b.t>0.35){b.t=0;b.c++;b.thr=0.3;const sp=ph2?[-150,150]:[0];for(const o of sp)lob('wrench',b.x+b.face*30,b.y-140,p.x+o+p.vx*0.3,p.y-20,0.85,14);AU.fx('throw');if(b.c>=2){b.st='idle';b.t=0}}b.thr=Math.max(0,(b.thr||0)-dt)}
  else if(b.st==='summon'){bossGround(b,dt);if(b.t>0.6&&!b.sm){b.sm=1;AU.fx('laugh');for(const sx of[p.x<(A.x0+A.x1)/2?A.x1-60:A.x0+60]){G.ents.push({k:'pbot',x:sx,y:b.gy-200,w:44,h:44,vx:sgn(p.x-sx)*90,vy:0,face:1,hp:1,t:0,st:'walk',x0:sx,y0:b.gy,cd:1,onG:false})}}if(b.t>1.1){b.sm=0;b.st='idle';b.t=0}}
  else if(b.st==='leap'){if(!b.lp){b.lp=1;const tx=clamp(p.x+(p.x<(A.x0+A.x1)/2?120:-120),A.x0+80,A.x1-80);const T=0.85;b.vx=(tx-b.x)/T;b.vy=-GRAV*0.5*T;AU.fx('laugh')}
   b.x+=b.vx*dt;const land=bossGround(b,dt);if(land&&b.t>0.2){b.lp=0;wave(b.x-40,b.y,-1,ph2?340:300);wave(b.x+40,b.y,1,ph2?340:300);b.st='dizzy';b.t=0;b.dz=ph2?2.0:2.4;AU.fx('pound')}}}
 b.x=clamp(b.x,A.x0+30,A.x1-30);
 /* player vs boss */
 if(p.dead||b.st==='dead'||b.st==='intro')return;const bh=b.k==='sweep'&&b.st==='charge'&&G.li===1?b.h*0.45:b.h;const bb={x:b.x-b.w/2,y:b.y-bh,w:b.w,h:bh};if(b.k==='croc'&&b.st==='dive'&&b.sub)return;
 const pb=bx(p);
 if(p.ram>0&&ovr(ramBox(p),bb)){if(damageBoss(b,1,'ram')){p.ram=0;p.ramCd=0.3;p.vx=-p.face*260;p.vy=-300}return}
 if(p.atk>0&&!p.atkHit.has(b)&&ovr(attackBox(p),bb)){p.atkHit.add(b);if(bossOpen(b))damageBoss(b,0,'bonk');else{AU.fx('bonk');ftxt(b.x,b.y-b.h-10,'RAM or STOMP!','#fff')}return}
 if(ovr(pb,bb)){const fromTop=p.vy>40&&p.y-bb.y<34;if(fromTop){damageBoss(b,1,'stomp');p.vy=b.k==='hover'?-560:-760;p.inv=Math.max(p.inv,0.6);p.holdJ=0;p.pound=0;return}
  if(bossOpen(b)||b.st==='rise'||b.st==='climb'||b.st==='rage'){p.x+=sgn(p.x-b.x)*4;return}hurtPlayer(p,b.x)}}
function bossBeaten(){const b=G.boss;save.bosses=save.bosses||{};save.bosses[b.i]=1;persist();if(b.k==='mega'){G.finale=1;const A=G.arena,p=G.p,d=p.x<(A.x0+A.x1)/2?1:-1,px=clamp(p.x+d*150,A.x0+90,A.x1-90),cx=clamp(p.x+d*240,A.x0+40,A.x1-40);p.face=d;G.fin=[{n:'peter',x:px,y:G.L.boss.y+2,fl:d>0,sc:1.05},{n:'cake',x:cx,y:G.L.boss.y+2,fl:false,sc:0.9}];AU.fx('free');ftxt(px,G.L.boss.y-200,'PETER IS FREE!','#7aff7a',1);ftxt(px,G.L.boss.y-170,'HAPPY BIRTHDAY, KELLY!','#ff9ad0',1)}levelClear()}

/* ===== rendering ===== */
let HUDR={x:0,y:0,w:0,h:0},BOSSR=null,TIPR=null;const PAT={};
function pat(n){if(PAT[n])return PAT[n];const im=IMG[n];if(!im)return '#6a4a2a';const p=c.createPattern(im,'repeat');try{p.setTransform(new DOMMatrix().scale(0.5))}catch(e){}return PAT[n]=p}
function hsh(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
function camUpdate(dt,snap){const p=G.p,cm=G.cam;let tx=p.x-viewW*0.4+p.vx*0.25,ty=p.y-VV*0.62;
 if(G.arena){const a=G.arena,aw=a.x1-a.x0;tx=aw<=viewW?a.x0+aw/2-viewW/2:clamp(p.x-viewW/2,a.x0,a.x1-viewW)}
 tx=clamp(tx,0,Math.max(0,G.L.W-viewW));const ymax=LVH-VV,ymin=Math.min(0,ymax);ty=clamp(ty,ymin,ymax);
 if(snap){cm.x=tx;cm.y=ty}else{cm.x+=(tx-cm.x)*Math.min(1,dt*6);cm.y+=(ty-cm.y)*Math.min(1,dt*4)}}
function drawBG(){const Wd=WORLDS[G.L.w!==undefined?G.L.w:LEVELS[G.li].w],im=IMG[Wd.bg];c.fillStyle=Wd.sky;c.fillRect(0,0,W,gameH);if(!im)return;
 const h=gameH*1.08,w=h*im.width/im.height,off=-((G.cam.x*S*0.18)%(w*2)),y=gameH-h+Math.min(0,(-G.cam.y)*S*0.05);
 for(let i=0,x=off;x<W;i++,x+=w){c.save();if(i%2){c.translate(x+w,y);c.scale(-1,1);c.drawImage(im,0,0,w,h)}else c.drawImage(im,x,y,w,h);c.restore()}
 c.fillStyle=Wd.fog;c.fillRect(0,0,W,gameH)}
function drawTiles(){const Wd=WORLDS[LEVELS[G.li].w],T=G.L.T,x0=Math.max(0,Math.floor(G.cam.x/TS)-1),x1=Math.min(G.L.cols-1,Math.ceil((G.cam.x+viewW)/TS)+1);
 const P=pat(Wd.ter);
 for(let tx=x0;tx<=x1;tx++){const col=T[tx];let y=0;while(y<ROWS){if(col[y]===1){let e=y;while(e<ROWS&&col[e]===1)e++;c.fillStyle=P;c.fillRect(tx*TS,y*TS,TS+0.6,(e-y)*TS+(e>=ROWS?80:0));
   c.fillStyle='rgba(0,0,0,.28)';if(tx>0&&T[tx-1]&&!solidK(T[tx-1][y]))c.fillRect(tx*TS,y*TS,4,(e-y)*TS+80);if(tx<G.L.cols-1&&!solidK(T[tx+1][y]))c.fillRect(tx*TS+TS-4,y*TS,4,(e-y)*TS+80);y=e}else y++}}
 for(let tx=x0;tx<=x1;tx++){const col=T[tx];for(let ty=0;ty<ROWS;ty++){const k=col[ty],X=tx*TS,Y=ty*TS;
  if(k===1&&(ty===0||!solidK(col[ty-1]))){/* grass / snow cap */c.fillStyle=Wd.top2;c.fillRect(X,Y,TS+0.6,12);c.fillStyle=Wd.top;c.fillRect(X,Y-2,TS+0.6,8);
   for(let i=0;i<5;i++){const hx=X+hsh(tx,i)*TS,hh=6+hsh(i,tx)*9;c.beginPath();c.moveTo(hx-3,Y+2);c.lineTo(hx+1+Math.sin(G.t*2+hx)*1.5,Y-hh);c.lineTo(hx+3,Y+2);c.fill()}
   if(hsh(tx,99)<0.12&&Wd.top!=='#f4f8ff'){c.fillStyle=['#ff6a8a','#ffe060','#fff'][(hsh(tx,7)*3)|0];c.beginPath();c.arc(X+hsh(tx,5)*TS,Y-6,3,0,TAU);c.fill()}}
  else if(k===2){c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X+2,Y+12,TS-4,6);c.fillStyle=Wd.plank;c.beginPath();c.roundRect?c.roundRect(X,Y,TS+0.5,14,4):c.rect(X,Y,TS,14);c.fill();c.fillStyle='rgba(255,255,255,.22)';c.fillRect(X+3,Y+2,TS-6,3);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X+TS-2,Y,2,14)}
  else if(k===3){c.fillStyle='#b8622e';c.fillRect(X,Y,TS,TS);c.fillStyle='#8a4418';for(let r=0;r<3;r++){c.fillRect(X,Y+r*13+12,TS,2);const o=r%2?TS/2:0;c.fillRect(X+o,Y+r*13,2,13);c.fillRect(X+((o+TS/2)%TS),Y+r*13,2,13)}
   c.strokeStyle='rgba(40,16,4,.7)';c.lineWidth=1.5;c.beginPath();c.moveTo(X+8,Y+6);c.lineTo(X+18,Y+18);c.lineTo(X+14,Y+30);c.moveTo(X+18,Y+18);c.lineTo(X+30,Y+22);c.stroke();c.strokeStyle='rgba(0,0,0,.35)';c.strokeRect(X+0.5,Y+0.5,TS-1,TS-1)}
  else if(k===4){if(IMG.rock)c.drawImage(IMG.rock,X-1,Y-1,TS+2,TS+2);else{c.fillStyle='#999';c.fillRect(X,Y,TS,TS)}}
  else if(k===7){c.fillStyle='rgba(10,14,30,.35)';c.fillRect(X+4,Y,TS-8,TS);c.fillStyle='#2a2e3a';for(let i=0;i<3;i++){c.fillRect(X+6+i*12,Y,6,TS)}c.fillStyle='#4a5064';for(let i=0;i<3;i++)c.fillRect(X+7+i*12,Y,2,TS);c.fillStyle='#3a3f50';c.fillRect(X,Y+TS-8,TS,6);if(ty===0||col[ty-1]!==7){c.fillStyle='#c8a030';for(let i=0;i<3;i++){c.beginPath();c.moveTo(X+5+i*12,Y+2);c.lineTo(X+9+i*12,Y-10);c.lineTo(X+13+i*12,Y+2);c.fill()}}if(ty+1<ROWS&&col[ty+1]!==7&&ty>2){c.fillStyle='#d8b040';rr(X+12,Y+TS-26,16,14,3);c.fill();c.strokeStyle='#d8b040';c.lineWidth=3;c.beginPath();c.arc(X+20,Y+TS-26,5,Math.PI,0);c.stroke();c.fillStyle='#5a4010';c.fillRect(X+19,Y+TS-21,3,5)}}
  else if(k===5){c.fillStyle='#3a2a14';for(let i=0;i<4;i++){const bx0=X+i*10;c.beginPath();c.moveTo(bx0,Y+TS);c.lineTo(bx0+5,Y+TS-24-hsh(tx,i)*10);c.lineTo(bx0+10,Y+TS);c.fill()}c.fillStyle='#5a7a2a';c.beginPath();c.ellipse(X+TS/2,Y+TS-6,TS/2,8,0,0,TAU);c.fill();c.fillStyle='#e8e0c0';for(let i=0;i<5;i++){c.fillRect(X+4+i*8,Y+TS-18-hsh(i,tx)*12,2,6)}}
  else if(k===6&&(ty===0||col[ty-1]!==6)){const g=c.createLinearGradient(0,Y,0,Y+TS*2+80);g.addColorStop(0,'rgba(80,180,240,.92)');g.addColorStop(1,'rgba(10,50,120,.96)');c.fillStyle=g;c.fillRect(X,Y+4,TS+0.6,TS*2+80);
   c.fillStyle='rgba(230,250,255,.8)';for(let i=0;i<4;i++){const wx=X+i*10+Math.sin(G.t*3+tx+i)*2;c.fillRect(wx,Y+3+Math.sin(G.t*4+i+tx)*2,6,2)}}}}}
function drawEnt(e){const fl=e.face>0;if(e.dead&&!e.dying)return;c.save();if(e.dying){c.translate(e.x,e.y-e.h/2);c.rotate(e.rot||0);c.translate(-e.x,-(e.y-e.h/2));c.globalAlpha=clamp(e.dying,0,1)}
 if(e.k==='food'){const n=e.f==='bananas'?'bananas':'peanuts';spr(n,e.x,e.y+18+Math.sin(e.t*2)*3,0.9);if(G.p.mode==='ride'&&Math.hypot(e.x-G.p.x,e.y-G.p.y)<200){c.globalAlpha=0.5+0.5*Math.sin(G.t*6);c.strokeStyle='#fff6a0';c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,24,0,TAU);c.stroke()}}
 else if(e.k==='hyena'){if(e.dying||e.stun>0||!drawHyenaRig(e,e.x,e.y+3,0.98,fl))spr(e.dying||e.stun>0?'hy_dizzy':'hy_walk1',e.x,e.y+3,0.98,fl)}
 else if(e.k==='beetle'){if(e.dying||e.stun>0||!drawBeetleRig(e,e.x,e.y+2,1,fl,Math.sin(e.t*16)*0.02))spr('beetle1',e.x,e.y+2,1,fl,1,e.dying?0:Math.sin(e.t*16)*0.03)}
 else if(e.k==='drone'){const yy=e.y+4+Math.sin(G.t*9)*1.5;spr('drone',e.x,yy,1,!fl);c.save();c.translate(e.x,yy-30);for(const dx of[-14,14]){const w=Math.abs(Math.sin(G.t*40+dx))*13+3;c.fillStyle='rgba(220,230,255,.55)';c.beginPath();c.ellipse(dx,-4,w,2.6,0,0,TAU);c.fill();c.fillStyle='#4a5064';c.fillRect(dx-1.5,-4,3,6)}c.restore();if(Math.floor(G.t*3)%2){c.fillStyle='rgba(255,60,60,.35)';c.beginPath();c.arc(e.x+(fl?8:-8),yy-15,9,0,TAU);c.fill()}}
 else if(e.k==='pbot'){const roll=(e.x/9)%TAU,yy=e.y+2+Math.abs(Math.sin(e.t*9))*1.2;c.save();c.globalAlpha*=0.22;c.fillStyle='#fff6a0';c.beginPath();const d=fl?1:-1;c.moveTo(e.x+d*22,yy-22);c.lineTo(e.x+d*130,yy-48);c.lineTo(e.x+d*130,yy+2);c.closePath();c.fill();c.restore();
  for(const wx of[-12,12]){c.save();c.translate(e.x+wx,yy-7);c.rotate(roll*sgn(e.vx||1));c.fillStyle='#22262e';c.beginPath();c.arc(0,0,7.5,0,TAU);c.fill();c.strokeStyle='#8a90a0';c.lineWidth=2;c.beginPath();c.moveTo(-5,0);c.lineTo(5,0);c.moveTo(0,-5);c.lineTo(0,5);c.stroke();c.restore()}
  if(e.stun>0)spr('pbot',e.x,yy-10,1,!fl,1,Math.sin(G.t*20)*0.1);else spr('pbot',e.x,yy-10,1,!fl)}
 else if(e.k==='porc')spr('porc',e.x,e.y+2,1,fl,1,Math.sin(e.t*8)*0.03);
 else if(e.k==='owl')spr(e.st==='dive'||Math.floor(e.t*6)%2?'owl2':'owl1',e.x,e.y+10,1,!fl);
 else if(e.k==='monkey')spr('monkey',e.x,e.y+2,1,fl,1,e.thr>0?-0.15*(fl?-1:1):0);
 else if(e.k==='armad'){spr('armad',e.x,e.y+2,1,fl,1,e.st==='roll'?e.rot||0:0,e.st==='roll'?0.5:1);if(e.st==='roll'){/* rolling: draw centered */}}
 c.restore();if(e.stun>0&&!e.dying)dizzyStars(e.x,e.y-e.h-6,18)}
function dizzyStars(x,y,r){for(let i=0;i<3;i++){const a=G.t*5+i*TAU/3;spr('star',x+Math.cos(a)*r,y+Math.sin(a)*r*0.35+6,0.45)}}
function drawPlayer(p){if(p.inv>0&&Math.floor(p.inv*14)%2&&!p.dead)return;let n,rot=0;const ride=p.mode==='ride';
 if(ride){if(p.ledge){n='ride_jump';rot=-p.face*0.35}else if(p.tng>0)n='ride_tongue';else if(p.ram>0||p.swing||p.pound)n='ride_ram';else if(!p.onG)n='ride_jump';else if(Math.abs(p.vx)>30)n=Math.floor(p.anim*9)%2?'ride_run1':'ride_run2';else n='ride_idle';
  if(p.swing)rot=-p.swing.a*0.6+(p.face>0?-0.5:0.5);if(p.pound)rot=p.face*0.9;if(p.ram>0&&p.ramDy<0)rot=-p.face*1.1}
 else{if(p.atk>0)n=p.atkK==='kick'?'kelly_kick':'kelly_punch';else if(!p.onG)n='kelly_jump';else if(Math.abs(p.vx)>30)n=Math.floor(p.anim*9)%2?'kelly_run1':'kelly_run2';else n='kelly_idle'}
 if(p.onG&&!p.dead){c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(p.x,p.y,ride?44:20,6,0,0,TAU);c.fill()}
 if(p.swing){const hp=headPt(p),h=p.swing.h;c.strokeStyle='#5a3a1a';c.lineWidth=3;c.beginPath();c.moveTo(h.x,h.y+20);c.lineTo(hp.x,hp.y);c.stroke()}
 if(p.tng>0&&p.tngT){const hp=headPt(p),o=p.tngT.o,k=1-Math.abs(p.tng-0.15)/0.15,tx=lerp(hp.x,o.x,k),ty=lerp(hp.y+14,o.y,k);c.strokeStyle='#e8507a';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(hp.x+p.face*6,hp.y+16);c.lineTo(tx,ty);c.stroke();c.fillStyle='#ff7aa0';c.beginPath();c.arc(tx,ty,6,0,TAU);c.fill()}
 const sq=p.squash>0?1+p.squash*0.12:1;c.save();c.translate(p.x,p.y);c.scale(1/sq*(1),sq>1?1/sq*0.98+0.02:1);c.translate(-p.x,-p.y);
 const anchorY=p.swing?0.5:1,yy=p.swing?p.y-p.h*0.5:p.y+2;
 const rdt=clamp(p.anim-(p._la===undefined?p.anim:p._la),0,0.1);p._la=p.anim;const isRun=/_run[12]$/.test(n),amp=rigStep(p,rdt,isRun,PH[p.mode].spd),useRig=!p.dead&&(isRun||(/_idle$/.test(n)&&p.onG&&p._ramt>0.15));
 if(!(useRig&&(ride?drawRideRig(p,p.x,yy,1,p.face<0,amp):drawKellyRig(p,p.x,yy,0.98,p.face<0,amp))))spr(n,p.x,yy,ride?1:0.98,p.face<0,1,rot,anchorY);c.restore();
 if(p.ram>0){c.globalAlpha=0.5;spr(n,p.x-p.face*22,p.y+2,1,p.face<0,0.4,rot);c.globalAlpha=1}
 if(G.p.mode==='ride'&&!p.swing){const hk=nearHook(p);if(hk){c.strokeStyle='rgba(255,240,140,'+(0.5+0.5*Math.sin(G.t*10))+')';c.lineWidth=3;c.beginPath();c.arc(hk.x,hk.y+38,22,0,TAU);c.stroke()}}}
function drawBoss(b){if(!b)return;const k=b.k;let n;const st=b.st;
 if(st==='dizzy'||st==='dead')n=k+'_dizzy';
 else if(k==='sweep')n=st==='charge'||st==='wind'?'sweep_charge':'sweep_idle';
 else if(k==='croc')n=st==='bite'&&b.t>0.3||st==='leap'?'croc_bite':'croc_idle';
 else if(k==='net')n=b.thr>0||st==='leapdown'?'net_throw':'net_idle';
 else if(k==='hover')n=st==='dive'||st==='tele'?'hover_dive':'hover_fly';
 else n=st==='rage'||(b.ph===2&&st!=='throw')?'mega_rage':(b.thr>0?'mega_throw':'mega_idle');
 const fl=b.face>0;if(b.onG||k!=='hover'){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(b.x,b.gy-(b.perch?4*TS:0)+(b.perch?0:0),b.w*0.6,9,0,0,TAU);c.fill()}
 if(k==='croc'&&st==='dive'&&b.sub){c.save();c.beginPath();c.rect(b.x-200,b.gy-200,400,215);c.clip();spr(n,b.x,b.y,1,fl);c.restore();for(let i=0;i<2;i++)if(Math.random()<0.2)P({x:b.x+rand(-30,30),y:b.gy+14,vx:0,vy:-40,l:0.5,m:0.5,s:4,c:'rgba(220,250,255,.8)',g:-50});return}
 if(b.ph===2&&k==='mega'&&st!=='dead'){c.save();c.globalAlpha=0.35+0.15*Math.sin(G.t*8);c.fillStyle='#ff3020';c.beginPath();c.ellipse(b.x,b.y-b.h/2,b.w,b.h*0.65,0,0,TAU);c.fill();c.restore()}
 if(st==='tele'){c.save();c.globalAlpha=0.4+0.4*Math.sin(G.t*30);c.fillStyle='#ff4060';c.beginPath();c.arc(b.x,b.y-60,90,0,TAU);c.fill();c.restore()}
 const yy=b.y+4+(st==='wind'?Math.sin(G.t*50)*2:0);
 const fa=st==='dead'?clamp(1-(b.t-0.8)/1.2,0,1):1;if(fa<=0)return;if(b.flash>0)sprT(n,'#ffffff',b.x,yy,1,fl,0.9*fa);else spr(n,b.x,yy,1,fl,fa);
 if(st==='dizzy')dizzyStars(b.x,b.y-b.h-10,40)}
function drawShot(s){if(s.k==='banana')spr('bananas',s.x,s.y,0.6,false,1,s.rot,0.5);else if(s.k==='netball')spr('netball',s.x,s.y,1,false,1,s.rot,0.5);else if(s.k==='wrench')spr('wrench',s.x,s.y,1,false,1,s.rot,0.5);
 else if(s.k==='feather'){c.save();c.translate(s.x,s.y);c.rotate(s.rot);c.globalCompositeOperation='lighter';c.fillStyle='rgba(120,220,255,.5)';c.beginPath();c.ellipse(0,0,20,8,0,0,TAU);c.fill();c.strokeStyle='#fff8a0';c.lineWidth=3;c.beginPath();c.moveTo(-16,0);c.lineTo(-6,-5);c.lineTo(2,4);c.lineTo(16,-2);c.stroke();c.restore()}
 else if(s.k==='wave'){c.save();c.translate(s.x,s.y);c.scale(sgn(s.vx),1);c.fillStyle='rgba(255,230,180,.85)';c.beginPath();c.moveTo(-18,0);c.quadraticCurveTo(0,-46,18,0);c.closePath();c.fill();c.strokeStyle='rgba(140,90,40,.8)';c.lineWidth=3;c.stroke();c.restore()}}
function drawWorld(){const L=G.L,cm=G.cam;c.save();c.translate(-cm.x,-cm.y);
 const vx0=cm.x-80,vx1=cm.x+viewW+80,vis=x=>x>vx0&&x<vx1;
 for(const s of L.signs)if(vis(s.x))spr('sign',s.x,s.y+2,0.8);
 for(const lp of L.lamps)if(vis(lp.x)){spr('lamp',lp.x,lp.y+2,0.62,false,0.9);drawLampGlow(lp.x,lp.y-62,70,0.32+0.04*Math.sin(G.t*3+lp.x))}
 for(const cp of L.cps)if(vis(cp.x)){if(cp.on){spr('lamp',cp.x,cp.y+2,0.9);drawLampGlow(cp.x,cp.y-92,110,0.55+0.08*Math.sin(G.t*4))}else sprT('lamp','rgba(30,36,60,1)',cp.x,cp.y+2,0.9,false,0.75)}
 if(L.goal&&vis(L.goal.x)){const gx=L.goal.x,gy=L.goal.y;spr('lamp',gx-36,gy+2,1.15);spr('lamp',gx+36,gy+2,1.15);drawLampGlow(gx-36,gy-118,120,0.6);drawLampGlow(gx+36,gy-118,120,0.6);spr('sign',gx,gy+2,0.9);c.textAlign='center';c.font='18px "Lilita One",sans-serif';c.lineWidth=5;c.strokeStyle='#1a0a30';c.strokeText('GOAL!',gx,gy-150+Math.sin(G.t*4)*3);c.fillStyle='#ffe27a';c.fillText('GOAL!',gx,gy-150+Math.sin(G.t*4)*3);if(Math.random()<0.2)stars(gx+rand(-50,50),gy-rand(40,150),1)}
 if(L.cage&&vis(L.cage.x)){const cg=L.cage;cg.sh=Math.max(0,(cg.sh||0)-0.016);const sh=cg.sh>0?Math.sin(G.t*80)*4:0;if(!cg.open){const fq={k:cg.pal,ph:0,amp:0,air:0,face:-1,mv:0};c.save();c.translate(cg.x+sh,cg.y);c.scale(0.78,0.78);c.translate(-(cg.x+sh),-cg.y);drawPal(Object.assign(fq,{x:cg.x+sh,y:cg.y-4}));c.restore();spr('zcage',cg.x+sh,cg.y+4,1);if(G.p&&Math.abs(G.p.x-cg.x)<280){c.textAlign='center';c.font='18px "Lilita One",sans-serif';c.lineWidth=5;c.strokeStyle='#0a1430';const t='BONK THE CAGE! ('+Math.max(0,cg.hp)+')';c.strokeText(t,cg.x,cg.y-118);c.fillStyle='#fff';c.fillText(t,cg.x,cg.y-118)}}}
 drawTiles();drawHelps(vis);
 for(const h of L.hooks)if(vis(h.x)){c.strokeStyle='#4a3a2a';c.lineWidth=3;c.beginPath();c.moveTo(h.x,h.y-600);c.lineTo(h.x,h.y-10);c.stroke();spr('hook',h.x,h.y+44,1,false,1,Math.sin(G.t*2+h.x)*0.06)}
 for(const g of L.gems)if(!g.got&&vis(g.x)){spr('gem',g.x,g.y+11+Math.sin(G.t*3+g.t)*2,0.95);if(hsh(g.x|0,(G.t*4)|0)<0.04)stars(g.x+rand(-8,8),g.y-6,1)}
 for(const s of L.stars)if(!s.got&&vis(s.x)){c.save();c.globalAlpha=0.35;c.fillStyle='#fff2a0';c.beginPath();c.arc(s.x,s.y,24+Math.sin(G.t*4)*4,0,TAU);c.fill();c.restore();spr('star',s.x,s.y+16,1.25+Math.sin(G.t*4)*0.08,false,1,Math.sin(G.t*2)*0.2)}
 for(const e of G.ents)if(vis(e.x))drawEnt(e);
 if(G.pals)for(const q of G.pals)if(vis(q.x))drawPal(q);
 drawBoss(G.boss);
 if(G.fin){for(const f of G.fin)spr(f.n,f.x,f.y,f.sc||1,f.fl)}
 if(G.p)drawPlayer(G.p);
 for(const s of G.shots)drawShot(s);
 for(const q of G.parts){const a=clamp(q.l/q.m,0,1);c.globalAlpha=a;if(q.ring){c.strokeStyle=q.c;c.lineWidth=q.w*a;c.beginPath();c.arc(q.x,q.y,q.s*(1.2-a),0,TAU);c.stroke()}else{c.fillStyle=q.c;if(q.puff){c.beginPath();c.arc(q.x,q.y,q.s*(1.5-a*0.5),0,TAU);c.fill()}else c.fillRect(q.x-q.s/2,q.y-q.s/2,q.s,q.s)}}c.globalAlpha=1;
 c.textAlign='center';for(const t of G.texts){const a=clamp(t.l/t.m*1.6,0,1);c.globalAlpha=a;c.font=(t.big?'26px':'18px')+' "Lilita One",sans-serif';c.lineWidth=5;c.strokeStyle='rgba(30,10,0,.85)';c.strokeText(t.s,t.x,t.y);c.fillStyle=t.c;c.fillText(t.s,t.x,t.y)}c.globalAlpha=1;
 c.restore()}
function ambient(dt){const Wd=WORLDS[LEVELS[G.li].w];G.amb=G.amb||[];if(G.amb.length<(Wd.amb==='fireflies'?16:40)&&Math.random()<dt*(Wd.amb==='fireflies'?6:20)){G.amb.push({x:Math.random()*W,y:Wd.amb==='snow'||Wd.amb==='leaves'||Wd.amb==='sparkle'?-10:Wd.amb==='embers'||Wd.amb==='bubbles'?gameH+10:Math.random()*gameH,vx:rand(-20,20)+(Wd.amb==='snow'?-30:0),vy:Wd.amb==='snow'?rand(40,90):Wd.amb==='sparkle'?rand(25,55):Wd.amb==='leaves'?rand(30,60):Wd.amb==='embers'?-rand(30,70):Wd.amb==='bubbles'?-rand(20,40):rand(-5,5),l:rand(4,9),s:rand(1.5,4),k:Wd.amb,ph:Math.random()*6})}
 for(const a of G.amb){a.x+=(a.vx+Math.sin(G.t+a.ph)*15)*dt-G.camDx*S*0.3;a.y+=a.vy*dt;a.l-=dt}G.amb=G.amb.filter(a=>a.l>0&&a.y>-20&&a.y<gameH+20&&a.x>-30&&a.x<W+30);
 for(const a of G.amb){c.globalAlpha=Math.min(1,a.l);c.fillStyle=a.k==='fireflies'?'rgba(230,255,120,'+(0.55+0.45*Math.sin(G.t*4+a.ph))+')':a.k==='sparkle'?['#ff8ad0','#ffe060','#9ad8ff','#b0ff9a'][(a.ph*10|0)%4]:a.k==='snow'?'#fff':a.k==='leaves'?'#7ac04a':a.k==='embers'?'#ffa040':a.k==='bubbles'?'rgba(220,250,255,.7)':'rgba(255,240,200,.6)';
  if(a.k==='fireflies'){c.save();c.globalCompositeOperation='lighter';c.beginPath();c.arc(a.x,a.y,a.s*0.8,0,TAU);c.fill();c.globalAlpha*=0.22;c.beginPath();c.arc(a.x,a.y,a.s*2.4,0,TAU);c.fill();c.restore()}else if(a.k==='sparkle'){c.save();c.translate(a.x,a.y);c.rotate(G.t*3+a.ph);c.fillRect(-a.s,-a.s*0.5,a.s*2,a.s);c.restore()}else if(a.k==='leaves'){c.save();c.translate(a.x,a.y);c.rotate(G.t*2+a.ph);c.beginPath();c.ellipse(0,0,a.s*2,a.s,0,0,TAU);c.fill();c.restore()}else{c.beginPath();c.arc(a.x,a.y,a.s,0,TAU);c.fill()}}c.globalAlpha=1}
function rr(x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
function heart(x,y,s,full){c.save();c.translate(x,y);c.scale(s/16,s/16);c.beginPath();c.moveTo(0,5);c.bezierCurveTo(-8,-3,-8,-9,-3,-9);c.bezierCurveTo(-1,-9,0,-7,0,-6);c.bezierCurveTo(0,-7,1,-9,3,-9);c.bezierCurveTo(8,-9,8,-3,0,5);c.closePath();c.fillStyle=full?'#ff3a5a':'rgba(0,0,0,.45)';c.fill();c.lineWidth=1.6;c.strokeStyle='#fff';c.stroke();c.restore()}
function drawHUD(){const p=G.p,x=10+SAFE.l,y=8+SAFE.t;c.textAlign='left';
 const pw=portrait?Math.min(W-130-SAFE.r-x,250):250,ph=62;c.fillStyle='rgba(20,10,0,.48)';rr(x,y,pw,ph,16);c.fill();
 c.save();c.beginPath();c.arc(x+31,y+31,25,0,TAU);c.fillStyle='#7fd8d0';c.fill();c.clip();const im=IMG.ride_idle;if(im)c.drawImage(im,im.width*0.36,0,im.width*0.64,im.width*0.64,x+6,y+8,50,50);c.restore();c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(x+31,y+31,25,0,TAU);c.stroke();
 for(let i=0;i<p.maxhp;i++)heart(x+70+i*22,y+18,18,i<p.hp);
 c.font='17px "Lilita One",sans-serif';c.fillStyle='#fff';c.strokeStyle='rgba(0,0,0,.7)';c.lineWidth=3;
 const t1='x'+G.lives;c.strokeText(t1,x+72+p.maxhp*22,y+24);c.fillText(t1,x+72+p.maxhp*22,y+24);
 spr('gem',x+78,y+52,0.45);const t2=String(G.gems).padStart(2,'0');c.strokeText(t2,x+88,y+52);c.fillText(t2,x+88,y+52);
 for(let i=0;i<3;i++){if(G.lvStars[i])spr('star',x+126+i*19,y+53,0.42);else{c.globalAlpha=0.35;spr('star',x+126+i*19,y+53,0.42);c.globalAlpha=1}}
 const sc=String(G.score).padStart(6,'0');c.textAlign='right';c.strokeText(sc,x+pw-10,y+52);c.fillStyle='#ffe27a';c.fillText(sc,x+pw-10,y+52);
 HUDR={x,y,w:pw,h:ph};
 /* friends row: who is with you, current helper ringed in gold */
 if(G.pals&&G.pals.length){const cur=curPal();let fx=x;const fy=y+ph+6,r=19;for(const k of PAL_ORDER){const q=palOf(k);if(!q)continue;const on=k===cur;
  c.save();c.beginPath();c.arc(fx+r,fy+r,r,0,TAU);c.fillStyle=on?'rgba(40,70,140,.9)':'rgba(20,20,40,.6)';c.fill();c.clip();const im=IMG[k==='ele'?'ele_body':k==='pen'?'pen_body':'koa_body'];
  if(im){const sc=Math.min((r*2.6)/im.width,(r*2.6)/im.height);const w=im.width*sc,h=im.height*sc;c.drawImage(im,fx+r-w*(k==='pen'?0.5:0.62),fy+r-h*0.32,w,h)}c.restore();
  c.strokeStyle=on?'#ffd23a':'#fff';c.lineWidth=on?3.5:2;c.beginPath();c.arc(fx+r,fy+r,r,0,TAU);c.stroke();if(q.busy){c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.arc(fx+r,fy+r,r,0,TAU);c.fill()}fx+=r*2+6}
  const nm=PALS[cur]&&PALS[cur].short;if(nm){c.textAlign='left';c.font='14px "Lilita One",sans-serif';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.75)';const t='ACTION: '+nm;c.strokeText(t,fx+2,fy+r+5);c.fillStyle='#ffe27a';c.fillText(t,fx+2,fy+r+5)}HUDR.h=ph+6+r*2}
 if(G.palBanner&&G.palBanner.t>0){const a=clamp(G.palBanner.t,0,1),k=G.palBanner.k;c.globalAlpha=a;c.textAlign='center';c.font='26px "Lilita One",sans-serif';c.lineWidth=6;c.strokeStyle='#0a1430';const yy=gameH*0.30,t=PALS[k].name+' JOINED YOU!';c.strokeText(t,W/2,yy);c.fillStyle='#7aff7a';c.fillText(t,W/2,yy);
  const t2=k==='ele'?'Tap ACTION at dry moats: she sprays water!':k==='pen'?'Tap ACTION at low gates: he slides under!':'Tap ACTION at tall fences: she climbs to the switch!';c.font='17px "Lilita One",sans-serif';c.lineWidth=4;c.strokeText(t2,W/2,yy+28);c.fillStyle='#fff';c.fillText(t2,W/2,yy+28);c.globalAlpha=1}
 /* boss bar */
 BOSSR=null;const b=G.boss;if(b&&b.st!=='dead'||b&&b.hp>0){const rightRes=130+SAFE.r;let bxp,byp,bw;const free0=x+pw+12,free1=W-rightRes;
  if(free1-free0>=300){bw=Math.min(440,free1-free0);bxp=free0+(free1-free0-bw)/2;byp=y+6}else{bxp=x;bw=W-x-10-SAFE.r;byp=y+HUDR.h+8}
  c.fillStyle='rgba(20,0,0,.6)';rr(bxp,byp,bw,46,12);c.fill();c.textAlign='center';c.font='15px "Lilita One",sans-serif';c.fillStyle='#fff';c.fillText(b.name,bxp+bw/2,byp+18);
  c.fillStyle='rgba(0,0,0,.6)';rr(bxp+10,byp+25,bw-20,13,6);c.fill();const f=clamp(b.hp/b.max,0,1);const g=c.createLinearGradient(bxp,0,bxp+bw,0);g.addColorStop(0,'#ff3030');g.addColorStop(1,'#ffb030');c.fillStyle=g;rr(bxp+10,byp+25,(bw-20)*f,13,6);c.fill();BOSSR={x:bxp,y:byp,w:bw,h:46}}
 /* sign tip */
 TIPR=null;if(G.sign&&!G.boss&&!G.cut){const s=G.sign.text;const top=Math.max(y+HUDR.h,BOSSR?BOSSR.y+BOSSR.h:0)+10;const maxW=Math.min(560,W-24-SAFE.l-SAFE.r);c.font='17px "Baloo 2",sans-serif';const lines=wrapText(s,maxW-28);const bh=lines.length*22+16;let bxp=(W-maxW)/2;
  c.fillStyle='rgba(255,248,225,.94)';rr(bxp,top,maxW,bh,14);c.fill();c.strokeStyle='#8a5a2a';c.lineWidth=3;c.stroke();c.fillStyle='#3a2210';c.textAlign='center';lines.forEach((l,i)=>c.fillText(l,W/2,top+28+i*22-6));TIPR={x:bxp,y:top,w:maxW,h:bh}}
 /* level banner */
 if(G.banner>0){const a=clamp(G.banner,0,1);c.globalAlpha=a;c.textAlign='center';c.font='30px "Lilita One",sans-serif';c.lineWidth=6;c.strokeStyle='#3a1a00';const L=LEVELS[G.li];const t='ZONE '+(L.w+1)+'-'+L.n+': '+L.name.toUpperCase();const yy=gameH*0.4;c.strokeText(t,W/2,yy);c.fillStyle='#ffe27a';c.fillText(t,W/2,yy);c.globalAlpha=1}
 if(G.bossIntro>0&&G.boss){const a=clamp(G.bossIntro,0,1);c.globalAlpha=a;c.textAlign='center';c.font='34px "Lilita One",sans-serif';c.lineWidth=7;c.strokeStyle='#300';const yy=gameH*0.42;c.strokeText(G.boss.name,W/2,yy);c.fillStyle='#ff7040';c.fillText(G.boss.name,W/2,yy);c.globalAlpha=1}}
function wrapText(s,mw){const w=s.split(' '),out=[];let l='';for(const x of w){const t=l?l+' '+x:x;if(c.measureText(t).width>mw&&l){out.push(l);l=x}else l=t}if(l)out.push(l);return out}
function drawPadBG(){if(!portrait)return;const g=c.createLinearGradient(0,gameH,0,H);g.addColorStop(0,'#16224e');g.addColorStop(1,'#080c22');c.fillStyle=g;c.fillRect(0,gameH,W,H-gameH);c.fillStyle='#ffd04a';c.fillRect(0,gameH,W,3);
 c.fillStyle='#fff';for(let i=0;i<26;i++){const y=gameH+12+((i*53)%Math.max(1,H-gameH-20)),x=(i*137+i*i*7)%W;c.globalAlpha=0.18+0.22*Math.abs(Math.sin((G?G.t:0)*1.5+i));c.beginPath();c.arc(x,y,i%5===0?1.8:1.1,0,TAU);c.fill()}c.globalAlpha=1}
function render(){c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,W,H);if(!G){c.fillStyle='#1d1206';c.fillRect(0,0,W,H);return}
 c.save();c.beginPath();c.rect(0,0,W,gameH);c.clip();drawBG();
 const sx=G.shake>0?rand(-G.shake,G.shake):0,sy=G.shake>0?rand(-G.shake,G.shake):0;c.save();c.translate(sx,sy);c.scale(S,S);drawWorld();c.restore();
 ambient(G.dtR||0.016);if(G.flash&&G.flash.a>0){c.globalAlpha=G.flash.a;c.fillStyle=G.flash.c;c.fillRect(0,0,W,gameH);c.globalAlpha=1}
 const vg=c.createRadialGradient(W/2,gameH/2,Math.min(W,gameH)*0.45,W/2,gameH/2,Math.max(W,gameH)*0.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=vg;c.fillRect(0,0,W,gameH);
 c.restore();drawPadBG();if(state==='play'||state==='pause')drawHUD()}

/* ===== run-cycle rig: real alternating strides (body art + animated legs) ===== */
function rigLimb(x,y,a,len,w,fill,line){const ex=x+Math.sin(a)*len,ey=y+Math.cos(a)*len;c.lineCap='round';
 c.strokeStyle=line;c.lineWidth=w+3.2;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();
 c.strokeStyle=fill;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();return[ex,ey]}
function rigStep(p,dt,running,spd){if(p._rph===undefined){p._rph=0;p._ramt=0}
 p._ramt+=((running?1:0)-p._ramt)*Math.min(1,dt*14);
 const v=Math.abs(p.vx);if(running)p._rph=(p._rph+Math.min(1.375,v/(p.mode==='ride'?118:78))*dt)%1;/* cadence (arm check, Oct 30 2026): capped at ~2.75 steps/s (Jinxy gallop was ~5) */
 else if(p._ramt>0.02){/* settle the nearer leg pair toward a neutral passing pose */const t=p._rph%0.5;p._rph+=(t<0.25?-t:0.5-t)*Math.min(1,dt*10)}
 return p._ramt*clamp(v/spd,0.55,1)+0.0}
/* Kelly on foot. ix/iy in sprite pixels; bottom-centre of the sprite = ground */
function kellyLeg(hx,hy,t,amp,back){const th=0.1+amp*0.74*Math.sin(t),cs=Math.cos(t),kn=0.14+amp*(1.6*Math.pow(Math.max(0,cs),1.3)+0.16*Math.max(0,-cs));
 const J=back?'#1b3048':'#2a4a70',JL=back?'#0a1420':'#0e1a28',B=back?'#6a3a14':'#8e5222',BL=back?'#2a1404':'#3a1a06';
 const k=rigLimb(hx,hy,th,32,back?19:21,J,JL);
 if(!back){c.strokeStyle='rgba(120,160,210,.35)';c.lineWidth=3;c.beginPath();c.moveTo(hx+Math.cos(th)*5,hy-Math.sin(th)*5);c.lineTo(k[0]+Math.cos(th)*4,k[1]-Math.sin(th)*4);c.stroke()}
 const sa=th-kn,a=rigLimb(k[0],k[1],sa,24,back?14:15,J,JL);
 /* boot: shaft continues the shin, foot points forward */
 const b=rigLimb(a[0],a[1],sa,8,back?17:18,B,BL),fa=sa+Math.PI/2-0.15-amp*0.35*Math.max(0,cs);
 c.save();c.translate(b[0],b[1]);c.rotate(-fa+Math.PI/2);c.fillStyle=BL;c.beginPath();c.ellipse(5,1,13.5,7.8,0,0,TAU);c.fill();c.fillStyle=B;c.beginPath();c.ellipse(5,0,11.8,6.2,0,0,TAU);c.fill();
 c.fillStyle=BL;c.fillRect(-7,4.6,24,3);if(!back){c.fillStyle='rgba(255,210,150,.45)';c.fillRect(-2,-4,8,2)}c.restore()}
function drawKellyRig(p,x,y,sc,flip,amp){const im=IMG.kelly_torso;if(!im)return false;const f=0.5*sc,t=p._rph*TAU,
 bob=amp*5*Math.cos(2*t),lean=amp*0.035*Math.sin(2*t);
 c.save();c.translate(x,y);c.scale(flip?-f:f,f);const hx=3,hy=-66+bob;
 kellyLeg(hx-3,hy,t+Math.PI,amp,true);
 c.save();c.translate(hx,hy);c.rotate(lean);c.translate(-hx,-hy);c.drawImage(im,-59,-161+bob);c.restore();
 kellyLeg(hx+2,hy,t,amp,false);c.restore();return true}
/* Jinxy (ride mode): four-legged gallop under the body art */
function girLeg(hx,hy,t,amp,front,back){const cs=Math.cos(t),s=Math.sin(t),up=front?0.12+amp*0.7*s:-0.08+amp*0.64*s,
 bend=0.1+amp*1.25*Math.pow(Math.max(0,cs),1.3),lo=front?up-bend:up+bend*0.95;
 const T=back?'#c98a34':'#f2b24e',L=back?'#5a3410':'#8a5418',P=back?'#8a4e14':'#b8661c';
 const k=rigLimb(hx,hy,up,30,back?15:16.5,T,L);
 c.fillStyle=P;for(const q of [0.3,0.62]){c.beginPath();c.ellipse(hx+(k[0]-hx)*q+1.5,hy+(k[1]-hy)*q,4.4,3.2,-up,0,TAU);c.fill()}
 const a=rigLimb(k[0],k[1],lo,28,back?10:11,T,L);c.fillStyle=T;c.beginPath();c.arc(k[0],k[1],back?7:8,0,TAU);c.fill();
 c.save();c.translate(a[0],a[1]);c.rotate(-lo);c.fillStyle=back?'#2e1806':'#4a2608';c.beginPath();c.moveTo(-6.5,-2);c.lineTo(6.5,-2);c.lineTo(8,8);c.quadraticCurveTo(0,10,-8,8);c.closePath();c.fill();c.fillStyle='rgba(255,220,170,.25)';c.fillRect(-4,0,6,2);c.restore()}
function girLegS(hx,hy,t,amp,front,back,k){c.save();c.translate(hx,hy);c.scale(k,k);girLeg(0,0,t,amp,front,back);c.restore()}
function drawRideRig(p,x,y,sc,flip,amp){const im=IMG.ride_body;if(!im)return false;const f=0.5*sc,t=p._rph*TAU,
 bob=amp*4.5*Math.cos(t+0.4),pitch=amp*0.05*Math.sin(t+0.4),K=0.85;
 c.save();c.translate(x,y);c.scale(flip?-f:f,f);c.translate(0,bob);c.rotate(pitch);
 const HX=-28,FX=26,HY=-59,FY=-59;
 girLegS(HX+4,HY,t,amp,false,true,K);girLegS(FX+4,FY,t+Math.PI*0.9,amp,true,true,K);
 c.drawImage(im,-im.width/2,-im.height);
 girLegS(HX,HY+2,t+Math.PI*0.2,amp,false,false,K);girLegS(FX,FY+2,t+Math.PI*1.1,amp,true,false,K);
 c.restore();return true}
/* Hyena: 4-leg walk (lateral sequence) under the legless body art; sprite faces left natively. Render-only. */
function hyLeg(hx,hy,t,amp,front,back){const s=Math.sin(t),cs=Math.cos(t),lift=Math.pow(Math.max(0,cs),1.4);
 const T=back?'#8f7148':'#c29d68',L=back?'#24180c':'#3b2a1c';
 const up=(front?0.04:-0.06)+amp*0.42*s,u=front?up:up+0.32,lo=front?up-0.05-amp*1.15*lift:up-0.3-amp*0.95*lift;
 const k=rigLimb(hx,hy,-u,front?19:18,front?(back?10:12):(back?12:14.5),T,L);
 const a=rigLimb(k[0],k[1],-lo,front?17:18,back?8:9.5,T,L);
 c.fillStyle=T;c.beginPath();c.arc(k[0],k[1],back?4.8:5.6,0,TAU);c.fill();
 if(!back){c.fillStyle='rgba(60,40,24,.75)';c.beginPath();c.ellipse((hx+k[0])/2,(hy+k[1])/2,2.6,3.4,0,0,TAU);c.fill()}
 c.fillStyle=back?'#3a2a1a':'#5a4430';c.beginPath();c.ellipse(a[0]-3,a[1]+1.5,6.5,3.6,0,0,TAU);c.fill()}
function drawHyenaRig(e,x,y,sc,flip){const im=IMG.hy_body;if(!im)return false;
 const rdt=clamp(e.t-(e._lt===undefined?e.t:e._lt),0,0.1);e._lt=e.t;if(e._rph===undefined){e._rph=(e.x*0.013)%1;e._ramt=1}
 const v=Math.abs(e.vx||0),mv=v>5;e._ramt+=((mv?1:0)-e._ramt)*Math.min(1,rdt*10);if(mv)e._rph=(e._rph+v*rdt/62)%1;
 const amp=e._ramt*clamp(v/75,0.5,1.2),t=e._rph*TAU,bob=amp*1.6*Math.cos(2*t),f=0.5*sc;
 c.save();c.translate(x,y);c.scale(flip?-f:f,f);c.translate(-im.width/2,-im.height);
 hyLeg(106,66+bob,t+Math.PI,amp,false,true);hyLeg(48,66+bob,t+Math.PI*1.5,amp,true,true);
 c.drawImage(im,0,bob);
 hyLeg(118,68+bob,t,amp,false,false);hyLeg(60,68+bob,t+Math.PI*0.5,amp,true,false);
 c.restore();return true}
/* Beetle: 6-leg tripod scuttle under the legless shell art; sprite faces left natively. Render-only. */
function bugLeg(hx,hy,fx,t,amp,back){const s=Math.sin(t),lift=Math.max(0,Math.cos(t));
 const px=fx+amp*5.5*s,py=52-amp*4.5*lift,kx=(hx+px)/2+(px<hx?-2:2),ky=Math.min(hy,py)-5;
 c.strokeStyle=back?'#1a1024':'#2c1c3c';c.lineWidth=back?2.6:3.2;c.lineCap='round';c.lineJoin='round';
 c.beginPath();c.moveTo(hx,hy);c.lineTo(kx,ky);c.lineTo(px,py);c.stroke()}
function drawBeetleRig(e,x,y,sc,flip,wob){const im=IMG.beetle_body;if(!im)return false;
 const rdt=clamp(e.t-(e._lt===undefined?e.t:e._lt),0,0.1);e._lt=e.t;if(e._rph===undefined){e._rph=(e.x*0.017)%1;e._ramt=1}
 const v=Math.abs(e.vx||0),mv=v>3;e._ramt+=((mv?1:0)-e._ramt)*Math.min(1,rdt*12);if(mv)e._rph=(e._rph+Math.min(1.5,v/22)*rdt)%1;/* cadence: beetle tripod capped at 3 steps/s (was ~4.4) */
 const amp=e._ramt*clamp(v/48,0.5,1.2),t=e._rph*TAU,bob=amp*0.8*Math.abs(Math.sin(t)),f=0.5*sc;
 c.save();c.translate(x,y);c.rotate(wob||0);c.scale(flip?-f:f,f);c.translate(-im.width/2,-im.height);
 bugLeg(22,40-bob,14,t+Math.PI,amp,true);bugLeg(32,41-bob,30,t,amp,true);bugLeg(42,40-bob,48,t+Math.PI,amp,true);
 c.drawImage(im,0,-bob);
 bugLeg(18,42-bob,8,t,amp,false);bugLeg(30,43-bob,26,t+Math.PI,amp,false);bugLeg(42,42-bob,52,t,amp,false);
 c.restore();return true}

/* ===== menus (DOM) ===== */
const ui=$('ui');
function show(html,cls=''){ui.innerHTML='<div class="scr '+cls+'">'+html+'</div>';document.body.classList.add('uiopen');gpIdx=0;
 ui.querySelectorAll('[data-a]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();AU.unlock();AU.fx('menu');act(b.dataset.a,b.dataset.v)}));
 if(GP.on||kbUsed)setTimeout(()=>gpFocus(0,1),30);$('bgart').hidden=!(cls.includes('title')||cls.includes('menu'))}
let kbUsed=false;addEventListener('keydown',()=>kbUsed=true,{once:true});
function hideUI(){ui.innerHTML='';document.body.classList.remove('uiopen');$('bgart').hidden=true}
function ctlLine(){return GP.on?'🎮 Controller: stick/D-pad move · A jump · X action · Y ram · Start pause':'Swipe &amp; hold anywhere to move · JUMP to jump · ACTION calls a friend'}
function refreshCtlHint(){const h=document.querySelector('#ui .ctl');if(h)h.innerHTML=ctlLine()}
function titleScreen(){state='title';AU.music('title');const cont=save.reached>0;
 show(`<div class="logo"><div class="l1">KELLY'S</div><div class="l2">GIRAFFE ADVENTURE</div><div class="l3">VOL. 5 · MIDNIGHT ZOO ESCAPE</div></div>
 <div class="tbtns"><button class="btn go" data-a="play">▶ ${cont?'CONTINUE':'PLAY'}</button>${cont?'<button class="btn alt" data-a="new">NEW GAME</button>':''}
 <button class="btn alt" data-a="levels">LEVELS</button><button class="btn alt2" data-a="how">HOW TO PLAY</button></div>
 <p class="tag">Sneak through the zoo at midnight, free Ellie, Percy and Kiki, and rescue Peter and the birthday cake from the gift shop!</p>${save.best?'<p class="sub">Best score: '+save.best.toLocaleString()+'</p>':''}<p class="ctl sub">${ctlLine()}</p>`,'title')}
const STORY=[
 [{img:1,t:'<b>Uh-oh!</b> It is the night before Kelly\'s birthday, and the <b>Head Keeper Mega-Bot</b> has carried <b>Peter</b> and the birthday cake off to the zoo <b>gift shop</b>!'},
  {img:1,t:'Kelly\'s brave giraffe sneaks into the zoo at midnight. Her friends <b>Ellie the Elephant</b>, <b>Percy the Penguin</b> and <b>Kiki the Koala</b> are locked in cages too. Free them, and they will help her reach Peter!'}],
 [{img:2,t:'Ellie and Percy are free! Ellie sprays water so logs float up, and Percy slides under low gates. Next stop: the lantern-lit <b>Koala Grove</b>, where Kiki is waiting.'}],
 [{img:3,t:'<b>You did it!</b> The Mega-Bot is beaten, Peter is free and the cake did not lose a single candle. Everyone grabs a party hat in the gift shop. <b>HAPPY BIRTHDAY, KELLY!</b> 🎂🦒'}]];
function storyScreen(i,next,pg=0){state='story';const S=STORY[i-1],P=S[pg],last=pg>=S.length-1;
 show(`<img class="story" src="art/story${P.img}.webp?v=${VERSION}" alt=""><p class="big">${P.t}</p><div class="tbtns" style="flex-direction:row;justify-content:center;flex-wrap:wrap"><button class="btn go" data-a="${last?next:'spage'}" data-v="${i}|${next}|${pg+1}">${last?(i===3?'THE END':'PLAY ▶'):'NEXT ▶'}</button><button class="btn dim skip" data-a="${next}">SKIP ▶▶</button></div>`,'menu');AU.music(i===3?'bday':'title')}
function levelsScreen(){state='levels';let h='<h2>LEVELS</h2><div class="lvls">';LEVELS.forEach((L,i)=>{const lock=i>save.reached;const st=save.stars[i]||[];const sn=[0,1,2].map(k=>st[k]?'★':'☆').join('');const bs=L.ch.find(x=>x.startsWith('boss:'));
  h+=`<button class="btn lv ${lock?'dim':''}" data-a="${lock?'locked':'lvl'}" data-v="${i}"><span class="n">Zone ${L.w+1}-${L.n}</span> ${L.name}${bs?' <small>· BOSS</small>':''}<span class="st">${lock?'🔒':sn}</span></button>`});
 show(h+'</div><button class="btn alt" data-a="back">◀ BACK</button>','menu')}
function howScreen(){state='how';show(`<h2>HOW TO PLAY</h2><ul class="how">
 <li><b>Move:</b> swipe and hold anywhere (let go to stop). <b>Swipe up</b> or tap <b>JUMP</b> (orange) to jump. Hold JUMP to go higher.</li>
 <li><b>ACTION</b> (green) calls your current friend's help (their picture has a gold ring at the top of the screen):
  <b>Ellie</b> sprays water to fill dry moats so logs float up, <b>Percy</b> belly-slides under low gates to flip the switch, <b>Kiki</b> climbs poles to slap high switches. Near bad guys, your friend jumps in and helps you fight!</li>
 <li>Locked cage? <b>BONK</b> it with ACTION or RAM it to free a friend.</li>
 <li>Double-tap ACTION for a <b>NECK RAM</b> (smashes rocks and robots). Hold UP + ACTION to ram up.</li>
 <li>Cliff too tall? Jump at it and hold <b>UP</b> (or keep pushing toward it) to <b>NECK GRAB</b> the edge.</li>
 <li>In the air, hold DOWN + ACTION to <b>NECK POUND</b> through cracked bricks. Near a golden ring: jump and tap ACTION to <b>SWING</b>, JUMP lets go.</li>
 <li>Near peanuts, bananas, beetles or gems: tap ACTION and your long <b>TONGUE</b> slurps them up.</li>
 <li>5 lives. Grab green gems (100 = extra life) and the 3 gold stars in every level. Never stomp porcupines!</li>
 <li><b>Bosses:</b> wait till the robot is dizzy, then RAM or STOMP it.</li>
 <li>🎮 <b>Controllers:</b> stick or D-pad to move, A jump, X or B action, Y ram, Start pause. Keys: arrows/WASD, Z or Space jump, X action, C ram, P pause, M sound.</li></ul><button class="btn alt" data-a="back">◀ BACK</button>`,'menu')}
function pauseGame(){if(state!=='play')return;state='pause';clearInput();show(`<h2>PAUSED</h2><p>${LEVELS[G.li].name}</p><button class="btn go" data-a="resume">▶ RESUME</button><button class="btn alt" data-a="restart">RESTART LEVEL</button><button class="btn alt2" data-a="how2">HOW TO PLAY</button><button class="btn dim" data-a="quit">QUIT TO TITLE</button>`)}
function resumeGame(){hideUI();state='play';clearInput();AU.music(G.boss&&G.boss.st!=='dead'?'boss':WORLDS[LEVELS[G.li].w].song)}
function clearScreen(){state='clear';const L=LEVELS[G.li],n=G.lvStars.filter(Boolean).length;AU.music('win');
 show(`<h2>${G.L.boss?'BOSS BEATEN!':'LEVEL CLEAR!'}</h2><p class="big">${L.name}</p><table class="st"><tr><td>Gems</td><td>${G.lvGems}</td></tr><tr><td>Gold stars</td><td>${'★'.repeat(n)}${'☆'.repeat(3-n)}</td></tr><tr><td>Score</td><td>${G.score.toLocaleString()}</td></tr></table>
 <button class="btn go" data-a="next">NEXT ▶</button><button class="btn dim" data-a="quit">TITLE</button>`)}
function overScreen(){state='over';AU.stop();AU.fx('over');if(G.score>save.best){save.best=G.score;persist()}
 show(`<h2>GAME OVER</h2><p class="big">Score: ${G.score.toLocaleString()}</p><p>Ellie, Percy and Kiki believe in you! Try this level again?</p><button class="btn go" data-a="retry">TRY AGAIN</button><button class="btn dim" data-a="quit">TITLE</button>`)}
function winScreen(){state='win';AU.music('bday');if(G.score>save.best){save.best=G.score;persist()}save.won=1;persist();
 show(`<h2>PETER IS SAVED!</h2><p class="big">🎂 Happy Birthday, Kelly! 🎂</p><img class="story" src="art/story3.webp?v=${VERSION}" alt=""><p class="big">Final score: ${G.score.toLocaleString()}</p><p>Gold stars: ${Object.values(save.stars).reduce((a,s)=>a+(s||[]).filter(Boolean).length,0)} / 27</p><button class="btn go" data-a="again">PLAY AGAIN</button><button class="btn alt" data-a="levels">LEVELS</button><button class="btn dim" data-a="quit">TITLE</button>`,'menu')}
function act(a,v){
 if(a==='play'){if(save.reached>0)newGame(save.reached);else{storyScreen(1,'start1')}}
 else if(a==='new'){save.reached=0;persist();storyScreen(1,'start1')}
 else if(a==='start1')newGame(0);
 else if(a==='levels')levelsScreen();else if(a==='how')howScreen();else if(a==='how2'){howScreen();state='pause';ui.querySelector('[data-a="back"]').dataset.a='pauseback';ui.querySelector('[data-a="pauseback"]').addEventListener('click',()=>{state='play';pauseGame()})}
 else if(a==='back')titleScreen();else if(a==='pauseback'){}
 else if(a==='lvl')newGame(+v);else if(a==='locked')toast('Beat the level before it to unlock!');
 else if(a==='resume')resumeGame();else if(a==='restart'){hideUI();startLevel(G.li,G.levelStart)}
 else if(a==='quit'){G=null;titleScreen()}
 else if(a==='spage'){const[i,n,pg]=String(v).split('|');storyScreen(+i,n,+pg)}
 else if(a==='next'){if(G.li===3&&!G.storyDone)storyScreen(2,'next2');else if(G.finale)storyScreen(3,'win');else if(G.li+1<LEVELS.length)startLevel(G.li+1);else winScreen()}
 else if(a==='next2'){G.storyDone=1;startLevel(G.li+1)}
 else if(a==='win')winScreen();
 else if(a==='retry'){G.lives=5;G.score=G.levelStart.score;startLevel(G.li,G.levelStart)}
 else if(a==='again'){save.reached=0;persist();storyScreen(1,'start1')}}
function toggleMute(){AU.setMuted(!AU.muted);save.muted=AU.muted;persist();$('bMute').textContent=AU.muted?'🔇':'🔊';toast(AU.muted?'Sound off':'Sound on',900)}
$('bMute').addEventListener('click',e=>{e.stopPropagation();AU.unlock();toggleMute()});$('bPause').addEventListener('click',e=>{e.stopPropagation();pauseGame()});

/* ===== game flow + loop ===== */
function newGame(li){G={score:0,lives:5,gems:0,deaths:0};startLevel(li)}
function startLevel(li,snap){const keep=G||{score:0,lives:5,gems:0,deaths:0};if(snap){keep.score=snap.score;keep.gems=snap.gems}
 const L=buildLevel(li);G=Object.assign({},{score:keep.score,lives:keep.lives,gems:keep.gems,deaths:keep.deaths||0,storyDone:keep.storyDone||li>3},{li,L,t:0,ents:[],shots:[],parts:[],texts:[],cam:{x:0,y:0},shake:0,hs:0,flash:null,boss:null,arena:null,cp:null,won:0,lvGems:0,lvStars:[0,0,0],banner:2.6,camDx:0,slow:0,finale:0});
 G.levelStart={score:G.score,gems:G.gems};const lv=LEVELS[li];G.p=newPlayer(3*TS,9*TS,'ride');G.p.hp=G.p.maxhp=lv.w>=2?4:3;spawnEnts();initPals(li);camUpdate(0,true);
 hideUI();state='play';clearInput();AU.music(WORLDS[lv.w].song)}
function openCage(){const cg=G.L.cage;cg.open=1;AU.fx('free');burst(cg.x,cg.y-60,30,['#9aa0b0','#5a6070','#ffe060','#fff'],320,0.9,5,900);shake(10);const q=addPal(cg.pal,cg.x,cg.y);if(q){q.face=-1}G.cut=1.1;G.palBanner={k:cg.pal,t:3.2};ftxt(cg.x,cg.y-150,PALS[cg.pal].short.toUpperCase()+' IS FREE!','#7aff7a',1);for(let i=0;i<3;i++)setTimeout(()=>G&&stars(cg.x+rand(-40,40),cg.y-rand(40,120),8),i*180)}
function levelClear(){if(G.won)return;G.won=1;G.wonT=G.finale?3.2:G.L.boss?0.6:1.4;AU.fx('clear');const st=save.stars[G.li]||[];G.lvStars.forEach((v,i)=>{if(v)st[i]=1});save.stars[G.li]=st;save.reached=Math.max(save.reached,Math.min(LEVELS.length-1,G.li+1));if(G.score>save.best)save.best=G.score;persist();
 for(let i=0;i<4;i++)setTimeout(()=>G&&G.p&&stars(G.p.x+rand(-60,60),G.p.y-rand(60,140),10),i*200)}
function respawn(){G.lives--;if(G.lives<=0){G.lives=0;overScreen();return}const p=G.p,cp=G.cp;const mode=p.mode;const np=newPlayer(cp?cp.x:3*TS,cp?cp.y:9*TS,mode);np.maxhp=p.maxhp;np.hp=p.maxhp;np.inv=2;
 if(G.boss&&G.boss.st!=='dead'){np.x=G.arena.x0+60;np.y=G.L.boss.y;G.shots.length=0;const b=G.boss;if(b.k!=='hover'&&b.k!=='net'){b.st='idle';b.y=b.gy;b.vy=0;b.x=G.arena.x1-160}b.t=0}
 G.p=np;G.shots=G.shots.filter(s=>Math.abs(s.x-np.x)>300);resetTrail(true);camUpdate(0,true)}
function update(dt){G.t+=dt;frame++;const p=G.p;G.banner=Math.max(0,G.banner-dt);G.bossIntro=Math.max(0,(G.bossIntro||0)-dt);G.shake=Math.max(0,G.shake-dt*30);if(G.flash)G.flash.a-=dt*2;G.combo=Math.max(0,(G.combo||0)-dt);
 if(G.cut){G.cut-=dt;if(G.cut<=0)G.cut=0}
 if(!G.won||G.wonT>0)updatePlayer(p,dt);
 if(p.dead){G.deadT-=dt;if(G.deadT<=0){respawn();if(state!=='play')return}}
 if(G.L.boss&&!G.boss&&!G.won&&p.x>G.L.boss.x0+140)startBoss();
 updEnemies(dt);updShots(dt);updBoss(dt);updItems(dt);updPals(dt);
 for(const q of G.parts){q.l-=dt;q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}G.parts=G.parts.filter(q=>q.l>0);
 for(const t of G.texts){t.l-=dt;t.y-=40*dt}G.texts=G.texts.filter(t=>t.l>0);
 const ox=G.cam.x;camUpdate(dt);G.camDx=G.cam.x-ox;
 if(G.finale&&G.won&&!SIM&&Math.random()<0.35)burst(G.cam.x+Math.random()*viewW,G.cam.y+20,4,['#ff6aa8','#ffd23a','#7ad0ff','#7aff7a','#fff'],120,1.6,6,260);
 if(G.won){G.wonT-=dt;if(G.wonT<=0&&state==='play'){clearScreen()}}}
let last=performance.now(),acc=0;
function loop(now){requestAnimationFrame(loop);let dt=Math.min(0.05,(now-last)/1000);last=now;if(window.__FIXDT)dt=window.__FIXDT;
 if(state==='play'&&G){for(let k=0;k<(window.__SPEED||1)&&state==='play';k++){readInput();let d=dt;if(G.hs>0){G.hs-=dt;d=0}if(G.slow>0){G.slow-=dt;d*=0.35}const n=d>1/60?2:1;for(let i=0;i<n;i++)update(d/n);G.dtR=dt}}else if(state!=='play')pollPad();
 render()}

/* physics look-ahead planner for the QA bot: simulates the real player code with candidate inputs */
function simRun(p0,plan,frames){const save={};for(const k in inp)save[k]=inp[k];SIM=1;const p=Object.assign({},p0);p.swing=null;p.atkHit=new Set();let best=p.x,ok=true,hurt=0;
 for(let f=0;f<frames;f++){const a=plan(f);inp.L=a.L||0;inp.R=a.R||0;inp.U=0;inp.D=0;inp.jumpP=a.jp||0;inp.jump=a.j||0;inp.actP=0;inp.act=0;inp.ramP=0;
  updatePlayer(p,1/60);if(p.dead){ok=false;break}if(p.simHurt){hurt=1;ok=false;break}best=Math.max(best,p.x)}
 SIM=0;for(const k in save)inp[k]=save[k];return{ok,x:best,end:p,onG:p.onG}}
function planJump(p){const C=[];C.push({n:'run',f:()=>({R:1}),hold:0});for(const h of[6,12,20,32])for(const d of[0,4,9,15])C.push({n:'j'+h+'d'+d,d,h,f:fr=>({R:1,jp:fr===d?1:0,j:fr>=d&&fr<d+h?1:0})});
 C.push({n:'back',f:fr=>fr<14?{L:1}:{R:1,jp:fr===22?1:0,j:fr>=22&&fr<54?1:0}});
 let best=null;for(const c of C){const r=simRun(p,c.f,95);if(!r.ok)continue;const sc=r.x-(c.n==='run'?0:6)-(c.d||0)*0.5+(r.onG?20:0);if(!best||sc>best.sc)best={c,sc,r}}return best}
/* ===== QA autopilot (only when window.__BOT is set by the test harness) ===== */
const BOT={hold:0,wait:0,swingRel:0,lastX:0,stuck:0,ramT:0};
function botInput(){const p=G.p,o={L:0,R:0,U:0,D:0,J:0,Jh:0,A:0,Y:0};if(p.dead||G.cut||G.won)return o;const ride=p.mode==='ride';const fx=p.x,fy=p.y;const tx=Math.floor(fx/TS),ty=Math.floor((fy-1)/TS);
 const groundAt=cx=>{for(let y=Math.max(0,ty-5);y<ROWS;y++){const k=tileAt(cx,y);if(solidK(k)||k===2)return y;if(k===6||k===5&&y>=ty)return k===5?-y:99}return 99};
 /* boss mode */
 if(G.boss&&G.boss.st!=='dead'){const b=G.boss,d=b.x-p.x,ad=Math.abs(d);
  for(const s of G.shots){if(s.k==='wave'&&Math.abs(s.x-p.x)<110&&sgn(p.x-s.x)===sgn(s.vx)&&p.onG){o.J=1;o.Jh=1}
   if(s.k!=='wave'&&Math.hypot(s.x-p.x,s.y-(p.y-40))<140&&s.vy>0&&p.onG&&BOT.ramT<=0&&ride){o.A=1;BOT.ramT=0.2}}
  BOT.ramT-=1/60;
  if(b.st==='dizzy'){if(ad>90){o[d>0?'R':'L']=1}if(ad<170&&p.onG&&BOT.ramT<=0){if(ride){o.Y=1;BOT.ramT=0.4}else o.A=1}if(b.k==='net'&&p.onG&&ad<60){o.J=1;o.Jh=1}}
  else{const want=b.k==='net'||b.k==='hover'?0:260;const A=G.arena;let goal=p.x;if(ad<want)goal=b.x+(b.x>(A.x0+A.x1)/2?-want-40:want+40);
   if(b.k==='hover'){goal=b.x+(b.st==='tele'?(d>0?-260:260):0);if(b.st==='dive')goal=p.x+(b.vx>0?-200:200)}
   if(b.k==='net'){goal=b.perch?(b.x<(A.x0+A.x1)/2?A.x1-120:A.x0+120):p.x;if(!b.perch&&b.st!=='climb'&&ad<240)goal=b.x+(d>0?-300:300)}
   if(b.k==='croc'){const pool0=A.x0+10*TS,pool1=A.x0+17*TS;if(b.st==='dive'||b.st==='leap'){goal=p.x<(pool0+pool1)/2?A.x0+80:A.x1-80}else if(ad<240)goal=b.x+(d>0?-300:300);goal=goal>pool0-60&&goal<pool1+60?(p.x<pool0?pool0-80:pool1+80):goal}
   if((b.k==='sweep'&&b.st==='charge'||b.k==='mega'&&b.st==='leap')&&ad<200&&sgn(b.vx||-d)===sgn(-d)&&p.onG){o.J=1;o.Jh=1}
   goal=clamp(goal,A.x0+40,A.x1-40);if(Math.abs(goal-p.x)>20)o[goal>p.x?'R':'L']=1}
  if(!p.onG&&BOT.hold>0){o.Jh=1;BOT.hold--}if(o.J)BOT.hold=14;return o}
 /* swinging */
 if(p.swing){BOT.plan=null;const s=p.swing;o.R=1;if(BOT.sw!==s){BOT.sw=s;BOT.swf=0}BOT.swf++;if(BOT.swf<10)return o;const nextH=G.L.hooks.find(h=>h.x>s.h.x+40&&h.x-s.h.x<330);if(s.a<-0.15&&s.av>0&&nextH&&Math.abs(nextH.x-p.x)<240&&p.x>s.h.x-10){o.J=1;BOT.grab=1}else if(!nextH&&s.a>0.25&&s.av>0){o.J=1}else if(nextH&&s.a>0.35&&s.av>0){o.J=1;BOT.grab=1}return o}
 o.R=1;
 /* friend help spots: stop, call the friend with ACTION, wait until the way is open */
 {const hs=G.L.helps.find(h=>!h.done&&palAvail(h.k)&&h.x-p.x<(h.kind==='moat'?190:200)&&h.x-p.x>-40);
  if(hs){BOT.plan=null;o.R=0;if(hs.x-p.x<(hs.kind==='moat'?70:30))o.L=1;BOT.hc=(BOT.hc||0)+1;if(p.onG&&!hs.active&&BOT.hc%20===0)o.A=1;return o}}
 /* executing a committed plan */
 if(BOT.plan&&ride){const hk=nearHook(p);const gc=groundAt(Math.floor(p.x/TS));if(hk&&hk.x>p.x-20&&!p.onG&&(gc===99||gc>=ROWS-1)){BOT.plan=null;BOT.grab=1}}
 if(BOT.plan){const f=BOT.pf++;const a=BOT.plan(f);o.R=a.R||0;o.L=a.L||0;if(a.jp)o.J=1;o.Jh=a.j?1:0;if(f>=BOT.plen||(f>4&&p.onG&&BOT.pj&&f>BOT.pjf)){BOT.plan=null}else{botCombat(o,p,ride);return o}}
 if(!p.onG){if(BOT.hold>0){o.Jh=1;BOT.hold--}
  if(ride){const hk=nearHook(p);const gc=groundAt(Math.floor(p.x/TS));if(hk&&hk.x>p.x-20&&(BOT.grab||BOT.needHook||((gc===99||gc>=ROWS-1)&&p.vy>-100))){o.A=1;BOT.grab=0;BOT.needHook=0}}
  return o}
 BOT.grab=0;
 if(G.L.cage&&!G.L.cage.open&&G.L.cage.x-p.x<110){o.R=1;BOT.pc=(BOT.pc||0)+1;if(BOT.pc%14===0)o.A=1;return o}
 const ftx=Math.floor((p.x+p.w/2+8)/TS);let gapW=0;for(let i=0;i<12;i++){const g=groundAt(ftx+i);if(g===99||g>=ROWS-1||g<0||g>ty+3)gapW++;else if(gapW)break;else if(i>2)break}
 const front=Math.floor((p.x+p.w/2+6)/TS);let wallH=0,wallK=0;for(let y=ty;y>=Math.max(0,ty-6);y--){const k=tileAt(front,y);if(solidK(k)){wallH++;wallK=k}else if(wallH)break;else if(y<ty-1)break}
 const hasHook=G.L.hooks.some(h=>h.x>p.x&&h.x-p.x<300);
 if(ride&&wallH>=3&&(wallK===3||wallK===4)){o.Y=1;return o}
 if(ride&&gapW>5&&hasHook){BOT.plan=null;if(gapW<=7||ftx*TS-p.x<p.w){o.J=1;o.Jh=1;BOT.hold=24;BOT.needHook=1}return o}
 const pl=planJump(p);if(pl){BOT.plan=pl.c.f;BOT.pf=0;BOT.plen=pl.c.n==='run'?8:Math.min(95,(pl.c.d||0)+(pl.c.h||32)+60);BOT.pj=pl.c.n!=='run';BOT.pjf=(pl.c.d||0)+6;const a=BOT.plan(BOT.pf++);o.R=a.R||0;o.L=a.L||0;if(a.jp)o.J=1;o.Jh=a.j?1:0}
 else{o.J=1;o.Jh=1;BOT.hold=30}
 botCombat(o,p,ride);
 if(Math.abs(p.x-BOT.lastX)<0.5){BOT.stuck++;if(BOT.stuck>60){o.J=1;o.Jh=1;BOT.hold=30;if(ride&&BOT.stuck%80===61)o.Y=1}}else BOT.stuck=0;BOT.lastX=p.x;
 return o}
function botCombat(o,p,ride){let foe=null;for(const e of G.ents){if(e.dead||e.k==='food')continue;const dx=e.x-p.x;if(dx>-10&&dx<(ride?160:90)&&Math.abs(e.y-p.y)<80){foe=e;break}}
 for(const s of G.shots)if((s.k==='banana'||s.k==='netball')&&Math.abs(s.x-p.x)<130&&ride)o.Y=1;
 if(foe){if(ride)o.Y=1;else if(Math.abs(foe.x-p.x)<70&&frame%8===0)o.A=1}}
/* ===== boot ===== */
resize();bindSurface(cv);bindSurface($('pad'));bindBtn($('bJump'),'jump');bindBtn($('bAct'),'act');
loadArt(f=>{const b=document.querySelector('#load .bar i');if(b)b.style.width=Math.round(f*100)+'%'}).then(()=>{$('load').remove();titleScreen()});
requestAnimationFrame(loop);
window.__G=()=>G;

