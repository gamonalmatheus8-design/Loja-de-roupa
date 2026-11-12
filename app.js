(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // ?motion=on força a cena de entrada mesmo com "reduzir movimento" ligado no sistema (uso em testes).
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on\b/.test(location.search);
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;
  root.classList.add("js");

  // Tamanhos são provisórios: a grade real ainda não foi informada pela marca.
  const SIZES = ["P", "M", "G", "GG"];
  const PIECES = [
    { id: "find-your-own-peace", name: "Find Your Own Peace" },
    { id: "blessed", name: "Blessed" },
    { id: "make-war-not-love", name: "Make War Not Love" },
    { id: "no-hard-feelings", name: "No Hard Feelings" },
    { id: "man-eater", name: "Man Eater" },
    { id: "femme-fatale", name: "Femme Fatale" },
  ];
  const SOON = "Kill Democracy";
  const img = (id, side) => `assets/img/${id}-${side}.png`;
  const star = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#star"/></svg>';
  const live = $("#live");
  const say = (t) => { live.textContent = ""; requestAnimationFrame(() => { live.textContent = t; }); };

  /* ---------- Capa ---------- */
  const gate = $("#gate"), site = $("#site"), hit = $(".gate__hit"), mark = $(".gate__mark");
  if (!fine) $(".gate__hint").textContent = "Toque para entrar";

  function starPoly(cx, cy, R, rot) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? R * 0.38 : R;
      const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)}px ${(cy + r * Math.sin(a)).toFixed(1)}px`);
    }
    return `polygon(${pts.join(",")})`;
  }

  function openSite(focus) {
    gate.hidden = true;
    gate.classList.remove("is-hit");
    site.style.clipPath = "";
    site.inert = false;
    document.body.classList.remove("is-gated", "is-entering");
    fitRows();
    if (focus) $("#heroTitle").focus({ preventScroll: true });
  }

  /* Cena de entrada: soco na capa, estrelas que fogem do ponteiro, lema, BULLY e a estrela que abre o site. */
  const scene = $("#scene"), word = $("#sceneWord"), fx = $("#sceneFx"), ctx = fx.getContext("2d");
  const OUT = "cubic-bezier(.16,1,.3,1)";
  let run = null;
  const ptr = { x: -999, y: -999 };
  addEventListener("pointermove", (e) => { ptr.x = e.clientX; ptr.y = e.clientY; });

  function burst(parts, x, y, n, power) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = power * (0.25 + Math.random());
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - power * 0.25, r: 5 + Math.random() * 20, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: Math.random() < 0.72 ? "#ff2a2a" : "#f2efe9" });
    }
  }
  function drawStar(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? p.r * 0.38 : p.r, a = (i * Math.PI) / 5 - Math.PI / 2; ctx.lineTo(r * Math.cos(a), r * Math.sin(a)); }
    ctx.closePath(); ctx.fillStyle = p.c; ctx.fill(); ctx.restore();
  }
  function beat(text, cls, bg) {
    word.className = "scene__word " + cls;
    word.textContent = text;
    scene.style.background = bg;
    word.animate([{ transform: "scale(1.5)", opacity: 0.2 }, { transform: "scale(1)", opacity: 1 }], { duration: 190, easing: OUT });
  }

  function endScene(focus) {
    if (!run) return;
    run.timers.forEach(clearTimeout);
    const r = run; run = null;
    scene.hidden = true;
    mark.style.opacity = "";
    openSite(focus);
    delete gate.dataset.busy;
    r.fadeAt = performance.now();
    if (!r.skipped) {
      chars.forEach((c, i) => c.animate([{ transform: "translateY(55%) scaleY(1.7)", opacity: 0 }, { transform: "translateY(0) scaleY(1)", opacity: 1 }], { duration: 760, delay: i * 38, easing: OUT, fill: "backwards" }));
      $(".hero__mark").animate([{ transform: "perspective(1000px) rotateY(-150deg) scale(.5)", opacity: 0 }, { transform: "perspective(1000px) rotateY(0) scale(1)", opacity: 1 }], { duration: 1100, delay: 250, easing: OUT, fill: "backwards" });
    }
  }

  function enter(x, y) {
    if (gate.dataset.busy) return;
    gate.dataset.busy = "1";
    if (reduce) { openSite(true); delete gate.dataset.busy; return; }
    const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    fx.width = w * dpr; fx.height = h * dpr; fx.hidden = false;
    const parts = [];
    run = { timers: [], fadeAt: 0, skipped: false };
    const me = run, at = (ms, fn) => me.timers.push(setTimeout(fn, ms));

    // 1. Soco: a capa treme, o monograma avança contra a tela e estoura em estrelas.
    gate.classList.add("is-hit");
    gate.animate([{ transform: "translate(0,0)" }, { transform: "translate(-14px,9px)" }, { transform: "translate(12px,-10px)" }, { transform: "translate(-8px,-6px)" }, { transform: "translate(6px,5px)" }, { transform: "translate(0,0)" }], { duration: 340 });
    mark.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.8)", opacity: 1, offset: 0.25 }, { transform: "scale(7)", opacity: 0 }], { duration: 620, easing: "cubic-bezier(.6,0,.9,.4)" });
    at(600, () => { mark.style.opacity = "0"; });
    burst(parts, x, y, 70, 17);

    // 2. Lema e nome batem na tela, um corte seco por vez.
    at(430, () => { scene.hidden = false; $("#sceneSkip").focus({ preventScroll: true }); beat("Fly High.", "is-gothic", "#000"); });
    at(1010, () => { beat("Dream Higher.", "is-gothic", "#000"); burst(parts, w / 2, h / 2, 26, 12); });
    at(1620, () => { beat("BULLY", "is-slab", "#ff2a2a"); burst(parts, w / 2, h / 2, 40, 20); });

    // 3. A estrela rasga o vermelho e abre o site.
    at(2150, () => {
      const cx = w / 2, cy = h / 2, Rmax = (Math.hypot(cx, cy) / 0.38) * 1.1, t0 = performance.now(), dur = 1000;
      site.style.clipPath = starPoly(cx, cy, 0, 0);
      document.body.classList.add("is-entering");
      fitRows();
      (function frame(now) {
        if (run !== me) return;
        const t = Math.min(1, (now - t0) / dur), e = 0.03 * t + 0.97 * t * t * t;
        site.style.clipPath = starPoly(cx, cy, Rmax * e, -0.35 + 1.5 * e);
        if (t < 1) requestAnimationFrame(frame); else endScene(true);
      })(t0);
    });

    (function tick(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const fade = me.fadeAt ? Math.max(0, 1 - (now - me.fadeAt) / 900) : 1;
      ctx.globalAlpha = fade;
      parts.forEach((p) => {
        const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy);
        if (d < 170 && d > 1) { const f = ((170 - d) / 170) * 2.4; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.16; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        drawStar(p);
      });
      if (fade > 0) requestAnimationFrame(tick); else fx.hidden = true;
    })(performance.now());
  }

  function skipScene() { if (run) { run.skipped = true; endScene(true); } }
  scene.addEventListener("click", skipScene);
  addEventListener("keydown", (e) => { if (run && e.key === "Escape") skipScene(); });
  if (fine) addEventListener("pointermove", (e) => { if (run) word.style.translate = `${(0.5 - e.clientX / innerWidth) * 60}px ${(0.5 - e.clientY / innerHeight) * 44}px`; });

  hit.addEventListener("click", (e) => {
    const kb = e.detail === 0;
    enter(kb ? innerWidth / 2 : e.clientX, kb ? innerHeight / 2 : e.clientY);
  });
  if (fine && !reduce) {
    hit.addEventListener("pointermove", (e) => {
      const px = e.clientX / innerWidth, py = e.clientY / innerHeight;
      hit.style.setProperty("--mx", px * 100 + "%");
      hit.style.setProperty("--my", py * 100 + "%");
      mark.style.setProperty("--ry", (px - 0.5) * 34 + "deg");
      mark.style.setProperty("--rx", (0.5 - py) * 26 + "deg");
    });
  }
  $("#backToGate").addEventListener("click", () => {
    scrollTo({ top: 0, behavior: "instant" });
    site.inert = true;
    document.body.classList.add("is-gated");
    gate.hidden = false;
    hit.focus();
  });

  /* ---------- Título que cabe na coluna e reage ao ponteiro ---------- */
  const rows = $$(".fit");
  rows.forEach((row) => { row.innerHTML = [...row.textContent].map((c) => `<span class="char">${c}</span>`).join(""); });
  function fitRows() {
    rows.forEach((row) => {
      const target = row.parentElement.clientWidth;
      if (!target) return;
      row.style.fontSize = "100px";
      row.style.fontSize = (100 * target) / row.scrollWidth + "px";
    });
  }
  addEventListener("resize", fitRows);
  document.fonts.ready.then(fitRows);
  const chars = $$(".char");
  function heat(x, y) {
    chars.forEach((c) => {
      const r = c.getBoundingClientRect();
      const d = Math.hypot(x - (r.left + r.width / 2), (y - (r.top + r.height / 2)) * 0.6);
      c.style.setProperty("--s", (1 + 0.32 * Math.max(0, 1 - d / (innerWidth * 0.17))).toFixed(3));
    });
  }
  if (!reduce) {
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => heat(e.clientX, e.clientY));
    hero.addEventListener("pointerleave", () => chars.forEach((c) => c.style.setProperty("--s", 1)));
  }

  /* ---------- Inclinação 3D ---------- */
  function tilt(area, el, max) {
    if (!fine || reduce) return;
    area.addEventListener("pointermove", (e) => {
      const r = area.getBoundingClientRect();
      el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * max + "deg");
      el.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * max + "deg");
    });
    area.addEventListener("pointerleave", () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); });
  }
  tilt($(".hero"), $(".hero__mark"), 30);
  tilt($("#sobre"), $("#aboutMark"), 26);

  /* ---------- Faixas que aceleram com a rolagem ---------- */
  const marquees = $$("[data-marquee]").map((el) => {
    const words = el.dataset.words ? el.dataset.words.split("|") : [...PIECES.map((p) => p.name), SOON];
    const track = $(".marquee__track", el);
    const set = words.map((w) => `<span class="marquee__item">${w}${star}</span>`).join("");
    track.innerHTML = set.repeat(el.dataset.words ? 8 : 4);
    return { track, x: 0, n: el.dataset.words ? 8 : 4, dir: el.dataset.words ? 1 : -1 };
  });
  let lastY = scrollY, vel = 0;
  const aboutMark = $("#aboutMark"), about = $("#sobre");
  function loop() {
    const dy = scrollY - lastY; lastY = scrollY;
    vel += (dy - vel) * 0.12;
    marquees.forEach((m) => {
      const unit = m.track.scrollWidth / m.n;
      if (!unit) return;
      m.x += m.dir * (0.7 + Math.abs(vel) * 0.55) * (vel < -0.5 ? -1 : 1);
      m.x = ((m.x % unit) - unit) % unit;
      m.track.style.transform = `translate3d(${m.x}px,0,0)`;
    });
    const r = about.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) {
      const p = (innerHeight - r.top) / (innerHeight + r.height);
      aboutMark.style.setProperty("--spin", ((p - 0.5) * 50).toFixed(2) + "deg");
    }
    requestAnimationFrame(loop);
  }
  if (!reduce) requestAnimationFrame(loop);

  /* ---------- Drop ---------- */
  const rack = $("#rack");
  rack.innerHTML = PIECES.map((p, i) => `
    <article class="piece" data-id="${p.id}" style="--i:${i % 3}">
      <button class="piece__plate" type="button" aria-pressed="false" aria-label="${p.name}: virar a camisa e ver as costas">
        <img class="front" src="${img(p.id, "front")}" width="640" height="640" alt="Camisa ${p.name}, frente" loading="lazy">
        <img class="back" src="${img(p.id, "back")}" width="640" height="640" alt="Camisa ${p.name}, costas" loading="lazy">
        <span class="piece__side" aria-hidden="true">Frente</span>
      </button>
      <h3 class="piece__name">${p.name}</h3>
      <p class="piece__price">Preço no lançamento</p>
      <div class="piece__buy">
        <fieldset class="sizes">
          <legend class="sr">Tamanho da ${p.name}</legend>
          ${SIZES.map((s) => `<label><input type="radio" name="size-${p.id}" value="${s}">${s}</label>`).join("")}
        </fieldset>
        <button class="btn piece__add" type="button">Pôr na sacola</button>
        <p class="piece__hint" role="status"></p>
      </div>
    </article>`).join("") + `
    <article class="piece piece--soon" id="soon">
      <div>
        <span class="soon__tag">Em breve</span>
        <h3 class="piece__name" id="soonName">${SOON}</h3>
      </div>
      <p>A sétima camisa do Drop 01. Imagem ainda não liberada.</p>
    </article>`;

  rack.addEventListener("click", (e) => {
    const plate = e.target.closest(".piece__plate");
    if (plate) {
      const on = plate.getAttribute("aria-pressed") !== "true";
      plate.setAttribute("aria-pressed", on);
      $(".piece__side", plate).textContent = on ? "Costas" : "Frente";
      return;
    }
    const add = e.target.closest(".piece__add");
    if (!add) return;
    const card = add.closest(".piece"), id = card.dataset.id;
    const picked = $("input:checked", card), hint = $(".piece__hint", card), sizes = $(".sizes", card);
    if (!picked) {
      hint.textContent = "Escolha um tamanho antes de pôr na sacola.";
      sizes.classList.remove("shake"); void sizes.offsetWidth; sizes.classList.add("shake");
      $("input", sizes).focus();
      return;
    }
    hint.textContent = "";
    addItem(id, picked.value);
    fly($(".front", card));
    add.textContent = "Na sacola";
    setTimeout(() => { add.textContent = "Pôr na sacola"; }, 1300);
  });
  if (fine) {
    rack.addEventListener("pointerover", (e) => { const p = e.target.closest(".piece__plate"); if (p && p.getAttribute("aria-pressed") !== "true") $(".piece__side", p).textContent = "Costas"; });
    rack.addEventListener("pointerout", (e) => { const p = e.target.closest(".piece__plate"); if (p && p.getAttribute("aria-pressed") !== "true") $(".piece__side", p).textContent = "Frente"; });
  }

  // Nome da peça sem imagem embaralha ao aparecer e ao passar o ponteiro.
  const soonName = $("#soonName");
  let scrambling = false;
  function scramble() {
    if (scrambling || reduce) return;
    scrambling = true;
    const glyphs = "XKD#%/!?", t0 = performance.now(), dur = 700;
    (function frame(now) {
      const t = (now - t0) / dur;
      soonName.textContent = [...SOON].map((c, i) => (c === " " || i / SOON.length < t ? c : glyphs[(Math.random() * glyphs.length) | 0])).join("");
      if (t < 1) requestAnimationFrame(frame); else { soonName.textContent = SOON; scrambling = false; }
    })(t0);
  }
  $("#soon").addEventListener("pointerenter", scramble);

  /* ---------- Revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.id === "soon") scramble();
      io.unobserve(en.target);
    });
  }, { threshold: 0.18 });
  $$(".piece, #aboutTitle").forEach((el) => io.observe(el));
  $("#aboutTitle").addEventListener("pointerenter", (e) => { const el = e.currentTarget; el.classList.remove("in"); void el.offsetWidth; el.classList.add("in"); });

  /* ---------- Sacola ---------- */
  const KEY = "bully-bag-v1";
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem(KEY)) || []; } catch { bag = []; }
  bag = bag.filter((it) => PIECES.some((p) => p.id === it.id) && SIZES.includes(it.size) && it.qty > 0);
  const dlg = $("#bag"), list = $("#bagList"), count = $("#bagCount"), msg = $("#checkoutMsg");
  const nameOf = (id) => PIECES.find((p) => p.id === id).name;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch { /* sem armazenamento: a sacola vale só nesta visita */ } }
  function render() {
    const total = bag.reduce((n, it) => n + it.qty, 0);
    count.textContent = total;
    list.innerHTML = bag.map((it, i) => `
      <li class="item" data-i="${i}">
        <div class="item__img"><img src="${img(it.id, "front")}" width="84" height="84" alt=""></div>
        <p class="item__name">${nameOf(it.id)}</p>
        <p class="item__meta">Tamanho ${it.size}. Preço no lançamento.</p>
        <div class="item__row">
          <span class="qty">
            <button type="button" data-act="dec" aria-label="Diminuir quantidade de ${nameOf(it.id)} ${it.size}">-</button>
            <output aria-label="Quantidade">${it.qty}</output>
            <button type="button" data-act="inc" aria-label="Aumentar quantidade de ${nameOf(it.id)} ${it.size}">+</button>
          </span>
          <button class="link" type="button" data-act="del">Remover</button>
        </div>
      </li>`).join("");
    msg.textContent = "";
    save();
  }
  function addItem(id, size) {
    const found = bag.find((it) => it.id === id && it.size === size);
    if (found) found.qty += 1; else bag.push({ id, size, qty: 1 });
    render();
    count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump");
    say(`${nameOf(id)}, tamanho ${size}, adicionada à sacola.`);
  }
  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const i = +b.closest(".item").dataset.i, it = bag[i];
    if (b.dataset.act === "inc") it.qty += 1;
    if (b.dataset.act === "dec") it.qty -= 1;
    if (b.dataset.act === "del" || it.qty < 1) { bag.splice(i, 1); say(`${nameOf(it.id)} removida da sacola.`); }
    render();
    const next = $(`.item[data-i="${Math.min(i, bag.length - 1)}"] [data-act="${b.dataset.act}"]`, list);
    (next || $("#bagClose")).focus();
  });
  $("#bagOpen").addEventListener("click", () => { dlg.showModal(); });
  function closeBag() {
    if (reduce || dlg.classList.contains("is-closing")) { if (reduce) dlg.close(); return; }
    dlg.classList.add("is-closing");
    setTimeout(() => { dlg.classList.remove("is-closing"); dlg.close(); }, 200);
  }
  $("#bagClose").addEventListener("click", closeBag);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) closeBag(); });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); closeBag(); });
  $("#checkout").addEventListener("click", () => {
    msg.textContent = bag.length
      ? "O pagamento ainda não está ligado: este site é um esboço. Preço, frete e fechamento entram quando o drop for definido."
      : "A sacola está vazia. Ponha uma camisa antes de fechar o pedido.";
  });
  render();

  function fly(src) {
    if (reduce) return;
    const a = src.getBoundingClientRect(), b = $("#bagOpen").getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "fly";
    el.innerHTML = `<img src="${src.getAttribute("src")}" alt="">`;
    Object.assign(el.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
    document.body.append(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    el.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(.06) rotate(18deg)`, opacity: 0.85 }],
      { duration: 620, easing: "cubic-bezier(.5,0,.2,1)" }).onfinish = () => el.remove();
  }

  /* ---------- Cursor de estrela e faíscas ---------- */
  if (fine && !reduce) {
    const cur = $("#cursor");
    let tx = -100, ty = -100, cx = tx, cy = ty;
    root.classList.add("has-cursor");
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cur.classList.toggle("is-on", !dlg.open);
      cur.classList.toggle("is-hot", !!e.target.closest("a, button, label, .next__list li"));
    });
    document.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
    (function follow() {
      cx += (tx - cx) * 0.3; cy += (ty - cy) * 0.3;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      requestAnimationFrame(follow);
    })();
  }
  if (!reduce) {
    addEventListener("pointerdown", (e) => {
      if (dlg.open) return;
      for (let i = 0; i < 7; i++) {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("viewBox", "0 0 100 100");
        s.setAttribute("class", "spark");
        s.innerHTML = '<use href="#star"/>';
        document.body.append(s);
        const a = (i / 7) * Math.PI * 2 + Math.random() * 0.6, d = 46 + Math.random() * 70;
        s.animate([
          { transform: `translate(${e.clientX}px,${e.clientY}px) scale(.3)`, opacity: 1 },
          { transform: `translate(${e.clientX + Math.cos(a) * d}px,${e.clientY + Math.sin(a) * d}px) scale(${0.7 + Math.random()}) rotate(${140 + Math.random() * 160}deg)`, opacity: 0 },
        ], { duration: 520 + Math.random() * 260, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => s.remove();
      }
    });
  }

  /* ---------- Link direto pula a capa ---------- */
  if (location.hash && $(location.hash)) {
    openSite(false);
    $(location.hash).scrollIntoView();
  } else {
    scrollTo(0, 0);
  }
})();
