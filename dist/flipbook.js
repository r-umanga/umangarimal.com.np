export function initFlipbook({photos,onOpen}){
 const dialog=document.querySelector('#photo-book'),stage=dialog.querySelector('.album-stage'),spread=dialog.querySelector('.album-spread'),label=dialog.querySelector('[data-album-count]');
 const cover=dialog.querySelector('[data-album-cover]');let covered=true;
 const compact=matchMedia('(max-width:700px)');
 const pageCount=Math.ceil(photos.length/2);let page=0,stride=compact.matches?1:2,busy=false,finish=null,timer=0,lastFocus=null,touch=null,suppressUntil=0;
 const prev=dialog.querySelector('[data-album-prev]'),next=dialog.querySelector('[data-album-next]');
 function makePage(number){const leaf=document.createElement('div');leaf.className='album-page';leaf.dataset.page=number;leaf.dataset.side=number%2?'right':'left';const running=document.createElement('span');running.className='album-running-head';running.textContent=number%2?'UMANGA RIMAL / NEPAL':'LIFE, OBSERVED.';running.setAttribute('aria-hidden','true');leaf.append(running);const items=photos.slice(number*2,number*2+2);if(items.length===1)leaf.classList.add('album-page-single');else if(items.every(p=>p.width/p.height<=1.15))leaf.classList.add('album-page-portraits');
  items.forEach((photo,slot)=>{const figure=document.createElement('figure'),button=document.createElement('button'),img=new Image(),caption=document.createElement('figcaption');button.type='button';button.className='album-photo';button.dataset.photoIndex=number*2+slot;button.setAttribute('aria-label',`Open ${photo.title}`);img.src=photo.thumb||photo.src;img.alt=photo.alt;img.width=photo.thumbWidth||600;img.height=photo.thumbHeight||900;img.decoding='async';img.loading='eager';caption.textContent=`${String(number*2+slot+1).padStart(2,'0')} / ${photo.title}`;button.append(img);figure.append(button,caption);leaf.append(figure);});const folio=document.createElement('span');folio.className='album-folio';folio.textContent=String(number+1).padStart(2,'0');leaf.append(folio);return leaf;}
 function currentPages(){return Array.from({length:stride},(_,i)=>makePage(page+i));}
 function controls(){prev.disabled=busy||covered||page===0;next.disabled=busy||(!covered&&page+stride>=pageCount);next.textContent=covered?'Open book':'Next';label.textContent=`${stride===1?'Page':'Pages'} ${page+1}${stride===2?'–'+Math.min(page+2,pageCount):''} / ${pageCount}`;dialog.querySelector('[data-album-edge-prev]').disabled=prev.disabled;dialog.querySelector('[data-album-edge-next]').disabled=next.disabled;if(covered)label.textContent=`${photos.length} photographs · Volume 01`;stage.setAttribute('aria-busy',String(busy));}
 function render(){spread.replaceChildren(...currentPages());spread.inert=covered;
  // Keep a visible paper block on both sides, shifting its thickness as pages turn.
  const progress=page/Math.max(1,pageCount-stride);
  stage.style.setProperty('--stack-left',`${3+Math.round(progress*6)}px`);
  stage.style.setProperty('--stack-right',`${9-Math.round(progress*6)}px`);controls();}
 function coverRest(){return compact.matches?'translateX(0) rotateY(-4deg) rotateZ(-1deg)':'translateX(-50%) rotateY(-7deg) rotateZ(-1deg)';}
 function openCover(){if(!covered||busy)return;busy=true;controls();dialog.classList.add('album-opening');let animation=null;const finalTransform='translateX(0) rotateY(-180deg)';
  finish=()=>{if(!busy)return;clearTimeout(timer);animation?.cancel();covered=false;busy=false;finish=null;cover.hidden=true;dialog.classList.remove('album-covered','album-opening');spread.inert=false;controls();spread.querySelector('button')?.focus();};
  if(typeof cover.animate==='function'){animation=cover.animate([{transform:coverRest()},{transform:finalTransform}],{duration:850,easing:'cubic-bezier(.4,.05,.2,1)',fill:'forwards'});animation.finished?.catch(()=>{});animation.onfinish=()=>finish?.();}else{cover.style.transition='transform 850ms cubic-bezier(.4,.05,.2,1)';requestAnimationFrame(()=>cover.style.transform=finalTransform);}timer=setTimeout(()=>finish?.(),950);
 }
 cover.addEventListener('click',openCover);
 function turn(direction){if(busy)return;if(covered){if(direction>0)openCover();return;}const dest=Math.max(0,Math.min(Math.floor((pageCount-1)/stride)*stride,page+direction*stride));if(dest===page)return;
  busy=true;controls();const old=[...spread.children],incoming=Array.from({length:stride},(_,i)=>makePage(dest+i));const sheet=document.createElement('div');sheet.className='album-turn-sheet '+(direction>0?'turn-next':'turn-prev');sheet.setAttribute('aria-hidden','true');sheet.inert=true;
  const front=document.createElement('div'),back=document.createElement('div');front.className='album-face album-face-front';back.className='album-face album-face-back';
  if(stride===2){front.append((direction>0?old[1]:old[0]).cloneNode(true));back.append((direction>0?incoming[0]:incoming[1]).cloneNode(true));spread.replaceChildren(...(direction>0?[old[0],incoming[1]]:[incoming[0],old[1]]));}else{front.append(old[0].cloneNode(true));back.append(incoming[0].cloneNode(true));spread.replaceChildren(incoming[0]);}
  sheet.append(front,back);stage.append(sheet);spread.inert=true;
  const shadow=document.createElement('div');shadow.className='album-turn-shadow '+(direction>0?'shadow-next':'shadow-prev');shadow.setAttribute('aria-hidden','true');stage.append(shadow);let shadowAnimation=null;
  if(typeof shadow.animate==='function'){shadowAnimation=shadow.animate([{opacity:0,transform:'scaleX(.1)'},{opacity:.4,transform:'scaleX(.8)',offset:.48},{opacity:0,transform:'scaleX(.12)'}],{duration:720,easing:'ease-in-out'});shadowAnimation.finished?.catch(()=>{});}
  let animation=null;finish=()=>{if(!busy)return;clearTimeout(timer);animation?.cancel();shadowAnimation?.cancel();shadow.remove();sheet.remove();spread.inert=false;page=dest;busy=false;finish=null;render();};sheet.addEventListener('animationend',()=>finish?.(),{once:true});const finalTurn=direction>0?'rotateY(-180deg)':'rotateY(180deg)';if(typeof sheet.animate==='function'){animation=sheet.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${direction>0?-82:82}deg) skewY(${direction>0?-1.5:1.5}deg)`,offset:.48},{transform:finalTurn}],{duration:720,easing:'cubic-bezier(.4,.05,.2,1)',fill:'forwards'});animation.finished?.catch(()=>{});animation.onfinish=()=>finish?.();}else{sheet.style.transition='transform 720ms cubic-bezier(.4,.05,.2,1)';requestAnimationFrame(()=>sheet.style.transform=finalTurn);}timer=setTimeout(()=>finish?.(),820);
 }
 prev.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
 stage.addEventListener('click',e=>{if(covered||Date.now()<suppressUntil||busy)return;const button=e.target.closest('[data-photo-index]');if(button)onOpen(Number(button.dataset.photoIndex),photos);});
 dialog.querySelector('[data-album-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?1:-1);}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 let pointer=null;
 stage.addEventListener('pointerdown',e=>{if(e.button!==0||busy||covered||e.target.closest('.album-edge'))return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};});
 stage.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(!pointer.moved&&Math.abs(dy)>15&&Math.abs(dy)>Math.abs(dx)){pointer=null;return;}if(Math.abs(dx)>8){pointer.moved=true;stage.setPointerCapture?.(e.pointerId);stage.classList.add('album-dragging');}});
 stage.addEventListener('pointerup',e=>{if(!pointer||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x,moved=pointer.moved;pointer=null;stage.classList.remove('album-dragging');if(stage.hasPointerCapture?.(e.pointerId))stage.releasePointerCapture(e.pointerId);if(moved){suppressUntil=Date.now()+500;if(Math.abs(dx)>40)turn(dx<0?1:-1);}});
 stage.addEventListener('pointercancel',()=>{pointer=null;stage.classList.remove('album-dragging');});stage.addEventListener('dragstart',e=>e.preventDefault());
 dialog.querySelector('[data-album-edge-prev]').addEventListener('click',()=>turn(-1));dialog.querySelector('[data-album-edge-next]').addEventListener('click',()=>turn(1));
 dialog.addEventListener('close',()=>{finish?.();touch=null;document.body.classList.toggle('modal-open',!!document.querySelector('dialog[open]'));lastFocus?.focus();});
 compact.addEventListener('change',()=>{finish?.();stride=compact.matches?1:2;page=Math.floor(page/stride)*stride;if(dialog.open)render();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finish?.();});
 document.querySelector('[data-open-book]').addEventListener('click',()=>{lastFocus=document.activeElement;page=0;covered=true;cover.hidden=false;cover.style.transform='';cover.style.transition='';dialog.classList.add('album-covered');render();dialog.showModal();document.body.classList.add('modal-open');cover.focus();});
 return {turn};
}
