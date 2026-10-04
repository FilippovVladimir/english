// Грамматика, часть 1: порядок слов и времена.
// Разметка: h3 — раздел, .formula — схема, table.gt — таблица, ul.exs > li > b (EN) + span (RU) — примеры с озвучкой,
// .tip — подсказка, .warn — типичная ошибка, .movie — как звучит в фильмах. quiz: [вопрос, [варианты], индекс верного, пояснение]
window.GRAMMAR = window.GRAMMAR || [];
window.G = function (t) { window.GRAMMAR.push(t); };

G({ id: "word-order", icon: "🧱", title: "Порядок слов и вопросы", level: "A2", short: "Почему нельзя «Ты любишь кофе?» без do",
body: `
<p>В русском порядок слов свободный: «Я люблю кофе», «Кофе я люблю», «Люблю я кофе» — всё понятно. В английском порядок <b>жёсткий</b>, потому что у слов нет падежных окончаний — роль слова определяется его местом.</p>
<h3>Утверждение</h3>
<div class="formula">Подлежащее → Сказуемое → Дополнение → Место → Время</div>
<ul class="exs">
<li><b>I met your sister at the bar last night.</b><span>Я встретил твою сестру в баре вчера вечером.</span></li>
<li><b>She bought a new car yesterday.</b><span>Она купила новую машину вчера.</span></li>
</ul>
<div class="warn">⚠️ Подлежащее обязательно. По-русски «Идёт дождь», «Холодно» — по-английски нужен формальный подлежащий <b>it</b> или <b>there</b>: <i>It's raining. It's cold. There's a problem.</i></div>
<h3>Вопросы: нужен вспомогательный глагол</h3>
<p>В вопросе вспомогательный глагол выходит <b>перед подлежащим</b>. Если в предложении нет своего вспомогательного (be, have, can, will…), берём <b>do / does / did</b>.</p>
<div class="formula">(Вопр. слово) + вспом. глагол + подлежащее + основной глагол + …?</div>
<table class="gt">
<tr><th>Утверждение</th><th>Вопрос</th></tr>
<tr><td>You like coffee.</td><td><b>Do</b> you like coffee?</td></tr>
<tr><td>He works here.</td><td><b>Does</b> he work here? <small>(s ушла в does)</small></td></tr>
<tr><td>They left.</td><td>When <b>did</b> they leave? <small>(ed ушло в did)</small></td></tr>
<tr><td>She is tired.</td><td><b>Is</b> she tired?</td></tr>
<tr><td>You can swim.</td><td><b>Can</b> you swim?</td></tr>
</table>
<h3>Вопрос к подлежащему — без do</h3>
<p>Если спрашиваем <b>кто? / что?</b> про само подлежащее, порядок как в утверждении:</p>
<ul class="exs">
<li><b>Who called you?</b><span>Кто тебе звонил? (кто — подлежащее)</span></li>
<li><b>Who did you call?</b><span>Кому ты звонил? (ты — подлежащее)</span></li>
<li><b>What happened?</b><span>Что случилось?</span></li>
</ul>
<h3>Отрицание</h3>
<div class="formula">подлежащее + don't / doesn't / didn't + глагол</div>
<ul class="exs"><li><b>I don't know.</b><span>Не знаю.</span></li><li><b>She didn't call.</b><span>Она не позвонила.</span></li></ul>
<div class="movie">🎬 В живой речи вопрос часто делают одной интонацией, выбрасывая вспомогательный глагол: <i>You okay?</i> (=Are you okay?), <i>You hungry?</i>, <i>Want some?</i> (=Do you want some?), <i>You coming?</i></div>
`,
quiz: [
  ["___ she live in London?", ["Does", "Do", "Is", "—"], 0, "Present Simple, she → does."],
  ["Who ___ the window?", ["broke", "did break", "did broke", "breaked"], 0, "Вопрос к подлежащему — без did."],
  ["Where ___ you go last night?", ["did", "do", "were", "have"], 0, "Прошлое, нет своего вспомогательного → did."],
  ["Выбери правильное:", ["It's cold today.", "Is cold today.", "Today cold.", "Cold is today."], 0, "Подлежащее обязательно — it."]
]});

G({ id: "present-simple", icon: "🔁", title: "Present Simple", level: "A2", short: "Привычки, факты, расписания",
body: `
<h3>Когда используем</h3>
<ul>
<li><b>Привычки и регулярные действия:</b> I drink coffee every morning.</li>
<li><b>Факты и постоянные состояния:</b> She lives in Berlin. Water boils at 100°C.</li>
<li><b>Расписания:</b> The train leaves at 6.</li>
<li><b>Глаголы состояния</b> (know, like, want, need, believe, mean, understand) — почти всегда в Simple, даже «сейчас».</li>
</ul>
<h3>Как строится</h3>
<table class="gt">
<tr><th></th><th>I / you / we / they</th><th>he / she / it</th></tr>
<tr><td>+</td><td>I work</td><td>He work<b>s</b></td></tr>
<tr><td>−</td><td>I <b>don't</b> work</td><td>He <b>doesn't</b> work</td></tr>
<tr><td>?</td><td><b>Do</b> you work?</td><td><b>Does</b> he work?</td></tr>
</table>
<div class="tip">💡 Окончание -s только в 3-м лице ед. числа: go → go<b>es</b>, watch → watch<b>es</b>, try → tr<b>ies</b>, have → <b>has</b>.</div>
<h3>Слова-маркеры</h3>
<p>always, usually, often, sometimes, rarely, never, every day, on Mondays, once a week</p>
<ul class="exs">
<li><b>I never lie.</b><span>Я никогда не вру.</span></li>
<li><b>He doesn't drink.</b><span>Он не пьёт.</span></li>
<li><b>What do you do?</b><span>Чем ты занимаешься? (кем работаешь)</span></li>
<li><b>I know what you mean.</b><span>Я понимаю, о чём ты.</span></li>
</ul>
<div class="warn">⚠️ Типичная ошибка: <s>He don't know</s> → He <b>doesn't</b> know. (Но в песнях и речи героев-гопников «he don't» встречается — это просторечие.)</div>
<div class="warn">⚠️ <s>I am knowing</s> → I know. Глаголы состояния не ставят в Continuous.</div>
<div class="movie">🎬 «What do you do?» — не «что ты делаешь?», а «кем работаешь?». «Что делаешь сейчас?» = What are you doing?</div>
`,
quiz: [
  ["My brother ___ in a bank.", ["works", "work", "is work", "working"], 0, "He/she/it + s."],
  ["She ___ like horror movies.", ["doesn't", "don't", "isn't", "not"], 0, "3-е лицо: doesn't + глагол без s."],
  ["— What do you do? — ...", ["I'm a nurse.", "I'm watching TV.", "I do homework.", "Nothing much."], 0, "Вопрос о профессии."],
  ["I ___ what you mean.", ["know", "am knowing", "knowing", "knows"], 0, "Know — глагол состояния, без -ing."]
]});

G({ id: "present-continuous", icon: "▶️", title: "Present Continuous", level: "A2", short: "Прямо сейчас, временно, планы",
body: `
<h3>Когда используем</h3>
<ul>
<li><b>Прямо сейчас:</b> I'm talking to you!</li>
<li><b>Временная ситуация «в эти дни»:</b> I'm living with my parents right now.</li>
<li><b>Договорённые планы на будущее:</b> I'm meeting Tom tonight.</li>
<li><b>Раздражающая привычка с always:</b> You're always complaining!</li>
</ul>
<h3>Как строится</h3>
<div class="formula">am / is / are + глагол-ing</div>
<table class="gt">
<tr><td>+</td><td>I'<b>m</b> work<b>ing</b>. She'<b>s</b> sleep<b>ing</b>. They'<b>re</b> com<b>ing</b>.</td></tr>
<tr><td>−</td><td>I'm <b>not</b> working. He <b>isn't</b> listening.</td></tr>
<tr><td>?</td><td><b>Are</b> you kidding me? What <b>is</b> he doing?</td></tr>
</table>
<div class="tip">💡 Правописание: make → mak<b>ing</b> (e уходит), run → ru<b>nn</b>ing, lie → l<b>y</b>ing.</div>
<ul class="exs">
<li><b>What are you doing here?</b><span>Что ты тут делаешь?</span></li>
<li><b>Are you kidding me?</b><span>Ты издеваешься?</span></li>
<li><b>I'm not going anywhere.</b><span>Я никуда не уйду.</span></li>
<li><b>We're leaving tomorrow.</b><span>Мы уезжаем завтра (уже решено).</span></li>
<li><b>You're always losing your keys!</b><span>Ты вечно теряешь ключи!</span></li>
</ul>
<h3>Simple или Continuous?</h3>
<table class="gt">
<tr><th>Simple — обычно, всегда</th><th>Continuous — сейчас, временно</th></tr>
<tr><td>I work in a bank.</td><td>I'm working from home this week.</td></tr>
<tr><td>He plays guitar.</td><td>He's playing guitar (прямо сейчас).</td></tr>
<tr><td>What do you do?</td><td>What are you doing?</td></tr>
</table>
<div class="movie">🎬 «I'm lovin' it» (McDonald's) — нарочное нарушение правила (love — глагол состояния) для эффекта «прямо сейчас кайфую». В речи такое бывает: <i>I'm loving this!</i></div>
`,
quiz: [
  ["Shh! The baby ___.", ["is sleeping", "sleeps", "sleep", "sleeping"], 0, "Прямо сейчас."],
  ["I ___ my parents on Sunday. It's all arranged.", ["'m visiting", "visit", "visits", "'ll visiting"], 0, "Договорённый план."],
  ["She ___ coffee. She prefers tea.", ["doesn't drink", "isn't drinking", "don't drink", "not drinks"], 0, "Привычка/факт → Simple."],
  ["Why ___ at me like that?", ["are you looking", "do you look", "you looking are", "you look"], 0, "Прямо сейчас + вопрос: are you …ing."]
]});

G({ id: "past-simple", icon: "⏪", title: "Past Simple", level: "A2", short: "Что случилось в прошлом и закончилось",
body: `
<h3>Когда используем</h3>
<p>Действие в прошлом, которое <b>закончилось</b>, и известно (или понятно) когда: yesterday, last week, in 2019, two days ago, when I was a kid.</p>
<h3>Как строится</h3>
<table class="gt">
<tr><td>+</td><td>Правильные: work → work<b>ed</b>. Неправильные: go → <b>went</b> (см. вкладку «Глаголы»)</td></tr>
<tr><td>−</td><td>I <b>didn't</b> go. <small>(глагол в начальной форме!)</small></td></tr>
<tr><td>?</td><td><b>Did</b> you see that? Where <b>did</b> you go?</td></tr>
</table>
<div class="warn">⚠️ После did / didn't глагол <b>без</b> -ed и без второй формы: <s>Did you went?</s> → Did you <b>go</b>? <s>I didn't saw</s> → I didn't <b>see</b>.</div>
<h3>Be в прошлом</h3>
<p>I / he / she / it <b>was</b>; you / we / they <b>were</b>. Вопрос и отрицание без did: <i>Were you there? I wasn't ready.</i></p>
<ul class="exs">
<li><b>I knew it!</b><span>Я так и знал!</span></li>
<li><b>What did you just say?</b><span>Что ты сейчас сказал?</span></li>
<li><b>I didn't do it, I swear!</b><span>Это не я, клянусь!</span></li>
<li><b>Where were you last night?</b><span>Где ты был вчера вечером?</span></li>
<li><b>She left two years ago.</b><span>Она ушла два года назад.</span></li>
</ul>
<div class="tip">💡 Произношение -ed: [t] после глухих (worked, kissed), [d] после звонких (played, called), [ɪd] после t/d (wanted, needed).</div>
<div class="movie">🎬 «What did you just say?» — классическая фраза перед дракой. «just» = «только что».</div>
`,
quiz: [
  ["I ___ him yesterday.", ["saw", "have seen", "see", "seen"], 0, "Конкретное время в прошлом → Past Simple."],
  ["Did you ___ the news?", ["hear", "heard", "hears", "hearing"], 0, "После did — начальная форма."],
  ["They ___ at home last night.", ["weren't", "didn't", "wasn't", "don't"], 0, "They → were / weren't."],
  ["She ___ the job two weeks ago.", ["quit", "quitted", "has quit", "quits"], 0, "quit — quit — quit, «ago» → Past Simple."]
]});

G({ id: "past-continuous", icon: "🎞", title: "Past Continuous", level: "B1", short: "Что происходило в момент в прошлом",
body: `
<h3>Когда используем</h3>
<ul>
<li><b>Процесс в конкретный момент прошлого:</b> At 10 pm I was watching Netflix.</li>
<li><b>Фон, который прервало событие</b> (Past Simple): I was sleeping when the phone rang.</li>
<li><b>Два параллельных процесса:</b> While I was cooking, he was playing games.</li>
</ul>
<div class="formula">was / were + глагол-ing</div>
<ul class="exs">
<li><b>What were you doing at midnight?</b><span>Что ты делал в полночь?</span></li>
<li><b>I was walking home when I heard a scream.</b><span>Я шёл домой, когда услышал крик.</span></li>
<li><b>I wasn't listening, sorry.</b><span>Извини, я не слушал.</span></li>
<li><b>I was just leaving.</b><span>Я как раз уходил.</span></li>
</ul>
<div class="tip">💡 when + короткое событие (Past Simple), while + длительный фон (Past Continuous).</div>
<div class="movie">🎬 «I was just leaving» — вежливый способ сказать «я ухожу» (часто когда пришёл неприятный человек). «I was wondering if…» — очень вежливая просьба: <i>I was wondering if you could help me.</i></div>
`,
quiz: [
  ["I ___ a shower when you called.", ["was taking", "took", "am taking", "have taken"], 0, "Процесс, который прервали."],
  ["While she ___, he cleaned the kitchen.", ["was cooking", "cooked", "cooks", "is cooking"], 0, "while + фон."],
  ["What ___ you doing at 8 last night?", ["were", "did", "was", "are"], 0, "you → were."]
]});

G({ id: "present-perfect", icon: "✅", title: "Present Perfect", level: "B1", short: "Результат к настоящему, опыт, «уже/ещё не»",
body: `
<p>Самое непонятное время для русскоязычных. Главная идея: прошлое действие <b>важно сейчас</b>, а <b>когда</b> оно было — не важно или не сказано.</p>
<div class="formula">have / has + V3 (третья форма)</div>
<h3>1. Результат сейчас</h3>
<ul class="exs">
<li><b>I've lost my keys.</b><span>Я потерял ключи (и сейчас их нет).</span></li>
<li><b>He's gone.</b><span>Он ушёл (его здесь нет).</span></li>
<li><b>You've grown!</b><span>Как ты вырос!</span></li>
</ul>
<h3>2. Жизненный опыт (ever / never)</h3>
<ul class="exs">
<li><b>Have you ever been to New York?</b><span>Ты когда-нибудь был в Нью-Йорке?</span></li>
<li><b>I've never seen anything like it.</b><span>Никогда такого не видел.</span></li>
</ul>
<h3>3. Just / already / yet</h3>
<ul class="exs">
<li><b>I've just finished.</b><span>Я только что закончил.</span></li>
<li><b>She's already left.</b><span>Она уже ушла.</span></li>
<li><b>Have you eaten yet?</b><span>Ты уже поел?</span></li>
<li><b>I haven't decided yet.</b><span>Я ещё не решил.</span></li>
</ul>
<h3>4. С какого момента до сейчас (for / since)</h3>
<ul class="exs">
<li><b>I've known him for ten years.</b><span>Я знаю его десять лет.</span></li>
<li><b>We've been friends since school.</b><span>Мы дружим со школы.</span></li>
</ul>
<div class="warn">⚠️ Русские говорят «Я знаю его 10 лет» в настоящем — по-английски <s>I know him for 10 years</s> нельзя. Только <b>I've known</b>.</div>
<div class="tip">💡 for + период (for two hours, for ages), since + точка отсчёта (since Monday, since 2015, since I was a kid).</div>
<div class="tip">💡 been vs gone: <i>He's been to Paris</i> — был и вернулся. <i>He's gone to Paris</i> — уехал и сейчас там.</div>
<div class="movie">🎬 В американской речи вместо Present Perfect часто говорят Past Simple: <i>Did you eat yet?</i>, <i>I just saw him.</i> Британцы так почти не делают.</div>
`,
quiz: [
  ["I ___ my phone. Can you call it?", ["'ve lost", "lost yesterday", "lose", "'m losing"], 0, "Результат сейчас."],
  ["We ___ each other since 2010.", ["have known", "know", "knew", "are knowing"], 0, "since + до сейчас → Present Perfect."],
  ["Have you ever ___ sushi?", ["tried", "try", "tryed", "trying"], 0, "have + V3; try → tried."],
  ["She isn't here. She's ___ to the shop.", ["gone", "been", "go", "went"], 0, "Ушла и сейчас там → gone."]
]});

G({ id: "perfect-vs-past", icon: "⚖️", title: "Present Perfect или Past Simple?", level: "B1", short: "Главная развилка английских времён",
body: `
<table class="gt">
<tr><th>Present Perfect</th><th>Past Simple</th></tr>
<tr><td>Время <b>не указано</b>, важен результат/опыт</td><td>Время <b>указано</b> или понятно</td></tr>
<tr><td>I've seen this movie.</td><td>I saw it <b>last week</b>.</td></tr>
<tr><td>She's broken her leg (в гипсе).</td><td>She broke her leg <b>in 2019</b>.</td></tr>
<tr><td>Период ещё <b>не закончился</b>: today, this week, this year</td><td>Период <b>закончился</b>: yesterday, last year</td></tr>
<tr><td>I've drunk three coffees today.</td><td>I drank three coffees yesterday.</td></tr>
<tr><td>Человек жив / ситуация продолжается</td><td>Человек умер / ситуация в прошлом</td></tr>
<tr><td>He's written five books.</td><td>Shakespeare wrote many plays.</td></tr>
</table>
<div class="warn">⚠️ Никогда не ставь Present Perfect с точным прошлым временем: <s>I have seen him yesterday</s> → I <b>saw</b> him yesterday.</div>
<p>Типичный диалог: начинаем с Perfect (новость/опыт), продолжаем Past Simple (детали):</p>
<ul class="exs">
<li><b>— Have you ever been to Japan? — Yes, I went there in 2018.</b><span>— Был когда-нибудь в Японии? — Да, ездил в 2018-м.</span></li>
<li><b>— I've lost my wallet! — Where did you last see it?</b><span>— Я потерял кошелёк! — Где ты его последний раз видел?</span></li>
</ul>
<div class="tip">💡 Вопрос со словом <b>When?</b> почти всегда в Past Simple: <i>When did you arrive?</i> (не <s>When have you arrived?</s>).</div>
`,
quiz: [
  ["I ___ this film last Friday.", ["watched", "have watched", "watch", "had watch"], 0, "last Friday → Past Simple."],
  ["— Is Mike here? — No, he ___ out.", ["has gone", "went yesterday", "goes", "is go"], 0, "Результат сейчас."],
  ["When ___ you move here?", ["did", "have", "do", "has"], 0, "When → Past Simple."],
  ["I ___ two tests this week (неделя не кончилась).", ["'ve had", "had", "have", "'m having"], 0, "Незаконченный период."]
]});

G({ id: "pp-continuous", icon: "⏳", title: "Present Perfect Continuous", level: "B1", short: "Делаю уже какое-то время (и до сих пор)",
body: `
<div class="formula">have / has been + глагол-ing</div>
<h3>Когда используем</h3>
<ul>
<li><b>Процесс начался в прошлом и длится до сих пор</b> (акцент на длительности): I've been waiting for an hour!</li>
<li><b>Недавний процесс, следы которого видны:</b> Why are you wet? — I've been running.</li>
</ul>
<ul class="exs">
<li><b>How long have you been learning English?</b><span>Сколько ты уже учишь английский?</span></li>
<li><b>I've been trying to call you all day!</b><span>Я весь день пытаюсь тебе дозвониться!</span></li>
<li><b>Have you been crying?</b><span>Ты что, плакал?</span></li>
<li><b>What have you been up to?</b><span>Чем занимался всё это время? / Как жизнь?</span></li>
</ul>
<table class="gt">
<tr><th>Perfect Continuous — процесс</th><th>Perfect Simple — результат/количество</th></tr>
<tr><td>I've been reading your book.</td><td>I've read your book (дочитал).</td></tr>
<tr><td>She's been calling all day.</td><td>She's called five times.</td></tr>
</table>
<div class="tip">💡 Русское «Я жду уже час» = I've been waiting for an hour. Не <s>I wait for an hour</s>.</div>
<div class="movie">🎬 «What have you been up to?» — частое приветствие после разлуки. Отвечают: <i>Not much. / Same old. / Working a lot.</i></div>
`,
quiz: [
  ["I ___ here for 20 minutes!", ["'ve been waiting", "wait", "'m waiting", "waited"], 0, "Длится до сих пор."],
  ["Your eyes are red. Have you ___?", ["been crying", "cried", "cry", "crying"], 0, "Следы недавнего процесса."],
  ["She ___ three emails this morning (количество).", ["has written", "has been writing", "writes", "is writing"], 0, "Количество/результат → Perfect Simple."]
]});

G({ id: "past-perfect", icon: "⏮", title: "Past Perfect", level: "B1", short: "Прошлое в прошлом: «уже успел до того»",
body: `
<div class="formula">had + V3</div>
<p>Показывает, что одно прошлое действие было <b>раньше</b> другого прошлого.</p>
<ul class="exs">
<li><b>When I arrived, the party had already started.</b><span>Когда я пришёл, вечеринка уже началась.</span></li>
<li><b>I realized I had left my phone at home.</b><span>Я понял, что оставил телефон дома.</span></li>
<li><b>She had never seen snow before.</b><span>Она никогда раньше не видела снега.</span></li>
<li><b>I'd never been so scared in my life.</b><span>Я никогда в жизни так не боялся.</span></li>
</ul>
<table class="gt">
<tr><td>When I got home, she <b>left</b>.</td><td>Я пришёл → она ушла (после).</td></tr>
<tr><td>When I got home, she <b>had left</b>.</td><td>Она ушла ещё до моего прихода.</td></tr>
</table>
<div class="tip">💡 «'d» может быть и had, и would: <i>I'd seen</i> = I had seen; <i>I'd see</i> = I would see. Смотри на форму глагола после.</div>
<div class="tip">💡 Если порядок понятен из before/after, Past Perfect не обязателен: <i>I locked the door before I left.</i></div>
<div class="movie">🎬 Часто встречается в пересказах и закадровом голосе: <i>By the time the cops arrived, he had disappeared.</i></div>
`,
quiz: [
  ["The train ___ when we got to the station.", ["had left", "has left", "leaves", "was leave"], 0, "Ушёл раньше нашего прихода."],
  ["I'd ___ him before that day.", ["never met", "never meet", "never meeting", "met never"], 0, "had + V3."],
  ["«I'd forgotten» означает:", ["I had forgotten", "I would forgotten", "I did forget", "I have forgotten"], 0, "'d + V3 = had."]
]});

G({ id: "future", icon: "🔮", title: "Будущее: will, going to, Present Continuous", level: "A2", short: "Три способа сказать о будущем",
body: `
<table class="gt">
<tr><th>Форма</th><th>Когда</th><th>Пример</th></tr>
<tr><td><b>will</b> + глагол</td><td>Решение <b>в момент речи</b>, обещание, предложение, прогноз-мнение</td><td>I'll get it! (о звонке в дверь)<br>I'll call you.<br>I think it'll rain.</td></tr>
<tr><td><b>be going to</b> + глагол</td><td><b>Намерение</b>, решённое заранее; прогноз по признакам</td><td>I'm going to quit my job.<br>Look at the sky — it's going to rain.</td></tr>
<tr><td><b>Present Continuous</b></td><td><b>Договорённость</b>: есть время, место, люди</td><td>I'm meeting Sarah at 7.</td></tr>
<tr><td><b>Present Simple</b></td><td>Расписание</td><td>The movie starts at 9.</td></tr>
</table>
<ul class="exs">
<li><b>I'll be back.</b><span>Я вернусь.</span></li>
<li><b>I'm gonna kill him!</b><span>Я его убью! (gonna = going to)</span></li>
<li><b>Don't worry, I won't tell anyone.</b><span>Не волнуйся, никому не скажу. (won't = will not)</span></li>
<li><b>It's gonna be okay.</b><span>Всё будет хорошо.</span></li>
<li><b>Shall we go?</b><span>Пойдём? (shall — предложение, в основном UK)</span></li>
</ul>
<div class="warn">⚠️ После when / if / until / as soon as будущее выражается <b>настоящим</b>: <s>When I will come</s> → When I <b>come</b> home, I'll call you.</div>
<h3>Future Continuous и Future Perfect (кратко)</h3>
<ul class="exs">
<li><b>This time tomorrow I'll be lying on the beach.</b><span>Завтра в это время я буду лежать на пляже.</span></li>
<li><b>I'll have finished by Friday.</b><span>Я закончу к пятнице.</span></li>
</ul>
<div class="movie">🎬 <i>gonna</i> — 90% «будущего» в фильмах. <i>I'm gonna…</i> произносят как «Аймана»: <i>I'mma head out</i> = I'm going to leave.</div>
`,
quiz: [
  ["The phone's ringing! — I ___ get it.", ["'ll", "'m going to", "'m getting", "get"], 0, "Решение в момент речи."],
  ["I've decided. I ___ buy a car.", ["'m going to", "'ll", "buy", "will to"], 0, "Заранее принятое решение."],
  ["Call me when you ___.", ["arrive", "will arrive", "'ll arrive", "arriving"], 0, "После when — Present Simple."],
  ["Watch out! You ___ fall!", ["'re going to", "will to", "fall", "are fall"], 0, "Прогноз по признакам."]
]});
