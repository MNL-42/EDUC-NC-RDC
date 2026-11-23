/* EDUC National — modules complémentaires non intrusifs.
   Galerie Commons avec crédits, synthèse apprenant et bibliothèque des PDF existants. */
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
    var tabs = ['tab-quiz', 'tab-cours'];
    var chartCss = '.educ-learning-panel{margin:16px 20px 20px;padding:16px;border:1px solid var(--border-color,#dbe5ef);border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(239,246,255,.96));box-shadow:0 8px 24px rgba(15,45,85,.07)}.educ-learning-panel h3{margin:0 0 5px;font-size:1rem;font-weight:850;color:var(--text-dark,#123)}.educ-learning-panel>p{margin:0 0 13px;font-size:.76rem;line-height:1.45;color:var(--text-muted,#64748b)}.educ-learning-total{display:flex;align-items:baseline;gap:7px;margin:5px 0 14px}.educ-learning-total strong{font-size:1.65rem;line-height:1;font-weight:900;color:var(--primary-blue,#0066cc)}.educ-learning-total span{font-size:.76rem;color:var(--text-muted,#64748b)}.educ-level-row{margin:12px 0}.educ-level-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;font-size:.78rem}.educ-level-head strong{font-weight:800}.educ-level-state{font-size:.66rem;font-weight:800;padding:4px 8px;border-radius:20px;background:#e2e8f0;color:#475569;white-space:nowrap}.educ-level-state.started{background:#dbeafe;color:#1d4ed8}.educ-level-state.done{background:#dcfce7;color:#166534}.educ-level-track{height:10px;border-radius:20px;background:#e7edf5;overflow:hidden}.educ-level-fill{height:100%;border-radius:20px;background:linear-gradient(90deg,#0066cc,#36a3ff);width:0;transition:width .35s ease}.educ-level-foot{display:flex;justify-content:space-between;margin-top:5px;font-size:.68rem;color:var(--text-muted,#64748b)}.educ-learning-empty{padding:10px;border-radius:12px;background:#f1f5f9;color:#64748b;font-size:.76rem}';
    if (!document.getElementById('educ-learning-chart-style')) { var style=document.createElement('style');style.id='educ-learning-chart-style';style.textContent=chartCss;document.head.appendChild(style); }
    function renderOne(tabId) {
      var tab=document.getElementById(tabId); if(!tab)return;
      var panel=document.getElementById('educ-learning-'+tabId);
      if(!panel){
        panel=el('section','educ-learning-panel');panel.id='educ-learning-'+tabId;
        panel.innerHTML='<h3>Mon suivi d’apprentissage</h3><p>Visualisez les questions déjà traitées et les niveaux parcourus dans le quiz.</p><div class="educ-learning-total"><strong class="educ-learning-done">0</strong><span class="educ-learning-total-label">question(s) traitée(s)</span></div><div class="educ-learning-levels"></div>';
        var heading=tab.querySelector('.section-title')||tab.querySelector('h3');
        if(heading&&heading.parentNode)heading.parentNode.insertBefore(panel,heading.nextSibling);else tab.insertBefore(panel,tab.firstChild);
      }
      var data=typeof window.educProgression==='function'?window.educProgression():null;
      if(!data||!data.par)return;
      panel.querySelector('.educ-learning-done').textContent=data.done||0;
      panel.querySelector('.educ-learning-total-label').textContent='question(s) traitée(s) sur '+(data.total||0);
      var levels=panel.querySelector('.educ-learning-levels');levels.innerHTML='';
      var labels={facile:'Facile',difficile:'Difficile',pro:'Pro'};
      ['facile','difficile','pro'].forEach(function(key){
        var item=data.par[key]||{done:0,total:0},done=Number(item.done)||0,total=Number(item.total)||0,pct=total?Math.min(100,Math.round(done/total*100)):0;
        var state=done>=200?'Niveau validé':done>0?'En cours':'À découvrir';
        var row=el('div','educ-level-row'),head=el('div','educ-level-head');
        head.appendChild(el('strong','',labels[key]));head.appendChild(el('span','educ-level-state'+(done>=200?' done':done>0?' started':''),state));
        var track=el('div','educ-level-track'),fill=el('div','educ-level-fill');fill.style.width=pct+'%';track.appendChild(fill);
        var foot=el('div','educ-level-foot');foot.appendChild(el('span','',done+' / '+total+' questions'));foot.appendChild(el('span','',pct+' %'));
        row.appendChild(head);row.appendChild(track);row.appendChild(foot);levels.appendChild(row);
      });
      if(!data.total)levels.appendChild(el('div','educ-learning-empty','Votre progression apparaîtra ici dès votre première réponse au quiz.'));
    }
    function render(){tabs.forEach(renderOne);}
    render();
    window.addEventListener('educ-progression-change',render);
    window.addEventListener('educ-pret',render);
    setTimeout(render,500);
  }
  function init(){addLibrary();addBackupControls();addLearningChart();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('educ-pret',init);
  setTimeout(init,1200);
})();