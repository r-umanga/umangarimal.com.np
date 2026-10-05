// Transparent renders of the supplied camera body and both real lens meshes.
// The same rig moves each part; the fallback preserves the exchange choreography.
export async function turntableRenderer(THREE){
 const spans={'camera-body':3.4,'lens-kit':2.4,'lens-tele':4.4},atlases={};
 await Promise.all(Object.keys(spans).map(async name=>{const image=new Image();image.src=`./assets/${name}-turntable.webp`;await image.decode();atlases[name]=image;}));
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)throw new Error('Canvas unavailable');
 let width=1,height=1,ratio=1;
 return {domElement:canvas,setPixelRatio(v){ratio=Math.min(v,1.5)},setSize(w,h){width=w;height=h;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)},render(scene,camera){
  const viewHeight=2*Math.tan(camera.fov*Math.PI/360)*camera.position.z;
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
  const parts=scene.children.filter(o=>o.userData.atlas&&o.visible).sort((a,b)=>a.position.z-b.position.z);
  for(const part of parts){
   const name=part.userData.atlas,rotation=new THREE.Euler().setFromQuaternion(part.quaternion,'YXZ');
   // Mounted sprites must share the body's projection, scale and simplified pitch.
   // Independently applying perspective to the lens opens a false gap at the mount.
   const parent=part.userData.attachedTo;let position=part.position,scale=part.scale.x,depthZ=position.z;
   if(parent){
    const bodyRotation=new THREE.Euler().setFromQuaternion(parent.quaternion,'YXZ');
    rotation.copy(bodyRotation);
    const atlasRotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,bodyRotation.y,bodyRotation.z,'ZYX'));
    position=part.userData.seat.clone().multiplyScalar(parent.scale.x).applyQuaternion(atlasRotation).add(parent.position);
    scale=parent.scale.x;depthZ=parent.position.z;
   }
   const depth=camera.position.z/(camera.position.z-depthZ),side=spans[name]*scale/viewHeight*height*depth;
   const x=width/2+position.x/viewHeight*height*depth,y=height/2-position.y/viewHeight*height*depth;
   const frame=((rotation.y/(Math.PI*2)%1)+1)%1*72,first=Math.floor(frame),blend=frame-first;
   ctx.save();ctx.translate(x,y);ctx.rotate(-rotation.z);
   const draw=(i,alpha)=>{i%=72;ctx.globalAlpha=alpha;ctx.drawImage(atlases[name],(i%9)*512,Math.floor(i/9)*512,512,512,-side/2,-side/2,side,side);};
   draw(first,1-blend);ctx.globalCompositeOperation='lighter';draw(first+1,blend);ctx.restore();
  }
 }};
}
