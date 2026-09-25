// Canvas projection fallback for browsers without WebGL. Reuses the actual 3D mesh.
export function softwareRenderer(THREE){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});
 let width=1,height=1,ratio=1;
 const p=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),normal=new THREE.Vector3(),ab=new THREE.Vector3(),ac=new THREE.Vector3();
 const light=new THREE.Vector3(-.45,.8,1).normalize();
 return {domElement:canvas,setPixelRatio(v){ratio=Math.min(v,1.25)},setSize(w,h){width=w;height=h;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio)},render(scene,camera){
  scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  const matrix=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),faces=[];
  scene.traverse(mesh=>{
   if(!mesh.isMesh||!mesh.visible||mesh.material.map)return;
   const g=mesh.geometry,positions=g.attributes.position,ix=g.index,mat=mesh.material,color=mat.color||new THREE.Color('#a0a89e'),count=ix?ix.count:positions.count;
   for(let i=0;i<count;i+=3){
    a.fromBufferAttribute(positions,ix?ix.getX(i):i).applyMatrix4(mesh.matrixWorld);
    b.fromBufferAttribute(positions,ix?ix.getX(i+1):i+1).applyMatrix4(mesh.matrixWorld);
    c.fromBufferAttribute(positions,ix?ix.getX(i+2):i+2).applyMatrix4(mesh.matrixWorld);
    ab.subVectors(b,a);ac.subVectors(c,a);normal.crossVectors(ab,ac).normalize();
    if(normal.dot(p.subVectors(camera.position,a))<=0)continue;
    const shade=.40+Math.max(0,normal.dot(light))*.95;
    const points=[];let depth=0;
    for(const v of [a,b,c]){p.copy(v).applyMatrix4(matrix);depth+=p.z;points.push([(p.x*.5+.5)*width,(-p.y*.5+.5)*height]);}
    const channel=value=>Math.round(Math.min(1,THREE.MathUtils.clamp(value*shade,0,1)**(1/2.2))*255);
    faces.push({points,depth,color:`rgba(${channel(color.r)},${channel(color.g)},${channel(color.b)},${mat.transparent?mat.opacity:1})`});
   }
  });
  faces.sort((a,b)=>b.depth-a.depth);ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
  for(const f of faces){ctx.beginPath();ctx.moveTo(...f.points[0]);ctx.lineTo(...f.points[1]);ctx.lineTo(...f.points[2]);ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}
 }};
}
