// hero-nav.js

const menuBtn  = document.getElementById("menuBtn");
const navMobile = document.getElementById("navMobile");

// ─── Helpers ──────────────────────────────────────────────
function openMenu() {
    menuBtn.classList.add("active");
    navMobile.classList.add("open");
    document.body.style.overflow = "hidden"; // bloque le scroll
}

function closeMenu() {
    menuBtn.classList.remove("active");
    navMobile.classList.remove("open");
    document.body.style.overflow = ""; // restaure le scroll
}

function isOpen() {
    return navMobile.classList.contains("open");
}

// ─── Bouton burger ────────────────────────────────────────
menuBtn.addEventListener("click", () => {
    isOpen() ? closeMenu() : openMenu();
});

// ─── Fermeture au clic sur un lien ────────────────────────
navMobile.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

// ─── Fermeture au clic en dehors ──────────────────────────
document.addEventListener("click", (e) => {
    if (isOpen() && !navMobile.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
    }
});

// ─── Fermeture à la touche Escape ─────────────────────────
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
});

// ─── Swipe vers le haut pour fermer ───────────────────────
let touchStartY = 0;
let touchStartX = 0;

navMobile.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

navMobile.addEventListener("touchend", (e) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);

    // Swipe vers le haut > 60px, pas de dérive horizontale = fermeture
    if (deltaY < -60 && deltaX < 60) closeMenu();
}, { passive: true });