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
  const defaults = () => ({ p: {}, g: {}, settings: { hideVulgar: false, rate: 0.95, voice: "", newPerSession: 20, twoCols: true, goal: 20, typeAnswer: false }, custom: [], days: {} });
  let S;
  try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = defaults(); }
  S.settings = Object.assign(defaults().settings, S.settings);
  // Метки времени изменений — нужны, чтобы при синхронизации победила более свежая запись
  let snap = {};
  function snapshot(stampChanged) {
    const now = Date.now(), next = {};
    const check = (key, rec) => {
      const { t, ...rest } = rec; const j = JSON.stringify(rest);
      if (stampChanged && snap[key] !== j) rec.t = now;
      next[key] = j;
    };
    for (const id in S.p) check("p:" + id, S.p[id]);
    for (const id in S.g) check("g:" + id, S.g[id]);
    const sj = JSON.stringify(S.settings);
    if (stampChanged && snap.settings !== sj) S.settingsT = now;
    next.settings = sj;
    snap = next;
  }
  const writeLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } };
  const save = () => { snapshot(true); writeLocal(); scheduleSync(); };
  const prog = (id) => S.p[id] || (S.p[id] = { box: 0, due: 0, seen: 0, fav: false, st: 0 });
  const peek = (id) => S.p[id] || null;
  // st: 0 new, 1 learning, 2 learned
  const statusOf = (id) => { const p = peek(id); return p ? p.st : 0; };
  const logReview = () => {
    const d = today(); S.days[d] = (S.days[d] || 0) + 1;
    if (S.days[d] === S.settings.goal) setTimeout(() => toast("🎯 Дневная цель выполнена! " + S.settings.goal + " повторений"), 300);
  };

  snapshot(false);

  // ---------- синхронизация через приватный GitHub Gist ----------
  const SYNC_KEY = KEY + ".sync", GIST_FILE = "talknative-progress.json";
  let SY = {};
  try { SY = JSON.parse(localStorage.getItem(SYNC_KEY) || "{}"); } catch (e) { SY = {}; }
  const saveSY = () => { try { localStorage.setItem(SYNC_KEY, JSON.stringify(SY)); } catch (e) { /* ignore */ } };
  let syncTimer = null, syncing = false, syncAgain = false, syncMsg = "";

  function scheduleSync() {
    if (!SY.token) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncNow(), 4000);
  }
  async function gh(path, opts) {
    const res = await fetch("https://api.github.com" + path, Object.assign({}, opts, {
      headers: { Authorization: "Bearer " + SY.token, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
      cache: "no-store"
    }));
    if (res.status === 401) throw new Error("Ключ недействителен или отозван — подключи заново");
    if (res.status === 403 || res.status === 404) throw new Error("Нет доступа: у ключа должна быть галочка «gist»");
    if (!res.ok) throw new Error("GitHub ответил ошибкой " + res.status);
    return res.json();
  }
  async function findOrCreateGist() {
    const list = await gh("/gists?per_page=100");
    const found = list.find((g) => g.files && g.files[GIST_FILE]);
    if (found) return found.id;
    const created = await gh("/gists", { method: "POST", body: JSON.stringify({ description: "Talk Like a Native — прогресс (синхронизация)", public: false, files: { [GIST_FILE]: { content: JSON.stringify(S) } } }) });
    return created.id;
  }
  async function pullGist() {
    const g = await gh("/gists/" + SY.gist);
    const f = g.files && g.files[GIST_FILE];
    if (!f) return null;
    let text = f.content;
    if (f.truncated && f.raw_url) text = await (await fetch(f.raw_url, { cache: "no-store" })).text();
    try { return JSON.parse(text); } catch (e) { return null; }
  }

  // Слияние: по каждой записи побеждает более свежая; дни — максимум; свои фразы — объединение минус удалённые
  function merge(a, b) {
    const resetAt = Math.max(a.resetAt || 0, b.resetAt || 0);
    const pick = (A, B, useReset) => {
      const r = {};
      new Set(Object.keys(A || {}).concat(Object.keys(B || {}))).forEach((id) => {
        const x = (A || {})[id], y = (B || {})[id];
        const w = !x ? y : !y ? x : (y.t || 0) > (x.t || 0) ? y : x;
        if (!useReset || !resetAt || (w.t || 0) > resetAt) r[id] = w;
      });
      return r;
    };
    const del = Object.assign({}, b.del || {}, a.del || {});
    const resetDay = resetAt ? new Date(resetAt).toISOString().slice(0, 10) : "";
    const days = {};
    new Set(Object.keys(a.days || {}).concat(Object.keys(b.days || {}))).forEach((d) => {
      if (d >= resetDay) days[d] = Math.max((a.days || {})[d] || 0, (b.days || {})[d] || 0);
    });
    const custom = {};
    (b.custom || []).concat(a.custom || []).forEach((c) => { if (!del[c.id]) custom[c.id] = c; });
    const newerSettings = (b.settingsT || 0) > (a.settingsT || 0) ? b : a;
    return Object.assign(defaults(), {
      p: pick(a.p, b.p, true), g: pick(a.g, b.g, false), days, del, resetAt,
      custom: Object.values(custom),
      settings: Object.assign(defaults().settings, newerSettings.settings), settingsT: newerSettings.settingsT || 0
    });
  }

  async function syncNow(manual) {
    if (!SY.token) return;
    if (syncing) { syncAgain = true; return; }
    if (!navigator.onLine) { setSync("📴 Нет интернета — синхронизирую, когда появится"); return; }
    syncing = true; clearTimeout(syncTimer); setSync("⏳ Синхронизация…");
    try {
      if (!SY.gist) { SY.gist = await findOrCreateGist(); saveSY(); }
      const remote = await pullGist();
      const before = JSON.stringify(S);
      const merged = remote ? merge(S, remote) : S;
      const mergedJson = JSON.stringify(merged);
      if (!remote || mergedJson !== JSON.stringify(remote)) {
        await gh("/gists/" + SY.gist, { method: "PATCH", body: JSON.stringify({ files: { [GIST_FILE]: { content: mergedJson } } }) });
      }
      if (mergedJson !== before) {
        S = merged; writeLocal(); snapshot(false);
        PH = buildPhrases(); phIndex = PH_BY_ID(); renderAll();
      }
      SY.last = Date.now(); SY.err = ""; saveSY();
      setSync("✅ Синхронизировано в " + new Date(SY.last).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }));
      if (manual) toast("☁️ Синхронизировано");
    } catch (err) {
      SY.err = err.message; saveSY();
      setSync("⚠️ " + err.message);
      if (manual) toast("⚠️ " + err.message);
    }
    syncing = false;
    if (syncAgain) { syncAgain = false; scheduleSync(); }
  }
  function setSync(msg) { syncMsg = msg; const el = document.getElementById("sync-status"); if (el) el.textContent = msg; }
  async function connectSync(token) {
    SY = { token: token.trim() }; saveSY();
    setSync("⏳ Подключаюсь…");
    await syncNow(true);
    if (SY.err) { SY = {}; saveSY(); } else toast("☁️ Синхронизация включена");
    renderStats();
  }
  document.addEventListener("visibilitychange", () => {
    if (!SY.token) return;
    if (document.visibilityState === "visible") syncNow();       // вернулся на вкладку — подтянуть изменения
    else if (syncTimer) syncNow();                                // уходишь — отправить несохранённое
  });
  window.addEventListener("online", () => syncNow());

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
  // Неправильные глаголы: группа по совпадению форм (AAA cut-cut-cut, ABB buy-bought-bought, ABA come-came-come, ABC go-went-gone)
  const first = (s) => s.split(" / ")[0];
  const VB = window.VERBS.map(([base, past, pp, ru, top, exEn, exRu]) => {
    const b = first(base).replace(/\s*\(.*\)/, ""), p2 = first(past), p3 = first(pp);
    const grp = b === p2 && p2 === p3 ? "AAA" : p2 === p3 ? "ABB" : b === p3 ? "ABA" : "ABC";
    return { id: "v:" + b, kind: "v", en: base, base: b, past, pp, ru, top: !!top, grp, forms: base + " – " + past + " – " + pp, ex: exEn ? [[exEn, exRu]] : [] };
  });
  const vbIndex = Object.fromEntries(VB.map((v) => [v.id, v]));
  const itemById = (id) => phIndex[id] || wdIndex[id] || vbIndex[id];
  // как показывать/озвучивать английскую сторону карточки
  const enOf = (x) => (x.kind === "v" ? x.forms : x.en);
  const sayOf = (x) => (x.kind === "v" ? [x.base, first(x.past), first(x.pp)].join(", ") : x.en);

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

  // Фраза дня: одна и та же весь день, из частых фраз; кнопка 🎲 — случайная
  let dailyId = null;
  function dailyPhrase() {
    const pool = visiblePH().filter((p) => p.f >= 4 && p.cat !== "custom");
    if (dailyId && phIndex[dailyId]) return phIndex[dailyId];
    let h = 0; for (const ch of today()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return pool[h % pool.length];
  }
  function renderDaily() {
    const box = $("#ph-daily");
    const showIt = !ui.q && !ui.cat && !ui.type && !ui.reg && !ui.freq && !ui.status;
    box.hidden = !showIt;
    if (!showIt) return;
    const p = dailyPhrase(); if (!p) { box.hidden = true; return; }
    box.innerHTML = '<div class="daily-head"><span>✨ ' + (dailyId ? "Случайная фраза" : "Фраза дня") + '</span><button class="btn small-btn" id="daily-rnd">🎲 Другая</button></div>' + phraseCard(p, true);
  }

  function renderPhrases() {
    renderCats();
    renderDaily();
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
    const p = phIndex[id]; if (!p) return;
    $$('#view-phrases article[data-id="' + CSS.escape(id) + '"]').forEach((el) =>
      (el.outerHTML = phraseCard(p, el.closest("#ph-daily") ? true : ui.open.has(id))));
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
    $("#ph-daily").addEventListener("click", (e) => {
      if (e.target.closest("#daily-rnd")) {
        const pool = visiblePH().filter((p) => p.f >= 3);
        dailyId = pool[Math.floor(Math.random() * pool.length)].id; renderDaily(); return;
      }
      if (e.target.closest("[data-toggle]")) return; // карточка дня всегда раскрыта
      onItemClick(e);
    });
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
      S.custom = S.custom.filter((c) => c.id !== id); delete S.p[id]; (S.del = S.del || {})[id] = Date.now(); save();
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
    h += '</optgroup><optgroup label="Неправильные глаголы"><option value="v:top">Самые нужные (' + VB.filter((v) => v.top).length + ')</option><option value="v:all">Все (' + VB.length + ")</option>";
    return h + "</optgroup>";
  }
  function deckItems(src) {
    const [kind, k] = src.split(":");
    if (k === "fav") return PH.concat(WD, VB).filter((x) => (peek(x.id) || {}).fav);
    if (kind === "v") return k === "top" ? VB.filter((v) => v.top) : VB;
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
    $("#view-learn").innerHTML = modeSwitch("learn") +
      '<div class="card setup">' +
      '<label>Что учим<select id="fc-src">' + deckOptions() + "</select></label>" +
      '<label>Направление<div class="seg" id="fc-dir">' +
      '<button data-d="ru-en" class="' + (fc.dir === "ru-en" ? "on" : "") + '">RU → EN</button>' +
      '<button data-d="en-ru" class="' + (fc.dir === "en-ru" ? "on" : "") + '">EN → RU</button>' +
      '<button data-d="mix" class="' + (fc.dir === "mix" ? "on" : "") + '">Вперемешку</button></div></label>' +
      '<label class="inline-sw"><span>✍️ Вводить ответ с клавиатуры<small>Для карточек RU → EN: пишешь перевод сам, сайт проверяет</small></span><span class="switch"><input type="checkbox" id="fc-type"' + (S.settings.typeAnswer ? " checked" : "") + "><span></span></span></label>" +
      '<div class="stat-line muted"><div><b>' + st.due + "</b>на повторение</div><div><b>" + st.fresh + "</b>новых</div><div><b>" + st.learned + "</b>выучено</div><div><b>" + st.total + "</b>всего</div></div>" +
      '<div class="row"><button class="btn primary big" id="fc-start">Начать (' + Math.min(st.due + Math.min(st.fresh, S.settings.newPerSession), st.total) + ")</button>" +
      '<button class="btn" id="fc-cram">Все подряд</button></div>' +
      '<p class="small muted" style="margin:0">Новые карточки: до ' + S.settings.newPerSession + ' за раз. «Не знаю» — карточка вернётся в этой же сессии, «Сложно» — завтра, «Знаю» — через растущий интервал (1, 2, 4, 8, 16… дней).</p>' +
      "</div>";
    $("#fc-src").value = fc.src;
    $("#fc-src").addEventListener("change", (e) => { fc.src = e.target.value; persistFc(); renderLearnSetup(); });
    $("#fc-dir").addEventListener("click", (e) => { const b = e.target.closest("[data-d]"); if (!b) return; fc.dir = b.dataset.d; persistFc(); renderLearnSetup(); });
    $("#fc-type").addEventListener("change", (e) => { S.settings.typeAnswer = e.target.checked; save(); });
    $("#fc-start").addEventListener("click", () => startSession(false));
    $("#fc-cram").addEventListener("click", () => startSession(true));
  }
  function goalBar() {
    const n = S.days[today()] || 0, g = S.settings.goal, pct = Math.min(100, Math.round((n / g) * 100));
    return '<div class="goal"><span>🎯 Цель дня</span><div class="progress"><i style="width:' + pct + '%"></i></div><b>' + n + " / " + g + (n >= g ? " ✓" : "") + "</b></div>";
  }
  function modeSwitch(cur) {
    return '<div class="mode-sw"><div class="seg"><button data-go="learn" class="' + (cur === "learn" ? "on" : "") + '">🃏 Карточки</button><button data-go="quiz" class="' + (cur === "quiz" ? "on" : "") + '">🎯 Квиз</button></div></div>' + goalBar();
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
      fresh.sort((a, b) => (b.f || (b.top ? 5 : 3)) - (a.f || (a.top ? 5 : 3)) || Math.random() - 0.5);
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
    const front = c.dir === "ru-en" ? x.ru : enOf(x);
    const back = c.dir === "ru-en" ? enOf(x) : x.ru;
    const typing = S.settings.typeAnswer && c.dir === "ru-en";
    let extra = "";
    if (fc.flipped && fc.typed) extra = '<div class="typed ' + (fc.typed.ok ? "ok" : "bad") + '">' + (fc.typed.ok ? (fc.typed.close ? "✅ Почти верно (опечатка): " : "✅ Верно: ") : "❌ Ты написал: ") + esc(fc.typed.val || "—") + "</div>";
    if (x.kind === "v") (x.ex || []).forEach((e) => { extra += '<div class="ex"><button class="icon-btn" data-say="' + esc(e[0]) + '">🔊</button><div><div class="ex-en">' + esc(e[0]) + '</div><div class="ex-ru">' + esc(e[1]) + "</div></div></div>"; });
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
      (c.dir === "en-ru" ? '<div class="row" style="margin-top:8px"><button class="icon-btn" data-say="' + esc(sayOf(x)) + '">🔊</button></div>' : "") +
      '<div class="hint">' + (x.kind === "p" ? CAT[x.cat].icon + " " + esc(CAT[x.cat].name) + (x.t === "m" ? " · запомнить целиком" : "") : x.kind === "v" ? "🔤 Неправильный глагол" + (c.dir === "ru-en" ? " · назови 3 формы" : "") : esc(SECS[x.sec])) + "</div>" +
      (fc.flipped
        ? '<div class="a"><div class="ans">' + esc(back) + '</div>' + (c.dir === "ru-en" ? '<div class="row" style="justify-content:center;margin-top:6px"><button class="icon-btn" data-say="' + esc(sayOf(x)) + '">🔊</button></div>' : "") + extra + "</div>"
        : typing ? '<form class="type-box" id="fc-form"><input class="input" id="fc-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + (x.kind === "v" ? "например: went gone" : "Напиши по-английски…") + '"></form>'
        : '<div class="tap">Нажми, чтобы увидеть ответ</div>') +
      "</div>" +
      (fc.flipped
        ? '<div class="grades"><button class="btn again" data-g="0">Не знаю<small>сейчас</small></button><button class="btn hard" data-g="1">Сложно<small>завтра</small></button><button class="btn good" data-g="2">Знаю<small>' + INTERVALS[Math.min(box + 1, 7)] + " дн.</small></button></div>"
        : typing ? '<div class="grades" style="grid-template-columns:2fr 1fr"><button class="btn primary big" id="fc-check">Проверить</button><button class="btn" id="fc-flip">Не знаю</button></div>'
        : '<div class="grades" style="grid-template-columns:1fr"><button class="btn primary big" id="fc-flip">Показать ответ</button></div>') +
      '<div class="kbd">Пробел — перевернуть · 1 / 2 / 3 — оценка · S — озвучить</div>' +
      "</div>";
    if (fc.flipped && c.dir === "ru-en") speak(sayOf(x));
    if (!fc.flipped && c.dir === "en-ru") speak(sayOf(x));
    if (typing && !fc.flipped) {
      const inp = $("#fc-input");
      $("#fc-form").addEventListener("submit", (e) => { e.preventDefault(); checkTyped(); });
      if (matchMedia("(hover: hover)").matches) inp.focus();
    }
  }

  // ---------- проверка введённого ответа ----------
  const clean = (s) => norm(s).replace(/[’`]/g, "'").replace(/\(.*?\)|[.,!?…"«»:;–—-]/g, " ").replace(/\s+/g, " ").trim();
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function judge(x, val) {
    const v = clean(val);
    if (!v) return { ok: false };
    if (x.kind === "v") {
      const toks = v.split(" ");
      const has = (forms) => forms.split(" / ").some((f) => toks.includes(clean(f)));
      return { ok: has(x.past) && has(x.pp) };
    }
    const answers = x.en.split(" / ").concat(x.alt || []).map(clean).filter(Boolean);
    if (answers.includes(v)) return { ok: true };
    const close = answers.some((a) => a.length > 4 && lev(a, v) <= (a.length > 10 ? 2 : 1));
    return { ok: close, close };
  }
  function checkTyped() {
    const c = fc.queue[fc.i], x = itemById(c.id), val = $("#fc-input").value;
    fc.typed = Object.assign({ val }, judge(x, val));
    fc.flipped = true; renderCard();
    const g = $('[data-g="' + (fc.typed.ok ? 2 : 0) + '"]'); if (g) g.classList.add("suggest");
  }

  function flip() { if (!fc.flipped) { fc.flipped = true; fc.typed = null; renderCard(); } }
  function grade(g) {
    const c = fc.queue[fc.i], p = prog(c.id), now = Date.now();
    if (!p.seen) p.seen = now;
    if (g === 0) { p.box = 0; p.due = now; fc.queue.splice(Math.min(fc.i + 4, fc.queue.length), 0, { id: c.id, dir: c.dir }); fc.total++; }
    else if (g === 1) { p.box = Math.max(1, p.box); p.due = now + DAY; }
    else { p.box = Math.min(p.box + 1, 7); p.due = now + INTERVALS[p.box] * DAY; }
    p.st = p.box >= 5 ? 2 : 1;
    logReview(); save();
    fc.done++; fc.i++; fc.flipped = false; fc.typed = null; renderCard();
  }

  function bindLearn() {
    $("#view-learn").addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]"); if (go) { show(go.dataset.go); return; }
      if (!fc.running) return;
      const say = e.target.closest("[data-say]"); if (say) { e.stopPropagation(); speak(say.dataset.say); return; }
      if (e.target.closest("#fc-exit")) { renderLearnSetup(); return; }
      const g = e.target.closest("[data-g]"); if (g) { grade(+g.dataset.g); return; }
      if (e.target.closest("#fc-check")) { checkTyped(); return; }
      if (e.target.closest("#fc-form")) return;
      if (e.target.closest("#fc-flip") || e.target.closest("#fc-card")) flip();
    });
  }

  // ---------- QUIZ ----------
  const qz = { src: "ph:all", mode: "ctx", items: [], i: 0, score: 0, answered: false, running: false };
  const MODES = { ctx: "Ситуация", listen: "🎧 На слух", ruen: "RU → EN", enru: "EN → RU" };

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
    $("#view-quiz").innerHTML = modeSwitch("quiz") +
      '<div class="card setup">' +
      '<label>Тема<select id="qz-src">' + deckOptions() + "</select></label>" +
      '<label>Режим<div class="seg" id="qz-mode">' + Object.keys(MODES).map((k) => '<button data-m="' + k + '" class="' + (qz.mode === k ? "on" : "") + '">' + MODES[k] + "</button>").join("") + "</div></label>" +
      '<p class="small muted" style="margin:0">«Ситуация» — пример из диалога с пропуском, выбери подходящую фразу. «На слух» — фраза звучит голосом, текста не видно, выбери перевод: тренирует понимание речи в фильмах.</p>' +
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
    const keyOf = (y) => (qz.mode === "enru" || qz.mode === "listen" ? y.ru : enOf(y));
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
    else if (qz.mode === "listen") { prompt = "Что прозвучало? Выбери перевод"; text = ""; }
    else { prompt = "Что это значит?"; text = enOf(x); }
    const pct = Math.round((qz.i / qz.items.length) * 100);
    v.innerHTML = '<div class="fc-wrap">' +
      '<div class="fc-top"><button class="icon-btn" id="qz-exit" title="Выйти">✕</button><div class="progress"><i style="width:' + pct + '%"></i></div><span class="small muted">' + (qz.i + 1) + "/" + qz.items.length + "</span></div>" +
      '<div class="card qz-q"><div class="prompt">' + prompt + "</div>" +
      (qz.mode === "listen"
        ? '<button class="listen-btn" data-say="' + esc(sayOf(x)) + '">🔊</button><div class="row" style="justify-content:center;gap:6px"><button class="btn small-btn" data-slow="1">🐢 Медленно</button></div>'
        : '<div class="text">' + esc(text) + "</div>") +
      (sub ? '<div class="sub">' + esc(sub) + "</div>" : "") +
      (qz.mode === "enru" ? '<div class="row" style="justify-content:center;margin-top:8px"><button class="icon-btn" data-say="' + esc(sayOf(x)) + '">🔊</button></div>' : "") + "</div>" +
      '<div class="opts">' + qz.opts.map((o, i) => '<button class="opt" data-o="' + i + '">' + esc(keyOf(o)) + "</button>").join("") + "</div>" +
      '<div id="qz-after"></div></div>';
    qz.answered = false;
    if (qz.mode === "listen") speak(sayOf(x));
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
    if (qz.mode !== "listen") speak(sayOf(x));
    let expl = '<b>' + esc(enOf(x)) + "</b> — " + esc(x.ru);
    if (x.n) expl += '<div class="muted" style="margin-top:4px">' + esc(x.n) + "</div>";
    $("#qz-after").innerHTML = '<div class="card qz-expl">' + (ok ? "✅ Верно! " : "❌ Неверно. ") + expl + '</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary big" id="qz-next">Дальше →</button></div>';
  }

  function bindQuiz() {
    $("#view-quiz").addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]"); if (go) { show(go.dataset.go); return; }
      if (!qz.running) return;
      const say = e.target.closest("[data-say]"); if (say) { speak(say.dataset.say); return; }
      if (e.target.closest("[data-slow]")) { const r = S.settings.rate; S.settings.rate = 0.6; speak(sayOf(qz.items[qz.i])); S.settings.rate = r; return; }
      if (e.target.closest("#qz-exit")) { renderQuizSetup(); return; }
      const o = e.target.closest("[data-o]"); if (o) { answer(+o.dataset.o); return; }
      if (e.target.closest("#qz-next")) { qz.i++; renderQuestion(); }
    });
  }

  // ---------- НЕПРАВИЛЬНЫЕ ГЛАГОЛЫ ----------
  const GRP = {
    AAA: { name: "Все формы одинаковые", ex: "cut – cut – cut" },
    ABB: { name: "2-я и 3-я совпадают", ex: "buy – bought – bought" },
    ABA: { name: "1-я и 3-я совпадают", ex: "come – came – come" },
    ABC: { name: "Все формы разные", ex: "go – went – gone" }
  };
  const vui = { q: "", f: "top", hide: false, open: new Set(), shown: new Set(), trainer: null };
  function verbList() {
    const q = norm(vui.q.trim());
    return VB.filter((v) =>
      (vui.f === "all" || (vui.f === "top" && v.top) || (vui.f === "learned" && statusOf(v.id) === 2) || (vui.f === "new" && statusOf(v.id) !== 2) || vui.f === v.grp) &&
      (!q || norm(v.forms + " " + v.ru).includes(q)));
  }
  function renderVerbs() {
    const v = $("#view-verbs");
    if (vui.trainer) return renderTrainer();
    const learned = VB.filter((x) => statusOf(x.id) === 2).length;
    const opts = [["top", "⭐ Самые нужные"], ["all", "Все глаголы"], ["new", "Не выученные"], ["learned", "Выученные"]]
      .concat(Object.keys(GRP).map((k) => [k, GRP[k].name + " (" + GRP[k].ex + ")"]));
    v.innerHTML =
      '<input class="search" id="vb-search" type="search" placeholder="Поиск: go, went, идти…" autocomplete="off" value="' + esc(vui.q) + '">' +
      '<div class="toolbar"><select id="vb-filter" class="filt-select">' + opts.map(([k, n]) => '<option value="' + k + '"' + (vui.f === k ? " selected" : "") + ">" + esc(n) + "</option>").join("") + "</select>" +
      '<button class="btn filt-btn' + (vui.hide ? " on" : "") + '" id="vb-hide">' + (vui.hide ? "👁 Показать" : "🙈 Скрыть формы") + "</button></div>" +
      '<div class="row" style="margin-bottom:10px"><button class="btn primary" id="vb-train">✍️ Тренажёр</button><button class="btn" id="vb-cards">🃏 Карточки</button><span class="spacer"></span><span class="small muted">Выучено ' + learned + " из " + VB.length + "</span></div>" +
      (vui.hide ? '<div class="tip small" style="margin-bottom:10px">🙈 Режим самопроверки: вспомни 2-ю и 3-ю формы, затем нажми на строку, чтобы проверить.</div>' : "") +
      '<div class="count-line" id="vb-count"></div>' +
      '<div class="card vb-table"><div class="vb-row vb-head"><span>V1 · инфинитив</span><span>V2 · Past</span><span>V3 · Participle</span><span>Перевод</span><span></span></div><div id="vb-list"></div></div>';
    renderVerbRows();
    let t;
    $("#vb-search").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { vui.q = e.target.value; renderVerbRows(); }, 150); });
    $("#vb-filter").addEventListener("change", (e) => { vui.f = e.target.value; renderVerbRows(); });
    $("#vb-hide").addEventListener("click", () => { vui.hide = !vui.hide; vui.shown.clear(); renderVerbs(); });
    $("#vb-train").addEventListener("click", startTrainer);
    $("#vb-cards").addEventListener("click", () => { fc.src = vui.f === "top" ? "v:top" : "v:all"; persistFc(); show("learn"); });
  }
  function renderVerbRows() {
    const list = verbList();
    $("#vb-count").textContent = plural(list.length, "глагол", "глагола", "глаголов");
    $("#vb-list").innerHTML =
      (list.length ? list.map((x) => {
        const st = statusOf(x.id), hidden = vui.hide && !vui.shown.has(x.id), open = vui.open.has(x.id);
        const f = (s) => (hidden ? '<span class="vb-mask">•••</span>' : esc(s));
        return '<div class="vb-row' + (st === 2 ? " learned" : "") + (open ? " open" : "") + '" data-id="' + esc(x.id) + '">' +
          '<span class="vb-1">' + esc(x.en) + "</span><span>" + f(x.past) + "</span><span>" + f(x.pp) + '</span><span class="vb-ru">' + esc(x.ru) + "</span>" +
          '<span class="vb-act"><button class="icon-btn" data-say="' + esc(sayOf(x)) + '" title="Озвучить">🔊</button><button class="icon-btn" data-vl="1" title="Знаю">' + (st === 2 ? "✅" : "⬜") + "</button></span>" +
          (open && x.ex.length ? '<div class="vb-ex"><button class="icon-btn" data-say="' + esc(x.ex[0][0]) + '">🔊</button><div><div class="ex-en">' + esc(x.ex[0][0]) + '</div><div class="ex-ru">' + esc(x.ex[0][1]) + '</div><div class="small muted">' + GRP[x.grp].name + "</div></div></div>" : "") +
          "</div>";
      }).join("") : '<div class="empty">Ничего не найдено</div>');
  }
  function bindVerbs() {
    $("#view-verbs").addEventListener("click", (e) => {
      if (vui.trainer) return onTrainerClick(e);
      const say = e.target.closest("[data-say]"); if (say) { speak(say.dataset.say); return; }
      const row = e.target.closest(".vb-row[data-id]"); if (!row) return;
      const id = row.dataset.id;
      if (e.target.closest("[data-vl]")) {
        const p = prog(id); p.st = p.st === 2 ? 0 : 2;
        if (p.st === 2) { p.box = Math.max(p.box, 5); p.due = Date.now() + 30 * DAY; p.seen = p.seen || Date.now(); } else { p.box = 0; p.due = 0; p.seen = 0; }
        save(); renderVerbRows(); return;
      }
      if (vui.hide && !vui.shown.has(id)) { vui.shown.add(id); speak(sayOf(vbIndex[id])); }
      else if (vui.open.has(id)) vui.open.delete(id); else vui.open.add(id);
      renderVerbRows();
    });
  }

  // Тренажёр: показываем V1 и перевод, нужно вписать V2 и V3
  function startTrainer() {
    let pool = verbList(); if (pool.length < 5) pool = VB.filter((v) => v.top);
    pool = shuffle(pool).sort((a, b) => statusOf(a.id) - statusOf(b.id));
    vui.trainer = { items: shuffle(pool.slice(0, 10)), i: 0, score: 0, res: null, wrong: [] };
    renderVerbs();
  }
  function renderTrainer() {
    const T = vui.trainer, v = $("#view-verbs");
    if (T.i >= T.items.length) {
      v.innerHTML = '<div class="fc-wrap"><div class="card fc"><div class="q">' + T.score + " / " + T.items.length + '</div><div class="hint">' + (T.score === T.items.length ? "Идеально! 🔥" : T.score >= 7 ? "Хорошо 👍" : "Повтори и попробуй ещё 💪") + "</div>" +
        (T.wrong.length ? '<div class="a" style="text-align:left"><div class="small muted" style="margin-bottom:6px">Повтори:</div>' + T.wrong.map((x) => "<div><b>" + esc(x.forms) + "</b> — " + esc(x.ru) + "</div>").join("") + "</div>" : "") +
        '</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn primary" data-t="again">Ещё 10</button><button class="btn" data-t="exit">К списку</button></div></div>';
      return;
    }
    const x = T.items[T.i], r = T.res;
    const field = (name, val, okv) => '<label class="tr-field"><span>' + name + '</span><input class="input' + (r ? (okv ? " ok" : " bad") : "") + '" id="tr-' + name + '" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(val || "") + '"' + (r ? " disabled" : "") + "></label>";
    v.innerHTML = '<div class="fc-wrap">' +
      '<div class="fc-top"><button class="icon-btn" data-t="exit" title="Выйти">✕</button><div class="progress"><i style="width:' + (T.i / T.items.length) * 100 + '%"></i></div><span class="small muted">' + (T.i + 1) + "/" + T.items.length + "</span></div>" +
      '<div class="card fc" style="min-height:0"><div class="q">' + esc(x.en) + '</div><div class="hint">' + esc(x.ru) + "</div>" +
      '<form id="tr-form" class="tr-grid">' + field("Past", r && r.p, r && r.pOk) + field("Participle", r && r.pp, r && r.ppOk) + "</form>" +
      (r ? '<div class="a"><div class="ans">' + esc(x.forms) + '</div><div class="row" style="justify-content:center"><button class="icon-btn" data-say="' + esc(sayOf(x)) + '">🔊</button></div>' +
        (x.ex.length ? '<div class="ex" style="justify-content:center"><div><div class="ex-en">' + esc(x.ex[0][0]) + '</div><div class="ex-ru">' + esc(x.ex[0][1]) + "</div></div></div>" : "") + "</div>" : "") +
      "</div>" +
      '<div class="grades" style="grid-template-columns:1fr">' + (r ? '<button class="btn primary big" data-t="next">Дальше →</button>' : '<button class="btn primary big" data-t="check">Проверить</button>') + "</div>" +
      '<div class="kbd">Tab — к следующему полю · Enter — проверить / дальше</div></div>';
    $("#tr-form").addEventListener("submit", (e) => { e.preventDefault(); r ? trainerNext() : trainerCheck(); });
    $("#tr-form").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); r ? trainerNext() : trainerCheck(); } });
    if (!r && matchMedia("(hover: hover)").matches) $("#tr-Past").focus();
    if (r) { const nb = $('[data-t="next"]'); nb.focus(); }
  }
  function trainerCheck() {
    const T = vui.trainer, x = T.items[T.i];
    const p = $("#tr-Past").value, pp = $("#tr-Participle").value;
    const okForm = (val, forms) => forms.split(" / ").some((f) => clean(f) === clean(val));
    const pOk = okForm(p, x.past), ppOk = okForm(pp, x.pp);
    T.res = { p, pp, pOk, ppOk };
    const P = prog(x.id), now = Date.now();
    if (!P.seen) P.seen = now;
    if (pOk && ppOk) { T.score++; P.box = Math.min(P.box + 1, 7); P.due = now + INTERVALS[P.box] * DAY; }
    else { T.wrong.push(x); P.box = 0; P.due = now; }
    P.st = P.box >= 5 ? 2 : 1;
    logReview(); save(); speak(sayOf(x));
    renderTrainer();
  }
  function trainerNext() { const T = vui.trainer; T.i++; T.res = null; renderTrainer(); }
  function onTrainerClick(e) {
    const say = e.target.closest("[data-say]"); if (say) { speak(say.dataset.say); return; }
    const t = e.target.closest("[data-t]"); if (!t) return;
    const a = t.dataset.t;
    if (a === "exit") { vui.trainer = null; renderVerbs(); }
    else if (a === "again") startTrainer();
    else if (a === "check") trainerCheck();
    else if (a === "next") trainerNext();
  }

  // ---------- ГРАММАТИКА ----------
  const GR = window.GRAMMAR;
  const gui = { open: null, answers: {} };
  const LEVELS = { A2: "Основа (A2)", B1: "Средний уровень (B1)", B2: "Выше среднего (B2)" };
  function renderGrammar() {
    const v = $("#view-grammar");
    if (gui.open) return renderTopic();
    const done = GR.filter((t) => (S.g[t.id] || {}).done).length;
    let h = '<h1>📐 Правила</h1><p class="muted" style="margin-top:-6px">Грамматика простыми словами: когда использовать, как строить, как звучит в фильмах и где ошибаются русскоязычные. Изучено ' + done + " из " + GR.length + ".</p>";
    Object.keys(LEVELS).forEach((lv) => {
      const ts = GR.filter((t) => t.level === lv); if (!ts.length) return;
      h += '<h2>' + LEVELS[lv] + '</h2><div class="g-grid">';
      ts.forEach((t) => {
        const g = S.g[t.id] || {};
        h += '<button class="g-tile' + (g.done ? " done" : "") + '" data-topic="' + t.id + '"><span class="ti">' + t.icon + '</span><span class="g-txt"><span class="tn">' + esc(t.title) + '</span><span class="tc">' + esc(t.short) + "</span></span>" +
          '<span class="g-st">' + (g.done ? "✅" : "") + (g.best != null ? '<small>' + g.best + "/" + t.quiz.length + "</small>" : "") + "</span></button>";
      });
      h += "</div>";
    });
    v.innerHTML = h;
  }
  function renderTopic() {
    const idx = GR.findIndex((t) => t.id === gui.open), t = GR[idx], g = S.g[t.id] || {};
    if (!gui.order || gui.order.id !== t.id) gui.order = { id: t.id, q: t.quiz.map((q) => shuffle(q[1].map((o, i) => i))) };
    const prev = GR[idx - 1], next = GR[idx + 1];
    let quiz = '<h3>🧪 Проверь себя</h3><div class="g-quiz">';
    t.quiz.forEach((q, qi) => {
      const ans = gui.answers[qi];
      quiz += '<div class="g-q"><div class="g-qt">' + (qi + 1) + ". " + esc(q[0]) + '</div><div class="g-opts">' +
        gui.order.q[qi].map((oi) => '<button class="opt' + (ans != null ? (oi === q[2] ? " right" : oi === ans ? " wrong" : "") : "") + '" data-q="' + qi + '" data-a="' + oi + '"' + (ans != null ? " disabled" : "") + ">" + esc(q[1][oi]) + "</button>").join("") +
        "</div>" + (ans != null ? '<div class="g-expl">' + (ans === q[2] ? "✅ " : "❌ ") + esc(q[3]) + "</div>" : "") + "</div>";
    });
    const answered = Object.keys(gui.answers).length, score = t.quiz.filter((q, i) => gui.answers[i] === q[2]).length;
    quiz += "</div>" + (answered === t.quiz.length ? '<div class="g-score">Результат: <b>' + score + " / " + t.quiz.length + '</b> <button class="btn small-btn" data-g-retry="1">Ещё раз</button></div>' : "");
    $("#view-grammar").innerHTML =
      '<div class="g-top"><button class="btn" data-back="1">← Все правила</button><span class="badge">' + t.level + "</span></div>" +
      '<article class="g-body"><h1>' + t.icon + " " + esc(t.title) + "</h1>" + t.body + quiz + "</article>" +
      '<div class="g-foot"><button class="btn' + (g.done ? " on" : " primary") + '" data-done="1">' + (g.done ? "✅ Изучено" : "Отметить как изученное") + "</button></div>" +
      '<div class="g-nav">' + (prev ? '<button class="btn" data-topic="' + prev.id + '">← ' + esc(prev.title) + "</button>" : "<span></span>") +
      (next ? '<button class="btn" data-topic="' + next.id + '">' + esc(next.title) + " →</button>" : "") + "</div>";
    // кнопки озвучки к примерам
    $$("#view-grammar .exs li").forEach((li) => {
      const b = li.querySelector("b"); if (!b) return;
      const btn = document.createElement("button");
      btn.className = "icon-btn"; btn.textContent = "🔊"; btn.dataset.say = b.textContent.replace(/—/g, " ");
      li.prepend(btn);
    });
  }
  function bindGrammar() {
    $("#view-grammar").addEventListener("click", (e) => {
      const say = e.target.closest("[data-say]"); if (say) { speak(say.dataset.say); return; }
      const tp = e.target.closest("[data-topic]"); if (tp) { gui.open = tp.dataset.topic; gui.answers = {}; renderGrammar(); window.scrollTo({ top: 0 }); return; }
      if (e.target.closest("[data-back]")) { gui.open = null; renderGrammar(); window.scrollTo({ top: 0 }); return; }
      const t = GR.find((x) => x.id === gui.open);
      if (e.target.closest("[data-done]")) { const g = S.g[t.id] || (S.g[t.id] = {}); g.done = !g.done; save(); renderTopic(); return; }
      if (e.target.closest("[data-g-retry]")) { gui.answers = {}; gui.order = null; renderTopic(); return; }
      const o = e.target.closest("[data-q]");
      if (o && gui.answers[o.dataset.q] == null) {
        const y = window.scrollY;
        gui.answers[o.dataset.q] = +o.dataset.a;
        if (Object.keys(gui.answers).length === t.quiz.length) {
          const score = t.quiz.filter((q, i) => gui.answers[i] === q[2]).length;
          const g = S.g[t.id] || (S.g[t.id] = {});
          g.best = Math.max(g.best || 0, score);
          if (score === t.quiz.length) g.done = true;
          logReview(); save();
        }
        renderTopic(); window.scrollTo({ top: y });
      }
    });
  }

  // ---------- STATS & SETTINGS ----------
  // активность за последние 7 дней
  function weekChart() {
    const days = [], names = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    for (let i = 6; i >= 0; i--) { const d = new Date(Date.now() - i * DAY); days.push([d.toISOString().slice(0, 10), names[d.getDay()]]); }
    const max = Math.max(S.settings.goal, ...days.map(([k]) => S.days[k] || 0));
    return '<div class="week">' + days.map(([k, n]) => { const v = S.days[k] || 0; return '<div class="wk' + (v >= S.settings.goal ? " hit" : "") + '" title="' + k + ": " + v + '"><i style="height:' + Math.max(4, (v / max) * 100) + '%"></i><span>' + n + "</span></div>"; }).join("") + "</div>";
  }
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
    const vl = VB.filter((v) => statusOf(v.id) === 2).length;
    const gd = GR.filter((t) => (S.g[t.id] || {}).done).length;
    const vdue = deckStats(VB).due;
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
    const vItems = VB, vL = vItems.filter((x) => statusOf(x.id) === 2).length;
    bars += '<div class="bar-row"><span>🔤 Неправильные глаголы</span><div class="bar"><i class="l" style="width:' + (vL / vItems.length) * 100 + '%"></i></div><span class="n">' + vL + "/" + vItems.length + "</span></div>";
    const voiceOpts = '<option value="">Авто</option>' + voices.map((v) => '<option value="' + esc(v.name) + '"' + (v.name === S.settings.voice ? " selected" : "") + ">" + esc(v.name) + " (" + v.lang + ")</option>").join("");
    const catOpts = window.CATEGORIES.filter((c) => c.id !== "custom").map((c) => '<option value="' + c.id + '">' + c.icon + " " + esc(c.name) + "</option>").join("");

    $("#view-stats").innerHTML = "<h1>📊 Прогресс</h1>" +
      '<div class="kpis">' +
      '<div class="card kpi"><b>' + learned + '</b><span>фраз выучено из ' + all.length + "</span></div>" +
      '<div class="card kpi"><b>' + learning + "</b><span>фраз в процессе</span></div>" +
      '<div class="card kpi"><b>' + wl + "</b><span>слов выучено из " + WD.length + "</span></div>" +
      '<div class="card kpi"><b>' + streak() + " 🔥</b><span>дней подряд</span></div>" +
      '<div class="card kpi"><b>' + vl + "</b><span>глаголов из " + VB.length + "</span></div>" +
      '<div class="card kpi"><b>' + gd + "</b><span>правил изучено из " + GR.length + "</span></div>" +
      '<div class="card kpi kpi-wide">' + goalBar() + weekChart() + "</div>" +
      "</div>" +
      (due || wdue || vdue ? '<p class="row">' + (due ? '<button class="btn primary" id="go-review">Повторить фразы: ' + due + " →</button>" : "") + (wdue ? '<button class="btn" id="go-review-w">Повторить слова: ' + wdue + " →</button>" : "") + (vdue ? '<button class="btn" id="go-review-v">Повторить глаголы: ' + vdue + " →</button>" : "") + "</p>" : "") +
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

      '<h2>☁️ Синхронизация телефона и ПК</h2>' + syncCard() +
      '<h2>⚙️ Настройки</h2><div class="card settings">' +
      '<div class="set-row"><div class="lbl">Скрыть мат и 18+<small>Убирает фразы с пометкой «мат» и раздел «18+ Интим»</small></div><label class="switch"><input type="checkbox" id="set-vulgar"' + (S.settings.hideVulgar ? " checked" : "") + "><span></span></label></div>" +
      '<div class="set-row"><div class="lbl">Голос озвучки<small>Список зависит от устройства</small></div><select id="set-voice">' + voiceOpts + '</select><button class="btn" id="test-voice">▶︎</button></div>' +
      '<div class="set-row"><div class="lbl">Скорость речи<small id="rate-l">' + S.settings.rate.toFixed(2) + '×</small></div><input type="range" id="set-rate" min="0.5" max="1.3" step="0.05" value="' + S.settings.rate + '"></div>' +
      '<div class="set-row"><div class="lbl">Цель дня<small>Сколько повторений (карточки, квизы, тренажёр) в день</small></div><select id="set-goal">' + [10, 20, 30, 50, 100].map((n) => "<option" + (n === S.settings.goal ? " selected" : "") + ">" + n + "</option>").join("") + "</select></div>" +
      '<div class="set-row"><div class="lbl">Новых карточек за сессию</div><select id="set-new">' + [10, 20, 30, 50].map((n) => "<option" + (n === S.settings.newPerSession ? " selected" : "") + ">" + n + "</option>").join("") + "</select></div>" +
      '<div class="set-row"><div class="lbl">Две колонки на широком экране</div><label class="switch"><input type="checkbox" id="set-cols"' + (S.settings.twoCols ? " checked" : "") + "><span></span></label></div>" +
      '<div class="set-row"><div class="lbl">Резервная копия<small>Прогресс и свои фразы — в файл. Так можно перенести с телефона на ПК и обратно</small></div><button class="btn" id="exp">⬇️ Экспорт</button><label class="btn">⬆️ Импорт<input type="file" id="imp" accept=".json,application/json" hidden></label></div>' +
      '<div class="set-row"><div class="lbl">Сбросить весь прогресс</div><button class="btn" id="reset" style="color:var(--bad)">Сбросить</button></div>' +
      "</div>" +
      '<p class="small muted">Всего в базе: ' + PH.length + " фраз, " + WD.length + " слов, " + VB.length + " неправильных глаголов и " + GR.length + " правил. Данные хранятся только в этом браузере.</p>";

    bindSyncCard();
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
    $("#set-goal").addEventListener("change", (e) => { S.settings.goal = +e.target.value; save(); renderStats(); });
    $("#set-cols").addEventListener("change", (e) => { S.settings.twoCols = e.target.checked; save(); renderPhrases(); });
    $("#exp").addEventListener("click", exportData);
    $("#imp").addEventListener("change", importData);
    $("#reset").addEventListener("click", () => { if (confirm("Точно сбросить весь прогресс? Свои фразы останутся.")) { S.p = {}; S.days = {}; S.resetAt = Date.now(); save(); renderAll(); toast("Прогресс сброшен"); } });
    const gr = $("#go-review"); if (gr) gr.addEventListener("click", () => { fc.src = "ph:all"; show("learn"); startSession(false); });
    const grv = $("#go-review-v"); if (grv) grv.addEventListener("click", () => { fc.src = "v:all"; show("learn"); startSession(false); });
    const grw = $("#go-review-w"); if (grw) grw.addEventListener("click", () => { fc.src = "w:all"; show("learn"); startSession(false); });
  }

  function syncCard() {
    if (SY.token) {
      return '<div class="card form sync">' +
        '<div class="row"><b>Подключено</b><span class="spacer"></span><span class="small muted" id="sync-status">' + esc(syncMsg || (SY.err ? "⚠️ " + SY.err : SY.last ? "✅ Последняя синхронизация: " + new Date(SY.last).toLocaleString("ru") : "")) + "</span></div>" +
        '<p class="small muted" style="margin:0">Прогресс, избранное и свои фразы сохраняются в приватный Gist на твоём GitHub автоматически: через несколько секунд после занятий и при открытии сайта. На другом устройстве вставь тот же ключ.</p>' +
        '<div class="row"><button class="btn primary" id="sync-now">🔄 Синхронизировать сейчас</button><button class="btn" id="sync-off">Отключить на этом устройстве</button></div></div>';
    }
    return '<div class="card form sync">' +
      '<p style="margin:0">Прогресс будет храниться в <b>приватной заметке (Gist) на твоём GitHub</b> и автоматически совпадать на телефоне и ПК. Настройка один раз на каждом устройстве:</p>' +
      '<ol class="sync-steps">' +
      '<li>Открой <a href="https://github.com/settings/tokens/new?scopes=gist&description=Talk%20Native%20sync" target="_blank" rel="noopener">создание ключа на GitHub</a> (галочка <b>gist</b> уже стоит — больше ничего не отмечай).</li>' +
      '<li>В поле <b>Expiration</b> выбери <b>No expiration</b> → нажми <b>Generate token</b> внизу.</li>' +
      '<li>Скопируй ключ (начинается с <code>ghp_</code>) и вставь сюда:</li></ol>' +
      '<div class="row"><input class="input" id="sync-token" type="password" autocomplete="off" placeholder="ghp_…" style="flex:1;min-width:200px"><button class="btn primary" id="sync-connect">Подключить</button></div>' +
      '<p class="small muted" style="margin:0">На втором устройстве вставь <b>тот же ключ</b> (перешли его себе в «Избранное» мессенджера) или создай ещё один по той же ссылке. Ключ даёт доступ только к заметкам Gist — не к коду и не к аккаунту. <span id="sync-status">' + esc(syncMsg) + "</span></p></div>";
  }
  function bindSyncCard() {
    const c = $("#sync-connect");
    if (c) c.addEventListener("click", () => { const t = $("#sync-token").value; if (!/^(ghp_|github_pat_)\w{20,}/.test(t.trim())) { toast("Это не похоже на ключ GitHub (ghp_…)"); return; } connectSync(t); });
    const n = $("#sync-now"); if (n) n.addEventListener("click", () => syncNow(true));
    const o = $("#sync-off"); if (o) o.addEventListener("click", () => { if (confirm("Отключить синхронизацию на этом устройстве? Прогресс останется здесь и в Gist.")) { SY = {}; saveSY(); syncMsg = ""; renderStats(); } });
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
        snap = {}; save(); PH = buildPhrases(); phIndex = PH_BY_ID(); renderAll(); toast("Импорт выполнен ✅");
      } catch (err) { toast("Не удалось прочитать файл"); }
    };
    r.readAsText(file);
  }

  // ---------- navigation ----------
  let current = "phrases";
  function show(view) {
    current = view;
    const navView = view === "quiz" ? "learn" : view;
    $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === navView));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    if (view === "learn" && !fc.running) renderLearnSetup();
    if (view === "quiz" && !qz.running) renderQuizSetup();
    if (view === "stats") renderStats();
    if (view === "phrases") renderPhrases();
    if (view === "words") renderWords();
    if (view === "verbs") renderVerbs();
    if (view === "grammar") renderGrammar();
    try { history.replaceState(null, "", "#" + view); } catch (e) { /* file:// */ }
    window.scrollTo({ top: 0 });
  }
  $("#nav").addEventListener("click", (e) => { const b = e.target.closest("[data-view]"); if (b) show(b.dataset.view); });
  window.addEventListener("hashchange", () => { const v = location.hash.slice(1); if (v !== current && $("#view-" + v)) show(v); });

  // ---------- keyboard (ПК) ----------
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); const s = current === "words" ? $("#w-search") : current === "verbs" && $("#vb-search") ? $("#vb-search") : (show("phrases"), $("#ph-search")); s.focus(); return; }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (current === "learn" && fc.running) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (fc.flipped && ["1", "2", "3"].includes(e.key)) grade(+e.key - 1);
      else if (e.key === "s" || e.key === "S" || e.key === "ы" || e.key === "Ы") { const c = fc.queue[fc.i]; if (c) speak(sayOf(itemById(c.id))); }
    }
    if (current === "quiz" && qz.running) {
      if (!qz.answered && ["1", "2", "3", "4"].includes(e.key)) answer(+e.key - 1);
      else if (qz.answered && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); qz.i++; renderQuestion(); }
    }
  });

  function renderAll() { renderPhrases(); renderWords(); if (current === "verbs") renderVerbs(); if (current === "grammar") renderGrammar(); if (current === "stats") renderStats(); if (current === "learn" && !fc.running) renderLearnSetup(); }

  // ---------- init ----------
  bindPhrases(); bindWords(); bindVerbs(); bindGrammar(); bindLearn(); bindQuiz();
  const start = (location.hash || "").slice(1);
  show(["phrases", "words", "verbs", "grammar", "learn", "quiz", "stats"].includes(start) ? start : "phrases");

  if (SY.token) setTimeout(() => syncNow(), 600);

  // Офлайн-режим (работает только на https / localhost, не при открытии файла напрямую)
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
