# Henley — Video Editor Portfolio

A static portfolio site. No build step, no framework, no dependencies.
Everything you'll ever change lives in **one file**: `data/projects.js`.

```
portfolio website/
├─ index.html          ← structure (rarely touched)
├─ styles.css          ← look & feel
├─ main.js             ← rendering logic (don't need to touch)
├─ data/
│  └─ projects.js      ← ★ YOUR CONTENT: profile + every video
└─ assets/
   └─ posters/         ← drop your thumbnail images here
```

## Running it locally

Because it uses JavaScript modules, open it through a tiny local server
(double-clicking `index.html` won't load the data). From this folder:

```bash
# Option A — Python (already on most machines)
python -m http.server 8000

# Option B — Node
npx serve
```

Then visit `http://localhost:8000`.

To put it online, upload the whole folder to **Netlify**, **Vercel**, **Cloudflare
Pages**, or **GitHub Pages** — all free and all serve it as-is.

## Adding or changing a video

Open `data/projects.js` and copy an existing block in the `projects` array:

```js
{
  title: "Northbound",
  duration: "12:40",            // MM:SS or H:MM:SS — feeds the timecode (not shown on-page)
  tags: ["Doc", "Color"],
  thumbnail: "assets/posters/northbound.jpg",  // or "" for an auto poster
  video: { type: "vimeo", id: "76979871" },
  blurb: "A short description.",
},
```

### The `video` field — three supported sources

| Source   | Where to find the ID                                   | Example |
|----------|-------------------------------------------------------|---------|
| Vimeo    | the number in `vimeo.com/`**`76979871`**              | `{ type: "vimeo", id: "76979871" }` |
| YouTube  | the code after `watch?v=`**`dQw4w9WgXcQ`**            | `{ type: "youtube", id: "dQw4w9WgXcQ" }` |
| MP4 file | a file you place in `assets/clips/`                    | `{ type: "mp4", src: "assets/clips/reel.mp4" }` |

Omit `video` entirely and the clip becomes a non-clickable showcase tile.

### Thumbnails

- Drop a `.jpg`/`.png`/`.webp` into `assets/posters/` and point `thumbnail` at it.
- Use a **16:9** image (e.g. 1280×720) for a clean fit.
- Leave `thumbnail: ""` and a tasteful gradient poster is generated automatically —
  handy while you're still exporting stills.

Posters display in grayscale and "grade" to full color on hover — that's intentional.

## Editing your profile

The `profile` object at the top of `data/projects.js` controls your name, hero
headline, tagline, About note, email, reel link, social links, toolkit, and
services. Change the text, save, refresh.

## Order

Projects appear top-to-bottom in the order they're listed in the array, and the
running timecodes recalculate automatically. Reorder by moving blocks around.
