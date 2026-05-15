const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('navMobile');
toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
});
document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
    });
});



