import {cameraLayout} from './camera-layout.js?v=responsive1';
import {deviceProfile, cameraInView, initVisibleMotion} from './performance.js?v=responsive1';
import {initDesk} from './desk.js?v=responsive1';
import { initGallery } from './gallery.js?v=responsive1';
import { initPersonal } from './personal.js?v=responsive1';
import { portfolio, lensSets } from './content.js?v=responsive1';
import { initLensGallery } from './lens-gallery.js?v=responsive1';
import { bootLoader } from './boot-loader.js?v=responsive1';
import { createCameraRig, smooth } from './camera-rig.js?v=responsive1';
import { cameraPose } from './camera-motion.js?v=responsive1';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
// The owner explicitly chose always-on motion on October 2.
const reduced=false;
let rendererUpdate = () => {};
const loader = $('.brand-loader');
const boot=bootLoader(loader,{minimum:reduced?0:2000});
boot.progress(.05);
let cameraRig;
let cameraReady;
const cursor = $('.custom-cursor');
initVisibleMotion();
const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
function hideCursor() { document.documentElement.classList.remove('cursor-enabled'); cursor.classList.remove('tracking','engaged','pressed'); }
addEventListener('pointermove', e => {
  if (reduced || !finePointer.matches || e.pointerType === 'touch' || e.target.closest?.('input:not([type=range]),textarea,select,#video-modal,#photo-book,#photo-story-editor')) { hideCursor(); return; }
  document.documentElement.classList.add('cursor-enabled');
  cursor.classList.add('tracking');
  cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
  const target = e.target instanceof Element ? e.target.closest('a,button,summary,input[type="range"],.lens-swipe-surface') : null;
  cursor.classList.toggle('engaged', !!target);
  cursor.querySelector('span').textContent = target?.matches('input,.lens-swipe-surface') ? 'DRAG' : target?.matches('.photo-button') ? 'VIEW' : target?.matches('summary') ? 'READ' : target ? 'OPEN' : '';
}, {passive:true});
addEventListener('pointerdown', e => { if (e.pointerType==='touch') hideCursor(); else cursor.classList.add('pressed'); }, {passive:true});
addEventListener('pointerup', () => cursor.classList.remove('pressed'), {passive:true});
addEventListener('pointercancel', hideCursor, {passive:true});
addEventListener('pointerout', e => { if (!e.relatedTarget) hideCursor(); });
addEventListener('blur', hideCursor);
addEventListener('keydown', e => { if (e.key==='Tab') hideCursor(); });
finePointer.addEventListener('change', hideCursor);
const {openPhoto}=initGallery({photos:portfolio.photos,cursor,hideCursor});
initPersonal();
$('#grade-slider').addEventListener('input', e => {
  $('#compare').style.setProperty('--split', `${e.target.value}%`);
  e.target.setAttribute('aria-valuetext', `${100-Number(e.target.value)} percent color treatment revealed`);
});
const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), {threshold:.08,rootMargin:'0px 0px -20px 0px'});
$$('.reveal').forEach(el => observer.observe(el));
// A single sticky canvas spans the opening, archive and camera kit.
// The archive is an opaque foreground surface: no opacity gates or canvas reparenting.
const hero = $('.hero'); const kit = $('.camera-kit'); const stage = $('#camera-stage');
initLensGallery({root:kit,sets:lensSets,onOpen:openPhoto,onSelect:async set=>{await cameraReady;if(!cameraRig)throw new Error('Camera unavailable');const changing=cameraRig.select(set);rendererUpdate();await changing;}});
const firstPhoto = $('.photo-one'); const secondPhoto = $('.photo-two');
let progress=0,tick=0;
let pose={x:.72,y:.49,scale:1,turn:0,covered:false,active:true};
function calculatePose(){
 const work=$('#work').getBoundingClientRect(),k=kit.getBoundingClientRect(),anchor=$('.kit-camera-space').getBoundingClientRect(),park=$('.kit-lens-space').getBoundingClientRect(),home=$('.hero-camera-space').getBoundingClientRect(),stageRect=stage.getBoundingClientRect(),viewport=stage.clientHeight||innerHeight;
 const result=cameraPose({heroTop:hero.getBoundingClientRect().top,kitAnchorY:anchor.top+anchor.height/2-stageRect.top,workTop:work.top,workBottom:work.bottom,kitTop:k.top,kitHeight:kit.offsetHeight,kitViewport:$('.kit-sticky').offsetHeight,viewport,width:stage.clientWidth||innerWidth,reduced});
 result.kitReveal=smooth((innerHeight*.65-k.top)/(innerHeight*.6));
 result.layout=cameraLayout({home,anchor,park,stage:stageRect,emerge:result.emerge,dive:result.heroProgress});
 result.x=result.layout.x;result.y=result.layout.y;
 result.active=cameraInView(result,stageRect.top,viewport,innerHeight);return result;
}
function updateScroll(){
 tick=0;pose=calculatePose();progress=pose.heroProgress;
 stage.setAttribute('aria-hidden',String(pose.covered||!pose.active));stage.classList.toggle('camera-away',pose.covered||!pose.active);
 $('.hero-progress i').style.transform=`scaleX(${progress})`;
 $('.kit-progress i').style.transform=`scaleX(${pose.kitProgress})`;
 const p=reduced?0:progress;
 firstPhoto.style.transform=`perspective(1000px) translateY(${-p*60}px) rotateY(${-20+p*25}deg) rotateZ(${9-p*8}deg)`;
 secondPhoto.style.transform=`perspective(1000px) translateY(${p*40}px) rotateY(${16-p*20}deg) rotateZ(${-12+p*10}deg)`;
 rendererUpdate();
}
function requestTick(){if(!tick)tick=requestAnimationFrame(updateScroll);}
addEventListener('scroll',requestTick,{passive:true});addEventListener('resize',requestTick);
new ResizeObserver(requestTick).observe($('#work'));
document.documentElement.classList.add('js-motion');
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{requestTick();requestAnimationFrame(()=>rendererUpdate());}));
addEventListener('pageshow',requestTick);
addEventListener('focus',requestTick);
requestTick();
// A local Three.js module avoids a runtime dependency on an external CDN.
async function initCamera() {
  const THREE = await import('./assets/three.module.js');
  let renderer,parts,gl;
  const surface=document.createElement('canvas');
  try{gl=surface.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'})||surface.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});}catch{}
  if(gl){
   try{
    renderer=new THREE.WebGLRenderer({canvas:surface,context:gl,alpha:true});
    const {GLTFLoader}=await import('./assets/GLTFLoader.js');
    const load=new GLTFLoader(),assetSuffix=innerWidth<700?'-mobile':'';let loadedBytes=[0,0];
    const read=(url,index)=>load.loadAsync(url,e=>{loadedBytes[index]=e.loaded;boot.progress(.1+.65*Math.min(1,(loadedBytes[0]+loadedBytes[1])/7400000));});
    let timeout;const models=await Promise.race([Promise.all([read(`./assets/camera-kiri${assetSuffix}.glb`,0),read(`./assets/lens-55-250${assetSuffix}.glb`,1)]),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Loading fallback')),16000);})]).finally(()=>clearTimeout(timeout));
    parts={body:models[0].scene.getObjectByName('camera-body'),kit:models[0].scene.getObjectByName('lens-kit'),tele:models[1].scene.getObjectByName('lens-tele')};
    if(Object.values(parts).some(p=>!p))throw new Error('Missing camera part');
    for(const part of Object.values(parts))part.traverse(o=>{if(o.isMesh){o.frustumCulled=true;if(o.material.map)o.material.map.anisotropy=Math.min(2,renderer.capabilities.getMaxAnisotropy());}});
    stage.dataset.renderer='webgl';
   }catch(error){renderer?.dispose();gl=null;console.warn('Using the camera turntable fallback',error);}
  }
  if(!gl){const {turntableRenderer}=await import('./turntable-camera.js?v=responsive1');renderer=await turntableRenderer(THREE);stage.dataset.renderer='turntable';}
  boot.progress(.85,'Setting the light');
  renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  stage.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,7.6);
  const model=new THREE.Group();scene.add(model);
  cameraRig=createCameraRig({THREE,scene,model,parts,reducedMotion:()=>reduced});stage.dataset.model='kiri-canon-850d';
  const hemi=new THREE.HemisphereLight(0xe6efd9,0x222322,2.1);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xf2f1e6,3.2);key.position.set(-3,4,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xa5c4b7,2.6);rim.position.set(3,1,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xd29c83,1.3);fill.position.set(2,-1,3);scene.add(fill);
  let width=0,height=0,raf=0,px=0,py=0,mx=0,my=0,lastTime=0,lastPaint=0;
  let rendered=null,kitPresence=0,sizeDirty=true,suspended=false,contextLost=false,quality=1,slowFrames=0;
  const frameInterval=1000/deviceProfile.fps;
  addEventListener('resize',()=>{sizeDirty=true;requestTick();},{passive:true});
  function resize(){if(!sizeDirty)return;const w=stage.clientWidth,h=stage.clientHeight;if(w>0&&h>0){width=w;height=h;const ratio=Math.min(devicePixelRatio||1,deviceProfile.maxRatio,Math.sqrt(deviceProfile.maxPixels/(w*h)))*quality;renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();sizeDirty=false;}}
  function allowed(){return pose.active&&!pose.covered&&!document.hidden&&!document.body.classList.contains('modal-open')&&!contextLost;}
  function suspend(){if(raf){cancelAnimationFrame(raf);raf=0;}cameraRig.finish();if(!suspended){suspended=true;stage.classList.add('camera-suspended');renderer.setSize(1,1,false);width=height=0;sizeDirty=true;stage.dataset.renderState='paused';}lastTime=0;rendered=null;}

  function draw(time,force=false){
   raf=0;if(!force&&!allowed()){suspend();return;}if(!force&&time-lastPaint<frameInterval-1){requestRender();return;}lastPaint=time;const resumed=suspended;suspended=false;
   resize();
   const dt=Math.min((time-(lastTime||time-16.67))/1000,.05);lastTime=time;
   const ease=1-Math.exp(-dt/0.16),pointerEase=1-Math.exp(-dt/0.22);
   px+=(mx-px)*pointerEase;py+=(my-py)*pointerEase;
   if(reduced){px=0;py=0;}if(!rendered||reduced)rendered={...pose};
   for(const key of ['x','y','scale','turn'])rendered[key]+=(pose[key]-rendered[key])*ease;
   const viewHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z;
   const base=(pose.layout?.cameraPixels||200)/3.8*viewHeight/height;
   const targetReveal=pose.kitReveal??0;
   if(resumed)kitPresence=targetReveal;
   kitPresence=reduced?targetReveal:kitPresence+(targetReveal-kitPresence)*ease;const kitReveal=kitPresence;
   const float=reduced?0:Math.sin(time*.00135)*Math.min(.035,viewHeight/height*5);
   const parallax=reduced?0:1-pose.kitProgress*.5;
   model.scale.setScalar(base);
   model.position.set((rendered.x-.5)*viewHeight*camera.aspect+px*.10*parallax,(.5-rendered.y)*viewHeight+float-py*.14*parallax,0);
   model.rotation.set(-.10+Math.sin(rendered.turn*Math.PI*2)*.10+py*.20*parallax,-.52+rendered.turn*Math.PI*2+px*.55*parallax+(reduced?0:Math.sin(time*.00085)*.045),-.04+Math.sin(rendered.turn*Math.PI*2)*.04+(reduced?0:Math.sin(time*.0008)*.012));
   const layout=pose.layout;
   cameraRig.update(time,kitReveal,viewHeight*camera.aspect,layout?{x:(layout.parkX-.5)*viewHeight*camera.aspect,y:(.5-layout.parkY)*viewHeight,scale:layout.lensPixels/4.4*viewHeight/height,lift:layout.liftPixels*viewHeight/height}:null);
   const drawStart=performance.now();renderer.render(scene,camera);
   // Reduce raster cost on a slow GPU without changing the camera path.
   if(gl&&!force&&performance.now()-drawStart>24){if(++slowFrames>=12&&quality>.65){quality=Math.max(.65,quality-.15);sizeDirty=true;slowFrames=0;}}else slowFrames=Math.max(0,slowFrames-1);
   stage.classList.remove('camera-suspended');stage.dataset.renderState='active';
   stage.dataset.lens=String(cameraRig.selected);stage.dataset.exchanging=String(cameraRig.busy);
   if(!reduced||cameraRig.busy)requestRender();
  }
  function requestRender(){if(!allowed()){suspend();return;}if(!raf)raf=requestAnimationFrame(draw);}
  rendererUpdate=requestRender;
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;suspend();stage.classList.remove('ready');});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;sizeDirty=true;stage.classList.add('ready');requestTick();});
  addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch'||pose.covered||!pose.active)return;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;requestRender();},{passive:true});
  addEventListener('pointerout',e=>{if(!e.relatedTarget){mx=0;my=0;}},{passive:true});
  document.addEventListener('visibilitychange',()=>{lastTime=0;lastPaint=0;if(raf){cancelAnimationFrame(raf);raf=0;}if(document.hidden)suspend();else requestTick();});
  new MutationObserver(()=>{if(document.body.classList.contains('modal-open'))suspend();else requestTick();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  resize();pose=calculatePose();
  try{
   if(gl){cameraRig.update(performance.now(),0,1);if(renderer.compileAsync)await renderer.compileAsync(scene,camera);else renderer.compile(scene,camera);}
   draw(performance.now(),true);
  }catch(error){
   if(!gl)throw error;
   renderer.domElement.remove();renderer.dispose();gl=null;
   const {turntableRenderer}=await import('./turntable-camera.js?v=responsive1');renderer=await turntableRenderer(THREE);
   renderer.setPixelRatio(1);stage.append(renderer.domElement);stage.dataset.renderer='turntable';width=0;height=0;sizeDirty=true;
   if(raf){cancelAnimationFrame(raf);raf=0;}draw(performance.now(),true);
  }
  stage.classList.add('ready');stage.dataset.ready='true';
  await boot.ready();requestTick();
}
cameraReady=initCamera().catch(async error=>{stage.classList.remove('ready');stage.dataset.error='model-load';console.error('Camera model could not load',error);try{await stage.querySelector('.camera-fallback img').decode();}catch{}await boot.ready('Explore the journal');});

initDesk();
