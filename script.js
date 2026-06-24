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

/* ---------- Menu overlay ------------------------------------ */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menuOverlay");
function setMenu(open) {
  menu?.classList.toggle("is-open", open);
  menu?.setAttribute("aria-hidden", String(!open));
  menuBtn?.setAttribute("aria-expanded", String(open));
  menuBtn?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn?.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

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
  ...document.querySelectorAll(".section__head, .reel__head, .about__grid, .plan, .pricing__note, .contact__inner"),
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

/* the reel stage has its own slide-in styles — just toggle is-in */
const reelStageEl = document.getElementById("reelStage");
if (reelStageEl) revObs.observe(reelStageEl);

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

/* Featured reel stage → opens the spot in lightbox */
document.getElementById("reelStage")?.addEventListener("click", () =>
  openLightbox({ title: "Valentino Uomo — 15s", video: "assets/video/hero.mp4" })
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
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   Marquee ticker — rAF loop with modulo wrap. Two identical
   halves; shifting by exactly one half is always seamless, so
   it can never gap or break at the end.
   ============================================================ */
(function ticker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;
  const base = track.querySelector(".ticker__group");
  if (!base) return;
  const baseHTML = base.outerHTML;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let halfWidth = 0, x = 0, last = 0, raf = 0;
  const SPEED = 70; // px per second

  function build() {
    cancelAnimationFrame(raf);
    track.innerHTML = baseHTML;
    const groupW = track.firstElementChild.offsetWidth;
    if (!groupW) return;
    const perHalf = Math.ceil(window.innerWidth / groupW) + 1;
    track.innerHTML = baseHTML.repeat(perHalf * 2); // two identical halves
    halfWidth = groupW * perHalf;
    x = 0; last = 0;
    if (!reduce) raf = requestAnimationFrame(step);
  }

  function step(now) {
    if (!last) last = now;
    const dt = (now - last) / 1000; last = now;
    x -= SPEED * dt;
    if (x <= -halfWidth) x += halfWidth; // seamless wrap
    track.style.transform = `translate3d(${x}px,0,0)`;
    raf = requestAnimationFrame(step);
  }

  build();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 200); });
})();

/* ============================================================
   Studio status panel — playback toggle, progress, live clocks
   ============================================================ */
(function studioPanel() {
  const play = document.getElementById("studioPlay");
  if (!play) return;
  const fill = document.getElementById("studioFill");
  const timeEl = document.getElementById("studioTime");
  const sound = document.getElementById("studioSound");
  const clocks = [...document.querySelectorAll(".studio__clock")];

  let playing = true, sec = 54;
  const dur = 180; // 3:00 loop
  const fmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const render = () => { fill.style.width = (sec / dur * 100).toFixed(1) + "%"; timeEl.textContent = fmt(sec); };
  render();
  setInterval(() => { if (playing) { sec = (sec + 1) % dur; render(); } }, 1000);

  play.addEventListener("click", () => {
    playing = !playing;
    play.classList.toggle("is-paused", !playing);
    play.querySelector(".studio__play-label").textContent = playing ? "Pause" : "Play";
  });

  sound?.addEventListener("click", () => {
    const off = sound.classList.toggle("is-off");
    sound.querySelector("b").textContent = off ? "Off" : "On";
  });

  function tick() {
    const now = new Date();
    clocks.forEach(c => {
      try {
        c.textContent = new Intl.DateTimeFormat("en-GB", {
          timeZone: c.dataset.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        }).format(now);
      } catch (e) { /* timezone unsupported */ }
    });
  }
  tick();
  setInterval(tick, 1000);
})();
