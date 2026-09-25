// Actual supplied GLB rendered through 72 angles, for browsers without WebGL.
// Keeps scroll rotation and hover while avoiding a 40,000-triangle CPU loop.
export async function turntableRenderer(){
 const atlas=new Image();atlas.src='./assets/canon-turntable.webp';await atlas.decode();
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});
 let width=1,height=1,ratio=1;
 return {domElement:canvas,setPixelRatio(v){ratio=Math.min(v,1.5)},setSize(w,h){width=w;height=h;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)},render(scene,camera){
  const model=scene.children[0];
  const viewHeight=2*Math.tan(camera.fov*Math.PI/360)*camera.position.z;
  const side=3.8*model.scale.x/viewHeight*height;
  const x=width/2+model.position.x/viewHeight*height,y=height/2-model.position.y/viewHeight*height;
  const frame=((model.rotation.y/(Math.PI*2)%1)+1)%1*72;
  const first=Math.floor(frame),blend=frame-first;
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.translate(x,y);ctx.rotate(-model.rotation.z);
  const draw=(i,alpha)=>{i%=72;ctx.globalAlpha=alpha;ctx.drawImage(atlas,(i%9)*512,Math.floor(i/9)*512,512,512,-side/2,-side/2,side,side);};
  draw(first,1-blend);ctx.globalCompositeOperation='lighter';draw(first+1,blend);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
 }};
}
