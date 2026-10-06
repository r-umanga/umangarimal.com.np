# Your photo folder

Put future original JPG/PNG photos in this folder while editing. It is not deployed. Website-ready WebP copies live in `dist/photos/`.

| Photo | Website location | Runtime file |
| --- | --- | --- |
| IMG_5489 (2).JPG | Before side of color slider | dist/photos/color/grade-original.webp |
| IMG_5489.jpg | After side of color slider | dist/photos/color/grade-after.webp |
| Portrait on motorcycle | Portraits filter, featured orbit, photobook | dist/photos/gallery/two-smiles.webp |
| Portrait by carved pillar | Portraits filter, featured orbit, photobook | dist/photos/gallery/beside-the-carved-pillar.webp |
| Your gray suit portrait | Hero introduction and My desk | dist/photos/about/umanga-rimal-portrait-gray.webp |
| Passing by | Hero print and photobook cover | dist/photos/gallery/thumbnails/passing-by-small.webp |
| In flight | Hero print and telephoto lens collection | dist/photos/gallery/in-flight.webp |
| Gold and white | Third hero print | dist/photos/gallery/gold-and-white.webp |

All 21 photographs are listed once in `dist/content.js`. To add another: create a full WebP, a thumbnail, and an orbit preview in the corresponding `dist/photos/gallery/` folders, then add one entry to `photos`. Use category `portraits`, `street`, `light`, `nature`, or `events`. Assign `lens` only when you know which lens you used.

The orbit shows 10 featured photographs. Change `featured` in `dist/orbit-gallery.js` to choose those; all photographs remain in the book and category filters. See PHOTO-GUIDE.md for the complete mapping.

## Complete gallery order

| Order | Photo | Category | Full image |
| --- | --- | --- | --- |
| 1 | In flight | Nature | dist/photos/gallery/in-flight.webp |
| 2 | By the water | Nature | dist/photos/gallery/by-the-water.webp |
| 3 | Crescent | Light studies | dist/photos/gallery/crescent.webp |
| 4 | A curious look | Nature | dist/photos/gallery/young-macaque.webp |
| 5 | Quiet watch | Nature | dist/photos/gallery/quiet-watch.webp |
| 6 | Passing by | Street | dist/photos/gallery/passing-by.webp |
| 7 | Dashboard light | Light studies | dist/photos/gallery/dashboard-light.webp |
| 8 | In motion | Events | dist/photos/gallery/in-motion.webp |
| 9 | Temple steps | Street | dist/photos/gallery/temple-steps.webp |
| 10 | Golden rooftops | Street | dist/photos/gallery/golden-rooftops.webp |
| 11 | Night rush | Light studies | dist/photos/gallery/night-rush.webp |
| 12 | Through the arch | Street | dist/photos/gallery/through-the-arch.webp |
| 13 | Beneath the canopy | Nature | dist/photos/gallery/beneath-the-canopy.webp |
| 14 | Yellow afterglow | Events | dist/photos/gallery/yellow-afterglow.webp |
| 15 | Headlights | Events | dist/photos/gallery/headlights.webp |
| 16 | After dark | Events | dist/photos/gallery/blue-hour-machine.webp |
| 17 | Toward the sky | Street | dist/photos/gallery/toward-the-sky.webp |
| 18 | Courtyard and cloud | Street | dist/photos/gallery/courtyard-and-cloud.webp |
| 19 | Gold and white | Street | dist/photos/gallery/gold-and-white.webp |
| 20 | Two smiles | Portraits | dist/photos/gallery/two-smiles.webp |
| 21 | Beside the carved pillar | Portraits | dist/photos/gallery/beside-the-carved-pillar.webp |

## Photo stories

Drafts entered with Edit photo stories stay in your browser. Download the JSON as a backup. To publish stories for all visitors, add the exported entries to `photoStories` in `dist/content.js`. No server or cloud saving is included.
