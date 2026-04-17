// settings.js

document.addEventListener('DOMContentLoaded', () => {
  const btnBack = document.getElementById('btn-back');
  const themeToggle = document.getElementById('theme-toggle');
  const langSelect = document.getElementById('language-select');
  const root = document.documentElement;

  // Window Controls
  document.getElementById('btn-minimize')?.addEventListener('click', () => {
    if (window.api) window.api.minimize();
  });
  document.getElementById('btn-maximize')?.addEventListener('click', () => {
    if (window.api) window.api.maximize();
  });
  document.getElementById('btn-close')?.addEventListener('click', () => {
    if (window.api) window.api.close();
  });

  // Back Navigation
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (window.api) window.api.navigate('index.html');
      else window.location.href = 'index.html';
    });
  }

  // Settings Load
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const currentLang = localStorage.getItem('language') || 'es';

  // Iniciar UI
  if (themeToggle) {
    themeToggle.checked = currentTheme === 'light';
    
    themeToggle.addEventListener('change', (e) => {
      const isLight = e.target.checked;
      if (isLight) {
        root.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  if (langSelect) {
    langSelect.value = currentLang;

    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      localStorage.setItem('language', newLang);
      
      // Mostrar notificacion de que los idiomas pueden requerir reinicio
      showToast('Idioma guardado. Se aplicará globalmente.', 'success');
      
      // Podríamos disparar un evento global o IPC para notificar el cambio, 
      // pero usar localStorage al cargar cada pagina es el estándar aquí.
    });
  }
});

// Toast function (copiada de la base)
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
