const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// -------- HOME --------
async function initHome(){
  const selBtn = document.getElementById('selData');
  if(selBtn){
    const badge = document.createElement('span');
    badge.className = 'date-badge';
    badge.style.display = 'none';
    selBtn.appendChild(badge);
    selBtn.addEventListener('click', ()=>{
      const inp = document.createElement('input');
      inp.type = 'date';
      inp.style.position='fixed'; inp.style.opacity='0'; inp.style.pointerEvents='none';
      document.body.appendChild(inp);
      inp.addEventListener('change', ()=>{
        if(inp.value){
          const d = new Date(inp.value);
          const opts = {day:'2-digit', month:'2-digit', year:'numeric'};
          badge.textContent = d.toLocaleDateString('it-IT', opts);
          badge.style.display = 'inline-block';
          localStorage.setItem('sq_sel_date', inp.value);
          // refresh markers if present
          renderMarkers();
        }
        document.body.removeChild(inp);
      });
      inp.showPicker ? inp.showPicker() : inp.click();
    });
  }

  // Map
  window._sq_map = L.map('map').setView([45.0703, 7.6869], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(_sq_map);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const {latitude, longitude} = pos.coords;
      _sq_map.setView([latitude, longitude], 13);
      L.circle([latitude, longitude], {radius: 200, color:'#22b3f0'}).addTo(_sq_map);
    });
  }
  renderMarkers();
}

function renderMarkers(){
  if(!window._sq_map) return;
  // clear existing circleMarkers (simple approach: reload map layer group could be nicer)
  // For simplicity in staging, we won't remove old markers; it's fine for demo.

  const raw = localStorage.getItem('sq_events');
  if(!raw) return;
  let events;
  try{ events = JSON.parse(raw); }catch(e){ return; }
  const selDate = localStorage.getItem('sq_sel_date');
  events.forEach(ev => {
    ev.occorrenze.forEach(occ => {
      if(!selDate || occ.data === selDate){
        if(occ.lat && occ.lng){
          L.circleMarker([occ.lat, occ.lng], {radius:8, color:'#22b3f0', fill:true, fillOpacity:0.9})
            .addTo(_sq_map)
            .bindPopup(`<b>${ev.titolo}</b><br>${occ.data} ore ${occ.ora}<br>${occ.luogo}, ${occ.citta}`);
        }
      }
    });
  });
}

// -------- PUBBLICA EVENTO --------
function initPubblica(){
  const catBtn = $('#categorieBtn');
  const catWrap = $('#catBadges');
  let categorie = [];

  // Modal categorie semplice
  const modal = document.createElement('div');
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:flex-end;justify-content:center;z-index:50';
  modal.innerHTML = `
    <div style="background:#0f1c2d;border:1px solid rgba(255,255,255,.12);border-top-left-radius:16px;border-top-right-radius:16px;padding:16px;width:100%;max-width:1000px">
      <h3 style="margin:0 0 6px">Scegli categorie (multi)</h3>
      <div id="chips" style="display:flex;gap:10px;flex-wrap:wrap;margin:8px 0 12px">
        ${['Musica','Food & Drink','Nightlife','Cultura/Spettacolo','Famiglie & Bambini','Sport','Sagre & Fiere','Mercatini'].map(c => `<div class="chip" data-cat="${c}" style="background:#17304d;border:1px solid #2e6e8f;color:#d7f2ff;border-radius:28px;padding:10px 18px;font-weight:700;cursor:pointer;user-select:none">${c}</div>`).join('')}
      </div>
      <div class="actions">
        <button class="btn" id="catOk">Conferma</button>
        <button class="btn secondary" id="catClear">Azzera</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  function renderCats(){
    catWrap.innerHTML=''; categorie.forEach(c => {
      const b=document.createElement('span'); b.className='badge'; b.textContent=c; catWrap.appendChild(b);
    });
  }
  if(catBtn){
    catBtn.addEventListener('click', ()=>{ modal.style.display='flex'; });
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.style.display='none'; });
    modal.addEventListener('click', e=>{
      if(e.target.classList.contains('chip')){
        e.target.classList.toggle('active');
        if(e.target.classList.contains('active')){ e.target.style.background='#22b3f0'; e.target.style.color='#081421'; e.target.style.borderColor='#22b3f0'; }
        else { e.target.style.background='#17304d'; e.target.style.color='#d7f2ff'; e.target.style.borderColor='#2e6e8f'; }
      }
    });
    modal.querySelector('#catOk').addEventListener('click', ()=>{
      categorie = [...modal.querySelectorAll('.chip.active')].map(ch => ch.dataset.cat);
      renderCats(); modal.style.display='none';
    });
    modal.querySelector('#catClear').addEventListener('click', ()=>{ categorie=[]; renderCats(); modal.querySelectorAll('.chip').forEach(ch => ch.classList.remove('active')); });
  }

  // Occorrenze add/remove
  const occWrap = document.getElementById('occWrap');
  function occTpl(){
    const id='occ_'+Math.random().toString(36).slice(2,7);
    return `
    <div class="occ card" data-id="${id}">
      <div class="grid">
        <div><label>Luogo/Nome locale*</label><input class="luogo" placeholder="Es. Bar Centrale"></div>
        <div><label>Indirizzo*</label><input class="indirizzo" placeholder="Via Roma 1"></div>
      </div>
      <div class="grid">
        <div><label>Città*</label><input class="citta" placeholder="Es. Torino"></div>
        <div><label>Data*</label><input class="data" type="date"></div>
      </div>
      <div class="grid">
        <div><label>Orario*</label><input class="ora" type="time"></div>
        <div style="display:flex;align-items:flex-end;justify-content:flex-end"><button type="button" class="del-btn" data-del="${id}">Elimina occorrenza</button></div>
      </div>
    </div>`;
  }
  if(occWrap){
    occWrap.innerHTML = occTpl();
    $('#addOcc').addEventListener('click', ()=>{ const d=document.createElement('div'); d.innerHTML=occTpl(); occWrap.appendChild(d.firstElementChild); });
    occWrap.addEventListener('click', e=>{
      if(e.target.dataset.del){
        const box = e.target.closest('.occ'); if(box) box.remove();
      }
    });
  }

  // Multipli contatti
  const contWrap = document.getElementById('contattiWrap');
  function contTpl(){
    return `
    <div class="grid contact">
      <div><label>Nome referente</label><input class="ref_name" placeholder="Es. Laura Bianchi"></div>
      <div><label>Numero referente</label><input class="ref_phone" type="tel" placeholder="+39 333 1234567"></div>
    </div>`;
  }
  if(contWrap){
    contWrap.innerHTML = contTpl();
    $('#addContact').addEventListener('click', ()=>{ const d=document.createElement('div'); d.innerHTML=contTpl(); contWrap.appendChild(d.firstElementChild); });
  }

  const err = $('#err');
  function clean(t){ t=(t||'').trim().replace(/\s+/g,' '); return t? t.charAt(0).toUpperCase()+t.slice(1):''; }
  function collectOcc(){
    const occ = [];
    $$('#occWrap .occ').forEach(b=>{
      const luogo=clean(b.querySelector('.luogo').value);
      const indirizzo=clean(b.querySelector('.indirizzo').value);
      const citta=clean(b.querySelector('.citta').value);
      const data=b.querySelector('.data').value;
      const ora=b.querySelector('.ora').value;
      if(!luogo||!indirizzo||!citta||!data||!ora){ occ.push(null); } else { occ.push({luogo,indirizzo,citta,data,ora}); }
    });
    if(occ.length===0 || occ.includes(null)) return null;
    return occ;
  }
  function validate(){
    err.textContent='';
    const titolo = clean($('#titolo').value);
    const descr  = clean($('#descrizione').value);
    const file   = $('#locandina').files[0];
    if(!titolo || !descr || !file || !catWrap){ err.textContent='Controlla: Titolo*, Descrizione*, Locandina*, almeno 1 Categoria*.'; return null; }
    const anyCat = catWrap.children.length>0;
    if(!anyCat){ err.textContent='Seleziona almeno una categoria.'; return null; }
    if(file.size>5*1024*1024){ err.textContent='Immagine troppo pesante (>5MB).'; return null; }
    const occ = collectOcc(); if(!occ){ err.textContent='Completa tutti i campi delle occorrenze e usa "Elimina occorrenza" per quelle non necessarie.'; return null; }

    const sub_nome = clean($('#sub_nome').value), sub_cognome = clean($('#sub_cognome').value);
    const sub_tel = $('#sub_tel').value.trim(), sub_email = $('#sub_email').value.trim();
    if(!sub_nome || !sub_cognome || !sub_tel || !sub_email){ err.textContent='Compila Nome, Cognome, Telefono ed Email di chi inserisce l’evento.'; return null; }

    const cats = [...catWrap.children].map(b=>b.textContent);
    return { titolo, descr, occ, categorie: cats, sub:{nome:sub_nome,cognome:sub_cognome,tel:sub_tel,email:sub_email}, partner: ($('#partner_code').value||'').trim() };
  }

  function renderPreview(data){
    $('#pv_titolo').textContent = data.titolo;
    $('#pv_cats').textContent   = data.categorie.join(', ');
    $('#pv_descr').textContent  = data.descr;
    $('#pv_occ').textContent    = `${data.occ.length} occorrenza/e`;
    const ul = document.createElement('ul'); ul.style.marginTop='6px';
    data.occ.forEach(o=>{
      const li=document.createElement('li');
      li.textContent = `${o.data} ore ${o.ora} — ${o.luogo}, ${o.indirizzo}, ${o.citta}`;
      ul.appendChild(li);
    });
    const list = $('#pv_list'); list.innerHTML=''; list.appendChild(ul);
    $('#preview').style.display='block';
  }

  // Geocode all occurrences via Nominatim (client-side)
  async function geocodeOcc(occ){
    const q = encodeURIComponent(`${occ.indirizzo}, ${occ.citta}`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`;
    try{
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      const js = await res.json();
      if(js && js[0]){
        return {lat: parseFloat(js[0].lat), lng: parseFloat(js[0].lon)};
      }
    }catch(e){}
    return {lat:null, lng:null};
  }
  async function geocodeAll(occs){
    const out = [];
    for(const o of occs){
      const g = await geocodeOcc(o);
      out.push({...o, ...g});
      // simple polite delay to avoid hammering the service
      await new Promise(r=>setTimeout(r, 500));
    }
    return out;
  }

  function demoSaveToLocalStorage(dataWithGeo){
    const store = JSON.parse(localStorage.getItem('sq_events')||'[]');
    store.push(dataWithGeo);
    localStorage.setItem('sq_events', JSON.stringify(store));
  }

  $('#anteprimaBtn')?.addEventListener('click', async ()=>{
    const data = validate(); if(!data) return;
    renderPreview(data);
    window.scrollTo({top: $('#preview').offsetTop-10, behavior:'smooth'});
  });

  $('#confermaFooterBtn')?.addEventListener('click', async ()=>{
    const data = validate(); if(!data) return;
    // Add geocoding so the Home map can show pins
    const geo = await geocodeAll(data.occ);
    const payload = {...data, occ: undefined, occorrenze: geo};
    demoSaveToLocalStorage(payload);
    renderPreview(data);
    alert('Anteprima ok. Nella Home di staging vedrai i pin sulla mappa per testare i filtri per data.\n(Pagamento Stripe verrà collegato nella fase successiva).');
  });

  $('#confermaBtn')?.addEventListener('click', async (e)=>{
    e.preventDefault();
    const data = validate(); if(!data) return;
    const geo = await geocodeAll(data.occ);
    const payload = {...data, occ: undefined, occorrenze: geo};
    demoSaveToLocalStorage(payload);
    alert('Conferma ok (DEMO). Evento salvato per la mappa in Home di staging.');
  });
}

// -------- LAVORA CON NOI --------
function initLavora(){
  const form = document.getElementById('workForm');
  const out = document.getElementById('workOut');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const nome = (document.getElementById('w_nome').value||'').trim();
    const cognome = (document.getElementById('w_cognome').value||'').trim();
    const email = (document.getElementById('w_email').value||'').trim();
    const tel = (document.getElementById('w_tel').value||'').trim();
    const citta = (document.getElementById('w_citta').value||'').trim();
    if(!nome||!cognome||!email||!tel||!citta){ out.textContent='Compila tutti i campi obbligatori.'; return; }
    const code = Math.random().toString(36).slice(2,8).toUpperCase();
    out.innerHTML = `<b>Codice partner:</b> ${code} — Salvalo: ti servirà per i clienti e le commissioni.`;
    const body = encodeURIComponent(
`Nuova candidatura partner
Nome: ${nome} ${cognome}
Email: ${email}
Telefono: ${tel}
Città: ${citta}

Codice partner assegnato: ${code}

Messaggio: ${document.getElementById('w_note').value||''}`);
    window.location.href = `mailto:lavoraconnoi@staseraqui.it?subject=Candidatura partner — ${nome}%20${cognome}&body=${body}`;
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  if(page==='home') initHome();
  if(page==='pubblica') initPubblica();
  if(page==='lavora') initLavora();
});
