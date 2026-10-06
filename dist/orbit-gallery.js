// Photo constellation: small DOM images, transform-only motion, no WebGL.
const TAU=Math.PI*2;
export function orbitPose(index,count,angle,width,height){
 const compact=width<650,tilt=-.48,a=index/Math.max(1,count)*TAU+angle;
 const rx=Math.min(width*(compact?.29:.225),300),ry=Math.min(height*(compact?.275:.29),180);
 const u=Math.cos(a)*rx,v=Math.sin(a)*ry,depth=(Math.sin(a)+1)/2;
 return{x:u*Math.cos(tilt)-v*Math.sin(tilt),y:u*Math.sin(tilt)+v*Math.cos(tilt),scale:.72+depth*.35,z:Math.round(20+depth*60)};
}
export function initOrbit({grid,photos,onOpen}){
 const cards=[...grid.children],stage=grid.closest('.constellation'),status=stage.querySelector('[data-orbit-status]');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 let order=photos.map((_,i)=>i),angle=.3,target=.3,width=grid.clientWidth||900,height=grid.clientHeight||600;
 let visible=false,near=false,raf=0,last=0,lastDraw=0,hover=false,focus=false,keyboard=false,heldIndex=-1,heldPose=null,drag=null,suppressUntil=0,modal=false,front=-1;
 function load(){near=true;order.forEach(index=>{const img=cards[index].querySelector('img');if(img.dataset.src){img.src=img.dataset.src;delete img.dataset.src;}});}
 const poses=new Map();
 function hold(index){cards.forEach((card,i)=>card.classList.toggle('is-hovered',i===index));heldIndex=index;heldPose=index<0?null:poses.get(index);draw();wake();}
 function draw(){
  let nearest=0,best=-1;
  order.forEach((index,slot)=>{const orbit=orbitPose(slot,order.length,angle,width,height),p=index===heldIndex&&heldPose?heldPose:orbit,old=poses.get(index);const placed=old&&index!==heldIndex?{...p,x:old.x+(p.x-old.x)*.28,y:old.y+(p.y-old.y)*.28,scale:old.scale+(p.scale-old.scale)*.28}:p;poses.set(index,placed);const card=cards[index];card.style.transform=`translate(-50%,-50%) translate3d(${placed.x.toFixed(2)}px,${placed.y.toFixed(2)}px,0) scale(${placed.scale.toFixed(3)})`;card.style.zIndex=index===heldIndex?240:p.z;if(orbit.z>best){best=orbit.z;nearest=slot;}});

  if(front!==nearest){front=nearest;const index=order[front];status.textContent=index===undefined?'':`${String(front+1).padStart(2,'0')} / ${String(order.length).padStart(2,'0')} — ${photos[index].title}`;}
 }
 function allowed(){return visible&&!document.hidden&&!modal;}
 function wantsMotion(){return order.length>1||Math.abs(target-angle)>.0003;}
 function tick(now){raf=0;if(!allowed())return;if(now-lastDraw<32){raf=requestAnimationFrame(tick);return;}const dt=Math.min((now-(last||now-33))/1000,.06);last=now;lastDraw=now;
  if(!drag)target+=dt*.22;
  angle=angle+(target-angle)*(1-Math.exp(-dt*13));draw();
  if(wantsMotion())raf=requestAnimationFrame(tick);
 }
 function wake(){if(allowed()&&wantsMotion()&&!raf){last=0;raf=requestAnimationFrame(tick);}}
 function sync(){modal=!!document.querySelector('dialog[open]');stage.classList.toggle('orbit-live',allowed());if(!allowed()&&raf){cancelAnimationFrame(raf);raf=0;}else wake();}
 function moveTo(slot){if(!order.length)return;let desired=Math.PI/2-slot/order.length*TAU;const diff=((desired-angle+Math.PI)%TAU+TAU)%TAU-Math.PI;target=angle+diff;wake();}
 function next(direction){moveTo((front+direction+order.length)%order.length);}
 stage.querySelector('[data-orbit-prev]').addEventListener('click',()=>next(-1));stage.querySelector('[data-orbit-next]').addEventListener('click',()=>next(1));
 cards.forEach((card,index)=>{const button=card.querySelector('button');button.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();return;}onOpen(index);});button.addEventListener('focus',()=>{focus=keyboard;if(keyboard){moveTo(order.indexOf(index));hold(index);}});});
 window.addEventListener('keydown',e=>{if(e.key==='Tab')keyboard=true;},true);window.addEventListener('pointerdown',()=>{keyboard=false;focus=false;wake();},true);grid.addEventListener('focusin',e=>{focus=keyboard&&!!e.target.closest('.photo-button');});grid.addEventListener('focusout',e=>{if(!grid.contains(e.relatedTarget)){focus=false;hold(-1);wake();}});
 grid.addEventListener('pointerover',e=>{if(fine.matches){const index=cards.indexOf(e.target.closest('.photo-card'));if(index!==heldIndex)hold(index);}});grid.addEventListener('pointerleave',()=>hold(-1));
 grid.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();next(e.key==='ArrowRight'?1:-1);}});
 grid.addEventListener('pointerdown',e=>{if(e.button!==0)return;hold(-1);drag={id:e.pointerId,x:e.clientX,y:e.clientY,angle:target,moved:false};});
 grid.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}if(!drag.moved&&Math.abs(dx)>7){drag.moved=true;grid.setPointerCapture(e.pointerId);grid.classList.add('dragging');}if(drag.moved){target=drag.angle+dx/Math.max(width,300)*TAU;wake();}});
 function release(e){if(!drag||e.pointerId!==drag.id)return;if(drag.moved)suppressUntil=Date.now()+450;drag=null;grid.classList.remove('dragging');if(grid.hasPointerCapture(e.pointerId))grid.releasePointerCapture(e.pointerId);wake();}
 grid.addEventListener('pointerup',release);grid.addEventListener('pointercancel',release);
 grid.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
 grid.addEventListener('dragstart',e=>e.preventDefault());
 // Horizontal trackpad gestures turn the constellation; vertical page scrolling stays native.
 grid.addEventListener('wheel',e=>{if(!e.ctrlKey&&Math.abs(e.deltaX)>Math.abs(e.deltaY)){target+=Math.max(-120,Math.min(120,e.deltaX))*.003;wake();}},{passive:true});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{if(entries[0].isIntersecting)load();},{rootMargin:'240px'}).observe(stage);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(stage);}else{visible=true;load();}
 new ResizeObserver(()=>{width=grid.clientWidth||width;height=grid.clientHeight||height;draw();}).observe(grid);
 new MutationObserver(sync).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 document.addEventListener('visibilitychange',sync);
 const featured=['in-flight','two-smiles','young-macaque','passing-by','dashboard-light','temple-steps','through-the-arch','yellow-afterglow','beside-the-carved-pillar','gold-and-white'];
 function filter(indices){const picks=indices.filter(i=>featured.includes(photos[i].id));const limit=10;order=indices.length===photos.length?picks.slice(0,limit):indices.slice(0,limit);hold(-1);cards.forEach((c,i)=>c.hidden=!order.includes(i));angle=.3;target=.3;front=-1;stage.querySelectorAll('[data-orbit-prev],[data-orbit-next]').forEach(b=>b.disabled=order.length<2);if(near)load();draw();wake();}
 draw();sync();return{filter};
}
