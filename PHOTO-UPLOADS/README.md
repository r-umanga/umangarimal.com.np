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
