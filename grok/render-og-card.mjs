import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const cinzel = readFileSync("/workspace/.grok/fonts/Cinzel-Regular.ttf.b64", "utf8");
const cinzelDec = readFileSync(
  "/workspace/.grok/fonts/CinzelDecorative-Regular.ttf.b64",
  "utf8",
);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    @font-face {
      font-family: "Cinzel";
      src: url(data:font/ttf;base64,${cinzel}) format("truetype");
      font-weight: 400 900;
      font-style: normal;
    }
    @font-face {
      font-family: "Cinzel Decorative";
      src: url(data:font/ttf;base64,${cinzelDec}) format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #0a0908;
    }
    .stage {
      position: relative;
      width: 1200px;
      height: 630px;
      background:
        radial-gradient(ellipse 78% 62% at 50% 48%, #161310 0%, #0a0908 72%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flare {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 42% 18% at 50% 50%, rgba(179,145,91,0.22), transparent 70%),
        linear-gradient(90deg,
          transparent 0%,
          rgba(239,233,221,0.03) 44%,
          rgba(179,145,91,0.16) 50%,
          rgba(239,233,221,0.03) 56%,
          transparent 100%);
      pointer-events: none;
    }
    .iris {
      position: absolute;
      width: 460px;
      height: 460px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -51%);
      opacity: 0.62;
      pointer-events: none;
    }
    .frame {
      position: absolute;
      inset: 28px;
      border: 1px solid rgba(179,145,91,0.28);
      pointer-events: none;
    }
    .frame::after {
      content: "";
      position: absolute;
      inset: 7px;
      border: 1px solid rgba(179,145,91,0.10);
    }
    .lockup {
      position: relative;
      z-index: 2;
      text-align: center;
      width: 760px;
    }
    .mark {
      width: 56px;
      height: 56px;
      margin: 0 auto 22px;
      display: block;
    }
    .name {
      font-family: "Cinzel Decorative", Cinzel, serif;
      font-weight: 400;
      font-size: 86px;
      line-height: 0.98;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #b3915b;
      text-shadow: 0 0 36px rgba(179,145,91,0.28);
    }
    .name span {
      display: block;
    }
    .name .second {
      letter-spacing: 0.28em;
      padding-left: 0.28em;
    }
    .rule {
      width: 88px;
      height: 1px;
      margin: 26px auto 18px;
      background: linear-gradient(90deg, transparent, #b3915b, transparent);
    }
    .tag {
      font-family: Cinzel, serif;
      font-size: 14px;
      letter-spacing: 0.62em;
      text-transform: uppercase;
      color: #efe9dd;
      opacity: 0.78;
      padding-left: 0.62em;
    }
    .grain {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.22;
      mix-blend-mode: overlay;
    }
  </style>
</head>
<body>
  <div class="stage">
    <div class="flare"></div>
    <svg class="iris" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#b3915b" stop-opacity="0.20"/>
          <stop offset="58%" stop-color="#b3915b" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="#b3915b" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="200" fill="url(#glow)"/>
      <circle cx="200" cy="200" r="152" fill="none" stroke="#b3915b" stroke-width="3.2"/>
      <circle cx="200" cy="200" r="142" fill="none" stroke="#b3915b" stroke-width="0.8" opacity="0.45"/>
      <polygon
        points="200,58 323,129 323,271 200,342 77,271 77,129"
        fill="none" stroke="#b3915b" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon
        points="200,102 285,151 285,249 200,298 115,249 115,151"
        fill="none" stroke="#b3915b" stroke-width="1.6" stroke-linejoin="round" opacity="0.85"/>
      <g stroke="#b3915b" stroke-width="1.4" opacity="0.55">
        <line x1="200" y1="58" x2="200" y2="158"/>
        <line x1="323" y1="129" x2="245" y2="171"/>
        <line x1="323" y1="271" x2="245" y2="229"/>
        <line x1="200" y1="342" x2="200" y2="242"/>
        <line x1="77" y1="271" x2="155" y2="229"/>
        <line x1="77" y1="129" x2="155" y2="171"/>
      </g>
      <circle cx="200" cy="200" r="44" fill="none" stroke="#b3915b" stroke-width="2.4"/>
      <circle cx="200" cy="200" r="12" fill="#b3915b" opacity="0.55"/>
    </svg>
    <div class="lockup">
      <svg class="mark" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="12.2" fill="none" stroke="#b3915b" stroke-width="1.6"/>
        <polygon points="16,5.6 24.8,10.8 24.8,21.2 16,26.4 7.2,21.2 7.2,10.8"
          fill="none" stroke="#b3915b" stroke-width="1.3" stroke-linejoin="round"/>
        <circle cx="16" cy="16" r="3.2" fill="#b3915b"/>
      </svg>
      <div class="name">
        <span>Umanga</span>
        <span class="second">Rimal</span>
      </div>
      <div class="rule"></div>
      <div class="tag">Cinematography</div>
    </div>
    <div class="frame"></div>
    <canvas class="grain" id="grain" width="1200" height="630"></canvas>
  </div>
  <script>
    const c = document.getElementById("grain");
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(1200, 630);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  </script>
</body>
</html>`;

writeFileSync("/workspace/.grok/og-card.html", html);

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  const out = "/workspace/.grok/og-raw.png";
  await page.screenshot({
    path: out,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
    omitBackground: false,
  });
  console.log(JSON.stringify({ ok: true, screenshot: out }));
} finally {
  await browser.close();
}
