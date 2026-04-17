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

  const statusMessages = {
    'checking':      'Buscando actualizaciones...',
    'available':     'Actualización disponible',
    'not-available': 'Todo al día ✓',
    'error':         'Sin conexión'
  };

  if (window.api && window.api.onUpdaterStatus) {
    window.api.onUpdaterStatus((status) => {
      if (statusText && statusMessages[status]) {
        statusText.textContent = statusMessages[status];
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
