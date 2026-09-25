# Umanga Rimal — cinematic portfolio

Complete editable export of the current portfolio, 25 September 2026.
All website HTML, CSS, JavaScript, fonts, sample photos, camera textures and 3D assets are included locally. No API keys, database, paid runtime or ChatGPT connection are required to run this static website.

## Run on your computer

1. Extract this ZIP.
2. Open the `umanga-portfolio` folder in VS Code.
3. With Node.js installed, open a terminal in that folder and run:

   npm run dev

4. Open http://localhost:4173 in your browser.

No npm install is required: there are no runtime package dependencies. Use the local server rather than double-clicking index.html, because browser JavaScript modules and the camera load over HTTP.

## Deploy to Vercel through GitHub

1. Extract the ZIP; upload the contents of `umanga-portfolio` to a GitHub repository. Upload the files, not the ZIP itself. Keep `package.json`, `vercel.json` and `dist` together at the repository root.
2. In Vercel, import that repository. If using an existing repository/project, back up its current files before replacing them and check the existing project settings.
3. Use these settings (also included in vercel.json):
   - Framework preset: Other
   - Root directory: the repository root containing vercel.json
   - Build command: empty / no build
   - Install command: empty / skip
   - Output directory: dist
4. Deploy. If your repository is already connected to Vercel, pushing the files triggers its normal deployment process.
5. Connect your domain in the Vercel project's domain settings, following the DNS records Vercel supplies.

Configuration reference: https://vercel.com/docs/project-configuration/vercel-json
Build reference: https://vercel.com/docs/builds/configure-a-build

Only the `dist` directory is published. Scripts and development notes are for local use. This export has not been deployed to your Vercel account.

## Edit the portfolio

- `dist/index.html`: page sections, biography, education, experience and project text.
- `dist/content.js`: gallery entries, portrait, project details and lens photo sets.
- `dist/style.css`: layout, typography, cursor and visual styling.
- `dist/app.js`: interactions and 3D camera rendering.
- `dist/camera-motion.js`: scroll path and camera placement.
- `dist/lens-gallery.js`: prepared lens/photo gallery controls.
- `dist/assets/canon-850d.glb`: current camera with embedded textures.
- `dist/assets/canon-turntable.webp` and `canon-poster.webp`: current camera fallback images.
- `scripts/render-camera-turntable.py`: optional offline tool to regenerate those fallback images when replacing the model; requires Python, NumPy, trimesh, pyrender, Pillow, PyOpenGL 3.1.10 and an EGL-capable rendering environment. It is not needed for deployment.

## What is included and what is pending

The current camera is the previously supplied textured_real_v2.glb. The KIRI Engine replacement has not been supplied yet. Replacing the camera also requires checking its size/orientation and refreshing the fallback images.

Scroll motion, rotation, idle hover, pointer response, cursor, loader, photo archive and other existing portfolio sections are included. Physical lens detaching/attaching and the second lens preview are not implemented yet. They need a separate lens model and photographs grouped by lens; the current camera body and lens are a fused mesh.

The archive currently contains clearly labelled sample photographs. Your portrait and original lens photo sets still need to be added. Knowbit AI's final details/link should be confirmed. Preserve third-party license and font notice files in dist/assets.

This is your current working backup, not the finished content collection. More detailed implementation notes are in docs/DEVELOPMENT-NOTES.md.
