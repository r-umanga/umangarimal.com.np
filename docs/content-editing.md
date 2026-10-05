# Editing the personal portfolio

Edit `dist/content.js`. The website creates the archive, category filters and both lens photo collections from one `photos` list. Nineteen original photographs are included; add more entries whenever ready. Do not repeat photographs to fill space.

## Add a photograph

Save a full WebP (up to 1800 px on the long edge) and a small WebP (up to 720 px wide, 900 px high) under `dist/photos/gallery/` (thumbnails in `dist/photos/gallery/thumbnails/`). Add:

```js
{
 id:'unique-short-name', title:'Your title',
 category:'street', categoryLabel:'Street',
 src:'photos/gallery/unique-short-name.webp',
 thumb:'photos/gallery/thumbnails/unique-short-name-small.webp',
 width:1080, height:1350, thumbWidth:720, thumbHeight:900,
 alt:'Describe what is visible in this photograph.',
 lens:'kit-18-55', note:'EF-S 18–55mm'
}
```

Use actual exported dimensions. Categories: `street`, `light`, `events`, `nature`. Empty categories hide automatically. Lens IDs: `kit-18-55`, `tele-55-250`. The archive lightbox follows the selected category; lens lightboxes follow the selected lens. Up to four floating previews represent each lens collection, and all images in that collection are available through next/previous.

## Current source mapping

| Upload | Web filename | Lens |
| --- | --- | --- |
| 1(1).jpg | in-flight | 55–250mm |
| 2.jpg | by-the-water | 55–250mm |
| 3.jpg | crescent | 55–250mm |
| 4.png | young-macaque | 55–250mm |
| 5.png | quiet-watch | 55–250mm |
| 641246670_1002414926288471_7011341915063474987_n.png | passing-by | 18–55mm |
| 719491148_1155133481016614_8356948500077873048_n.jpg | dashboard-light | 18–55mm |
| 720634675_1155133444349951_6272684120283854652_n.jpg | in-motion | 18–55mm |

Hero prints currently use passing-by and in-flight thumbnails. Update their HTML sources, alt text and captions together if replacing them. Social preview uses passing-by as a JPEG, with matching Open Graph/Twitter metadata.

## Reel

`portfolio.videos[0]` controls the reel title, description, poster, MP4 and duration. The current upload is shown intact as Break the pattern, including its editing timeline. The MP4 is fetched only after pressing Play; closing the dialog pauses and releases the source. The visible reel card has a WebP poster. Update its initial HTML text and poster too when replacing the reel.

## About, projects and email

- Set `portfolio.portrait` to an original portrait path; the empty portrait area stays hidden until its image loads.
- The public email is `r.umanga@outlook.com`, stored in `portfolio.contact.email`. Change it here if needed. The email link then appears and the message composer offers an encoded mailto draft. Without an email it offers copy + Instagram. No server delivery or automatic sending is implemented.
- Knowbit is an API-based chatbot and image generator built in Class 9. QnA Book connects Class 10 students through question posts and answer comments. Specific API providers and the current QnA web stack remain unconfirmed; add them to the corresponding project record only when known. Empty facts remain hidden. The linked QnA Book website is a development preview; its current stack has not been confirmed, so older Flutter/Firebase history is not assigned to this new link.
- The existing before/after component remains a color-treatment study using the original paired assets. No original ungraded/graded pair was supplied in this batch. Replace both study images and their alt text together when available.

## Technical notes

Mobile loads 1024 px camera textures, uses a maximum pixel ratio of 1.15 and caps continuous rendering around 30 fps. Desktop retains the full model textures. Model geometry and mount offsets are unchanged. The owner selected always-on motion on October 2: device reduced-motion preferences do not disable the camera or page animation. Video/photo dialogs pause background camera rendering. The loader waits at least two seconds and until a camera frame is rendered.

Browser visual QA and Lighthouse are not available in this session; no score is asserted. The original audience is preserved. The separate temporary site is untouched.


## October 2 evening uploads

Pale Gray Suit Portrait with Plaid Tie(1).png is the About portrait (umanga-rimal-portrait-gray.webp), preserving its full 2:3 composition. It replaces DSC_1179 copy copy.jpg. Eleven additional photographs are in the main archive; the archive now contains 19 photographs. Their original files have no lens EXIF and no lens assignment was provided, so lens:null intentionally keeps them out of either lens-specific collection pending confirmation.

| Upload | Web filename | Category |
| --- | --- | --- |
| IMG_2513.JPG | temple-steps | Street |
| IMG_2533.JPG | golden-rooftops | Street |
| IMG_3810.JPG | night-rush | Light studies |
| IMG_4283.JPG | through-the-arch | Street |
| IMG_4500.JPG | beneath-the-canopy | Nature |
| IMG_6078.JPG | yellow-afterglow | Events |
| IMG_6111.JPG | headlights | Events |
| IMG_6157.JPG | blue-hour-machine | Events |
| IMG_6547.JPG | toward-the-sky | Street |
| IMG_6637.JPG | courtyard-and-cloud | Street |
| IMG_6645.JPG | gold-and-white | Street |
