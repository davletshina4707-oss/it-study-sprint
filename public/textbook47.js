(()=>{
  const $=(s,r=document)=>r.querySelector(s)
  const data=window.A47_TEXTBOOK||{}
  const aliases={
    math:['Высшая математика'],
    probability:['Теория вероятностей','математическая статистика'],
    informatics:['Информатика'],
    programming:['Программирование'],
    os:['Операционные системы'],
    ai:['Технологии искусственного интеллекта','Искусственный интеллект'],
    english:['Иностранный язык'],
    russian:['Русский язык'],
    history:['История России'],
    'life-safety':['Безопасность жизнедеятельности'],
    statehood:['Основы российской государственности'],
    law:['Правоведение'],
    pe:['Физическая культура и спорт'],
    military:['Военное дело']
  }
  const idForTitle=(title)=>Object.keys(aliases).find(id=>aliases[id].some(x=>title.includes(x)))||null
  const text=(el)=>el?.textContent?.trim()||''
  function topicIndex(title){const m=title.match(/Тема\s*(\d+)/i);return m?Math.max(0,Number(m[1])-1):0}
  function readingTime(profile){const chars=[...profile.core.map(x=>x[1]),...profile.topics.map(x=>x[1])].join(' ').length;return Math.max(35,Math.round(chars/900))}

  function decorateSubject(){
    const hero=$('.subject-hero');if(!hero||$('.a47-volume-card'))return
    const title=text($('h1',hero));const id=idForTitle(title);const profile=data[id];if(!profile)return
    const plan=$('.course-intro')||hero
    const card=document.createElement('section');card.className='a47-volume-card'
    card.innerHTML=`<div class="a47-volume-number">47</div><div><span>Учебниковый режим включён</span><h3>${profile.title}: расширенный учебник</h3><p>Каждая крупная тема дополнена отдельной главой: углубление теории, связи между понятиями, метод решения, типичные ошибки, вопросы на воспроизведение и большой практикум. Материал рассчитан на повторные учебные встречи, а не на одно быстрое чтение.</p></div><div class="a47-volume-stats"><b>${profile.topics.length}</b><small>крупных глав</small><b>${profile.core.length}+</b><small>доп. раздела в каждой</small></div>`
    plan.insertAdjacentElement('afterend',card)
  }

  function decorateLesson(){
    const lecture=$('.lecture');if(!lecture||$('.a47-textbook-volume',lecture))return
    const subjectTitle=text($('.lecture-cover>p',lecture));const id=idForTitle(subjectTitle);const profile=data[id];if(!profile)return
    const lessonTitle=text($('.lecture-cover h1',lecture));const idx=Math.min(topicIndex(lessonTitle),profile.topics.length-1);const topic=profile.topics[idx]||profile.topics[0]
    const body=$('.lecture-body',lecture);if(!body)return
    const block=document.createElement('section');block.className='a47-textbook-volume'
    const checks=[
      `Дай определение центральному понятию темы «${topic[0]}» своими словами.`,
      `Назови минимум три связи этой темы с предыдущими разделами курса.`,
      `Опиши стандартный алгоритм решения типовой задачи без подсказки.`,
      `Приведи собственный пример и объясни каждый шаг.`,
      `Назови две ошибки, которые наиболее вероятны в этой теме.`,
      `Придумай способ независимо проверить полученный результат.`,
      `Объясни, где эта тема применяется за пределами учебной задачи.`,
      `Сформулируй один вопрос, на который пока не можешь уверенно ответить.`
    ]
    block.innerHTML=`
      <header class="a47-textbook-head">
        <div><span>ACADEMY 47 · УЧЕБНИК · РАСШИРЕННАЯ ГЛАВА</span><h2>${topic[0]}</h2><p>Основная лекция выше — только первый слой. Ниже идёт большой учебниковый блок, который нужно проходить медленно: читать, останавливаться, пересказывать и решать.</p></div>
        <div class="a47-book-meter"><strong>${readingTime(profile)}+</strong><small>мин дополнительной работы</small></div>
      </header>
      <div class="a47-topic-deep"><span>01 · УГЛУБЛЕНИЕ ТЕКУЩЕЙ ТЕМЫ</span><h3>${topic[0]}: что нужно понять глубже</h3>${topic[1].split('\n\n').map(p=>`<p>${p}</p>`).join('')}<div class="a47-stop"><b>Стоп на 3 минуты.</b> Закрой этот блок и перескажи его без текста. Если не можешь объяснить идею простыми словами — перечитай только непонятное место.</div></div>
      ${profile.core.map((s,i)=>`<section class="a47-book-section"><span>${String(i+2).padStart(2,'0')} · УЧЕБНИК</span><h3>${s[0]}</h3>${s[1].split('\n\n').map(p=>`<p>${p}</p>`).join('')}<div class="a47-margin-task"><b>Письменно:</b> выпиши 3 ключевые мысли этого раздела, не копируя предложения дословно.</div></section>`).join('')}
      <section class="a47-big-practice"><span>ПРАКТИКУМ · 35–60 МИНУТ</span><h3>Не просто прочитать — сделать</h3><p>Эти задания не обязательно выполнять подряд. Раздели их между учебными встречами по теме. Отмечай те, где потребовалась подсказка: именно их нужно повторить позже.</p><ol>${profile.practice.map(x=>`<li>${x}</li>`).join('')}</ol></section>
      <section class="a47-recall-sheet"><span>АКТИВНОЕ ВОСПРОИЗВЕДЕНИЕ</span><h3>8 вопросов без конспекта</h3><p>Ответы намеренно не показаны рядом. Сначала сформулируй их сама, затем вернись к лекции и проверь точность.</p><div>${checks.map((q,i)=>`<label><input type="checkbox"><b>${i+1}</b><span>${q}</span></label>`).join('')}</div></section>
      <section class="a47-study-method"><div class="a47-study-mark">!</div><div><h3>Как распределить эту главу на несколько занятий</h3><p><b>Встреча 1:</b> основная лекция + первые два учебниковых блока. <b>Встреча 2:</b> оставшиеся разделы + собственный конспект. <b>Встреча 3:</b> практикум без подсказок. <b>Встреча 4:</b> мини-тест по памяти и работа над ошибками. Так одна большая тема действительно становится частью семестрового обучения, а не страницей на десять минут.</p></div></section>`
    const remember=$('.remember',body);if(remember)body.insertBefore(block,remember);else body.appendChild(block)
  }

  let queued=false
  function scan(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorateSubject();decorateLesson()})}
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()
})()