
(function(){
  const MAP = L.map('map').setView([45.0703, 7.6869], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(MAP);

  const markers = [];
  const items = [];
  const chips = Array.from(document.querySelectorAll('.chip'));
  const pills = Array.from(document.querySelectorAll('.pill'));
  const selDataBtn = document.getElementById('selData');
  const dateBadge = selDataBtn?.querySelector('.date-badge');
  const searchInput = document.getElementById('searchInput');
  const resultCountEl = document.getElementById('resultCount');
  const dateModal = document.getElementById('dateModal');
  const dateInput = document.getElementById('dateInput');
  const dateOk = document.getElementById('dateOk');
  const dateCancel = document.getElementById('dateCancel');

  function parseISO(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y, m-1, d); }
  function isSame(d1,d2){ return d1.getFullYear()==d2.getFullYear() && d1.getMonth()==d2.getMonth() && d1.getDate()==d2.getDate(); }
  function isWeekend(d){ const wd=d.getDay(); return (wd===5||wd===6||wd===0); }

  let selectedDate = null;
  let selectedCats = new Set();
  let prevCount = -1;

  chips.forEach(ch => ch.addEventListener('click', () => {
    ch.classList.toggle('active');
    const cat = ch.dataset.cat;
    if(ch.classList.contains('active')) selectedCats.add(cat);
    else selectedCats.delete(cat);
    render();
  }));

  pills.forEach(p => p.addEventListener('click', () => {
    const t = p.dataset.day;
    if(t === 'oggi'){
      selectedDate = new Date();
      dateBadge && (dateBadge.textContent = selectedDate.toLocaleDateString('it-IT'));
      dateBadge && (dateBadge.style.display='inline-block');
    } else if(t === 'domani'){
      selectedDate = new Date(Date.now()+86400000);
      dateBadge && (dateBadge.textContent = selectedDate.toLocaleDateString('it-IT'));
      dateBadge && (dateBadge.style.display='inline-block');
    } else if(t === 'weekend'){
      selectedDate = 'WEEKEND';
      dateBadge && (dateBadge.textContent = 'Weekend');
      dateBadge && (dateBadge.style.display='inline-block');
    }
    render();
  }));

  if(selDataBtn){
    selDataBtn.addEventListener('click', ()=>{
      dateModal.style.display='flex';
      dateInput.value = '';
      dateInput.focus();
    });
  }
  dateCancel && dateCancel.addEventListener('click', ()=> dateModal.style.display='none');
  dateOk && dateOk.addEventListener('click', ()=>{
    if(dateInput.value){
      const d = parseISO(dateInput.value);
      selectedDate = d;
      dateBadge.textContent = d.toLocaleDateString('it-IT');
      dateBadge.style.display = 'inline-block';
      dateModal.style.display='none';
      render();
    } else {
      dateModal.style.display='none';
    }
  });

  searchInput && searchInput.addEventListener('input', ()=> render());

  async function loadFromSupabase(){
    if(!window.SQ_CONFIG?.SUPABASE_URL || !window.SQ_CONFIG?.SUPABASE_ANON_KEY) throw new Error("no supabase");
    const supa = supabase.createClient(window.SQ_CONFIG.SUPABASE_URL, window.SQ_CONFIG.SUPABASE_ANON_KEY);
    const today = new Date().toISOString().slice(0,10);
    const in30 = new Date(Date.now()+30*86400000).toISOString().slice(0,10);
    const { data, error } = await supa.from('events_public')
      .select('id,title,category,date,time,venue,address,city,price,lat,lon')
      .gte('date', today).lte('date', in30).limit(2000);
    if(error) throw error;
    return data.map(e => ({
      id: e.id, title: e.title, category: e.category, date: e.date, time: e.time,
      venue: e.venue, address: e.address, city: e.city, price: e.price||'',
      coords: {lat: e.lat, lng: e.lon}
    }));
  }

  async function loadEvents(){
    try{
      const sup = await loadFromSupabase();
      items.splice(0, items.length, ...sup);
    }catch(e){
      const res = await fetch('/assets/events.json'); const js = await res.json();
      items.splice(0, items.length, ...js);
    }
    render();
  }

  function clearMarkers(){ markers.forEach(m=>MAP.removeLayer(m)); markers.length=0; }

  function passFilters(ev){
    if(selectedCats.size>0 && !selectedCats.has(ev.category)) return false;
    const evDate = new Date(ev.date);
    if(selectedDate === 'WEEKEND'){ if(!isWeekend(evDate)) return false; }
    else if(selectedDate instanceof Date){ if(!isSame(evDate, selectedDate)) return false; }
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    if(q){
      const hay = [ev.title, ev.venue, ev.address, ev.city, ev.category].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  }

  function updateCounter(n){
    resultCountEl.textContent = n===1 ? '1 evento trovato' : `${n} eventi trovati`;
  }

  function render(){
    clearMarkers();
    const filtered = items.filter(passFilters);
    filtered.forEach(ev=>{
      const m = L.circleMarker([ev.coords.lat, ev.coords.lng], {radius:8, color:'#22b3f0', fillColor:'#22b3f0', fillOpacity:0.9});
      m.bindPopup(`<b>${ev.title}</b><br>${ev.date} ${ev.time}<br>${ev.venue}, ${ev.city}<br><span class="small">${ev.price} · ${ev.category}</span>`);
      m.addTo(MAP); markers.push(m);
    });
    if(filtered.length>0){
      const group = filtered.map(ev => [ev.coords.lat, ev.coords.lng]);
      const bounds = L.latLngBounds(group);
      MAP.fitBounds(bounds.pad(0.2));
    }
    updateCounter(filtered.length);
    if(filtered.length===0 && prevCount!==0){
      alert("La combinazione corrente di filtri ha prodotto zero risultati. Prova a cambiare lo zoom o sposta la mappa su un'altra zona, oppure modifica i filtri selezionati.");
    }
    prevCount = filtered.length;
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      MAP.setView([pos.coords.latitude, pos.coords.longitude], 13);
      L.circle([pos.coords.latitude, pos.coords.longitude], {radius: 200, color:'#22b3f0'}).addTo(MAP);
    });
  }

  loadEvents();
})();
