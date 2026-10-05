// Shared mount and exchange choreography for the GLB and no-WebGL renderers.
export const MOUNT=[.21647144204773613,-.2832137452111298,.339046318557405];
// The telephoto bayonet seats inside the body; its full-width collar starts 0.24 units forward.
export const LENS_SEAT_OFFSETS=[0,-.24];
export const clamp=t=>Math.max(0,Math.min(1,t));
export const smooth=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)};
export const EXCHANGE_MS=1850;
export function exchangePhases(t){return {unlock:smooth(t/.18),withdraw:smooth((t-.08)/.25),depart:smooth((t-.28)/.46),arrive:smooth((t-.26)/.49),seat:smooth((t-.74)/.26)};}
export function createCameraRig({THREE,scene,model,parts,reducedMotion=()=>false}){
 const body=parts?.body; if(body){body.position.set(0,0,0);model.add(body);}model.userData.atlas='camera-body';
 const groups=['lens-kit','lens-tele'].map((name,i)=>{const group=new THREE.Group();group.userData.atlas=name;const part=i?parts?.tele:parts?.kit;if(part){part.position.set(0,0,0);group.add(part);}scene.add(group);return group;});
 const mount=new THREE.Vector3(...MOUNT),localForward=new THREE.Vector3(0,0,1),rollAxis=new THREE.Vector3(0,0,1);
 let selected=0,transition=null,lastTime=0,reveal=0,viewWidth=1;
 function place(group,pos,quat,scale,twist=0){group.position.copy(pos);group.quaternion.copy(quat).multiply(new THREE.Quaternion().setFromAxisAngle(rollAxis,twist));group.scale.setScalar(Math.max(0.00001,scale));group.visible=scale>.0001;}
 function update(time,kitReveal,worldWidth){
  lastTime=time;reveal=kitReveal;viewWidth=worldWidth;model.updateMatrixWorld(true);
  const q=model.quaternion.clone(),scale=model.scale.x;
  const seats=LENS_SEAT_OFFSETS.map(offset=>mount.clone().add(new THREE.Vector3(0,0,offset)));
  const attached=seats.map(seat=>seat.clone().applyMatrix4(model.matrixWorld));
  groups.forEach(group=>{group.userData.attachedTo=null;});
  const direction=localForward.clone().applyQuaternion(q);
  const parked=new THREE.Vector3(worldWidth*.30,model.position.y+.02,0);
  const parkQ=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.13,-.62+(reducedMotion()?0:Math.sin(time*.0007)*.09),.04));
  const parkedScale=scale*.72*reveal;
  if(!reducedMotion())parked.y+=Math.sin(time*.00135+1)*.035;
  if(!transition){place(groups[selected],attached[selected],q,scale);groups[selected].userData.attachedTo=model;groups[selected].userData.seat=seats[selected];place(groups[1-selected],parked,parkQ,parkedScale);return;}
  const t=reducedMotion()?1:clamp((time-transition.start)/EXCHANGE_MS),p=exchangePhases(t),old=groups[selected],next=groups[1-selected];
  const pulledOut=attached[selected].clone().addScaledVector(direction,scale*.85);
  const pulledIn=attached[1-selected].clone().addScaledVector(direction,scale*.85);
  const outgoing=attached[selected].clone().lerp(pulledOut,p.withdraw).lerp(parked,p.depart);
  outgoing.y-=Math.sin(Math.PI*p.depart)*scale*.35;
  const incoming=parked.clone().lerp(pulledIn,p.arrive).lerp(attached[1-selected],p.seat);
  incoming.y+=Math.sin(Math.PI*p.arrive)*scale*.42;
  place(old,outgoing,q.clone().slerp(parkQ,p.depart),scale+(parkedScale-scale)*p.depart,-.28*p.unlock*(1-p.depart));
  place(next,incoming,parkQ.clone().slerp(q,p.arrive),parkedScale+(scale-parkedScale)*p.arrive,.28*(1-p.seat)*p.arrive);
  if(t===1){selected=1-selected;groups[selected].userData.attachedTo=model;groups[selected].userData.seat=seats[selected];const done=transition.resolve;transition=null;done();}
 }
 function select(set){const target=set.id==='tele-55-250'?1:0;if(reducedMotion()&&!transition){selected=target;update(lastTime,reveal,viewWidth);return Promise.resolve();}if(target===selected&&!transition)return Promise.resolve();if(transition)return transition.promise;let resolve;const promise=new Promise(r=>resolve=r);transition={start:performance.now(),resolve,promise};return promise;}
 return {update,select,get selected(){return selected},get busy(){return !!transition}};
}
