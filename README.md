# Umanga Rimal — Through the lens

Complete portfolio source and media, updated 3 October 2026. A personal photography and filmmaking showcase from Nepal.

## Included

- Interactive Canon EOS 850D camera, scroll motion, hover and pointer response.
- Animated EF-S 18–55mm / 55–250mm lens exchange with matching photo collections.
- 19 original photographs, category filters and a keyboard/touch lightbox.
- The updated pale gray suit portrait in About.
- Break the pattern reel with a modal player and lazy-loaded video.
- Before/after color study, continuously moving marquee and custom cursor.
- Education, interests, Knowbit AI, QnA Book and email/Instagram contact.

All runtime JavaScript, models, textures, fonts, photographs and video are included locally. No ChatGPT account, API key or subscription is required to run this website.

## Run locally

Install Node.js, open a terminal at the repository root, then run:

```sh
npm run dev
```

Open http://localhost:4173. No npm install or build is needed. Use the local server instead of double-clicking index.html because the camera and JavaScript modules need HTTP.

## Deploy with Vercel

Import this GitHub repository into Vercel. The included vercel.json uses:

- Framework: Other
- Root directory: repository root
- Build and install commands: empty
- Output directory: dist

If your existing Vercel project is connected to main, its configured automatic deployment can use this commit. Domain and deployment settings remain in your Vercel account. The canonical and social-preview URLs in dist/index.html use https://umangarimal.com.np; update those URLs if you use a different primary domain.

## Edit content

- `dist/content.js`: one photo list, photo categories/lens assignments, portrait, reel, contact details and project descriptions.
- `dist/photos/`: gallery photographs, thumbnails, portrait, reel cover, color pair and social preview.
- `dist/assets/work/break-the-pattern.mp4`: the reel video.
- `PHOTO-GUIDE.md`: every photo and its position on the website.
- `dist/index.html`: page sections, education and introductory text.
- `dist/style.css`: layouts, colors, typography and responsive styles.
- `dist/app.js`: main interactions.
- `dist/camera-rig.js`, `dist/camera-motion.js`, `dist/lens-gallery.js`: camera journey, physical lens exchange and photo orbit.
- `docs/content-editing.md`: photo filename mappings and instructions.

The first five gallery photos belong to the 55–250mm lens, and the next three to the 18–55mm lens. The eleven later photos appear in the main gallery but have no lens assignment yet. Assign their `lens` values in content.js once confirmed.

The contact form prepares a message for the visitor's email app; it does not send or store messages on a server. Camera motion stays on as requested, with rendering paused when hidden or unnecessary. A measured Lighthouse score is not included.

## Assets and maintenance

Desktop and mobile camera/lens GLBs are included along with turntable fallbacks. Optional model preparation scripts are in scripts; they are not required for running or deploying the site. Preserve the font and Three.js license notices in dist/assets. The color comparison retains its existing study pair.
