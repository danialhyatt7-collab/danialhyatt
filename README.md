# danialhyatt

Islamabad local-SEO work for [designsredefined.com](https://designsredefined.com/).

## What's here

| Path | What it is |
|---|---|
| `index.html` | The live homepage **with Islamabad localisation applied** — local business + FAQ schema, geo meta, rewritten title/description, a new `#areas` section and NAP in the footer. |
| `pricing/` | PKR pricing page targeting "website design cost in Pakistan", with `OfferCatalog` + `FAQPage` markup. **Confirm the numbers before deploying — see below.** |
| `islamabad-web-design/` | New city landing page targeting "web design Islamabad". |
| `rawalpindi-web-design/` | New city landing page targeting "web design Rawalpindi". |
| `assets/site.css` | The homepage's stylesheet, extracted verbatim so the city pages match the site exactly. |
| `sitemap.xml`, `robots.txt` | Submit the sitemap in Search Console. |
| `LOCAL-SEO.md` | The off-site plan: Google Business Profile, reviews, citations, keywords. **Read this — it matters more than the code.** |

## Important: this is not the full site source

`index.html` was fetched from the live site, so the repo has the markup but **not** the
image assets it references (`assets/og.jpg`, the client screenshots, the vendor JS for
the contact-band canvas). Running it locally will show 404s for those.

Two ways to use this:

1. **Preferred** — copy the changes into your real repo. The homepage edits are
   self-contained: the `<script type="application/ld+json">` and geo meta in `<head>`,
   the `<section id="areas">` block before `#contact`, the footer `<address>`, and the
   rewritten title/description tags. The two city directories drop in as-is.
2. Or drop this repo's real `assets/` folder in and deploy as is.

## Run it locally

```sh
python3 -m http.server 8777
```

Then open http://127.0.0.1:8777/ — the city pages are at `/islamabad-web-design/`
and `/rawalpindi-web-design/`.

## The pricing numbers are placeholders

`pricing/` ships with starting prices I set from the Pakistani market, positioned above
the template crowd because you sell hand-built work:

| Package | From |
|---|---|
| Landing page | PKR 45,000 |
| Business website (5–8 pages) | PKR 120,000 |
| Online store | PKR 250,000 |
| Site care | PKR 12,000/month |
| SEO retainer | PKR 35,000/month |
| Branding | PKR 60,000 |

**These are my estimates, not your prices.** Edit them before the page goes live — and
when you do, change them in three places so the markup keeps matching the page: the tier
cards, the `OfferCatalog` JSON-LD in `<head>`, and the FAQ answers (both the visible
`<details>` and the `FAQPage` JSON-LD). Mismatched price markup is a manual-action risk.

The same goes for the payment terms (50/50), the 30-day free-fix window, and the domain
and hosting estimates. They read as commitments to a client, so they need to be true.

## Before deploying

- Confirm `assets/og.jpg` exists at 1200x630, or every shared link renders as a grey box.
- The business address in the schema is city-level only (`Islamabad`, ICT). If you have a
  street address you want public, add it to the JSON-LD **and** the footer, and make it
  match your Google Business Profile exactly. If you don't, leave it as is and run the
  profile as a service-area business.
- Hours are set to Mon–Sat 10:00–19:00 PKT. Change them in the JSON-LD and the footer if
  that's wrong — they must match the profile.
