/* EDUC National — recherche locale dans les contenus déjà chargés. */
(function () {
  'use strict';
  function init() {
    var input = document.querySelector('.search-bar-container input');
    if (!input || input.dataset.educSearchReady) return;
    input.dataset.educSearchReady = '1';
    input.id = input.id || 'educ-global-search';
    var wrap = input.closest('.search-input-wrapper') || input.parentElement;
    var panel = document.createElement('div');
    panel.className = 'educ-search-results';
    panel.hidden = true;
    panel.setAttribute('role', 'listbox');
    panel.style.cssText = 'position:absolute;z-index:500;left:0;right:0;top:calc(100% + 6px);max-height:55vh;overflow:auto;background:#fff;border:1px solid #dbe4ef;border-radius:14px;box-shadow:0 12px 30px rgba(15,40,80,.16);padding:6px';
    var host = input.closest('.search-bar-container');
    if (host) { host.style.position = 'relative'; host.appendChild(panel); }
    var tabs = ['tab-accueil','tab-cours','tab-quiz','tab-actu','tab-profil','tab-presidents-list'];
    function collect(q) {
      var found = [];
      tabs.forEach(function (id) {
        var tab = document.getElementById(id); if (!tab) return;
        var nodes = tab.querySelectorAll('h1,h2,h3,h4,.book-card,.course-card,.access-card,.news-card,a[href$=".pdf"]');
        Array.prototype.forEach.call(nodes, function (node) {
          if (found.length >= 30 || node.closest('.educ-search-results')) return;
          var label = (node.innerText || node.textContent || '').replace(/\s+/g,' ').trim();
          if (label && label.toLocaleLowerCase('fr').indexOf(q) !== -1 && !found.some(function (x) { return x.node === node; })) found.push({ node: node, label: label.slice(0,110), tab: id });
        });
      });
      return found.slice(0,10);
    }
    function show(list) {
      panel.innerHTML = '';
      if (!list.length) { var p=document.createElement('p');p.textContent='Aucun résultat dans les contenus chargés.';p.style.cssText='padding:10px;color:#64748b;font-size:.85rem';panel.appendChild(p); }
      list.forEach(function (item) {
        var b=document.createElement('button');b.type='button';b.textContent=item.label;b.style.cssText='display:block;width:100%;text-align:left;border:0;background:#fff;padding:11px;border-radius:9px;color:#1e293b;font:600 .85rem Arial;cursor:pointer';
        b.addEventListener('click',function(){ if(typeof window.switchTab==='function'){var ix=tabs.indexOf(item.tab);window.switchTab(item.tab,Math.max(0,ix));} setTimeout(function(){item.node.scrollIntoView({behavior:'smooth',block:'center'});item.node.style.outline='2px solid #ffc107';setTimeout(function(){item.node.style.outline='';},1800);},120);panel.hidden=true;input.blur(); });
        panel.appendChild(b);
      });
      panel.hidden=false;
    }
    input.addEventListener('input',function(){var q=input.value.trim().toLocaleLowerCase('fr');if(q.length<2){panel.hidden=true;return;}show(collect(q));});
    input.addEventListener('keydown',function(e){if(e.key==='Escape')panel.hidden=true;if(e.key==='Enter'&&!panel.hidden){var b=panel.querySelector('button');if(b)b.click();}});
    document.addEventListener('click',function(e){if(!host.contains(e.target))panel.hidden=true;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('educ-pret',init);
})();