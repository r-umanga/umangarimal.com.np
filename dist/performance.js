// Shared visibility and motion scheduling. Device-specific rendering modes are not used.
export const deviceProfile={lite:false,modest:false,fps:60,maxPixels:1100000,maxRatio:1.3};
export function cameraInView(pose,stageTop,stageHeight,viewport){
 const center=stageTop+pose.y*stageHeight;
 const radius=stageHeight*.31;
 return pose.active&&!pose.covered&&stageTop<viewport&&stageTop+stageHeight>0&&center+radius>0&&center-radius<viewport;
}
export function initVisibleMotion(){
 const sections=[...document.querySelectorAll('.hero,.camera-kit,.interlude')];
 if('IntersectionObserver' in globalThis){const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-in-view',e.isIntersecting)),{threshold:0});sections.forEach(section=>observer.observe(section));}else sections.forEach(section=>section.classList.add('motion-in-view'));
 const sync=()=>document.documentElement.classList.toggle('page-sleeping',document.hidden);document.addEventListener('visibilitychange',sync);sync();
}
