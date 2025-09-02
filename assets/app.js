
(function(){
  var MAP = L.map('map').setView([45.0703, 7.6869], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(MAP);

  var markers = [];
  var items = [];
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var pills = Array.prototype.slice.call(document.querySelectorAll('.pill'));
  var selDataBtn = document.getElementById('selData');
  var dateBadge = selDataBtn ? selDataBtn.querySelector('.date-badge') : null;
  var searchInput = document.getElementById('searchInput');
  var resultCountEl = document.getElementById('resultCount');
  var dateModal = document.getElementById('dateModal');
  var dateInput = document.getElementById('dateInput');
  var dateOk = document.getElementById('dateOk');
  var dateCancel = document.getElementById('dateCancel');

  function parseISO(s){ var a=s.split('-'); return new Date(+a[0], a[1]-1, +a[2]); }
  function isSame(d1,d2){ return d1.getFullYear()==d2.getFullYear() && d1.getMonth()==d2.getMonth() && d1.getDate()==d2.getDate(); }
  function isWeekend(d){ var wd=d.getDay(); return (wd===5||wd===6||wd===0); }

  var selectedDate = null;
  var selectedCats = {};
  var prevCount = -1;

  chips.forEach(function(ch){
    ch.addEventListener('click', function(){
      ch.classList.toggle('active');
      var cat = ch.getAttribute('data-cat');
      if(ch.classList.contains('active')) selectedCats[cat]=true; else delete selectedCats[cat];
      render();
    });
  });

  pills.forEach(function(p){
    p.addEventListener('click', function(){
      var t = p.getAttribute('data-day');
      if(t === 'oggi'){
        selectedDate = new Date();
        if(dateBadge){ dateBadge.textContent = selectedDate.toLocaleDateString('it-IT'); dateBadge.style.display='inline-block'; }
      } else if(t === 'domani'){
        selectedDate = new Date(Date.now()+86400000);
        if(dateBadge){ dateBadge.textContent = selectedDate.toLocaleDateString('it-IT'); dateBadge.style.display='inline-block'; }
      } else if(t === 'weekend'){
        selectedDate = 'WEEKEND';
        if(dateBadge){ dateBadge.textContent = 'Weekend'; dateBadge.style.display='inline-block'; }
      }
      render();
    });
  });

  if(selDataBtn){
    selDataBtn.addEventListener('click', function(){
      dateModal.style.display='flex';
      dateInput.value = '';
      dateInput.focus();
    });
  }
  if(dateCancel) dateCancel.addEventListener('click', function(){ dateModal.style.display='none'; });
  if(dateOk) dateOk.addEventListener('click', function(){
    if(dateInput.value){
      var d = parseISO(dateInput.value);
      selectedDate = d;
      if(dateBadge){ dateBadge.textContent = d.toLocaleDateString('it-IT'); dateBadge.style.display = 'inline-block'; }
      dateModal.style.display='none';
      render();
    } else {
      dateModal.style.display='none';
    }
  });

  if(searchInput) searchInput.addEventListener('input', render);

  function loadEvents(){
    return fetch('assets/events.json').then(function(r){ return r.json(); }).then(function(js){
      items = js; render();
    });
  }

  function clearMarkers(){ markers.forEach(function(m){ MAP.removeLayer(m); }); markers.length=0; }

  function passFilters(ev){
    var catActive = Object.keys(selectedCats);
    if(catActive.length>0 && !selectedCats[ev.category]) return false;
    var evDate = new Date(ev.date);
    if(selectedDate === 'WEEKEND'){ if(!isWeekend(evDate)) return false; }
    else if(selectedDate instanceof Date){ if(!isSame(evDate, selectedDate)) return false; }
    var q = (searchInput && searchInput.value || '').trim().toLowerCase();
    if(q){
      var hay = [ev.title, ev.venue, ev.address, ev.city, ev.category].join(' ').toLowerCase();
      if(hay.indexOf(q)===-1) return false;
    }
    return true;
  }

  function render(){
    clearMarkers();
    var filtered = items.filter(passFilters);
    filtered.forEach(function(ev){
      var m = L.circleMarker([ev.coords.lat, ev.coords.lng], {radius:8, color:'#22b3f0', fillColor:'#22b3f0', fillOpacity:0.9});
      m.bindPopup('<b>'+ev.title+'</b><br>'+ev.date+' '+ev.time+'<br>'+ev.venue+', '+ev.city+'<br><span class="small">'+ev.price+' · '+ev.category+'</span>');
      m.addTo(MAP); markers.push(m);
    });
    updateCounterInView();
  }

  function updateCounterInView(){
    var b = MAP.getBounds();
    var n = markers.filter(function(m){ return b.contains(m.getLatLng()); }).length;
    resultCountEl.textContent = (n===1? '1 evento trovato' : n+' eventi trovati');
    if(n===0 && prevCount!==0){
      alert("La combinazione corrente di filtri ha prodotto zero risultati. Prova a cambiare lo zoom o sposta la mappa su un'altra zona, oppure modifica i filtri selezionati.");
    }
    prevCount = n;
  }

  MAP.on('moveend zoomend', updateCounterInView);

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      MAP.setView([pos.coords.latitude, pos.coords.longitude], 11);
      L.circle([pos.coords.latitude, pos.coords.longitude], {radius: 200, color:'#22b3f0'}).addTo(MAP);
      updateCounterInView();
    });
  }

  loadEvents();
})();
