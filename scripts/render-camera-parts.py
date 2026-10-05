"""Render supplied, prepared meshes for the no-WebGL fallback; optional offline tooling."""
import os
os.environ['PYOPENGL_PLATFORM']='egl'
import numpy as np,trimesh,pyrender,json
from PIL import Image
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'dist/assets'
cam=trimesh.load(out/'camera-kiri.glb',force='scene');tele=trimesh.load(out/'lens-55-250.glb',force='scene')
parts={}
for s in [cam,tele]:
 for node in s.graph.nodes_geometry:
  transform,name=s.graph[node];parts[node]=s.geometry[name].copy()
# Models are already normalized. Atlas centers are each part's mount/origin.
spans={'camera-body':3.4,'lens-kit':2.4,'lens-tele':4.4}
r=pyrender.OffscreenRenderer(512,512)
for name,m in parts.items():
 scene=pyrender.Scene(bg_color=[0,0,0,0],ambient_light=[.3,.3,.3]);node=scene.add(pyrender.Mesh.from_trimesh(m,smooth=True));pose=np.eye(4);pose[2,3]=7.6
 scene.add(pyrender.OrthographicCamera(xmag=spans[name]/2,ymag=spans[name]/2),pose=pose)
 for eye,intensity in [([-3,4,5],3),([3,1,3],1.8),([3,2,-4],2)]:
  eye=np.array(eye,dtype=float);z=eye/np.linalg.norm(eye);x=np.cross([0,1,0],z);x/=np.linalg.norm(x);y=np.cross(z,x);p=np.eye(4);p[:3,:3]=np.column_stack([x,y,z]);p[:3,3]=eye;scene.add(pyrender.DirectionalLight(color=np.ones(3),intensity=intensity),pose=p)
 board=Image.new('RGBA',(4608,4096))
 for i in range(72):
  p=trimesh.transformations.rotation_matrix(i*2*np.pi/72,[0,1,0]);scene.set_pose(node,p);color,_=r.render(scene,flags=pyrender.RenderFlags.RGBA);im=Image.fromarray(color);board.paste(im,((i%9)*512,(i//9)*512))
 board.save(out/(name+'-turntable.webp'),quality=88,method=6);print(name,'rendered',flush=True)
r.delete()
