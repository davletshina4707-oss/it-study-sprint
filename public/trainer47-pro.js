(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)]
  const KEY='academy47-pro-trainer-v2'
  const RECENT='academy47-pro-recent-v2'
  const rnd=n=>Math.floor(Math.random()*n)
  const shuffle=a=>[...a].sort(()=>Math.random()-.5)
  const sample=(a,n)=>shuffle(a).slice(0,n)
  const state=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"sessions":0,"best":0,"attention":0,"logic":0}') }catch{return{sessions:0,best:0,attention:0,logic:0}}}
  const recent=()=>{try{return JSON.parse(localStorage.getItem(RECENT)||'[]')}catch{return[]}}
  const saveRecent=id=>localStorage.setItem(RECENT,JSON.stringify([id,...recent().filter(x=>x!==id)].slice(0,18)))

  function countTarget(level){
    const len=level==='hard'?100:80,target=String(rnd(9)+1),near=target==='9'?'8':String(Number(target)+1),cells=[]
    for(let i=0;i<len;i++)cells.push(Math.random()<.17?target:(Math.random()<.42?near:String(rnd(10))))
    const count=cells.filter(x=>x===target).length
    const opts=shuffle([count,count+1,Math.max(0,count-1),count+2])
    return {id:`att-count-${target}-${len}`,cat:'attention',tag:'Внимательность · счёт',title:`Сколько раз встречается цифра ${target}?`,lead:'Не считай хаотично. Разбей поле на строки и веди промежуточный счёт. На сложном уровне поле длиннее и больше похожих цифр.',visual:`<div class="a47-pro-codewall">${cells.join(' ')}</div>`,options:opts.map(String),answer:opts.indexOf(count),explain:`Правильный ответ: ${count}. Надёжнее считать по строкам и фиксировать промежуточный итог, чем несколько раз возвращаться глазами назад.`}
  }

  function compareCodes(level){
    const len=level==='hard'?12:9
    const a=Array.from({length:len},()=>String(rnd(10)))
    const pos=rnd(len),b=[...a];b[pos]=String((Number(b[pos])+rnd(8)+1)%10)
    const opts=shuffle([pos+1,Math.max(1,pos),Math.min(len,pos+2),rnd(len)+1]).filter((x,i,z)=>z.indexOf(x)===i).slice(0,4)
    while(opts.length<4){const x=rnd(len)+1;if(!opts.includes(x))opts.push(x)}
    return {id:`att-compare-${len}-${pos}`,cat:'attention',tag:'Внимательность · сверка',title:'Найди позицию расхождения',lead:'Перед тобой две почти одинаковые цифровые записи. Определи номер позиции слева, где они различаются.',visual:`<div class="a47-pro-compare"><div class="a47-pro-record"><small>оригинал</small>${a.join(' ')}</div><div class="a47-pro-record"><small>копия</small>${b.join(' ')}</div></div>`,options:opts.map(x=>`Позиция ${x}`),answer:opts.indexOf(pos+1),explain:`Различие находится на позиции ${pos+1}. Для длинных кодов лучше сравнивать блоками по 3–4 символа.`}
  }

  function oddCell(level){
    const size=level==='hard'?90:70
    const pairs=[['O','0'],['B','8'],['S','5'],['I','1'],['●','○'],['◆','◇'],['▲','△']]
    const [base,odd]=pairs[rnd(pairs.length)],pos=rnd(size),cells=Array.from({length:size},(_,i)=>i===pos?odd:base)
    return {id:`att-odd-${base}-${size}-${pos}`,cat:'attention',tag:'Внимательность · визуальный поиск',title:'Найди единственный другой символ',lead:'Здесь специально используются похожие символы. Выбери один отличающийся элемент.',tap:true,cells,answer:pos,explain:'При большом поле эффективнее сканировать фиксированными вертикальными или горизонтальными полосами, а не пытаться охватить всё сразу.'}
  }

  function memoryBoard(level){
    const icons=['◆','●','▲','■','✦','⬟','♥','★','○','◇','△','□','✚','☀','☂','☾']
    const seq=shuffle(icons).slice(0,16),targetIndex=rnd(16),target=seq[targetIndex]
    const row=Math.floor(targetIndex/4)+1,col=targetIndex%4+1
    const distract=sample(icons.filter(x=>x!==target),3),opts=shuffle([`Ряд ${row}, столбец ${col}`,`Ряд ${Math.max(1,5-row)}, столбец ${col}`,`Ряд ${row}, столбец ${Math.max(1,5-col)}`,`Ряд ${col}, столбец ${row}`])
    return {id:`att-memory-${target}-${targetIndex}`,cat:'attention',tag:'Внимательность · рабочая память',title:`Запомни расположение символа ${target}`,lead:`Поле исчезнет через ${level==='hard'?4:6} секунд. После этого нужно указать координату нужного символа.`,memory:true,seq,target,seconds:level==='hard'?4:6,options:opts,answer:opts.indexOf(`Ряд ${row}, столбец ${col}`),explain:`Символ ${target} находился: ряд ${row}, столбец ${col}. Полезно кодировать расположение словами, а не только пытаться удержать картинку.`}
  }

  function discrepancyTable(level){
    const rows=[
      ['А-14','07.09','V47-82','128'],['Б-03','12.10','M74-19','256'],['В-27','21.11','K47-51','512'],['Г-09','05.12','R74-33','1024'],['Д-18','19.01','T47-64','2048']
    ]
    const copy=rows.map(r=>[...r]),ri=rnd(rows.length),ci=rnd(4)
    if(ci===0)copy[ri][ci]=copy[ri][ci].replace(/\d/,String((rnd(8)+1)))
    if(ci===1)copy[ri][ci]=copy[ri][ci].replace(/^\d\d/,String(rnd(27)+1).padStart(2,'0'))
    if(ci===2)copy[ri][ci]=copy[ri][ci].split('').reverse().join('')
    if(ci===3)copy[ri][ci]=String(Number(copy[ri][ci])+(level==='hard'?64:32))
    const fields=['ID','Дата','Код','Объём'],correct=`Строка ${ri+1}, ${fields[ci]}`
    const opts=shuffle([correct,`Строка ${((ri+1)%5)+1}, ${fields[ci]}`,`Строка ${ri+1}, ${fields[(ci+1)%4]}`,`Строка ${((ri+2)%5)+1}, ${fields[(ci+2)%4]}`])
    const table=(title,data)=>`<div><b style="display:block;margin:0 0 7px">${title}</b><table class="a47-pro-table"><thead><tr>${fields.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${data.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    return {id:`att-table-${ri}-${ci}`,cat:'attention',tag:'Внимательность · документы',title:'Найди одно несоответствие в копии',lead:'Сравни оригинал и копию. Отличается ровно одно поле. Старайся проверять колонку за колонкой, а не всю строку сразу.',visual:`<div class="a47-pro-compare">${table('Оригинал',rows)}${table('Копия',copy)}</div>`,options:opts,answer:opts.indexOf(correct),explain:`Ошибка: ${correct}. Раздельная проверка ID, дат, кодов и чисел обычно надёжнее общего беглого взгляда.`}
  }

  function sequence(level){
    const variants=level==='hard'?[{s:[3,7,15,31,63],a:127,r:'Каждый раз ×2 +1.'},{s:[2,6,15,31,56],a:92,r:'Прибавляются 4,9,16,25, дальше 36.'},{s:[81,27,9,3,1],a:1/3,r:'Каждый раз делим на 3.'},{s:[5,8,14,23,35],a:50,r:'Разности +3,+6,+9,+12, дальше +15.'}]:[{s:[4,7,10,13,16],a:19,r:'Каждый раз +3.'},{s:[2,4,8,16,32],a:64,r:'Каждый раз ×2.'},{s:[1,4,9,16,25],a:36,r:'Квадраты натуральных чисел.'},{s:[3,5,8,12,17],a:23,r:'Разности +2,+3,+4,+5, дальше +6.'}]
    const v=variants[rnd(variants.length)],opts=shuffle([v.a,typeof v.a==='number'?v.a+2:0,typeof v.a==='number'?v.a-2:1,typeof v.a==='number'?v.a*2:2]).filter((x,i,z)=>z.indexOf(x)===i)
    return {id:`logic-seq-${v.s.join('-')}`,cat:'logic',tag:'Логика · последовательности',title:`Продолжи ряд: ${v.s.join(' · ')} · ?`,lead:'Проверь предполагаемое правило на всех переходах. На сложном уровне правило может зависеть от разностей второго порядка или чередования операций.',options:opts.map(String),answer:opts.indexOf(v.a),explain:v.r}
  }

  function seating(level){
    const people=level==='hard'?['Аня','Борис','Глеб','Даша','Егор']:['Аня','Борис','Глеб','Даша']
    const answer=level==='hard'?'Глеб':'Даша'
    const lead=level==='hard'
      ?'Пять человек сидят в ряд. Аня левее Бориса. Егор сидит с краю. Даша не рядом с Егором. Глеб находится между Аней и Дашей. Борис не с краю. Кто может занимать центральное место при всех условиях?'
      :'Четыре человека сидят в ряд. Аня левее Бориса. Глеб сидит с краю. Даша не рядом с Глебом. Борис не с краю. Кто из перечисленных обязательно может оказаться правее Ани и не на краю?'
    const opts=shuffle(people)
    return {id:`logic-seat-${level}-${rnd(9999)}`,cat:'logic',tag:'Логика · ограничения',title:'Задача на размещение',lead,options:opts,answer:opts.indexOf(answer),explain:level==='hard'?'Удобнее выписать позиции 1–5 и последовательно исключать запрещённые места. Центральная позиция совместима с условиями для Глеба.':'После исключения края для Бориса и соседства с Глебом наиболее согласованный вариант среди ответов — Даша. В таких задачах надёжнее рисовать места и отмечать запреты.'}
  }

  function truthLie(level){
    const opts=['Аня','Борис','Вика','Глеб']
    return {id:`logic-truth-${level}-${rnd(9999)}`,cat:'logic',tag:'Логика · истина/ложь',title:'Кто говорит правду?',lead:level==='hard'?'Из четырёх людей ровно двое говорят правду. Аня: «Борис лжёт». Борис: «Вика говорит правду». Вика: «Глеб лжёт». Глеб: «Аня и Вика говорят одинаково — обе правду или обе ложь». Кто из вариантов точно говорит правду?':'Ровно один из трёх говорит правду. Аня: «Борис говорит правду». Борис: «Вика лжёт». Вика: «Аня лжёт». Кто говорит правду?',options:level==='hard'?opts:['Аня','Борис','Вика','Определить нельзя'],answer:level==='hard'?1:2,explain:level==='hard'?'Проверка вариантов по условию «ровно две истины» оставляет согласованную конфигурацию, где Борис говорит правду.':'Если Вика говорит правду, Аня лжёт; тогда её фраза о Борисе ложна, значит Борис тоже лжёт. Получается ровно одна истина — у Вики.'}
  }

  function implication(level){
    const bank=[
      {q:'Если программа прошла все тесты, её отправляют на релиз. Программу отправили на релиз. Что следует?',o:['Она точно прошла все тесты','Она могла пройти тесты, но это не доказано только из этих двух фраз','Тестов не было','Релиз отменён'],a:1,e:'Из A→B и факта B нельзя вывести A. Это ошибка утверждения следствия.'},
      {q:'Если число кратно 12, оно кратно 3. Число не кратно 3. Что следует?',o:['Оно не кратно 12','Оно кратно 12','Ничего нельзя сказать','Оно обязательно простое'],a:0,e:'Это корректная контрапозиция: A→B эквивалентно ¬B→¬A.'},
      {q:'Чтобы получить доступ, необходимо иметь пропуск. У Иры нет пропуска. Что следует?',o:['Доступ невозможен','Доступ гарантирован','Она администратор','Ничего'],a:0,e:'Если пропуск необходим, отсутствие необходимого условия исключает результат.'}
    ];const v=bank[rnd(bank.length)]
    return {id:`logic-impl-${bank.indexOf(v)}-${level}`,cat:'logic',tag:'Логика · условные выводы',title:'Какой вывод обязателен?',lead:v.q,options:v.o,answer:v.a,explain:v.e}
  }

  function setPuzzle(level){
    const total=level==='hard'?60:40,a=level==='hard'?35:24,b=level==='hard'?28:19,both=level==='hard'?15:11
    const union=a+b-both,neither=total-union
    const opts=shuffle([neither,neither+2,Math.max(0,neither-3),total-both])
    return {id:`logic-set-${total}-${a}-${b}-${both}`,cat:'logic',tag:'Логика · множества',title:'Сколько не входит ни в одну группу?',lead:`В группе ${total} человек. ${a} изучают Python, ${b} — английский, ${both} изучают и Python, и английский. Сколько человек не изучают ни то ни другое?`,options:opts.map(String),answer:opts.indexOf(neither),explain:`Сначала объединение: ${a}+${b}−${both}=${union}. Затем ${total}−${union}=${neither}. Пересечение вычитается, потому что было посчитано дважды.`}
  }

  function visualPattern(level){
    const arrows=['↑','→','↓','←'];const start=rnd(4),board=[]
    for(let i=0;i<9;i++)board.push(arrows[(start+i)%4]);board[8]='?';const correct=arrows[(start+8)%4],opts=shuffle(arrows)
    const svg=`<svg class="a47-pro-svg" viewBox="0 0 480 280" aria-label="матрица направлений"><g font-family="system-ui" font-size="54" text-anchor="middle" fill="#312e81">${board.map((x,i)=>`<text x="${90+(i%3)*150}" y="${78+Math.floor(i/3)*85}">${x}</text>`).join('')}</g></svg>`
    return {id:`logic-pattern-${start}-${level}`,cat:'logic',tag:'Логика · визуальная матрица',title:'Какое направление должно стоять вместо ?',lead:'Направление последовательно поворачивается на 90° по часовой стрелке. Проследи закономерность по всей матрице.',visual:svg,options:opts,answer:opts.indexOf(correct),explain:`Последовательность идёт ↑ → ↓ ← и повторяется. Поэтому недостающий символ — ${correct}.`}
  }

  const generators={attention:[countTarget,compareCodes,oddCell,memoryBoard,discrepancyTable],logic:[sequence,seating,truthLie,implication,setPuzzle,visualPattern]}
  function build(mode,level){
    const wanted=mode==='mixed'?8:7,out=[],used=new Set(),rec=recent()
    let tries=0
    while(out.length<wanted&&tries<80){tries++;const cat=mode==='mixed'?(out.length%2?'logic':'attention'):mode;const fn=generators[cat][rnd(generators[cat].length)],t=fn(level);if(used.has(t.id)||rec.includes(t.id))continue;used.add(t.id);out.push(t)}
    while(out.length<wanted){const cat=mode==='logic'?'logic':mode==='attention'?'attention':out.length%2?'logic':'attention';out.push(generators[cat][rnd(generators[cat].length)](level))}
    return mode==='mixed'?shuffle(out):out
  }

  function decorate(){
    const page=$('.page');if(!page||!$('.practice-hero',page)||$('.a47-pro-shell',page))return
    const old=$('.a47-trainer-shell',page);if(old)old.style.display='none'
    const hero=$('.practice-hero',page);hero.style.display='none';const grid=$('.practice-grid',page);if(grid)grid.style.display='none'
    const shell=document.createElement('section');shell.className='a47-pro-shell';page.insertBefore(shell,hero)
    let mode='mixed',level='medium',tasks=build(mode,level),idx=0,score=0,catScore={attention:[0,0],logic:[0,0]}

    const header=()=>{const s=state();return `<div class="a47-pro-head"><div><span class="a47-pro-kicker">ACADEMY 47 · PRO TRAINER</span><h2>Внимание + логика без повторов</h2><p>Задачи генерируются заново: цифровые сверки, память на расположение, таблицы с ошибками, визуальные матрицы, условные выводы, множества и многослойные последовательности.</p></div><div class="a47-pro-summary"><div><strong>${score}/${Math.min(idx,tasks.length)}</strong><span>текущий результат</span></div><div><strong>${s.best||0}%</strong><span>лучший результат</span></div><div><strong>${s.sessions||0}</strong><span>сессий</span></div><div><strong>${level==='hard'?'HARD':'PRO'}</strong><span>сложность</span></div></div></div><div class="a47-pro-controls"><div class="a47-pro-tabs"><button data-mode="mixed" class="${mode==='mixed'?'active':''}">Смешанная</button><button data-mode="attention" class="${mode==='attention'?'active':''}">Внимание</button><button data-mode="logic" class="${mode==='logic'?'active':''}">Логика</button></div><div class="a47-pro-levels"><button data-level="medium" class="${level==='medium'?'active':''}">Продвинутый</button><button data-level="hard" class="${level==='hard'?'active':''}">Сложный</button></div></div>`}
    const bindControls=()=>{
      $$('.a47-pro-tabs button',shell).forEach(b=>b.onclick=()=>{mode=b.dataset.mode;reset()})
      $$('.a47-pro-levels button',shell).forEach(b=>b.onclick=()=>{level=b.dataset.level;reset()})
    }
    function reset(){tasks=build(mode,level);idx=0;score=0;catScore={attention:[0,0],logic:[0,0]};render()}
    function save(){const s=state(),pct=Math.round(score/tasks.length*100);localStorage.setItem(KEY,JSON.stringify({sessions:(s.sessions||0)+1,best:Math.max(s.best||0,pct),last:pct,attention:catScore.attention[1]?Math.round(catScore.attention[0]/catScore.attention[1]*100):s.attention||0,logic:catScore.logic[1]?Math.round(catScore.logic[0]/catScore.logic[1]*100):s.logic||0,date:new Date().toISOString().slice(0,10)}));tasks.forEach(t=>saveRecent(t.id))}
    function end(){save();const pct=Math.round(score/tasks.length*100),weak=catScore.attention[1]&&catScore.logic[1]?(catScore.attention[0]/catScore.attention[1]<catScore.logic[0]/catScore.logic[1]?'внимательность':'логика'):mode==='attention'?'внимательность':'логика';shell.innerHTML=header()+`<div class="a47-pro-end"><div class="a47-pro-score-ring" style="--p:${pct*3.6}deg"><strong>${pct}%</strong></div><h3>${pct>=88?'Очень сильная сессия':pct>=70?'Хороший уровень':'Есть хороший запас для роста'}</h3><p>Результат ${score}/${tasks.length}. Слабее сегодня выглядел блок «${weak}». Следующая сессия создаст новый набор задач — недавно показанные варианты специально исключаются.</p><div class="a47-pro-actions"><button class="new">Новая сессия</button><button class="secondary harder">${level==='hard'?'Ещё сложная':'Перейти на сложный'}</button></div></div>`;bindControls();$('.new',shell).onclick=reset;$('.harder',shell).onclick=()=>{level='hard';reset()}}
    function render(){
      if(idx>=tasks.length){end();return}
      const t=tasks[idx];shell.innerHTML=header()+`<div class="a47-pro-body"><div class="a47-pro-topline"><span class="a47-pro-count">Задача ${idx+1} из ${tasks.length}</span><span class="a47-pro-tag">${t.tag}</span></div><h3 class="a47-pro-title">${t.title}</h3><p class="a47-pro-lead">${t.lead}</p><div class="a47-pro-visual"></div><div class="a47-pro-feedback"></div><div class="a47-pro-nextrow"><span>${level==='hard'?'Сложный уровень · точность важнее скорости':'Продвинутый уровень'}</span><button>Следующая задача →</button></div></div>`;bindControls()
      const visual=$('.a47-pro-visual',shell),fb=$('.a47-pro-feedback',shell),next=$('.a47-pro-nextrow button',shell);let done=false
      const finish=(ok,msg)=>{if(done)return;done=true;catScore[t.cat][1]++;if(ok){score++;catScore[t.cat][0]++}fb.className=`a47-pro-feedback ${ok?'good':'bad'}`;fb.innerHTML=`<b>${ok?'Верно ✓':'Не совсем'}</b><br>${msg}`;next.style.display='block';next.onclick=()=>{idx++;render()}}
      const choiceButtons=(options)=>{visual.innerHTML+=(t.visual||'')+`<div class="a47-pro-options">${options.map((x,i)=>`<button data-i="${i}">${x}</button>`).join('')}</div>`;$$('.a47-pro-options button',visual).forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i),ok=i===t.answer;$$('.a47-pro-options button',visual).forEach((x,j)=>{x.disabled=true;if(j===t.answer)x.classList.add('correct');else if(j===i)x.classList.add('wrong')});finish(ok,t.explain)})}
      if(t.tap){visual.innerHTML=`<div class="a47-pro-grid">${t.cells.map((x,i)=>`<button data-i="${i}">${x}</button>`).join('')}</div>`;$$('.a47-pro-grid button',visual).forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i),ok=i===t.answer;if(ok)b.classList.add('correct');else{b.classList.add('wrong');$$('.a47-pro-grid button',visual)[t.answer].classList.add('correct')}$$('.a47-pro-grid button',visual).forEach(x=>x.disabled=true);finish(ok,t.explain)})}
      else if(t.memory){visual.innerHTML=`<div class="a47-pro-memory-board">${t.seq.map(x=>`<div class="a47-pro-memory-cell">${x}</div>`).join('')}</div><div class="a47-pro-memory-cover">Запоминай… ${t.seconds}</div>`;let sec=t.seconds;const timer=setInterval(()=>{sec--;const c=$('.a47-pro-memory-cover',visual);if(c)c.textContent=`Запоминай… ${sec}`;if(sec<=0){clearInterval(timer);visual.innerHTML=`<div class="a47-pro-memory-cover">Поле скрыто. Где находился символ ${t.target}?</div>`;choiceButtons(t.options)}},1000)}
      else choiceButtons(t.options)
    }
    render()
  }
  let busy=false;const scan=()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;decorate()})};new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()
})()
