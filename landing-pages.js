if (!window.initYandexMetrika) {
  window.initYandexMetrika = function () {
    if (document.querySelector('script[src="https://mc.yandex.ru/metrika/tag.js?id=110060167"]'))
      return;
    window.ym =
      window.ym ||
      function () {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
    window.ym.l = 1 * new Date();
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js?id=110060167";
    document.head.appendChild(script);
    window.ym(110060167, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const navOverlay = document.getElementById("navOverlay");

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const setMenu = (open) => {
    nav?.classList.toggle("open", open);
    header?.classList.toggle("menu-open", open);
    burger?.classList.toggle("active", open);
    navOverlay?.classList.toggle("show", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger?.addEventListener("click", () => setMenu(!nav?.classList.contains("open")));
  nav
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  navOverlay?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("open")) setMenu(false);
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".landing-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".landing-carousel__track");
    const slides = [...carousel.querySelectorAll(".landing-carousel__slide")];
    const dotsWrap = carousel.querySelector(".landing-carousel__dots");
    if (!track || slides.length < 2) return;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("span");
      dot.className = `landing-carousel__dot${index === 0 ? " is-active" : ""}`;
      dotsWrap?.appendChild(dot);
      return dot;
    });
    let current = 0;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === current));
    };
    if (!reducedMotion) {
      window.setInterval(() => {
        if (!document.hidden) show(current + 1);
      }, 4600);
    }
  });

  const consent = localStorage.getItem("cookieConsent");
  if (consent === "accepted") window.initYandexMetrika?.();
  const banner = document.getElementById("cookieBanner");
  if (banner && consent === null) {
    banner.classList.add("show");
    document.getElementById("cookieAccept")?.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      banner.classList.remove("show");
      window.initYandexMetrika?.();
    });
    document.getElementById("cookieDecline")?.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      banner.classList.remove("show");
    });
  }
});
