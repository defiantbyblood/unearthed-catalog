/* Every destination keeps the seasonal wayfinder above its content. */
const catalogSection=document.getElementById('catalog'),economySection=document.getElementById('economy'),charactersSection=document.getElementById('characters'),boardSection=document.getElementById('board'),profileSection=document.getElementById('character-profile');
function routeSection(){if(location.hash.startsWith('#character=')){location.replace(new URL('character.html'+location.hash,location.href).href);return}if(location.hash==='#registry'){location.replace('#sheets');return}const hash=location.hash,isProfile=hash.startsWith('#character=');profileSection.hidden=!isProfile;catalogSection.hidden=hash!=='#catalog';economySection.hidden=hash!=='#economy';boardSection.hidden=hash!=='#board';charactersSection.hidden=!['#sheets','#registry'].includes(hash);document.querySelector('.world-hero').hidden=false;document.querySelector('.world-footer').hidden=false;const section=isProfile?profileSection:hash==='#catalog'?catalogSection:hash==='#economy'?economySection:hash==='#board'?boardSection:['#sheets','#registry'].includes(hash)?charactersSection:null;if(section)requestAnimationFrame(()=>section.scrollIntoView({behavior:'instant'}));for(const link of document.querySelectorAll('.topbar nav a'))link.classList.toggle('current',link.getAttribute('href')===(isProfile?'#sheets':section?hash:'#home'));}
window.addEventListener('hashchange',routeSection);routeSection();
/* Wrapped navigation can change height with screen width or browser zoom. */
const siteHeader=document.querySelector('.topbar');
function measureHeader(){document.documentElement.style.setProperty('--header-height',Math.ceil(siteHeader.getBoundingClientRect().height)+'px');}
measureHeader();
if(typeof ResizeObserver==='function')new ResizeObserver(measureHeader).observe(siteHeader);
else window.addEventListener('resize',measureHeader);
