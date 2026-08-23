document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');

  // ---------- ротация заголовков в hero (3 варианта, листаются автоматически) ----------
  const rotator = document.querySelector('.hero__title--rotator');
  if (rotator) {
    const lines = [...rotator.querySelectorAll('.hero__title-line')];
    if (lines.length > 1) {
      let activeIndex = lines.findIndex((l) => l.classList.contains('is-active'));
      if (activeIndex < 0) { activeIndex = 0; lines[0].classList.add('is-active'); }
      setInterval(() => {
        lines[activeIndex].classList.remove('is-active');
        activeIndex = (activeIndex + 1) % lines.length;
        lines[activeIndex].classList.add('is-active');
      }, 4000);
    }
  }

  // ---------- лёгкая анимация появления секций при скролле ----------
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  const navOverlay = document.getElementById('navOverlay');
  const setMenu = (open) => {
    nav?.classList.toggle('open', open);
    header?.classList.toggle('menu-open', open);
    burger?.classList.toggle('active', open);
    navOverlay?.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger?.addEventListener('click', () => setMenu(!nav?.classList.contains('open')));
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  navOverlay?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) setMenu(false);
  });

  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const apply = () => {
      if (!img.dataset.fallback) return;
      img.src = img.dataset.fallback;
      img.removeAttribute('data-fallback');
    };
    img.addEventListener('error', apply);
    if (img.complete && img.naturalWidth === 0) apply();
  });

  const carousel = document.getElementById('docCarousel');
  const lightbox = document.getElementById('docLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let carouselIndex = 0;
  let carouselSources = [];

  if (carousel) {
    const slides = [...carousel.querySelectorAll('.carousel__slide')];
    const dotsWrap = carousel.querySelector('.carousel__dots');
    carouselSources = slides.map((s) => s.querySelector('[data-zoom-src]')?.dataset.zoomSrc || '');

    // точки-индикаторы
    const dots = slides.map((_, k) => {
      const d = document.createElement('span');
      d.className = 'carousel__dot' + (k === 0 ? ' carousel__dot--active' : '');
      dotsWrap?.appendChild(d);
      return d;
    });

    const go = (n) => {
      carouselIndex = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('active', k === carouselIndex));
      dots.forEach((d, k) => d.classList.toggle('carousel__dot--active', k === carouselIndex));
    };
    carousel.querySelector('.carousel__btn--prev')?.addEventListener('click', () => go(carouselIndex - 1));
    carousel.querySelector('.carousel__btn--next')?.addEventListener('click', () => go(carouselIndex + 1));

    // свайп для тач-устройств (мобильные)
    const container = carousel.querySelector('.carousel__container');
    let touchStartX = 0, touchDeltaX = 0, touching = false;
    container?.addEventListener('touchstart', (e) => {
      touching = true;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });
    container?.addEventListener('touchmove', (e) => {
      if (!touching) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    container?.addEventListener('touchend', () => {
      if (!touching) return;
      touching = false;
      if (touchDeltaX > 40) go(carouselIndex - 1);
      else if (touchDeltaX < -40) go(carouselIndex + 1);
    });

    // клик по фото — открыть лайтбокс с этим документом
    carousel.querySelectorAll('.carousel__photo').forEach((btn, k) => {
      btn.addEventListener('click', () => openLightbox(k));
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !carouselSources.length) return;
    carouselIndex = index;
    lightboxImg.src = carouselSources[carouselIndex];
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function stepLightbox(dir) {
    if (!carouselSources.length) return;
    carouselIndex = (carouselIndex + dir + carouselSources.length) % carouselSources.length;
    lightboxImg.src = carouselSources[carouselIndex];
  }
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => stepLightbox(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => stepLightbox(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  // свайп в самом лайтбоксе
  let lbStartX = 0, lbDeltaX = 0, lbTouching = false;
  lightbox?.addEventListener('touchstart', (e) => {
    lbTouching = true; lbStartX = e.touches[0].clientX; lbDeltaX = 0;
  }, { passive: true });
  lightbox?.addEventListener('touchmove', (e) => {
    if (!lbTouching) return;
    lbDeltaX = e.touches[0].clientX - lbStartX;
  }, { passive: true });
  lightbox?.addEventListener('touchend', () => {
    if (!lbTouching) return;
    lbTouching = false;
    if (lbDeltaX > 40) stepLightbox(-1);
    else if (lbDeltaX < -40) stepLightbox(1);
  });

  // ---------- cookie-баннер + запуск Яндекс.Метрики только после согласия ----------
  // Метрика (window.initYandexMetrika) объявлена в index.html, но НЕ запускается сама —
  // до нажатия "Принять" счётчик не подключается вовсе (ни один запрос на mc.yandex.ru).
  const consent = localStorage.getItem('cookieConsent');
  if (consent === 'accepted') {
    window.initYandexMetrika?.();
  }

  const banner = document.getElementById('cookieBanner');
  if (banner && consent === null) {
    banner.classList.add('show');
    document.getElementById('cookieAccept')?.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.classList.remove('show');
      window.initYandexMetrika?.();
    });
    document.getElementById('cookieDecline')?.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      banner.classList.remove('show');
    });
  }
});