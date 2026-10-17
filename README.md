# danialhyatt.com

Portfolio site for **Danial Hyatt** — motion graphic designer specialising in
**15-second product motion design ads**.

Cinematic, dark, oversized-type aesthetic (inspired by the National Geographic
"Wildlife" landing page reference). Pure static HTML/CSS/JS — host anywhere
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any static host).

## Sections
- **01 Home** — full-screen hero with showreel play button
- **02 Portfolio** — grid of video placements (lightbox playback)
- **03 About** — bio, stats, tools
- **04 Pricing** — three packages with delivery timeframes
- **05 Contact** — brief form (opens email client) + email link

## Adding your real content

### Showreel & hero video
Drop your files in `assets/`:
- `assets/video/showreel.mp4` — hero background + "Watch showreel" button
- `assets/img/hero-poster.jpg` — hero poster (shown before video loads)

If no video is present, a cinematic gradient fallback is used automatically.

### Portfolio videos
Edit the `WORK` array at the top of `script.js`:

```js
const WORK = [
  {
    cat:   "Tech · 15s",                 // small label
    title: "Pulse App Launch",           // card title
    poster: "assets/img/pulse.jpg",      // thumbnail (optional)
    video: "https://www.youtube.com/embed/XXXX"  // YouTube/Vimeo embed OR local mp4
  },
  // ...
];
```
- `video` accepts a YouTube/Vimeo **embed** URL or a local `.mp4` path.
- Leave `poster` empty to use a generated gradient placeholder.

### Pricing & timelines
Edit the three `.plan` blocks in `index.html` (prices, delivery times, features).

### Contact email
Replace `hello@danialhyatt.com` in `index.html` and `script.js` with your address.
For a hosted form (no email-client popup), wire the form to Formspree/Getform.

## Local preview
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
