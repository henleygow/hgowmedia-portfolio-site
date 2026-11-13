# Henley Gow — Video Editor Portfolio

A static one-page portfolio: hero, work, about, contact. No build step, no
framework, no dependencies. Everything you change lives in **one file**:
`data/projects.js`.

```
portfolio website/
├─ index.html          ← structure, plus the tab title and share description
├─ styles.css          ← look & feel (colors and fonts are the variables at the top)
├─ main.js             ← rendering logic (don't need to touch)
├─ favicon.svg
├─ serve.mjs           ← local preview server (not part of the site)
├─ data/
│  └─ projects.js      ← ★ YOUR CONTENT: profile + every video
└─ assets/
   └─ effects/         ← the hero's light-leak effect (from the taste skill, MIT)
   └─ icons/           ← app icons for the hero's facts row
   └─ clips/           ← the project videos (web-sized H.264 copies)
   └─ previews/        ← 4-second silent clips for the hover previews
   └─ posters/         ← stills shown blurred behind a playing video
   └─ hero/            ← the hero loop, its phone crop and its poster
```

## Running it locally

It uses JavaScript modules, so open it through a local server (double-clicking
`index.html` won't load the data). From this folder, with Node installed:

```bash
node serve.mjs
```

Then visit `http://localhost:4173`. Use this rather than `python -m http.server`:
Python's server can't serve part of a file, so you couldn't scrub through a
video.

To put it online, upload the folder to **Netlify**, **Vercel**, **Cloudflare
Pages**, or **GitHub Pages**. All serve it as-is.

## The hero

Your name, set across the page, with a rule and four short facts above it, over
a moving ground:

- **Video (current):** `heroVideo` in `profile` is a muted loop with no audio
  track. `heroVideoPortrait` is a centre crop that phones held upright get
  instead, and `heroPoster` is the still shown first.
- **Light leak:** set `heroVideo: ""` and a film light-leak effect drawn in code
  (WebGL, in `assets/effects/`) takes its place, with a second light that
  follows the pointer. It takes its color from `--accent` in `styles.css`.

Both have a "Pause motion" control.

**How the hero video stays light.** The poster shows first and the video is only
fetched after the rest of the page has loaded. It pauses when you scroll past it
or switch tabs. Visitors with Data Saver on, on a very slow connection, or who
ask for reduced motion see the poster until they press "Play motion".

**The facts** are the `facts` list in `profile`. A fact can show real app icons
before its words (`icons: [{ src, name }]`). Premiere Pro and After Effects are
in `assets/icons/`; to add another tool or a client, drop its official logo file
(SVG or PNG) there and add it the same way. Only use logos you are allowed to
show.

## The portrait

`portrait` in `profile` points at your photo (now `assets/portrait-web.jpg`). Use
a portrait crop (4:5), about 1200×1500 and under 300 KB: a camera original is
several MB and would slow the page. If the file is missing, About is text only.

## Watching a video

Clicking a project opens it full screen at the video's own shape, over a blurred
still of itself, so a vertical edit fills a phone and nothing is letterboxed.
Close, Esc or the phone's Back button returns to the page.

## Type and motion

- **Type:** Archivo (extended) for your name, the nav mark, section headings and
  the About statement; Rethink Sans for everything else. Both load from Google
  Fonts at the top of `index.html`; the display settings are the `--display-*`
  variables at the top of `styles.css`. Your name is sized by `main.js` to span
  the page exactly, whatever the font.
- **Motion:** the hero arrives once on load, sections ease in the first time
  they scroll into view, links and cards answer the pointer, and the video view
  fades in. All of it is switched off for visitors who ask for reduced motion.

## The Work list

Work is a list, not a grid of thumbnails: number, title, tags and running time.
On a computer, hovering a row plays a few silent seconds of that edit beside the
pointer; nothing is downloaded until a row is hovered. On a phone it is a plain
list, and a tap opens the video.

## Adding or changing a video

Copy a block in the `projects` array in `data/projects.js`:

```js
{
  title: "Northbound",
  tags: ["Doc", "Color"],
  duration: "1:12",
  ...files("northbound"),   // assets/clips, assets/previews and assets/posters /northbound.*
  blurb: "One sentence shown under the video when it plays.",
},
```

Projects show in the order they are listed. Omit the `files(...)` line and the
row is not clickable. Vimeo and YouTube still work too:
`video: { type: "vimeo", id: "76979871" }` or `{ type: "youtube", id: "…" }`.

## Preparing a video

Never put a raw export in the site. Exports are often HEVC (many browsers can't
play it), 4K, and 50–160 MB each. The site wants H.264, 1080p at most, with the
file arranged so playback can start before the download ends. With
[ffmpeg](https://ffmpeg.org) installed, from this folder:

A project video (keeps its sound; landscape becomes 1080 high, vertical 1080 wide):

```bash
ffmpeg -i "path/to/export.mp4" -vf "scale='if(gt(a,1),-2,min(1080,iw))':'if(gt(a,1),min(1080,ih),-2)'" -c:v libx264 -preset slow -crf 23 -maxrate 5M -bufsize 10M -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart assets/clips/NAME.mp4
```

Its hover preview (4 silent seconds starting 5 seconds in; change `-ss` to pick the moment):

```bash
ffmpeg -ss 5 -i "path/to/export.mp4" -t 4 -an -vf "scale='if(gt(a,1),-2,270)':'if(gt(a,1),270,-2)',fps=24" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart assets/previews/NAME.mp4
```

Its still, shown blurred behind the video while it plays (taken 5 seconds in):

```bash
ffmpeg -ss 5 -i "path/to/export.mp4" -frames:v 1 -vf "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=1280:720" -q:v 4 assets/posters/NAME.jpg
```

A hero loop (no sound, 720p) and its upright-phone crop:

```bash
ffmpeg -i "path/to/export.mp4" -an -vf "scale=1280:720" -c:v libx264 -preset slow -crf 27 -maxrate 1800k -bufsize 3600k -pix_fmt yuv420p -movflags +faststart assets/hero/NAME.mp4
```

```bash
ffmpeg -i "path/to/export.mp4" -an -vf "crop=ih*9/16:ih,scale=540:960" -c:v libx264 -preset slow -crf 28 -maxrate 1000k -bufsize 2000k -pix_fmt yuv420p -movflags +faststart assets/hero/NAME-portrait.mp4
```

Keep each file under 100 MB: GitHub refuses anything larger.

## Editing your profile

The `profile` object at the top of `data/projects.js` controls your name, hero
About text, services, toolkit, email and social channels.
The browser-tab title and the description Google and link previews show are at
the top of `index.html`.
