// index.js — Landing page logic

// ─── Splash Screen Logic ─────────────────────────────────────────────────────
(function initSplash() {
  const splash = document.getElementById('splash-screen');
  const statusText = document.getElementById('splash-status-text');

  const alreadyShown = sessionStorage.getItem('splash-shown');

  if (alreadyShown) {
    if (splash) { splash.style.display = 'none'; }
    return;
  }

  sessionStorage.setItem('splash-shown', '1');

  // Mostrar versión actual
  const verText = document.getElementById('splash-ver-text');
  const updateHint = document.getElementById('splash-update-hint');
  const spinner = document.getElementById('splash-spinner');

  let currentVersion = '';

  if (window.api && window.api.getAppVersion) {
    window.api.getAppVersion().then(v => {
      currentVersion = v;
      if (verText) verText.textContent = `v${v} — versión actual`;
    });
  }

  if (window.api && window.api.onUpdaterVersion) {
    window.api.onUpdaterVersion((newVer) => {
      if (verText) verText.textContent = `v${currentVersion} → v${newVer} disponible`;
      if (updateHint) {
        updateHint.style.display = 'block';
        updateHint.textContent = 'Descargando... se instalará al reiniciar';
      }
    });
  }

  const statusMessages = {
    'checking':      'Buscando actualizaciones...',
    'available':     '¡Nueva versión encontrada!',
    'not-available': 'Todo al día ✓',
    'error':         'Sin conexión — no se pudo verificar'
  };

  if (window.api && window.api.onUpdaterStatus) {
    window.api.onUpdaterStatus((status) => {
      if (statusText && statusMessages[status]) {
        statusText.textContent = statusMessages[status];
      }
      if (status === 'not-available') {
        if (spinner) spinner.style.display = 'none';
        if (verText && currentVersion) verText.textContent = `v${currentVersion} — última versión ✓`;
      }
      if (status === 'error') {
        if (spinner) spinner.style.display = 'none';
        if (updateHint) {
          updateHint.style.display = 'block';
          updateHint.textContent = '↗ Descargar manualmente: github.com/5duardo/Games-Studio/releases';
        }
      }
    });
  }

  const SPLASH_MIN_MS = 2200;
  const start = Date.now();

  function hideSplash() {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, SPLASH_MIN_MS - elapsed);
    setTimeout(() => {
      if (splash) splash.classList.add('hidden');
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash);
  }
})();

// ─── Window controls ─────────────────────────────────────────────────────────
document.getElementById('btn-minimize').addEventListener('click', () => window.api.minimize());
document.getElementById('btn-maximize').addEventListener('click', () => window.api.maximize());
document.getElementById('btn-close').addEventListener('click', () => window.api.close());

// Navigation
document.getElementById('card-quiz').addEventListener('click', () => {
  window.api.navigate('lobby.html');
});
