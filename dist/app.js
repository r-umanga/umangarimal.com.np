import { portfolio, lensSets } from './content.js?v=6';
import { initLensGallery } from './lens-gallery.js';
import { cameraPose } from './camera-motion.js?v=6';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
// Always-on camera motion is an explicit portfolio requirement.
const reduced = false;
let rendererUpdate = () => {};
const loader = $('.brand-loader');
const dismissLoader = () => loader?.classList.add('dismissed');
// The decorative identity intro always clears after two seconds, even without WebGL.
setTimeout(dismissLoader, 2000);
addEventListener('keydown', dismissLoader, {once:true});
addEventListener('pageshow', e => { if (e.persisted) dismissLoader(); });
const cursor = $('.custom-cursor');
const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
function hideCursor() { document.documentElement.classList.remove('cursor-enabled'); cursor.classList.remove('tracking','engaged','pressed'); }
addEventListener('pointermove', e => {
  if (!finePointer.matches || e.pointerType === 'touch') { hideCursor(); return; }
  document.documentElement.classList.add('cursor-enabled');
  cursor.classList.add('tracking');
  cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
  const target = e.target instanceof Element ? e.target.closest('a,button,summary,input[type="range"]') : null;
  cursor.classList.toggle('engaged', !!target);
  cursor.querySelector('span').textContent = target?.matches('input') ? 'DRAG' : target?.matches('.photo-button') ? 'VIEW' : target?.matches('summary') ? 'READ' : target ? 'OPEN' : '';
}, {passive:true});
addEventListener('pointerdown', e => { if (e.pointerType==='touch') hideCursor(); else cursor.classList.add('pressed'); }, {passive:true});
addEventListener('pointerup', () => cursor.classList.remove('pressed'), {passive:true});
addEventListener('pointercancel', hideCursor, {passive:true});
addEventListener('pointerout', e => { if (!e.relatedTarget) hideCursor(); });
addEventListener('blur', hideCursor);
addEventListener('keydown', e => { if (e.key==='Tab') hideCursor(); });
finePointer.addEventListener('change', hideCursor);
const grid = $('#photo-grid');
portfolio.photos.forEach((photo, index) => {
  const article = document.createElement('article'); article.className = 'photo-card reveal'; article.dataset.category = photo.category;
  const button = document.createElement('button'); button.className = 'photo-button'; button.setAttribute('aria-label', `Open ${photo.title}`);
  const container = document.createElement('div'); container.className = 'photo-image';
  const img = document.createElement('img'); img.src = photo.src; img.alt = photo.alt; img.loading = 'lazy'; img.width = 800; img.height = 1000;
  const icon = document.createElement('span'); icon.className = 'open-photo'; icon.textContent = '↗'; icon.setAttribute('aria-hidden', 'true');
  container.append(img, icon); button.append(container); button.addEventListener('click', () => openPhoto(index));
  const caption = document.createElement('div'); caption.className = 'photo-caption';
  const copy = document.createElement('div'); const title = document.createElement('h3'); title.textContent = photo.title; const note = document.createElement('p'); note.textContent = photo.note;
  copy.append(title, note); const label = document.createElement('span'); label.className = 'meta'; label.textContent = photo.categoryLabel.toUpperCase(); caption.append(copy, label); article.append(button, caption); grid.append(article);
});
let filtered = portfolio.photos.map((_, i) => i);
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  const filter = button.dataset.filter; grid.dataset.filtered=String(filter!=='all'); filtered = [];
  $$('.photo-card').forEach((el, i) => { el.hidden = filter !== 'all' && el.dataset.category !== filter; if (!el.hidden) { filtered.push(i); el.classList.add('visible'); } });
  $('.gallery-count').textContent = `${filtered.length} photographs shown`;
  $('.archive-bar>.meta').textContent = `PREVIEW SELECTION / ${String(filtered.length).padStart(2,'0')} FRAMES`;
}));
let activePhoto = 0;
let lightboxPhotos=portfolio.photos,lightboxOrder=[];
let lastFocus;
const lightbox = $('#lightbox');
function showPhoto(index) {
  activePhoto = index; const p = lightboxPhotos[index];
  $('.lightbox-photo img').src = p.src; $('.lightbox-photo img').alt = p.alt;
  $('#lightbox-title').textContent = p.title; $('#lightbox-note').textContent = p.note;
  $('#lightbox-count').textContent = `${lightboxOrder.indexOf(index) + 1} / ${lightboxOrder.length}`;
}
function openPhoto(index, photos=portfolio.photos) { lightboxPhotos=photos;lightboxOrder=photos===portfolio.photos?[...filtered]:photos.map((_,i)=>i); lastFocus = document.activeElement; showPhoto(index); lightbox.append(cursor); lightbox.showModal(); document.body.classList.add('modal-open'); $('.close-lightbox').focus(); }
function closePhoto() { lightbox.close(); }
function stepPhoto(step) { showPhoto(lightboxOrder[(lightboxOrder.indexOf(activePhoto) + step + lightboxOrder.length) % lightboxOrder.length]); }
$('.close-lightbox').addEventListener('click', closePhoto);
$('.prev-photo').addEventListener('click', () => stepPhoto(-1)); $('.next-photo').addEventListener('click', () => stepPhoto(1));
lightbox.addEventListener('close', () => { document.body.classList.remove('modal-open'); document.body.append(cursor); hideCursor(); lastFocus?.focus(); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) { const r=lightbox.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePhoto(); } });
lightbox.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); stepPhoto(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); stepPhoto(-1); } });
$('#grade-slider').addEventListener('input', e => {
  $('#compare').style.setProperty('--split', `${e.target.value}%`);
  e.target.setAttribute('aria-valuetext', `${100-Number(e.target.value)} percent color treatment revealed`);
});
if (portfolio.portrait) {
  const image = new Image(); image.src = portfolio.portrait; image.alt = portfolio.portraitAlt;
  image.onload = () => { const slot = $('#portrait-slot'); slot.replaceChildren(image); slot.style.padding = '0'; image.style.cssText = 'width:100%;height:100%;object-fit:cover'; };
}
const knowbitCopy = $('.knowbit').nextElementSibling;
knowbitCopy.querySelector('p').textContent = portfolio.knowbit.description;
if (portfolio.knowbit.url) { const a = document.createElement('a'); a.textContent = 'Visit Knowbit AI ↗'; a.href = portfolio.knowbit.url; a.className = 'text-link'; a.target = '_blank'; a.rel = 'noopener noreferrer'; knowbitCopy.querySelector('.muted')?.remove(); knowbitCopy.append(a); }
const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), {threshold:.08,rootMargin:'0px 0px -20px 0px'});
$$('.reveal').forEach(el => observer.observe(el));
// A single sticky canvas spans the opening, archive and camera kit.
// The archive is an opaque foreground surface: no opacity gates or canvas reparenting.
const hero = $('.hero'); const kit = $('.camera-kit'); const stage = $('#camera-stage');
initLensGallery({root:kit,sets:lensSets,onOpen:openPhoto});
const firstPhoto = $('.photo-one'); const secondPhoto = $('.photo-two');
let progress=0,tick=0;
let pose={x:.72,y:.49,scale:1,turn:0,covered:false,active:true};
function calculatePose(){const work=$('#work').getBoundingClientRect(),k=kit.getBoundingClientRect(),anchor=$('.kit-camera-space').getBoundingClientRect(),stageTop=stage.getBoundingClientRect().top;return cameraPose({heroTop:hero.getBoundingClientRect().top,kitAnchorY:anchor.top+anchor.height/2-stageTop,workTop:work.top,workBottom:work.bottom,kitTop:k.top,kitHeight:kit.offsetHeight,kitViewport:$('.kit-sticky').offsetHeight,viewport:stage.clientHeight||innerHeight,width:innerWidth,reduced});}
function updateScroll(){
 tick=0;pose=calculatePose();progress=pose.heroProgress;
 stage.setAttribute('aria-hidden',String(pose.covered||!pose.active));
 $('.hero-progress i').style.transform=`scaleX(${progress})`;
 $('.kit-progress i').style.transform=`scaleX(${pose.kitProgress})`;
 const p=reduced?0:progress;
 firstPhoto.style.transform=`perspective(1000px) translateY(${-p*60}px) rotateY(${-20+p*25}deg) rotateZ(${9-p*8}deg)`;
 secondPhoto.style.transform=`perspective(1000px) translateY(${p*40}px) rotateY(${16-p*20}deg) rotateZ(${-12+p*10}deg)`;
 const r=$('.interlude').getBoundingClientRect();
 if(r.top<innerHeight&&r.bottom>0)$('.interlude div').style.transform=`translateX(${reduced?-6:-6-(1-r.top/innerHeight)*12}%)`;
 rendererUpdate();
}
function requestTick(){if(!tick)tick=requestAnimationFrame(updateScroll);}
addEventListener('scroll',requestTick,{passive:true});addEventListener('resize',requestTick);
new ResizeObserver(requestTick).observe($('#work'));
document.documentElement.classList.add('js-motion');
requestTick();
// A local Three.js module avoids a runtime dependency on an external CDN.
async function initCamera() {
  const THREE = await import('./assets/three.module.js');
  let renderer;
  const surface=document.createElement('canvas');
  const gl=surface.getContext('webgl2',{alpha:true,antialias:devicePixelRatio<2,powerPreference:'low-power'})||surface.getContext('webgl',{alpha:true,antialias:devicePixelRatio<2,powerPreference:'low-power'});
  if(gl){renderer=new THREE.WebGLRenderer({canvas:surface,context:gl,alpha:true});}
  else {const {turntableRenderer}=await import('./turntable-camera.js');renderer=await turntableRenderer();stage.dataset.renderer='turntable';stage.dataset.model='canon-850d';}

  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.6;
  stage.append(renderer.domElement);
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(0,.15,7.6);
  const model = new THREE.Group(); scene.add(model);
  if(gl){
    const { GLTFLoader } = await import('./assets/GLTFLoader.js');
    const loaded = await new GLTFLoader().loadAsync('./assets/canon-850d.glb');
    const asset=loaded.scene;
    asset.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(asset);
    const center=bounds.getCenter(new THREE.Vector3());
    const size=bounds.getSize(new THREE.Vector3());
    const fit=2.4/Math.max(size.x,size.y,size.z);
    const mount=new THREE.Group();
    asset.position.sub(center);mount.add(asset);mount.scale.setScalar(fit);model.add(mount);
    asset.traverse(obj=>{if(obj.isMesh){obj.frustumCulled=false;if(obj.material.map)obj.material.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}});
    stage.dataset.model='canon-850d';
  }
  const hemi=new THREE.HemisphereLight(0xe6efd9,0x222322,3);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xf2f1e6,6);key.position.set(-3,4,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xa5c4b7,5);rim.position.set(3,1,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xd29c83,2);fill.position.set(2,-1,3);scene.add(fill);
  stage.classList.add('ready');
  let width=0,height=0,raf=0,px=0,py=0,mx=0,my=0,lastTime=0;
  let rendered=null;
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(w>0&&h>0&&(w!==width||h!==height)){width=w;height=h;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();camera.position.set(0,0,7.6);}}
  function draw(time){
   raf=0;if(!pose.active||pose.covered||document.hidden){lastTime=0;rendered=null;return;}
   resize();
   const dt=Math.min((time-(lastTime||time-16.67))/1000,.05);lastTime=time;
   const ease=1-Math.exp(-dt/0.16),pointerEase=1-Math.exp(-dt/0.22);
   px+=(mx-px)*pointerEase;py+=(my-py)*pointerEase;
   if(!rendered||reduced)rendered={...pose};
   for(const key of ['x','y','scale','turn'])rendered[key]+=(pose[key]-rendered[key])*ease;
   const viewHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z;
   const base=innerWidth<700?.51:.81;
   const float=reduced?0:Math.sin(time*.00135)*.075;
   const parallax=reduced?0:1-pose.kitProgress*.5;
   model.scale.setScalar(base*rendered.scale);
   model.position.set((rendered.x-.5)*viewHeight*camera.aspect+px*.23*parallax,(.5-rendered.y)*viewHeight+float-py*.14*parallax,0);
   model.rotation.set(-.10+Math.sin(rendered.turn*Math.PI*2)*.10+py*.20*parallax,-.52+rendered.turn*Math.PI*2+px*.55*parallax+(reduced?0:Math.sin(time*.00085)*.045),-.04+Math.sin(rendered.turn*Math.PI*2)*.04+(reduced?0:Math.sin(time*.0008)*.012));
   renderer.render(scene,camera);
   // Render diagnostics let preview checks verify the actual displayed model.
   stage.dataset.rotation=model.rotation.y.toFixed(4);
   stage.dataset.hover=float.toFixed(4);
   stage.dataset.position=`${model.position.x.toFixed(3)},${model.position.y.toFixed(3)}`;
   if(!reduced)requestRender();
  }
  function requestRender(){if(!raf&&pose.active&&!pose.covered&&!document.hidden)raf=requestAnimationFrame(draw);}
  rendererUpdate=requestRender;
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();stage.classList.remove('ready');});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{stage.classList.add('ready');resize();requestTick();});
  addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch'||pose.covered||!pose.active)return;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;requestRender();},{passive:true});
  addEventListener('pointerout',e=>{if(!e.relatedTarget){mx=0;my=0;}},{passive:true});
  document.addEventListener('visibilitychange',()=>{lastTime=0;if(!document.hidden)requestTick();});resize();requestTick();
}
initCamera().catch(error => { stage.classList.remove('ready'); stage.dataset.error='model-load'; console.error('Camera model could not load',error); });
