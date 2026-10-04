// Грамматика, часть 2: условные, модальные, залог, артикли и т.д.
G({ id: "conditionals", icon: "🔀", title: "Условные предложения (if)", level: "B1", short: "Типы 0, 1, 2, 3 и смешанный",
body: `
<table class="gt">
<tr><th>Тип</th><th>Смысл</th><th>If-часть</th><th>Главная часть</th></tr>
<tr><td><b>0</b></td><td>Всегда так (факт)</td><td>Present</td><td>Present</td></tr>
<tr><td><b>1</b></td><td>Реально в будущем</td><td>Present</td><td>will + глагол</td></tr>
<tr><td><b>2</b></td><td>Нереально сейчас / маловероятно</td><td>Past</td><td>would + глагол</td></tr>
<tr><td><b>3</b></td><td>Нереально в прошлом (сожаление)</td><td>Past Perfect</td><td>would have + V3</td></tr>
</table>
<h3>0 — факты</h3>
<ul class="exs"><li><b>If you heat ice, it melts.</b><span>Если нагреть лёд, он тает.</span></li></ul>
<h3>1 — реальное будущее</h3>
<ul class="exs">
<li><b>If you touch her, I'll kill you.</b><span>Тронешь её — убью.</span></li>
<li><b>If it rains, we'll stay home.</b><span>Если пойдёт дождь, останемся дома.</span></li>
</ul>
<div class="warn">⚠️ В if-части не ставим will: <s>If it will rain</s> → If it <b>rains</b>.</div>
<h3>2 — воображаемое настоящее</h3>
<ul class="exs">
<li><b>If I had a million dollars, I'd buy an island.</b><span>Если бы у меня был миллион, я бы купил остров.</span></li>
<li><b>If I were you, I wouldn't do that.</b><span>На твоём месте я бы этого не делал.</span></li>
<li><b>What would you do if you saw a ghost?</b><span>Что бы ты сделал, если бы увидел призрака?</span></li>
</ul>
<div class="tip">💡 <b>If I were you</b> — устойчивая фраза для совета. Were для всех лиц (в речи бывает и «if I was»).</div>
<h3>3 — нереальное прошлое</h3>
<ul class="exs">
<li><b>If I had known, I would have come.</b><span>Если бы я знал, я бы пришёл.</span></li>
<li><b>If you hadn't called, I would have died.</b><span>Если бы ты не позвонил, я бы погиб.</span></li>
</ul>
<h3>Смешанный тип</h3>
<ul class="exs"><li><b>If I had taken that job, I would be rich now.</b><span>Если бы я тогда взял ту работу, сейчас был бы богат.</span></li></ul>
<h3>Unless, as long as, in case</h3>
<ul class="exs">
<li><b>Don't call unless it's urgent.</b><span>Не звони, если только не срочно. (unless = if not)</span></li>
<li><b>Take an umbrella in case it rains.</b><span>Возьми зонт на случай дождя.</span></li>
</ul>
<div class="movie">🎬 В речи: <i>I would've</i> звучит как «I woulda», <i>could've</i> — «coulda», <i>should've</i> — «shoulda»: <i>I shoulda known!</i> — Мог бы и догадаться! Никогда не пиши «would of» — это ошибка носителей.</div>
`,
quiz: [
  ["If you ___ late again, you're fired.", ["are", "will be", "were", "would be"], 0, "Тип 1: if + Present."],
  ["If I ___ you, I'd apologize.", ["were", "am", "will be", "have been"], 0, "If I were you."],
  ["If she had asked me, I ___ her.", ["would have helped", "would help", "will help", "helped"], 0, "Тип 3."],
  ["I'd travel more if I ___ more money.", ["had", "have", "will have", "would have"], 0, "Тип 2: if + Past."]
]});

G({ id: "modals", icon: "🛠", title: "Модальные глаголы", level: "B1", short: "can, could, must, have to, should, might…",
body: `
<p>Модальные глаголы не меняются по лицам (he <b>can</b>, не <s>cans</s>), после них глагол без to (кроме have to, ought to), вопрос и отрицание без do.</p>
<table class="gt">
<tr><th>Глагол</th><th>Значение</th><th>Пример</th></tr>
<tr><td><b>can / can't</b></td><td>умею, могу, можно</td><td>Can I come in? I can't swim.</td></tr>
<tr><td><b>could</b></td><td>мог (в прошлом); вежливая просьба; возможно</td><td>Could you help me? It could be a trap.</td></tr>
<tr><td><b>must</b></td><td>должен (моё убеждение); наверняка</td><td>I must go. You must be tired.</td></tr>
<tr><td><b>have to</b></td><td>приходится (обстоятельства)</td><td>I have to work tomorrow.</td></tr>
<tr><td><b>mustn't</b></td><td>нельзя!</td><td>You mustn't tell anyone.</td></tr>
<tr><td><b>don't have to</b></td><td>не обязательно</td><td>You don't have to come.</td></tr>
<tr><td><b>should</b></td><td>следует, стоит (совет)</td><td>You should see a doctor.</td></tr>
<tr><td><b>might / may</b></td><td>может быть (не уверен)</td><td>I might be late.</td></tr>
<tr><td><b>would</b></td><td>бы; вежливость</td><td>Would you like a drink?</td></tr>
</table>
<div class="warn">⚠️ Главная ловушка: <b>mustn't</b> = нельзя, а <b>don't have to</b> = не обязательно. Не путай!</div>
<h3>Догадки о прошлом: модальный + have + V3</h3>
<ul class="exs">
<li><b>You should have told me!</b><span>Ты должен был мне сказать! (упрёк)</span></li>
<li><b>He must have forgotten.</b><span>Он, должно быть, забыл.</span></li>
<li><b>It could have been worse.</b><span>Могло быть и хуже.</span></li>
<li><b>She can't have done it.</b><span>Не может быть, чтобы это сделала она.</span></li>
<li><b>I might have left it in the car.</b><span>Может, я оставил это в машине.</span></li>
</ul>
<div class="movie">🎬 <i>gotta</i> = have got to = have to: <i>I gotta go.</i> <i>You gotta be kidding me.</i> А <i>had better</i> («you'd better») — совет с угрозой: <i>You'd better run.</i></div>
`,
quiz: [
  ["You ___ smoke here. It's forbidden.", ["mustn't", "don't have to", "shouldn't have", "can"], 0, "Запрет."],
  ["Tomorrow is Sunday. I ___ get up early.", ["don't have to", "mustn't", "can't", "shouldn't to"], 0, "Не обязательно."],
  ["He's not answering. He ___ be asleep.", ["must", "should", "has to", "can"], 0, "Уверенная догадка."],
  ["You ___ told me earlier! (упрёк)", ["should have", "should", "must", "had"], 0, "Упрёк о прошлом: should have + V3."]
]});

G({ id: "passive", icon: "🔄", title: "Пассивный залог", level: "B1", short: "Когда важно действие, а не кто его сделал",
body: `
<div class="formula">be (в нужном времени) + V3</div>
<table class="gt">
<tr><th>Время</th><th>Активный</th><th>Пассивный</th></tr>
<tr><td>Present Simple</td><td>They make phones in China.</td><td>Phones <b>are made</b> in China.</td></tr>
<tr><td>Past Simple</td><td>Someone stole my bike.</td><td>My bike <b>was stolen</b>.</td></tr>
<tr><td>Present Perfect</td><td>They've fired him.</td><td>He'<b>s been fired</b>.</td></tr>
<tr><td>Future</td><td>They will arrest him.</td><td>He <b>will be arrested</b>.</td></tr>
<tr><td>Continuous</td><td>They're watching us.</td><td>We'<b>re being watched</b>.</td></tr>
</table>
<ul class="exs">
<li><b>I was born in 1998.</b><span>Я родился в 1998-м. (по-английски «родиться» — всегда пассив)</span></li>
<li><b>We've been robbed!</b><span>Нас ограбили!</span></li>
<li><b>He got fired.</b><span>Его уволили. (get вместо be — разговорно)</span></li>
<li><b>You're under arrest. You'll be taken to the station.</b><span>Вы арестованы. Вас доставят в участок.</span></li>
</ul>
<div class="tip">💡 Исполнителя добавляют через <b>by</b>: <i>The movie was directed by Nolan.</i></div>
<div class="tip">💡 Русские безличные «Говорят…», «Сообщают…» = <i>It is said…</i>, <i>He is said to be rich.</i></div>
<div class="movie">🎬 <i>get</i>-пассив очень разговорный и часто про неприятности: <i>get caught</i> (попасться), <i>get dumped</i> (быть брошенным), <i>get killed</i>, <i>get hurt</i>.</div>
`,
quiz: [
  ["My car ___ last night.", ["was stolen", "stole", "is stealing", "has stole"], 0, "Past Simple passive."],
  ["Where ___ you born?", ["were", "did", "have", "are"], 0, "Be born — пассив."],
  ["The bridge ___ right now.", ["is being repaired", "is repaired", "repairs", "was repair"], 0, "Сейчас → being + V3."]
]});

G({ id: "reported", icon: "🗣", title: "Косвенная речь", level: "B1", short: "Он сказал, что… — сдвиг времён",
body: `
<p>Когда пересказываем чужие слова после <b>said / told</b> (прошлое), время обычно «сдвигается на шаг назад».</p>
<table class="gt">
<tr><th>Прямая речь</th><th>Косвенная</th></tr>
<tr><td>"I <b>am</b> tired."</td><td>She said (that) she <b>was</b> tired.</td></tr>
<tr><td>"I <b>love</b> you."</td><td>He said he <b>loved</b> me.</td></tr>
<tr><td>"I <b>will</b> call."</td><td>He said he <b>would</b> call.</td></tr>
<tr><td>"I <b>saw</b> it."</td><td>She said she <b>had seen</b> it.</td></tr>
<tr><td>"I <b>can</b> help."</td><td>He said he <b>could</b> help.</td></tr>
</table>
<div class="warn">⚠️ <b>tell</b> требует, кому: <i>He told <b>me</b> that…</i>; <b>say</b> — без: <i>He said that…</i> (<s>He said me</s> — ошибка).</div>
<h3>Вопросы и просьбы</h3>
<ul class="exs">
<li><b>She asked where I lived.</b><span>Она спросила, где я живу. (прямой порядок, без do!)</span></li>
<li><b>He asked if I was okay.</b><span>Он спросил, в порядке ли я.</span></li>
<li><b>Mom told me to clean my room.</b><span>Мама сказала мне убрать комнату.</span></li>
<li><b>I told you not to touch it!</b><span>Я же сказал тебе это не трогать!</span></li>
</ul>
<div class="tip">💡 Если факт до сих пор верен, время можно не сдвигать: <i>He said he lives in Moscow.</i></div>
<div class="movie">🎬 В разговоре пересказывают через <i>like</i> и <i>go</i>: <i>And she's like, "No way!" and I go, "Yes way!"</i></div>
`,
quiz: [
  ["He ___ me that he was busy.", ["told", "said", "spoke", "talked"], 0, "tell + кому."],
  ["She asked me where ___.", ["I worked", "did I work", "do I work", "I do work"], 0, "Прямой порядок слов."],
  ["\"I'll be late.\" → He said he ___ late.", ["would be", "will be", "is", "was being"], 0, "will → would."]
]});

G({ id: "articles", icon: "🅰️", title: "Артикли a / an / the", level: "A2", short: "Самое непривычное для русских",
body: `
<h3>a / an — «какой-то, один из»</h3>
<ul>
<li>Впервые упоминаем исчисляемое в ед. числе: <i>I saw <b>a</b> dog.</i></li>
<li>Профессия, кто он: <i>She's <b>a</b> doctor. He's <b>an</b> idiot.</i></li>
<li><b>an</b> — перед гласным <i>звуком</i>: an apple, an hour (h не читается), но a university [ju:].</li>
</ul>
<h3>the — «тот самый, конкретный»</h3>
<ul>
<li>Уже упоминали: <i>I saw a dog. <b>The</b> dog was huge.</i></li>
<li>Понятно, о чём речь: <i>Close <b>the</b> door. Where's <b>the</b> remote?</i></li>
<li>Единственное в своём роде: the sun, the internet, the police.</li>
<li>Превосходная степень: <i>the best, the worst</i>.</li>
</ul>
<h3>Без артикля</h3>
<ul>
<li>Общие понятия во мн. числе и неисчисляемые: <i>I hate spiders. Money isn't everything. Love is blind.</i></li>
<li>Имена, большинство стран и городов: <i>John, Russia, London</i> (но <i>the USA, the UK</i>).</li>
<li>Устойчивые: go to bed, at home, at work, go to school, by car, have breakfast.</li>
</ul>
<ul class="exs">
<li><b>It's not a big deal.</b><span>Ничего страшного.</span></li>
<li><b>What's the point?</b><span>Какой смысл?</span></li>
<li><b>Call the police!</b><span>Вызывай полицию!</span></li>
<li><b>He's such an asshole.</b><span>Он такой мудак. (such a/an + сущ.)</span></li>
</ul>
<div class="tip">💡 Правило-подсказка: спроси себя «какой именно?». Если собеседник поймёт, какой именно — the. Если любой/один из — a.</div>
<div class="warn">⚠️ <s>I am student</s> → I'm <b>a</b> student. <s>I like the music</s> (вообще) → I like music.</div>
`,
quiz: [
  ["She's ___ engineer.", ["an", "a", "the", "—"], 0, "Профессия + гласный звук."],
  ["Can you pass me ___ salt?", ["the", "a", "an", "—"], 0, "Конкретная солонка на столе."],
  ["I love ___ dogs. (вообще)", ["—", "the", "a", "an"], 0, "Общее понятие во мн. числе."],
  ["It took ___ hour.", ["an", "a", "the", "—"], 0, "hour — h не читается."]
]});

G({ id: "quantifiers", icon: "🔢", title: "Some / any, much / many, a lot", level: "A2", short: "Исчисляемые и неисчисляемые",
body: `
<p><b>Исчисляемые</b> — можно посчитать: a car, two cars. <b>Неисчисляемые</b> — нельзя: water, money, time, advice, information, news, furniture, hair.</p>
<table class="gt">
<tr><th></th><th>Исчисляемые (мн.ч.)</th><th>Неисчисляемые</th></tr>
<tr><td>много</td><td><b>many</b> friends</td><td><b>much</b> time</td></tr>
<tr><td>много (в речи)</td><td colspan="2"><b>a lot of / lots of</b> — подходит везде</td></tr>
<tr><td>мало</td><td><b>few</b> people</td><td><b>little</b> money</td></tr>
<tr><td>немного</td><td><b>a few</b> people</td><td><b>a little</b> money</td></tr>
<tr><td>сколько?</td><td><b>How many</b> beers?</td><td><b>How much</b> money?</td></tr>
</table>
<div class="tip">💡 much и many звучат книжно в утверждениях. В речи: <i>I have <b>a lot of</b> work</i>, но в вопросах и отрицаниях норм: <i>I don't have much time.</i></div>
<div class="tip">💡 few — мало (плохо), a few — несколько (хватит): <i>I have few friends</i> 😢 / <i>I have a few friends</i> 🙂</div>
<h3>some / any / no</h3>
<ul>
<li><b>some</b> — в утверждениях и в предложениях/просьбах: <i>I need some help. Want some coffee?</i></li>
<li><b>any</b> — в вопросах и отрицаниях: <i>Do you have any money? I don't have any.</i></li>
<li><b>any</b> в утверждении = «любой»: <i>Call me any time.</i></li>
<li><b>no</b> = not any: <i>I have no idea.</i></li>
</ul>
<ul class="exs">
<li><b>I have no idea.</b><span>Понятия не имею.</span></li>
<li><b>How much is it?</b><span>Сколько стоит?</span></li>
<li><b>Can I give you some advice?</b><span>Можно дам совет? (advice — неисчисляемое, без s!)</span></li>
</ul>
<div class="warn">⚠️ <s>informations, advices, news is…</s> → information, advice, news <b>is</b> (единственное число).</div>
`,
quiz: [
  ["How ___ money do you need?", ["much", "many", "lot", "few"], 0, "Money — неисчисляемое."],
  ["There aren't ___ eggs left.", ["any", "some", "no", "much"], 0, "Отрицание → any."],
  ["She gave me some good ___.", ["advice", "advices", "an advice", "advises"], 0, "Advice — неисчисляемое."],
  ["I've got ___ friends here, so I'm not lonely.", ["a few", "few", "a little", "little"], 0, "a few = несколько (достаточно)."]
]});

G({ id: "comparison", icon: "📏", title: "Сравнение: bigger, the best", level: "A2", short: "Сравнительная и превосходная степень",
body: `
<table class="gt">
<tr><th>Прилагательное</th><th>Сравнительная</th><th>Превосходная</th></tr>
<tr><td>Короткое: cheap</td><td>cheap<b>er</b> (than)</td><td><b>the</b> cheap<b>est</b></td></tr>
<tr><td>На -y: easy</td><td>eas<b>ier</b></td><td>the eas<b>iest</b></td></tr>
<tr><td>Удвоение: big</td><td>bi<b>gg</b>er</td><td>the bi<b>gg</b>est</td></tr>
<tr><td>Длинное: expensive</td><td><b>more</b> expensive</td><td><b>the most</b> expensive</td></tr>
<tr><td>good</td><td><b>better</b></td><td><b>the best</b></td></tr>
<tr><td>bad</td><td><b>worse</b></td><td><b>the worst</b></td></tr>
<tr><td>far</td><td><b>further / farther</b></td><td>the furthest</td></tr>
</table>
<ul class="exs">
<li><b>Better late than never.</b><span>Лучше поздно, чем никогда.</span></li>
<li><b>This is the worst day of my life.</b><span>Это худший день в моей жизни.</span></li>
<li><b>She's way smarter than you.</b><span>Она намного умнее тебя. (way / much / a lot = намного)</span></li>
<li><b>The sooner, the better.</b><span>Чем скорее, тем лучше.</span></li>
<li><b>He's not as dumb as he looks.</b><span>Он не так глуп, как выглядит.</span></li>
<li><b>It's getting worse and worse.</b><span>Становится всё хуже и хуже.</span></li>
</ul>
<div class="warn">⚠️ <s>more better</s>, <s>more easier</s> — двойное сравнение = ошибка.</div>
<div class="movie">🎬 <i>than me</i> в речи нормально: <i>He's taller than me</i> (книжно — than I am).</div>
`,
quiz: [
  ["This movie is ___ than the first one.", ["worse", "badder", "more bad", "the worst"], 0, "bad → worse."],
  ["It's the ___ expensive restaurant in town.", ["most", "more", "much", "very"], 0, "Длинное прилагательное → the most."],
  ["She's ___ taller than her brother.", ["way", "very", "more", "most"], 0, "way = намного."]
]});

G({ id: "gerund-inf", icon: "🔗", title: "Герундий или инфинитив", level: "B1", short: "I enjoy doing / I want to do",
body: `
<h3>Глагол + -ing</h3>
<p>enjoy, mind, avoid, finish, keep, suggest, can't stand, can't help, quit, miss, practice, consider, feel like, look forward to</p>
<ul class="exs">
<li><b>I can't stand waiting.</b><span>Терпеть не могу ждать.</span></li>
<li><b>Do you mind closing the window?</b><span>Не против закрыть окно?</span></li>
<li><b>Keep going!</b><span>Продолжай!</span></li>
<li><b>I'm looking forward to seeing you.</b><span>Жду встречи. (to здесь — предлог, поэтому -ing!)</span></li>
</ul>
<h3>Глагол + to + инфинитив</h3>
<p>want, need, decide, hope, plan, promise, refuse, agree, learn, manage, pretend, afford, seem, would like</p>
<ul class="exs">
<li><b>I want to go home.</b><span>Я хочу домой.</span></li>
<li><b>He pretended to be asleep.</b><span>Он притворился спящим.</span></li>
<li><b>We can't afford to lose.</b><span>Мы не можем позволить себе проиграть.</span></li>
</ul>
<h3>Меняется смысл</h3>
<table class="gt">
<tr><td><b>stop doing</b> — перестать</td><td>Stop smoking! — Брось курить!</td></tr>
<tr><td><b>stop to do</b> — остановиться, чтобы</td><td>He stopped to smoke. — Он остановился покурить.</td></tr>
<tr><td><b>remember doing</b> — помнить, что делал</td><td>I remember meeting her.</td></tr>
<tr><td><b>remember to do</b> — не забыть сделать</td><td>Remember to lock the door.</td></tr>
<tr><td><b>try doing</b> — попробовать (как вариант)</td><td>Try restarting it.</td></tr>
<tr><td><b>try to do</b> — постараться</td><td>I tried to call you.</td></tr>
</table>
<div class="tip">💡 После предлогов всегда -ing: <i>thanks for coming, good at cooking, instead of working, before leaving</i>.</div>
<div class="tip">💡 После let / make / help и модальных — глагол без to: <i>Let me go. Don't make me laugh.</i></div>
`,
quiz: [
  ["I enjoy ___ to music.", ["listening", "to listen", "listen", "listened"], 0, "enjoy + -ing."],
  ["We decided ___ a taxi.", ["to take", "taking", "take", "took"], 0, "decide + to."],
  ["I'm looking forward to ___ you.", ["seeing", "see", "to see", "saw"], 0, "look forward to + -ing."],
  ["He stopped ___ — he quit last year.", ["smoking", "to smoke", "smoke", "smoked"], 0, "Перестал курить."]
]});

G({ id: "used-to", icon: "🕰", title: "Used to / be used to / get used to", level: "B1", short: "Раньше / привык / привыкаю",
body: `
<table class="gt">
<tr><th>Конструкция</th><th>Значение</th><th>Пример</th></tr>
<tr><td><b>used to</b> + глагол</td><td>раньше (а теперь нет)</td><td>I used to smoke. — Я раньше курил.</td></tr>
<tr><td><b>be used to</b> + сущ./-ing</td><td>привык (уже)</td><td>I'm used to it. — Я привык.</td></tr>
<tr><td><b>get used to</b> + сущ./-ing</td><td>привыкать (процесс)</td><td>You'll get used to it. — Привыкнешь.</td></tr>
<tr><td><b>would</b> + глагол</td><td>бывало (повторялось в прошлом)</td><td>Grandpa would tell us stories.</td></tr>
</table>
<ul class="exs">
<li><b>We used to be friends.</b><span>Мы когда-то были друзьями.</span></li>
<li><b>Did you use to live here?</b><span>Ты раньше здесь жил? (в вопросе — use без d)</span></li>
<li><b>I'm not used to getting up early.</b><span>Я не привык рано вставать.</span></li>
<li><b>Don't worry, you'll get used to it.</b><span>Не переживай, привыкнешь.</span></li>
</ul>
<div class="warn">⚠️ <s>I use to smoke</s> (о прошлом) → I <b>used</b> to smoke. Для настоящих привычек — просто Present Simple: <i>I usually smoke after lunch.</i></div>
<div class="tip">💡 Would для «бывало» — только о действиях, не о состояниях: <s>I would live in Paris</s> → I used to live in Paris.</div>
`,
quiz: [
  ["I ___ play football, but now I don't.", ["used to", "am used to", "use to", "get used to"], 0, "Раньше, а теперь нет."],
  ["It's hard, but I'm ___ it.", ["used to", "use to", "using to", "used"], 0, "be used to — привык."],
  ["You'll soon get used to ___ on the left.", ["driving", "drive", "drove", "to drive"], 0, "get used to + -ing."]
]});

G({ id: "tags", icon: "🏷", title: "Хвостики и короткие ответы", level: "B1", short: "isn't it? / So do I / Neither can I",
body: `
<h3>Question tags — «да? / не так ли?»</h3>
<div class="formula">утверждение + отрицательный хвост / отрицание + положительный хвост</div>
<ul class="exs">
<li><b>It's cold, isn't it?</b><span>Холодно, да?</span></li>
<li><b>You didn't tell him, did you?</b><span>Ты ведь ему не сказал?</span></li>
<li><b>She can drive, can't she?</b><span>Она же умеет водить?</span></li>
<li><b>Let's go, shall we?</b><span>Пойдём, а?</span></li>
<li><b>I'm right, aren't I?</b><span>Я ведь прав? (I am → aren't I)</span></li>
</ul>
<h3>Короткие ответы</h3>
<p>Не отвечают просто «Yes» — повторяют вспомогательный глагол:</p>
<ul class="exs">
<li><b>— Do you like it? — Yes, I do. / No, I don't.</b><span>— Нравится? — Да. / Нет.</span></li>
<li><b>— Are you coming? — Yeah, I am.</b><span>— Идёшь? — Ага.</span></li>
</ul>
<h3>Я тоже / я тоже нет</h3>
<table class="gt">
<tr><td>I love pizza. — <b>So do I.</b> / <b>Me too.</b></td><td>Я тоже.</td></tr>
<tr><td>I can't swim. — <b>Neither can I.</b> / <b>Me neither.</b></td><td>Я тоже нет.</td></tr>
<tr><td>I was there. — <b>So was I.</b></td><td>Я тоже был.</td></tr>
</table>
<h3>Эхо-вопросы — реакция «Да ну?»</h3>
<ul class="exs"><li><b>— I'm getting married. — Are you? Congrats!</b><span>— Я женюсь. — Правда? Поздравляю!</span></li>
<li><b>— I've quit my job. — Have you? Why?</b><span>— Я уволился. — Да ты что? Почему?</span></li></ul>
<div class="movie">🎬 Британцы обожают хвостики. В разговорном UK — <i>innit</i> для всего: <i>Nice, innit?</i>. Американцы чаще говорят <i>right?</i>: <i>You're coming, right?</i></div>
`,
quiz: [
  ["You're from Spain, ___?", ["aren't you", "are you", "don't you", "isn't it"], 0, "Утверждение → отрицательный хвост."],
  ["— I don't like coffee. — ___", ["Neither do I.", "So do I.", "Me too.", "So don't I."], 0, "Согласие с отрицанием."],
  ["He didn't call, ___?", ["did he", "didn't he", "does he", "was he"], 0, "Отрицание → положительный хвост."]
]});

G({ id: "relative", icon: "👉", title: "Who, which, that, where", level: "B1", short: "Придаточные «который»",
body: `
<table class="gt">
<tr><td><b>who</b></td><td>о людях</td><td>The guy who called you is here.</td></tr>
<tr><td><b>which</b></td><td>о предметах</td><td>The car which he bought is red.</td></tr>
<tr><td><b>that</b></td><td>о людях и предметах (разговорно)</td><td>The movie that we saw was great.</td></tr>
<tr><td><b>where</b></td><td>о месте</td><td>The bar where we met.</td></tr>
<tr><td><b>whose</b></td><td>чей</td><td>The girl whose phone I found.</td></tr>
</table>
<div class="tip">💡 Если «который» — <b>не подлежащее</b> в придаточном, его можно выбросить. Так говорят постоянно: <i>The movie (that) we saw. The girl (who) I like. Everything (that) you need.</i></div>
<ul class="exs">
<li><b>That's the guy I told you about.</b><span>Это тот парень, о котором я тебе рассказывал.</span></li>
<li><b>Is there anything I can do?</b><span>Я могу чем-то помочь?</span></li>
<li><b>He's the one who did it.</b><span>Это он сделал.</span></li>
<li><b>What I need is a drink.</b><span>Что мне нужно — так это выпить.</span></li>
</ul>
<div class="warn">⚠️ Предлог уходит в конец: <i>The guy I was talking <b>to</b>. The place I come <b>from</b>.</i> (Книжно: to whom, from which.)</div>
<div class="tip">💡 Через запятую (доп. информация) — только who/which, не that: <i>My brother, who lives in Paris, is coming.</i></div>
`,
quiz: [
  ["The woman ___ lives next door is a cop.", ["who", "which", "where", "whose"], 0, "О человеке-подлежащем."],
  ["This is the hotel ___ we stayed.", ["where", "which", "who", "what"], 0, "Место."],
  ["Выбери естественный вариант:", ["The movie we saw was boring.", "The movie what we saw was boring.", "The movie who we saw was boring.", "The movie we saw it was boring."], 0, "that можно опустить."]
]});

G({ id: "prepositions", icon: "📍", title: "Предлоги in / on / at", level: "A2", short: "Время и место",
body: `
<h3>Время</h3>
<table class="gt">
<tr><td><b>at</b></td><td>точное время, праздники-моменты</td><td>at 5 o'clock, at night, at the weekend (UK), at Christmas</td></tr>
<tr><td><b>on</b></td><td>дни и даты</td><td>on Monday, on May 5th, on my birthday, on the weekend (US)</td></tr>
<tr><td><b>in</b></td><td>месяцы, годы, сезоны, части дня</td><td>in May, in 2020, in summer, in the morning</td></tr>
<tr><td><b>in</b> + срок</td><td>через (в будущем)</td><td>I'll be there in 5 minutes.</td></tr>
</table>
<div class="warn">⚠️ Перед this / next / last / every предлог не нужен: <i>See you next week. I saw him last Friday.</i></div>
<h3>Место</h3>
<table class="gt">
<tr><td><b>at</b></td><td>точка, место-событие</td><td>at home, at work, at the bus stop, at a party</td></tr>
<tr><td><b>on</b></td><td>поверхность, линия</td><td>on the table, on the wall, on the bus, on the street (US)</td></tr>
<tr><td><b>in</b></td><td>внутри, в пространстве</td><td>in the car, in London, in bed, in the kitchen</td></tr>
</table>
<ul class="exs">
<li><b>I'm on my way.</b><span>Я уже в пути.</span></li>
<li><b>See you in a bit.</b><span>Скоро увидимся.</span></li>
<li><b>He's at work.</b><span>Он на работе.</span></li>
<li><b>Get in the car!</b><span>Садись в машину! (in the car, но on the bus/train/plane)</span></li>
</ul>
<div class="tip">💡 Транспорт: <i>in</i> — где нельзя стоять (car, taxi), <i>on</i> — где можно встать и пройти (bus, train, plane, ship). Способ передвижения — <i>by car, by bus</i>, но <i>on foot</i>.</div>
`,
quiz: [
  ["The meeting is ___ Monday.", ["on", "in", "at", "—"], 0, "Дни → on."],
  ["I'll call you ___ 10 minutes.", ["in", "after", "at", "on"], 0, "in + срок = через."],
  ["She's not here, she's ___ work.", ["at", "in", "on", "to"], 0, "at work."],
  ["We met ___ 2019.", ["in", "on", "at", "—"], 0, "Год → in."]
]});

G({ id: "wish", icon: "🌠", title: "Wish, if only, I'd rather, it's time", level: "B2", short: "Сожаления и желания",
body: `
<table class="gt">
<tr><th>Конструкция</th><th>Смысл</th><th>Пример</th></tr>
<tr><td>wish + Past</td><td>жаль, что сейчас не так</td><td>I wish I knew. — Жаль, что не знаю.</td></tr>
<tr><td>wish + Past Perfect</td><td>жаль, что тогда…</td><td>I wish I hadn't said that. — Зря я это сказал.</td></tr>
<tr><td>wish + would</td><td>хочу, чтобы (кто-то) перестал/сделал — раздражение</td><td>I wish you would shut up. — Да замолчи ты уже.</td></tr>
<tr><td>if only</td><td>то же, что wish, но эмоциональнее</td><td>If only I had more time!</td></tr>
<tr><td>I'd rather + глагол</td><td>я бы предпочёл</td><td>I'd rather stay home.</td></tr>
<tr><td>I'd rather you + Past</td><td>я бы предпочёл, чтобы ты</td><td>I'd rather you didn't smoke here.</td></tr>
<tr><td>it's (about / high) time + Past</td><td>давно пора</td><td>It's time you got a job.</td></tr>
</table>
<ul class="exs">
<li><b>I wish you were here.</b><span>Жаль, что тебя нет рядом.</span></li>
<li><b>I wish I could help.</b><span>Хотел бы я помочь, но не могу.</span></li>
<li><b>I'd rather not talk about it.</b><span>Я бы не хотел об этом говорить.</span></li>
<li><b>It's about time!</b><span>Давно пора! / Ну наконец-то!</span></li>
</ul>
<div class="warn">⚠️ Русское «Хочу, чтобы ты пришёл» — это не wish, а <i>I want you to come</i>. Wish — про нереальное.</div>
`,
quiz: [
  ["I wish I ___ taller.", ["were", "am", "will be", "be"], 0, "wish + Past (were)."],
  ["I wish I ___ him. He's an idiot. (о прошлом)", ["hadn't married", "didn't marry", "don't marry", "wouldn't marry"], 0, "Сожаление о прошлом."],
  ["I'd rather ___ a taxi.", ["take", "to take", "taking", "took"], 0, "I'd rather + глагол без to."]
]});

G({ id: "spoken", icon: "🎧", title: "Как на самом деле говорят носители", level: "B1", short: "Ключ к фильмам и сериалам",
body: `
<p>В учебниках — полные формы. В фильмах — сокращения, проглоченные слова и «неправильная» грамматика. Эта тема — главный ключ к пониманию на слух.</p>
<h3>1. Слитные формы</h3>
<table class="gt">
<tr><td>gonna</td><td>going to</td><td>I'm gonna win.</td></tr>
<tr><td>wanna</td><td>want to / want a</td><td>Wanna go? Wanna beer?</td></tr>
<tr><td>gotta</td><td>(have) got to / got a</td><td>I gotta go.</td></tr>
<tr><td>hafta / hasta</td><td>have to / has to</td><td>I hafta work.</td></tr>
<tr><td>lemme / gimme</td><td>let me / give me</td><td>Lemme see. Gimme that.</td></tr>
<tr><td>kinda / sorta</td><td>kind of / sort of</td><td>I'm kinda tired.</td></tr>
<tr><td>dunno</td><td>don't know</td><td>I dunno.</td></tr>
<tr><td>whatcha / whaddya</td><td>what are you / what do you</td><td>Whatcha doing? Whaddya want?</td></tr>
<tr><td>didja / d'you</td><td>did you / do you</td><td>Didja see that?</td></tr>
<tr><td>y'all</td><td>you all</td><td>Y'all ready?</td></tr>
<tr><td>coulda / shoulda / woulda</td><td>could have / should have / would have</td><td>You shoulda told me.</td></tr>
<tr><td>outta</td><td>out of</td><td>Get outta here!</td></tr>
<tr><td>'cause / cuz</td><td>because</td><td>'Cause I said so.</td></tr>
<tr><td>ya</td><td>you</td><td>See ya!</td></tr>
</table>
<h3>2. Выброшенное начало фразы</h3>
<ul class="exs">
<li><b>You okay?</b><span>= Are you okay?</span></li>
<li><b>Want some?</b><span>= Do you want some?</span></li>
<li><b>Sounds good.</b><span>= That sounds good.</span></li>
<li><b>Got a minute?</b><span>= Have you got a minute?</span></li>
<li><b>Been there, done that.</b><span>= I've been there… Проходили.</span></li>
<li><b>Ever been to Paris?</b><span>= Have you ever been…</span></li>
</ul>
<h3>3. «Неправильная» грамматика, которую нужно понимать</h3>
<table class="gt">
<tr><td><b>ain't</b></td><td>am not / isn't / aren't / haven't</td><td>It ain't over. I ain't got time.</td></tr>
<tr><td><b>двойное отрицание</b></td><td>= одно отрицание</td><td>I don't need no help. = Мне не нужна помощь.</td></tr>
<tr><td><b>he don't</b></td><td>= he doesn't</td><td>He don't care.</td></tr>
<tr><td><b>me and him</b> как подлежащее</td><td>= he and I</td><td>Me and him went fishing.</td></tr>
<tr><td><b>was</b> для всех</td><td>= were</td><td>We was robbed!</td></tr>
<tr><td><b>them</b> вместо those</td><td>= those</td><td>Look at them shoes.</td></tr>
</table>
<div class="warn">⚠️ Понимать — обязательно, повторять в официальной речи — не стоит. Это маркер просторечия.</div>
<h3>4. Связывание звуков</h3>
<ul>
<li>Слова сливаются: <i>What are you</i> → «вадаю», <i>Did you eat?</i> → «джиит?», <i>Let me</i> → «леми».</li>
<li>T между гласными в американском звучит как быстрое «д»: <i>water</i> → «уо́дэр», <i>better</i> → «бэдэр», <i>got it</i> → «гадит».</li>
<li>T в конце часто «проглатывается»: <i>Don't</i> → «доун», <i>can't</i> → «кэн» (отличай по ударению: <i>I CAN'T</i> vs <i>I can GO</i>).</li>
</ul>
<div class="tip">💡 Совет: смотри с английскими субтитрами — так ты связываешь «каша-звук» с написанием. Потом выключай субтитры на уже знакомых сериях.</div>
`,
quiz: [
  ["«Whaddya want?» значит:", ["What do you want?", "What did you want?", "What are you want?", "Why do you want?"], 0, "whaddya = what do you."],
  ["«I ain't got no money» значит:", ["У меня нет денег", "У меня есть деньги", "Мне не нужны деньги", "Я не получил деньги"], 0, "Двойное отрицание = одно."],
  ["«You shoulda called» значит:", ["Тебе стоило позвонить", "Тебе нужно позвонить", "Ты позвонишь", "Ты позвонил"], 0, "shoulda = should have."],
  ["«Sounds good» — это сокращение от:", ["That sounds good", "It sound good", "Sound is good", "I sound good"], 0, "Выброшено подлежащее."]
]});
