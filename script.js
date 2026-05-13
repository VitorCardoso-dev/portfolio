// —— Navbar scroll ——
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// —— Hamburger menu ——
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// —— Fade-in ao rolar (Efeito visual nos cards) ——
const fadeEls = document.querySelectorAll('.skill-card, .project-card, .stat-card, .contact-item');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  fadeObserver.observe(el);
});

// —— Formulário de contato ——
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  setTimeout(() => {
    btn.textContent = '✓ Mensagem Enviada!';
    e.target.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '✉ Enviar Mensagem';
    }, 3000);
  }, 1500);
});