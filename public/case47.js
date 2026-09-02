(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)]
  const KEY='academy47-case-stats-v1'
  const rnd=n=>Math.floor(Math.random()*n)
  const shuffle=a=>[...a].sort(()=>Math.random()-.5)
  const empty=()=>({docs:{c:0,t:0},route:{c:0,t:0},memory:{c:0,t:0},deduction:{c:0,t:0},cases:0,best:0})
  const load=()=>{try{return {...empty(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return empty()}}
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s))
  const add=(cat,c,t)=>{const s=load();s[cat]=s[cat]||{c:0,t:0};s[cat].c+=c;s[cat].t+=t;save(s)}
  const pct=x=>x&&x.t?Math.round(x.c/x.t*100):0

  function statsHtml(){
    const s=load(), rows=[['Документы','docs'],['Маршруты','route'],['Зрительная память','memory'],['Дедукция','deduction']]
    return `<div class="case47-stats"><div class="case47-stats-head"><div><span>КАРТА ОШИБОК</span><h3>Что даётся хуже всего</h3></div><div><strong>${s.cases||0}</strong><small>длинных кейсов</small></div></div>${rows.map(([n,k])=>{const p=pct(s[k]);return `<div class="case47-stat"><span>${n}</span><i><em style="width:${p}%"></em></i><b>${s[k].t?p+'%':'—'}</b></div>`}).join('')}</div>`
  }

  function finish(zone,title,score,total,start,details){
    const s=load(),p=Math.round(score/total*100);s.cases=(s.cases||0)+1;s.best=Math.max(s.best||0,p);save(s)
    const min=Math.max(1,Math.round((Date.now()-start)/60000))
    zone.innerHTML=`<div class="case47-result"><div class="case47-ring" style="--p:${p*3.6}deg"><strong>${p}%</strong></div><span>CASE 47 · завершено</span><h3>${title}</h3><p>${details}</p><div class="case47-result-meta"><b>${score}/${total}</b><small>точных решений</small><b>${min} мин</b><small>фактическое время</small></div><button data-back>Вернуться к кейсам</button></div>`
    $('[data-back]',zone).onclick=()=>renderDashboard(zone)
  }

  function makeDocs(zone){
    const start=Date.now(), headers=['ID','Дата','Код','Сумма','Статус']
    const base=[['A-047','03.09','Q7M-482','12 640','готово'],['B-193','05.09','V4K-731','8 290','проверка'],['C-528','08.09','R9T-164','15 075','готово'],['D-614','11.09','P2L-905','4 880','архив'],['E-270','14.09','H8N-347','21 430','проверка'],['F-851','18.09','M3S-726','9 615','готово']]
    const copy=base.map(r=>[...r]);const cells=[];while(cells.length<5){const r=rnd(base.length),c=rnd(headers.length),id=`${r}:${c}`;if(!cells.includes(id))cells.push(id)}
    cells.forEach(id=>{const [r,c]=id.split(':').map(Number),v=copy[r][c];if(c===0)copy[r][c]=v.slice(0,-1)+String((Number(v.slice(-1))+3)%10);if(c===1)copy[r][c]=String((Number(v.slice(0,2))+2)%28||1).padStart(2,'0')+v.slice(2);if(c===2)copy[r][c]=v.slice(0,2)+v[3]+v[2]+v.slice(4);if(c===3)copy[r][c]=String(Number(v.replace(/ /g,''))+110).replace(/\B(?=(\d{3})+(?!\d))/g,' ');if(c===4)copy[r][c]=v==='готово'?'проверка':'готово'})
    const table=(title,data,clickable)=>`<div class="case47-docbox"><b>${title}</b><div class="case47-table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${data.map((r,ri)=>`<tr>${r.map((v,ci)=>`<td ${clickable?`data-cell="${ri}:${ci}"`:''}>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`
    zone.innerHTML=`<div class="case47-casehead"><span>10–15 МИН · ВНИМАТЕЛЬНОСТЬ</span><h3>Дело №47: контроль копии документа</h3><p>В копию попало ровно <b>5 ошибок</b>. Они могут быть в ID, датах, кодах, суммах или статусах. Нажми на пять ячеек копии, которые отличаются от оригинала. Не спеши: лучше проверять колонку за колонкой.</p></div><div class="case47-docgrid">${table('Оригинал',base,false)}${table('Копия — выбирай ошибки',copy,true)}</div><div class="case47-selection">Выбрано: <b>0/5</b><button disabled>Проверить 5 ячеек</button></div><div class="case47-feedback"></div>`
    const selected=new Set(), counter=$('.case47-selection b',zone),check=$('.case47-selection button',zone),fb=$('.case47-feedback',zone)
    $$('[data-cell]',zone).forEach(td=>td.onclick=()=>{const id=td.dataset.cell;if(selected.has(id)){selected.delete(id);td.classList.remove('selected')}else if(selected.size<5){selected.add(id);td.classList.add('selected')}counter.textContent=`${selected.size}/5`;check.disabled=selected.size!==5})
    check.onclick=()=>{const correct=cells.filter(x=>selected.has(x)).length;add('docs',correct,5);$$('[data-cell]',zone).forEach(td=>{td.onclick=null;if(cells.includes(td.dataset.cell))td.classList.add('correct');else if(selected.has(td.dataset.cell))td.classList.add('wrong')});fb.innerHTML=`<b>${correct===5?'Все пять найдены ✓':`Точно найдено ${correct} из 5`}</b><p>Зелёным отмечены реальные расхождения. Для подобных таблиц используй независимые проходы: сначала ID, потом даты, коды, числа и только затем статусы.</p><button>Завершить кейс</button>`;fb.querySelector('button').onclick=()=>finish(zone,'Контроль копии документа',correct,5,start,correct===5?'Ты нашла все расхождения без лишних отметок.':'Часть расхождений ускользнула. Этот тип ошибок будет отражён в карте навыков.')}
  }

  function makeRoute(zone){
    const start=Date.now(), dirs={N:[-1,0,'↑','север'],E:[0,1,'→','восток'],S:[1,0,'↓','юг'],W:[0,-1,'←','запад']}, keys=Object.keys(dirs)
    let sr=2+rnd(4),sc=2+rnd(4),r=sr,c=sc,last='',segments=[],path=[[r,c]],tries=0
    while(segments.length<10&&tries<200){tries++;const d=keys[rnd(4)];if(d===last)continue;const len=1+rnd(3),[dr,dc]=dirs[d];const nr=r+dr*len,nc=c+dc*len;if(nr<0||nr>7||nc<0||nc>7)continue;segments.push([d,len]);for(let i=0;i<len;i++){r+=dr;c+=dc;path.push([r,c])}last=d}
    const final=[r,c], rows='ABCDEFGH',name=([rr,cc])=>`${rows[rr]}${cc+1}`,northern=Math.min(...path.map(x=>x[0])),turns=segments.length-1,visited=[...new Set(path.map(name))]
    const checkpoint=visited[2+rnd(Math.max(1,visited.length-2))]
    const all=[];for(let rr=0;rr<8;rr++)for(let cc=0;cc<8;cc++)all.push(`${rows[rr]}${cc+1}`)
    const notVisited=shuffle(all.filter(x=>!visited.includes(x))).slice(0,3)
    const questions=[
      {q:'В какой клетке закончится маршрут?',o:shuffle([name(final),...shuffle(all.filter(x=>x!==name(final))).slice(0,3)]),a:name(final),e:`Финальная клетка — ${name(final)}.`},
      {q:'Сколько раз меняется направление между сегментами?',o:shuffle([String(turns),String(turns-1),String(turns+1),String(Math.max(1,turns-2))]),a:String(turns),e:`Сегментов ${segments.length}, поэтому переходов между направлениями ${turns}.`},
      {q:'Какая самая северная строка была достигнута?',o:shuffle([rows[northern],...shuffle(rows.split('').filter(x=>x!==rows[northern])).slice(0,3)]),a:rows[northern],e:`Самая северная достигнутая строка — ${rows[northern]}.`},
      {q:'Какую контрольную клетку маршрут действительно проходит?',o:shuffle([checkpoint,...notVisited]),a:checkpoint,e:`Маршрут проходит через ${checkpoint}.`}
    ]
    const cells=[];for(let rr=0;rr<8;rr++)for(let cc=0;cc<8;cc++)cells.push(`<div class="case47-mapcell ${rr===sr&&cc===sc?'start':''}"><small>${name([rr,cc])}</small>${rr===sr&&cc===sc?'<b>START</b>':''}</div>`)
    zone.innerHTML=`<div class="case47-casehead"><span>10–15 МИН · ПРОСТРАНСТВЕННАЯ ЛОГИКА</span><h3>Маршрут 47</h3><p>Начало: <b>${name([sr,sc])}</b>. Выполняй команды строго по порядку. Сначала реши маршрут на бумаге или мысленно, затем ответь на четыре контрольных вопроса.</p></div><div class="case47-route-layout"><div class="case47-map">${cells.join('')}</div><div class="case47-commands"><b>Команды</b>${segments.map(([d,n],i)=>`<span><em>${i+1}</em>${dirs[d][2]} ${n} кл. <small>${dirs[d][3]}</small></span>`).join('')}</div></div><div class="case47-q"></div>`
    let qi=0,score=0;const qbox=$('.case47-q',zone)
    const renderQ=()=>{if(qi>=questions.length){add('route',score,questions.length);finish(zone,'Маршрут 47',score,questions.length,start,score===questions.length?'Маршрут и все контрольные свойства рассчитаны точно.':'Ошибки в маршруте сохранены в карте навыков — полезно отдельно тренировать пошаговое отслеживание координат.');return}const q=questions[qi];qbox.innerHTML=`<span>Контроль ${qi+1}/4</span><h4>${q.q}</h4><div>${q.o.map(o=>`<button>${o}</button>`).join('')}</div><p></p>`;$$('button',qbox).forEach(b=>b.onclick=()=>{const ok=b.textContent===q.a;if(ok)score++;$$('button',qbox).forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$$('button',qbox).find(x=>x.textContent===q.a)?.classList.add('correct');$('p',qbox).innerHTML=`<b>${ok?'Верно ✓':'Ошибка'}</b> ${q.e} <button class="next">Дальше →</button>`;$('.next',qbox).onclick=()=>{qi++;renderQ()}})};renderQ()
  }

  function makeMemory(zone){
    const start=Date.now(), icons=['📘','🔑','⌚','✏️','☕','🎧','📱','🧩','💡','📎','🧭','🏒','🟡','🔷','📝','🕶️'],arr=shuffle(icons),shown=arr.slice(0,12)
    const positions=shown.map((x,i)=>({x,row:Math.floor(i/4)+1,col:i%4+1})), target1=positions[rnd(positions.length)],target2=positions.filter(x=>x.x!==target1.x)[rnd(positions.length-1)]
    const rowItems=row=>positions.filter(x=>x.row===row).map(x=>x.x), chosenRow=1+rnd(3), correctRow=rowItems(chosenRow).join(' ')
    const absent=shuffle(icons.filter(x=>!shown.includes(x)))[0]
    const qs=[
      {q:`Где находился предмет ${target1.x}?`,a:`Ряд ${target1.row}, столбец ${target1.col}`,o:[]},
      {q:`Где находился предмет ${target2.x}?`,a:`Ряд ${target2.row}, столбец ${target2.col}`,o:[]},
      {q:`Какой набор предметов был в ряду ${chosenRow}?`,a:correctRow,o:[]},
      {q:'Какого предмета на поле НЕ было?',a:absent,o:shuffle([absent,...shuffle(shown).slice(0,3)])}
    ]
    qs.slice(0,2).forEach(q=>{const pos=q.a.match(/\d/g).map(Number);q.o=shuffle([q.a,`Ряд ${Math.max(1,4-pos[0])}, столбец ${pos[1]}`,`Ряд ${pos[0]}, столбец ${Math.max(1,5-pos[1])}`,`Ряд ${pos[1]}, столбец ${pos[0]}`])})
    qs[2].o=shuffle([correctRow,...[1,2,3].filter(x=>x!==chosenRow).map(r=>rowItems(r).join(' ')),shuffle(shown).slice(0,4).join(' ')].slice(0,4))
    zone.innerHTML=`<div class="case47-casehead"><span>8–12 МИН · ЗРИТЕЛЬНАЯ ПАМЯТЬ</span><h3>Сцена наблюдения</h3><p>У тебя будет <b>10 секунд</b>, чтобы запомнить 12 объектов и их положение. Потом поле исчезнет. Не записывай — задача именно на зрительную и рабочую память.</p></div><div class="case47-memory"><div class="case47-memory-grid">${shown.map((x,i)=>`<div><small>${Math.floor(i/4)+1}:${i%4+1}</small><b>${x}</b></div>`).join('')}</div><div class="case47-memory-time">10</div></div><div class="case47-q hidden"></div>`
    let sec=10;const timer=setInterval(()=>{sec--;$('.case47-memory-time',zone).textContent=sec;if(sec<=0){clearInterval(timer);$('.case47-memory',zone).innerHTML='<div class="case47-memory-hidden">Поле скрыто. Теперь отвечай по памяти.</div>';$('.case47-q',zone).classList.remove('hidden');run()}},1000)
    let qi=0,score=0;const run=()=>{const qbox=$('.case47-q',zone);if(qi>=qs.length){add('memory',score,qs.length);finish(zone,'Сцена наблюдения',score,qs.length,start,score===qs.length?'Очень точная зрительная память: все четыре проверки пройдены.':'Результат сохранён. Следующая сцена будет с новым расположением предметов.');return}const q=qs[qi];qbox.innerHTML=`<span>Вопрос ${qi+1}/4</span><h4>${q.q}</h4><div>${q.o.map(o=>`<button>${o}</button>`).join('')}</div><p></p>`;$$('button',qbox).forEach(b=>b.onclick=()=>{const ok=b.textContent===q.a;if(ok)score++;$$('button',qbox).forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$$('button',qbox).find(x=>x.textContent===q.a)?.classList.add('correct');$('p',qbox).innerHTML=`<b>${ok?'Верно ✓':'Ошибка'}</b> Правильный ответ: ${q.a}. <button class="next">Дальше →</button>`;$('.next',qbox).onclick=()=>{qi++;run()}})}
  }

  const logicCases=[
    {title:'Журнал обработки',people:['Анна','Глеб','Елена','Борис','Даша'],times:['09:00','09:30','10:00','10:30','11:00'],jobs:['Архив','Код','Тест','Схема','Отчёт'],clues:['Архив обработан непосредственно перед Кодом.','Тест выполнялся ровно в 10:00.','Борис работал сразу после Теста.','Даша завершала работу последней.','Анна работала раньше Глеба.','Схема была у Бориса.'],answers:[['Кто работал в 09:30?','Глеб'],['Что обрабатывали в 09:00?','Архив'],['Кто выполнял Тест?','Елена'],['Во сколько работал Борис?','10:30'],['Что было у Даши?','Отчёт']]},
    {title:'Цепочка релиза',people:['Рита','Олег','Максим','Ира','Саша'],times:['09:00','09:30','10:00','10:30','11:00'],jobs:['Docs','Data','Build','Test','Deploy'],clues:['Docs выполнялись непосредственно перед Data.','Build был ровно в 10:00.','Test шёл сразу после Build.','Deploy был последним этапом.','Рита работала раньше Олега.','Максим выполнял Build, а Ира — Test.'],answers:[['Кто работал в 09:30?','Олег'],['Что было в 09:00?','Docs'],['Кто выполнял Build?','Максим'],['Во сколько работала Ира?','10:30'],['Кто выполнял Deploy?','Саша']]},
    {title:'Учебная очередь',people:['Маша','Лена','Павел','Юля','Кирилл'],times:['09:00','09:30','10:00','10:30','11:00'],jobs:['English','Matrix','OS','Logic','Probability'],clues:['English был первым занятием.','Matrix шла сразу после English.','OS начиналась ровно в 10:00.','Logic шла сразу после OS.','Probability была последней.','Маша занималась раньше Лены; Павел — раньше Юли; Кирилл — позже Юли.'],answers:[['Кто занимался в 09:00?','Маша'],['Какой предмет был в 09:30?','Matrix'],['Кто занимался в 10:00?','Павел'],['Что было в 10:30?','Logic'],['Кто завершал очередь?','Кирилл']]}
  ]
  function makeLogic(zone){
    const start=Date.now(),last=Number(localStorage.getItem('academy47-last-logic')||'-1');let ci=rnd(logicCases.length);if(ci===last)ci=(ci+1)%logicCases.length;localStorage.setItem('academy47-last-logic',String(ci));const c=logicCases[ci]
    zone.innerHTML=`<div class="case47-casehead"><span>10–15 МИН · ДЕДУКЦИЯ</span><h3>${c.title}</h3><p>Перед тобой пять временных слотов, пять людей и пять разных задач. По условиям восстанови цепочку. Лучше нарисуй таблицу и исключай невозможные варианты — это именно мини-расследование, а не вопрос на угадывание.</p></div><div class="case47-dossier"><div><b>Люди</b>${c.people.map(x=>`<span>${x}</span>`).join('')}</div><div><b>Время</b>${c.times.map(x=>`<span>${x}</span>`).join('')}</div><div><b>Задачи</b>${c.jobs.map(x=>`<span>${x}</span>`).join('')}</div></div><div class="case47-clues"><b>Условия</b>${c.clues.map((x,i)=>`<p><em>${i+1}</em>${x}</p>`).join('')}</div><div class="case47-q"></div>`
    let qi=0,score=0;const pool=[...c.people,...c.times,...c.jobs]
    const run=()=>{const qbox=$('.case47-q',zone);if(qi>=c.answers.length){add('deduction',score,c.answers.length);finish(zone,c.title,score,c.answers.length,start,score===c.answers.length?'Цепочка восстановлена полностью и без ошибок.':'Часть выводов была неверной. Следующий логический кейс будет другим, а статистика сохранит слабое место.');return}const [question,answer]=c.answers[qi],group=c.people.includes(answer)?c.people:c.times.includes(answer)?c.times:c.jobs,opts=shuffle([answer,...shuffle(group.filter(x=>x!==answer)).slice(0,3)]);qbox.innerHTML=`<span>Вывод ${qi+1}/5</span><h4>${question}</h4><div>${opts.map(o=>`<button>${o}</button>`).join('')}</div><p></p>`;$$('button',qbox).forEach(b=>b.onclick=()=>{const ok=b.textContent===answer;if(ok)score++;$$('button',qbox).forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');$$('button',qbox).find(x=>x.textContent===answer)?.classList.add('correct');$('p',qbox).innerHTML=`<b>${ok?'Верно ✓':'Ошибка'}</b> Правильный вывод: ${answer}. <button class="next">Следующий вывод →</button>`;$('.next',qbox).onclick=()=>{qi++;run()}})};run()
  }

  function renderDashboard(zone){
    const s=load();zone.innerHTML=`<div class="case47-header"><div><span>ACADEMY 47 · LONG CHALLENGES</span><h2>Длинные тренировки 10–15 минут</h2><p>Не один лёгкий вопрос, а полноценная задача из нескольких этапов. Результаты сохраняются, а недавно пройденные варианты меняются.</p></div><div><strong>${s.best||0}%</strong><small>лучший кейс</small></div></div>${statsHtml()}<div class="case47-cards"><button data-case="docs"><span>01</span><b>Контроль документа</b><p>Две большие таблицы и пять спрятанных расхождений.</p><small>внимательность · 10–15 мин</small></button><button data-case="route"><span>02</span><b>Маршрут 47</b><p>Схема 8×8, длинная последовательность команд и 4 проверки.</p><small>пространственная логика · 10–15 мин</small></button><button data-case="memory"><span>03</span><b>Сцена наблюдения</b><p>12 объектов, ограниченное время и вопросы после исчезновения сцены.</p><small>память · 8–12 мин</small></button><button data-case="logic"><span>04</span><b>Логическое дело</b><p>Люди, время, задачи и система условий — восстанови всю цепочку.</p><small>дедукция · 10–15 мин</small></button></div>`
    $$('[data-case]',zone).forEach(b=>b.onclick=()=>({docs:makeDocs,route:makeRoute,memory:makeMemory,logic:makeLogic}[b.dataset.case])(zone))
  }

  function decorate(){const shell=$('.a47-pro-shell');if(!shell||$('.case47-zone'))return;const zone=document.createElement('section');zone.className='case47-zone';shell.insertAdjacentElement('afterend',zone);renderDashboard(zone)}
  let busy=false;const scan=()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;decorate()})};new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()
})()
