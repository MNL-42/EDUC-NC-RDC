/* EDUC National — modules complémentaires dans leurs onglets dédiés.
   Suivi d’apprentissage dans Quiz et Cours ; bibliothèque dans Cours ; sauvegarde dans Profil. */
(function () {
  'use strict';
  var PROVINCES = ['Kinshasa','Kongo-Central','Kwango','Kwilu','Mai-Ndombe','Kasaï','Kasaï-Central','Kasaï-Oriental','Lomami','Sankuru','Maniema','Sud-Kivu','Nord-Kivu','Ituri','Tshopo','Bas-Uele','Haut-Uele','Nord-Ubangi','Sud-Ubangi','Mongala','Équateur','Tshuapa','Haut-Lomami','Lualaba','Haut-Katanga','Tanganyika'];
  var css = document.createElement('style');
  css.textContent = '.educ-extra{margin:18px 20px;padding:16px;border:1px solid var(--border-color,#e2e8f0);border-radius:18px;background:rgba(255,255,255,.92);box-shadow:0 6px 20px rgba(0,0,0,.04)}.educ-extra h3{font-size:1rem;font-weight:800;margin:0 0 6px}.educ-extra p{font-size:.8rem;color:var(--text-muted,#64748b);line-height:1.5}.educ-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.educ-photo{min-width:0;border:1px solid var(--border-color,#e2e8f0);border-radius:12px;overflow:hidden;background:#f8fafc}.educ-photo img{width:100%;height:118px;object-fit:cover;display:block}.educ-photo a{display:block;padding:7px 8px;color:var(--primary-blue,#0066cc);font-size:.72rem;font-weight:700;text-decoration:none}.educ-photo small{display:block;padding:0 8px 8px;color:var(--text-muted,#64748b);font-size:.65rem}.educ-extra-btn{border:0;border-radius:12px;padding:10px 13px;background:var(--primary-blue,#0066cc);color:#fff;font-weight:700;margin-top:10px}.educ-stat-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #edf1f5;font-size:.82rem}.educ-stat-row:last-child{border:0}.educ-library-list{display:grid;gap:8px;margin-top:10px}.educ-library-list a{display:block;padding:10px 12px;border:1px solid #e2e8f0;border-radius:11px;color:var(--primary-blue,#0066cc);font-size:.82rem;font-weight:700;text-decoration:none}';
  document.head.appendChild(css);
  function el(tag, cls, text) { var n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n; }
  function addLibrary() {
    var tab=document.getElementById('tab-cours');if(!tab||document.getElementById('educ-library'))return;
    var links=Array.prototype.slice.call(tab.querySelectorAll('a[href$=".pdf"]'));
    if(!links.length)return;
    var card=el('section','educ-extra');card.id='educ-library';card.appendChild(el('h3','','Bibliothèque pédagogique'));card.appendChild(el('p','','Accès rapide aux documents PDF déjà présents dans la plateforme.'));
    var list=el('div','educ-library-list');
    links.forEach(function(a){var href=a.getAttribute('href');if(!href||href.indexOf('://')===0)return;var b=el('a','',((a.innerText||a.textContent||'Document').replace(/\s+/g,' ').trim())+' ↗');b.href=href;b.target='_blank';b.rel='noopener';list.appendChild(b);});
    card.appendChild(list);tab.appendChild(card);
  }
  function addBackupControls() {
    var tab=document.getElementById('tab-profil');if(!tab||document.getElementById('educ-backup-tools'))return;
    var card=el('section','educ-extra');card.id='educ-backup-tools';card.appendChild(el('h3','','Sauvegarde de mes données'));
    card.appendChild(el('p','','Exportez vos informations et votre progression pour les conserver. Le fichier peut contenir vos données de profil : gardez-le dans un endroit privé.'));
    var row=el('div','');row.style.cssText='display:flex;gap:8px;flex-wrap:wrap';
    var out=el('button','educ-extra-btn','Exporter ma sauvegarde');out.type='button';
    out.addEventListener('click',function(){
      var data={format:'EDUC-NATIONAL-BACKUP',version:1,createdAt:new Date().toISOString(),items:{}};
      try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(/^(educ_|facile_|difficile_|pro_)/.test(k))){data.items[k]=localStorage.getItem(k);}}}catch(e){alert('Impossible de lire les données locales.');return;}
      var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='EDUC-National-sauvegarde-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1500);
    });
    var input=document.createElement('input');input.type='file';input.accept='application/json,.json';input.hidden=true;
    var imp=el('button','educ-extra-btn','Restaurer une sauvegarde');imp.type='button';imp.style.background='#475569';imp.addEventListener('click',function(){input.click();});
    input.addEventListener('change',function(){var file=input.files&&input.files[0];if(!file)return;if(file.size>2*1024*1024){alert('Fichier trop volumineux (maximum 2 Mo).');input.value='';return;}
      var reader=new FileReader();reader.onload=function(){try{var d=JSON.parse(reader.result);if(d.format!=='EDUC-NATIONAL-BACKUP'||!d.items||typeof d.items!=='object')throw new Error('Format invalide');
        if(!confirm('Restaurer cette sauvegarde ? Les données EDUC locales portant les mêmes clés seront remplacées.'))return;
        Object.keys(d.items).forEach(function(k){if(/^(educ_|facile_|difficile_|pro_)/.test(k)&&typeof d.items[k]==='string')localStorage.setItem(k,d.items[k]);});
        alert('Sauvegarde restaurée. L’application va redémarrer.');location.reload();
      }catch(e){alert('Sauvegarde invalide ou illisible.');}finally{input.value='';}};reader.readAsText(file);});
    row.appendChild(out);row.appendChild(imp);card.appendChild(row);card.appendChild(input);tab.appendChild(card);
  }
  function addLearningChart() {
    var tabs=['tab-quiz','tab-cours'];
    var css='.educ-learning-panel{margin:16px 20px;padding:17px;border:1px solid rgba(255,255,255,.75);border-radius:22px;background:linear-gradient(145deg,rgba(238,248,255,.96),rgba(255,255,255,.94));box-shadow:0 10px 28px rgba(0,70,150,.12);color:#17324d}.educ-learning-panel h3{margin:0 0 4px;font-size:1.02rem;font-weight:900}.educ-learning-panel>p{margin:0 0 12px;font-size:.76rem;color:#60758a}.educ-graph-wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(110px,.8fr);gap:8px;align-items:center}.educ-radar{width:100%;max-width:240px;display:block;margin:auto;overflow:visible}.educ-graph-legend{display:grid;gap:10px}.educ-graph-item{display:grid;grid-template-columns:9px 1fr auto;gap:6px;align-items:center;font-size:.72rem}.educ-graph-dot{width:9px;height:9px;border-radius:50%;background:#0b83e6}.educ-graph-item strong{font-size:.76rem}.educ-graph-item small{display:block;color:#718399;font-size:.65rem}.educ-learning-total{display:flex;align-items:baseline;gap:7px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(20,90,150,.12)}.educ-learning-total strong{font-size:1.55rem;line-height:1;color:#0066cc}.educ-learning-total span{font-size:.74rem;color:#60758a}.educ-learning-empty{padding:9px;border-radius:12px;background:#edf5fc;color:#60758a;font-size:.74rem}';
    if(!document.getElementById('educ-learning-chart-style')){var st=document.createElement('style');st.id='educ-learning-chart-style';st.textContent=css;document.head.appendChild(st);}
    function svgNode(tag,attrs){var n=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,attrs[k]);});return n;}
    function renderOne(tabId){
      var tab=document.getElementById(tabId);if(!tab)return;
      var panel=document.getElementById('educ-learning-'+tabId);
      if(!panel){panel=el('section','educ-learning-panel');panel.id='educ-learning-'+tabId;panel.innerHTML='<h3>Mon suivi d’apprentissage</h3><p>Mon parcours en un coup d’œil : questions traitées et niveaux atteints.</p><div class="educ-graph-wrap"><svg class="educ-radar" viewBox="0 0 240 220" role="img" aria-label="Graphique de progression des trois niveaux"></svg><div class="educ-graph-legend"></div></div><div class="educ-learning-total"><strong class="educ-learning-done">0</strong><span class="educ-learning-total-label">questions traitées</span></div>';
        var heading=tab.querySelector('.section-title')||tab.querySelector('h3');if(heading&&heading.parentNode)heading.parentNode.insertBefore(panel,heading.nextSibling);else tab.insertBefore(panel,tab.firstChild);
      }
      var data=typeof window.educProgression==='function'?window.educProgression():null;if(!data||!data.par)return;
      var keys=['facile','difficile','pro'],labels={facile:'Facile',difficile:'Difficile',pro:'Pro'},colors={facile:'#087fe5',difficile:'#12a889',pro:'#f0ad16'};
      var vals=keys.map(function(k){var d=data.par[k]||{done:0,total:0};return {done:Number(d.done)||0,total:Number(d.total)||0,pct:d.total?Math.min(100,Math.round(d.done/d.total*100)):0};});
      panel.querySelector('.educ-learning-done').textContent=data.done||0;panel.querySelector('.educ-learning-total-label').textContent='questions traitées sur '+(data.total||0);
      var svg=panel.querySelector('.educ-radar');svg.innerHTML='';
      var cx=120,cy=103,R=75,angles=[-90,30,150];
      [25,50,75,100].forEach(function(v){var pts=angles.map(function(a){var rad=a*Math.PI/180;return (cx+R*v/100*Math.cos(rad))+','+(cy+R*v/100*Math.sin(rad));}).join(' ');svg.appendChild(svgNode('polygon',{points:pts,fill:'none',stroke:'#c8d9e8','stroke-width':'1'}));});
      angles.forEach(function(a,i){var rad=a*Math.PI/180,x=cx+R*Math.cos(rad),y=cy+R*Math.sin(rad);svg.appendChild(svgNode('line',{x1:cx,y1:cy,x2:x,y2:y,stroke:'#c8d9e8','stroke-width':'1'}));var lx=cx+(R+18)*Math.cos(rad),ly=cy+(R+18)*Math.sin(rad);var tx=svgNode('text',{x:lx,y:ly+4,'text-anchor':'middle','font-size':'10','font-weight':'700',fill:'#526b83'});tx.textContent=labels[keys[i]];svg.appendChild(tx);});
      var points=vals.map(function(v,i){var rad=angles[i]*Math.PI/180,rr=R*v.pct/100;return (cx+rr*Math.cos(rad))+','+(cy+rr*Math.sin(rad));}).join(' ');
      svg.appendChild(svgNode('polygon',{points:points,fill:'rgba(0,126,220,.22)',stroke:'#087fe5','stroke-width':'3','stroke-linejoin':'round'}));
      vals.forEach(function(v,i){var rad=angles[i]*Math.PI/180,rr=R*v.pct/100;svg.appendChild(svgNode('circle',{cx:cx+rr*Math.cos(rad),cy:cy+rr*Math.sin(rad),r:'5',fill:colors[keys[i]],stroke:'#fff','stroke-width':'2'}));});
      var legend=panel.querySelector('.educ-graph-legend');legend.innerHTML='';
      vals.forEach(function(v,i){var item=el('div','educ-graph-item');var dot=el('i','educ-graph-dot');dot.style.background=colors[keys[i]];var label=el('div');label.appendChild(el('strong','',labels[keys[i]]));label.appendChild(el('small','',v.done+' / '+v.total+' questions'));item.appendChild(dot);item.appendChild(label);item.appendChild(el('strong','',v.pct+'%'));legend.appendChild(item);});
      if(!data.total)legend.appendChild(el('div','educ-learning-empty','Ta progression apparaîtra après tes premières réponses.'));
    }
    function render(){tabs.forEach(renderOne);}
    render();window.addEventListener('educ-progression-change',render);window.addEventListener('educ-pret',render);setTimeout(render,500);
  }
  function cleanHome() {
    var home=document.getElementById('tab-accueil');if(!home)return;
    home.querySelectorAll('.educ-extra,.educ-learning-panel').forEach(function(node){node.remove();});
    Array.prototype.slice.call(home.querySelectorAll('h2,h3,h4')).forEach(function(h){
      var t=(h.textContent||'').toLowerCase();
      if(t.indexOf('la rdc en images')!==-1||t.indexOf('mon suivi d’apprentissage')!==-1||t.indexOf('mon suivi d\'apprentissage')!==-1){
        var card=h.closest('.educ-extra,.educ-learning-panel,.card,section');if(card&&home.contains(card))card.remove();
      }
    });
  }
  function init(){cleanHome();addLibrary();addBackupControls();addLearningChart();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('educ-pret',init);
  setTimeout(init,1200);
})();