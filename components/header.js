// header.js

async function loadComponent(id, file) {
    const element = document.getElementById(id);
    const response = await fetch(file);
    element.innerHTML = await response.text();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("header", "/components/header.html");
    await loadComponent("nav-mobile", "/components/nav-mobile.html");

    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navMobile');

    if (!toggle || !nav) return;

    // ─── Helpers ouvrir / fermer ───────────────────────────────
    function openMenu() {
        nav.classList.add('open');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // bloque le scroll
    }

    function closeMenu() {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = ''; // restaure le scroll
    }

    function isOpen() {
        return nav.classList.contains('open');
    }

    // ─── Bouton burger ─────────────────────────────────────────
    toggle.addEventListener('click', () => {
        isOpen() ? closeMenu() : openMenu();
    });

    // ─── Fermeture au clic sur un lien ─────────────────────────
    document.querySelectorAll('.nav-mobile-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ─── Fermeture au clic en dehors du menu ───────────────────
    document.addEventListener('click', (e) => {
        if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    // ─── Fermeture à la touche Escape ──────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    // ─── Swipe vers le haut pour fermer ────────────────────────
    let touchStartY = 0;
    let touchStartX = 0;

    nav.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    nav.addEventListener('touchend', (e) => {
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);

        // Swipe vers le haut > 60px, mouvement horizontal faible = fermeture
        if (deltaY < -60 && deltaX < 60) {
            closeMenu();
        }
    }, { passive: true });
});