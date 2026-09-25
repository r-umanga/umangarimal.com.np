# Umanga Rimal — Through the lens

A new, static photography and cinematography portfolio. Open through a local HTTP server, or deploy the `dist` directory.

## Content

- `dist/content.js`: photographs, portrait and Knowbit AI description/link.
- `dist/index.html`: personal story, studies, experience, interests and project copy.
- `dist/style.css`: responsive editorial layout and motion preferences.
- `dist/app.js`: reversible 3D camera motion, photo filtering, keyboard-accessible lightbox and color comparison.
- `dist/assets/three.module.js`: Three.js r160, distributed under the MIT license (copyright Three.js authors).

Sample photographs are inherited from the previously supplied portfolio archive. They are labelled as sample imagery and are not attributed to Umanga. Replace with original photographs before using this as a finished public portfolio. A portrait slot is intentionally empty. School names, education dates, grades, commercial clients and unconfirmed Knowbit AI features are not invented.

The camera uses one permanent Three.js canvas across the hero, archive and kit. It renders in front of the hero photos, passes behind the archive, and returns to a reserved space above the kit heading. The archive follows the hero in normal flow with no negative overlap. Camera translation and rotation use time-based damping, pointer parallax and a gentle idle float. Offscreen rendering pauses. Motion is enabled by default, with no toggle or saved override; the camera remains animated regardless of the OS setting, as explicitly requested by the owner. There is no scroll hijacking or video dependency.

## Ready for original content

Set `portrait` to a local image path and replace the four photo records. Supply Knowbit AI's real description and URL. Update each gallery caption and remove the sample labels after replacing the inherited images. Update the film cover and color comparison with original work. The film link currently goes to Umanga's Instagram reels.

Validation: JavaScript syntax, HTML ID uniqueness, all internal navigation targets and local asset references checked. Desktop and narrow-screen browser visual checks were performed.

The personal opening includes the full name, Nepal location, creative disciplines, student identity and Instagram. A two-second lowercase ur. intro cycles default sans, dot-matrix, geometric, system-style and cinematic serif typefaces. A fine-pointer optical cursor supports contextual hover states and the fullscreen gallery. Touch and keyboard retain native interaction. Font treatments are inspired by the requested styles, not proprietary brand fonts. Camera boundaries and kit placement checked in desktop and mobile layouts.


## Camera continuity and regression repair

The camera now lives in one sticky viewport canvas spanning the hero, photo archive and kit. Its position and angle follow a single continuous geometry-based path. The opaque archive panel covers the moving camera at its upper boundary and uncovers it at its lower boundary. There is no canvas reparenting, opacity fade or section-mode angle reset. The kit camera stays above its introduction throughout the rotation. Filtering updates the archive geometry and removes inappropriate stagger spacing. Photo frames preserve their intended image proportions.

Browsers without WebGL receive a Canvas 2D projection of the same 3D meshes instead of unrelated sample imagery. The development browser had WebGL disabled, so rendered visual checks exercised this fallback. Desktop and 390px frame checks cover layout, archive occlusion, kit entry, photo filtering, next-photo navigation, Escape, keyboard color comparison, project expansion and removal of the motion toggle. GPU shading remains unverified in this browser. Source syntax and camera continuity are checked separately.

Run `npm run dev -- --host 0.0.0.0 --port 4173` to serve the authored static output. The development-only `/__qa/mobile` route embeds the site at 390px for layout inspection; it is not included in the deployed static output.

## September 19 refinement

Hero camera stacking is above the photographs. The archive begins after the hero instead of overlapping its footer. Kit camera placement follows a DOM anchor above the heading, including when the sticky section releases. Scroll changes are damped with elapsed time; pointer movement also translates and rotates the model, and a small idle bob continues while visible. The cursor is a neutral fine ring with a center point and integrated hover labels. No local motion preference is read or stored.

Motion repair: removed the system-preference path that froze rotation and hover while allowing positional scroll changes. Increased idle float to 0.075 scene units and kit rotation to a complete turn. Versioned entry assets avoid a stale cached animation module.


## Final Canon model — September 22

`dist/assets/canon-850d.glb` is the user's final `textured_real_v2.glb`, copied byte-for-byte. The local r160 GLTFLoader imports its embedded albedo, packed metallic/roughness and normal textures. Bounds normalize the model to the existing scroll rig; geometry and material settings are preserved. Hero layering, kit anchor, idle float, pointer response and rotation remain on the existing motion clock.

Without WebGL, `turntable-camera.js` uses a transparent 72-angle atlas rendered from the actual supplied GLB. This avoids a slow CPU triangle renderer and keeps yaw, hover and translation. Pitch is simplified in this fallback. The primary GLB loader is verified independently in the development-only `/__qa/model` route. The cloud browser cannot verify hardware WebGL shading.

### Lens/photo interaction preparation

`lensSets` in `content.js` currently contains the confirmed 18–55mm entry with no original photographs. Do not attribute the existing sample archive photographs to this lens. `lens-gallery.js` supports floating photo sets, gallery opening, horizontal swipes, keyboard arrows, loading/error state and previous/next controls. Controls remain hidden with one set. A model-switch callback is deliberately required before another set can activate.

Still required from the owner: standalone second lens GLB, exact lens name, and original photos grouped by lens. The supplied camera has one fused mesh (body plus attached lens); separate/cut and validate the existing lens at its mount, align the second lens, then implement the physical detach/attach callback and side lens preview when that asset arrives. Actual lens replacement and lens galleries are not live yet. Preserve existing camera behavior while completing that next step.
