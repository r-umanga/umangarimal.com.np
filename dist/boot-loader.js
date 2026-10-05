export function bootLoader(element,{minimum=2000}={}){
 const start=performance.now(),status=element.querySelector('[data-loader-status]');
 document.documentElement.classList.add('booting');
 const background=[...document.querySelectorAll('body > header,body > main,body > footer,body > .skip')];
 background.forEach(node=>{node.inert=true;});
 let ended=false;
 function progress(value,message='Preparing the camera') {if(ended)return;element.style.setProperty('--load-progress',Math.max(.03,Math.min(1,value)));if(status)status.textContent=message;}
 async function ready(message='Ready to explore'){
  if(ended)return;ended=true;element.style.setProperty('--load-progress',1);if(status)status.textContent=message;
  await new Promise(resolve=>setTimeout(resolve,Math.max(0,minimum-(performance.now()-start))));
  // Allow the finished camera frame to reach the compositor before lifting the curtain.
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  element.classList.add('dismissed');element.setAttribute('aria-hidden','true');document.documentElement.classList.remove('booting');background.forEach(node=>{node.inert=false;});
 }
 return {progress,ready};
}
