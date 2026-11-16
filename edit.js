/* Private edit mode for the portfolio. Loaded only at #edit.
   Saves by committing index.html (and any new cover images) to GitHub with the owner's own token,
   which is kept only in this browser. */
(function(){
var OWNER='narshishukla',REPO='narshishukla.github.io',BRANCH='main',API='https://api.github.com/repos/'+OWNER+'/'+REPO;
var KEY_T='pf_token',KEY_D='pf_draft';
var ls={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}},del:function(k){try{localStorage.removeItem(k)}catch(e){}}};
var ORIG=JSON.parse(document.getElementById('data').textContent);
var D=JSON.parse(ls.get(KEY_D)||'null')||JSON.parse(JSON.stringify(ORIG));
var dirty=!!ls.get(KEY_D);

function el(t,a,c){var e=document.createElement(t);if(a)for(var k in a){var v=a[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k==='html')e.innerHTML=v;else if(k.slice(0,2)==='on')e[k]=v;else e.setAttribute(k,v)}(c||[]).forEach(function(x){if(x!=null)e.appendChild(typeof x==='string'?document.createTextNode(x):x)});return e}

/* ---------- styles ---------- */
document.head.appendChild(el('style',{text:[
'#ed{position:fixed;inset:0;z-index:50;overflow:auto;background:#f3efe6;color:#1a1714;font:14px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;-webkit-overflow-scrolling:touch}',
'#ed *{box-sizing:border-box}',
'#ed .bar{position:sticky;top:0;z-index:3;display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 16px;background:#1a1714;color:#fff}',
'#ed .bar b{font-size:15px;margin-right:auto}',
'#ed .bar input{flex:1 1 220px;max-width:340px;min-width:0;padding:8px 10px;border:0;border-radius:6px;font:inherit}',
'#ed button{font:inherit;cursor:pointer;border:1px solid #c9bfae;background:#fff;color:#1a1714;border-radius:6px;padding:7px 11px;min-height:36px}',
'#ed button:hover{border-color:#1a1714}',
'#ed button.pri{background:#c4291c;border-color:#c4291c;color:#fff;font-weight:700}',
'#ed button.pri:disabled{opacity:.5;cursor:default}',
'#ed .bar button{border-color:#555;background:#2b2724;color:#fff}',
'#ed .bar button.pri{background:#c4291c;border-color:#c4291c}',
'#ed .msg{width:100%;font-size:13px;color:#f2d7a6;min-height:0}',
'#ed .msg:empty{display:none}',
'#ed .wrap{max-width:1180px;margin:0 auto;padding:16px 16px 80px}',
'#ed .help{font-size:13px;color:#5a5246;margin:0 0 14px}',
'#ed .cl{background:#fffdf8;border:1px solid #ddd3c2;border-radius:10px;padding:14px;margin:0 0 16px}',
'#ed .cl.drop{outline:3px dashed #c4291c;outline-offset:2px}',
'#ed .clh{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:8px;margin-bottom:10px}',
'#ed label{display:flex;flex-direction:column;gap:3px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7a6f60}',
'#ed label input,#ed label select{font:14px system-ui,sans-serif;text-transform:none;letter-spacing:0;color:#1a1714;padding:7px 9px;border:1px solid #c9bfae;border-radius:6px;background:#fff;min-width:0}',
'#ed .clt{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:10px}',
'#ed .clt .n{font-weight:800;font-size:17px;margin-right:auto}',
'#ed .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(130px,30vw,170px),1fr));gap:12px;min-height:60px}',
'#ed .grid:empty:after{content:"No reels. Drag one here or use Move.";color:#9a8f80;font-size:13px;align-self:center}',
'#ed .rc{background:#fff;border:1px solid #ddd3c2;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:6px;cursor:grab;touch-action:manipulation}',
'#ed .rc.drag{opacity:.4}',
'#ed .rc.over{box-shadow:-4px 0 0 #c4291c}',
'#ed .th{position:relative;aspect-ratio:9/16;background:#222;border-radius:5px;overflow:hidden}',
'#ed .th img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
'#ed .th .pos{position:absolute;left:5px;top:5px;background:rgba(0,0,0,.75);color:#fff;font-size:11px;font-weight:700;padding:2px 6px;border-radius:3px}',
'#ed .th .nw{position:absolute;right:5px;top:5px;background:#c4291c;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px}',
'#ed .rc input{width:100%;font:13px system-ui,sans-serif;padding:6px 7px;border:1px solid #c9bfae;border-radius:5px;min-width:0}',
'#ed .rc .vw{display:flex;gap:6px}',
'#ed .rc .vw input:first-child{flex:1}',
'#ed .rc .vw input:last-child{width:62px;flex:none}',
'#ed .tools{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}',
'#ed .tools button{padding:5px 0;min-height:32px;font-size:13px}',
'#ed .rc select{width:100%;font:12px system-ui,sans-serif;padding:5px;border:1px solid #c9bfae;border-radius:5px;background:#fff}',
'#ed label.ck{flex-direction:row;align-items:center;gap:5px;font-size:12px;font-weight:400;letter-spacing:0;text-transform:none;color:#5a5246}',
'#ed .modal{position:fixed;inset:0;z-index:60;background:rgba(10,8,6,.82);display:flex;align-items:center;justify-content:center;padding:16px}',
'#ed .mbox{background:#fffdf8;border-radius:12px;padding:14px;width:min(420px,100%);max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:10px}',
'#ed .mbox video{width:100%;max-height:60vh;background:#000;border-radius:6px;object-fit:contain}',
'#ed .mbox input[type=range]{width:100%}',
'#ed .mrow{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}',
'#ed details{margin-bottom:10px}#ed summary{cursor:pointer;font-size:13px;color:#7a6f60;margin-bottom:8px}',
'@media(max-width:600px){#ed .bar{padding:8px 10px;gap:6px}#ed .bar b{font-size:14px}#ed .bar button{padding:4px 9px;min-height:32px;font-size:13px}#ed .bar input{flex-basis:100%;max-width:none;order:9}#ed .msg{order:10}}'
].join('\n')}));

/* ---------- helpers ---------- */
var root,msgEl,saveBtn,tokIn;
function msg(t){msgEl.textContent=t||''}
function persist(){dirty=true;if(!ls.set(KEY_D,JSON.stringify(D)))msg('Draft too big to keep in this browser. Save soon.');saveBtn.disabled=false}
function clean(d){return JSON.parse(JSON.stringify(d,function(k,v){return k.charAt(0)==='_'?undefined:v}))}
function thumb(r){return r._np||r.poster||(r.yt?'https://i.ytimg.com/vi/'+r.yt+'/hqdefault.jpg':'')}
function move(arr,i,j){if(j<0||j>=arr.length)return;var x=arr.splice(i,1)[0];arr.splice(j,0,x)}

/* ---------- render ---------- */
var drag=null;
function render(){
  var y=root.scrollTop,wrap=root.querySelector('.wrap');wrap.textContent='';
  wrap.appendChild(el('p',{class:'help',text:'Drag reels to reorder or into another heading (on phones use ◀ ▶ and Move). Changes stay as a draft in this browser until you press Save & publish. Deleted reels are only removed from the page; their files stay on GitHub.'}));
  D.clients.forEach(function(c,ci){wrap.appendChild(heading(c,ci))});
  wrap.appendChild(el('button',{type:'button',text:'+ Add heading',onclick:function(){D.clients.push({n:'New heading',u:'',lang:'',meta:'',role:'',tags:D.tabs[0][0],reels:[]});persist();render()}}));
  root.scrollTop=y;
}
function heading(c,ci){
  var grid=el('div',{class:'grid'});
  c.reels.forEach(function(r,ri){grid.appendChild(reel(c,ci,r,ri))});
  var box=el('div',{class:'cl'},[
    el('div',{class:'clt'},[el('span',{class:'n',text:c.n||'(untitled)'}),
      el('button',{type:'button',title:'Move heading up',text:'↑',onclick:function(){move(D.clients,ci,ci-1);persist();render()}}),
      el('button',{type:'button',title:'Move heading down',text:'↓',onclick:function(){move(D.clients,ci,ci+1);persist();render()}}),
      el('button',{type:'button',text:'Delete heading',onclick:function(){if(c.reels.length){msg('Move or delete its reels first.');return}D.clients.splice(ci,1);persist();render()}})]),
    el('details',{},[el('summary',{text:'Heading details'}),el('div',{class:'clh'},[field('Heading',c,'n',function(){box.querySelector('.n').textContent=c.n}),field('Link',c,'u'),field('Details',c,'meta'),field('My role',c,'role'),field('Language',c,'lang'),
      el('label',{},['Tab',sel(D.tabs.map(function(t){return [t[0],t[1]]}),c.tags,function(v){c.tags=v;persist()})])])]),
    grid]);
  /* drop onto an empty part of a heading = append */
  box.ondragover=function(e){if(drag){e.preventDefault();box.classList.add('drop')}};
  box.ondragleave=function(e){if(!box.contains(e.relatedTarget))box.classList.remove('drop')};
  box.ondrop=function(e){box.classList.remove('drop');if(!drag)return;e.preventDefault();var src=D.clients[drag.ci].reels,x=src.splice(drag.ri,1)[0];c.reels.push(x);drag=null;persist();render()};
  return box;
}
function field(lab,o,k,after){var i=el('input',{type:'text',value:o[k]||''});i.oninput=function(){o[k]=i.value;persist();if(after)after()};return el('label',{},[lab,i])}
function sel(opts,val,on){var s=el('select');opts.forEach(function(o){var op=el('option',{value:o[0],text:o[1]});if(o[0]===val)op.selected=true;s.appendChild(op)});s.onchange=function(){on(s.value)};return s}
function reel(c,ci,r,ri){
  var t=el('input',{type:'text',value:r.t||'','aria-label':'Title'}),v=el('input',{type:'text',value:r.v||'',placeholder:'views','aria-label':'Views'});
  t.oninput=function(){r.t=t.value;persist()};v.oninput=function(){if(v.value)r.v=v.value;else delete r.v;persist()};
  var im=thumb(r)?el('img',{src:thumb(r),alt:'',draggable:'false'}):null;
  var ed=el('input',{type:'checkbox'});ed.checked=!!r.ed;ed.onchange=function(){if(ed.checked)r.ed=1;else delete r.ed;persist()};
  var mv=sel([['','Move to…']].concat(D.clients.map(function(x,i){return [String(i),x.n]}).filter(function(o){return o[0]!==String(ci)})),'',function(val){if(val==='')return;c.reels.splice(ri,1);D.clients[+val].reels.push(r);persist();render()});
  var k=el('div',{class:'rc',draggable:'true'},[
    el('div',{class:'th'},[im,el('span',{class:'pos',text:String(ri+1)}),r._np?el('span',{class:'nw',text:'new cover'}):null]),
    t,el('div',{class:'vw'},[el('input',{type:'text',value:r.src||(r.yt?'YouTube '+r.yt:''),disabled:'',title:'Video file'}),v]),
    el('div',{class:'tools'},[
      el('button',{type:'button',title:'Move left',text:'◀',onclick:function(){move(c.reels,ri,ri-1);persist();render()}}),
      el('button',{type:'button',title:'Move right',text:'▶',onclick:function(){move(c.reels,ri,ri+1);persist();render()}}),
      el('button',{type:'button',title:r.src?'Pick cover frame':'Cover comes from YouTube',text:'🖼',disabled:r.src?null:'',onclick:function(){coverPicker(r)}}),
      el('button',{type:'button',title:'Delete reel',text:'🗑',onclick:function(){c.reels.splice(ri,1);persist();render();msg('Reel removed. Discard draft to undo all changes.')}})]),
    mv,el('label',{class:'ck'},[ed,'“Edited by me” tag'])]);
  k.ondragstart=function(e){drag={ci:ci,ri:ri};k.classList.add('drag');try{e.dataTransfer.setData('text/plain','r');e.dataTransfer.effectAllowed='move'}catch(x){}};
  k.ondragend=function(){k.classList.remove('drag');drag=null};
  k.ondragover=function(e){if(!drag)return;e.preventDefault();e.stopPropagation();k.classList.add('over')};
  k.ondragleave=function(){k.classList.remove('over')};
  k.ondrop=function(e){k.classList.remove('over');if(!drag)return;e.preventDefault();e.stopPropagation();
    var src=D.clients[drag.ci].reels,x=src.splice(drag.ri,1)[0],to=ri;
    if(drag.ci===ci&&drag.ri<ri)to--;c.reels.splice(to,0,x);drag=null;persist();render()};
  return k;
}

/* ---------- cover picker ---------- */
function coverPicker(r){
  var vid=el('video',{src:r.src,muted:'',playsinline:'',preload:'auto'}),rng=el('input',{type:'range',min:'0',max:'100',step:'0.05',value:'0'}),
      tm=el('span',{text:'0.0s'}),ok=el('button',{type:'button',class:'pri',text:'Use this frame',disabled:''}),m;
  vid.muted=true;
  vid.onloadedmetadata=function(){rng.max=String(vid.duration||0);var s=Math.min(1.5,(vid.duration||0)/2);vid.currentTime=s;rng.value=String(s)};
  vid.onseeked=function(){ok.disabled=false;tm.textContent=vid.currentTime.toFixed(1)+'s'};
  vid.ontimeupdate=function(){tm.textContent=vid.currentTime.toFixed(1)+'s'};
  vid.onerror=function(){tm.textContent='Could not load this video here.'};
  rng.oninput=function(){ok.disabled=true;vid.currentTime=+rng.value};
  ok.onclick=function(){
    var w=vid.videoWidth,h=vid.videoHeight,sc=Math.min(1,720/Math.max(w,h)),cv=document.createElement('canvas');
    cv.width=Math.round(w*sc);cv.height=Math.round(h*sc);
    try{cv.getContext('2d').drawImage(vid,0,0,cv.width,cv.height);r._np=cv.toDataURL('image/jpeg',.82)}catch(e){tm.textContent='Could not capture this frame.';return}
    m.remove();persist();render();msg('New cover set. It uploads when you save.')};
  m=el('div',{class:'modal',onclick:function(e){if(e.target===m)m.remove()}},[el('div',{class:'mbox'},[el('b',{text:'Pick a cover: '+(r.t||'')}),vid,rng,el('div',{class:'mrow'},[tm,el('span',{style:'flex:1'}),
    r._np?el('button',{type:'button',text:'Keep old cover',onclick:function(){delete r._np;m.remove();persist();render()}}):null,
    el('button',{type:'button',text:'Cancel',onclick:function(){m.remove()}}),ok])])]);
  root.appendChild(m);
}

/* ---------- GitHub save (one commit) ---------- */
function gh(path,opt){opt=opt||{};var h={'Accept':'application/vnd.github+json','Authorization':'Bearer '+tokIn.value.trim(),'X-GitHub-Api-Version':'2022-11-28'};
  if(opt.body){h['Content-Type']='application/json';opt.body=JSON.stringify(opt.body)}opt.headers=h;opt.cache='no-store';
  return fetch(API+path,opt).then(function(res){return res.json().catch(function(){return {}}).then(function(j){if(!res.ok){var e=new Error((j&&j.message)||('GitHub error '+res.status));e.status=res.status;throw e}return j})})}
function b64utf8(s){var b=new TextEncoder().encode(s),o='';for(var i=0;i<b.length;i+=0x8000)o+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(o)}
function utf8b64(s){var bin=atob(s.replace(/\s/g,'')),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new TextDecoder().decode(u)}
function save(){
  if(!tokIn.value.trim()){msg('Paste your GitHub token first.');tokIn.focus();return}
  ls.set(KEY_T,tokIn.value.trim());saveBtn.disabled=true;msg('Saving…');
  var head,baseTree,files=[],stamp=Date.now().toString(36);
  gh('/git/ref/heads/'+BRANCH).then(function(ref){head=ref.object.sha;return gh('/git/commits/'+head)})
  .then(function(cm){baseTree=cm.tree.sha;return gh('/contents/index.html?ref='+head)})
  .then(function(f){
    var html=utf8b64(f.content),re=/(<script type="application\/json" id="data">)([\s\S]*?)(<\/script>)/;
    if(!re.test(html))throw new Error('Could not find the data block in index.html.');
    /* new covers become new files, so browsers don't show the old cached image */
    var ups=[];D.clients.forEach(function(c){c.reels.forEach(function(r){if(r._np){
      var name=(r.src||'reel').replace(/\.[^.]+$/,'')+'_'+stamp+'.jpg';ups.push({r:r,name:name,data:r._np.split(',')[1]})}})});
    var out=clean(D);var i=0;D.clients.forEach(function(c,ci){c.reels.forEach(function(r,ri){var u=ups.filter(function(x){return x.r===r})[0];if(u)out.clients[ci].reels[ri].poster=u.name})});
    var json=JSON.stringify(out).replace(/</g,'\\u003c');
    files.push({path:'index.html',content:html.replace(re,function(_,a,b,c){return a+json+c})});
    return ups.reduce(function(p,u){return p.then(function(){msg('Uploading cover '+(++i)+' of '+ups.length+'…');
      return gh('/git/blobs',{method:'POST',body:{content:u.data,encoding:'base64'}}).then(function(b){files.push({path:u.name,sha:b.sha})})})},Promise.resolve());
  })
  .then(function(){return gh('/git/blobs',{method:'POST',body:{content:b64utf8(files[0].content),encoding:'base64'}})})
  .then(function(b){var tree=files.map(function(f){return {path:f.path,mode:'100644',type:'blob',sha:f.sha||b.sha}});
    return gh('/git/trees',{method:'POST',body:{base_tree:baseTree,tree:tree}})})
  .then(function(t){return gh('/git/commits',{method:'POST',body:{message:'Edit portfolio from edit mode',tree:t.sha,parents:[head]}})})
  .then(function(cm){return gh('/git/refs/heads/'+BRANCH,{method:'PATCH',body:{sha:cm.sha}})})
  .then(function(){ls.del(KEY_D);dirty=false;
    D.clients.forEach(function(c){c.reels.forEach(function(r){delete r._np})});
    msg('Published. The live site updates in about a minute.');render()})
  .catch(function(e){saveBtn.disabled=false;
    msg(e.status===401?'GitHub did not accept the token. Check it and try again.':e.status===403||e.status===404?'This token cannot write to the repo. It needs Contents: Read and write on '+REPO+'.':e.status===409||e.status===422?'The site changed on GitHub while you were editing. Reload this page and redo the last change.':'Save failed: '+e.message)});
}

/* ---------- frame ---------- */
tokIn=el('input',{type:'password',placeholder:'GitHub token (stays in this browser)',autocomplete:'off',value:ls.get(KEY_T)||''});
saveBtn=el('button',{type:'button',class:'pri',text:'Save & publish',onclick:save});saveBtn.disabled=!dirty;
msgEl=el('div',{class:'msg',role:'status'});
root=el('div',{id:'ed'},[el('div',{class:'bar'},[el('b',{text:'Edit mode'}),tokIn,
  el('button',{type:'button',text:'Preview',onclick:function(){try{sessionStorage.setItem(KEY_D,JSON.stringify(D))}catch(e){}location.hash='#preview';location.reload()}}),
  el('button',{type:'button',text:'Discard draft',onclick:function(){D=JSON.parse(JSON.stringify(ORIG));ls.del(KEY_D);dirty=false;saveBtn.disabled=true;render();msg('Draft discarded.')}}),
  el('button',{type:'button',text:'Exit',onclick:function(){location.hash='';location.reload()}}),
  saveBtn,msgEl]),el('div',{class:'wrap'})]);
document.body.appendChild(root);document.body.style.overflow='hidden';
render();
if(dirty)msg('Unsaved draft restored from last time.');
})();
