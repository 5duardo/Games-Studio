// lobby.js — Configuración de la partida antes de iniciar

let teams = [];
let categories = [];

let selectedTeams = new Set();
let selectedCats = new Set();

async function init() {
  teams = await window.api.getTeams();
  categories = await window.api.getCategories();
  
  renderTeams();
  renderCats();
  updateSummary();
}

function renderTeams() {
  const list = document.getElementById('teams-list');
  list.innerHTML = '';
  
  if(teams.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i data-lucide="users" style="width:48px;height:48px;"></i></div><div class="empty-state-desc">No hay equipos creados. Ve a Administración.</div></div>';
    if(window.lucide) window.lucide.createIcons({ icons: window.lucide.icons });
    return;
  }
  
  teams.forEach(t => {
    const el = document.createElement('div');
    el.className = 'check-item';
    el.innerHTML = `
      <div class="check-box"></div>
      <div class="check-icon"><i data-lucide="${window.getLucideIcon(t.icon)}" style="width:24px;height:24px;"></i></div>
      <div class="check-info">
        <div class="check-title" style="color:${t.color}">${escapeHtml(t.name)}</div>
      </div>
    `;
    el.addEventListener('click', () => {
      if(selectedTeams.has(t.id)) selectedTeams.delete(t.id);
      else selectedTeams.add(t.id);
      el.classList.toggle('selected');
      updateSummary();
    });
    list.appendChild(el);
  });
  if(window.lucide) window.lucide.createIcons({root: list});
}

function renderCats() {
  const list = document.getElementById('cats-list');
  list.innerHTML = '';
  
  const validCats = categories.filter(c => c.questions.length > 0);
  
  if(validCats.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><i data-lucide="book-open" style="width:48px;height:48px;"></i></div><div class="empty-state-desc">No hay categorías con preguntas.</div></div>';
    if(window.lucide) window.lucide.createIcons({ icons: window.lucide.icons });
    return;
  }
  
  validCats.forEach(c => {
    const el = document.createElement('div');
    el.className = 'check-item';
    el.innerHTML = `
      <div class="check-box"></div>
      <div class="check-icon"><i data-lucide="${window.getLucideIcon(c.icon)}" style="width:24px;height:24px;"></i></div>
      <div class="check-info">
        <div class="check-title" style="color:${c.color}">${escapeHtml(c.name)}</div>
        <div class="check-desc">${c.questions.length} preguntas disponibles</div>
      </div>
    `;
    el.addEventListener('click', () => {
      if(selectedCats.has(c.id)) selectedCats.delete(c.id);
      else selectedCats.add(c.id);
      el.classList.toggle('selected');
      updateSummary();
    });
    list.appendChild(el);
  });
  if(window.lucide) window.lucide.createIcons({root: list});
}

function updateSummary() {
  document.getElementById('teams-count').textContent = `${selectedTeams.size}/${teams.length}`;
  const validCats = categories.filter(c => c.questions.length > 0);
  document.getElementById('cats-count').textContent = `${selectedCats.size}/${validCats.length}`;

  const btnStart = document.getElementById('btn-start');
  const summary = document.getElementById('summary-text');
  
  if(selectedTeams.size < 2) {
    btnStart.disabled = true;
    summary.textContent = "Selecciona al menos 2 equipos para competir.";
  } else if (selectedCats.size < 1) {
    btnStart.disabled = true;
    summary.textContent = "Selecciona al menos 1 categoría de preguntas.";
  } else {
    btnStart.disabled = false;
    
    // Count total questions available
    let totalQ = 0;
    Array.from(selectedCats).forEach(catId => {
      totalQ += categories.find(c => c.id === catId).questions.length;
    });
    
    summary.innerHTML = `Listo. <strong>${selectedTeams.size} equipos</strong> jugando con <strong>${totalQ} preguntas</strong> aleatorias.`;
  }
}

function startGame() {
  if(selectedTeams.size < 2 || selectedCats.size < 1) return;
  
  // Guardamos la config de esta sesión
  const sessionConfig = {
    teamIds: Array.from(selectedTeams),
    catIds: Array.from(selectedCats)
  };
  sessionStorage.setItem('gameConfig', JSON.stringify(sessionConfig));
  
  window.api.navigate('quiz.html');
}

function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('btn-minimize').addEventListener('click', () => window.api.minimize());
document.getElementById('btn-maximize').addEventListener('click', () => window.api.maximize());
document.getElementById('btn-close').addEventListener('click', () => window.api.close());
document.getElementById('btn-back').addEventListener('click', () => window.api.navigate('index.html'));
document.getElementById('btn-admin').addEventListener('click', () => window.api.navigate('admin.html'));
document.getElementById('btn-start').addEventListener('click', startGame);

init();
