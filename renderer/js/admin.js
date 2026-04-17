// admin.js — Admin Panel Logic

// ─── SVG ICON LIBRARY (inline, no external dependency) ─────────────────────
const SVG_ICONS = {
  'trophy':        '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  'rocket':        '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  'zap':           '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'star':          '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'gem':           '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
  'shield':        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'crown':         '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>',
  'flame':         '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  'sparkles':      '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  'music':         '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  'joystick':      '<path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2z"/><path d="M6 15v-2"/><path d="M12 15V9"/><circle cx="12" cy="6" r="3"/>',
  'paw-print':     '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="4" r="2"/><circle cx="6" cy="13" r="2"/><circle cx="18" cy="13" r="2"/><path d="M13 7.5L13 9a3 3 0 0 0 3 3 3 3 0 0 1 3 3v1.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 7 17.5V16a3 3 0 0 1 3-3 3 3 0 0 0 3-3V7.5"/>',
  'dribbble':      '<circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>',
  'bird':          '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',
  'clover':        '<path d="M16.2 3.8a2.7 2.7 0 0 0-3.81 0l-.4.38-.4-.4a2.7 2.7 0 0 0-3.82 0C6.73 4.85 6.67 6.64 8 8l4 4 4-4c1.33-1.36 1.27-3.15.2-4.2z"/><path d="M8 8c-1.36 1.33-3.15 1.27-4.2.2a2.7 2.7 0 0 1 0-3.81l.38-.4-.4-.4a2.7 2.7 0 0 1 3.82-3.82l.4.38.4-.4"/><path d="M16 8c1.36 1.33 3.15 1.27 4.2.2a2.7 2.7 0 0 0 0-3.81l-.38-.4.4-.4a2.7 2.7 0 0 0-3.82-3.82l-.4.38-.4-.4"/><path d="M12 12v9"/><path d="M8 22h8"/>',
  'gamepad-2':     '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="17" y1="12" y2="12"/><rect height="10" rx="7" width="20" x="2" y="7"/><path d="M6 4h.01M18 4h.01"/>',
  // Category icons
  'book-open':     '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'ruler':         '<path d="M5 8 10 3"/><path d="M14 21 21 14"/><path d="M3 21 21 3"/><path d="m9 5 2 2"/><path d="m13 9 2 2"/><path d="m10 7 2 2"/><path d="m7 10 2 2"/><path d="m4 13 2 2"/>',
  'microscope':    '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  'globe':         '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'palette':       '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  'brain':         '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
  'briefcase':     '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'laptop':        '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  'clapperboard':  '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 3.9"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  'puzzle':        '<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.087-.888.484-.981.877-.187.862-1.043 1.488-1.92 1.332C4.33 20.133 3 18.954 3 17.5V5a2 2 0 0 1 2-2h12.5c1.454 0 2.633 1.33 2.668 2.572-.075.463-.356.897-.729 1.278z"/>',
  'scroll':        '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/>',
  'pizza':         '<path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/>',
  'message-circle':'<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>',
  'car':           '<path d="M19 17H5v-7l2-4h10l2 4v7z"/><path d="M3 17h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  'plane':         '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  // Utility
  'plus':          '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'trash-2':       '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'settings':      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'help-circle':   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  'sun':           '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  'moon':          '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'check-circle':  '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'x-circle':      '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  'circle':        '<circle cx="12" cy="12" r="10"/>',
  'home':          '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'database':      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  'play':          '<polygon points="5 3 19 12 5 21 5 3"/>',
  'door-open':     '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
  'book':          '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  'users':         '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'type':          '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  'aperture':      '<circle cx="12" cy="12" r="10"/><line x1="14.31" x2="20.05" y1="8" y2="17.94"/><line x1="9.69" x2="21.17" y1="8" y2="8"/><line x1="7.38" x2="13.12" y1="12" y2="2.06"/><line x1="9.69" x2="3.95" y1="16" y2="6.06"/><line x1="14.31" x2="2.83" y1="16" y2="16"/><line x1="16.62" x2="10.88" y1="12" y2="21.94"/>',
};

// Helper: returns an <svg> string for a named icon, colored appropriately
function getSvg(name, size = 20, color = 'currentColor') {
  const paths = SVG_ICONS[name] || SVG_ICONS['help-circle'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// Map old emoji keys → icon names (for legacy data)
window.getLucideIcon = (str) => {
  const map = {
    '🏆': 'trophy', '🚀': 'rocket', '⚡': 'zap', '🌟': 'star', '💎': 'gem',
    '🦁': 'paw-print', '🐉': 'bird', '🦅': 'bird', '🍀': 'clover', '🎮': 'gamepad-2',
    '⚽': 'dribbble', '🎸': 'music', '🕹': 'joystick', '🛡': 'shield', '👑': 'crown', '🔥': 'flame',
    '📚': 'book-open', '📐': 'ruler', '🔬': 'microscope', '🌍': 'globe', '🎨': 'palette',
    '🎵': 'music-2', '🧠': 'brain', '💼': 'briefcase', '💻': 'laptop', '🎬': 'clapperboard',
    '🧩': 'puzzle', '📜': 'scroll', '🍔': 'pizza', '🗣': 'message-circle', '🚗': 'car', '✈️': 'plane',
    '🔵': 'circle', '🔴': 'circle',
  };
  return map[str] || str || 'help-circle';
};

// ─── ICON SETS ────────────────────────────────────────────────────────────────
const TEAM_ICONS = ['trophy', 'rocket', 'zap', 'star', 'gem', 'shield', 'crown', 'flame', 'sparkles', 'gamepad-2', 'music', 'joystick', 'paw-print', 'bird', 'clover', 'dribbble'];
const CAT_ICONS  = ['book-open', 'ruler', 'microscope', 'globe', 'palette', 'brain', 'briefcase', 'laptop', 'clapperboard', 'puzzle', 'scroll', 'pizza', 'message-circle', 'car', 'plane', 'music'];
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#22d3a3', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4'];

let teams = [];
let categories = [];
let currentSelection = { type: null, id: null };
let editingQuestionId = null;

let creationMode = null;
let selectedCreationIcon = '';
let selectedCreationColor = COLORS[0];
let selectedItemIcon = '';
let selectedItemColor = '';

// ─── INIT ─────────────────────────────────────────────────────────────────────
async function init() {
  await loadData();

  if (teams.length === 0) {
    await window.api.createTeam({ name: 'Equipo Rojo', icon: 'rocket',  color: '#ef4444' });
    await window.api.createTeam({ name: 'Equipo Azul', icon: 'shield',  color: '#3b82f6' });
    await loadData();
    showToast('Equipos predeterminados creados ✓');
  }

  renderSidebar();
  initColorPickers();
}

async function loadData() {
  teams      = await window.api.getTeams();
  categories = await window.api.getCategories();
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function renderSidebar() {
  const teamsList = document.getElementById('teams-list');
  teamsList.innerHTML = '';
  teams.forEach(t => teamsList.appendChild(createListItem(t, 'team')));

  const catsList = document.getElementById('cats-list');
  catsList.innerHTML = '';
  categories.forEach(c => catsList.appendChild(createListItem(c, 'cat')));
}

function createListItem(item, type) {
  const div = document.createElement('div');
  const isSelected = currentSelection.type === type && currentSelection.id === item.id;
  div.className = 'list-item' + (isSelected ? ' active' : '');
  div.dataset.id = item.id;

  const desc = type === 'cat' ? `${item.questions.length} preg.` : 'Jugador';
  const iconName = window.getLucideIcon(item.icon);

  div.innerHTML = `
    <div class="item-color-dot" style="background:${item.color}"></div>
    <div class="item-icon" style="color:${item.color}">${getSvg(iconName, 20, item.color)}</div>
    <div class="item-info">
      <div class="item-name">${escapeHtml(item.name)}</div>
      <div class="item-desc">${desc}</div>
    </div>
    <button class="item-delete" title="Eliminar">✕</button>
  `;

  div.addEventListener('click', (e) => {
    if (e.target.classList.contains('item-delete')) return confirmDelete(type, item);
    selectItem(type, item.id);
  });

  return div;
}

// ─── SELECTION ────────────────────────────────────────────────────────────────
function selectItem(type, id) {
  currentSelection = { type, id };
  const item = type === 'team' ? teams.find(t => t.id === id) : categories.find(c => c.id === id);
  if (!item) return;

  renderSidebar();

  document.getElementById('no-item-placeholder').style.display = 'none';
  document.getElementById('main-header').style.display = 'flex';
  document.getElementById('main-body').style.display = 'block';

  const iconEl = document.getElementById('header-icon');
  iconEl.innerHTML = getSvg(window.getLucideIcon(item.icon), 28, item.color);

  document.getElementById('header-name').textContent = item.name;
  document.getElementById('header-desc').textContent = type === 'team' ? 'Ajustes del Equipo' : `${item.questions.length} preguntas en esta categoría`;

  document.getElementById('item-name-input').value = item.name;
  selectedItemIcon  = item.icon;
  selectedItemColor = item.color;

  initIconPicker('icon-picker', type === 'team' ? TEAM_ICONS : CAT_ICONS, selectedItemIcon, (icon) => {
    selectedItemIcon = icon;
    updateIconPicker('icon-picker', icon, selectedItemColor);
  });
  updateColorPicker('color-picker', selectedItemColor);

  const tabQ = document.getElementById('tab-btn-questions');
  const btnAddQ = document.getElementById('btn-add-question');

  if (type === 'cat') {
    tabQ.classList.remove('hidden');
    btnAddQ.classList.remove('hidden');
    switchTab('questions');
    renderQuestions(item);
  } else {
    tabQ.classList.add('hidden');
    btnAddQ.classList.add('hidden');
    switchTab('settings');
  }
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));
}
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

// ─── PICKERS ──────────────────────────────────────────────────────────────────
function initIconPicker(containerId, iconsArray, selected, onSelect) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  iconsArray.forEach(icon => {
    const opt = document.createElement('div');
    opt.className = 'icon-option' + (icon === selected ? ' selected' : '');
    opt.dataset.icon = icon;
    const color = (containerId === 'creation-icon-picker') ? selectedCreationColor : selectedItemColor;
    opt.innerHTML = getSvg(icon, 20, icon === selected ? color : 'currentColor');
    opt.title = icon;

    opt.addEventListener('click', () => {
      onSelect(icon);
    });

    container.appendChild(opt);
  });
}

function updateIconPicker(containerId, selectedIcon, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.icon-option').forEach(opt => {
    const icon = opt.dataset.icon;
    const isSelected = icon === selectedIcon;
    opt.classList.toggle('selected', isSelected);
    opt.innerHTML = getSvg(icon, 20, isSelected ? (color || 'currentColor') : 'currentColor');
  });
}

function initColorPickers() {
  ['creation-color-picker', 'color-picker'].forEach(id => {
    const container = document.getElementById(id);
    container.innerHTML = '';
    COLORS.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.background = color;
      swatch.dataset.color = color;
      swatch.addEventListener('click', () => {
        if (id === 'creation-color-picker') {
          selectedCreationColor = color;
          updateColorPicker(id, color);
          updateIconPicker('creation-icon-picker', selectedCreationIcon, color);
        } else {
          selectedItemColor = color;
          updateColorPicker(id, color);
          updateIconPicker('icon-picker', selectedItemIcon, color);
        }
      });
      container.appendChild(swatch);
    });
  });
}

function updateColorPicker(id, color) {
  document.getElementById(id).querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', s.dataset.color === color);
  });
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────
function openCreationModal(type) {
  creationMode = type;
  document.getElementById('creation-title').textContent = type === 'team' ? 'Nuevo Equipo' : 'Nueva Categoría';
  document.getElementById('creation-name').value = '';

  selectedCreationIcon  = type === 'team' ? TEAM_ICONS[0] : CAT_ICONS[0];
  selectedCreationColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  initIconPicker('creation-icon-picker', type === 'team' ? TEAM_ICONS : CAT_ICONS, selectedCreationIcon, (icon) => {
    selectedCreationIcon = icon;
    updateIconPicker('creation-icon-picker', icon, selectedCreationColor);
  });
  updateColorPicker('creation-color-picker', selectedCreationColor);

  document.getElementById('modal-creation').classList.remove('hidden');
  setTimeout(() => document.getElementById('creation-name').focus(), 150);
}

async function createItem() {
  const name = document.getElementById('creation-name').value.trim();
  if (!name) { showToast('El nombre es obligatorio', 'error'); return; }

  let newItem;
  if (creationMode === 'team') {
    newItem = await window.api.createTeam({ name, icon: selectedCreationIcon, color: selectedCreationColor });
  } else {
    newItem = await window.api.createCategory({ name, icon: selectedCreationIcon, color: selectedCreationColor });
  }

  await loadData();
  document.getElementById('modal-creation').classList.add('hidden');
  selectItem(creationMode, newItem.id);
  showToast(`${creationMode === 'team' ? 'Equipo' : 'Categoría'} creado ✓`);
}

async function saveItem() {
  const name = document.getElementById('item-name-input').value.trim();
  if (!name) { showToast('Nombre no puede estar vacío', 'error'); return; }

  if (currentSelection.type === 'team') {
    await window.api.updateTeam(currentSelection.id, { name, icon: selectedItemIcon, color: selectedItemColor });
  } else {
    await window.api.updateCategory(currentSelection.id, { name, icon: selectedItemIcon, color: selectedItemColor });
  }

  await loadData();
  selectItem(currentSelection.type, currentSelection.id);
  showToast('Cambios guardados ✓');
}

async function confirmDelete(type, item) {
  if (!confirm(`¿Eliminar "${item.name}" definitivamente?`)) return;
  if (type === 'team') await window.api.deleteTeam(item.id);
  else await window.api.deleteCategory(item.id);

  await loadData();
  if (currentSelection.id === item.id) {
    currentSelection = { type: null, id: null };
    document.getElementById('no-item-placeholder').style.display = 'flex';
    document.getElementById('main-header').style.display = 'none';
    document.getElementById('main-body').style.display = 'none';
  }
  renderSidebar();
  showToast('Eliminado');
}

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
function renderQuestions(cat) {
  const list = document.getElementById('questions-list');
  const empty = document.getElementById('no-questions');
  list.innerHTML = '';
  document.getElementById('q-count-badge').textContent = cat.questions.length;

  if (cat.questions.length === 0) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  const letters = ['A', 'B', 'C', 'D'];
  cat.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question-card animate-fade-in-up';
    card.innerHTML = `
      <div class="question-number">${idx + 1}</div>
      <div class="question-body">
        <div class="question-text">${escapeHtml(q.text)}</div>
        <div class="question-options">
          ${q.options.map((opt, oi) => opt ? `<div class="option-chip ${oi === q.correct ? 'correct' : ''}"><strong>${letters[oi]}.</strong> ${escapeHtml(opt)}</div>` : '').join('')}
        </div>
      </div>
      <div class="question-actions">
        <button class="btn btn-ghost btn-icon btn-sm" title="Editar">${getSvg('settings', 16)}</button>
        <button class="btn btn-danger btn-icon btn-sm" title="Eliminar">${getSvg('trash-2', 16, '#ef4444')}</button>
      </div>
    `;
    card.querySelector('[title="Editar"]').addEventListener('click', () => openQuestionModal(q));
    card.querySelector('[title="Eliminar"]').addEventListener('click', () => deleteQuestion(q.id));
    list.appendChild(card);
  });
}

function openQuestionModal(q = null) {
  editingQuestionId = q ? q.id : null;
  document.getElementById('modal-q-title').textContent = q ? 'Editar Pregunta' : 'Nueva Pregunta';
  document.getElementById('q-text').value = q ? q.text : '';
  document.getElementById('q-opt-a').value = q ? q.options[0] : '';
  document.getElementById('q-opt-b').value = q ? q.options[1] : '';
  document.getElementById('q-opt-c').value = q ? (q.options[2] || '') : '';
  document.getElementById('q-opt-d').value = q ? (q.options[3] || '') : '';
  document.getElementById('q-correct').value = q ? q.correct : '0';
  document.getElementById('modal-question').classList.remove('hidden');
  setTimeout(() => document.getElementById('q-text').focus(), 150);
}

async function saveQuestion() {
  const text = document.getElementById('q-text').value.trim();
  const options = [
    document.getElementById('q-opt-a').value.trim(),
    document.getElementById('q-opt-b').value.trim(),
    document.getElementById('q-opt-c').value.trim(),
    document.getElementById('q-opt-d').value.trim()
  ];
  const correct = parseInt(document.getElementById('q-correct').value);

  if (!text || !options[0] || !options[1]) {
    showToast('Pregunta y opciones A/B son obligatorias', 'error'); return;
  }

  if (editingQuestionId) {
    await window.api.updateQuestion(currentSelection.id, editingQuestionId, { text, options, correct });
    showToast('Pregunta actualizada');
  } else {
    await window.api.addQuestion(currentSelection.id, { text, options, correct });
    showToast('Pregunta agregada');
  }

  await loadData();
  document.getElementById('modal-question').classList.add('hidden');
  selectItem('cat', currentSelection.id);
}

async function deleteQuestion(qId) {
  if (!confirm('¿Eliminar esta pregunta?')) return;
  await window.api.deleteQuestion(currentSelection.id, qId);
  await loadData();
  selectItem('cat', currentSelection.id);
}

function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ─── EVENTS ───────────────────────────────────────────────────────────────────
document.getElementById('btn-minimize').addEventListener('click', () => window.api.minimize());
document.getElementById('btn-maximize').addEventListener('click', () => window.api.maximize());
document.getElementById('btn-close').addEventListener('click', () => window.api.close());

document.getElementById('btn-back').addEventListener('click', () => window.api.navigate('index.html'));

document.getElementById('btn-add-team').addEventListener('click', () => openCreationModal('team'));
document.getElementById('btn-add-cat').addEventListener('click', () => openCreationModal('cat'));
document.getElementById('btn-add-question').addEventListener('click', () => openQuestionModal());

document.getElementById('creation-close').addEventListener('click', () => document.getElementById('modal-creation').classList.add('hidden'));
document.getElementById('creation-cancel').addEventListener('click', () => document.getElementById('modal-creation').classList.add('hidden'));
document.getElementById('creation-save').addEventListener('click', createItem);

document.getElementById('btn-save-item').addEventListener('click', saveItem);
document.getElementById('btn-delete-item').addEventListener('click', () => confirmDelete(currentSelection.type, {id: currentSelection.id, name: document.getElementById('item-name-input').value}));

document.getElementById('modal-q-close').addEventListener('click', () => document.getElementById('modal-question').classList.add('hidden'));
document.getElementById('modal-q-cancel').addEventListener('click', () => document.getElementById('modal-question').classList.add('hidden'));
document.getElementById('modal-q-save').addEventListener('click', saveQuestion);

init();

