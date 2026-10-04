(function () {
  "use strict";

  // ---------- helpers ----------
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAY = 86400000;
  const today = () => new Date().toISOString().slice(0, 10);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = (s) => String(s).toLowerCase().replace(/ё/g, "е");

  // ---------- storage ----------
  const KEY = "talknative.v1";
  const defaults = () => ({ p: {}, settings: { hideVulgar: false, rate: 0.95, voice: "", newPerSession: 20, twoCols: true }, custom: [], days: {} });
  let S;
  try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = defaults(); }
  S.settings = Object.assign(defaults().settings, S.settings);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } };
  const prog = (id) => S.p[id] || (S.p[id] = { box: 0, due: 0, seen: 0, fav: false, st: 0 });
  const peek = (id) => S.p[id] || null;
  // st: 0 new, 1 learning, 2 learned
  const statusOf = (id) => { const p = peek(id); return p ? p.st : 0; };
  const logReview = () => { const d = today(); S.days[d] = (S.days[d] || 0) + 1; };

  // ---------- data ----------
  const CATS = window.CATEGORIES;
  const CAT = Object.fromEntries(CATS.map((c) => [c.id, c]));
  CATS.push({ id: "custom", icon: "✍️", name: "Мои фразы" });
  CAT.custom = CATS[CATS.length - 1];

  function buildPhrases() {
    const list = window.PHRASES.map((p) => Object.assign({ id: "p:" + p.cat + ":" + p.en.toLowerCase(), kind: "p" }, p));
    S.custom.forEach((p) => list.push(Object.assign({ kind: "p", cat: "custom", ex: [], f: 3, r: "i", t: "m" }, p)));
    return list;
  }
  let PH = buildPhrases();
  const PH_BY_ID = () => Object.fromEntries(PH.map((p) => [p.id, p]));
  let phIndex = PH_BY_ID();

  const SECS = window.WORD_SECTIONS;
  const WD = window.WORDS.map(([n, en, ipa, ru, sec]) => ({ id: "w:" + n, kind: "w", n, en, ipa, ru, sec }));
  const wdIndex = Object.fromEntries(WD.map((w) => [w.id, w]));
  const itemById = (id) => phIndex[id] || wdIndex[id];

  const visiblePH = () => S.settings.hideVulgar ? PH.filter((p) => p.r !== "v") : PH;

  // ---------- speech ----------
  let voices = [];
  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
  }
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text) {
    if (!("speechSynthesis" in window)) { toast("Озвучка не поддерживается этим браузером"); return; }
    speechSynthesis.cancel();
    const clean = String(text).replace(/\(.*?\)|…|\.\.\./g, " ").split(" / ")[0];
    const u = new SpeechSynthesisUtterance(clean);
    const v = voices.find((x) => x.name === S.settings.voice) || voices.find((x) => /en-US/i.test(x.lang)) || voices[0];
    if (v) u.voice = v;
    u.lang = v ? v.lang : "en-US";
    u.rate = S.settings.rate;
    speechSynthesis.speak(u);
  }

  // ---------- toast ----------
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800); }

  // ---------- rendering bits ----------
  const TYPE = { d: "Прямой перевод", m: "Запомнить" };
  const REG = { n: "нейтрально", i: "разговорно", r: "грубо", v: "мат 🔞" };
  const stars = (f) => '<span class="stars" title="Частота ' + f + '/5">' + "★".repeat(f) + '<span class="off">' + "★".repeat(5 - f) + "</span></span>";

  function phraseCard(p, open) {
    const st = statusOf(p.id), fav = peek(p.id) && peek(p.id).fav;
    const cls = ["card", "ph", st === 2 ? "learned" : st === 1 ? "learning" : "", open ? "open" : ""].join(" ");
    let body = "";
    if (p.n) body += '<p class="note">' + esc(p.n) + "</p>";
    if (p.lit) body += '<p class="lit">Дословно: «' + esc(p.lit) + "»</p>";
    (p.ex || []).forEach((e) => {
      body += '<div class="ex"><button class="icon-btn" data-say="' + esc(e[0]) + '" title="Озвучить">🔊</button><div><div class="ex-en">' + esc(e[0]) + '</div><div class="ex-ru">' + esc(e[1]) + "</div></div></div>";
    });
    if (p.alt && p.alt.length) body += '<div class="alt"><b>Похожие:</b> ' + p.alt.map(esc).join(", ") + "</div>";
    body += '<div class="status-row">' +
      '<button class="btn' + (st === 1 ? " on" : "") + '" data-st="1">📘 Учу</button>' +
      '<button class="btn' + (st === 2 ? " on" : "") + '" data-st="2">✅ Знаю</button>' +
      (st ? '<button class="btn" data-st="0">↺ Сбросить</button>' : "") +
      (p.cat === "custom" ? '<button class="btn" data-del="1">🗑 Удалить</button>' : "") +
      "</div>";
    return '<article class="' + cls + '" data-id="' + esc(p.id) + '">' +
      '<div class="ph-head"><div class="ph-main" data-toggle="1">' +
      '<div class="ph-en">' + esc(p.en) + "</div>" +
      '<div class="ph-ru">' + esc(p.ru) + "</div>" +
      '<div class="ph-meta">' + stars(p.f) +
      '<span class="badge t-' + p.t + '">' + TYPE[p.t] + "</span>" +
      '<span class="badge r-' + p.r + '">' + REG[p.r] + "</span>" +
      (p.reg ? '<span class="badge">' + esc(p.reg) + "</span>" : "") +
      (ui.cat === "" ? '<span class="badge">' + CAT[p.cat].icon + " " + esc(CAT[p.cat].name) + "</span>" : "") +
      "</div></div>" +
      '<div class="ph-actions"><button class="icon-btn" data-say="' + esc(p.en) + '" title="Озвучить">🔊</button>' +
      '<button class="icon-btn ' + (fav ? "fav-on" : "") + '" data-fav="1" title="В избранное">' + (fav ? "★" : "☆") + "</button></div>" +
      "</div>" +
      '<div class="ph-body">' + body + "</div></article>";
  }

  // ---------- PHRASES VIEW ----------
  const ui = { cat: "", q: "", type: "", reg: "", freq: 0, status: "", sort: "freq", limit: 60, open: new Set() };
  const PAGE = 60;

  function renderCats() {
    const c = ui.cat && CAT[ui.cat];
    $("#ph-topic-ic").textContent = c ? c.icon : "📚";
    $("#ph-topic-l").textContent = c ? c.name : "Все темы";
    const n = (ui.type ? 1 : 0) + (ui.reg ? 1 : 0) + (ui.freq ? 1 : 0) + (ui.status ? 1 : 0) + (ui.sort !== "freq" ? 1 : 0);
    $("#ph-filt-n").hidden = !n;
    $("#ph-filt-n").textContent = n;
  }

  // ---------- окно выбора темы ----------
  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return n + " " + (m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c); };
  let sheetPick = null;
  function tile(id, icon, name, items, active) {
    const l = items.filter((x) => statusOf(x.id) === 2).length;
    return '<button class="tile' + (active ? " active" : "") + '" data-pick="' + id + '"><span class="ti">' + icon + '</span><span class="tn">' + esc(name) + "</span>" +
      '<span class="tc">' + plural(items.length, "шт.", "шт.", "шт.") + (l ? " · ✓ " + l : "") + "</span>" +
      '<span class="tb"><i style="width:' + (items.length ? (l / items.length) * 100 : 0) + '%"></i></span></button>';
  }
  function openSheet(kind) {
    let h = "";
    if (kind === "ph") {
      const vis = visiblePH();
      h += '<button class="tile wide' + (!ui.cat ? " active" : "") + '" data-pick=""><span class="ti">📚</span><span class="tn">Все темы</span><span class="spacer"></span><span class="tc">' + vis.length + " фраз</span></button>";
      window.CATEGORY_GROUPS.forEach((g) => {
        const ids = g.ids.filter((id) => CAT[id] && vis.some((p) => p.cat === id));
        if (!ids.length) return;
        h += '<div class="sheet-sec">' + esc(g.name) + "</div>";
        ids.forEach((id) => { h += tile(id, CAT[id].icon, CAT[id].name, vis.filter((p) => p.cat === id), ui.cat === id); });
      });
      $("#sheet-title").textContent = "Выбери тему";
      sheetPick = (v) => { ui.cat = v; ui.limit = PAGE; renderPhrases(); };
    } else {
      h += '<button class="tile wide' + (!wui.sec ? " active" : "") + '" data-pick=""><span class="ti">📖</span><span class="tn">Все разделы</span><span class="spacer"></span><span class="tc">' + WD.length + " слов</span></button>";
      Object.keys(SECS).forEach((k) => {
        if (S.settings.hideVulgar && k === "intimate") return;
        h += tile(k, WORD_ICONS[k] || "📖", SECS[k], WD.filter((w) => w.sec === k), wui.sec === k);
      });
      $("#sheet-title").textContent = "Разделы словаря";
      sheetPick = (v) => { wui.sec = v; wui.limit = 100; renderWords(); };
    }
    $("#sheet-grid").innerHTML = h;
    $("#sheet").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeSheet() { $("#sheet").hidden = true; document.body.style.overflow = ""; }
  const WORD_ICONS = { slang: "😎", func: "🔤", nouns: "📦", drinks: "🍷", travel: "✈️", adj: "🎨", people: "🧑", dating: "💘", intimate: "🔞", work: "💼", netslang: "💬", social: "📱", verbs: "🏃" };
  $("#sheet").addEventListener("click", (e) => {
    if (e.target.id === "sheet" || e.target.closest("#sheet-close")) { closeSheet(); return; }
    const t = e.target.closest("[data-pick]");
    if (t && sheetPick) { sheetPick(t.dataset.pick); closeSheet(); window.scrollTo({ top: 0 }); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#sheet").hidden) closeSheet(); });

  function matchStatus(id, f) {
    if (!f) return true;
    const p = peek(id);
    if (f === "fav") return !!(p && p.fav);
    const st = p ? p.st : 0;
    return f === "new" ? st === 0 : f === "learning" ? st === 1 : st === 2;
  }

  function filteredPhrases() {
    const q = norm(ui.q.trim());
    const catOrder = Object.fromEntries(CATS.map((c, i) => [c.id, i]));
    let list = visiblePH().filter((p) =>
      (!ui.cat || p.cat === ui.cat) &&
      (!ui.type || p.t === ui.type) &&
      (!ui.reg || p.r === ui.reg) &&
      (p.f >= ui.freq) &&
      matchStatus(p.id, ui.status) &&
      (!q || norm(p.en + " " + p.ru + " " + (p.alt || []).join(" ") + " " + (p.n || "")).includes(q))
    );
    if (ui.sort === "az") list.sort((a, b) => a.en.localeCompare(b.en));
    else if (ui.sort === "cat") list.sort((a, b) => catOrder[a.cat] - catOrder[b.cat] || b.f - a.f);
    else list.sort((a, b) => b.f - a.f || catOrder[a.cat] - catOrder[b.cat]);
    if (q) {
      // точные совпадения по началу фразы — наверх
      list.sort((a, b) => (norm(b.en).startsWith(q) ? 1 : 0) - (norm(a.en).startsWith(q) ? 1 : 0));
    }
    return list;
  }

  function renderPhrases() {
    renderCats();
    const list = filteredPhrases();
    $("#ph-count").textContent = plural(list.length, "фраза", "фразы", "фраз");
    $("#ph-list").classList.toggle("two", S.settings.twoCols);
    if (!list.length) {
      $("#ph-list").innerHTML = '<div class="empty">Ничего не найдено 🤷</div>';
      $("#ph-more").hidden = true;
      return;
    }
    $("#ph-list").innerHTML = list.slice(0, ui.limit).map((p) => phraseCard(p, ui.open.has(p.id))).join("");
    $("#ph-more").hidden = list.length <= ui.limit;
    $("#ph-more").textContent = "Показать ещё (" + (list.length - ui.limit) + ")";
  }

  function refreshCard(id) {
    const el = $('#ph-list article[data-id="' + CSS.escape(id) + '"]');
    const p = phIndex[id];
    if (el && p) el.outerHTML = phraseCard(p, ui.open.has(id));
  }

  function bindPhrases() {
    let t;
    $("#ph-search").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { ui.q = e.target.value; ui.limit = PAGE; renderPhrases(); }, 120); });
    $("#ph-topic").addEventListener("click", () => openSheet("ph"));
    $("#ph-filt-btn").addEventListener("click", () => {
      const f = $("#ph-filters"); f.hidden = !f.hidden; $("#ph-filt-btn").classList.toggle("on", !f.hidden);
    });
    $("#ph-reset").addEventListener("click", () => {
      Object.assign(ui, { type: "", reg: "", freq: 0, status: "", sort: "freq", limit: PAGE });
      ["#ph-type", "#ph-reg", "#ph-status"].forEach((s) => ($(s).value = ""));
      $("#ph-freq").value = "0"; $("#ph-sort").value = "freq";
      renderPhrases();
    });
    [["#ph-type", "type"], ["#ph-reg", "reg"], ["#ph-status", "status"], ["#ph-sort", "sort"]].forEach(([s, k]) =>
      $(s).addEventListener("change", (e) => { ui[k] = e.target.value; ui.limit = PAGE; renderPhrases(); }));
    $("#ph-freq").addEventListener("change", (e) => { ui.freq = +e.target.value; ui.limit = PAGE; renderPhrases(); });
    $("#ph-more").addEventListener("click", () => { ui.limit += PAGE; renderPhrases(); });
    $("#ph-list").addEventListener("click", onItemClick);
  }

  function onItemClick(e) {
    const say = e.target.closest("[data-say]");
    if (say) { speak(say.dataset.say); return; }
    const art = e.target.closest("[data-id]"); if (!art) return;
    const id = art.dataset.id;
    if (e.target.closest("[data-fav]")) {
      const p = prog(id); p.fav = !p.fav; save(); refresh(id); toast(p.fav ? "Добавлено в избранное" : "Убрано из избранного"); return;
    }
    const stb = e.target.closest("[data-st]");
    if (stb) {
      const p = prog(id), v = +stb.dataset.st;
      p.st = v;
      if (v === 2) { p.box = Math.max(p.box, 5); p.due = Date.now() + 30 * DAY; p.seen = p.seen || Date.now(); }
      if (v === 0) { p.box = 0; p.due = 0; p.seen = 0; }
      if (v === 1 && !p.seen) { p.seen = Date.now(); p.due = Date.now(); }
      save(); refresh(id); return;
    }
    if (e.target.closest("[data-del]")) {
      if (!confirm("Удалить эту фразу?")) return;
      S.custom = S.custom.filter((c) => c.id !== id); delete S.p[id]; save();
      PH = buildPhrases(); phIndex = PH_BY_ID(); renderPhrases(); return;
    }
    if (e.target.closest("[data-toggle]")) {
      if (ui.open.has(id)) ui.open.delete(id); else ui.open.add(id);
      art.classList.toggle("open");
    }
    const wr = e.target.closest("[data-wl]");
    if (wr) {
      const p = prog(id); p.st = p.st === 2 ? 0 : 2;
      if (p.st === 2) { p.box = Math.max(p.box, 5); p.due = Date.now() + 30 * DAY; p.seen = p.seen || Date.now(); } else { p.box = 0; p.due = 0; p.seen = 0; }
      save(); renderWords();
    }
  }
  function refresh(id) { if (id.startsWith("w:")) renderWords(); else refreshCard(id); }

  // ---------- WORDS VIEW ----------
  const wui = { sec: "", q: "", status: "", limit: 100 };
  function renderWords() {
    $("#w-topic-l").textContent = wui.sec ? SECS[wui.sec] : "Все разделы";
    const q = norm(wui.q.trim());
    const list = WD.filter((w) => (!wui.sec || w.sec === wui.sec) &&
      !(S.settings.hideVulgar && w.sec === "intimate") &&
      (!wui.status || (wui.status === "fav" ? (peek(w.id) || {}).fav : wui.status === "learned" ? statusOf(w.id) === 2 : statusOf(w.id) !== 2)) &&
      (!q || norm(w.en + " " + w.ru).includes(q)));
    $("#w-count").textContent = plural(list.length, "слово", "слова", "слов");
    $("#w-list").innerHTML = list.length ? list.slice(0, wui.limit).map((w) => {
      const p = peek(w.id) || {};
      return '<div class="w-row' + (p.st === 2 ? " learned" : "") + '" data-id="' + w.id + '">' +
        '<span class="w-num">' + w.n + "</span>" +
        '<div class="w-en">' + esc(w.en) + '<span class="w-ipa">' + esc(w.ipa) + "</span></div>" +
        '<div class="w-ru">' + esc(w.ru) + "</div>" +
        '<div class="w-act"><button class="icon-btn" data-say="' + esc(w.en) + '" title="Озвучить">🔊</button>' +
        '<button class="icon-btn ' + (p.fav ? "fav-on" : "") + '" data-fav="1" title="В избранное">' + (p.fav ? "★" : "☆") + "</button>" +
        '<button class="icon-btn" data-wl="1" title="Знаю / не знаю">' + (p.st === 2 ? "✅" : "⬜") + "</button></div></div>";
    }).join("") : '<div class="empty">Ничего не найдено</div>';
    $("#w-more").hidden = list.length <= wui.limit;
    $("#w-more").textContent = "Показать ещё (" + (list.length - wui.limit) + ")";
  }
  function bindWords() {
    let t;
    $("#w-search").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { wui.q = e.target.value; wui.limit = 100; renderWords(); }, 120); });
    $("#w-topic").addEventListener("click", () => openSheet("w"));
    $("#w-status").addEventListener("change", (e) => { wui.status = e.target.value; wui.limit = 100; renderWords(); });
    $("#w-more").addEventListener("click", () => { wui.limit += 100; renderWords(); });
    $("#w-list").addEventListener("click", (e) => {
      if (e.target.closest("[data-fav]")) { const id = e.target.closest("[data-id]").dataset.id; const p = prog(id); p.fav = !p.fav; save(); renderWords(); return; }
      onItemClick(e);
    });
  }

  // ---------- deck sources (shared by cards & quiz) ----------
  function deckOptions() {
    let h = '<optgroup label="Фразы"><option value="ph:all">Все фразы</option><option value="ph:fav">⭐ Избранные (фразы и слова)</option><option value="ph:top">Самые частые (★★★★★)</option>';
    CATS.forEach((c) => { if (visiblePH().some((p) => p.cat === c.id)) h += '<option value="ph:' + c.id + '">' + c.icon + " " + esc(c.name) + "</option>"; });
    h += '</optgroup><optgroup label="Словарь (1000 слов)"><option value="w:all">Все слова</option>';
    Object.keys(SECS).forEach((k) => { if (!(S.settings.hideVulgar && k === "intimate")) h += '<option value="w:' + k + '">' + esc(SECS[k]) + "</option>"; });
    return h + "</optgroup>";
  }
  function deckItems(src) {
    const [kind, k] = src.split(":");
    if (k === "fav") return PH.concat(WD).filter((x) => (peek(x.id) || {}).fav);
    if (kind === "ph") {
      const v = visiblePH();
      if (k === "all") return v;
      if (k === "top") return v.filter((p) => p.f === 5);
      return v.filter((p) => p.cat === k);
    }
    const ws = WD.filter((w) => !(S.settings.hideVulgar && w.sec === "intimate"));
    return k === "all" ? ws : ws.filter((w) => w.sec === k);
  }

  // ---------- FLASHCARDS (интервальное повторение) ----------
  const INTERVALS = [0, 1, 2, 4, 8, 16, 35, 70]; // дни для коробок 0..7
  const fc = { src: "ph:all", dir: "ru-en", queue: [], i: 0, flipped: false, done: 0, total: 0, running: false };
  try { const saved = JSON.parse(localStorage.getItem(KEY + ".fc") || "{}"); if (saved.src) fc.src = saved.src; if (saved.dir) fc.dir = saved.dir; } catch (e) { /* ignore */ }

  function deckStats(items) {
    const now = Date.now();
    let due = 0, fresh = 0, learned = 0;
    items.forEach((x) => { const p = peek(x.id); if (!p || !p.seen) fresh++; else if (p.due <= now) due++; if (p && p.st === 2) learned++; });
    return { due, fresh, learned, total: items.length };
  }

  function renderLearnSetup() {
    fc.running = false;
    const items = deckItems(fc.src), st = deckStats(items);
    $("#view-learn").innerHTML =
      "<h1>🃏 Карточки</h1>" +
      '<div class="card setup">' +
      '<label>Что учим<select id="fc-src">' + deckOptions() + "</select></label>" +
      '<label>Направление<div class="seg" id="fc-dir">' +
      '<button data-d="ru-en" class="' + (fc.dir === "ru-en" ? "on" : "") + '">RU → EN</button>' +
      '<button data-d="en-ru" class="' + (fc.dir === "en-ru" ? "on" : "") + '">EN → RU</button>' +
      '<button data-d="mix" class="' + (fc.dir === "mix" ? "on" : "") + '">Вперемешку</button></div></label>' +
      '<div class="stat-line muted"><div><b>' + st.due + "</b>на повторение</div><div><b>" + st.fresh + "</b>новых</div><div><b>" + st.learned + "</b>выучено</div><div><b>" + st.total + "</b>всего</div></div>" +
      '<div class="row"><button class="btn primary big" id="fc-start">Начать (' + Math.min(st.due + Math.min(st.fresh, S.settings.newPerSession), st.total) + ")</button>" +
      '<button class="btn" id="fc-cram">Все подряд</button></div>' +
      '<p class="small muted" style="margin:0">Новые карточки: до ' + S.settings.newPerSession + ' за раз. «Не знаю» — карточка вернётся в этой же сессии, «Сложно» — завтра, «Знаю» — через растущий интервал (1, 2, 4, 8, 16… дней).</p>' +
      "</div>";
    $("#fc-src").value = fc.src;
    $("#fc-src").addEventListener("change", (e) => { fc.src = e.target.value; persistFc(); renderLearnSetup(); });
    $("#fc-dir").addEventListener("click", (e) => { const b = e.target.closest("[data-d]"); if (!b) return; fc.dir = b.dataset.d; persistFc(); renderLearnSetup(); });
    $("#fc-start").addEventListener("click", () => startSession(false));
    $("#fc-cram").addEventListener("click", () => startSession(true));
  }
  function persistFc() { try { localStorage.setItem(KEY + ".fc", JSON.stringify({ src: fc.src, dir: fc.dir })); } catch (e) { /* ignore */ } }

  function startSession(cram) {
    const items = deckItems(fc.src), now = Date.now();
    let q;
    if (cram) q = shuffle(items).slice(0, 50);
    else {
      const due = items.filter((x) => { const p = peek(x.id); return p && p.seen && p.due <= now; }).sort((a, b) => peek(a.id).due - peek(b.id).due);
      const fresh = items.filter((x) => { const p = peek(x.id); return !p || !p.seen; });
      // новые — сначала самые частые
      fresh.sort((a, b) => (b.f || 3) - (a.f || 3) || Math.random() - 0.5);
      q = due.concat(fresh.slice(0, S.settings.newPerSession));
      q = shuffle(q.slice(0, 200));
    }
    if (!q.length) { toast("На сегодня всё повторено 🎉 Нажми «Все подряд», чтобы потренироваться ещё"); return; }
    fc.queue = q.map((x) => ({ id: x.id, dir: fc.dir === "mix" ? (Math.random() < 0.5 ? "ru-en" : "en-ru") : fc.dir }));
    fc.i = 0; fc.done = 0; fc.total = fc.queue.length; fc.flipped = false; fc.running = true;
    renderCard();
  }

  function renderCard() {
    const v = $("#view-learn");
    if (fc.i >= fc.queue.length) {
      fc.running = false;
      v.innerHTML = '<div class="fc-wrap"><div class="card fc"><div class="q">Готово! 🎉</div><div class="hint">Повторено карточек: ' + fc.done + '</div></div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" id="fc-back">К выбору колоды</button></div></div>';
      $("#fc-back").addEventListener("click", renderLearnSetup);
      return;
    }
    const c = fc.queue[fc.i], x = itemById(c.id);
    if (!x) { fc.i++; return renderCard(); }
    const front = c.dir === "ru-en" ? x.ru : x.en;
    const back = c.dir === "ru-en" ? x.en : x.ru;
    let extra = "";
    if (x.kind === "w" && x.ipa) extra += '<div class="hint">' + esc(x.ipa) + "</div>";
    if (x.kind === "p") {
      if (x.n) extra += '<p class="note" style="margin-top:12px">' + esc(x.n) + "</p>";
      (x.ex || []).slice(0, 2).forEach((e) => { extra += '<div class="ex"><button class="icon-btn" data-say="' + esc(e[0]) + '">🔊</button><div><div class="ex-en">' + esc(e[0]) + '</div><div class="ex-ru">' + esc(e[1]) + "</div></div></div>"; });
    }
    const pct = Math.round((fc.done / Math.max(fc.total, 1)) * 100);
    const box = (peek(x.id) || {}).box || 0;
    v.innerHTML = '<div class="fc-wrap">' +
      '<div class="fc-top"><button class="icon-btn" id="fc-exit" title="Выйти">✕</button><div class="progress"><i style="width:' + pct + '%"></i></div><span class="small muted">' + fc.done + "/" + fc.total + "</span></div>" +
      '<div class="card fc" id="fc-card">' +
      '<div class="q">' + esc(front) + "</div>" +
      (c.dir === "en-ru" ? '<div class="row" style="margin-top:8px"><button class="icon-btn" data-say="' + esc(x.en) + '">🔊</button></div>' : "") +
      (x.kind === "p" ? '<div class="hint">' + CAT[x.cat].icon + " " + esc(CAT[x.cat].name) + (x.t === "m" ? " · запомнить целиком" : "") + "</div>" : '<div class="hint">' + esc(SECS[x.sec]) + "</div>") +
      (fc.flipped
        ? '<div class="a"><div class="ans">' + esc(back) + '</div>' + (c.dir === "ru-en" ? '<div class="row" style="justify-content:center;margin-top:6px"><button class="icon-btn" data-say="' + esc(x.en) + '">🔊</button></div>' : "") + extra + "</div>"
        : '<div class="tap">Нажми, чтобы увидеть ответ</div>') +
      "</div>" +
      (fc.flipped
        ? '<div class="grades"><button class="btn again" data-g="0">Не знаю<small>сейчас</small></button><button class="btn hard" data-g="1">Сложно<small>завтра</small></button><button class="btn good" data-g="2">Знаю<small>' + INTERVALS[Math.min(box + 1, 7)] + " дн.</small></button></div>"
        : '<div class="grades" style="grid-template-columns:1fr"><button class="btn primary big" id="fc-flip">Показать ответ</button></div>') +
      '<div class="kbd">Пробел — перевернуть · 1 / 2 / 3 — оценка · S — озвучить</div>' +
      "</div>";
    if (fc.flipped && c.dir === "ru-en") speak(x.en);
    if (!fc.flipped && c.dir === "en-ru") speak(x.en);
  }

  function flip() { if (!fc.flipped) { fc.flipped = true; renderCard(); } }
  function grade(g) {
    const c = fc.queue[fc.i], p = prog(c.id), now = Date.now();
    if (!p.seen) p.seen = now;
    if (g === 0) { p.box = 0; p.due = now; fc.queue.splice(Math.min(fc.i + 4, fc.queue.length), 0, { id: c.id, dir: c.dir }); fc.total++; }
    else if (g === 1) { p.box = Math.max(1, p.box); p.due = now + DAY; }
    else { p.box = Math.min(p.box + 1, 7); p.due = now + INTERVALS[p.box] * DAY; }
    p.st = p.box >= 5 ? 2 : 1;
    logReview(); save();
    fc.done++; fc.i++; fc.flipped = false; renderCard();
  }

  function bindLearn() {
    $("#view-learn").addEventListener("click", (e) => {
      if (!fc.running) return;
      const say = e.target.closest("[data-say]"); if (say) { e.stopPropagation(); speak(say.dataset.say); return; }
      if (e.target.closest("#fc-exit")) { renderLearnSetup(); return; }
      const g = e.target.closest("[data-g]"); if (g) { grade(+g.dataset.g); return; }
      if (e.target.closest("#fc-flip") || e.target.closest("#fc-card")) flip();
    });
  }

  // ---------- QUIZ ----------
  const qz = { src: "ph:all", mode: "ctx", items: [], i: 0, score: 0, answered: false, running: false };
  const MODES = { ctx: "Ситуация: вставь фразу", ruen: "Перевод RU → EN", enru: "Перевод EN → RU" };

  function blankable(p) {
    if (p.kind !== "p" || !p.ex || !p.ex.length) return null;
    const variants = p.en.split(" / ").map((s) => s.replace(/\(.*?\)|…|\.\.\.|[!?]/g, "").trim()).filter((s) => s.length > 1);
    const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const e of p.ex) {
      for (const v of variants) {
        // точное совпадение, затем — с изменённой формой первого слова (mess up → messed up)
        const words = v.split(/\s+/);
        const pats = [reEsc(v)];
        if (words.length > 1 && /^[a-z]{3,}$/i.test(words[0])) pats.push(reEsc(words[0].replace(/e$/, "")) + "[a-z]{0,4}\\s" + words.slice(1).map(reEsc).join("\\s"));
        for (const pat of pats) {
          const m = new RegExp("(^|[^a-z'])(" + pat + ")(?![a-z'])", "i").exec(e[0]);
          if (!m) continue;
          const i = m.index + m[1].length, len = m[2].length;
          const text = e[0].slice(0, i) + "_____" + e[0].slice(i + len);
          // пример должен давать контекст, а не состоять из одной фразы
          if ((text.replace("_____", "").match(/[a-z]{2,}/gi) || []).length < 2) continue;
          return { text, ru: e[1], ans: m[2] };
        }
      }
    }
    return null;
  }

  function renderQuizSetup() {
    qz.running = false;
    $("#view-quiz").innerHTML = "<h1>🎯 Квиз</h1>" +
      '<div class="card setup">' +
      '<label>Тема<select id="qz-src">' + deckOptions() + "</select></label>" +
      '<label>Режим<div class="seg" id="qz-mode">' + Object.keys(MODES).map((k) => '<button data-m="' + k + '" class="' + (qz.mode === k ? "on" : "") + '">' + MODES[k] + "</button>").join("") + "</div></label>" +
      '<p class="small muted" style="margin:0">«Ситуация» — показывается пример из фильма/диалога с пропуском, нужно выбрать подходящую фразу. Лучше всего тренирует понимание контекста.</p>' +
      '<div class="row"><button class="btn primary big" id="qz-start">Начать (10 вопросов)</button></div></div>';
    $("#qz-src").value = qz.src;
    $("#qz-src").addEventListener("change", (e) => (qz.src = e.target.value));
    $("#qz-mode").addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (!b) return; qz.mode = b.dataset.m; renderQuizSetup(); });
    $("#qz-start").addEventListener("click", startQuiz);
  }

  function startQuiz() {
    let pool = deckItems(qz.src);
    if (qz.mode === "ctx") pool = pool.filter((x) => blankable(x));
    if (pool.length < 4) { toast(qz.mode === "ctx" ? "В этой теме мало примеров для режима «Ситуация» — выбери перевод" : "Слишком мало карточек в теме"); return; }
    // в приоритете то, что ещё не выучено
    pool = shuffle(pool).sort((a, b) => statusOf(a.id) - statusOf(b.id));
    qz.items = shuffle(pool.slice(0, Math.max(10, Math.min(pool.length, 25)))).slice(0, 10);
    qz.pool = deckItems(qz.src);
    qz.i = 0; qz.score = 0; qz.running = true; qz.answered = false;
    renderQuestion();
  }

  function renderQuestion() {
    const v = $("#view-quiz");
    if (qz.i >= qz.items.length) {
      qz.running = false;
      const pct = Math.round((qz.score / qz.items.length) * 100);
      v.innerHTML = '<div class="fc-wrap"><div class="card fc"><div class="q">' + qz.score + " / " + qz.items.length + '</div><div class="hint">' + (pct >= 90 ? "Отлично! 🔥" : pct >= 60 ? "Неплохо 👍" : "Есть над чем поработать 💪") + '</div></div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" id="qz-again">Ещё раз</button><button class="btn" id="qz-back">Сменить тему</button></div></div>';
      $("#qz-again").addEventListener("click", startQuiz);
      $("#qz-back").addEventListener("click", renderQuizSetup);
      return;
    }
    const x = qz.items[qz.i];
    const keyOf = (y) => (qz.mode === "enru" ? y.ru : y.en);
    // дистракторы: из той же категории/раздела, затем из общей колоды
    const same = qz.pool.filter((y) => y.id !== x.id && (y.cat || y.sec) === (x.cat || x.sec));
    const other = qz.pool.filter((y) => y.id !== x.id);
    const seen = new Set([keyOf(x).toLowerCase()]);
    const opts = [x];
    for (const y of shuffle(same).concat(shuffle(other))) {
      if (opts.length >= 4) break;
      const k = keyOf(y).toLowerCase(); if (seen.has(k)) continue;
      seen.add(k); opts.push(y);
    }
    qz.opts = shuffle(opts);
    let prompt, text, sub = "";
    if (qz.mode === "ctx") { const b = blankable(x); prompt = "Какая фраза пропущена?"; text = b.text; sub = b.ru; }
    else if (qz.mode === "ruen") { prompt = "Как сказать по-английски?"; text = x.ru; }
    else { prompt = "Что это значит?"; text = x.en; }
    const pct = Math.round((qz.i / qz.items.length) * 100);
    v.innerHTML = '<div class="fc-wrap">' +
      '<div class="fc-top"><button class="icon-btn" id="qz-exit" title="Выйти">✕</button><div class="progress"><i style="width:' + pct + '%"></i></div><span class="small muted">' + (qz.i + 1) + "/" + qz.items.length + "</span></div>" +
      '<div class="card qz-q"><div class="prompt">' + prompt + '</div><div class="text">' + esc(text) + "</div>" + (sub ? '<div class="sub">' + esc(sub) + "</div>" : "") +
      (qz.mode === "enru" ? '<div class="row" style="justify-content:center;margin-top:8px"><button class="icon-btn" data-say="' + esc(x.en) + '">🔊</button></div>' : "") + "</div>" +
      '<div class="opts">' + qz.opts.map((o, i) => '<button class="opt" data-o="' + i + '">' + esc(keyOf(o)) + "</button>").join("") + "</div>" +
      '<div id="qz-after"></div></div>';
    qz.answered = false;
  }

  function answer(i) {
    if (qz.answered) return;
    qz.answered = true;
    const x = qz.items[qz.i], chosen = qz.opts[i], ok = chosen.id === x.id;
    if (ok) qz.score++;
    $$(".opt").forEach((b, j) => { b.disabled = true; if (qz.opts[j].id === x.id) b.classList.add("right"); else if (j === i) b.classList.add("wrong"); });
    const p = prog(x.id);
    if (!p.seen) { p.seen = Date.now(); p.due = Date.now(); }
    if (!ok) { p.box = 0; p.due = Date.now(); if (p.st === 2) p.st = 1; }
    if (!p.st) p.st = 1;
    logReview(); save();
    speak(x.en);
    let expl = '<b>' + esc(x.en) + "</b> — " + esc(x.ru);
    if (x.n) expl += '<div class="muted" style="margin-top:4px">' + esc(x.n) + "</div>";
    $("#qz-after").innerHTML = '<div class="card qz-expl">' + (ok ? "✅ Верно! " : "❌ Неверно. ") + expl + '</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary big" id="qz-next">Дальше →</button></div>';
  }

  function bindQuiz() {
    $("#view-quiz").addEventListener("click", (e) => {
      if (!qz.running) return;
      const say = e.target.closest("[data-say]"); if (say) { speak(say.dataset.say); return; }
      if (e.target.closest("#qz-exit")) { renderQuizSetup(); return; }
      const o = e.target.closest("[data-o]"); if (o) { answer(+o.dataset.o); return; }
      if (e.target.closest("#qz-next")) { qz.i++; renderQuestion(); }
    });
  }

  // ---------- STATS & SETTINGS ----------
  function streak() {
    let n = 0, d = new Date();
    if (!S.days[today()]) d = new Date(Date.now() - DAY);
    for (;;) { const k = d.toISOString().slice(0, 10); if (S.days[k]) { n++; d = new Date(d.getTime() - DAY); } else break; }
    return n;
  }

  function renderStats() {
    const all = visiblePH();
    const learned = all.filter((p) => statusOf(p.id) === 2).length;
    const learning = all.filter((p) => statusOf(p.id) === 1).length;
    const wl = WD.filter((w) => statusOf(w.id) === 2).length;
    const due = deckStats(all).due, wdue = deckStats(WD).due;
    let bars = "";
    CATS.forEach((c) => {
      const items = all.filter((p) => p.cat === c.id); if (!items.length) return;
      const l = items.filter((p) => statusOf(p.id) === 2).length, pr = items.filter((p) => statusOf(p.id) === 1).length;
      bars += '<div class="bar-row"><span>' + c.icon + " " + esc(c.name) + '</span><div class="bar"><i class="l" style="width:' + (l / items.length) * 100 + '%"></i><i class="p" style="width:' + (pr / items.length) * 100 + '%"></i></div><span class="n">' + l + "/" + items.length + "</span></div>";
    });
    Object.keys(SECS).forEach((k) => {
      const items = WD.filter((w) => w.sec === k), l = items.filter((w) => statusOf(w.id) === 2).length;
      bars += '<div class="bar-row"><span>📖 ' + esc(SECS[k]) + '</span><div class="bar"><i class="l" style="width:' + (l / items.length) * 100 + '%"></i></div><span class="n">' + l + "/" + items.length + "</span></div>";
    });
    const voiceOpts = '<option value="">Авто</option>' + voices.map((v) => '<option value="' + esc(v.name) + '"' + (v.name === S.settings.voice ? " selected" : "") + ">" + esc(v.name) + " (" + v.lang + ")</option>").join("");
    const catOpts = window.CATEGORIES.filter((c) => c.id !== "custom").map((c) => '<option value="' + c.id + '">' + c.icon + " " + esc(c.name) + "</option>").join("");

    $("#view-stats").innerHTML = "<h1>📊 Прогресс</h1>" +
      '<div class="kpis">' +
      '<div class="card kpi"><b>' + learned + '</b><span>фраз выучено из ' + all.length + "</span></div>" +
      '<div class="card kpi"><b>' + learning + "</b><span>фраз в процессе</span></div>" +
      '<div class="card kpi"><b>' + wl + "</b><span>слов выучено из " + WD.length + "</span></div>" +
      '<div class="card kpi"><b>' + streak() + " 🔥</b><span>дней подряд · сегодня " + (S.days[today()] || 0) + " повт.</span></div>" +
      "</div>" +
      (due || wdue ? '<p class="row">' + (due ? '<button class="btn primary" id="go-review">Повторить фразы: ' + due + " →</button>" : "") + (wdue ? '<button class="btn" id="go-review-w">Повторить слова: ' + wdue + " →</button>" : "") + "</p>" : "") +
      '<h2>По категориям</h2><div class="card bars">' + bars + "</div>" +

      '<h2>✍️ Добавить свою фразу</h2>' +
      '<form class="card form" id="add-form">' +
      '<div class="grid2"><input class="input" name="en" placeholder="Фраза на английском *" required><input class="input" name="ru" placeholder="Перевод *" required></div>' +
      '<textarea name="n" placeholder="Пояснение / где услышал (необязательно)"></textarea>' +
      '<div class="grid2"><input class="input" name="exen" placeholder="Пример EN"><input class="input" name="exru" placeholder="Пример RU"></div>' +
      '<div class="row"><select name="t"><option value="m">Запомнить целиком</option><option value="d">Прямой перевод</option></select>' +
      '<select name="r"><option value="i">Разговорно</option><option value="n">Нейтрально</option><option value="r">Грубо</option><option value="v">Мат</option></select>' +
      '<select name="f"><option value="3">★★★</option><option value="5">★★★★★</option><option value="4">★★★★</option><option value="2">★★</option><option value="1">★</option></select>' +
      '<span class="spacer"></span><button class="btn primary" type="submit">Добавить</button></div>' +
      '<p class="small muted" style="margin:0">Свои фразы попадают в категорию «✍️ Мои фразы» и в карточки. Хранятся на этом устройстве — переноси через экспорт.</p>' +
      "</form>" +

      '<h2>⚙️ Настройки</h2><div class="card settings">' +
      '<div class="set-row"><div class="lbl">Скрыть мат и 18+<small>Убирает фразы с пометкой «мат» и раздел «18+ Интим»</small></div><label class="switch"><input type="checkbox" id="set-vulgar"' + (S.settings.hideVulgar ? " checked" : "") + "><span></span></label></div>" +
      '<div class="set-row"><div class="lbl">Голос озвучки<small>Список зависит от устройства</small></div><select id="set-voice">' + voiceOpts + '</select><button class="btn" id="test-voice">▶︎</button></div>' +
      '<div class="set-row"><div class="lbl">Скорость речи<small id="rate-l">' + S.settings.rate.toFixed(2) + '×</small></div><input type="range" id="set-rate" min="0.5" max="1.3" step="0.05" value="' + S.settings.rate + '"></div>' +
      '<div class="set-row"><div class="lbl">Новых карточек за сессию</div><select id="set-new">' + [10, 20, 30, 50].map((n) => "<option" + (n === S.settings.newPerSession ? " selected" : "") + ">" + n + "</option>").join("") + "</select></div>" +
      '<div class="set-row"><div class="lbl">Две колонки на широком экране</div><label class="switch"><input type="checkbox" id="set-cols"' + (S.settings.twoCols ? " checked" : "") + "><span></span></label></div>" +
      '<div class="set-row"><div class="lbl">Резервная копия<small>Прогресс и свои фразы — в файл. Так можно перенести с телефона на ПК и обратно</small></div><button class="btn" id="exp">⬇️ Экспорт</button><label class="btn">⬆️ Импорт<input type="file" id="imp" accept=".json,application/json" hidden></label></div>' +
      '<div class="set-row"><div class="lbl">Сбросить весь прогресс</div><button class="btn" id="reset" style="color:var(--bad)">Сбросить</button></div>' +
      "</div>" +
      '<p class="small muted">Всего в базе: ' + PH.length + " фраз и " + WD.length + " слов. Данные хранятся только в этом браузере.</p>";

    const f = $("#add-form"); f.querySelector('[name="t"]').value = "m";
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      const item = { id: "c:" + Date.now(), en: d.en.trim(), ru: d.ru.trim(), n: d.n.trim(), t: d.t, r: d.r, f: +d.f, ex: d.exen.trim() ? [[d.exen.trim(), d.exru.trim()]] : [] };
      S.custom.push(item); save();
      PH = buildPhrases(); phIndex = PH_BY_ID();
      f.reset(); toast("Фраза добавлена в «Мои фразы»"); renderPhrases();
    });
    $("#set-vulgar").addEventListener("change", (e) => { S.settings.hideVulgar = e.target.checked; save(); renderPhrases(); renderWords(); renderStats(); });
    $("#set-voice").addEventListener("change", (e) => { S.settings.voice = e.target.value; save(); speak("What's up, dude?"); });
    $("#test-voice").addEventListener("click", () => speak("Hey, what's up? Long time no see!"));
    $("#set-rate").addEventListener("input", (e) => { S.settings.rate = +e.target.value; $("#rate-l").textContent = S.settings.rate.toFixed(2) + "×"; save(); });
    $("#set-new").addEventListener("change", (e) => { S.settings.newPerSession = +e.target.value; save(); });
    $("#set-cols").addEventListener("change", (e) => { S.settings.twoCols = e.target.checked; save(); renderPhrases(); });
    $("#exp").addEventListener("click", exportData);
    $("#imp").addEventListener("change", importData);
    $("#reset").addEventListener("click", () => { if (confirm("Точно сбросить весь прогресс? Свои фразы останутся.")) { S.p = {}; S.days = {}; save(); renderAll(); toast("Прогресс сброшен"); } });
    const gr = $("#go-review"); if (gr) gr.addEventListener("click", () => { fc.src = "ph:all"; show("learn"); startSession(false); });
    const grw = $("#go-review-w"); if (grw) grw.addEventListener("click", () => { fc.src = "w:all"; show("learn"); startSession(false); });
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "talknative-backup-" + today() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function importData(e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || typeof d.p !== "object") throw new Error("bad");
        if (!confirm("Заменить текущий прогресс данными из файла?")) return;
        S = Object.assign(defaults(), d); S.settings = Object.assign(defaults().settings, d.settings);
        save(); PH = buildPhrases(); phIndex = PH_BY_ID(); renderAll(); toast("Импорт выполнен ✅");
      } catch (err) { toast("Не удалось прочитать файл"); }
    };
    r.readAsText(file);
  }

  // ---------- navigation ----------
  let current = "phrases";
  function show(view) {
    current = view;
    $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    if (view === "learn" && !fc.running) renderLearnSetup();
    if (view === "quiz" && !qz.running) renderQuizSetup();
    if (view === "stats") renderStats();
    if (view === "phrases") renderPhrases();
    if (view === "words") renderWords();
    try { history.replaceState(null, "", "#" + view); } catch (e) { /* file:// */ }
    window.scrollTo({ top: 0 });
  }
  $("#nav").addEventListener("click", (e) => { const b = e.target.closest("[data-view]"); if (b) show(b.dataset.view); });
  window.addEventListener("hashchange", () => { const v = location.hash.slice(1); if (v !== current && $("#view-" + v)) show(v); });

  // ---------- keyboard (ПК) ----------
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); const s = current === "words" ? $("#w-search") : (show("phrases"), $("#ph-search")); s.focus(); return; }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (current === "learn" && fc.running) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (fc.flipped && ["1", "2", "3"].includes(e.key)) grade(+e.key - 1);
      else if (e.key === "s" || e.key === "S" || e.key === "ы" || e.key === "Ы") { const c = fc.queue[fc.i]; if (c) speak(itemById(c.id).en); }
    }
    if (current === "quiz" && qz.running) {
      if (!qz.answered && ["1", "2", "3", "4"].includes(e.key)) answer(+e.key - 1);
      else if (qz.answered && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); qz.i++; renderQuestion(); }
    }
  });

  function renderAll() { renderPhrases(); renderWords(); if (current === "stats") renderStats(); if (current === "learn" && !fc.running) renderLearnSetup(); }

  // ---------- init ----------
  bindPhrases(); bindWords(); bindLearn(); bindQuiz();
  const start = (location.hash || "").slice(1);
  show(["phrases", "words", "learn", "quiz", "stats"].includes(start) ? start : "phrases");

  // Офлайн-режим (работает только на https / localhost, не при открытии файла напрямую)
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
