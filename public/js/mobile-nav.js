// Lightweight mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const btns = document.querySelectorAll('#mobile-menu-btn');
  const overlay = document.getElementById('mobile-nav-overlay');
  const nav = document.getElementById('mobile-nav');
  function openNav() { document.body.classList.add('nav-open'); document.body.style.overflow = 'hidden'; }
  function closeNav() { document.body.classList.remove('nav-open'); document.body.style.overflow = ''; }
  btns.forEach(b => b && b.addEventListener('click', openNav));
  if (overlay) overlay.addEventListener('click', closeNav);
  if (nav) nav.addEventListener('click', function (e) {
    if (e.target.matches('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
});
