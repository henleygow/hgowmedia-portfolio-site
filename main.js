/* =============================================================================
   main.js — renders the site from data/projects.js
   You should not need to edit this file to add or change videos.
   ============================================================================ */
import { profile, projects } from "./data/projects.js";

/* ----------------------------------------------------- timecode helpers */
const FPS = 24; // sequence frame rate, purely for the cosmetic :FF field

/** "MM:SS" or "H:MM:SS" -> total seconds */
function durationToSeconds(d) {
  const parts = String(d).split(":").map(Number);
  if (parts.some(isNaN)) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** total seconds -> "HH:MM:SS:FF" timecode */
function secondsToTimecode(totalSeconds, frames = 0) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  const ff = String(Math.floor(frames) % FPS).padStart(2, "0");
  return `${hh}:${mm}:${ss}:${ff}`;
}

/* ---------------------------------------------- generated poster (no image) */
/* Deterministic gradient + grain so a clip looks intentional before you add art. */
function generatedPoster(title, index) {
  const hue = (index * 47 + title.length * 13) % 360;
  const wrap = document.createElement("div");
  wrap.className = "gen";
  wrap.style.background = `radial-gradient(120% 120% at 30% 20%, hsl(${hue} 55% 40%) 0%, hsl(${(hue + 40) % 360} 60% 16%) 55%, #0e0e10 100%)`;
  return wrap;
}

/* ============================================================ render: profile */
function renderProfile() {
  document.title = `${profile.name} — ${profile.role}`;
  document.getElementById("brandName").textContent = profile.name;
  document.getElementById("footerName").textContent = profile.name;
  document.getElementById("heroRole").textContent = profile.role;
  document.getElementById("heroLocation").textContent = profile.location;
  document.getElementById("heroTagline").textContent = profile.tagline;

  // Headline lines (staged for the wipe-in cut)
  const title = document.getElementById("heroTitle");
  title.innerHTML = profile.headline
    .map((line) => `<span class="hero__line"><span>${line}</span></span>`)
    .join("");

  // About statement (reuse tagline-ish editorial voice)
  document.getElementById("aboutStatement").textContent =
    profile.statement ||
    "I cut for rhythm: the place where a story finds life. Sports, short/long-form, and brand work, shaped frame by frame until every cut earns its place.";

  // Toolkit + services
  const fill = (id, arr) =>
    (document.getElementById(id).innerHTML = arr
      .map((x) => `<li>${x}</li>`)
      .join(""));
  fill("toolkitList", profile.toolkit);
  fill("servicesList", profile.services);

  // Contact
  const email = document.getElementById("contactEmail");
  email.textContent = profile.email;
  email.href = `mailto:${profile.email}`;

  // Contact channels — link out (Instagram) or copy the handle (Discord)
  const CHANNEL_ICONS = {
    discord: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  };
  const channelsEl = document.getElementById("contactChannels");
  channelsEl.innerHTML = profile.channels
    .map((c) => {
      const icon = CHANNEL_ICONS[c.label.toLowerCase()] || "";
      const inner = `
        <span class="channel__lead">
          <span class="channel__icon">${icon}</span>
          <span class="channel__main">
            <span class="channel__label">${c.label}</span>
            <span class="channel__handle">@${c.handle}</span>
          </span>
        </span>
        <span class="channel__cue">${c.url ? "Open ↗" : "Copy"}</span>`;
      return c.url
        ? `<a class="channel" href="${c.url}" target="_blank" rel="noopener">${inner}</a>`
        : `<button class="channel" type="button" data-copy="${c.copy}">${inner}</button>`;
    })
    .join("");

  // Mirror the same channels as mini icons in the top bar
  document.getElementById("topbarSocials").innerHTML = profile.channels
    .map((c) => {
      const icon = CHANNEL_ICONS[c.label.toLowerCase()] || "";
      const label = `${c.label} · @${c.handle}`;
      return c.url
        ? `<a class="topbar__social" href="${c.url}" target="_blank" rel="noopener" title="${label}" aria-label="${label}">${icon}</a>`
        : `<button class="topbar__social" type="button" data-copy="${c.copy}" title="Copy ${label}" aria-label="Copy ${label}">${icon}</button>`;
    })
    .join("");

  // Copy-to-clipboard for any channel/social with data-copy (contact + top bar)
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const cue = btn.querySelector(".channel__cue"); // only the contact rows have one
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        if (cue) cue.textContent = "Copied ✓";
        showToast(`Copied @${btn.dataset.copy} to clipboard`);
      } catch {
        if (cue) cue.textContent = `@${btn.dataset.copy}`; // clipboard blocked — show it to copy manually
        showToast(`Copy manually: @${btn.dataset.copy}`);
      }
      btn.classList.add("is-copied");
      setTimeout(() => {
        if (cue) cue.textContent = "Copy";
        btn.classList.remove("is-copied");
      }, 1800);
    });
  });
}

/* ----------------------------------------------------- toast (copy feedback) */
function showToast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

/* ------------------------------------------------- vimeo thumbnail (oEmbed) */
/* Public, no API key. Fails silently → the generated poster stays. */
async function vimeoPoster(id, title, posterEl) {
  try {
    const r = await fetch(
      `https://vimeo.com/api/oembed.json?width=1280&url=https://vimeo.com/${id}`,
    );
    if (!r.ok) return;
    const { thumbnail_url } = await r.json();
    if (!thumbnail_url) return;
    const img = new Image();
    img.alt = `${title} poster`;
    img.decoding = "async";
    // swap on load, so a poster that never arrives leaves the placeholder alone
    img.onload = () => posterEl.querySelector(".gen")?.replaceWith(img);
    img.src = thumbnail_url;
  } catch {}
}

/* ============================================================ render: clips */
function renderClips() {
  const list = document.getElementById("clips");
  let cumulative = 0; // running in-point of the whole sequence

  projects.forEach((p, i) => {
    const inPoint = secondsToTimecode(cumulative);
    const li = document.createElement("li");
    li.className = "clip reveal";
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", `Play ${p.title}`);

    const posterImg = p.thumbnail
      ? `<img src="${p.thumbnail}" alt="${p.title} poster" loading="lazy" />`
      : "";

    li.innerHTML = `
      <span class="clip__tc">${inPoint}</span>
      <div class="clip__poster">
        ${posterImg}
        <div class="clip__play"><span></span></div>
      </div>
      <div class="clip__body">
        <h3 class="clip__title">${p.title}</h3>
        <div class="clip__tags">${(p.tags || []).map((t) => `<span class="clip__tag">${t}</span>`).join("")}</div>
      </div>
      <div class="clip__rail">
        <span class="clip__arrow">↗</span>
      </div>
    `;

    // generated poster fallback — Vimeo's own thumbnail layers over it if it loads
    if (!p.thumbnail) {
      const poster = li.querySelector(".clip__poster");
      poster.prepend(generatedPoster(p.title, i));
      if (p.video?.type === "vimeo") vimeoPoster(p.video.id, p.title, poster);
    }

    // open player
    const open = () => p.video && openPlayer(p);
    li.addEventListener("click", open);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    if (!p.video) {
      li.style.cursor = "default";
      li.removeAttribute("role");
    }

    list.appendChild(li);
    cumulative += durationToSeconds(p.duration);
  });

  // totals
  const total = secondsToTimecode(cumulative);
  document.getElementById("totalRuntime").textContent = total;
  document.getElementById("footerTc").textContent = total;
}

/* ============================================================ player modal */
const player = document.getElementById("player");
const playerFrame = document.getElementById("playerFrame");
let lastFocused = null;

function videoEmbed(v) {
  if (!v) return "";
  if (v.type === "vimeo")
    return `<iframe src="https://player.vimeo.com/video/${v.id}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  if (v.type === "youtube")
    return `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  if (v.type === "mp4")
    return `<video src="${v.src}" controls autoplay playsinline></video>`;
  return "";
}

function openPlayer(p) {
  lastFocused = document.activeElement;
  document.getElementById("playerTitle").textContent = p.title;
  playerFrame.innerHTML = videoEmbed(p.video);
  player.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("playerClose").focus();
}

function closePlayer() {
  player.hidden = true;
  playerFrame.innerHTML = ""; // stop playback
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

player.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closePlayer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !player.hidden) closePlayer();
});

/* ============================================ scroll-scrub: page as sequence */
const hudTc = document.getElementById("hudTimecode");
const scrubFill = document.getElementById("scrubFill");
const scrubHead = document.getElementById("scrubHead");
let totalSeq = 0;
let ticking = false;

function initSequenceLength() {
  totalSeq = projects.reduce(
    (acc, p) => acc + durationToSeconds(p.duration),
    0,
  );
}

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;

  // map scroll position onto total sequence runtime -> live timecode
  const seconds = pct * totalSeq;
  const frames = (pct * totalSeq * FPS) % FPS;
  hudTc.textContent = secondsToTimecode(seconds, frames);

  // hero scrubber
  scrubFill.style.width = `${(pct * 100).toFixed(2)}%`;
  scrubHead.style.left = `${(pct * 100).toFixed(2)}%`;

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true },
);

/* ============================================ scroll reveal (IntersectionObserver) */
function initReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

/* ===================================================================== boot */
renderProfile();
renderClips();
initSequenceLength();
initReveal();
onScroll();
