import os
os.environ['PYOPENGL_PLATFORM']='egl'
import numpy as np,trimesh,pyrender
from PIL import Image
from pathlib import Path
src=Path(__file__).resolve().parents[1]/'dist/assets/canon-850d.glb'
out=src.parent
s=trimesh.load(src,force='scene');center=(s.bounds[0]+s.bounds[1])/2;fit=2.4/max(s.extents)
scene=pyrender.Scene(bg_color=[0,0,0,0],ambient_light=[.25,.25,.25]);mesh_nodes=[]
for name in s.graph.nodes_geometry:
 transform,geom=s.graph[name];m=s.geometry[geom].copy();m.apply_transform(transform);m.vertices=(m.vertices-center)*fit
 mesh_nodes.append(scene.add(pyrender.Mesh.from_trimesh(m,smooth=True)))
pose=np.eye(4);pose[:3,3]=[0,0,7.6];scene.add(pyrender.OrthographicCamera(xmag=1.9,ymag=1.9),pose=pose)
# Broad, neutral studio illumination for the low-GPU fallback.
for eye,intensity in [([0,2,5],3),([-3,1,3],2),([3,2,-4],2)]:
 eye=np.array(eye,dtype=float);z=eye/np.linalg.norm(eye);x=np.cross([0,1,0],z);x/=np.linalg.norm(x);y=np.cross(z,x);p=np.eye(4);p[:3,:3]=np.column_stack([x,y,z]);p[:3,3]=eye;scene.add(pyrender.DirectionalLight(color=np.ones(3),intensity=intensity),pose=p)
r=pyrender.OffscreenRenderer(512,512);board=Image.new('RGBA',(9*512,8*512))
for i in range(72):
 a=i*2*np.pi/72;c=np.cos(a);s=np.sin(a);p=np.array([[c,0,s,0],[0,1,0,0],[-s,0,c,0],[0,0,0,1]])
 for node in mesh_nodes:scene.set_pose(node,p)
 color,_=r.render(scene,flags=pyrender.RenderFlags.RGBA);im=Image.fromarray(color);board.paste(im,((i%9)*512,(i//9)*512))
 if i==66:im.save(out/'canon-poster.webp',quality=90)
 if i%18==0:print('Rendered',i+1,flush=True)
r.delete();board.save(out/'canon-turntable.webp',quality=85,method=6)
print('Saved actual-model turntable and poster',flush=True)
