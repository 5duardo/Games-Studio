// theme.js

// ─── INLINE SVG HELPER (mirrors admin.js) ─────────────────────────────────
const _SVG = {
  'sun':  '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
};
function _svgIcon(name, size=18) {
  const p = _SVG[name] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

// Expose getLucideIcon so other scripts can use it if theme.js loads first
if (!window.getLucideIcon) {
  window.getLucideIcon = (str) => {
    const map = {
      '🏆':'trophy','🚀':'rocket','⚡':'zap','🌟':'star','💎':'gem',
      '🦁':'paw-print','🐉':'bird','🦅':'bird','🍀':'clover','🎮':'gamepad-2',
      '⚽':'dribbble','🎸':'music','🕹':'joystick','🛡':'shield','👑':'crown','🔥':'flame',
      '📚':'book-open','📐':'ruler','🔬':'microscope','🌍':'globe','🎨':'palette',
      '🎵':'music-2','🧠':'brain','💼':'briefcase','💻':'laptop','🎬':'clapperboard',
      '🧩':'puzzle','📜':'scroll','🍔':'pizza','🗣':'message-circle','🚗':'car','✈️':'plane',
      '🔵':'circle','🔴':'circle',
    };
    return map[str] || str || 'help-circle';
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  if (currentTheme === 'light') root.classList.add('light-theme');

  const settingsBtn = document.getElementById('btn-settings');
  if (settingsBtn) {
    if (!settingsBtn.hasAttribute('data-no-actions')) {
      settingsBtn.innerHTML = _svgIcon('settings', 16);
      settingsBtn.title = 'Ajustes Globales';
      settingsBtn.addEventListener('click', () => {
        if (window.api) window.api.navigate('settings.html');
      });
    }
  }
});

