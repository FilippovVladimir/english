// Фразы из личного списка (выписаны из игр и сериалов). mine: 1 — попадают в подборку «📝 Мой список».
// pat — схема употребления: как встроить фразу в предложение.
P("greet", [
  { mine: 1, en: "There you are!", ru: "Вот ты где!", t: "m", f: 5, r: "i",
    n: "Когда наконец нашёл человека, которого искал. Не путать с «Here you are» (вот, держи).",
    ex: [["There you are! I've been looking everywhere for you.", "Вот ты где! Я тебя везде искал."]] },
  { mine: 1, en: "Here I come!", ru: "Иду! / А вот и я! / Готов или нет — иду!", t: "m", f: 3, r: "i",
    n: "Предупреждение, что сейчас появишься: в прятках («Ready or not, here I come!»), перед прыжком, перед тем как ворваться.",
    ex: [["Ready or not, here I come!", "Кто не спрятался — я не виноват!"], ["Look out, London — here I come!", "Держись, Лондон, я еду!"]] }
]);

P("polite", [
  { mine: 1, en: "Here you are", ru: "Вот, пожалуйста / Держи", t: "m", f: 4, r: "n",
    n: "Когда что-то протягиваешь: деньги, документы, заказ. Варианты: «Here you go» (разговорнее), «Here».",
    ex: [["— Can I see your passport? — Here you are.", "— Можно ваш паспорт? — Вот, пожалуйста."]], alt: ["Here you go", "There you go"] },
  { mine: 1, en: "There you go", ru: "Вот, держи / Ну вот! / Вот видишь!", t: "m", f: 5, r: "i",
    n: "1) Отдаёшь что-то: «держи». 2) Человек сделал правильно: «ну вот, молодец, получилось!». 3) «Ну вот, опять» — с раздражением: «There you go again».",
    ex: [["There you go, one large coffee.", "Держи, один большой кофе."], ["There you go! You did it!", "Ну вот! У тебя получилось!"], ["There you go again, blaming me.", "Ну вот, опять ты меня обвиняешь."]] }
]);

P("react", [
  { mine: 1, en: "Perfect timing!", ru: "Как раз вовремя!", t: "m", f: 4, r: "i", pat: "perfect / good / bad timing",
    n: "Человек появился в самый нужный момент. С сарказмом — в самый неподходящий.",
    ex: [["Perfect timing! Dinner's ready.", "Как раз вовремя! Ужин готов."], ["Great timing, as always.", "Как всегда, очень вовремя. (сарказм)"]] },
  { mine: 1, en: "Is that it?", ru: "И всё? / Это всё?", t: "m", f: 4, r: "i",
    n: "Разочарование («и это всё?!») или уточнение («больше ничего?»).",
    ex: [["Is that it? I waited two hours for this?", "И всё? Я ради этого ждал два часа?"], ["— Two coffees, please. — Is that it?", "— Два кофе, пожалуйста. — Это всё?"]], alt: ["That's it?", "That's all?"] },
  { mine: 1, en: "It can't be!", ru: "Не может быть!", t: "m", f: 4, r: "n", pat: "it can't be / it couldn't be (+ кто-то/что-то)",
    n: "Неверие. «It couldn't be» — то же самое, чуть мягче или о прошлом: «It couldn't be him» — это не мог быть он.",
    ex: [["It can't be! He's dead!", "Не может быть! Он же мёртв!"], ["It couldn't be him. He was in Paris.", "Это не мог быть он. Он был в Париже."]], alt: ["No way!", "Impossible!"] },
  { mine: 1, en: "Here goes nothing", ru: "Была не была", t: "m", f: 4, r: "i", lit: "Вот ничего не идёт",
    n: "Перед рискованной попыткой, когда не уверен в успехе.",
    ex: [["Okay… here goes nothing.", "Ну… была не была."]], alt: ["Here goes", "Wish me luck"] },
  { mine: 1, en: "That's the spirit!", ru: "Вот это настрой! / Так держать!", t: "m", f: 4, r: "i", lit: "Это тот самый дух",
    n: "Похвала, когда человек решился, не сдаётся или настроен позитивно.",
    ex: [["— I'll try again tomorrow. — That's the spirit!", "— Попробую ещё раз завтра. — Вот это правильный настрой!"]] },
  { mine: 1, en: "Nice going", ru: "Молодец (чаще с сарказмом: ну ты молодец…)", t: "m", f: 4, r: "i",
    n: "Почти всегда саркастично, когда человек накосячил. Иногда — искренняя похвала.",
    ex: [["You broke it? Nice going, genius.", "Сломал? Ну ты молодец, гений."]], alt: ["Way to go", "Good job (сарказм)"] },
  { mine: 1, en: "What a pain / Such a pain", ru: "Вот морока / Как же это бесит / Зануда", t: "m", f: 4, r: "i", pat: "what a pain! · (someone) is such a pain",
    n: "О надоедливом деле или человеке. Грубее: «pain in the ass».",
    ex: [["Filling out these forms — what a pain.", "Заполнять эти анкеты — та ещё морока."], ["My little sister is such a pain.", "Моя младшая сестра такая зануда."]], alt: ["Pain in the neck", "Pain in the ass"] },
  { mine: 1, en: "That's just how it is", ru: "Такова жизнь / Так уж оно есть", t: "m", f: 4, r: "n",
    n: "Смирение с тем, что нельзя изменить.",
    ex: [["It's not fair, but that's just how it is.", "Это несправедливо, но так уж оно есть."]], alt: ["It is what it is", "That's life"] }
]);

P("agree", [
  { mine: 1, en: "You're on! / It's on!", ru: "Принято! По рукам! / Ну всё, понеслось!", t: "m", f: 3, r: "i",
    n: "«You're on!» — принимаю вызов или пари. «It's on!» — соревнование, драка или вечеринка началась.",
    ex: [["— Bet you can't beat me. — You're on!", "— Спорим, не обыграешь? — Принято!"], ["Oh, it's on now!", "Ну всё, держись!"]] },
  { mine: 1, en: "I got it / I got this", ru: "Я возьму! / Понял! / Я справлюсь", t: "m", f: 5, r: "i",
    n: "1) «I got it!» — я поймаю, я открою, я заплачу. 2) «I got it» — понял. 3) «I got this» — я справлюсь, не помогай.",
    ex: [["Don't worry, I got this.", "Не волнуйся, я справлюсь."], ["(phone rings) I got it!", "(звонит телефон) Я возьму!"], ["— Turn left at the bank. — Got it.", "— У банка налево. — Понял."]], alt: ["I've got it", "You got this"] },
  { mine: 1, en: "Good point", ru: "Верно подмечено / Справедливо", t: "m", f: 5, r: "n",
    n: "Признаёшь, что собеседник прав.",
    ex: [["— We'll need a car. — Good point.", "— Нам понадобится машина. — Точно, верно подмечено."]], alt: ["Fair point", "You have a point"] },
  { mine: 1, en: "Not in the slightest", ru: "Ничуть / Нисколько", t: "m", f: 3, r: "n", pat: "not (…) in the slightest",
    n: "Сильное «нет». Чуть книжно, часто с иронией.",
    ex: [["— Are you mad? — Not in the slightest.", "— Злишься? — Ничуть."], ["I'm not worried in the slightest.", "Я ни капли не волнуюсь."]], alt: ["Not at all", "Not one bit"] },
  { mine: 1, en: "Don't be ridiculous", ru: "Не смеши / Не говори глупостей", t: "m", f: 4, r: "n",
    ex: [["Me, scared? Don't be ridiculous.", "Мне — страшно? Не смеши."]], alt: ["Don't be silly", "Come on"] },
  { mine: 1, en: "I wouldn't have it any other way", ru: "По-другому я бы и не хотел", t: "m", f: 3, r: "n",
    n: "Тебе нравится как есть, даже если со стороны это трудно. Правильная форма — would, а не «I'm not going to have it».",
    ex: [["It's chaos with three kids, but I wouldn't have it any other way.", "С тремя детьми — хаос, но по-другому я бы и не хотел."]] },
  { mine: 1, en: "Have it your way", ru: "Как знаешь / Будь по-твоему", t: "m", f: 3, r: "i",
    n: "Уступаешь, но с недовольством: «делай как хочешь, сам потом пожалеешь».",
    ex: [["Fine, have it your way.", "Ладно, будь по-твоему."], ["Then have it your way.", "Ну тогда как знаешь."]], alt: ["Suit yourself", "Whatever you say"] }
]);

P("filler", [
  { mine: 1, en: "Meanwhile", ru: "Тем временем / А в это время", t: "d", f: 4, r: "n",
    n: "В фильмах и мемах — смена сцены: «Meanwhile, in Russia…».",
    ex: [["Meanwhile, the cops were on their way.", "Тем временем копы были уже в пути."]], alt: ["In the meantime"] },
  { mine: 1, en: "Now then", ru: "Итак / Ну-с / Так-с", t: "m", f: 3, r: "n",
    n: "Чтобы начать разговор или перейти к делу. Звучит немного по-взрослому, по-британски.",
    ex: [["Now then, what seems to be the problem?", "Итак, на что жалуемся?"]], alt: ["Right then", "Okay, so"] },
  { mine: 1, en: "All of a sudden", ru: "Вдруг / Внезапно", t: "m", f: 4, r: "n",
    n: "Правильно — «all of a sudden», не «all of the sudden» (так часто ошибаются даже носители).",
    ex: [["All of a sudden, the lights went out.", "Вдруг погас свет."]], alt: ["Suddenly", "Out of nowhere"] },
  { mine: 1, en: "And just like that…", ru: "И вот так просто… / И вот так вдруг…", t: "m", f: 3, r: "n",
    n: "Рассказ о резкой перемене.",
    ex: [["And just like that, he was gone.", "И вот так просто его не стало."]] }
]);

P("constr", [
  { mine: 1, en: "Get used to", ru: "Привыкнуть к / Привыкать", t: "m", f: 5, r: "n", pat: "get used to + что-то / -ing",
    n: "Процесс привыкания. «I'm used to» — уже привык. После to — существительное или -ing, не глагол.",
    ex: [["You'll get used to it.", "Привыкнешь."], ["I can't get used to waking up at 5.", "Не могу привыкнуть вставать в 5."]], alt: ["Be used to", "Used to (раньше)"] },
  { mine: 1, en: "Be up to (something)", ru: "Затевать / Заниматься / Зависеть от", t: "m", f: 5, r: "i", pat: "be up to + something · what are you up to? · it's up to + кто-то",
    n: "1) «What are you up to?» — чем занят? 2) «He's up to something» — что-то задумал. 3) «It's up to you» — решать тебе. 4) «up to 50 people» — до 50 человек.",
    ex: [["Hey, what are you up to?", "Привет, чем занимаешься?"], ["They're up to something.", "Они что-то задумали."], ["It's up to you.", "Решать тебе."]] },
  { mine: 1, en: "Whatever it takes", ru: "Любой ценой / Всё, что потребуется", t: "m", f: 4, r: "n", pat: "do whatever it takes (to + глагол)",
    ex: [["I'll do whatever it takes to win.", "Я сделаю всё, чтобы победить."]], alt: ["At any cost", "No matter what"] },
  { mine: 1, en: "It's no use", ru: "Бесполезно / Без толку", t: "m", f: 4, r: "n", pat: "it's no use + -ing",
    n: "Важно: «It's no use» (а не «it no use»). После — -ing: It's no use crying.",
    ex: [["It's no use. The door's locked.", "Бесполезно. Дверь заперта."], ["It's no use crying about it.", "Плакать об этом без толку."]], alt: ["There's no point", "It's pointless"] },
  { mine: 1, en: "In the first place", ru: "Вообще / С самого начала / Изначально", t: "m", f: 4, r: "n", pat: "why did you … in the first place?",
    n: "С артиклем: in THE first place. Часто в упрёках: «зачем ты вообще это сделал?».",
    ex: [["Why did you agree in the first place?", "Зачем ты вообще согласился?"], ["I never wanted to come in the first place.", "Я с самого начала не хотел идти."]] },
  { mine: 1, en: "On your own", ru: "Сам / В одиночку / Самостоятельно", t: "m", f: 5, r: "n", pat: "on my / your / his own",
    ex: [["You're on your own.", "Дальше ты сам. / Выкручивайся сам."], ["I did it on my own.", "Я сделал это сам."]], alt: ["By yourself", "Alone"] },
  { mine: 1, en: "For some time now", ru: "Уже какое-то время / Уже давно", t: "m", f: 3, r: "n", pat: "have + V3 / have been + -ing … for some time now",
    n: "Обычно с Present Perfect: действие длится до сих пор.",
    ex: [["I've been meaning to tell you for some time now.", "Я уже давно хотел тебе сказать."]], alt: ["For a while now"] },
  { mine: 1, en: "A hell of a…", ru: "Чертовски… / Офигенный…", t: "m", f: 4, r: "r", pat: "a hell of a + существительное",
    n: "Усилитель: hell of a show — офигенное шоу; hell of a day — тяжелейший день. Смысл (хорошо или плохо) — из контекста. В речи: «helluva».",
    ex: [["That was a hell of a show!", "Это было офигенное шоу!"], ["It's been a hell of a day.", "Ну и денёк выдался."]], alt: ["Helluva", "One hell of a…"] },
  { mine: 1, en: "Everyone but…", ru: "Все, кроме…", t: "m", f: 4, r: "n", pat: "everyone / anything / nothing + but + кто-то/что-то",
    n: "but = except (кроме). «Anything but» — что угодно, только не…",
    ex: [["It seems everyone realizes it but her.", "Кажется, это понимают все, кроме неё."], ["I'll eat anything but fish.", "Съем что угодно, кроме рыбы."]] },
  { mine: 1, en: "Not half as … as", ru: "И вполовину не так… как", t: "m", f: 2, r: "n", pat: "not half as + прилагательное + as",
    ex: [["You're not half as bad as you think.", "Ты и вполовину не так плох, как думаешь."]] },
  { mine: 1, en: "I do + глагол (усиление)", ru: "Я правда… / Я ведь…", t: "m", f: 4, r: "n", pat: "do / does / did + глагол (с ударением)",
    n: "Do в утверждении усиливает: «I do wish» — как же я хочу; «I did call» — я же звонил!",
    ex: [["I do wish you'd stay.", "Мне правда очень хочется, чтобы ты остался."], ["I did call you! Twice!", "Я же звонил тебе! Дважды!"]] },
  { mine: 1, en: "For your own good", ru: "Для твоего же блага", t: "m", f: 4, r: "n", pat: "for my / your / his own good",
    ex: [["I'm telling you this for your own good.", "Я говорю тебе это для твоего же блага."]] },
  { mine: 1, en: "Stand for", ru: "Означать, расшифровываться как / Терпеть", t: "m", f: 4, r: "n", pat: "X stands for … · I won't stand for it",
    n: "1) Расшифровка аббревиатуры. 2) «I won't stand for this» — я этого не потерплю.",
    ex: [["NHL stands for National Hockey League.", "NHL расшифровывается как Национальная хоккейная лига."], ["I won't stand for this!", "Я этого не потерплю!"]] },
  { mine: 1, en: "Brand new", ru: "Совершенно новый / С иголочки", t: "m", f: 4, r: "n",
    ex: [["Is that a brand new car?", "Это что, новенькая машина?"], ["I feel like a brand new person.", "Чувствую себя заново родившимся."]] }
]);

P("phrasal", [
  { mine: 1, en: "Sign up for", ru: "Записаться / Зарегистрироваться", t: "m", f: 5, r: "n", pat: "sign up for + что-то · sign up to + глагол",
    ex: [["I signed up for the gym.", "Я записался в спортзал."], ["Sign up for free!", "Зарегистрируйтесь бесплатно!"]], alt: ["Register", "Join"] },
  { mine: 1, en: "Brag", ru: "Хвастаться", t: "m", f: 4, r: "i", pat: "brag about + что-то",
    n: "Хвастаться на словах. «Show off» — скорее выпендриваться действиями.",
    ex: [["Stop bragging about your car.", "Хватит хвастаться своей машиной."], ["Not to brag, but I won.", "Не хочу хвастаться, но я выиграл."]], alt: ["Show off", "Boast", "Flex"] },
  { mine: 1, en: "Make fun of", ru: "Смеяться над / Подшучивать / Стебать", t: "m", f: 5, r: "n", pat: "make fun of + кого-то/что-то",
    ex: [["Are you making fun of me?", "Ты что, надо мной смеёшься?"]], alt: ["Tease", "Mock", "Laugh at"] },
  { mine: 1, en: "Make up one's mind", ru: "Решиться / Определиться", t: "m", f: 4, r: "n", pat: "make up my / your mind (about …)",
    ex: [["Make up your mind!", "Определись уже!"], ["I can't make up my mind.", "Не могу решиться."]], alt: ["Decide"] },
  { mine: 1, en: "Get to know", ru: "Узнать получше / Познакомиться ближе", t: "m", f: 5, r: "n", pat: "get to know + кого-то/что-то",
    ex: [["I'd like to get to know you better.", "Я бы хотел узнать тебя получше."]] },
  { mine: 1, en: "Make up for", ru: "Наверстать / Возместить / Загладить", t: "m", f: 4, r: "n", pat: "make up for + что-то",
    ex: [["Any failures of today can be made up for tomorrow.", "Любые неудачи сегодня можно наверстать завтра."], ["I'll make up for it.", "Я наверстаю / заглажу вину."]] },
  { mine: 1, en: "Make it through", ru: "Пережить / Выдержать / Дотянуть", t: "m", f: 4, r: "n", pat: "make it through + что-то (the night, the winter)",
    ex: [["I'll give it my all and make it through.", "Я выложусь по полной и выдержу."], ["Will he make it through the night?", "Он доживёт до утра?"]] },
  { mine: 1, en: "Get worked up (about)", ru: "Разволноваться / Завестись / Накрутить себя", t: "m", f: 4, r: "i", pat: "get / be worked up about + что-то",
    ex: [["Don't get so worked up about it.", "Не заводись ты так из-за этого."]], alt: ["Freak out", "Get upset"] },
  { mine: 1, en: "Zip it", ru: "Закрой рот / Молчок", t: "m", f: 3, r: "i", lit: "Застегни (на молнию)",
    n: "Грубовато, но шутливее, чем «shut up».",
    ex: [["Zip it! I'm trying to think.", "Тихо! Я пытаюсь думать."]], alt: ["Shut it", "Button it"] },
  { mine: 1, en: "Go nuts", ru: "Сходить с ума / Оторваться / Не стесняйся", t: "m", f: 3, r: "i",
    n: "1) Сойти с ума, взбеситься. 2) «Go nuts!» — разрешение: «давай, бери сколько хочешь».",
    ex: [["The crowd went nuts!", "Толпа взорвалась!"], ["Free pizza? Go nuts.", "Бесплатная пицца? Налетай."]], alt: ["Go crazy", "Knock yourself out"] }
]);

P("idiom", [
  { mine: 1, en: "Save the day", ru: "Спасти положение", t: "m", f: 4, r: "n",
    ex: [["You saved the day!", "Ты всех спас!"]] },
  { mine: 1, en: "Go for it", ru: "Давай! / Дерзай!", t: "m", f: 5, r: "i",
    ex: [["You like her? Go for it!", "Она тебе нравится? Дерзай!"]], alt: ["Give it a shot", "Just do it"] },
  { mine: 1, en: "Give it a try", ru: "Попробуй / Попробовать", t: "m", f: 5, r: "n", pat: "give it a try / a shot / a go",
    ex: [["Just give it a try.", "Просто попробуй."]], alt: ["Give it a shot", "Give it a go"] },
  { mine: 1, en: "Give it my all", ru: "Выложиться по полной", t: "m", f: 3, r: "n", pat: "give it my / your all",
    ex: [["I'll give it my all.", "Я выложусь по полной."]], alt: ["Give 110%"] },
  { mine: 1, en: "Take it easy", ru: "Не напрягайся / Полегче / Давай, бывай", t: "m", f: 5, r: "i",
    n: "1) «Расслабься, не перетруждайся». 2) «Полегче!» тому, кто злится. 3) Прощание.",
    ex: [["Take it easy, man. It's just a game.", "Полегче, это просто игра."], ["Take it easy this weekend.", "Отдохни в выходные."]], alt: ["Relax", "Chill"] },
  { mine: 1, en: "Take a breather", ru: "Передохнуть / Перевести дух", t: "m", f: 3, r: "i",
    ex: [["Let's take a breather.", "Давай передохнём."]], alt: ["Take a break"] },
  { mine: 1, en: "Let me catch my breath", ru: "Дай отдышаться", t: "m", f: 3, r: "n",
    n: "breath [брэс] — сущ. «дыхание»; breathe [бри:з] — глагол «дышать». Не путай.",
    ex: [["Wait… let me catch my breath.", "Стой… дай отдышаться."]] },
  { mine: 1, en: "Work up a sweat", ru: "Хорошенько пропотеть", t: "m", f: 2, r: "n",
    ex: [["Let's go for a run and work up a sweat.", "Пойдём побегаем, пропотеем."]] },
  { mine: 1, en: "Don't rain on my parade", ru: "Не порти мне праздник / Не обламывай", t: "m", f: 3, r: "i", lit: "Не устраивай дождь на моём параде",
    ex: [["I just got the job. Don't rain on my parade!", "Меня только взяли на работу. Не порти мне радость!"]], alt: ["Buzzkill"] },
  { mine: 1, en: "Big shoes to fill", ru: "Трудно соответствовать (предшественнику)", t: "m", f: 3, r: "n", pat: "have big shoes to fill",
    ex: [["I've got some big shoes to fill.", "Мне будет непросто его заменить."]] },
  { mine: 1, en: "Get in over your head", ru: "Влезть во что-то не по силам", t: "m", f: 3, r: "n", pat: "get / be in over my / your head",
    ex: [["Don't get in over your head.", "Не лезь туда, где не справишься."]] },
  { mine: 1, en: "Head in the clouds", ru: "Витать в облаках", t: "m", f: 3, r: "n", pat: "have one's head in the clouds · get your head out of the clouds",
    ex: [["Get your head out of the clouds!", "Спустись с небес на землю!"], ["Her head is lost in sneakerworld.", "Она вся в своих кроссовках (витает в мире кроссовок)."]] },
  { mine: 1, en: "To hell and back", ru: "Через ад / Прошёл огонь и воду", t: "m", f: 2, r: "r",
    ex: [["We've been to hell and back together.", "Мы вместе прошли через ад."], ["I worked to hell and back for this.", "Я горбатился ради этого как проклятый."]] },
  { mine: 1, en: "Don't let your guard down", ru: "Не теряй бдительности", t: "m", f: 3, r: "n", pat: "let one's guard down",
    ex: [["Stay alert. Don't let your guard down.", "Будь начеку. Не расслабляйся."]] },
  { mine: 1, en: "Don't get ahead of yourself", ru: "Не забегай вперёд / Не спеши радоваться", t: "m", f: 3, r: "n",
    ex: [["Don't get too ahead of yourself. We haven't won yet.", "Не спеши радоваться. Мы ещё не выиграли."]], alt: ["Don't count your chickens before they hatch"] },
  { mine: 1, en: "Don't spend it all in one place", ru: "Смотри не потрать всё сразу (шутка)", t: "m", f: 2, r: "i",
    n: "Шутка, когда даёшь кому-то совсем мало денег.",
    ex: [["Here's a dollar. Don't spend it all in one place!", "Вот доллар. Смотри не потрать всё сразу!"]] },
  { mine: 1, en: "That should do it", ru: "Ну вот, должно сработать / Готово", t: "m", f: 3, r: "n",
    ex: [["Okay, that should do it.", "Так, вот и всё, должно работать."]], alt: ["That'll do", "There we go"] }
]);

P("action", [
  { mine: 1, en: "Let's go get 'em!", ru: "Вперёд, порвём их!", t: "m", f: 3, r: "i", n: "'em = them.",
    ex: [["Come on, team, let's go get 'em!", "Давай, команда, порвём их!"]] },
  { mine: 1, en: "Good to go", ru: "Всё готово / Можно ехать", t: "m", f: 4, r: "i",
    ex: [["The car's fixed. You're good to go.", "Машина починена, можно ехать."]], alt: ["Ready to go", "All set"] },
  { mine: 1, en: "Brace yourself", ru: "Приготовься / Держись", t: "m", f: 3, r: "n",
    n: "Перед ударом, плохой новостью или чем-то шокирующим. «Prepare yourself» — то же, чуть торжественнее.",
    ex: [["Brace yourself. It's bad news.", "Приготовься. Новости плохие."]], alt: ["Prepare yourself", "Hold on tight"] }
]);

P("feel", [
  { mine: 1, en: "I'm in a rush", ru: "Я спешу", t: "m", f: 4, r: "n", pat: "be in a rush / in a hurry",
    n: "С артиклем: in A rush.",
    ex: [["Sorry, I'm in a rush.", "Извини, я спешу."]], alt: ["I'm in a hurry"] },
  { mine: 1, en: "Tummy", ru: "Животик", t: "m", f: 3, r: "i",
    n: "Детское или ласковое слово для «живот» (stomach, belly).",
    ex: [["My tummy hurts.", "У меня животик болит."]], alt: ["Belly", "Stomach"] }
]);

P("conflict", [
  { mine: 1, en: "Excuse you!", ru: "Вообще-то надо извиниться! / Ничего не забыл?", t: "m", f: 3, r: "i",
    n: "Ирония: человек толкнул или нагрубил и не извинился — ему «подсказывают» Excuse me.",
    ex: [["(bumps into her) — Excuse you!", "(толкает её) — Ничего не хочешь сказать?!"]] },
  { mine: 1, en: "Your sorry ass", ru: "Твою жалкую задницу", t: "m", f: 3, r: "r", pat: "drag / get your sorry ass (behind) + куда-то",
    n: "Sorry здесь — «жалкий». Behind — смягчённый вариант ass.",
    ex: [["Get your sorry ass over here!", "Тащи сюда свою жалкую задницу!"], ["I'll drag your sorry behind to the testing site.", "Я дотащу тебя до места сдачи за шкирку."]] },
  { mine: 1, en: "Do as you're told", ru: "Делай, что говорят", t: "m", f: 3, r: "n", pat: "be told + to + глагол · I was told …",
    n: "be told — пассив от tell: «мне сказали». «I was told to wait» — мне велели ждать.",
    ex: [["Just do as you're told.", "Просто делай, что говорят."], ["I was told you were here.", "Мне сказали, что ты здесь."]] }
]);

P("love", [
  { mine: 1, en: "Wife material", ru: "Подходит в жёны / Идеальная жена", t: "m", f: 3, r: "i", pat: "wife / boyfriend / girlfriend / leader material",
    n: "material = «подходящий кандидат на роль». Not boyfriend material — не годится в парни.",
    ex: [["She cooks, she's smart — total wife material.", "Готовит, умная — прям идеальная жена."], ["He's not boyfriend material.", "На роль парня он не годится."]] },
  { mine: 1, en: "Straight", ru: "Гетеро / Прямой, честный / Подряд", t: "m", f: 4, r: "n",
    n: "1) О человеке: гетеросексуальный (straight vs gay). 2) «Be straight with me» — будь честен. 3) «three days straight» — три дня подряд. 4) В комедии «straight man» — серьёзный персонаж, оттеняющий шутника.",
    ex: [["Is he straight?", "Он гетеро?"], ["Just be straight with me.", "Просто скажи мне честно."], ["I worked 12 hours straight.", "Я работал 12 часов подряд."]] }
]);

P("party", [
  { mine: 1, en: "Meet and greet", ru: "Встреча с фанатами / Знакомство", t: "m", f: 3, r: "n",
    n: "Короткая встреча со звездой или неформальное знакомство с новыми людьми.",
    ex: [["We got tickets to the meet and greet!", "Мы достали билеты на встречу с артистом!"]] },
  { mine: 1, en: "Venue", ru: "Площадка / Место проведения", t: "d", f: 3, r: "n", n: "Читается [ˈvenjuː].",
    ex: [["The venue holds 2,000 people.", "Площадка вмещает 2000 человек."]] }
]);

// ⚠️ Ловушки: ложные друзья, кальки и пары, где мелочь меняет смысл
P("trap", [
  { mine: 1, en: "Series vs Serial", ru: "Сериал vs Серийный", t: "m", f: 4, r: "n",
    n: "TV series — сериал. Serial — прилагательное «серийный» (serial killer — серийный убийца). Serial как «сериал» — только про радио- и подкаст-сериалы (UK). Сериал по-английски — series или show.",
    ex: [["What series are you watching?", "Какой сериал смотришь?"], ["He's a serial killer.", "Он серийный убийца."]] },
  { mine: 1, en: "Belly button", ru: "Пупок", t: "m", f: 3, r: "i",
    n: "Не «bully button» (bully — хулиган, задира). Belly — живот, button — пуговица: «пупок» = пуговка на животе.",
    ex: [["She has a belly button piercing.", "У неё пирсинг в пупке."]], alt: ["Navel (книжно)"] },
  { mine: 1, en: "I'll be in your care", ru: "Калька из аниме — носители так не говорят", t: "m", f: 1, r: "n",
    n: "Дословный перевод японского «yoroshiku onegaishimasu» из аниме и игр. По-английски по ситуации: «Nice to meet you» (знакомство), «Thanks for having me» (в гостях), «Looking forward to working with you» (на работе), «I'm counting on you» (рассчитываю на тебя).",
    ex: [["Thanks for having me!", "Спасибо, что приютили!"], ["I'm counting on you.", "Я на тебя рассчитываю."]] },
  { en: "Actual", ru: "Настоящий, фактический (НЕ «актуальный»)", t: "m", f: 5, r: "n",
    n: "«Актуальный» = relevant, current, up-to-date. Actually = на самом деле.",
    ex: [["What's the actual price?", "Какая реальная цена?"], ["Is this info still relevant?", "Эта инфа ещё актуальна?"]] },
  { en: "Sympathetic", ru: "Сочувствующий (НЕ «симпатичный»)", t: "m", f: 3, r: "n",
    n: "«Симпатичный» = cute, nice-looking, attractive.",
    ex: [["She was very sympathetic.", "Она очень мне сочувствовала."], ["He's cute.", "Он симпатичный."]] },
  { en: "Magazine", ru: "Журнал (НЕ «магазин»)", t: "m", f: 3, r: "n",
    n: "Магазин = shop / store. Ещё magazine — магазин (обойма) в оружии!",
    ex: [["I read it in a magazine.", "Я прочитал это в журнале."], ["Reload the magazine!", "Меняй магазин!"]] },
  { en: "Accurate", ru: "Точный (НЕ «аккуратный»)", t: "m", f: 3, r: "n",
    n: "«Аккуратный» = neat, tidy, careful.",
    ex: [["The forecast was accurate.", "Прогноз оказался точным."], ["He's very neat.", "Он очень аккуратный."]] },
  { en: "Fabric", ru: "Ткань (НЕ «фабрика»)", t: "m", f: 2, r: "n", n: "Фабрика = factory.",
    ex: [["What fabric is this?", "Что это за ткань?"]] },
  { en: "Eventually", ru: "В конце концов, в итоге (НЕ «возможно»)", t: "m", f: 4, r: "n",
    ex: [["He'll call eventually.", "В конце концов он позвонит."]] },
  { en: "Intelligent", ru: "Умный (НЕ «интеллигентный»)", t: "m", f: 3, r: "n", n: "«Интеллигентный» ближе к well-mannered, cultured, educated.",
    ex: [["She's very intelligent.", "Она очень умная."]] },
  { en: "Preservative", ru: "Консервант (НЕ «презерватив»)", t: "m", f: 2, r: "n", n: "Презерватив = condom.",
    ex: [["No preservatives.", "Без консервантов."]] },
  { en: "Artist", ru: "Художник, творец (не обязательно «артист»)", t: "m", f: 3, r: "n", n: "Артист театра — actor/performer. Artist — художник или любой творец, в т.ч. музыкант.",
    ex: [["She's a talented artist.", "Она талантливая художница."]] },
  { en: "Novel", ru: "Роман (книга) / Новый, необычный", t: "m", f: 3, r: "n", n: "Новелла = short story.",
    ex: [["I'm reading a novel.", "Я читаю роман."]] },
  { en: "Receipt vs Recipe", ru: "Чек vs Рецепт", t: "m", f: 3, r: "n", n: "Receipt [рисит] — чек. Recipe [рэсипи] — кулинарный рецепт. Рецепт от врача — prescription.",
    ex: [["Can I have a receipt?", "Можно чек?"], ["Grandma's recipe.", "Бабушкин рецепт."]] },
  { en: "Lose vs Loose", ru: "Терять vs Свободный, болтающийся", t: "m", f: 4, r: "n", n: "lose [лу:з] — терять, проигрывать. loose [лу:с] — свободный, неплотный. Даже носители путают на письме.",
    ex: [["Don't lose your keys.", "Не потеряй ключи."], ["These jeans are loose.", "Эти джинсы свободные."]] },
  { mine: 1, en: "Breath vs Breathe", ru: "Дыхание vs Дышать", t: "m", f: 3, r: "n", n: "breath [брэс] — существительное, breathe [бри:з] — глагол. Catch my breath, но just breathe.",
    ex: [["Take a deep breath.", "Сделай глубокий вдох."], ["Just breathe.", "Просто дыши."]] },
  { en: "I'm down vs I'm feeling down", ru: "Я за vs Мне грустно", t: "m", f: 3, r: "i",
    ex: [["— Pizza? — I'm down.", "— Пицца? — Я за."], ["I'm feeling a bit down today.", "Мне сегодня как-то грустно."]] },
  { en: "Mad vs Mad at", ru: "Сумасшедший (UK) vs Злой на (US)", t: "m", f: 3, r: "i",
    n: "В США mad = злой: «Are you mad at me?» В Британии mad чаще = сумасшедший: «You're mad!»",
    ex: [["Are you mad at me?", "Ты на меня злишься?"], ["You're mad, mate!", "Ты чокнутый, дружище!"]] },
  { en: "It's shit vs It's the shit", ru: "Отстой vs Огонь", t: "m", f: 3, r: "v",
    n: "Один артикль переворачивает смысл. Подробнее — в «Мат и ругательства → The shit».",
    ex: [["This song is shit.", "Эта песня — отстой."], ["This song is the shit!", "Эта песня — огонь!"]] },
  { en: "Pants (US vs UK)", ru: "Штаны (US) vs Трусы (UK)", t: "m", f: 3, r: "i",
    n: "В Британии pants — нижнее бельё, штаны — trousers. Также chips: US — чипсы, UK — картошка фри (чипсы — crisps).",
    ex: [["Nice pants!", "Классные штаны! (в Лондоне — неловко)"]] },
  { en: "Sick", ru: "Больной / Тошнит / (сленг) Крутой", t: "m", f: 4, r: "i",
    n: "I'm sick — я болен (US) или меня тошнит (UK). That's sick! — это круто! Sick of — достало.",
    ex: [["I'm sick.", "Я заболел."], ["That trick was sick!", "Трюк был офигенный!"], ["I'm sick of this.", "Меня это достало."]] },
  { mine: 1, en: "Here you are vs There you are", ru: "Вот, держи vs Вот ты где!", t: "m", f: 4, r: "n",
    ex: [["Here you are, your coffee.", "Вот, держите ваш кофе."], ["There you are! I was looking for you.", "Вот ты где! Я тебя искал."]] }
]);

// Фразы из списка, которые уже были в базе, — тоже показываем в «📝 Мой список»
window.MINE_EXTRA = ["Show off", "Bring it on!", "Got it", "Not exactly", "Cut it out", "You've got to be kidding me", "Catch you later",
  "Knock it off", "You bet", "I can't help (doing)…", "Let alone…", "Pop the question", "Check out", "Shut up!", "Holy crap!",
  "Run out of", "You got this", "Big deal", "Give me a break", "There's no way…", "Call it a day", "Mind your own business",
  "Weirdo", "Wrap up", "I feel like…", "Hang in there", "It's just that…"];
