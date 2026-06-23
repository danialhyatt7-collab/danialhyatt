/* ============================================================
   Danial Hyatt — Product Motion Design  ·  interactions
   ============================================================ */

/* ---------- Portfolio data ----------------------------------
   Edit this array to manage video placements.
   - `video` accepts a YouTube/Vimeo embed URL OR a local mp4 path.
   - `poster` is the thumbnail (drop files in assets/img/).
   Leave poster empty to use the generated gradient fallback.
------------------------------------------------------------- */
const WORK = [
  { cat: "Tech · 15s",       title: "Pulse App Launch",   poster: "assets/img/work-1.jpg", video: "" },
  { cat: "Beauty · 15s",     title: "Lumé Serum",         poster: "assets/img/work-2.jpg", video: "" },
  { cat: "Beverage · 15s",   title: "Hydra Can Drop",     poster: "assets/img/work-3.jpg", video: "" },
  { cat: "Fashion · 15s",    title: "Nordic Sneaker",     poster: "assets/img/work-4.jpg", video: "" },
  { cat: "SaaS · 15s",       title: "Flowstack Promo",    poster: "assets/img/work-5.jpg", video: "" },
  { cat: "Gadget · 15s",     title: "Aero Earbuds",       poster: "assets/img/work-6.jpg", video: "" },
];

const GRADIENTS = [
  "linear-gradient(135deg,#1f3b57,#0c1622)",
  "linear-gradient(135deg,#3a2540,#120c1a)",
  "linear-gradient(135deg,#143b3a,#0a1716)",
  "linear-gradient(135deg,#43321a,#1a120a)",
  "linear-gradient(135deg,#1a2a4d,#0a0f1c)",
  "linear-gradient(135deg,#2d1f3f,#100b18)",
];

/* ---------- Build work cards -------------------------------- */
(function buildWork() {
  const grid = document.getElementById("workGrid");
  if (!grid) return;
  WORK.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.dataset.video = item.video || "";
    card.dataset.title = item.title;
    const bg = item.poster
      ? `background-image:url('${item.poster}')`
      : `background-image:${GRADIENTS[i % GRADIENTS.length]}`;
    card.innerHTML = `
      <div class="work-card__bg" style="${bg}"></div>
      <div class="work-card__grad"></div>
      <div class="work-card__meta">
        <div>
          <p class="work-card__cat">${item.cat}</p>
          <h3 class="work-card__title">${item.title}</h3>
        </div>
        <span class="work-card__play" aria-hidden="true">&#9658;</span>
      </div>`;
    card.addEventListener("click", () => openLightbox(item));
    grid.appendChild(card);
  });
})();

/* ---------- Loader ------------------------------------------ */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader")?.classList.add("is-done"), 700);
});

/* ---------- Nav scroll state -------------------------------- */
const nav = document.getElementById("nav");
const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ------------------------------------- */
const burger = document.getElementById("burger");
const links = document.querySelector(".nav__links");
burger?.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
links?.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Section spy (side numbered nav) ----------------- */
const sections = [...document.querySelectorAll("main section[id]")];
const sideLinks = [...document.querySelectorAll(".sidenav__list a")];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      sideLinks.forEach(l => l.classList.toggle("is-active",
        l.getAttribute("href") === `#${e.target.id}`));
    }
  });
}, { threshold: .5 });
sections.forEach(s => spy.observe(s));

/* ---------- Side arrows ------------------------------------- */
document.querySelectorAll(".sidenav__arrow").forEach(btn => {
  btn.addEventListener("click", () => {
    const idx = sections.findIndex(s => {
      const r = s.getBoundingClientRect();
      return r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2;
    });
    const next = btn.dataset.dir === "down" ? idx + 1 : idx - 1;
    sections[Math.max(0, Math.min(sections.length - 1, next))]
      ?.scrollIntoView({ behavior: "smooth" });
  });
});

/* ---------- Reveal on scroll -------------------------------- */
const revealEls = [
  ...document.querySelectorAll(".section__head, .about__grid, .plan, .pricing__note, .contact__inner"),
  ...document.querySelectorAll(".work-card"),
];
revealEls.forEach(el => { if (!el.classList.contains("work-card")) el.classList.add("reveal"); });
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-in");
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .15 });
revealEls.forEach(el => revObs.observe(el));

/* ---------- Lightbox ---------------------------------------- */
const lightbox = document.getElementById("lightbox");
const frame = document.getElementById("lightboxFrame");
const closeBtn = document.getElementById("lightboxClose");

function openLightbox(item) {
  if (!lightbox) return;
  if (item.video) {
    const isEmbed = /youtube|youtu\.be|vimeo/.test(item.video);
    frame.innerHTML = isEmbed
      ? `<iframe src="${item.video}" allow="autoplay; fullscreen" allowfullscreen></iframe>`
      : `<video src="${item.video}" controls autoplay playsinline></video>`;
  } else {
    frame.innerHTML = `<div style="display:grid;place-items:center;height:100%;color:#9aa6b8;
      font-family:'Anton',sans-serif;font-size:1.4rem;text-align:center;padding:24px;letter-spacing:.04em;">
      ${item.title.toUpperCase()}<br><span style="font-family:Inter;font-size:.85rem;letter-spacing:.1em;">
      Preview coming soon</span></div>`;
  }
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox?.classList.remove("is-open");
  lightbox?.setAttribute("aria-hidden", "true");
  frame.innerHTML = "";
  document.body.style.overflow = "";
}
closeBtn?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

/* Hero reel button → opens showreel in lightbox */
document.getElementById("reelBtn")?.addEventListener("click", () =>
  openLightbox({ title: "2024 Showreel", video: "assets/video/hero.mp4" })
);

/* ---------- Contact form (front-end only) ------------------- */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form?.addEventListener("submit", e => {
  e.preventDefault();
  if (!form.checkValidity()) { status.textContent = "Please fill in all fields."; return; }
  const name = encodeURIComponent(form.name.value);
  const msg = encodeURIComponent(form.message.value + "\n\n— " + form.name.value + " (" + form.email.value + ")");
  status.textContent = "Opening your email client…";
  window.location.href = `mailto:hello@danialhyatt.com?subject=New project brief from ${name}&body=${msg}`;
  setTimeout(() => { form.reset(); status.textContent = "Thanks! I'll reply within one business day."; }, 800);
});

/* ---------- Year ------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   Showcase slider — scroll advances slides, then hands off
   to the page once the last slide is reached.
   ============================================================ */
(function showcaseSlider() {
  const sec = document.getElementById("showcase");
  if (!sec) return;
  const slides = [...sec.querySelectorAll(".slide")];
  const dots = [...sec.querySelectorAll(".slider__dots button")];
  const home = document.getElementById("home");
  let i = 0, locked = false;
  const last = slides.length - 1;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(n) {
    n = Math.max(0, Math.min(last, n));
    if (n === i) return;
    slides[i].classList.remove("is-active");
    dots[i] && dots[i].classList.remove("is-active");
    i = n;
    slides[i].classList.add("is-active");
    dots[i] && dots[i].classList.add("is-active");
  }
  dots.forEach(d => d.addEventListener("click", () => show(+d.dataset.i)));

  /* hide global side rails while the slider fills the viewport */
  new IntersectionObserver(es => es.forEach(e =>
    document.body.classList.toggle("slider-active", e.isIntersecting && e.intersectionRatio > 0.55)
  ), { threshold: [0, 0.55, 1] }).observe(sec);

  /* wire the feature-card play buttons to the existing lightbox */
  sec.querySelectorAll(".slide__card-play").forEach(b =>
    b.addEventListener("click", () => openLightbox({ title: b.dataset.title, video: b.dataset.video || "" }))
  );

  /* "Scroll" hint: advance, or drop into the page on the last slide */
  document.getElementById("sliderNext")?.addEventListener("click", () => {
    if (i < last) show(i + 1);
    else home?.scrollIntoView({ behavior: "smooth" });
  });

  if (reduce) return; // no scroll-jacking when reduced motion is preferred

  const atTop = () => window.scrollY <= 2;
  const lock = () => { locked = true; setTimeout(() => (locked = false), 800); };

  function step(dir) {
    if (locked) return;
    if (dir > 0 && i < last) { lock(); show(i + 1); }
    else if (dir < 0 && i > 0) { lock(); show(i - 1); }
  }

  /* Wheel: intercept only while the slider owns the top of the page.
     One deliberate scroll = one slide. At the last slide a downward
     scroll is left alone so the page scrolls on to the hero. */
  window.addEventListener("wheel", e => {
    if (!atTop()) return;
    const dir = e.deltaY > 0 ? 1 : -1;
    if (dir > 0 && i >= last) return;   // hand off to normal page scroll
    if (dir < 0 && i <= 0) return;      // already at first slide / top
    if (Math.abs(e.deltaY) < 4) return;
    e.preventDefault();
    step(dir);
  }, { passive: false });

  /* Touch: swipe up/down to change slides under the same rules */
  let ty = null;
  window.addEventListener("touchstart", e => { ty = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchmove", e => {
    if (ty === null || !atTop()) return;
    const dy = ty - e.touches[0].clientY;
    if (Math.abs(dy) < 36) return;
    const dir = dy > 0 ? 1 : -1;
    if (dir > 0 && i >= last) return;
    if (dir < 0 && i <= 0) return;
    if (e.cancelable) e.preventDefault();
    step(dir);
    ty = e.touches[0].clientY;
  }, { passive: false });

  /* Arrow keys for accessibility */
  window.addEventListener("keydown", e => {
    if (!atTop()) return;
    if (e.key === "ArrowDown" && i < last) { e.preventDefault(); step(1); }
    if (e.key === "ArrowUp" && i > 0) { e.preventDefault(); step(-1); }
  });
})();
