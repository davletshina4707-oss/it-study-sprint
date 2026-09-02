(()=>{
  const KEY='academy47-warmup-2026-09-02'
  const questions=[
    {q:'Сколько разных значений может хранить один бит?',o:['1','2','8','256'],a:1},
    {q:'Сколько бит в одном байте?',o:['2','4','8','10'],a:2},
    {q:'Чему равно двоичное число 1010₂ в десятичной системе?',o:['8','10','12','1010'],a:1},
    {q:'Зачем нужна кодировка текста?',o:['Чтобы связать символы с числовыми кодами','Чтобы увеличить экран','Чтобы заменить процессор','Чтобы удалить файлы'],a:0},
    {q:'Что в цифровом изображении обычно хранится для каждого пикселя?',o:['Только имя файла','Числовая информация о цвете/яркости','Пароль пользователя','Номер процессора'],a:1},
  ]
  let answers={}

  function insertCard(){
    if(document.querySelector('.a47-today-card'))return
    const announcement=document.querySelector('.announcement')
    if(!announcement)return
    const card=document.createElement('section')
    card.className='a47-today-card'+(localStorage.getItem(KEY)==='done'?' a47-done':'')
    card.innerHTML=`<div class="a47-today-icon">47</div><div class="a47-today-copy"><span>2 сентября · подготовка к старту</span><h3>${localStorage.getItem(KEY)==='done'?'Урок на сегодня пройден ✓':'Сегодня: IT-разминка на 30 минут'}</h3><p>Биты, байты, двоичная система и кодирование. Небольшая вводная пара перед первым полноценным учебным днём.</p></div><button type="button">${localStorage.getItem(KEY)==='done'?'Открыть ещё раз':'Начать урок · 30 мин'}</button>`
    card.querySelector('button').addEventListener('click',openLesson)
    announcement.insertAdjacentElement('afterend',card)
  }

  function openLesson(){
    answers={}
    const back=document.createElement('div')
    back.className='a47-modal-backdrop'
    back.innerHTML=`<article class="a47-modal">
      <header class="a47-modal-head"><div><span>ACADEMY 47 · вводное занятие · 30 минут</span><h2>Как компьютер хранит информацию</h2><p>Цель урока — не зубрить определения, а понять общий принцип: компьютер работает с числами, а текст, фотографии, звук и программы становятся числовыми данными по заранее установленным правилам.</p></div><button class="a47-modal-close" aria-label="Закрыть">×</button></header>
      <div class="a47-modal-body">
        <div class="a47-timerline"><span><b>0–5 мин</b>бит и байт</span><span><b>5–11 мин</b>двоичные числа</span><span><b>11–17 мин</b>текст</span><span><b>17–22 мин</b>изображения</span><span><b>22–26 мин</b>практика</span><span><b>26–30 мин</b>тест</span></div>
        <section class="a47-chapter"><small>01 · фундамент</small><h3>Бит: самый маленький выбор</h3><p>Компьютерные схемы удобно строить так, чтобы они надёжно различали два состояния. В абстракции мы обозначаем их как 0 и 1. Одна такая двоичная единица информации называется битом. Один бит хранит не «число от нуля до одного», а выбор между двумя состояниями.</p><p>Если объединить несколько битов, число возможных комбинаций быстро растёт. Два бита дают 4 комбинации: 00, 01, 10, 11. Три бита — 8 комбинаций. В общем случае n бит дают 2ⁿ комбинаций. Именно поэтому восемь бит позволяют представить 256 различных комбинаций.</p><div class="a47-note"><b>Проверь себя:</b> не листая дальше, ответь вслух: почему 3 бита дают именно 8 комбинаций?</div></section>
        <section class="a47-chapter"><small>02 · единицы данных</small><h3>Байт и масштабы хранения</h3><p>Восемь бит образуют байт. Байты удобны как базовые блоки хранения. Дальше используются более крупные единицы: килобайты, мегабайты, гигабайты и терабайты. В реальных системах встречаются десятичные и двоичные соглашения, поэтому числа в свойствах диска и в операционной системе могут немного различаться.</p><p>Главная мысль для начала: размер файла — это количество данных, которое нужно сохранить. Текстовый документ может занимать килобайты или мегабайты, фотография — мегабайты, видео — сотни мегабайт или гигабайты.</p></section>
        <section class="a47-chapter"><small>03 · система счисления</small><h3>Почему 1010₂ — это десять</h3><p>В десятичной системе разряды имеют веса 1, 10, 100, 1000. В двоичной — 1, 2, 4, 8, 16 и так далее. Число 1010₂ читаем справа налево: 0·1 + 1·2 + 0·4 + 1·8 = 10.</p><p>Попробуй 1101₂: 1·1 + 0·2 + 1·4 + 1·8 = 13. Не пытайся читать двоичную запись как обычное десятичное число — это другая система счисления с основанием 2.</p><div class="a47-note"><b>Мини-задача:</b> переведи 111₂ и 10000₂ в десятичную систему. Ответы проверь только после собственного расчёта: 7 и 16.</div></section>
        <section class="a47-chapter"><small>04 · текст как числа</small><h3>Как буква превращается в данные</h3><p>Чтобы хранить текст, нужно договориться, какому числу соответствует каждый символ. Такое соглашение задаёт кодировка. Современный мир широко использует Unicode, который стремится дать кодовые позиции символам разных письменностей, знакам и эмодзи. UTF-8 — один из популярных способов представить эти кодовые позиции в байтах.</p><p>Отсюда появляется важное различие: символ — это смысловая единица текста, а байты — конкретное представление в памяти. Один символ не обязан занимать ровно один байт.</p></section>
        <section class="a47-chapter"><small>05 · изображение как числа</small><h3>Пиксели, цвет и разрешение</h3><p>Растровое изображение состоит из сетки пикселей. Для каждого пикселя хранят числовые значения, описывающие цвет. В распространённой RGB-модели цвет собирается из красной, зелёной и синей составляющих. Чем больше пикселей и чем больше информации приходится на каждый пиксель, тем больше исходный объём данных.</p><p>Форматы вроде JPEG и PNG используют разные способы хранения и сжатия. Поэтому две картинки одинакового разрешения могут заметно отличаться по размеру файла.</p></section>
        <section class="a47-practice"><h3>Практика · 4 минуты</h3><ol><li>Переведи 1011₂, 1111₂ и 100000₂ в десятичную систему.</li><li>Объясни одним предложением разницу между битом и байтом.</li><li>Скажи своими словами, зачем нужна кодировка текста.</li><li>Посмотри размер любой фотографии на MacBook и предположи, какие данные занимают этот объём.</li></ol></section>
        <section class="a47-quiz"><h3>Финальный тест · 5 вопросов</h3>${questions.map((x,i)=>`<div class="a47-q" data-q="${i}"><strong>${i+1}. ${x.q}</strong><div class="a47-options">${x.o.map((o,j)=>`<button type="button" data-a="${j}">${o}</button>`).join('')}</div></div>`).join('')}<div class="a47-quiz-actions"><span class="a47-quiz-result">Ответь на все вопросы.</span><button type="button" class="a47-check">Проверить</button></div></section>
      </div></article>`
    back.querySelector('.a47-modal-close').addEventListener('click',()=>back.remove())
    back.addEventListener('click',e=>{if(e.target===back)back.remove()})
    back.querySelectorAll('.a47-options button').forEach(btn=>btn.addEventListener('click',()=>{
      const qEl=btn.closest('.a47-q');const qi=Number(qEl.dataset.q);const ai=Number(btn.dataset.a)
      answers[qi]=ai;qEl.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected')
    }))
    back.querySelector('.a47-check').addEventListener('click',()=>{
      if(Object.keys(answers).length<questions.length){back.querySelector('.a47-quiz-result').textContent='Сначала ответь на все 5 вопросов.';return}
      let score=0
      back.querySelectorAll('.a47-q').forEach(qEl=>{const qi=Number(qEl.dataset.q);qEl.querySelectorAll('button').forEach((b,bi)=>{b.classList.remove('selected');if(bi===questions[qi].a)b.classList.add('correct');else if(bi===answers[qi])b.classList.add('wrong')});if(answers[qi]===questions[qi].a)score++})
      back.querySelector('.a47-quiz-result').textContent=`Результат: ${score}/5. ${score>=4?'Отличный старт — можно считать вводный урок пройденным.':'Повтори блоки, где ошиблась, и попробуй объяснить ответы своими словами.'}`
      if(score>=4){localStorage.setItem(KEY,'done');const c=document.querySelector('.a47-today-card');if(c){c.classList.add('a47-done');c.querySelector('h3').textContent='Урок на сегодня пройден ✓';c.querySelector('button').textContent='Открыть ещё раз'}}
    })
    document.body.appendChild(back)
  }

  const observer=new MutationObserver(insertCard)
  observer.observe(document.documentElement,{childList:true,subtree:true})
  insertCard()
})()
