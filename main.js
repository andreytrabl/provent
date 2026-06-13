/**
 * ПроВент — Main JavaScript (Light version, no forms, with carousels)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initActiveNav();
  initCarousel('docCarousel');
  initCarousel('heroCarousel');
});

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 16);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');
  if (!burger || !nav) return;

  const close = () => {
    burger.classList.remove('active');
    nav.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const open = () => {
    burger.classList.add('active');
    nav.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  burger.addEventListener('click', () => {
    nav.classList.contains('active') ? close() : open();
  });

  overlay?.addEventListener('click', close);

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', close);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) close();
  });
}

function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.service-card, .advantage-card, .process-step, .doc-item, .faq-item, .about__grid, .documents__grid, .partners__inner, .cert-item'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(i % 4) * 60}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id], .section[id]');
  const links = document.querySelectorAll('.nav__link');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel__slide');
  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsContainer = carousel.querySelector('.carousel__dots');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateCarousel(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel__dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    updateCarousel(currentIndex);
  }

  function createDots() {
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel__dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

  updateCarousel(0);
  createDots();
}
// Cookie consent
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  // Проверяем, давал ли пользователь согласие ранее
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent !== null) {
    // Скрываем баннер, если уже есть выбор
    banner.style.display = 'none';
    return;
  }

  // Показываем баннер
  setTimeout(() => banner.classList.add('show'), 500);

  function setConsent(accepted) {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    banner.classList.remove('show');
    setTimeout(() => { banner.style.display = 'none'; }, 400);
    if (accepted) {
      // Здесь позже можно будет инициализировать счётчики (Яндекс.Метрика и т.п.)
      console.log('Cookies accepted');
    } else {
      console.log('Cookies declined');
    }
  }

  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');

  acceptBtn?.addEventListener('click', () => setConsent(true));
  declineBtn?.addEventListener('click', () => setConsent(false));
})();