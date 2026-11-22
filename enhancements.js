/* EDUC National — modules complémentaires non intrusifs.
   Galerie Commons avec crédits, synthèse apprenant et bibliothèque des PDF existants. */
(function () {
  'use strict';
  var PROVINCES = ['Kinshasa','Kongo-Central','Kwango','Kwilu','Mai-Ndombe','Kasaï','Kasaï-Central','Kasaï-Oriental','Lomami','Sankuru','Maniema','Sud-Kivu','Nord-Kivu','Ituri','Tshopo','Bas-Uele','Haut-Uele','Nord-Ubangi','Sud-Ubangi','Mongala','Équateur','Tshuapa','Haut-Lomami','Lualaba','Haut-Katanga','Tanganyika'];
  var css = document.createElement('style');
  css.textContent = '.educ-extra{margin:18px 20px;padding:16px;border:1px solid var(--border-color,#e2e8f0);border-radius:18px;background:rgba(255,255,255,.92);box-shadow:0 6px 20px rgba(0,0,0,.04)}.educ-extra h3{font-size:1rem;font-weight:800;margin:0 0 6px}.educ-extra p{font-size:.8rem;color:var(--text-muted,#64748b);line-height:1.5}.educ-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.educ-photo{min-width:0;border:1px solid var(--border-color,#e2e8f0);border-radius:12px;overflow:hidden;background:#f8fafc}.educ-photo img{width:100%;height:118px;object-fit:cover;display:block}.educ-photo a{display:block;padding:7px 8px;color:var(--primary-blue,#0066cc);font-size:.72rem;font-weight:700;text-decoration:none}.educ-photo small{display:block;padding:0 8px 8px;color:var(--text-muted,#64748b);font-size:.65rem}.educ-extra-btn{border:0;border-radius:12px;padding:10px 13px;background:var(--primary-blue,#0066cc);color:#fff;font-weight:700;margin-top:10px}.educ-stat-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #edf1f5;font-size:.82rem}.educ-stat-row:last-child{border:0}.educ-library-list{display:grid;gap:8px;margin-top:10px}.educ-library-list a{display:block;padding:10px 12px;border:1px solid #e2e8f0;border-radius:11px;color:var(--primary-blue,#0066cc);font-size:.82rem;font-weight:700;text-decoration:none}';
  document.head.appendChild(css);
  function el(tag, cls, text) { var n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n; }
  function addProgress() {
    var main=document.getElementById('main-app'), xp=main&&main.querySelector('.xp-card'); if(!xp||document.getElementById('educ-progress-summary'))return;
    var card=el('section','educ-extra');card.id='educ-progress-summary';card.innerHTML='<h3>Mon suivi d’apprentissage</h3><p>Un aperçu rapide de votre activité sur cet appareil.</p>';
    var rows=[['Points d’expérience',function(){return (document.getElementById('user-xp-text')||{}).textContent||'—';}],['Progression quiz',function(){var s=window.QUIZ_STATS||{};return (s.facile||0)+' questions faciles · '+(s.difficile||0)+' difficiles · '+(s.pro||0)+' pro';}],['Province',function(){try{var u=JSON.parse(localStorage.getItem('educ_utilisateur_connecte')||'{}');return u.province||'Non renseignée';}catch(e){return '—';}}]];
    rows.forEach(function(r){var line=el('div','educ-stat-row');line.appendChild(el('strong','',r[0]));line.appendChild(el('span','',r[1]()));card.appendChild(line);});
    xp.parentNode.insertBefore(card,xp.nextSibling);
  }
  function addLibrary() {
    var tab=document.getElementById('tab-cours');if(!tab||document.getElementById('educ-library'))return;
    var links=Array.prototype.slice.call(tab.querySelectorAll('a[href$=".pdf"]'));
    if(!links.length)return;
    var card=el('section','educ-extra');card.id='educ-library';card.appendChild(el('h3','','Bibliothèque pédagogique'));card.appendChild(el('p','','Accès rapide aux documents PDF déjà présents dans la plateforme.'));
    var list=el('div','educ-library-list');
    links.forEach(function(a){var href=a.getAttribute('href');if(!href||href.indexOf('://')===0)return;var b=el('a','',((a.innerText||a.textContent||'Document').replace(/\s+/g,' ').trim())+' ↗');b.href=href;b.target='_blank';b.rel='noopener';list.appendChild(b);});
    card.appendChild(list);tab.appendChild(card);
  }
  function addGallery() {
    var home=document.getElementById('tab-accueil');if(!home||document.getElementById('educ-rdc-gallery'))return;
    var card=el('section','educ-extra');card.id='educ-rdc-gallery';card.appendChild(el('h3','','La RDC en images'));card.appendChild(el('p','','Photographies publiques de la République démocratique du Congo. Chaque image renvoie à sa fiche source et à ses informations de licence.'));
    var note=el('p','','Chargement de photographies depuis Wikimedia Commons…');card.appendChild(note);
    var grid=el('div','educ-gallery');card.appendChild(grid);
    var btn=el('button','educ-extra-btn','Actualiser les photographies');btn.type='button';btn.addEventListener('click',function(){load(true);});card.appendChild(btn);
    var target=home.querySelector('.course-card')||home.lastElementChild;if(target&&target.parentNode)target.parentNode.insertBefore(card,target.nextSibling);else home.appendChild(card);
    var loaded=false;
    function load(force){
      if(loaded&&!force)return;loaded=true;grid.innerHTML='';
      var q='(Kinshasa OR "Democratic Republic of the Congo" OR "Congo river")';
      var url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=720&format=json&origin=*';
      fetch(url).then(function(r){if(!r.ok)throw new Error('Wikimedia indisponible');return r.json();}).then(function(data){
        var pages=data.query&&data.query.pages?Object.keys(data.query.pages).map(function(k){return data.query.pages[k];}):[];
        var usable=pages.filter(function(p){var ii=p.imageinfo&&p.imageinfo[0];return ii&&(ii.thumburl||ii.url)&&/\.(jpg|jpeg|png|webp)$/i.test(ii.thumburl||ii.url);}).slice(0,8);
        if(!usable.length)throw new Error('Aucune photographie disponible');
        note.textContent='Images publiques — sources et crédits consultables sur Wikimedia Commons.';
        usable.forEach(function(p){
          var ii=p.imageinfo[0],src=ii.thumburl||ii.url,meta=ii.extmetadata||{},credit=(meta.Artist&&meta.Artist.value||meta.Credit&&meta.Credit.value||'Wikimedia Commons').replace(/<[^>]*>/g,'').slice(0,80),lic=(meta.LicenseShortName&&meta.LicenseShortName.value)||'Licence à consulter';
          var item=el('article','educ-photo'),img=document.createElement('img');img.src=src;img.alt=p.title.replace(/^File:/,'');img.loading='lazy';img.referrerPolicy='no-referrer';item.appendChild(img);
          var a=el('a','',p.title.replace(/^File:/,'').slice(0,52));a.href='https://commons.wikimedia.org/wiki/'+encodeURIComponent(p.title.replace(/ /g,'_'));a.target='_blank';a.rel='noopener';item.appendChild(a);item.appendChild(el('small','',credit+' · '+lic));grid.appendChild(item);
        });
      }).catch(function(){note.textContent='La galerie nécessite une connexion Internet. Réessayez plus tard.';loaded=false;});
    }
    load(false);
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
  function addProvinceQuickInfo() {
    var card=document.getElementById('educ-rdc-gallery');if(!card||document.getElementById('educ-provinces-note'))return;
    var p=el('p','');p.id='educ-provinces-note';p.style.marginTop='10px';p.textContent='Couverture géographique : '+PROVINCES.length+' provinces de la RDC. Les fiches détaillées pourront être enrichies avec des données vérifiées.';card.appendChild(p);
  }
  function init(){addProgress();addLibrary();addGallery();addProvinceQuickInfo();addBackupControls();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('educ-pret',init);
  setTimeout(init,1200);
})();