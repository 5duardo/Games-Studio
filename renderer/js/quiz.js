// quiz.js — Game Flow (Multijugador: Team -> Opción -> Veredicto)

const LETTERS = ['A', 'B', 'C', 'D'];

let settings = {};
let allTeams = [];
let playingTeams = []; // [{ id, name, icon, color, score }]
let questionPool = []; // [{ catName, catIcon, text, options, correct, timeLimit }]
let currentQIndex = 0;
let currentQuestion = null;

let timerInterval = null;
let timerSeconds = 0;

let answeringTeam = null; // Team Object that was selected to answer

async function init() {
  const data = await window.api.getData();
  allTeams = data.teams || [];
  settings = data.settings || { timerEnabled: true, defaultTimeLimit: 30 };
  
  const rawConfig = sessionStorage.getItem('gameConfig');
  if (!rawConfig) { window.api.navigate('lobby.html'); return; }
  
  const config = JSON.parse(rawConfig);
  
  // Setup Teams
  playingTeams = config.teamIds.map(tId => {
    const t = allTeams.find(x => x.id === tId);
    return { ...t, score: 0 };
  });

  // Setup Questions
  const allCats = data.categories || [];
  config.catIds.forEach(catId => {
    const cat = allCats.find(c => c.id === catId);
    if(cat) {
      cat.questions.forEach(q => {
        questionPool.push({
          catName: cat.name,
          catIcon: cat.icon,
          ...q
        });
      });
    }
  });

  // Shuffle Questions
  questionPool = questionPool.sort(() => Math.random() - 0.5);

  if (questionPool.length === 0) {
    alert("Error: No hay preguntas que jugar.");
    window.api.navigate('lobby.html');
    return;
  }

  buildAwardButtons();
  updateLeaderboard();
  startNextQuestion();
}

function buildAwardButtons() {
  const container = document.getElementById('team-buttons');
  container.innerHTML = '';
  playingTeams.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'award-btn';
    btn.style.borderColor = t.color;
    btn.innerHTML = `<i data-lucide="${window.getLucideIcon(t.icon)}" style="width:18px;height:18px;"></i> ${escapeHtml(t.name)}`;
    
    // Hover dinámico
    btn.addEventListener('mouseenter', () => { btn.style.background = t.color; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(255,255,255,0.05)'; });

    btn.addEventListener('click', () => selectTeamToAnswer(t));
    container.appendChild(btn);
  });
  if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons, root: container });
}

function updateLeaderboard() {
  playingTeams.sort((a,b) => b.score - a.score);
  const list = document.getElementById('lb-list');
  list.innerHTML = '';

  playingTeams.forEach((t, index) => {
    const rank = index + 1;
    const el = document.createElement('div');
    el.className = 'lb-item';
    el.dataset.rank = rank;
    el.style.setProperty('--team-color', t.color);
    
    el.innerHTML = `
      <div class="lb-rank">${rank}</div>
      <div class="lb-info">
        <div class="lb-name">${escapeHtml(t.name)}</div>
      </div>
      <div class="lb-score" style="color:${t.color}">${t.score}</div>
    `;
    list.appendChild(el);
  });
  if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons, root: list });
}

function startNextQuestion() {
  if (currentQIndex >= questionPool.length) { endGame(); return; }

  currentQuestion = questionPool[currentQIndex];
  answeringTeam = null;
  
  // Update Header
  document.getElementById('cat-info').innerHTML = `<i data-lucide="${window.getLucideIcon(currentQuestion.catIcon)}" style="width:24px;height:24px;"></i> <span class="game-cat-name">${escapeHtml(currentQuestion.catName)}</span>`;
  document.getElementById('progress-info').textContent = `Pregunta ${currentQIndex + 1} de ${questionPool.length}`;
  if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons, root: document.getElementById('cat-info') });

  const qa = document.querySelector('.question-area');
  qa.classList.remove('animate-fade-in-up');
  void qa.offsetWidth; // Reflow reset
  qa.classList.add('animate-fade-in-up');

  // Reset UI: Show Team buttons, Hide Overlay
  document.getElementById('q-text').textContent = currentQuestion.text;
  document.getElementById('team-buttons').classList.remove('hidden');
  document.getElementById('action-hint').classList.add('hidden');
  document.getElementById('controls-title').textContent = "¿Qué equipo responderá?";
  document.getElementById('btn-nobody').classList.remove('hidden');

  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';
  optionsGrid.classList.remove('interactive'); // Not clickable yet
  
  const ops = currentQuestion.options.filter(o => o && o.trim() !== '');
  ops.forEach((opt, idx) => {
    const box = document.createElement('div');
    box.className = 'option-box';
    box.dataset.idx = idx;
    box.innerHTML = `
      <div class="option-letter">${LETTERS[idx]}</div>
      <div class="option-text">${escapeHtml(opt)}</div>
    `;
    // Add click event (only triggers if interactive class is present)
    box.addEventListener('click', () => {
      if (optionsGrid.classList.contains('interactive')) {
        evaluateOption(idx, box);
      }
    });
    optionsGrid.appendChild(box);
  });

  document.getElementById('verdict-overlay').classList.remove('active');

  // Start Timer
  startTimer(currentQuestion.timeLimit || settings.defaultTimeLimit || 30);
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  timerSeconds = seconds;
  if (!settings.timerEnabled) { document.getElementById('timer-container').style.display = 'none'; return; }
  
  document.getElementById('timer-container').style.display = 'flex';
  const ring = document.getElementById('timer-ring');
  const fill = document.getElementById('timer-fill');
  const text = document.getElementById('timer-text');
  const circumference = 113; 
  
  ring.classList.remove('timer-danger');
  fill.style.strokeDashoffset = 0;
  text.textContent = seconds;

  timerInterval = setInterval(() => {
    timerSeconds--;
    text.textContent = timerSeconds;
    const pct = (seconds - timerSeconds) / seconds;
    fill.style.strokeDashoffset = circumference * pct;

    if (timerSeconds <= 5) ring.classList.add('timer-danger');
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timeoutAction();
    }
  }, 1000);
}

function selectTeamToAnswer(team) {
  // Congelar timer
  clearInterval(timerInterval);
  answeringTeam = team;

  // Cambiar UI panel inferior
  document.getElementById('team-buttons').classList.add('hidden');
  document.getElementById('btn-nobody').classList.add('hidden');
  
  document.getElementById('controls-title').innerHTML = `Elige la respuesta de: ${escapeHtml(team.name)} <i data-lucide="${window.getLucideIcon(team.icon)}" style="width:24px;height:24px;"></i>`;
  document.getElementById('controls-title').style.color = team.color;
  document.getElementById('action-hint').classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons, root: document.getElementById('controls-title') });

  // Activar clics en opciones
  document.getElementById('options-grid').classList.add('interactive');
}

function evaluateOption(selectedIdx, boxElement) {
  // Desactivar clics
  document.getElementById('options-grid').classList.remove('interactive');
  
  const isCorrect = (selectedIdx === currentQuestion.correct);
  
  // Iluminar opciones
  document.querySelectorAll('.option-box').forEach(box => {
    const idx = parseInt(box.dataset.idx);
    if (idx === currentQuestion.correct) box.classList.add('revealed-correct');
    else box.classList.add('dimmed');
  });

  // Si acertó, sumar punto
  if (isCorrect) {
    answeringTeam.score += 1;
    updateLeaderboard();
  }

  // Cargar Veredicto Gigante
  showVerdictOverlay(isCorrect, answeringTeam);
}

function timeoutAction() {
  // Si nadie respondió, mostrar correcta y pasar
  document.querySelectorAll('.option-box').forEach(box => {
    const idx = parseInt(box.dataset.idx);
    if (idx === currentQuestion.correct) box.classList.add('revealed-correct');
    else box.classList.add('dimmed');
  });
  document.getElementById('team-buttons').classList.add('hidden');
  document.getElementById('btn-nobody').classList.add('hidden');
  document.getElementById('controls-title').textContent = "¡Tiempo Agotado!";
  document.getElementById('action-hint').classList.remove('hidden');
  document.getElementById('action-hint').textContent = "Visualiza la respuesta correcta. Presiona 'Saltar' para avanzar.";
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-super';
  nextBtn.style.marginTop = '16px';
  nextBtn.textContent = 'Siguiente Pregunta →';
  nextBtn.onclick = () => { nextBtn.remove(); nextQuestionFlow(); };
  document.getElementById('game-controls').appendChild(nextBtn);
}

function showVerdictOverlay(isCorrect, team) {
  const overlay = document.getElementById('verdict-overlay');
  const bgClass = isCorrect ? 'verdict-bg-correct' : 'verdict-bg-incorrect';
  
  overlay.className = `verdict-overlay active ${bgClass}`;
  document.getElementById('verdict-icon').innerHTML = isCorrect ? '<i data-lucide="check-circle" style="width:120px;height:120px;"></i>' : '<i data-lucide="x-circle" style="width:120px;height:120px;"></i>';
  document.getElementById('verdict-title').textContent = isCorrect ? '¡CORRECTO!' : '¡INCORRECTO!';
  
  const subtitle = isCorrect 
    ? `¡Punto para ${escapeHtml(team.name)}! <i data-lucide="${window.getLucideIcon(team.icon)}" style="width:28px;height:28px;"></i>` 
    : `Oportunidad perdida para ${escapeHtml(team.name)}`;
  document.getElementById('verdict-subtitle').innerHTML = subtitle;

  if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons, root: overlay });
}

function nextQuestionFlow() {
  document.getElementById('controls-title').style.color = '';
  currentQIndex++;
  startNextQuestion();
}

function disableTimerAndSkip() {
  clearInterval(timerInterval);
  nextQuestionFlow();
}

function endGame() {
  sessionStorage.setItem('gameResults', JSON.stringify(playingTeams));
  window.api.navigate('results.html');
}

function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Events
document.getElementById('btn-minimize').addEventListener('click', () => window.api.minimize());
document.getElementById('btn-maximize').addEventListener('click', () => window.api.maximize());
document.getElementById('btn-close').addEventListener('click', () => window.api.close());

document.getElementById('btn-quit').addEventListener('click', () => {
  if (confirm("¿Seguro que deseas abandonar la partida actual?")) window.api.navigate('lobby.html');
});

document.getElementById('btn-nobody').addEventListener('click', disableTimerAndSkip);
document.getElementById('btn-verdict-next').addEventListener('click', nextQuestionFlow);
document.getElementById('btn-end-game').addEventListener('click', () => {
  if (confirm("¿Estás seguro de que deseas terminar el juego ahora e ir a los resultados?")) {
    endGame();
  }
});

init();
