/* ==========================================================
   ENGINE. Reads window.CONFIG and builds the story.
   You normally never need to edit this file.
   Sections: 1 helpers | 2 slide builders | 3 navigation | 4 effects
   ========================================================== */
(function () {
  const C = window.CONFIG;
  const stage = document.getElementById("stage");
  const bars = document.getElementById("bars");

  /* ---------- 1. HELPERS ---------- */
  // Escape text so stray characters like "<" can never break the page.
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  // Turn a normal Spotify share link into an embeddable player link.
  const embed = u => u.split("?")[0].replace("open.spotify.com/", "open.spotify.com/embed/");
  const days = Math.max(0, Math.floor((Date.now() - new Date(C.anniversaryDate + "T00:00:00")) / 864e5));

  /* ---------- 2. SLIDE BUILDERS ----------
     hold:true = slide waits for a tap (it has things to scroll, play or read). */
  const slides = [];
  const add = (html, hold = false, cls = "") => slides.push({ html, hold, cls });

  add(`<h1 class="big">${esc(C.intro.title)}</h1>
       <p class="lead">${esc(C.herName)} &amp; ${esc(C.yourName)}</p>
       <p>${esc(C.intro.subtitle)}</p>
       <p class="cue">${esc(C.intro.button)}</p>`, true, "intro");

  add(`<h2>${esc(C.timeline.heading)}</h2>
       <ol class="tl">${C.timeline.milestones.map(m => `
         <li><time>${fmtDate(m.date)}</time><b>${esc(m.title)}</b><span>${esc(m.text)}</span></li>`).join("")}</ol>`, true);

  const autoStats = [
    { value: days, label: "days together" },
    { value: days * 24, label: "hours of being yours" },
    { value: Math.floor(days / 7), label: "weeks of us" }
  ];
  add(`<h2>${esc(C.stats.heading)}</h2>
       <div class="stats">${autoStats.concat(C.stats.custom).map(s => `
         <div class="stat"><strong data-count="${s.value}">0</strong><strong>${esc(s.suffix || "")}</strong><span>${esc(s.label)}</span></div>`).join("")}</div>`, true);

  add(`<p class="lead">${esc(C.stats.topTitle)}</p><h2 class="big small">${esc(C.stats.topText)}</h2>`);

  add(`<h2>${esc(C.photos.heading)}</h2>
       <p class="para">${esc(C.photos.paragraph)}</p>
       <div class="gallery">${C.photos.items.map(p => `
         <figure><img src="${esc(p.src)}" alt="Aadvika and Shivansh" style="object-position:${esc(p.focus || "center 35%")}" loading="lazy"></figure>`).join("")}</div>
       <p class="cue">swipe the photos sideways</p>`, true);

  add(`<h2>${esc(C.soundtrack.heading)}</h2><p>${esc(C.soundtrack.intro)}</p>
       ${C.soundtrack.songs.map(s => `
         <div class="song"><b>${esc(s.title)}</b> <em>${esc(s.artist)}</em>${s.why ? `<p>${esc(s.why)}</p>` : ""}
         <iframe src="${esc(embed(s.spotify))}" height="152" loading="lazy" allow="encrypted-media; clipboard-write" title="${esc(s.title)}"></iframe></div>`).join("")}
       ${C.soundtrack.topArtist ? `<p class="lead">Top artist: ${esc(C.soundtrack.topArtist)}</p>` : ""}`, true);

  C.messages.items.forEach((m, i) =>
    add(`${i === 0 ? `<p class="lead">${esc(C.messages.heading)}</p>` : ""}<blockquote>${esc(m)}</blockquote>`));

  add(`<h1 class="big">${esc(C.finale.title)}</h1><p class="lead">${esc(C.finale.text)}</p>
       <p>${esc(C.finale.signature)}, ${esc(C.yourName)}</p>
       <button class="again" id="again">Watch again</button>`, true);

  /* ---------- 3. NAVIGATION ---------- */
  let cur = -1, started = false;
  slides.forEach((s, i) => {
    const el = document.createElement("section");
    el.className = "slide " + s.cls;
    el.style.setProperty("--hue", (i * 37) % 360);      // each slide gets its own colour mood
    el.innerHTML = `<div class="inner">${s.html}</div>`;
    stage.appendChild(el);
    bars.appendChild(document.createElement("i"));
  });
  const els = [...stage.children], barEls = [...bars.children];

  function go(n) {
    if (n < 0 || n >= slides.length) return;
    cur = n;
    els.forEach((e, i) => e.classList.toggle("on", i === n));
    barEls.forEach((b, i) => { b.className = i < n ? "done" : ""; b.style.animationDuration = ""; });
    if (C.autoAdvance && started && !slides[n].hold) {   // animate the bar, then move on
      barEls[n].style.animationDuration = C.slideSeconds + "s";
      barEls[n].className = "run";
    } else barEls[n].className = "done";
    els[n].querySelector(".inner").scrollTop = 0;
    countUp(els[n]);
    if (n === slides.length - 1) hearts(30);
  }

  // When an auto bar finishes, go to the next slide.
  bars.addEventListener("animationend", e => { if (e.animationName === "end") go(cur + 1); });
  const next = () => { started = true; go(cur + 1); };
  const prev = () => go(cur - 1);
  document.getElementById("next").onclick = next;
  document.getElementById("prev").onclick = prev;
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === " ") next();
    if (e.key === "ArrowLeft") prev();
  });
  // Swipe left/right (ignored while swiping the photo gallery).
  let x0 = null;
  stage.addEventListener("touchstart", e => { x0 = e.target.closest(".gallery, iframe") ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 60) dx < 0 ? next() : prev();
  });
  // Press and hold to pause the auto timer.
  const pause = on => bars.classList.toggle("paused", on);
  stage.addEventListener("pointerdown", () => pause(true));
  ["pointerup", "pointercancel", "pointerleave"].forEach(ev => stage.addEventListener(ev, () => pause(false)));
  document.getElementById("again").addEventListener("click", () => { started = false; go(0); });

  /* ---------- 4. EFFECTS ---------- */
  function countUp(slide) {
    slide.querySelectorAll("[data-count]").forEach(n => {
      const end = +n.dataset.count, t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / 1600, 1);
        n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }
  function hearts(n) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.getElementById("hearts");
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.textContent = ["♥", "✦", "♡"][i % 3];
      h.style.left = Math.random() * 100 + "vw";
      h.style.animationDelay = Math.random() * 3 + "s";
      h.style.fontSize = 14 + Math.random() * 22 + "px";
      box.appendChild(h);
      setTimeout(() => h.remove(), 10000);
    }
  }

  go(0);
})();
