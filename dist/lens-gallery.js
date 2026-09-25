// Lens-specific photos are populated only from Umanga's supplied work.
// Controls appear when at least two complete lens sets are configured.
export function initLensGallery({root,sets,onOpen,onSelect=async()=>{throw new Error("Lens model must be configured before switching")}}){
 const gallery=root.querySelector('.lens-photo-orbit');
 const controls=root.querySelector('.lens-selector');
 const title=root.querySelector('[data-lens-name]');
 const status=root.querySelector('.lens-gallery-status');
 const ready=sets.filter(set=>set.id&&set.name);
 let current=0,busy=false,start=null;
 function render(){
  const set=ready[current];if(!set)return;
  title.textContent=set.name;gallery.replaceChildren();
  set.photos.slice(0,4).forEach((photo,index)=>{
   const button=document.createElement('button');button.className='lens-photo';button.type='button';button.style.setProperty('--photo-index',index);button.setAttribute('aria-label',`Open ${photo.title}`);
   const img=new Image();img.src=photo.src;img.alt=photo.alt||photo.title;img.loading='lazy';
   const caption=document.createElement('span');caption.textContent=photo.title;button.append(img,caption);button.addEventListener('click',()=>onOpen(index,set.photos));gallery.append(button);
  });
  controls.hidden=ready.length<2;
  surface.style.pointerEvents=ready.length>1||set.photos.length?'auto':'none';
  root.classList.toggle('has-lens-photos',set.photos.length>0);
  status.textContent=set.photos.length?`${set.name} · ${set.photos.length} photographs`:'';
  root.dataset.lens=set.id;
 }
 async function select(direction){
  if(busy||ready.length<2)return;
  const next=(current+direction+ready.length)%ready.length;busy=true;root.classList.add('changing-lens');
  try{await onSelect(ready[next],ready[current],direction);current=next;render();}
  catch{status.textContent='The lens could not load. Please try again.';}
  finally{busy=false;root.classList.remove('changing-lens');}
 }
 root.querySelector('[data-lens-prev]').addEventListener('click',()=>select(-1));
 root.querySelector('[data-lens-next]').addEventListener('click',()=>select(1));
 const surface=root.querySelector('.lens-swipe-surface');
 surface.addEventListener('pointerdown',e=>{if(ready.length>1)start={x:e.clientX,y:e.clientY,id:e.pointerId};});
 surface.addEventListener('pointerup',e=>{if(!start||e.pointerId!==start.id)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)select(dx<0?1:-1);});
 surface.addEventListener('pointercancel',()=>{start=null;});
 surface.addEventListener('keydown',e=>{if(ready.length<2)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(e.key==='ArrowRight'?1:-1);}});
 surface.tabIndex=ready.length>1?0:-1;
 render();return {select};
}
