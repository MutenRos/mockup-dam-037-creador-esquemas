(() => {
  const data = window.MOCKUP_DATA || {};
  const key = `mockup_${data.num || '000'}_visits`;
  const visits = (parseInt(localStorage.getItem(key) || '0', 10) + 1);
  localStorage.setItem(key, String(visits));

  const h = 150 + ((parseInt(data.num || '0', 10) * 17) % 170);
  document.documentElement.style.setProperty('--h', String(h));

  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.getAttribute('data-tab');
      document.getElementById(id)?.classList.add('active');
    });
  });

  const now = new Date();
  document.getElementById('buildBadge').textContent = `Build ${now.toLocaleString()} - lote ${Math.floor(Math.random() * 9000) + 1000}`;

  const kpis = [
    ['Visitas mockup', visits],
    ['Recursos detectados', (data.assets || []).length],
    ['Eventos base', (data.baseEvents || []).length],
    ['Sesion', Math.floor(Math.random() * 90) + 10 + ' min']
  ];
  document.getElementById('kpis').innerHTML = kpis.map(([k,v]) => `<div class="kpi"><div>${k}</div><b>${v}</b></div>`).join('');

  const pipelineSteps = [
    'Entrada de datos',
    'Validacion',
    'Procesamiento',
    'Salida y publicacion',
    'Seguimiento'
  ];
  const p = document.getElementById('pipeline');
  p.innerHTML = pipelineSteps.map((s, i) => `<li>${i + 1}. ${s} <strong>${Math.floor(Math.random() * 35) + 65}%</strong></li>`).join('');

  const feed = document.getElementById('feed');
  function randomFeed(count = 6) {
    const base = data.baseEvents && data.baseEvents.length ? data.baseEvents : ['Actividad registrada'];
    const out = [];
    for (let i = 0; i < count; i++) {
      const txt = base[Math.floor(Math.random() * base.length)];
      const when = new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString();
      out.push(`<li><strong>${when}</strong> - ${txt}</li>`);
    }
    feed.innerHTML = out.join('');
  }
  randomFeed();

  const rows = document.getElementById('simRows');
  function addRow(entity, action) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${new Date().toLocaleTimeString()}</td><td>${entity}</td><td>${action}</td>`;
    rows.prepend(tr);
  }
  addRow('sistema', 'inicializado');
  addRow('mockup', 'cargado');

  document.getElementById('btnGenerate').addEventListener('click', () => {
    randomFeed(8);
    toast('Nueva tanda generada');
  });
  document.getElementById('btnInsert').addEventListener('click', () => {
    addRow('evento-demo', 'insertado');
    toast('Evento demo insertado');
  });
  document.getElementById('btnReset').addEventListener('click', () => {
    rows.innerHTML = '';
    addRow('sistema', 'reiniciado');
    randomFeed(5);
    toast('Demo reiniciada');
  });

  document.getElementById('simForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const entity = String(fd.get('entity') || '').trim();
    const action = String(fd.get('action') || '').trim();
    if (!entity || !action) return;
    addRow(entity, action);
    e.target.reset();
    toast('Accion aplicada');
  });

  const list = document.getElementById('assetList');
  const assets = (data.assets || []).slice(0, 60);
  if (!assets.length) {
    list.innerHTML = '<div class="asset"><small>No hay assets detectados</small></div>';
  } else {
    list.innerHTML = assets.map((a) => {
      const f = encodeURIComponent(a.path);
      return `<div class="asset">
        <small>${a.path}</small>
        <a href="visor.html?f=${f}" target="_blank">Abrir en visor</a> |
        <a href="${a.path}" target="_blank">Abrir directo</a>
      </div>`;
    }).join('');
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1500);
  }
})();
