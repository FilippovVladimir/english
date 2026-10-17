// Категории фраз. Порядок здесь = порядок на сайте.
// Формат фразы (в файлах data/phrases-*.js):
//   en   — фраза на английском
//   ru   — перевод
//   t    — тип: "d" = прямой перевод (переводится почти дословно), "m" = запомнить целиком (устойчивая конструкция/идиома)
//   f    — частота 1..5 (5 = слышно в каждом фильме/сериале)
//   r    — регистр: "f" формально/вежливо, "n" нейтрально, "i" разговорно, "r" грубо, "v" мат/очень грубо
//   pat  — (необязательно) схема употребления: «be into + кто-то», «look forward to + -ing»
//   mine — (необязательно) 1 = из личного списка, попадает в «📝 Мой список»
//   lit  — (необязательно) дословный перевод, чтобы понять логику
//   n    — пояснение: когда, кому, с каким оттенком
//   ex   — примеры [[EN, RU], ...]
//   alt  — похожие варианты
//   reg  — (необязательно) "US" или "UK"
window.CATEGORIES = [
  { id: "greet",     icon: "👋", name: "Приветствия и прощания" },
  { id: "react",     icon: "😲", name: "Реакции и эмоции" },
  { id: "agree",     icon: "👍", name: "Согласие и отказ" },
  { id: "filler",    icon: "💬", name: "Слова-связки и паразиты" },
  { id: "constr",    icon: "🧩", name: "Популярные конструкции" },
  { id: "phrasal",   icon: "🔗", name: "Фразовые глаголы" },
  { id: "feel",      icon: "😵", name: "Состояние и чувства" },
  { id: "address",   icon: "🙋", name: "Обращения" },
  { id: "polite",    icon: "🙏", name: "Просьбы и вежливость" },
  { id: "insult",    icon: "🤬", name: "Обзывательства" },
  { id: "swear",     icon: "💥", name: "Мат и ругательства" },
  { id: "conflict",  icon: "🥊", name: "Конфликты и угрозы" },
  { id: "movie",     icon: "🎬", name: "Клише из фильмов и сериалов" },
  { id: "action",    icon: "🔫", name: "Экшен: команды и бой" },
  { id: "gaming",    icon: "🎮", name: "Игровой сленг" },
  { id: "slang",     icon: "🔥", name: "Современный сленг" },
  { id: "love",      icon: "💘", name: "Флирт и отношения" },
  { id: "idiom",     icon: "🧠", name: "Идиомы" },
  { id: "trap",      icon: "🪤", name: "Ловушки и ложные друзья" },
  { id: "party",     icon: "🍻", name: "Тусовки, алкоголь, деньги" }
];
// Группы тем в окне выбора
window.CATEGORY_GROUPS = [
  { name: "Основа общения", ids: ["greet", "react", "agree", "filler", "feel", "address", "polite"] },
  { name: "Как строят фразы", ids: ["constr", "phrasal", "idiom", "trap"] },
  { name: "Фильмы, сериалы, игры", ids: ["movie", "action", "gaming", "slang"] },
  { name: "Жёстко 🔞", ids: ["insult", "swear", "conflict"] },
  { name: "Жизнь", ids: ["love", "party", "custom"] }
];
window.PHRASES = window.PHRASES || [];
window.P = function (cat, list) {
  list.forEach(function (p) { p.cat = cat; window.PHRASES.push(p); });
};
