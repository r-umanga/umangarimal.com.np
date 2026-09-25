import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const args=process.argv.slice(2);
const option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const root=path.resolve('dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.ttf':'font/ttf','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://terminal.local');
  if(url.pathname==='/__qa/mobile'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><html><body style="margin:0;background:#404040;display:flex;justify-content:center"><iframe title="Mobile portfolio" src="/" style="border:0;width:390px;height:844px;background:#111"></iframe></body></html>');return;}
  if(url.pathname==='/__qa/model'){res.writeHead(200,{'Content-Type':'text/html'});res.end(`<!doctype html><html><body><pre id="result">Loading final camera…</pre><script type="module">import { GLTFLoader } from '/assets/GLTFLoader.js';new GLTFLoader().loadAsync('/assets/canon-850d.glb').then(({scene})=>{let meshes=0,triangles=0,textures=0;scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;textures+=[o.material.map,o.material.normalMap,o.material.roughnessMap].filter(Boolean).length;}});document.querySelector('#result').textContent=JSON.stringify({loaded:true,meshes,triangles,textures});}).catch(e=>document.querySelector('#result').textContent=e.message);</script></body></html>`);return;}
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(!(await stat(file)).isFile())throw new Error('Not found');
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(await readFile(file));
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(Number(option('--port','4173')),option('--host','0.0.0.0'));
