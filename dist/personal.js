import {portfolio,projects} from './content.js?v=responsive1';
export function initPersonal(){
 const $=s=>document.querySelector(s);
 const list=$('.project-list');list.replaceChildren();
 for(const [projectIndex,project] of projects.entries()){
  if(!project.description&&!project.url)continue;
  const entry=document.createElement('details');entry.className='project reveal';
  const summary=document.createElement('summary'),heading=document.createElement('div'),label=document.createElement('span'),title=document.createElement('h3'),action=document.createElement('span');label.className='meta';label.textContent=project.label;title.textContent=project.title;action.className='project-action';action.textContent='Explore +';const number=document.createElement('span');number.className='project-number';number.textContent=String(projectIndex+1).padStart(2,'0');const intro=document.createElement('p');intro.className='project-intro';intro.textContent=project.description;heading.append(label,title,intro);summary.append(number,heading,action);
  const detail=document.createElement('div');detail.className='personal-project-detail';const text=document.createElement('p');text.textContent=project.description;
  const facts=document.createElement('dl');for(const [key,value]of [['What I built',project.built],['Tools',project.tools.join(' · ')]]){if(!value)continue;const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;row.append(dt,dd);facts.append(row);}if(facts.children.length)detail.append(facts);
  if(project.url){const link=document.createElement('a');link.href=project.url;link.className='text-link';link.textContent=project.linkLabel;if(!project.url.startsWith('#')){link.target='_blank';link.rel='noopener noreferrer';}detail.append(link);}entry.append(summary,detail);list.append(entry);
 }
 const portrait=$('.portrait-column'),slot=$('#portrait-slot');
 if(portfolio.portrait){
  let img=slot.querySelector('img');
  if(!img){img=new Image();img.loading='lazy';img.decoding='async';img.src=portfolio.portrait;img.alt=portfolio.portraitAlt;slot.append(img);}
  img.addEventListener('load',()=>{portrait.hidden=false;$('.about-layout').classList.remove('without-portrait');});
  img.addEventListener('error',()=>{portrait.hidden=true;$('.about-layout').classList.add('without-portrait');});
  if(img.complete&&img.naturalWidth){portrait.hidden=false;$('.about-layout').classList.remove('without-portrait');}
 }else{portrait.hidden=true;$('.about-layout').classList.add('without-portrait');}
 const reel=portfolio.videos[0],videoSection=$('#motion');
 if(!reel){videoSection.hidden=true;}else{
  $('#reel-title').textContent=reel.title;$('#reel-description').textContent=reel.description;$('#reel-duration').textContent=reel.duration;$('#reel-poster').src=reel.poster;$('#reel-poster').alt=`${reel.title}: reel and editing timeline`;
  const modal=$('#video-modal'),video=modal.querySelector('video'),trigger=$('#play-reel');let lastFocus;
  trigger.setAttribute('aria-label',`Play ${reel.title}`);$('#video-title').textContent=reel.title;
  trigger.addEventListener('click',()=>{lastFocus=document.activeElement;video.src=reel.src;modal.showModal();document.body.classList.add('modal-open');modal.querySelector('button').focus();video.play().catch(()=>{});});
  modal.querySelector('button').addEventListener('click',()=>modal.close());
  modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();modal.close();}});
  modal.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();document.body.classList.remove('modal-open');lastFocus?.focus();});
  modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
 }
 const contact=portfolio.contact,email=$('#contact-email');if(contact.email){email.hidden=false;email.href=`mailto:${contact.email}`;email.textContent=contact.email;}
 initSocialLinks(contact);
 const form=$('#message-form'),result=$('#message-result'),copy=$('#message-copy'),text=$('#message-text'),status=$('#message-status'),send=$('#message-send');
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);text.value=`Hi Umanga,\n\n${String(data.get('message')).trim()}\n\n${String(data.get('name')).trim()}\n${String(data.get('email')).trim()}`;result.hidden=false;
  send.href=contact.email?`mailto:${contact.email}?subject=${encodeURIComponent('Hello from '+String(data.get('name')).trim())}&body=${encodeURIComponent(text.value)}`:contact.instagram;
  send.textContent=contact.email?'Open email app':'Open Instagram';$('#message-instructions').textContent=contact.email?'Open your email app to review and send this message.':'Copy this message, then paste it into a message to @r.umanga_ on Instagram.';status.textContent='Your message is ready. It has not been sent.';text.focus();});
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text.value);status.textContent='Message copied.';}catch{text.focus();text.select();status.textContent='Select and copy your message.';}});
 $('#message-edit').addEventListener('click',()=>{result.hidden=true;form.elements.namedItem('message').focus();});
 form.querySelector('button[type=submit]').disabled=false;
}

function initSocialLinks(contact){
 const paths={email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/>',linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m4 0v-7m0 3c0-4 6-4 6 0v4"/><circle cx="7" cy="7" r=".7" fill="currentColor"/>',github:'<path d="M9 19c-4 1-4-2-5-2m10 5v-4c0-1-.3-1.7-1-2 3-.3 6-1.4 6-6 0-1.3-.5-2.3-1.2-3.2.1-.3.5-1.6-.1-3.2 0 0-1-.3-3.3 1.2a11 11 0 0 0-6 0C6.1 3.3 5.1 3.6 5.1 3.6c-.6 1.6-.2 2.9-.1 3.2C4.3 7.7 3.8 8.7 3.8 10c0 4.6 3 5.7 6 6-.7.3-1 1-1 2v4"/>'};
 const nav=document.createElement('nav');nav.className='social-links';nav.setAttribute('aria-label','Social profiles and email');
 for(const [key,label]of [['email','Email'],['instagram','Instagram'],['linkedin','LinkedIn'],['github','GitHub']]){if(!contact[key])continue;const a=document.createElement('a');a.href=key==='email'?'mailto:'+contact[key]:contact[key];a.setAttribute('aria-label',key==='email'?'Email Umanga':`Umanga on ${label}`);if(key!=='email'){a.target='_blank';a.rel='noopener noreferrer';}a.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key]}</svg><span>${label}</span>`;nav.append(a);}
 document.querySelector('.contact-links').append(nav);
}
