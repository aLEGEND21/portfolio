---
name: verify
description: Build, run, and drive this portfolio site to verify changes at the browser surface, including a mobile-Safari-like viewport.
---

# Verifying portfolio-website-v2

## Build & serve

```bash
npm run build
npm run start   # serves the prod build on :3000; run in background, NOT piped to head (kills it)
```

If :3000 is taken, check `lsof -nP -iTCP:3000 -sTCP:LISTEN` — may be a leftover `next-server`; kill it or use `PORT=xxxx npm run start`.

## Drive it

Playwright works well; **WebKit** is the engine to use for mobile checks, since the risky code paths (project videos, scroll reveals, the mobile catch-up transform) are Safari-sensitive:

```js
const { webkit, devices } = require("playwright");
const ctx = await (await webkit.launch()).newContext({ ...devices["iPhone 13"] });
```

Install in a scratch dir: `npm i playwright && npx playwright install webkit`.

Flows worth driving on the home page:
- Scroll through `#projects` in steps (~500px, 600ms waits) so IntersectionObservers fire; then check every `#projects a` has computed `opacity: 1` (blocks mount at opacity-0 until a JS reveal — a dead observer leaves them invisible).
- Videos: check `video.getBoundingClientRect()` equals its `.aspect-video` cell, `document.scrollingElement.scrollWidth === window.innerWidth` (no horizontal overflow), and `currentTime` advances while 60%+ in view (touch devices activate by visibility, desktop by hover).
- Repeat at a desktop viewport (1440×900) with `page.hover("#projects a")`.

## Gotchas

- Real-device iOS Safari bugs (video intrinsic-size blowup, memory kills) do NOT reproduce in desktop WebKit 26.5 or Chrome emulation — treat local WebKit as necessary-but-not-sufficient; final confirmation needs a phone against the deployed site.
- `public/videos/*.mp4` must stay web-optimized: `moov` before `mdat` (`+faststart`), ≤ a few MB. `preload="metadata"` on a non-faststart file downloads the whole video.
