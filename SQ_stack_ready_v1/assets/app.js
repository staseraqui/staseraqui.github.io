
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

  function parseISO(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y, m-1, d); }
  function isSame(d1,d2){ return d1.getFullYear()==d2.getFullYear() && d1.getMonth()==d2.getMonth() && d1.getDate()==d2.getDate(); }
  function isWeekend(d){ const wd=d.getDay(); return (wd===5||wd===6||wd===0); }

  let selectedDate = null;
  let selectedCats = new Set();

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
      const inp = document.createElement('input');
      inp.type = 'date'; inp.style.position='fixed'; inp.style.opacity='0'; inp.style.pointerEvents='none';
      document.body.appendChild(inp);
      inp.addEventListener('change', ()=>{
        if(inp.value){
          const d = parseISO(inp.value);
          selectedDate = d;
          dateBadge.textContent = d.toLocaleDateString('it-IT');
          dateBadge.style.display = 'inline-block';
          render();
        }
        document.body.removeChild(inp);
      });
      inp.showPicker ? inp.showPicker() : inp.click();
    });
  }

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
    const evDate = parseISO(ev.date);
    if(selectedDate === 'WEEKEND'){ if(!isWeekend(evDate)) return false; }
    else if(selectedDate instanceof Date){ if(!isSame(evDate, selectedDate)) return false; }
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    if(q){
      const hay = [ev.title, ev.venue, ev.address, ev.city, ev.category].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  }

  function render(){
    clearMarkers();
    const filtered = items.filter(passFilters);
    if(filtered.length>0){
      const group = [];
      filtered.forEach(ev=>{
        const m = L.circleMarker([ev.coords.lat, ev.coords.lng], {radius:8, color:'#22b3f0', fillColor:'#22b3f0', fillOpacity:0.9});
        m.bindPopup(`<b>${ev.title}</b><br>${ev.date} ${ev.time}<br>${ev.venue}, ${ev.city}<br><span class="small">${ev.price} · ${ev.category}</span>`);
        m.addTo(MAP); markers.push(m); group.push([ev.coords.lat, ev.coords.lng]);
      });
      if(group.length>0){
        const bounds = L.latLngBounds(group);
        MAP.fitBounds(bounds.pad(0.2));
      }
    }
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      MAP.setView([pos.coords.latitude, pos.coords.longitude], 13);
      L.circle([pos.coords.latitude, pos.coords.longitude], {radius: 200, color:'#22b3f0'}).addTo(MAP);
    });
  }

  loadEvents();
})();
