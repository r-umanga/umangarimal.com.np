// Geometry-led, reversible motion. The camera stays in its reserved kit slot.
const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)};
const mix=(a,b,t)=>a+(b-a)*t;
export function cameraPose({heroTop=0,workTop,workBottom,kitTop,kitHeight,kitViewport,kitAnchorY,viewport,width,reduced}) {
 const mobile=width<700;
 const homeX=mobile?.69:.72,homeY=mobile?.87:.48;
 const dive=smooth((viewport-workTop)/(viewport*.80));
 const emerge=smooth((viewport*1.05-kitTop)/(viewport*.90));
 const spin=smooth(-kitTop/Math.max(viewport*.6,kitHeight-kitViewport));
 const heroTurn=smooth(-heroTop/(viewport*.8));
 const anchorY=kitAnchorY/viewport;
 let x=mix(homeX,.65,dive),y=mix(homeY,.80,dive),scale=mix(1,.78,dive),turn=heroTurn*.32+dive*.20;
 // Both paths meet while the archive physically covers the camera.
 if(kitTop<viewport*1.05){
  x=mix(.65,.5,emerge);
  y=mix(.80,anchorY,emerge);
  scale=mix(.78,mobile?.83:.80,emerge);
  turn=.52+emerge*.40+spin;
 }
 if(reduced){turn=0;}
 return {x,y,scale,turn,emerge,kitProgress:spin,heroProgress:dive,covered:workTop<0&&workBottom>viewport,active:kitTop+kitHeight>0};
}
