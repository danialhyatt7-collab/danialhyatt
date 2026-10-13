#!/usr/bin/env python3
"""Render every case study page under work/ from tools/case-studies.json.

The pages are near-identical in structure, so the markup lives here once and the
words live in the JSON. Adding a case study means adding a JSON entry and running
this; it also prints the sitemap entries to paste in.

    python3 tools/build-case-studies.py
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "tools" / "case-studies.json").read_text(encoding="utf-8"))
WA = "https://wa.me/923374841818?text={}"
SITE = "https://designsredefined.com"


def cards(items):
    return "\n".join(
        f'      <div class="loc-card">\n        <h3>{n}</h3>\n        <p>{d}</p>\n      </div>'
        for n, d in items)


def decisions(items):
    return "\n".join(
        f'      <div class="dec">\n        <span class="dec-n">{i:02d}</span>\n        <div>\n'
        f'          <h3>{n}</h3>\n          <p>{d}</p>\n        </div>\n      </div>'
        for i, (n, d) in enumerate(items, 1))


def stats(items):
    return "\n".join(
        f'      <div class="statbox"><b>{v}</b><small>{l}</small></div>'
        for v, l in items)


def paras(items):
    return "\n".join(f"      <p>{p}</p>" for p in items)


def meta_row(items):
    return "\n".join(f"      <div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in items)


def page(slug, c):
    url = f"{SITE}/work/{slug}/"
    wa = WA.format(c["wa_text"])
    return f'''<!DOCTYPE html>
<html lang="en-PK">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{c["title"]} | Designs Redefined</title>
<meta name="description" content="{c["desc"]}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#03020B">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Designs Redefined">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{c["title"]} | Designs Redefined">
<meta property="og:description" content="{c["og_desc"]}">
<meta property="og:image" content="{SITE}/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{c["title"]}">
<meta name="twitter:description" content="{c["og_desc"]}">
<meta name="twitter:image" content="{SITE}/assets/og.jpg">

<meta name="geo.placename" content="Islamabad">
<meta name="geo.position" content="33.6844;73.0479">
<meta name="ICBM" content="33.6844, 73.0479">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9670;</text></svg>">
<script>
(function(){{try{{var t=localStorage.getItem('dr-theme');
if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();
document.documentElement.classList.add('js');
</script>
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/case-study.css">

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Article",
      "@id": "{url}#article",
      "headline": "{c["h1"]}",
      "description": "{c["desc"]}",
      "about": "Web design case study",
      "url": "{url}",
      "image": "{SITE}/assets/og.jpg",
      "author": {{ "@id": "{SITE}/#business" }},
      "publisher": {{ "@id": "{SITE}/#business" }},
      "inLanguage": "en-PK",
      "mentions": {{
        "@type": "Organization",
        "name": "{c["client"]}",
        "url": "{c["live"]}"
      }}
    }},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "{SITE}/" }},
        {{ "@type": "ListItem", "position": 2, "name": "Work", "item": "{SITE}/#work" }},
        {{ "@type": "ListItem", "position": 3, "name": "{c["client"]}", "item": "{url}" }}
      ]
    }}
  ]
}}
</script>
</head>
<body>

<nav class="nav">
  <div class="nav-inner">
    <a class="wordmark" href="/">Designs Redefined</a>
    <div class="nav-links">
      <a href="/#work">Work</a>
      <a href="/#services">Services</a>
      <a href="/pricing/">Pricing</a>
      <a href="/islamabad-web-design/">Islamabad</a>
    </div>
    <div class="nav-right">
      <a class="btn btn-primary" href="{wa}" target="_blank" rel="noopener">Talk to Us</a>
    </div>
  </div>
</nav>

<header class="hero cs-hero">
  <span class="glow glow-hero"></span>
  <div class="wrap" style="position:relative;z-index:1">
    <p class="crumb"><a href="/">Home</a> &rsaquo; <a href="/#work">Work</a> &rsaquo; {c["client"]}</p>
    <span class="eyebrow">{c["eyebrow"]}</span>
    <h1>{c["h1"]}</h1>
    <p class="standfirst">{c["standfirst"]}</p>
    <div class="hero-cta" style="margin-top:26px">
      <a class="btn btn-primary btn-arrow" href="{c["live"]}" target="_blank" rel="noopener">Visit the live site<i aria-hidden="true">&#8594;</i></a>
      <a class="btn btn-ghost" href="#decisions">How we built it</a>
    </div>

    <dl class="meta-row rv">
{meta_row(c["meta"])}
    </dl>

    <div class="shotframe rv">
      <div class="shotbar" aria-hidden="true"><i></i><i></i><i></i><em>{c["live_label"]}</em></div>
      <img src="{c["poster"]}" alt="{c["poster_alt"]}" width="880" height="1815" loading="lazy" decoding="async">
      <p class="shotcap">The live site at <a href="{c["live"]}" target="_blank" rel="noopener">{c["live_label"]}</a></p>
    </div>
  </div>
</header>

<section style="padding-top:20px">
  <div class="wrap">
    <p class="kicker rv">The brief</p>
    <h2 class="rv">{c["brief_heading"]}</h2>
    <div class="prose rv" style="margin-top:20px">
{paras(c["brief"])}
    </div>
    <div class="loc-grid rv">
{cards(c["challenges"])}
    </div>
  </div>
</section>

<section id="decisions" style="padding-top:20px">
  <div class="wrap">
    <p class="kicker rv">The approach</p>
    <h2 class="rv">The decisions that shaped the site</h2>
    <p class="pull rv">{c["pull"]}</p>
    <div class="rv">
{decisions(c["decisions"])}
    </div>
  </div>
</section>

<section style="padding-top:20px">
  <div class="wrap">
    <p class="kicker rv">The build</p>
    <h2 class="rv">What shipped</h2>
    <div class="loc-grid rv">
{cards(c["built"])}
    </div>
  </div>
</section>

<section style="padding-top:20px">
  <div class="wrap">
    <p class="kicker rv">Where it stands</p>
    <h2 class="rv">The site in service</h2>
    <div class="statrow rv">
{stats(c["stats"])}
    </div>
    <p class="src-note rv">{c["stats_note"]}</p>
  </div>
</section>

<section style="padding-top:20px">
  <div class="wrap">
    <p class="kicker rv">What we took from it</p>
    <h2 class="rv">What this project taught us</h2>
    <div class="prose rv" style="margin-top:20px">
{paras(c["lessons"])}
    </div>
  </div>
</section>

<section style="padding-top:20px">
  <div class="wrap">
    <p class="kicker rv">More work</p>
    <h2 class="rv">Other projects</h2>
    <div class="loc-grid rv">
{cards(c["_others"])}
    </div>
  </div>
</section>

<section id="contact" style="padding-top:20px">
  <div class="wrap">
    <div class="cta-band rv">
      <h2>{c["cta_h"]}</h2>
      <p>{c["cta_p"]}</p>
      <div class="band-cta">
        <a class="btn btn-primary" href="{wa}" target="_blank" rel="noopener">WhatsApp us</a>
        <a class="btn btn-ghost" href="/pricing/">See pricing</a>
        <a class="btn btn-ghost" href="mailto:hello@designsredefined.com">hello@designsredefined.com</a>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap foot">
    <div>
      <a class="wordmark" href="/" style="margin-bottom:12px">Designs Redefined</a>
      <address>
        Islamabad, Islamabad Capital Territory, Pakistan<br>
        <a href="tel:+923374841818">+92 337 484 1818</a><br>
        <a href="mailto:hello@designsredefined.com">hello@designsredefined.com</a><br>
        <span>Mon&ndash;Sat, 10:00&ndash;19:00 PKT</span>
      </address>
    </div>
    <div class="foot-links">
      <a href="/">Home</a>
      <a href="/#work">Work</a>
      <a href="/pricing/">Pricing</a>
      <a href="/islamabad-web-design/">Web Design Islamabad</a>
      <a href="/rawalpindi-web-design/">Web Design Rawalpindi</a>
    </div>
    <div class="social">
      <a href="{wa}" target="_blank" rel="noopener" aria-label="WhatsApp">WA</a>
      <a href="https://www.facebook.com/designsredefined" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
    </div>
  </div>
  <div class="wrap" style="margin-top:32px">
    <small>&copy; 2026 Designs Redefined. All rights reserved.</small>
  </div>
</footer>

<script>
var io=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{e.target.classList.add('on');io.unobserve(e.target)}}}})}},{{threshold:.12}});
document.querySelectorAll('.rv').forEach(function(el){{io.observe(el)}});
</script>
</body>
</html>
'''


def main():
    teaser = {
        "al-qanoon-e-stamps": "A WhatsApp-first service site selling official e-stamp paper in Islamabad and Rawalpindi, round the clock.",
        "oakly": "A furniture storefront selling handmade solid oak at PKR 118,000 to 295,000, with no showroom to fall back on.",
        "danial-hyatt": "A motion designer's portfolio turned into a product, with fixed packages and a free storyboard before payment.",
    }
    for slug, c in DATA.items():
        c["_others"] = [
            (f'<a href="/work/{s}/">{DATA[s]["client"]}</a>', teaser[s])
            for s in DATA if s != slug
        ]
        out = ROOT / "work" / slug / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page(slug, c), encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)}")

    print("\nsitemap entries:")
    for slug in DATA:
        print(f"  {SITE}/work/{slug}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
