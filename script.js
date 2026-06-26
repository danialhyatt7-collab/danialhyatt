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
  ...document.querySelectorAll(".section__head, .reel__head, .shop__head, .value__stat, .value__points, .cta, .about__grid, .plan, .pricing__note, .contact__inner"),
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

/* reel cards have their own slide-in styles — just toggle is-in */
document.querySelectorAll(".reel__stage").forEach(el => revObs.observe(el));

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

/* Reel cards → open each spot in the lightbox */
document.querySelectorAll(".reel__stage").forEach(card =>
  card.addEventListener("click", () =>
    openLightbox({ title: card.dataset.title, video: card.dataset.video || "" })
  )
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
function initTicker(track) {
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
}
document.querySelectorAll(".ticker__track").forEach(initTicker);

/* ============================================================
   Header reviews — position driven by scroll (slides as you scroll)
   ============================================================ */
(function scrollReviews() {
  const track = document.getElementById("reviewsTrack");
  if (!track) return;
  const base = track.querySelector(".reviews__group");
  if (!base) return;
  const baseHTML = base.outerHTML;
  const FACTOR = 0.55;        // how far slides travel per pixel scrolled
  let half = 0, cur = 0, raf = 0;

  function build() {
    cancelAnimationFrame(raf);
    track.innerHTML = baseHTML;
    const w = track.firstElementChild.offsetWidth;
    if (!w) return;
    const perHalf = Math.ceil(window.innerWidth / w) + 1;
    track.innerHTML = baseHTML.repeat(perHalf * 2);
    half = w * perHalf;
    cur = -(window.scrollY * FACTOR);
    raf = requestAnimationFrame(frame);
  }
  function frame() {
    const target = -(window.scrollY * FACTOR);      // scroll-driven target
    cur += (target - cur) * 0.09;                    // smooth glide toward it
    let x = cur % half; if (x > 0) x -= half;        // seamless wrap
    track.style.transform = `translate3d(${x}px,0,0)`;
    raf = requestAnimationFrame(frame);
  }
  build();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 200); });
})();

/* ============================================================
   Footer wordmark — solid on touch, back to hairline after 2s
   ============================================================ */
/* footer subscribe → email */
(function footSubscribe() {
  const form = document.getElementById("footSubscribe");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = (form.email.value || "").trim();
    if (!email) return;
    window.location.href =
      `mailto:hello@danialhyatt.com?subject=${encodeURIComponent("Newsletter signup")}` +
      `&body=${encodeURIComponent("Please add me to updates: " + email)}`;
    form.reset();
  });
})();

/* ============================================================
   Shop + cart  →  checkout with Payoneer
   ------------------------------------------------------------
   Paste your Payoneer payment link below (Payoneer dashboard →
   Get Paid → Request a Payment / payment link). The checkout
   button opens it with the order total prefilled where supported.
   ============================================================ */
const PAYONEER_LINK = ""; // e.g. "https://pay.payoneer.com/xxxxxxxx"

const ICONS = {
  bolt: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" fill="currentColor"/></svg>',
  loop: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 8a4 4 0 1 0 0 8c2.2 0 3.3-1.7 5-4s2.8-4 5-4a4 4 0 1 1 0 8c-2.2 0-3.3-1.7-5-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
const PRODUCTS = [
  { id: "spark", name: "Spark", sub: "Your ad, live in 24 hours", price: 250, billed: "Billed one time", tag: "15s reel", icon: ICONS.bolt,
    feats: ["One 15s vertical or square ad", "1 platform format", "Licensed music + sound design", "Storyboard before production"] },
  { id: "signature", name: "Signature", sub: "Hero film + cut-downs", price: 600, billed: "Billed one time", tag: "3 spots", icon: ICONS.star, featured: true, badge: "Most booked",
    feats: ["15s hero ad + 2 cut-downs", "3 aspect ratios delivered", "3D render & UI animation", "Storyboard approved first"] },
  { id: "studio", name: "Studio", sub: "Always-on content engine", price: 1500, unit: "/mo", billed: "Billed monthly", tag: "6–8 / mo", icon: ICONS.loop,
    feats: ["6–8 finished spots / month", "Unlimited platform formats", "Dedicated Slack channel", "Storyboard for every spot"] },
];

(function shop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;
  const money = n => "$" + n.toLocaleString();
  const byId = id => PRODUCTS.find(p => p.id === id);

  /* ---- render products ---- */
  const bullet = '<svg class="product__bullet" viewBox="0 0 10 10" width="9" height="9" aria-hidden="true"><path d="M0 0 L9 5 L0 10 Z" fill="currentColor"/></svg>';
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product${p.featured ? " product--featured" : ""}">
      <div class="product__card">
        ${p.badge ? `<span class="product__badge">${p.badge}</span>` : ""}
        <div class="product__head">
          <span class="product__icon">${p.icon}</span>
          <div class="product__headtext">
            <h3 class="product__name">${p.name}</h3>
            <p class="product__sub">${p.sub}</p>
          </div>
        </div>
        <div class="product__rule"></div>
        <ul class="product__list">${p.feats.map(f => `<li>${bullet}${f}</li>`).join("")}</ul>
        <div class="product__foot">
          <div>
            <p class="product__price">${money(p.price)}${p.unit ? `<small>${p.unit}</small>` : ""}</p>
            <p class="product__billed">${p.billed}</p>
          </div>
          <span class="product__tag">&#9658; ${p.tag}</span>
        </div>
      </div>
      <button class="product__choose" data-id="${p.id}">Choose ${p.name}</button>
    </article>`).join("");

  /* micro-animation: products reveal + stagger on scroll */
  if (typeof revObs !== "undefined") {
    grid.querySelectorAll(".product").forEach((el, i) => {
      el.classList.add("reveal"); el.style.transitionDelay = (i * 0.08) + "s"; revObs.observe(el);
    });
  }

  /* ---- cart state (persisted) ---- */
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem("dh_cart")) || {}; } catch (e) { cart = {}; }
  const save = () => localStorage.setItem("dh_cart", JSON.stringify(cart));

  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("cartCheckout");
  const cartEl = document.getElementById("cart");

  const totalQty = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const totalSum = () => Object.entries(cart).reduce((s, [id, q]) => s + (byId(id) ? byId(id).price * q : 0), 0);

  function render() {
    const q = totalQty();
    countEl.textContent = q;
    countEl.classList.toggle("is-on", q > 0);
    const ids = Object.keys(cart);
    itemsEl.innerHTML = ids.length ? ids.map(id => {
      const p = byId(id); if (!p) return "";
      return `<div class="cart-item">
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__price">${money(p.price)}${p.unit || ""}</div>
        </div>
        <div class="cart-item__qty">
          <button data-dec="${id}" aria-label="Decrease">−</button>
          <span>${cart[id]}</span>
          <button data-inc="${id}" aria-label="Increase">+</button>
        </div>
      </div>`;
    }).join("") : `<p class="cart__empty">Your cart is empty.</p>`;
    totalEl.textContent = money(totalSum());
    checkoutBtn.disabled = q === 0;
    save();
  }

  function add(id) {
    cart[id] = (cart[id] || 0) + 1; render(); openCart();
    countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump");
  }
  function change(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; render(); }

  grid.addEventListener("click", e => { const b = e.target.closest(".product__choose"); if (b) add(b.dataset.id); });
  itemsEl.addEventListener("click", e => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (inc) change(inc.dataset.inc, 1);
    if (dec) change(dec.dataset.dec, -1);
  });

  /* ---- drawer open/close ---- */
  function openCart() { cartEl.classList.add("is-open"); cartEl.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeCart() { cartEl.classList.remove("is-open"); cartEl.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  document.getElementById("cartBtn")?.addEventListener("click", openCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartBackdrop")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

  /* ---- checkout → Payoneer ---- */
  checkoutBtn?.addEventListener("click", () => {
    if (totalQty() === 0) return;
    const summary = Object.entries(cart).map(([id, q]) => `${byId(id).name} ×${q}`).join(", ");
    const total = totalSum();
    if (PAYONEER_LINK) {
      // append amount/reference where the Payoneer link supports query params
      const sep = PAYONEER_LINK.includes("?") ? "&" : "?";
      window.open(`${PAYONEER_LINK}${sep}amount=${total}&description=${encodeURIComponent(summary)}`, "_blank", "noopener");
    } else {
      // fallback until the Payoneer link is added: email the order
      window.location.href =
        `mailto:hello@danialhyatt.com?subject=${encodeURIComponent("New order — " + money(total))}` +
        `&body=${encodeURIComponent("I'd like to order:\n" + summary + "\n\nTotal: " + money(total) + "\n\nPlease send a Payoneer payment request.")}`;
    }
  });

  render();
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
