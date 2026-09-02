(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)]
  const KEY='academy47-investigation-stats-v1', NOTES='academy47-investigation-notes-v1'
  const skillNames={timeline:'Хронология',docs:'Документы',contradictions:'Противоречия',inference:'Выводы'}
  const empty=()=>({attempts:0,best:0,completed:[],skills:{timeline:{c:0,t:0},docs:{c:0,t:0},contradictions:{c:0,t:0},inference:{c:0,t:0}}})
  const load=()=>{try{return {...empty(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return empty()}}
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s))
  const loadNotes=()=>{try{return JSON.parse(localStorage.getItem(NOTES)||'{}')}catch{return{}}}
  const saveNote=(id,v)=>{const n=loadNotes();n[id]=v;localStorage.setItem(NOTES,JSON.stringify(n))}
  const pct=x=>x&&x.t?Math.round(x.c/x.t*100):0

  const cases=[
    {
      id:'archive47',title:'Архивный файл №47',subtitle:'Восстанови, в какой момент папка покинула своё подтверждённое место.',duration:'20–25 мин',difficulty:'Сложный',skills:['timeline','docs','contradictions','inference'],
      overview:`Учебный архив проводит внутреннюю проверку. Новая папка A-47 в 10:24 была помещена на полку №2, но к 11:06 её там уже не было. В 11:12 папку нашли в запечатанном транспортном коробе из комнаты B. Твоя задача — не «угадать виновного», а определить, какие факты доказаны, какие версии только возможны и где возникает настоящее противоречие.`,
      tabs:[
        {id:'timeline',label:'Хронология',html:`<div class="inv47-timeline">
          <div class="inv47-time"><b>10:02</b><i></i><span>Папка <b>A-47</b> зарегистрирована на приёмке.</span></div>
          <div class="inv47-time"><b>10:18</b><i></i><span>Станция S1: пользователь Ирина сканирует 8 страниц из A-47.</span></div>
          <div class="inv47-time"><b>10:24</b><i></i><span>В журнале размещения: A-47 → полка №2.</span></div>
          <div class="inv47-time"><b>10:31</b><i></i><span>Автоматическая инвентаризация полки №2 фиксирует A-47 и C-12.</span></div>
          <div class="inv47-time"><b>10:42</b><i></i><span>По журналу выдачи Алексей забирает C-12 с полки №2.</span></div>
          <div class="inv47-time"><b>10:47</b><i></i><span>Павел открывает транспортный короб B-3 для укладки архивных папок.</span></div>
          <div class="inv47-time"><b>10:49</b><i></i><span>Короб B-3 опломбирован. Следующее официальное вскрытие — только в 11:12.</span></div>
          <div class="inv47-time"><b>10:55</b><i></i><span>Алексей возвращает C-12 на полку №2.</span></div>
          <div class="inv47-time"><b>11:06</b><i></i><span>Контроль полки: C-12 есть, A-47 отсутствует.</span></div>
          <div class="inv47-time"><b>11:12</b><i></i><span>При поиске вскрывают B-3 и находят внутри A-47.</span></div>
        </div>`},
        {id:'docs',label:'Журналы',html:`<div class="inv47-doc"><span class="label">ЖУРНАЛ РАЗМЕЩЕНИЯ</span><h4>Полка №2</h4><table><thead><tr><th>Время</th><th>Действие</th><th>Объект</th><th>Пользователь</th></tr></thead><tbody><tr><td>10:24</td><td>размещено</td><td>A-47</td><td>Ирина</td></tr><tr><td>10:42</td><td>выдано</td><td>C-12</td><td>Алексей</td></tr><tr><td>10:55</td><td>возвращено</td><td>C-12</td><td>Алексей</td></tr></tbody></table></div>
        <div class="inv47-doc"><span class="label">КОНТРОЛЬ ПЛОМБЫ B-3</span><h4>Транспортный короб</h4><table><thead><tr><th>Время</th><th>Событие</th><th>Ответственный</th></tr></thead><tbody><tr><td>10:47</td><td>вскрыта</td><td>Павел</td></tr><tr><td>10:49</td><td>опломбирована</td><td>Павел</td></tr><tr><td>11:12</td><td>вскрыта при поиске</td><td>комиссия</td></tr></tbody></table></div>
        <div class="inv47-evidence-tip">Важно: журнал доступа показывает действие или фиксацию, но сам по себе не раскрывает намерение человека.</div>`},
        {id:'statements',label:'Объяснения',html:`<div class="inv47-statement"><b>Ирина</b><p>«После размещения A-47 на полке в 10:24 я к этой папке не возвращалась».</p></div>
        <div class="inv47-statement"><b>Алексей</b><p>«В 10:42 я брал только C-12. A-47 оставалась на полке, насколько я помню».</p></div>
        <div class="inv47-statement"><b>Павел</b><p>«В короб B-3 с 10:47 до 10:49 я положил только старые папки, принесённые из комнаты B. Новых папок с приёмки там не было».</p></div>
        <div class="inv47-evidence-tip">Не путай: «человек находился рядом» ≠ «человек совершил действие». Ищи именно факт, который несовместим с другой подтверждённой записью.</div>`}
      ],
      questions:[
        {skill:'timeline',q:'Когда A-47 в последний раз достоверно подтверждена именно на полке №2?',options:['10:24','10:31','10:42','10:55'],answer:1,explain:'10:31 — автоматическая инвентаризация подтверждает наличие A-47 на полке. Запись 10:24 только фиксирует размещение раньше.'},
        {skill:'docs',q:'Какой интервал является самым узким доказанным окном, когда A-47 могла попасть в уже найденный короб B-3?',options:['10:02–10:24','10:31–11:06','10:47–10:49','10:55–11:12'],answer:2,explain:'Короб официально открыт 10:47–10:49 и затем остаётся под пломбой до обнаружения A-47 в 11:12.'},
        {skill:'contradictions',q:'Какое объяснение прямо конфликтует с совокупностью журналов и фактом нахождения A-47?',options:['Ирины','Алексея','Павла','Ни одно'],answer:2,explain:'Если B-3 после 10:49 не вскрывался, а A-47 найден внутри, утверждение «в коробе были только старые папки из комнаты B» неполно или неверно.'},
        {skill:'inference',q:'Какой вывод делать НЕЛЬЗЯ только из этих материалов?',options:['A-47 была на полке в 10:31','A-47 оказалась в B-3 до опломбирования','Павел намеренно спрятал A-47','После 10:49 короб официально не вскрывался'],answer:2,explain:'Материалы позволяют установить временное окно и противоречие, но не доказывают намерение.'},
        {skill:'inference',q:'Какой итоговый вывод наиболее аккуратный?',options:['Алексей точно переместил папку','Ирина точно ошиблась в журнале','A-47 попала в B-3 во время открытого окна 10:47–10:49; объяснение Павла требует проверки','Невозможно установить вообще ничего'],answer:2,explain:'Это вывод, который не выходит за пределы подтверждённых фактов.'}
      ]
    },
    {
      id:'access47',title:'Комната переговоров',subtitle:'Раздели цифровой след, физическое присутствие и предположение.',duration:'20–25 мин',difficulty:'Сложный',skills:['timeline','docs','contradictions','inference'],
      overview:`После совещания обнаружено, что распечатанный пакет оказался в комнате раньше, чем предполагала часть сотрудников. Есть журнал проходов, события двери, очередь печати и три объяснения. Здесь особенно важно не приравнивать имя учётной записи к физическому действию человека.`,
      tabs:[
        {id:'timeline',label:'Хронология',html:`<div class="inv47-timeline"><div class="inv47-time"><b>09:03</b><i></i><span>Марина проходит через общий турникет.</span></div><div class="inv47-time"><b>09:07</b><i></i><span>Олег проходит через общий турникет.</span></div><div class="inv47-time"><b>09:11</b><i></i><span>Дверь переговорной открыта пропуском Олега.</span></div><div class="inv47-time"><b>09:13</b><i></i><span>Сетевой принтер завершает задание пользователя «marina»: 6 страниц.</span></div><div class="inv47-time"><b>09:16</b><i></i><span>Датчик переговорной фиксирует закрытие двери.</span></div><div class="inv47-time"><b>09:18</b><i></i><span>Олег выходит через общий турникет.</span></div><div class="inv47-time"><b>09:22</b><i></i><span>Переговорная открыта пропуском Марины.</span></div><div class="inv47-time"><b>09:26</b><i></i><span>Марина выходит через общий турникет.</span></div></div>`},
        {id:'docs',label:'Цифровые журналы',html:`<div class="inv47-doc"><span class="label">ПРОХОДЫ</span><table><thead><tr><th>Время</th><th>Идентификатор</th><th>Событие</th></tr></thead><tbody><tr><td>09:03</td><td>Марина</td><td>вход</td></tr><tr><td>09:07</td><td>Олег</td><td>вход</td></tr><tr><td>09:18</td><td>Олег</td><td>выход</td></tr><tr><td>09:26</td><td>Марина</td><td>выход</td></tr></tbody></table></div>
        <div class="inv47-doc"><span class="label">ПЕРЕГОВОРНАЯ</span><table><thead><tr><th>Время</th><th>Событие</th><th>Пропуск</th></tr></thead><tbody><tr><td>09:11</td><td>открытие</td><td>Олег</td></tr><tr><td>09:16</td><td>закрытие</td><td>датчик</td></tr><tr><td>09:22</td><td>открытие</td><td>Марина</td></tr></tbody></table></div>
        <div class="inv47-doc"><span class="label">ОЧЕРЕДЬ ПЕЧАТИ</span><table><thead><tr><th>Время</th><th>Пользователь</th><th>Страниц</th><th>Статус</th></tr></thead><tbody><tr><td>09:13</td><td>marina</td><td>6</td><td>завершено</td></tr></tbody></table></div>`},
        {id:'statements',label:'Объяснения',html:`<div class="inv47-statement"><b>Марина</b><p>«До 09:20 я в переговорную не заходила. В первый раз открыла её своим пропуском около 09:22».</p></div><div class="inv47-statement"><b>Олег</b><p>«Когда я закрывал переговорную около 09:16, распечатанный пакет уже лежал на столе».</p></div><div class="inv47-statement"><b>Администратор</b><p>«Учётная запись в журнале печати показывает, от чьего сеанса отправили задание. Она не доказывает, кто физически забрал листы из лотка».</p></div>`}
      ],
      questions:[
        {skill:'timeline',q:'Кто по журналу первым открыл переговорную в рассматриваемом интервале?',options:['Марина','Олег','Администратор','Нельзя определить'],answer:1,explain:'В 09:11 дверь открыта пропуском Олега.'},
        {skill:'docs',q:'Что достоверно доказывает запись печати 09:13?',options:['Марина лично стояла у принтера','Марина лично внесла пакет в переговорную','Задание на 6 страниц завершено из сеанса marina','Олег не мог забрать листы'],answer:2,explain:'Цифровой журнал подтверждает учётную запись и результат печати, но не физическое присутствие у устройства.'},
        {skill:'contradictions',q:'Есть ли прямое противоречие между словами Марины и журналом двери?',options:['Да, она входила в 09:11','Нет: её пропуск впервые открывает дверь в 09:22','Да, потому что печать была в 09:13','Нельзя сравнивать время'],answer:1,explain:'Журнал двери согласуется с её словами о первом входе около 09:22.'},
        {skill:'inference',q:'Как объяснить, что пакет мог быть в комнате к 09:16, не противореча журналам?',options:['Марина обязательно вошла без пропуска','Олег мог забрать распечатку и внести её в комнату','Принтер находился внутри комнаты — это доказано','Журналы обязательно подделаны'],answer:1,explain:'Это возможная версия, совместимая с фактами. Она не доказана, но показывает, почему один лог печати недостаточен для вывода о присутствии.'},
        {skill:'inference',q:'Какой вывод наиболее корректен?',options:['Марина точно была в комнате до 09:20','Олег точно печатал под чужой учётной записью','Печать из учётной записи marina не доказывает физическое перемещение пакета Мариной','Ни один цифровой журнал нельзя использовать'],answer:2,explain:'Это ключевое различие между цифровым событием и физическим действием.'}
      ]
    },
    {
      id:'parcel47',title:'Перепутанные отправления',subtitle:'Сопоставь вес, маршрут и сканирование и найди момент перестановки.',duration:'25–30 мин',difficulty:'Высокий',skills:['timeline','docs','contradictions','inference'],
      overview:`На сортировке два отправления приехали к получателям с неверными ярлыками. В системе есть исходные веса, сканы зон и контрольное взвешивание перед погрузкой. Нужно понять, какие данные указывают на перестановку и в каком участке процесса она наиболее вероятна.`,
      tabs:[
        {id:'intake',label:'Приёмка',html:`<div class="inv47-doc"><span class="label">ПРИЁМКА · 13:20–13:27</span><table><thead><tr><th>Ярлык</th><th>Вес при приёмке</th><th>Маршрут</th></tr></thead><tbody><tr><td>P-47</td><td>2,4 кг</td><td>Север</td></tr><tr><td>P-74</td><td>5,8 кг</td><td>Юг</td></tr><tr><td>P-19</td><td>3,1 кг</td><td>Север</td></tr><tr><td>P-62</td><td>7,2 кг</td><td>Юг</td></tr></tbody></table></div><div class="inv47-evidence-tip">Вес на приёмке записан до сортировки и считается исходной контрольной характеристикой отправления.</div>`},
        {id:'staging',label:'Сортировка',html:`<div class="inv47-doc"><span class="label">СКАНЫ ЗОНЫ</span><table><thead><tr><th>Время</th><th>Ярлык</th><th>Зона</th></tr></thead><tbody><tr><td>13:48</td><td>P-19</td><td>Север</td></tr><tr><td>13:51</td><td>P-62</td><td>Юг</td></tr><tr><td>13:54</td><td>P-47</td><td>буфер 2</td></tr><tr><td>13:55</td><td>P-74</td><td>буфер 2</td></tr><tr><td>14:02</td><td>P-47</td><td>Север</td></tr><tr><td>14:03</td><td>P-74</td><td>Юг</td></tr></tbody></table></div><div class="inv47-statement"><b>Оператор буфера</b><p>«P-47 и P-74 одновременно находились в буфере 2 около минуты. После этого их отправили в разные маршрутные зоны».</p></div>`},
        {id:'loading',label:'Погрузка',html:`<div class="inv47-doc"><span class="label">КОНТРОЛЬНОЕ ВЗВЕШИВАНИЕ</span><table><thead><tr><th>Ярлык</th><th>Вес перед погрузкой</th><th>Машина</th></tr></thead><tbody><tr><td>P-47</td><td><b>5,8 кг</b></td><td>Север</td></tr><tr><td>P-19</td><td>3,1 кг</td><td>Север</td></tr><tr><td>P-74</td><td><b>2,4 кг</b></td><td>Юг</td></tr><tr><td>P-62</td><td>7,2 кг</td><td>Юг</td></tr></tbody></table></div><div class="inv47-timeline"><div class="inv47-time"><b>14:15</b><i></i><span>Машина «Юг» отправлена.</span></div><div class="inv47-time"><b>14:20</b><i></i><span>Машина «Север» отправлена.</span></div></div>`},
        {id:'statements',label:'Пояснения',html:`<div class="inv47-statement"><b>Приёмка</b><p>«Весы прошли утреннюю проверку. Для P-19 и P-62 значения при погрузке полностью совпали с приёмкой».</p></div><div class="inv47-statement"><b>Сортировка</b><p>«Ярлык считывается сканером, но контрольный вес связан уже с физическим местом, которое лежит на весах».</p></div><div class="inv47-evidence-tip">Сравни не только маршрут ярлыка, но и «отпечаток» физического объекта — его вес.</div>`}
      ],
      questions:[
        {skill:'docs',q:'Какие два отправления показывают зеркальное несовпадение веса?',options:['P-19 и P-62','P-47 и P-74','P-47 и P-19','P-74 и P-62'],answer:1,explain:'У P-47 при погрузке появляется исходный вес P-74 (5,8 кг), а у P-74 — исходный вес P-47 (2,4 кг).'},
        {skill:'timeline',q:'Где впервые зафиксировано совместное нахождение P-47 и P-74 в одном участке процесса?',options:['Приёмка','Буфер 2','Зона Север','Погрузка'],answer:1,explain:'В 13:54–13:55 оба ярлыка проходят через буфер 2.'},
        {skill:'contradictions',q:'Что сильнее всего указывает именно на перестановку ярлыков/мест, а не на случайную ошибку весов?',options:['Оба веса увеличились','Вес P-19 тоже изменился','Два спорных веса точно поменялись местами, а контрольные P-19/P-62 совпали','Машины уехали в разное время'],answer:2,explain:'Зеркальная замена 2,4 ↔ 5,8 при стабильных контрольных отправлениях делает версию общей ошибки весов слабой.'},
        {skill:'inference',q:'Какой участок процесса наиболее обоснованно проверить первым?',options:['Приёмку до 13:20','Буфер 2 между 13:54 и 14:02','Выезд машин после 14:20','Маршрут P-19'],answer:1,explain:'Это единственный участок, где два спорных отправления подтверждённо оказываются рядом до расходящихся маршрутов.'},
        {skill:'inference',q:'Какой вывод слишком сильный для имеющихся данных?',options:['Физические отправления P-47 и P-74, вероятно, были переставлены относительно ярлыков','Буфер 2 — ключевой участок для проверки','Конкретный оператор намеренно поменял ярлыки','Контрольные веса P-19 и P-62 согласуются'],answer:2,explain:'Материалы локализуют проблему, но не устанавливают конкретное лицо и тем более намерение.'}
      ]
    }
  ]

  function skillHtml(){const s=load();return `<div class="inv47-skillbar"><h3>Профиль аналитических навыков</h3>${Object.entries(skillNames).map(([k,n])=>{const p=pct(s.skills?.[k]);return `<div class="inv47-skillrow"><span>${n}</span><i><em style="width:${p}%"></em></i><b>${s.skills?.[k]?.t?p+'%':'—'}</b></div>`}).join('')}</div>`}
  function dashboard(root){
    const s=load();root.innerHTML=`<section class="inv47-hero"><div><span class="inv47-kicker">INVESTIGATION 47 · ДЛИННЫЕ КЕЙСЫ</span><h2>Мини-расследования на 20–30 минут</h2><p>Не ищи ответ по одной подсказке. Сначала изучи все материалы, восстанови хронологию, отдели факт от предположения, выпиши противоречия и только потом переходи к финальным вопросам.</p><div class="inv47-mini-tags"><span>документы</span><span>показания</span><span>временная линия</span><span>цифровые журналы</span><span>финальная версия</span></div></div><div class="inv47-hero-stat"><div><strong>${s.attempts||0}</strong><small>разборов</small></div><div><strong>${s.best||0}%</strong><small>лучший</small></div><div><strong>${s.completed?.length||0}/${cases.length}</strong><small>дел закрыто</small></div></div></section><div class="inv47-grid">${cases.map(c=>`<button class="inv47-card" data-case="${c.id}"><div class="inv47-card-top"><span class="inv47-badge">${c.difficulty}</span>${s.completed?.includes(c.id)?'<span class="inv47-done">ПРОЙДЕНО ✓</span>':'<span class="inv47-done" style="color:#6c5cda;background:#f0eeff">НОВОЕ</span>'}</div><h3>${c.title}</h3><p>${c.subtitle}</p><div class="inv47-card-meta"><span>⏱ ${c.duration}</span><span>📂 ${c.tabs.length} блока материалов</span><span>✓ ${c.questions.length} выводов</span></div></button>`).join('')}</div>${skillHtml()}`
    $$('[data-case]',root).forEach(b=>b.onclick=()=>openCase(root,b.dataset.case))
  }

  function openCase(root,id){
    const c=cases.find(x=>x.id===id),notes=loadNotes(),selected={},start=Date.now();let active=c.tabs[0].id,checked=false
    root.innerHTML=`<section class="inv47-case"><header class="inv47-casehead"><span>ВЫМЫШЛЕННЫЙ УЧЕБНЫЙ КЕЙС · ${c.duration}</span><h2>${c.title}</h2><p>${c.overview}</p><div class="inv47-progressline"><i style="width:10%"></i></div></header><div class="inv47-casebody"><aside class="inv47-sidebar"><button class="back">← Все расследования</button>${c.tabs.map(t=>`<button data-tab="${t.id}" class="${t.id===active?'active':''}">${t.label}</button>`).join('')}<button data-tab="notes">Мои заметки</button><button data-tab="final">Финальные выводы</button></aside><main class="inv47-main"></main></div></section>`
    $('.back',root).onclick=()=>dashboard(root)
    const render=()=>{
      $$('.inv47-sidebar [data-tab]',root).forEach(b=>b.classList.toggle('active',b.dataset.tab===active))
      const main=$('.inv47-main',root),bar=$('.inv47-progressline i',root);bar.style.width=active==='final'?'90%':active==='notes'?'70%':`${20+c.tabs.findIndex(t=>t.id===active)*15}%`
      if(active==='notes')main.innerHTML=`<section class="inv47-panel inv47-notes"><h3>Рабочие заметки</h3><p>Записывай только то, что помогает выводу: подтверждённые факты, временные окна, противоречия, альтернативные версии и то, чего пока не хватает.</p><textarea placeholder="ФАКТЫ:\n— ...\n\nПРОТИВОРЕЧИЯ:\n— ...\n\nВЕРСИИ:\n— ...\n\nЧТО НЕЛЬЗЯ ПОКА УТВЕРЖДАТЬ:\n— ...">${notes[c.id]||''}</textarea><div class="inv47-evidence-tip">Заметки сохраняются автоматически на этом устройстве.</div></section>`
      else if(active==='final'){
        main.innerHTML=`<section class="inv47-panel"><h3>Финальные выводы</h3><p>Ответь после изучения материалов. Сайт проверит не только итог, но и тип ошибки: хронология, документы, противоречия или логический вывод.</p>${c.questions.map((q,qi)=>`<div class="inv47-question" data-q="${qi}"><h4>${qi+1}. ${q.q}</h4><div class="inv47-options">${q.options.map((o,oi)=>`<button data-o="${oi}">${o}</button>`).join('')}</div><div class="explain"></div></div>`).join('')}<button class="inv47-submit" disabled>Проверить расследование</button><div class="inv47-result" style="display:none"></div></section>`
        c.questions.forEach((q,qi)=>$$(`[data-q="${qi}"] [data-o]`,main).forEach(b=>b.onclick=()=>{if(checked)return;selected[qi]=Number(b.dataset.o);$$(`[data-q="${qi}"] [data-o]`,main).forEach(x=>x.classList.toggle('selected',x===b));$('.inv47-submit',main).disabled=Object.keys(selected).length!==c.questions.length}))
        $('.inv47-submit',main).onclick=()=>{
          if(checked)return;checked=true;let score=0;const s=load();s.attempts=(s.attempts||0)+1;s.skills=s.skills||empty().skills
          c.questions.forEach((q,qi)=>{const ok=selected[qi]===q.answer;if(ok)score++;s.skills[q.skill]=s.skills[q.skill]||{c:0,t:0};s.skills[q.skill].t++;if(ok)s.skills[q.skill].c++;const box=$(`[data-q="${qi}"]`,main);$$('[data-o]',box).forEach(b=>{b.disabled=true;const oi=Number(b.dataset.o);if(oi===q.answer)b.classList.add('right');else if(oi===selected[qi])b.classList.add('wrong')});$('.explain',box).innerHTML=`<div class="inv47-evidence-tip"><b>${ok?'Верно ✓':'Ошибка.'}</b> ${q.explain}</div>`})
          const p=Math.round(score/c.questions.length*100);s.best=Math.max(s.best||0,p);s.completed=[...new Set([...(s.completed||[]),c.id])];save(s);bar.style.width='100%';const mins=Math.max(1,Math.round((Date.now()-start)/60000));const res=$('.inv47-result',main);res.style.display='block';res.innerHTML=`<strong>${score}/${c.questions.length} · ${p}%</strong><p>${p===100?'Очень точный разбор: ты не вышла за пределы доказанных фактов.':p>=80?'Сильный разбор. Посмотри объяснение к ошибочному пункту и найди, где вывод стал слишком широким.':'Вернись к материалам и отдельно восстанови хронологию. В этих кейсах важнее качество вывода, чем скорость.'}</p><div class="inv47-mini-tags"><span>Фактическое время: ${mins} мин</span><span>Лучший результат: ${s.best}%</span></div><button class="inv47-submit again" style="margin-top:12px">К расследованиям</button>`;$('.again',res).onclick=()=>dashboard(root)
        }
      } else {const tab=c.tabs.find(t=>t.id===active);main.innerHTML=`<section class="inv47-panel"><h3>${tab.label}</h3><p>Изучи этот блок и сопоставь его с остальными. Не делай окончательный вывод, пока не проверишь всю цепочку материалов.</p>${tab.html}</section>`}
      const ta=$('textarea',main);if(ta)ta.oninput=e=>saveNote(c.id,e.target.value)
    }
    $$('.inv47-sidebar [data-tab]',root).forEach(b=>b.onclick=()=>{active=b.dataset.tab;render()});render()
  }

  function mount(){
    const page=$('.page');if(!page||!$('.practice-hero',page)||$('.inv47-wrap',page))return
    const root=document.createElement('section');root.className='inv47-wrap';page.appendChild(root);dashboard(root)
  }
  let busy=false;const scan=()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;mount()})};new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()
})()
