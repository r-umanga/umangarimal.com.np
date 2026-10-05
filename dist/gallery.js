export function initGallery({photos,cursor,hideCursor=()=>{}}){
 const $=s=>document.querySelector(s),grid=$('#photo-grid'),dialog=$('#lightbox');
 const image=dialog.querySelector('.lightbox-photo img'),count=$('#lightbox-count');
 let filtered=photos.map((_,i)=>i),order=[],collection=photos,active=0,lastFocus=null,touch=null;
 const buttons=[...document.querySelectorAll('[data-filter]')];
 photos.forEach((photo,index)=>{
  const card=document.createElement('article');card.className='photo-card reveal';card.dataset.category=photo.category;
  const button=document.createElement('button');button.type='button';button.className='photo-button';button.setAttribute('aria-label',`Open ${photo.title}`);
  const frame=document.createElement('div');frame.className='photo-image';const img=new Image();img.src=photo.thumb||photo.src;img.alt=photo.alt||photo.title;img.loading='lazy';img.decoding='async';img.width=photo.thumbWidth||photo.width||720;img.height=photo.thumbHeight||photo.height||900;
  if(photo.thumb&&photo.width>photo.thumbWidth){img.srcset=`${photo.thumb} ${photo.thumbWidth}w, ${photo.src} ${photo.width}w`;img.sizes='(max-width: 550px) 90vw, (max-width: 1000px) 44vw, 28vw';}
  const icon=document.createElement('span');icon.className='open-photo';icon.textContent='+';icon.setAttribute('aria-hidden','true');frame.append(img,icon);button.append(frame);button.addEventListener('click',()=>openPhoto(index));
  const caption=document.createElement('div');caption.className='photo-caption';const copy=document.createElement('div'),title=document.createElement('h3'),label=document.createElement('p');title.textContent=photo.title;label.textContent=photo.categoryLabel||photo.category;copy.append(title,label);caption.append(copy);card.append(button,caption);grid.append(card);
 });
 function filter(category){
  filtered=[];grid.dataset.filtered=String(category!=='all');[...grid.children].forEach((card,i)=>{card.hidden=category!=='all'&&photos[i].category!==category;if(!card.hidden){filtered.push(i);if(category!=='all')card.classList.add('visible');}});
  buttons.forEach(b=>{const selected=b.dataset.filter===category;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  $('.gallery-count').textContent=`${filtered.length} photographs shown`;$('.archive-bar>.meta').textContent=`${String(filtered.length).padStart(2,'0')} FRAMES`;
 }
 buttons.forEach(b=>{b.hidden=b.dataset.filter!=='all'&&!photos.some(p=>p.category===b.dataset.filter);b.addEventListener('click',()=>filter(b.dataset.filter));});filter('all');
 function show(index){
  const photo=collection[index];if(!photo)return;active=index;image.alt=photo.alt||photo.title;image.src=photo.src;
  $('#lightbox-title').textContent=photo.title;$('#lightbox-note').textContent=photo.note||'';count.textContent=`${order.indexOf(index)+1} / ${order.length}`;
  dialog.querySelectorAll('.prev-photo,.next-photo').forEach(b=>{b.disabled=order.length<2;});
 }
 function openPhoto(index,list=photos){
  if(!list.length)return;collection=list;order=list===photos?[...filtered]:list.map((_,i)=>i);if(!order.includes(index))return;
  lastFocus=document.activeElement;show(index);if(cursor)dialog.append(cursor);dialog.showModal();document.body.classList.add('modal-open');dialog.querySelector('.close-lightbox').focus();
 }
 function step(direction){if(order.length)show(order[(order.indexOf(active)+direction+order.length)%order.length]);}
 dialog.querySelector('.close-lightbox').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.prev-photo').addEventListener('click',()=>step(-1));dialog.querySelector('.next-photo').addEventListener('click',()=>step(1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}if(e.key==='Escape'){e.preventDefault();dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(cursor)document.body.append(cursor);hideCursor();lastFocus?.focus();touch=null;});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 const surface=dialog.querySelector('.lightbox-photo');
 surface.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
 surface.addEventListener('touchmove',e=>{if(e.touches.length!==1)touch=null;},{passive:true});
 surface.addEventListener('touchend',e=>{if(!touch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1);},{passive:true});
 surface.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
 return {openPhoto,filter};
}
