import {NodeIO} from '@gltf-transform/core';
import {weld,prune} from '@gltf-transform/functions';
import fs from 'node:fs/promises';
const [cameraPath,lensPath,out]=process.argv.slice(2);
const io=new NodeIO();const doc=await io.read(cameraPath),root=doc.getRoot(),buffer=root.listBuffers()[0];
const original=root.listMeshes()[0].listPrimitives()[0];
const pos=original.getAttribute('POSITION'),nor=original.getAttribute('NORMAL'),uv=original.getAttribute('TEXCOORD_0'),indices=original.getIndices().getArray();
const min=pos.getMin([]),max=pos.getMax([]),center=min.map((x,i)=>(x+max[i])/2),fit=2.4/Math.max(...max.map((x,i)=>x-min[i]));
const mountRaw=[.171,-.227,.272],mount=mountRaw.map((x,i)=>(x-center[i])*fit);
function clip(poly,front){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a[2]-.272,db=b[2]-.272,ia=front?da>=0:da<=0,ib=front?db>=0:db<=0;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((x,j)=>x+(b[j]-x)*t));}}return out;}
function part(front){const p=[],n=[],t=[];for(let i=0;i<indices.length;i+=3){const tri=[0,1,2].map(j=>{let k=indices[i+j];return [...pos.getElement(k,[]),...nor.getElement(k,[]),...uv.getElement(k,[])];});const poly=clip(tri,front);for(let j=1;j+1<poly.length;j++)for(const a of [poly[0],poly[j],poly[j+1]]){p.push(...a.slice(0,3).map((x,k)=>(x-(front?mountRaw[k]:center[k]))*fit));n.push(...a.slice(3,6));t.push(...a.slice(6,8));}}
 const acc=(type,arr)=>doc.createAccessor().setType(type).setArray(new Float32Array(arr)).setBuffer(buffer);
 return doc.createPrimitive().setAttribute('POSITION',acc('VEC3',p)).setAttribute('NORMAL',acc('VEC3',n)).setAttribute('TEXCOORD_0',acc('VEC2',t)).setMaterial(original.getMaterial());
}
const body=part(false),kit=part(true),scene=root.listScenes()[0];for(const node of [...scene.listChildren()])node.dispose();
scene.addChild(doc.createNode('camera-body').setMesh(doc.createMesh('camera-body').addPrimitive(body)));
scene.addChild(doc.createNode('lens-kit').setTranslation(mount).setMesh(doc.createMesh('lens-kit').addPrimitive(kit)));
// Scan highlights already live in the albedo. Matte polymer avoids doubling them.
for(const mat of root.listMaterials())mat.setMetallicRoughnessTexture(null).setMetallicFactor(.04).setRoughnessFactor(.72).setNormalScale(.6);
await doc.transform(weld(),prune());await io.write(out+'/camera-kiri.glb',doc);
const ld=await io.read(lensPath),lr=ld.getRoot();for(const mesh of lr.listMeshes())for(const prim of mesh.listPrimitives()){
 const p=prim.getAttribute('POSITION'),n=prim.getAttribute('NORMAL');let scale=(.944/.608603)*fit;
 for(let i=0;i<p.getCount();i++){const v=p.getElement(i,[]);p.setElement(i,[v[0]*scale,-v[2]*scale,(v[1]+.499889)*scale]);const a=n.getElement(i,[]);n.setElement(i,[a[0],-a[2],a[1]]);}
}
for(const mat of lr.listMaterials())mat.setMetallicRoughnessTexture(null).setMetallicFactor(.04).setRoughnessFactor(.72).setNormalScale(.6);
lr.listNodes()[0].setName('lens-tele');await ld.transform(prune());await io.write(out+'/lens-55-250.glb',ld);
await fs.writeFile(out+'/camera-rig.json',JSON.stringify({mount,fit,cutZ:.272,parts:['camera-body','lens-kit','lens-tele']},null,2));
console.log({mount,fit});
