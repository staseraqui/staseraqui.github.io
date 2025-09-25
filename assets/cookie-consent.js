/* Stasera Qui — Cookie Consent (IT) - v1
   Categorie: essential (sempre on), analytics (GA4), marketing (non usata).
   Salva preferenze in localStorage (sq_consent). Carica GA solo con consenso. */
(function () {
  'use strict';

  var STORAGE_KEY = 'sq_consent';
  var POLICY_VERSION = '2025-09-24-1'; // incrementa se cambi testi/categorie
  var GA_ID = 'G-SDBGY51C46';          // il tuo ID GA4

  var TEXTS = {
    title: 'Preferenze cookie',
    intro: 'Usiamo cookie essenziali per far funzionare il sito e cookie facoltativi per statistiche anonime (Google Analytics). Scegli tu cosa consentire.',
    essential: 'Essenziali (sempre attivi): necessari per sicurezza, prestazioni di base e pagamento.',
    analytics: 'Analytics: ci aiutano a capire come viene usato il sito (Google Analytics, IP anonimizzato).',
    marketing: 'Marketing: non utilizzati su questo sito.',
    links: 'Dettagli nella nostra <a href="termini-privacy.html#cookie-policy" target="_blank" rel="noopener">Cookie Policy</a>.',
    acceptAll: 'Accetta tutto',
    rejectAll: 'Rifiuta tutto',
    save: 'Salva preferenze'
  };

  var CSS = ".sq-cc-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.44);display:flex;align-items:flex-end;justify-content:center;z-index:99998}.sq-cc-modal{background:#0f1c2d;color:#e8f2ff;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;max-width:760px;width:100%;margin:12px;z-index:99999}.sq-cc-h{font-weight:800;margin:0 0 4px;font-size:18px}.sq-cc-p{margin:4px 0 10px;font-size:14px;color:#cfe7ff}.sq-cc-row{display:flex;gap:12px;flex-wrap:wrap;margin:8px 0}.sq-cc-opt{flex:1 1 220px;background:#17304d;border:1px solid #2e6e8f;border-radius:12px;padding:10px}.sq-cc-opt h4{margin:0 0 6px;font-size:15px}.sq-cc-opt p{margin:0;font-size:13px;color:#cfe7ff}.sq-cc-switch{display:flex;align-items:center;gap:8px;margin:8px 0 0}.sq-cc-switch input{width:40px;height:22px}.sq-cc-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:10px}.sq-cc-btn{border-radius:10px;border:1px solid #2e6e8f;background:#17304d;color:#d7f2ff;padding:10px 14px;font-weight:700;cursor:pointer}.sq-cc-btn.primary{background:#22b3f0;color:#081421;border-color:#22b3f0}.sq-cc-btn.ghost{background:transparent}.sq-cc-hidden{display:none}@media (min-width:820px){.sq-cc-modal{align-self:center}}";

  function injectStyle() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (obj.version !== POLICY_VERSION) return null;
      return obj;
    } catch (_) { return null; }
  }
  function setConsent(c) { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }
  function dntEnabled() { return (navigator.doNotTrack === '1' || window.doNotTrack === '1'); }

  function deleteCookie(name) {
    try {
      var domains = [location.hostname, '.' + location.hostname.replace(/^www\./, '')];
      domains.forEach(function (dom) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + dom + '; SameSite=Lax';
      });
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
    } catch (_) {}
  }
  function purgeGA() {
    var names = document.cookie.split(';').map(function (c) { return (c.split('=')[0] || '').trim(); }).filter(Boolean);
    names.forEach(function (n) {
      if (/^_ga($|_|-)|^_gid$|^_gat/.test(n)) deleteCookie(n);
    });
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || !GA_ID) return;
    gaLoaded = true;
    var s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function buildModal() {
    var wrap = document.createElement('div');
    wrap.className = 'sq-cc-backdrop';
    wrap.innerHTML =
      '<div class="sq-cc-modal" role="dialog" aria-modal="true">' +
      '<h2 class="sq-cc-h">' + TEXTS.title + '</h2>' +
      '<p class="sq-cc-p">' + TEXTS.intro + '</p>' +
      '<div class="sq-cc-row">' +
        '<div class="sq-cc-opt"><h4>Essenziali</h4><p>' + TEXTS.essential + '</p><div class="sq-cc-switch"><input type="checkbox" checked disabled aria-label="Essenziali"></div></div>' +
        '<div class="sq-cc-opt"><h4>Analytics</h4><p>' + TEXTS.analytics + '</p><div class="sq-cc-switch"><label><input type="checkbox" id="sqcc_analytics"> Abilita</label></div></div>' +
        '<div class="sq-cc-opt"><h4>Marketing</h4><p>' + TEXTS.marketing + '</p><div class="sq-cc-switch"><label><input type="checkbox" id="sqcc_marketing" disabled> Non usati</label></div></div>' +
      '</div>' +
      '<div class="sq-cc-p">' + TEXTS.links + '</div>' +
      '<div class="sq-cc-actions">' +
        '<button class="sq-cc-btn" id="sqcc_reject">' + TEXTS.rejectAll + '</button>' +
        '<button class="sq-cc-btn primary" id="sqcc_accept">' + TEXTS.acceptAll + '</button>' +
        '<button class="sq-cc-btn" id="sqcc_save">' + TEXTS.save + '</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    var chkA = wrap.querySelector('#sqcc_analytics');
    if (dntEnabled()) chkA.checked = false;

    function saveAndApply(consent) {
      setConsent(consent);
      applyConsent();
      closeModal();
    }
    wrap.querySelector('#sqcc_accept').onclick = function () {
      saveAndApply({ version: POLICY_VERSION, timestamp: Date.now(), essential: true, analytics: true, marketing: false });
    };
    wrap.querySelector('#sqcc_reject').onclick = function () {
      saveAndApply({ version: POLICY_VERSION, timestamp: Date.now(), essential: true, analytics: false, marketing: false });
    };
    wrap.querySelector('#sqcc_save').onclick = function () {
      saveAndApply({ version: POLICY_VERSION, timestamp: Date.now(), essential: true, analytics: !!chkA.checked, marketing: false });
    };

    return wrap;
  }

  var modalEl = null;
  function openModal() { if (!modalEl) modalEl = buildModal(); modalEl.classList.remove('sq-cc-hidden'); }
  function closeModal() { if (modalEl) modalEl.classList.add('sq-cc-hidden'); }

  function applyConsent() {
    var c = getConsent();
    if (!c) return;
    if (c.analytics) loadGA(); else purgeGA();
  }

  // Esporta mini API
  window.SQ_CONSENT = { get: getConsent, open: openModal, apply: applyConsent };

  injectStyle();
  var existing = getConsent();
  if (!existing) openModal(); else applyConsent();

  window.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('cookieSettingsLink');
    if (link) link.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
})();
