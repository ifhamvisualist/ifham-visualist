const KEY='ifhamPortfolio_local_v9';
const MEDIA_DB='ifhamVisualistMedia';
const D={site:{name:'IFHAM KHAN',title:'THE VISUALIST',kicker:'A MULTIDISCIPLINARY VISUAL PRACTICE',description:'A visual practice built around image, movement and detail.',location:'KUPWARA, KASHMIR',experience:'3+ YEARS'},hero:[],folders:[{id:'filmmaking',name:'FILMMAKING',desc:'Stories built around movement, atmosphere and real moments.',items:[],cls:'s-filmmaking'},{id:'editing',name:'EDITING',desc:'Cuts, pacing and visual rhythm shaped frame by frame.',items:[],cls:'s-editing'},{id:'graphic',name:'GRAPHIC DESIGN',desc:'Posters, compositions, campaigns and visual systems.',items:[],cls:'s-graphic'},{id:'color',name:'COLOR GRADING',desc:'Tone, contrast, palette and cinematic finishing.',items:[],cls:'s-color'},{id:'photography',name:'PHOTOGRAPHY',desc:'Still frames, portraits, landscapes and visual studies.',items:[],cls:'s-photography'},{id:'art3d',name:'3D ART',desc:'CG environments, objects, renders and experiments.',items:[],cls:'s-art3d'},{id:'logo',name:'LOGO DESIGN',desc:'Identity marks and graphic symbols made to last.',items:[],cls:'s-logo'},{id:'motion',name:'MOTION / VISUALS',desc:'Animated graphics, transitions and visual effects.',items:[],cls:'s-motion'}],about:'I am Ifham Khan — a visual creator working across filmmaking, editing, graphic design, color, photography and 3D. This space is a curated look at the work, experiments and visual language behind the projects.',contacts:{email:'ifhamkhan129@gmail.com',phone:'+91 96826 00148',instagram:'@ifham0_ · @ifhamoffilms · @ifhamgfx',youtube:'@ifhamgfx',linkedin:'linkedin.com/in/ifham-khan-52789430b'}};
D.hero=[['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80','FRAME 01'],['https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80','FRAME 02'],['https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80','FRAME 03'],['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80','FRAME 04'],['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80','FRAME 05'],['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80','FRAME 06'],['https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80','FRAME 07'],['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80','FRAME 08'],['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80','FRAME 09'],['https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80','FRAME 10'],['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80','FRAME 11'],['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80','FRAME 12'],['https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80','FRAME 13'],['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80','FRAME 14']];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function clone(x){return JSON.parse(JSON.stringify(x))}
let data;try{data=JSON.parse(localStorage.getItem(KEY))||clone(D)}catch(e){data=clone(D)}
if(!data.folders?.length)data.folders=clone(D.folders);
function save(){localStorage.setItem(KEY,JSON.stringify(data))}

// GitHub Pages bridge: when the portfolio is hosted publicly, automatically
// discover media uploaded into /media/<folder> in this repository. This keeps
// the website in sync with files added through GitHub without requiring the
// local browser editor's IndexedDB.
const GH_OWNER='ifhamvisualist';
const GH_REPO='ifham-visualist';
const MEDIA_EXT=/\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$/i;
async function loadGitHubMedia(){
  if(!location.hostname.includes('github.io')) return;
  await Promise.all((data.folders||[]).map(async f=>{
    try{
      const r=await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/media/${encodeURIComponent(f.id)}`);
      if(!r.ok)return;
      const list=await r.json();
      if(!Array.isArray(list))return;
      const remote=list.filter(x=>x.type==='file' && MEDIA_EXT.test(x.name) && x.download_url);
      if(!remote.length)return;
      const existing=new Map((f.items||[]).map(x=>[String(x.src||'').toLowerCase(),x]));
      f.items=remote.map((x,i)=>{
        const prev=existing.get(String(x.download_url).toLowerCase());
        const video=/\.(mp4|webm|mov|m4v)$/i.test(x.name);
        return prev || {src:x.download_url,type:video?'video':'image',title:x.name.replace(/\.[^.]+$/,''),desc:'',id:`gh-${f.id}-${i}`};
      });
    }catch(e){ console.warn('GitHub media discovery failed for',f.id,e); }
  }));
}

const dbp=new Promise((resolve,reject)=>{const r=indexedDB.open(MEDIA_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
async function fileURL(key){if(!key||!String(key).startsWith('idb:'))return key;const db=await dbp;return new Promise((res,rej)=>{const q=db.transaction('files').objectStore('files').get(key.slice(4));q.onsuccess=()=>res(q.result?URL.createObjectURL(q.result):'');q.onerror=()=>rej(q.error)})}
async function resolveMedia(){for(const f of data.folders||[])for(const x of f.items||[])if(x.src?.startsWith('idb:'))x._src=await fileURL(x.src);for(const p of data.hero||[])if(p[0]?.startsWith('idb:'))p[2]=await fileURL(p[0])}
async function render(){await resolveMedia();const frames=data.hero.map((p,i)=>`<figure class="frame f${i+1}"><img src="${esc(p[2]||p[0])}" alt=""></figure>`).join('');const folders=data.folders.map((f,i)=>`<button class="folder" data-open-folder="${esc(f.id)}"><div class="folder-art ${esc(f.cls)}"><span class="orb"></span><span class="ring"></span><span class="bar b1"></span><span class="bar b2"></span><span class="cube3d"></span></div><span class="num">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(f.name)}</h3><small>${esc(f.desc)}</small></div><span class="folder-open">OPEN FOLDER ↗</span></button>`).join('');const skills=data.folders.map((f,i)=>{const ms=(f.items||[]).slice(0,3).map((x,j)=>`<div class="media m${j+1}">${x.type==='video'?`<video src="${esc(x._src||x.src)}" controls muted playsinline></video>`:`<img src="${esc(x._src||x.src)}" loading="lazy" alt="${esc(x.title)}">`}</div>`).join('');let obj=f.id==='editing'?'<div class="theme-object timeline"><div class="ruler"></div><div class="tracks"><i class="clip"></i><i class="clip"></i><i class="clip"></i></div><b class="playhead"></b></div>':f.id==='color'?'<div class="theme-object colorwheel"></div><div class="theme-object gradebars"><i></i><i></i><i></i><i></i></div>':f.id==='graphic'?'<div class="theme-object graphic-shape"></div><div class="theme-object type3d">Aa</div>':f.id==='photography'?'<div class="theme-object lens"></div>':f.id==='art3d'?'<div class="theme-object mesh"></div><div class="theme-object node"></div>':f.id==='logo'?'<div class="theme-object logo-grid"></div><div class="theme-object logo-mark">K</div>':f.id==='motion'?'<div class="theme-object motion-lines"><i></i><i></i><i></i><i></i></div>':'<div class="theme-object camera"></div>';return `<section class="slide skill ${esc(f.cls)}" id="${esc(f.id)}"><div class="scene"><div class="grid3d"></div>${obj}</div><div class="skill-content"><div class="skill-copy"><div class="idx">DISCIPLINE / ${String(i+1).padStart(2,'0')}</div><h2>${esc(f.name)}</h2><p>${esc(f.desc)}</p><div class="skill-count">${(f.items||[]).length} MEDIA ITEMS</div><button class="open-folder-btn" data-open-folder="${esc(f.id)}">OPEN FOLDER — VIEW ALL WORK ↗</button></div><div class="media-stack">${ms||'<div class="media-empty">YOUR WORK APPEARS HERE</div>'}</div></div></section>`});document.getElementById('app').innerHTML=`<section class="slide hero" id="home"><div class="cube" id="cube"><div class="gridwall back"></div><div class="gridwall floor"></div><div class="gridwall ceiling"></div><div class="gridwall left"></div><div class="gridwall right"></div>${frames}</div><div class="center-brand"><div class="small">${esc(data.site.kicker)}</div><h1>${esc(data.site.name)}</h1><h2>${esc(data.site.title)}</h2></div><button class="menu" onclick="document.getElementById('work').scrollIntoView()">MENU</button><div class="scrollhint">EXPLORE THE SPACE ↓</div></section><section class="slide work" id="work"><div class="workhead"><div><div class="eyebrow">THE ARCHIVE</div><h2>WORK</h2></div><p>One discipline, one space. Explore the portfolio through separate visual environments instead of one crowded collection.</p></div><div class="folder-grid">${folders}</div></section>${skills.join('')}<section class="slide about" id="about"><div class="about-grid"><div><div class="eyebrow">ABOUT</div><h2>IMAGE.<br>MOTION.<br>DETAIL.</h2></div><div><p>${esc(data.about)}</p><div class="software-block"><div class="eyebrow">SOFTWARE I USE</div><div class="software-grid"><div class="software-card premiere"><span class="software-mark">Pr</span><span>Adobe Premiere Pro</span></div><div class="software-card after"><span class="software-mark">Ae</span><span>Adobe After Effects</span></div><div class="software-card resolve"><span class="software-mark">DR</span><span>DaVinci Resolve</span></div><div class="software-card photoshop"><span class="software-mark">Ps</span><span>Adobe Photoshop</span></div><div class="software-card illustrator"><span class="software-mark">Ai</span><span>Adobe Illustrator</span></div><div class="software-card lightroom"><span class="software-mark">Lr</span><span>Lightroom Classic</span></div><div class="software-card blender"><span class="software-mark">Bl</span><span>Blender</span></div></div></div></div></div></section><section class="slide contact" id="contact"><div class="contact-grid"><div><div class="eyebrow">CONTACT</div><h2>LET'S<br>MAKE.</h2></div><div class="contact-list"><a href="mailto:${esc(data.contacts.email)}">${esc(data.contacts.email)}</a><a href="tel:${esc(data.contacts.phone.replace(/\s/g,''))}">${esc(data.contacts.phone)}</a><a href="#">INSTAGRAM — ${esc(data.contacts.instagram)}</a><a href="#">YOUTUBE — ${esc(data.contacts.youtube)}</a><a href="#">LINKEDIN — ${esc(data.contacts.linkedin)}</a></div></div></section>`;const cube=document.getElementById('cube');let rx=0,ry=0,down=false,x=0,y=0;document.querySelector('.hero').onpointerdown=e=>{down=true;x=e.clientX;y=e.clientY};window.onpointerup=()=>down=false;window.onpointermove=e=>{if(!down)return;ry+=(e.clientX-x)*.08;rx-=(e.clientY-y)*.045;x=e.clientX;y=e.clientY;cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`};window.onkeydown=e=>{if(e.key==='ArrowLeft')ry-=6;if(e.key==='ArrowRight')ry+=6;if(e.key==='ArrowUp')rx-=3;if(e.key==='ArrowDown')rx+=3;cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`}}

function openFolder(id){
  const f=data.folders.find(x=>x.id===id);
  if(!f)return;
  const existing=document.getElementById('folderViewer');
  if(existing)existing.remove();
  const items=f.items||[];
  const media=items.map((x,i)=>`<article class="viewer-item">
    <div class="viewer-media">${x.type==='video'
      ? `<video src="${esc(x._src||x.src)}" controls playsinline preload="metadata"></video>`
      : `<img src="${esc(x._src||x.src)}" alt="${esc(x.title||'Work')}">`}</div>
    <div class="viewer-meta"><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(x.title||'Untitled')}</h3><p>${esc(x.desc||'')}</p></div>
  </article>`).join('');
  const el=document.createElement('div');
  el.id='folderViewer';
  el.className='folder-viewer';
  el.innerHTML=`<div class="viewer-top"><div><div class="eyebrow">FOLDER / ${String(data.folders.indexOf(f)+1).padStart(2,'0')}</div><h2>${esc(f.name)}</h2><p>${esc(f.desc||'')}</p></div><button class="viewer-close" aria-label="Close">CLOSE ×</button></div>
  <div class="viewer-count">${items.length} MEDIA ITEMS</div>
  <div class="viewer-grid">${media||'<div class="viewer-empty">No work has been added to this folder yet.</div>'}</div>`;
  document.body.appendChild(el);
  document.body.classList.add('viewer-open');
  el.querySelector('.viewer-close').onclick=closeFolder;
}
function closeFolder(){
  const el=document.getElementById('folderViewer');
  if(el)el.remove();
  document.body.classList.remove('viewer-open');
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-open-folder]');
  if(b){e.preventDefault();openFolder(b.dataset.openFolder);}
  if(e.target.closest('.viewer-close'))closeFolder();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFolder();});

loadGitHubMedia().finally(render);
