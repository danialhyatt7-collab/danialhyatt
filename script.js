/* ============================================================
   Danial Hyatt — Product Motion Design  ·  interactions
   ============================================================ */

/* ---------- Loader ------------------------------------------ */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader")?.classList.add("is-done"), 900);
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
  // start menu links below the full header (marquee + bar + reviews)
  if (open && menu && nav) menu.style.paddingTop = (nav.offsetHeight + 26) + "px";
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
  /* portrait spots open in a 9:16 frame instead of being letterboxed into 16:9 */
  frame.classList.toggle("is-portrait", item.ratio === "9/16");
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
  window.__reelStop?.();
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

/* ============================================================
   Reel previews — the tiles play their own spot rather than sitting
   as stills. Sources attach on first use, so nothing is fetched
   until a visitor actually reaches for a tile.
   ============================================================ */
(function reelPreviews() {
  const stages = [...document.querySelectorAll(".reel__stage")];
  if (!stages.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(hover: none)").matches;

  function play(stage) {
    const v = stage.querySelector(".reel__vid");
    if (!v || reduce) return;
    if (!v.src) v.src = stage.dataset.video;          // first touch only
    v.play().then(() => stage.classList.add("is-previewing")).catch(() => {});
  }
  function stop(stage) {
    const v = stage.querySelector(".reel__vid");
    if (!v) return;
    stage.classList.remove("is-previewing");
    v.pause();
    v.currentTime = 0;
  }

  if (coarse) {
    /* touch: the tile filling the screen plays, the rest stay still */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? play(e.target) : stop(e.target));
    }, { threshold: 0.6 });
    stages.forEach(s => io.observe(s));
  } else {
    stages.forEach(s => {
      s.addEventListener("mouseenter", () => play(s));
      s.addEventListener("mouseleave", () => stop(s));
      s.addEventListener("focus", () => play(s));
      s.addEventListener("blur", () => stop(s));
    });
  }
  /* never leave one running behind a lightbox or a hidden tab */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stages.forEach(stop);
  });
  window.__reelStop = () => stages.forEach(stop);
})();

/* Reel cards → open each spot in the lightbox */
document.querySelectorAll(".reel__stage").forEach(card =>
  card.addEventListener("click", () =>
    openLightbox({ title: card.dataset.title, video: card.dataset.video || "", ratio: card.dataset.ratio })
  )
);

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
    if (document.hidden) { raf = 0; return; }   // no point animating an unseen tab
    if (!last) last = now;
    const dt = (now - last) / 1000; last = now;
    x -= SPEED * dt;
    if (x <= -halfWidth) x += halfWidth; // seamless wrap
    track.style.transform = `translate3d(${x}px,0,0)`;
    raf = requestAnimationFrame(step);
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !raf && !reduce) { last = 0; raf = requestAnimationFrame(step); }
  });
  build();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 200); });
}
document.querySelectorAll(".ticker__track").forEach(initTicker);

/* ============================================================
   Shop + cart  →  checkout with Payoneer
   ------------------------------------------------------------
   Paste your Payoneer payment link below (Payoneer dashboard →
   Get Paid → Request a Payment / payment link). The checkout
   button opens it with the order total prefilled where supported.
   ============================================================ */
const PAYONEER_LINK = ""; // e.g. "https://pay.payoneer.com/xxxxxxxx"

/* WhatsApp, international format, no + or spaces. wa.me opens the app on
   mobile and WhatsApp Web on desktop, so unlike mailto it always lands
   somewhere the visitor can see. */
const WHATSAPP = "923374841818";
const waLink = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

const ICONS = {
  bolt: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" fill="currentColor"/></svg>',
  loop: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 8a4 4 0 1 0 0 8c2.2 0 3.3-1.7 5-4s2.8-4 5-4a4 4 0 1 1 0 8c-2.2 0-3.3-1.7-5-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
const PRODUCTS = [
  { id: "spark", name: "Spark", sub: "Your ad, live in 24 hours", price: 600, billed: "Billed one time", tag: "1 spot", icon: ICONS.bolt,
    feats: ["One 15s vertical ad", "Delivered in 9:16", "Storyboard before production"] },
  { id: "signature", name: "Signature", sub: "Hero film + variations", price: 1500, billed: "Billed one time", tag: "3 spots", icon: ICONS.star, featured: true, badge: "Most booked",
    feats: ["15s hero ad + 2 variations", "9:16, 1:1 and 16:9, each cut for its frame", "Concept and script written by me", "Storyboard approved first"] },
  { id: "studio", name: "Studio", sub: "Always-on content engine", price: 2800, unit: "/mo", billed: "Billed monthly", tag: "4 / mo", icon: ICONS.loop,
    feats: ["4 finished spots / month", "Every format, cut for its frame", "Weekly review call", "Storyboard for every spot"] },
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
  const noteEl = document.getElementById("cartNote");
  const cartEl = document.getElementById("cart");
  const NOTE_DEFAULT = noteEl ? noteEl.textContent : "";

  /* The markup says "Request an invoice" because that is what this does today.
     Fill in PAYONEER_LINK and it becomes a real checkout, label and all. */
  if (PAYONEER_LINK && checkoutBtn) {
    checkoutBtn.textContent = "Checkout with Payoneer";
    if (noteEl) noteEl.textContent = "Secure payment via Payoneer. You'll get a confirmation by email.";
  }

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

  /* ---- checkout ------------------------------------------------
     With a payment link set, this is a real checkout. Without one it
     opens an enquiry step in the drawer rather than firing a bare
     mailto, so the order and the brief travel together and the
     visitor can see what is happening.
  ---------------------------------------------------------------- */
  const enquiryForm = document.getElementById("enquiryForm");
  const enquiryNote = document.getElementById("enquiryNote");
  const enquiryWa = document.getElementById("enquiryWhatsapp");

  const orderSummary = () =>
    Object.entries(cart).map(([id, q]) => `${byId(id).name} x${q}`).join(", ");

  /* One message, whichever route it leaves by. Fields are read at click
     time so a half-filled form still carries whatever is there. */
  function enquiryText() {
    const f = enquiryForm;
    const name  = f?.name.value.trim();
    const email = f?.email.value.trim();
    const brief = f?.brief.value.trim();
    let out = `Hi Danial, I'd like to book:\n\n${orderSummary()}\nTotal: ${money(totalSum())}`;
    if (brief) out += `\n\n${brief}`;
    if (name || email) out += `\n\n\u2014 ${name}${email ? ` (${email})` : ""}`;
    return out;
  }

  checkoutBtn?.addEventListener("click", () => {
    if (totalQty() === 0) return;
    const summary = orderSummary();
    const total = totalSum();

    if (PAYONEER_LINK) {
      const sep = PAYONEER_LINK.includes("?") ? "&" : "?";
      window.open(`${PAYONEER_LINK}${sep}amount=${total}&description=${encodeURIComponent(summary)}`,
                  "_blank", "noopener");
      return;
    }
    checkoutBtn.hidden = true;
    if (noteEl) noteEl.hidden = true;
    if (enquiryForm) {
      enquiryForm.hidden = false;
      enquiryForm.querySelector("input")?.focus();
    }
  });

  enquiryWa?.addEventListener("click", () => {
    if (totalQty() === 0) return;
    window.open(waLink(enquiryText()), "_blank", "noopener");
  });

  enquiryForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (!enquiryForm.checkValidity()) { enquiryForm.reportValidity(); return; }
    const body = enquiryText();

    window.location.href =
      `mailto:hello@danialhyatt.com?subject=${encodeURIComponent("Enquiry \u2014 " + orderSummary())}` +
      `&body=${encodeURIComponent(body)}`;

    /* mailto opens nothing for anyone on webmail with no handler
       registered, so offer a route that always works and leave the
       message on screen to be copied. */
    if (enquiryNote) {
      enquiryNote.innerHTML =
        `Opening your email app&hellip; if nothing happens, ` +
        `<a href="${waLink(body)}" target="_blank" rel="noopener noreferrer">send it on WhatsApp</a> ` +
        `or email <a href="mailto:hello@danialhyatt.com">hello@danialhyatt.com</a>:` +
        `<span class="enquiry__copy">${body.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</span>`;
    }
  });

  render();
})();
