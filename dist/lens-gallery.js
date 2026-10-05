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
  root.querySelector('[data-lens-description]').textContent=set.description;
  root.querySelector('[data-lens-count]').textContent=`${String(current+1).padStart(2,'0')} / ${String(ready.length).padStart(2,'0')}`;
  root.querySelector('[data-parked-lens]').textContent=ready[(current+1)%ready.length].name.replace('EF-S ','')+' · NEXT LENS';
  set.photos.slice(0,4).forEach((photo,index)=>{
   const button=document.createElement('button');button.className='lens-photo';button.type='button';button.style.setProperty('--photo-index',index);button.setAttribute('aria-label',`Open ${photo.title}`);
   const img=new Image();img.src=photo.thumb||photo.src;img.decoding='async';img.width=photo.thumbWidth||720;img.height=photo.thumbHeight||900;img.alt=photo.alt||photo.title;img.loading='lazy';
   const caption=document.createElement('span');caption.textContent=photo.title;button.append(img,caption);button.addEventListener('click',()=>onOpen(index,set.photos));gallery.append(button);
  });
  controls.hidden=ready.length<2;
  surface.style.pointerEvents=ready.length>1||set.photos.length?'auto':'none';
  root.classList.toggle('has-lens-photos',set.photos.length>0);
  status.textContent=set.photos.length?`${set.name} · ${set.photos.length} photographs`:`${set.name} attached`;
  root.dataset.lens=set.id;
 }
 async function select(direction){
  if(busy||ready.length<2)return;
  const previous=current,next=(current+direction+ready.length)%ready.length;busy=true;root.classList.add('changing-lens');controls.querySelectorAll('button').forEach(b=>b.disabled=true);surface.setAttribute('aria-busy','true');status.textContent='Changing lens';
  // Keep the visible equipment details in step with a requested drag, button or key swap.
  current=next;render();status.textContent=`Attaching ${ready[next].name}`;
  try{await onSelect(ready[next],ready[previous],direction);status.textContent=`${ready[next].name} attached`;}
  catch{current=previous;render();status.textContent='The lens could not load. Please try again.';}
  finally{busy=false;root.classList.remove('changing-lens');controls.querySelectorAll('button').forEach(b=>b.disabled=false);surface.setAttribute('aria-busy','false');}
 }
 root.querySelector('[data-lens-prev]').addEventListener('click',()=>select(-1));
 root.querySelector('[data-lens-next]').addEventListener('click',()=>select(1));
 const surface=root.querySelector('.lens-swipe-surface');
 surface.addEventListener('pointerdown',e=>{if(ready.length>1&&!busy&&!e.target.closest('button')){start={x:e.clientX,y:e.clientY,id:e.pointerId};surface.setPointerCapture(e.pointerId);}});
 surface.addEventListener('pointerup',e=>{if(!start||e.pointerId!==start.id)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)select(dx<0?1:-1);});
 surface.addEventListener('pointercancel',()=>{start=null;});
 surface.addEventListener('keydown',e=>{if(ready.length<2)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(e.key==='ArrowRight'?1:-1);}});
 surface.tabIndex=ready.length>1?0:-1;
 render();return {select};
}
