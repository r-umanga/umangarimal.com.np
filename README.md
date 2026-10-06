# Umanga Rimal — final portfolio export

Final snapshot: 6 October 2026. Contains the bound photobook, My desk, lens stories, photo-story editor, camera offscreen pause/resume, the supplied car before/after edit, and 21 gallery photographs including two new portrait shoots. Annotation feedback mode is removed.

## Vercel deployment

Upload all contents of this folder to your repository, keeping `dist/` and `vercel.json` at the root. On Vercel choose framework **Other**, leave build and install commands empty, and set Output Directory to **dist**. The included vercel.json sets these options. No TanStack, npm install, API keys, or build step is required.

## Preview locally

From this folder run `python -m http.server 8000 --directory dist`, then open http://localhost:8000. A local HTTP server is required for the JavaScript modules and camera assets; do not double-click index.html.

## Photos and edits

Read PHOTO-GUIDE.md and PHOTO-UPLOADS/README.md for the exact photo locations and adding photos. All gallery data is in `dist/content.js`. The supplied originals are kept in PHOTO-UPLOADS; deployed WebP files are in dist/photos.

## Contact and stories

The contact form prepares a message in the visitor's email app; it does not send mail by itself. Photo-story drafts save in the browser. Download them as JSON, then add their entries to `photoStories` in content.js to publish them for everyone.

## Camera and motion

The supplied 3D camera and lenses remain. Rendering stops when the camera is offscreen, covered by the archive or a dialog, or the tab is hidden, and resumes with the selected lens and scroll position. There is no low-memory device mode. The full turntable fallback is used only if WebGL is unavailable. Preserve font and Three.js license notices in dist/assets.

## Responsive camera update

Camera and spare-lens positions use reserved page areas instead of fixed screen-height scaling. Camera size follows the available area; the spare lens has its own area. Incoming and outgoing lenses follow separate vertical paths. Layout geometry was checked at 14 viewport sizes from 280px to 3440px; physical-device visual testing is still recommended.
