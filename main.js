/* =============================================================================
   main.js — renders the site from data/projects.js
   You should not need to edit this file to add or change videos.
   ============================================================================ */
import { profile, projects } from "./data/projects.js";

const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) document.documentElement.classList.add("motion"); // styles.css only animates under this

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

/* ---------------------------------------------------------------- posters */
/* The still behind the video view: the data file's thumbnail, else the video
   host's own (no API key). Resolves to "" when there is none. */
const posters = new Map();
function poster(p) {
  if (!posters.has(p)) posters.set(p, loadPoster(p));
  return posters.get(p);
}
async function loadPoster(p) {
  if (p.thumbnail) return p.thumbnail;
  const v = p.video;
  if (v?.type === "youtube") return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  if (v?.type === "vimeo") {
    try {
      const r = await fetch(`https://vimeo.com/api/oembed.json?width=1280&url=https://vimeo.com/${v.id}`);
      if (r.ok) return (await r.json()).thumbnail_url || "";
    } catch {}
  }
  return "";
}
/* ----------------------------------------------------------------- player */
/* A full-screen view: the video at its own shape over a blurred still of itself. */
const player = $("player");
const playerFrame = $("playerFrame");

const watchUrl = (v) =>
  ({ vimeo: `https://vimeo.com/${v.id}`, youtube: `https://youtu.be/${v.id}`, mp4: v.src })[v.type];

function embed(p) {
  const v = p.video;
  if (v.type === "mp4") {
    const video = el("video", { src: v.src, controls: true, autoplay: true, playsInline: true, preload: "auto" });
    // the stage takes the video's own shape, so nothing is letterboxed
    video.addEventListener("loadedmetadata", () => {
      playerFrame.style.setProperty("--ar", video.videoWidth / video.videoHeight);
      video.classList.add("is-ready");
    });
    return video;
  }
  const src =
    v.type === "vimeo"
      ? `https://player.vimeo.com/video/${v.id}?autoplay=1&title=0&byline=0&portrait=0`
      : `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
  return el("iframe", { className: "is-ready", src, title: p.title, allow: "autoplay; fullscreen; picture-in-picture" });
}

async function openPlayer(p) {
  $("playerTitle").textContent = p.title;
  $("playerBlurb").textContent = p.blurb || "";
  $("playerBackdrop").src = await poster(p);
  playerFrame.replaceChildren(embed(p));
  player.showModal();
  history.pushState({ viewer: true }, ""); // so the phone's Back button closes the view
}
player.addEventListener("close", () => {
  playerFrame.replaceChildren(); // stops playback
  playerFrame.style.removeProperty("--ar");
  if (history.state?.viewer) history.back();
});
addEventListener("popstate", () => player.open && player.close());

/* A real link to the video (so new-tab clicks work); a plain click plays it here. */
function playLink(p, props, ...children) {
  if (!p.video) return el("div", props, ...children);
  const a = el("a", { ...props, href: watchUrl(p.video) }, ...children);
  a.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openPlayer(p);
  });
  return a;
}

/* ---------------------------------------------------------------- profile */
function renderProfile() {
  const firstName = profile.name.split(" ")[0];
  document.querySelectorAll("[data-name]").forEach((n) => (n.textContent = profile.name));
  document.querySelectorAll("[data-first-name]").forEach((n) => (n.textContent = firstName));
  document.querySelectorAll("[data-email-link]").forEach((a) => {
    a.href = `mailto:${profile.email}`;
    a.textContent = `Email ${firstName}`;
  });

  $("aboutStatement").textContent = profile.statement;
  $("aboutBlurb").textContent = profile.blurb;
  const fill = (id, items) => $(id).replaceChildren(...items.map((x) => el("li", {}, x)));
  fill("servicesList", profile.services);
  fill("toolkitList", profile.toolkit);

  if (profile.portrait) {
    // shown once the file loads, so a path with no photo behind it yet leaves About text-only
    const photo = $("portrait");
    photo.onload = () => (photo.hidden = false);
    Object.assign(photo, { src: profile.portrait, alt: `Portrait of ${profile.name}`, loading: "eager" });
  }

  $("legal").textContent = `© ${new Date().getFullYear()} ${profile.name}`;
}

/* --------------------------------------------------------------- channels */
/* `url` opens in a new tab; anything else copies its handle to the clipboard. */
function renderChannels() {
  const rows = [{ label: "Email", handle: profile.email, copy: profile.email }, ...profile.channels];
  $("channels").replaceChildren(
    ...rows.map((c) => {
      const cue = el("span", { className: "channel__cue" }, c.url ? "Open" : "Copy");
      const inner = [
        el("span", { className: "channel__label" }, c.label),
        el("span", { className: "channel__handle", translate: false }, c.label === "Email" ? c.handle : `@${c.handle}`),
        cue,
      ];
      if (c.url) return el("li", {}, el("a", { className: "channel", href: c.url, target: "_blank", rel: "noopener" }, ...inner));

      cue.setAttribute("aria-live", "polite");
      const btn = el("button", { className: "channel", type: "button" }, ...inner);
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(c.copy);
          cue.textContent = "Copied";
        } catch {
          cue.textContent = "Select to copy"; // clipboard blocked: the handle is on screen
        }
        setTimeout(() => (cue.textContent = "Copy"), 1800);
      });
      return el("li", {}, btn);
    }),
  );
}

/* ------------------------------------------------------------------- work */
/* A list, not a wall of thumbnails: number, title, tags, running time. */
function renderWork() {
  $("workList").replaceChildren(
    ...projects.map((p, i) => {
      const row = playLink(
        p,
        { className: "row" },
        el("span", { className: "row__n" }, String(i + 1).padStart(2, "0")),
        el("h3", { className: "row__title" }, p.title),
        el("span", { className: "row__tags" }, (p.tags || []).join(" · ")),
        el("span", { className: "row__time" }, p.duration || ""),
      );
      row.dataset.preview = p.preview || "";
      const li = el("li", {}, row);
      li.dataset.reveal = "";
      li.style.setProperty("--d", `${i * 50}ms`); // rows follow one another in
      return li;
    }),
  );
}

/* ------------------------------------------------------------------- peek */
/* After the taste skill's "peek-list": hovering a row plays a few silent seconds of that
   edit beside the pointer. Mouse only; nothing loads until a row is hovered. */
function peekOnHover() {
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const list = $("workList");
  const peek = $("peek");
  const video = peek.querySelector("video");
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const tick = () => {
    raf = 0;
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    peek.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) raf = requestAnimationFrame(tick);
  };
  list.addEventListener("pointermove", (e) => {
    // below and right of the pointer, flipped where it would leave the window
    const w = peek.offsetWidth || 340, h = peek.offsetHeight || 190;
    tx = e.clientX + 28 + w > innerWidth ? e.clientX - 28 - w : e.clientX + 28;
    ty = Math.min(e.clientY + 28, innerHeight - h - 16);
    if (!peek.classList.contains("is-on")) [cx, cy] = [tx, ty]; // appear in place, then follow
    raf ||= requestAnimationFrame(tick);
  }, { passive: true });
  list.addEventListener("pointerover", (e) => {
    const src = e.target.closest(".row")?.dataset.preview;
    if (!src) return peek.classList.remove("is-on");
    if (video.getAttribute("src") !== src) video.src = src;
    video.play().catch(() => {});
    peek.classList.add("is-on");
  });
  const hide = () => {
    peek.classList.remove("is-on");
    video.pause();
  };
  list.addEventListener("pointerleave", hide);
  list.addEventListener("click", hide); // the video view is opening
}

/* ------------------------------------------------------------- hero facts */
/* The rule and short facts above the name; a fact may show real app icons before its words. */
function renderFacts() {
  $("heroFacts").replaceChildren(
    ...(profile.facts || []).map((f, n) => {
      const icons = (f.icons || []).map((i) =>
        el("img", { className: "fact__icon", src: i.src, alt: i.name, title: i.name, width: 28, height: 28 }));
      const fact = el("div", {}, el("dt", {}, f.label), el("dd", {}, ...icons, f.value || ""));
      fact.style.setProperty("--i", n); // staggers the entrance
      return fact;
    }),
  );
}

/* ----------------------------------------------------------- pointer light */
/* After the taste skill's "cursor-spotlight": the light follows the pointer with a short
   lag and drifts back to its resting spot when the pointer leaves. On touch screens and
   under reduced motion it simply rests there. */
function pointerLight(hero, grain) {
  const rest = [0.76, 0.4];
  const light = el("div", { className: "hero__light" });
  light.setAttribute("aria-hidden", "true");
  light.style.setProperty("--grain", grain);
  hero.querySelector(".hero__fx").after(light);
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let [tx, ty] = rest, cx = tx, cy = ty, raf = 0;
  const tick = () => {
    raf = 0;
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    hero.style.setProperty("--lx", `${(cx * 100).toFixed(2)}%`);
    hero.style.setProperty("--ly", `${(cy * 100).toFixed(2)}%`);
    if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick);
  };
  const aim = (x, y) => {
    [tx, ty] = [x, y];
    raf ||= requestAnimationFrame(tick);
  };
  hero.addEventListener("pointermove", (e) => {
    const r = light.getBoundingClientRect();
    aim((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  }, { passive: true });
  hero.addEventListener("pointerleave", () => aim(...rest));
}

/* ------------------------------------------------------------- hero video */
/* A muted loop behind the name, kept light: the poster shows first and the file is only
   fetched once the page has loaded; phones held upright get the smaller portrait crop;
   it stops when scrolled away, when the tab is hidden and while a project plays; and visitors on Save-Data, a 2G link
   or reduced motion get the poster until they press Play. */
function heroVideo(hero) {
  const upright = profile.heroVideoPortrait && matchMedia("(orientation: portrait)").matches;
  const src = upright ? profile.heroVideoPortrait : profile.heroVideo;
  const video = el("video", {
    className: "hero__video", poster: profile.heroPoster || "",
    muted: true, loop: true, playsInline: true, preload: "none", tabIndex: -1, disablePictureInPicture: true,
  });
  video.setAttribute("aria-hidden", "true");
  hero.classList.add("hero--video");
  hero.prepend(video);

  const link = navigator.connection;
  const startPaused = reduceMotion || Boolean(link?.saveData) || /2g/.test(link?.effectiveType || "");
  let wanted = !startPaused, onScreen = true;
  const sync = () => {
    if (!(wanted && onScreen) || document.hidden || player.open) return video.pause();
    video.src ||= src; // the first play is what fetches the file
    video.play().catch(() => {}); // autoplay refused (e.g. low-power mode): the poster stays
  };
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  }).observe(hero);
  document.addEventListener("visibilitychange", sync);
  new MutationObserver(sync).observe(player, { attributeFilter: ["open"] }); // rests while a project plays
  if (document.readyState === "complete") sync();
  else addEventListener("load", sync, { once: true });

  const set = (on) => {
    wanted = on;
    sync();
  };
  return { startPaused, pause: () => set(false), resume: () => set(true) };
}

/* ------------------------------------------------------------------- hero */
/* The ground under the name: the video when profile.heroVideo is set, else the
   light-leak effect (WebGL; it falls back to a still by itself). */
async function renderHero() {
  const hero = $("hero");
  const pause = $("heroPause");
  let motion = null; // { pause(), resume(), startPaused? } once something can move

  if (profile.heroVideo) {
    motion = heroVideo(hero);
  } else {
    const ground = el("div", { className: "hero__fx" });
    ground.setAttribute("aria-hidden", "true");
    hero.prepend(ground);
    try {
      const { default: fx, grainCSS } = await import("./assets/effects/fx.js");
      pointerLight(hero, grainCSS(0.1));
      // edge 2 = light from the top, away from the name; calm keeps the name's area quiet
      const leak = await fx.mount(ground, "film-light-leak", {
        seed: 7,
        params: { edge: 2, intensity: 0.9, spread: 0.55, grain: 0.06, breathe: 7, calmX: 0.4, calmY: 0.75 },
      });
      if (!reduceMotion && !ground.dataset.fxFallback) motion = leak;
    } catch {} // no effect: the hero is the name on the dark ground
  }
  if (!motion) return; // nothing moves, so there is nothing to pause

  let paused = false;
  const setPaused = (next) => {
    paused = next;
    pause.textContent = paused ? "Play motion" : "Pause motion";
    paused ? motion.pause() : motion.resume();
  };
  pause.hidden = false;
  if (motion.startPaused) setPaused(true);
  pause.addEventListener("click", () => setPaused(!paused));
}

/* --------------------------------------------------------------- the name */
/* The name is sized to span the page exactly: measure its width in ems and hand it to the
   CSS, again whenever a font finishes loading (a fallback face has a different width). */
function fitName() {
  const name = document.querySelector(".hero__name");
  const range = document.createRange();
  range.selectNodeContents(name);
  const em = range.getBoundingClientRect().width / parseFloat(getComputedStyle(name).fontSize);
  if (em > 0) document.documentElement.style.setProperty("--name-em", (em * 1.004).toFixed(4));
}

/* ---------------------------------------------------------------- reveals */
/* Each [data-reveal] block eases in once, the first time it scrolls into view. */
function revealOnScroll() {
  const blocks = document.querySelectorAll("[data-reveal]");
  if (reduceMotion) return;
  const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in");
      seen.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  blocks.forEach((b) => seen.observe(b));
}

renderProfile();
renderChannels();
renderWork();
renderFacts();
renderHero();
peekOnHover();
revealOnScroll();
fitName();
document.fonts.addEventListener("loadingdone", fitName);
