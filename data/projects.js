/* ============================================================================
   YOUR CONTENT LIVES HERE.  This is the only file you edit to update the site.
   ----------------------------------------------------------------------------
   1. PROFILE  — your name, about text, contact, hero and portrait.
   2. PROJECTS — one object per video. Add, remove, or reorder freely.

   To add a video: copy a { ... } block, change the fields, save. Done.
   Nothing in index.html or main.js ever needs to change.
   (The browser-tab title and the Google/share description are the one
   exception: they sit at the top of index.html.)
   ========================================================================== */

export const profile = {
  name: "Henley Gow", // the hero headline, nav, buttons ("Email Henley"), footer

  // HERO. A muted, looping video plays behind your name. These files have no
  // audio track and are small on purpose (see README, "Preparing a video").
  //   heroVideo         — the loop for wide screens
  //   heroVideoPortrait — a centre crop for phones held upright (optional)
  //   heroPoster        — the still shown first, and on slow connections
  // Set heroVideo to "" and a light-leak effect drawn in code takes its place.
  heroVideo: "assets/hero/billiejean.mp4",
  heroVideoPortrait: "assets/hero/billiejean-portrait.mp4",
  heroPoster: "assets/hero/billiejean.jpg",
  // The short facts on the rule above your name. A fact can show real app
  // icons before its words: icons: [{ src: "assets/icons/x.svg", name: "X" }].
  facts: [
    { label: "Role", value: "Video editor, sound designer, colorist" },
    { label: "Work", value: "Sports, brands, e-commerce, social media, real estate" },
    {
      label: "Tools",
      icons: [
        { src: "assets/icons/premiere.svg", name: "Premiere Pro" },
        { src: "assets/icons/after-effects.svg", name: "After Effects" },
        { src: "assets/icons/davinci-resolve.png", name: "DaVinci Resolve" },
      ],
    },
    { label: "Based", value: "Connecticut, remote worldwide" },
  ],

  // ABOUT. Your photo, shown beside the text: a portrait crop (4:5), about
  // 1200×1500 and under 300 KB. If the file is missing, About is text only.
  portrait: "assets/portrait-web.jpg",
  // `statement` is the large line, `blurb` the smaller paragraph under it.
  statement:
    "I edit video for brands, real estate, social, and sports, focusing on engaging pacing, clean sound, and viewer retention.",
  blurb:
    "I’m Henley Gow. I cut short-form ads, sports edits and brand films, and handle the color and sound myself. Based in Connecticut, working remote worldwide.",
  services: ["Sports", "Brand & commercial", "E-commerce", "Social / short-form", "Real estate"],
  toolkit: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Color grade", "Sound design"],

  // CONTACT. Email gets the big button and the first row. For each channel:
  // `url` → opens in a new tab; `copy` → click copies the handle to the
  // clipboard (good for Discord, which has no profile URL).
  email: "hgowcreative@gmail.com",
  channels: [
    { label: "Discord", handle: "henleygow", copy: "henleygow" },
    { label: "Instagram", handle: "hgowmedia", url: "https://instagram.com/hgowmedia" },
  ],
};

/* ----------------------------------------------------------------------------
   PROJECTS — the Work list, top to bottom
   Each field:
     title     — the project's name (required)
     tags      — array of short labels, shown beside the title
     duration  — running time as "M:SS", shown at the end of the row
     video     — { type, id|src }:
                   { type: "mp4",     src: "assets/clips/hoopfest.mp4" }
                   { type: "vimeo",   id: "76979871" }
                   { type: "youtube", id: "dQw4w9WgXcQ" }
                 Omit `video` entirely to make the row non-clickable.
     preview   — a few silent seconds that play beside the pointer when the
                 row is hovered (optional)
     thumbnail — a still, shown blurred behind the video while it plays (optional)
     blurb     — one sentence shown under the video when it plays (optional)
   Videos play from this folder, so use web-sized copies, never raw exports:
   see README, "Preparing a video".
   -------------------------------------------------------------------------- */

// One export name gives all three files: assets/clips, assets/previews, assets/posters.
const files = (name) => ({
  video: { type: "mp4", src: `assets/clips/${name}.mp4` },
  preview: `assets/previews/${name}.mp4`,
  thumbnail: `assets/posters/${name}.jpg`,
});

export const projects = [
  {
    title: "Rod Wave Elite: Billie Jean",
    tags: ["Sports"],
    duration: "0:33",
    ...files("billiejean"),
    blurb: "Edit for the Rod Wave Elite basketball team. A silent loop of it plays at the top of this page.",
  },
  {
    title: "Karl Shakur",
    tags: ["VFX", "Color", "Sound"],
    duration: "0:34",
    ...files("karlshakurvincero"),
    blurb:
      "A concept edit about exploring the unknown, featuring Karl Shakur from the Vincero Editing Contest.",
  },
  {
    title: "Arkansas Football",
    tags: ["Sports", "Spec edit"],
    duration: "0:40",
    ...files("wassupclean"),
    blurb:
      "A spec edit cut from Arkansas football media-team footage. Self-initiated, not commissioned by the program.",
  },
  {
    title: "Torino Restaurant and Bar",
    tags: ["Business", "Color", "Sound"],
    duration: "0:37",
    ...files("torinosedit"),
    blurb:
      "High-paced edit for Torino Restaurant and Bar, showcasing their vibrant atmosphere.",
  },
  {
    title: "Hoopfest",
    tags: ["Sports", "Sound", "Color"],
    duration: "0:42",
    ...files("8outof10"),
    blurb: "High-paced sports edit for the Hoopfest basketball tournament.",
  },
  {
    title: "Rod Wave Elite Basketball",
    tags: ["Sports"],
    duration: "0:16",
    ...files("sh4lclean"),
    blurb: "Edit for the Rod Wave Elite basketball team.",
  },
  {
    title: "BODIED Coffee",
    tags: ["Paid Ads", "Social Media", "E-Commerce"],
    duration: "0:19",
    ...files("akimbopaidad"),
    blurb: "Short-form ad creative for BODIED, a superfood coffee brand.",
  },
];
