/* EDUC National — rappels d'étude. Aucun permission prompt automatique. */
(function () {
  'use strict';
  var KEY = 'educ_rappel_settings_v1';
  function settings() { try { return JSON.parse(localStorage.getItem(KEY) || '{"on":true,"h":18}'); } catch (e) { return { on: true, h: 18 }; } }
  function envoyer() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.showNotification) return reg.showNotification('EDUC National — rappel d’étude', { body: 'Quelques minutes de révision peuvent faire la différence. Reprenez votre apprentissage !', icon: 'logoo.png', badge: 'logoo.png', tag: 'educ-rappel-page' });
      }).catch(function () {});
    } else {
      try { new Notification('EDUC National — rappel d’étude', { body: 'Quelques minutes de révision peuvent faire la différence.' }); } catch (e) {}
    }
  }
  window.educPlanifierRappels = function () {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    var s = settings();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.active) reg.active.postMessage({ type: 'REMINDER_SETTINGS', on: !!s.on, h: Number(s.h) || 18 });
        if (reg.periodicSync && reg.periodicSync.register) return reg.periodicSync.register('educ-rappel', { minInterval: 12 * 60 * 60 * 1000 });
      }).catch(function () {});
    }
  };
  window.educDesactiverRappels = function () {
    try { localStorage.setItem(KEY, JSON.stringify({ on: false, h: 18 })); } catch (e) {}
    if ('serviceWorker' in navigator) navigator.serviceWorker.ready.then(function (reg) { if (reg.active) reg.active.postMessage({ type: 'REMINDER_SETTINGS', on: false, h: 18 }); }).catch(function () {});
  };
  window.addEventListener('load', function () {
    if ('Notification' in window && Notification.permission === 'granted') window.educPlanifierRappels();
  });
})();