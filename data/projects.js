/* ============================================================================
   YOUR CONTENT LIVES HERE.  This is the only file you edit to update the site.
   ----------------------------------------------------------------------------
   1. PROFILE  — your name, role, contact, reel link, software/services.
   2. PROJECTS — one object per video. Add, remove, or reorder freely.

   To add a video: copy a { ... } block, change the fields, save. Done.
   Nothing in index.html or main.js ever needs to change.
   ========================================================================== */

export const profile = {
  name: "Henley", // shown big in the hero + nav
  role: "Video Editor",
  // The hero headline. Keep it to 1–3 short lines (use the array).
  headline: ["Henley", "Gow"],
  tagline: "Video editor for brands, sports, social, and real estate.",
  location: "Available worldwide · Remote",
  // The "Editor's note" statement in the About section.
  statement:
    "I edit video for brands, real estate, social, and sports, focusing on engaging pacing, clean sound, and viewer retention.",
  email: "hgowcreative@gmail.com",
  // Contact channels. `url` → opens in a new tab; `copy` → click copies the
  // handle to the clipboard (good for Discord, which has no profile URL).
  channels: [
    { label: "Discord", handle: "henleygow", copy: "henleygow" },
    {
      label: "Instagram",
      handle: "hgowmedia",
      url: "https://instagram.com/hgowmedia",
    },
  ],
  // Short "About" capabilities. Edit freely.
  toolkit: [
    "Premiere Pro",
    "After Effects",
    "DaVinci Resolve",
    "Color Grade",
    "Sound Design",
  ],
  services: [
    "Social / short-form",
    "Real estate",
    "Brand & commercial",
    "Sports",
  ],
};

/* ----------------------------------------------------------------------------
   PROJECTS
   Each field:
     title     — clip name (required)
     duration  — runtime as "MM:SS" or "H:MM:SS". Not shown on the page — it
                 only drives the running timecode / scrubber math, so it
                 still needs to be roughly accurate.
     tags      — array of short labels
     thumbnail — path to a poster image (e.g. "assets/posters/northbound.jpg").
                 Leave as "" and a clean placeholder poster is generated for you.
     video     — { type, id|src }:
                   { type: "vimeo",   id: "76979871" }
                   { type: "youtube", id: "dQw4w9WgXcQ" }
                   { type: "mp4",     src: "assets/clips/reel.mp4" }
                 Omit `video` entirely to make the clip non-clickable.
   -------------------------------------------------------------------------- */

export const projects = [
  {
    title: "Karl Shakur",
    duration: "00:33",
    tags: ["VFX", "Color", "Sound"],
    thumbnail: "",
    video: { type: "vimeo", id: "1207456194" },
    blurb:
      "A concept edit about exploring the unknown, featuring Karl Shakur from the Vincero Editing Contest.",
  },
  {
    title: "Hoopfest",
    duration: "00:42",
    tags: ["Sports", "Sound", "Color"],
    thumbnail: "",
    video: { type: "vimeo", id: "1207454289" },
    blurb: "High-paced sports edit for the Hoopfest basketball tournament.",
  },
  {
    title: "Torino Restaurant and Bar",
    duration: "00:36",
    tags: ["Business", "Color", "Sound"],
    thumbnail: "",
    video: { type: "vimeo", id: "1207454607" },
    blurb:
      "High-paced edit for Torino Restaurant and Bar, showcasing their vibrant atmosphere.",
  },
  {
    title: "BODIED Coffee",
    duration: "00:19",
    tags: ["Paid Ads", "Social Media", "E-Commerce"],
    thumbnail: "",
    video: { type: "vimeo", id: "1207456253" },
    blurb: "Short-form ad creative for BODIED, a superfood coffee brand.",
  },
];
