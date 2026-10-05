# Photo guide

All website photographs are in `dist/photos/`. Edit the single `photos` list in `dist/content.js` to add, reorder or categorize gallery images. Paths in that list are relative to `dist/`.

## Where each image appears

| Image | Website position | File |
| --- | --- | --- |
| Passing by thumbnail | First floating print in the opening hero | `dist/photos/gallery/thumbnails/passing-by-small.webp` |
| In flight thumbnail | Second floating print in the opening hero | `dist/photos/gallery/thumbnails/in-flight-small.webp` |
| Pale gray suit portrait | About section | `dist/photos/about/umanga-rimal-portrait-gray.webp` |
| Previous black suit portrait | Backup only; not displayed | `dist/photos/about/previous-black-suit-portrait.webp` |
| Break the pattern cover | Reel card | `dist/photos/reel/break-the-pattern-poster.webp` |
| Original color study | Before side of comparison slider | `dist/photos/color/grade-original.webp` |
| Graded color study | After side of comparison slider | `dist/photos/color/grade-after.webp` |
| Motorcycle riders preview | Social sharing preview | `dist/photos/social/social-preview.jpg` |

## Gallery order and lens collections

All rows appear in Life, observed. The gallery lightbox follows the selected category. Lens-assigned photos also appear with their matching lens in the camera-kit section; up to four are shown floating at once.

| Order | Title | Category | Lens | Full-size file |
| --- | --- | --- | --- | --- |
| 1 | In flight | Nature | 55–250mm | `dist/photos/gallery/in-flight.webp` |
| 2 | By the water | Nature | 55–250mm | `dist/photos/gallery/by-the-water.webp` |
| 3 | Crescent | Light studies | 55–250mm | `dist/photos/gallery/crescent.webp` |
| 4 | A curious look | Nature | 55–250mm | `dist/photos/gallery/young-macaque.webp` |
| 5 | Quiet watch | Nature | 55–250mm | `dist/photos/gallery/quiet-watch.webp` |
| 6 | Passing by | Street | 18–55mm | `dist/photos/gallery/passing-by.webp` |
| 7 | Dashboard light | Light studies | 18–55mm | `dist/photos/gallery/dashboard-light.webp` |
| 8 | In motion | Events | 18–55mm | `dist/photos/gallery/in-motion.webp` |
| 9 | Temple steps | Street | Not assigned yet | `dist/photos/gallery/temple-steps.webp` |
| 10 | Golden rooftops | Street | Not assigned yet | `dist/photos/gallery/golden-rooftops.webp` |
| 11 | Night rush | Light studies | Not assigned yet | `dist/photos/gallery/night-rush.webp` |
| 12 | Through the arch | Street | Not assigned yet | `dist/photos/gallery/through-the-arch.webp` |
| 13 | Beneath the canopy | Nature | Not assigned yet | `dist/photos/gallery/beneath-the-canopy.webp` |
| 14 | Yellow afterglow | Events | Not assigned yet | `dist/photos/gallery/yellow-afterglow.webp` |
| 15 | Headlights | Events | Not assigned yet | `dist/photos/gallery/headlights.webp` |
| 16 | After dark | Events | Not assigned yet | `dist/photos/gallery/blue-hour-machine.webp` |
| 17 | Toward the sky | Street | Not assigned yet | `dist/photos/gallery/toward-the-sky.webp` |
| 18 | Courtyard and cloud | Street | Not assigned yet | `dist/photos/gallery/courtyard-and-cloud.webp` |
| 19 | Gold and white | Street | Not assigned yet | `dist/photos/gallery/gold-and-white.webp` |

Each thumbnail uses the same filename with `-small` before `.webp`, inside `dist/photos/gallery/thumbnails/`.

## Add or replace photos

1. Put full WebP images in `dist/photos/gallery/` and smaller versions in its `thumbnails/` folder.
2. Add an entry to `dist/content.js` with the full path, thumbnail path, title, category, actual dimensions, descriptive alt text and lens assignment.
3. Use `kit-18-55`, `tele-55-250`, or `null` for the lens. Do not assign a lens until you know which was used.
4. To replace hero prints, About portrait or reel cover, update their initial HTML in `dist/index.html` too. Keep the portrait/reel data in `dist/content.js` consistent.
5. When replacing the social image, update its dimensions and alt text in the Open Graph/Twitter tags in `dist/index.html`.

The reel video stays at `dist/assets/work/break-the-pattern.mp4`. 3D models and camera fallback images stay in `dist/assets/`. Original uploaded filenames are mapped in `docs/content-editing.md`.
