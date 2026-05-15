/* ============================================================
   theme-toggle.js – Cultivora Land
   Gère le switch jour / nuit avec persistance localStorage
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'cultivora-theme';
  const DARK        = 'dark';
  const LIGHT       = 'light';

  const html        = document.documentElement;
  const btn         = document.getElementById('themeToggle');
  const label       = document.getElementById('themeLabel');

  /* ── 1. Appliquer le thème sauvegardé (ou la préférence système) ── */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === DARK || saved === LIGHT) return saved;
    // Respecte la préférence système si aucune préférence enregistrée
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK;
    }
    return LIGHT;
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (label) {
      label.textContent = theme === DARK ? 'Mode jour' : 'Mode nuit';
    }
    if (btn) {
      btn.setAttribute('aria-label', theme === DARK ? 'Passer en mode jour' : 'Passer en mode nuit');
    }
  }

  /* ── 2. Initialisation immédiate (évite le flash) ── */
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  /* ── 3. Écouter le clic sur le bouton ── */
  if (btn) {
    btn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next    = current === DARK ? LIGHT : DARK;

      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);

      /* Micro-animation : faire rebondir le bouton */
      btn.classList.add('theme-toggle--bounce');
      btn.addEventListener('animationend', function handler() {
        btn.classList.remove('theme-toggle--bounce');
        btn.removeEventListener('animationend', handler);
      });
    });
  }

  /* ── 4. Synchroniser si l'utilisateur change la préférence système ── */
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      // Ne synchronise que si l'utilisateur n'a pas fait de choix manuel
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

})();