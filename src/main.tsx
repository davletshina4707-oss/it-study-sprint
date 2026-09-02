import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, BarChart3, BookOpen, Brain, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Flame, GraduationCap, Home, Layers3, Library, ListChecks, Menu, NotebookPen, Play, Search, Sparkles, Target, TimerReset, Trophy, X } from 'lucide-react'
import { subjects, type Lesson, type Subject } from './catalog'
import { semesterPlan } from './semesterPlan'
import { formatHumanDate, getStudyDay, getStudyDayIndex, semesterEnd, semesterStart, studyDays, subjectSemesterSessions, topicWorkload, type StudySession } from './studySchedule'
import { getRichLesson } from './richLessons'
import './styles.css'

type Screen = 'home' | 'schedule' | 'learning' | 'practice' | 'progress' | 'subject' | 'lesson'
type Progress = { completed: string[]; xp: number; streak: number; minutes: number; lastSubject: string; lastLesson: string }
type Notes = Record<string,string>
const progressKey='study-hub-progress-v1'
const notesKey='study-hub-notes-v1'
const initial:Progress={completed:[],xp:0,streak:1,minutes:0,lastSubject:'math',lastLesson:'matrices'}
const extraIds=['ai','military','attention','logic']

function load<T>(key:string,fallback:T):T{try{return {...(fallback as any),...JSON.parse(localStorage.getItem(key)||'{}')}}catch{return fallback}}
function save(key:string,value:unknown){localStorage.setItem(key,JSON.stringify(value))}
const lessonKey=(s:string,l:string)=>`${s}:${l}`
const lessonMinutes=(lesson:Lesson)=>Math.max(60,lesson.duration)
function localIso(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function initialStudyDate(){const now=localIso();if(now<semesterStart)return semesterStart;if(now>semesterEnd)return semesterEnd;return now}

function App(){
  const [screen,setScreen]=useState<Screen>('home')
  const [selectedSubject,setSelectedSubject]=useState('math')
  const [selectedLesson,setSelectedLesson]=useState('matrices')
  const [selectedDate,setSelectedDate]=useState(initialStudyDate())
  const [progress,setProgress]=useState<Progress>(initial)
  const [notes,setNotes]=useState<Notes>({})
  const [query,setQuery]=useState('')
  const [menuOpen,setMenuOpen]=useState(false)

  useEffect(()=>{setProgress(load(progressKey,initial));try{setNotes(JSON.parse(localStorage.getItem(notesKey)||'{}'))}catch{}},[])
  useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'})},[screen,selectedSubject,selectedLesson,selectedDate])
  const subject=subjects.find(s=>s.id===selectedSubject)||subjects[0]
  const lesson=subject.lessons.find(l=>l.id===selectedLesson)||subject.lessons[0]
  const totalLessons=subjects.reduce((n,s)=>n+semesterPlan(s).length,0)
  const percent=Math.round((progress.completed.length/Math.max(1,totalLessons))*100)
  const filtered=subjects.filter(s=>s.title.toLowerCase().includes(query.toLowerCase()))

  const go=(next:Screen)=>{setScreen(next);setMenuOpen(false)}
  const openSubject=(s:Subject)=>{setSelectedSubject(s.id);setScreen('subject')}
  const openLesson=(s:Subject,l:Lesson)=>{
    setSelectedSubject(s.id);setSelectedLesson(l.id);setScreen('lesson')
    const p={...progress,lastSubject:s.id,lastLesson:l.id};setProgress(p);save(progressKey,p)
  }
  const openScheduled=(session:StudySession)=>{
    const s=subjects.find(x=>x.id===session.subjectId)
    if(!s)return
    const l=s.lessons[session.topicIndex]
    if(l)openLesson(s,l);else openSubject(s)
  }
  const completeLesson=()=>{
    const key=lessonKey(subject.id,lesson.id)
    if(progress.completed.includes(key))return
    const p={...progress,completed:[...progress.completed,key],xp:progress.xp+75,minutes:progress.minutes+lessonMinutes(lesson),lastSubject:subject.id,lastLesson:lesson.id}
    setProgress(p);save(progressKey,p)
  }
  const updateNote=(value:string)=>{const n={...notes,[lessonKey(subject.id,lesson.id)]:value};setNotes(n);save(notesKey,n)}

  return <div className="app">
    <TopBar screen={screen} go={go} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
    <main className="main">
      {screen==='home'&&<HomeScreen progress={progress} percent={percent} selectedDate={selectedDate} setSelectedDate={setSelectedDate} openSubject={openSubject} openLesson={openLesson} openScheduled={openScheduled} go={go}/>} 
      {screen==='schedule'&&<ScheduleScreen selectedDate={selectedDate} setSelectedDate={setSelectedDate} progress={progress} openScheduled={openScheduled}/>} 
      {screen==='learning'&&<LearningScreen progress={progress} filtered={filtered} query={query} setQuery={setQuery} openSubject={openSubject}/>} 
      {screen==='practice'&&<PracticeScreen openSubject={openSubject}/>} 
      {screen==='progress'&&<ProgressScreen progress={progress} totalLessons={totalLessons}/>} 
      {screen==='subject'&&<SubjectScreen subject={subject} progress={progress} back={()=>go('learning')} openLesson={openLesson}/>} 
      {screen==='lesson'&&<LessonScreen subject={subject} lesson={lesson} progress={progress} note={notes[lessonKey(subject.id,lesson.id)]||''} updateNote={updateNote} completeLesson={completeLesson} back={()=>go('subject')}/>} 
    </main>
    {(['home','schedule','learning','practice','progress'] as Screen[]).includes(screen)&&<MobileNav screen={screen} go={go}/>} 
  </div>
}

function TopBar({screen,go,menuOpen,setMenuOpen}:{screen:Screen;go:(s:Screen)=>void;menuOpen:boolean;setMenuOpen:(v:boolean)=>void}){
  const root=['home','schedule','learning','practice','progress'].includes(screen)
  return <header className="topbar"><div className="topbar-inner">
    <button className="brand" onClick={()=>go('home')}><span className="brand-mark">K</span><span><strong>KATYA Study</strong><small>личный университет</small></span></button>
    <nav className="desktop-nav">
      <NavButton active={screen==='home'} label="Главная" onClick={()=>go('home')}/>
      <NavButton active={screen==='schedule'} label="Расписание" onClick={()=>go('schedule')}/>
      <NavButton active={screen==='learning'||screen==='subject'||screen==='lesson'} label="Обучение" onClick={()=>go('learning')}/>
      <NavButton active={screen==='practice'} label="Практика" onClick={()=>go('practice')}/>
      <NavButton active={screen==='progress'} label="Прогресс" onClick={()=>go('progress')}/>
    </nav>
    <button className="menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
    {menuOpen&&<div className="menu-pop"><button onClick={()=>go('home')}>Главная</button><button onClick={()=>go('schedule')}>Расписание</button><button onClick={()=>go('learning')}>Обучение</button><button onClick={()=>go('practice')}>Практика</button><button onClick={()=>go('progress')}>Прогресс</button></div>}
    {!root&&<div className="location-pill">Осенний семестр 2026/27</div>}
  </div></header>
}
function NavButton({active,label,onClick}:{active:boolean;label:string;onClick:()=>void}){return <button className={active?'active':''} onClick={onClick}>{label}</button>}

function HomeScreen({progress,percent,selectedDate,setSelectedDate,openSubject,openLesson,openScheduled,go}:{progress:Progress;percent:number;selectedDate:string;setSelectedDate:(d:string)=>void;openSubject:(s:Subject)=>void;openLesson:(s:Subject,l:Lesson)=>void;openScheduled:(s:StudySession)=>void;go:(s:Screen)=>void}){
  const lastS=subjects.find(s=>s.id===progress.lastSubject)||subjects[0];const lastL=lastS.lessons.find(l=>l.id===progress.lastLesson)||lastS.lessons[0]
  const institute=subjects.filter(s=>!extraIds.includes(s.id))
  const day=getStudyDay(selectedDate)
  return <div className="page home-page">
    <section className="welcome"><div><p className="overline">2026/27 · 1 семестр · сентябрь — февраль</p><h1>Добрый вечер, Екатерина!</h1><p>Теперь обучение идёт не хаотично. На каждый день у тебя есть пять занятий, а каждая большая тема растянута на несколько лекций и практикумов.</p></div><div className="avatar">ЕК</div></section>
    <section className="semester-summary"><div><CalendarDays/><span><strong>179 учебных дней</strong><small>03.09 → 28.02</small></span></div><div><Library/><span><strong>{subjects.length} дисциплин</strong><small>институт + развитие</small></span></div><div><Layers3/><span><strong>5 занятий</strong><small>каждый учебный день</small></span></div><div><TimerReset/><span><strong>≈4–5 часов</strong><small>полный учебный день</small></span></div></section>
    <section className="announcement"><Sparkles size={20}/><div><strong>Новый режим: «я пришла на занятия»</strong><span>Открываешь расписание — и не выбираешь, что хочется. Сайт уже решил, какие пять предметов и какой объём ты проходишь сегодня.</span></div></section>
    <section className="today-campus"><div className="today-campus-head"><div><span className="eyebrow dark">Ближайший учебный день</span><h2>{day.weekday}, {formatHumanDate(day.date)}</h2><p>Пять пар по заранее заданному семестровому маршруту.</p></div><button onClick={()=>go('schedule')}><CalendarDays size={17}/>Полное расписание</button></div><div className="day-lessons-mini">{day.sessions.map(session=>{const s=subjects.find(x=>x.id===session.subjectId)!;return <button key={`${session.date}-${session.order}`} onClick={()=>openScheduled(session)}><b>{session.order}</b><span><strong>{s.title}</strong><small>{session.topicTitle}</small><em>{session.duration} мин · {session.stage}</em></span><ChevronRight size={17}/></button>})}</div></section>
    <section className="hero-learning">
      <div className="hero-copy"><span className="eyebrow">Вернуться к последней теме</span><h2>{lastS.title}</h2><p>{lastL.title}</p><div className="hero-meta"><span><Clock3 size={15}/>{lessonMinutes(lastL)}+ мин</span><span><BookOpen size={15}/>лекция + практика + тест</span></div><button onClick={()=>openLesson(lastS,lastL)}><Play size={17}/>Продолжить тему</button></div>
      <div className="hero-score"><div className="ring" style={{'--p':`${percent*3.6}deg`} as React.CSSProperties}><strong>{percent}%</strong><span>семестра</span></div><div className="mini-stats"><span><Flame size={16}/>{progress.streak} день</span><span><Trophy size={16}/>{progress.xp} XP</span></div></div>
    </section>
    <SectionTitle title="Предметы семестра" action="Открыть учебный план" onClick={()=>go('learning')}/>
    <div className="semester-table"><div className="table-head"><span>Дисциплина</span><span>Контроль</span><span></span></div>{institute.slice(0,8).map(s=><SubjectRow key={s.id} subject={s} progress={progress} onClick={()=>openSubject(s)}/>)}</div>
    <SectionTitle title="Дополнительная подготовка"/>
    <div className="special-grid">{subjects.filter(s=>extraIds.includes(s.id)).map(s=><button key={s.id} className={`special-card ${s.tone}`} onClick={()=>openSubject(s)}><span>{s.icon}</span><div><strong>{s.title}</strong><small>{s.description}</small></div><ChevronRight size={18}/></button>)}</div>
  </div>
}

function ScheduleScreen({selectedDate,setSelectedDate,progress,openScheduled}:{selectedDate:string;setSelectedDate:(d:string)=>void;progress:Progress;openScheduled:(s:StudySession)=>void}){
  const index=getStudyDayIndex(selectedDate);const day=getStudyDay(selectedDate)
  const prev=()=>index>0&&setSelectedDate(studyDays[index-1].date);const next=()=>index<studyDays.length-1&&setSelectedDate(studyDays[index+1].date)
  const totalMinutes=day.sessions.reduce((n,s)=>n+s.duration,0)
  const monthGroups=useMemo(()=>{
    const map=new Map<string,typeof studyDays>();studyDays.forEach(d=>{const key=d.date.slice(0,7);const arr=map.get(key)||[];arr.push(d);map.set(key,arr)});return [...map.entries()]
  },[])
  return <div className="page schedule-page"><div className="page-title"><div><p className="overline">Личный институт · ежедневное обучение</p><h1>Расписание</h1><p>С 3 сентября 2026 по 28 февраля 2027. Каждый день — пять заранее определённых занятий.</p></div><CalendarDays size={42}/></div>
    <section className="schedule-day-head"><button onClick={prev} disabled={index===0}><ChevronLeft/></button><div><span>{day.weekday}</span><h2>{formatHumanDate(day.date)}</h2><small>5 занятий · {totalMinutes} минут чистого учебного времени</small></div><button onClick={next} disabled={index===studyDays.length-1}><ChevronRight/></button><input type="date" min={semesterStart} max={semesterEnd} value={day.date} onChange={e=>setSelectedDate(e.target.value)}/></section>
    <div className="daily-timeline">{day.sessions.map(session=>{const s=subjects.find(x=>x.id===session.subjectId)!;const lesson=s.lessons[session.topicIndex];const done=lesson&&progress.completed.includes(lessonKey(s.id,lesson.id));return <button className={done?'daily-class done':'daily-class'} key={`${session.date}-${session.order}`} onClick={()=>openScheduled(session)}><div className="class-time"><b>{String(session.order).padStart(2,'0')}</b><span>{session.duration}<small>мин</small></span></div><div className={`class-accent ${s.tone}`}>{s.icon}</div><div className="class-copy"><span>{session.month} · тема {session.topicIndex+1}</span><h3>{s.title}</h3><strong>{session.topicTitle}</strong><p>{session.stage}</p><small>Занятие {session.part} из {session.partsTotal} по этой большой теме</small></div><div className="class-action">{done?<CheckCircle2/>:lesson?<Play/>:<BookOpen/>}<span>{done?'Пройдено':lesson?'Открыть':'К предмету'}</span></div></button>})}</div>
    <section className="study-rule"><Brain/><div><strong>Как работать по расписанию</strong><p>Не старайся «закрыть» большую тему за один день. Например, алгебра матриц идёт несколько отдельных занятий: сначала понятия, затем операции, затем матричное умножение, дальше практика, углубление и мини-зачёт. Так мы действительно проходим объём учебника, а не читаем короткую памятку.</p></div></section>
    <SectionTitle title="Весь семестр по дням"/>
    <div className="semester-calendar">{monthGroups.map(([month,days])=><section key={month}><h3>{new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${month}-01T00:00:00Z`))}</h3><div>{days.map(d=><button key={d.date} className={d.date===day.date?'active':''} onClick={()=>setSelectedDate(d.date)}><b>{Number(d.date.slice(8))}</b><span>{d.weekday.slice(0,2)}</span><small>5</small></button>)}</div></section>)}</div>
  </div>
}

function LearningScreen({progress,filtered,query,setQuery,openSubject}:{progress:Progress;filtered:Subject[];query:string;setQuery:(v:string)=>void;openSubject:(s:Subject)=>void}){
  return <div className="page"><div className="page-title"><div><p className="overline">Моя образовательная программа</p><h1>Обучение</h1><p>Здесь можно открыть любой предмет отдельно. Расписание при этом остаётся главным маршрутом, чтобы обучение не превращалось в случайный выбор тем.</p></div><GraduationCap size={40}/></div>
    <section className="term-banner"><div><span>Текущий период</span><strong>Осенний семестр 2026/27</strong><small>Сентябрь — февраль · 8 крупных тем на каждый предмет · внутри каждой темы несколько занятий</small></div><div className="term-months"><b>СЕН</b><b>ОКТ</b><b>НОЯ</b><b>ДЕК</b><b>ЯНВ</b><b>ФЕВ</b></div></section>
    <div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Найти предмет..."/></div>
    <div className="semester-label"><span>1</span><strong>Семестр</strong><small>текущий</small></div>
    <div className="semester-table full"><div className="table-head"><span>Курс</span><span>Вид контроля</span><span>Текущий прогресс</span></div>{filtered.map(s=><SubjectRow key={s.id} subject={s} progress={progress} onClick={()=>openSubject(s)} showProgress/>)}</div>
  </div>
}

function SubjectRow({subject,progress,onClick,showProgress=false}:{subject:Subject;progress:Progress;onClick:()=>void;showProgress?:boolean}){
  const plan=semesterPlan(subject);const done=subject.lessons.filter(l=>progress.completed.includes(lessonKey(subject.id,l.id))).length;const p=Math.round(done/plan.length*100)
  return <button className="subject-row" onClick={onClick}><span className={`status-dot ${done?'started':''}`}></span><span className="subject-name"><b>{subject.icon}</b><strong>{subject.title}</strong></span><span className="control">{subject.control}</span><span className="row-progress">{showProgress?<><i><em style={{width:`${p}%`}}/></i><small>{done}/{plan.length}</small></>:<ChevronRight size={18}/>}</span></button>
}

function SubjectScreen({subject,progress,back,openLesson}:{subject:Subject;progress:Progress;back:()=>void;openLesson:(s:Subject,l:Lesson)=>void}){
  const plan=semesterPlan(subject);const done=subject.lessons.filter(l=>progress.completed.includes(lessonKey(subject.id,l.id))).length;const p=Math.round(done/plan.length*100);const totalSessions=subjectSemesterSessions(subject.id)
  return <div className="page narrow"><button className="back" onClick={back}><ArrowLeft size={18}/>Все предметы</button>
    <section className={`subject-hero ${subject.tone}`}><div className="subject-icon">{subject.icon}</div><div><span>{subject.control} · семестр {subject.semester}</span><h1>{subject.title}</h1><p>{subject.description}</p><div className="subject-progress"><i><em style={{width:`${p}%`}}/></i><small>{done} из {plan.length} больших тем пройдено</small></div></div></section>
    <div className="course-tabs"><button className="active">Содержание курса</button><button>Контрольные мероприятия</button><button>Мои материалы</button></div>
    <section className="course-intro"><div><CalendarDays/><span><strong>{totalSessions} занятий за семестр</strong><small>курс распределён с сентября по февраль</small></span></div><div><Clock3/><span><strong>8 больших тем</strong><small>каждая тема включает несколько лекций, практикумов и контроль</small></span></div></section>
    <section className="materials"><div className="materials-title"><h2>ПРОГРАММА СЕМЕСТРА</h2><span>8 крупных тем</span></div>
      {plan.map((topic,i)=>{const l=subject.lessons[i];const complete=l&&progress.completed.includes(lessonKey(subject.id,l.id));const workload=topicWorkload(subject.id,i);return l?<button className="material-row" key={topic.title} onClick={()=>openLesson(subject,l)}><span className={complete?'num complete':'num'}>{complete?<Check size={16}/>:i+1}</span><div><span className="topic-month">{topic.month}</span><strong>{topic.title}</strong><small>{topic.focus}</small><small><CalendarDays size={13}/>{workload} отдельных занятий по теме · лекции + задачи + повторение + мини-контроль</small></div><ChevronRight size={18}/></button>:<div className="material-row planned" key={topic.title}><span className="num">{i+1}</span><div><span className="topic-month">{topic.month}</span><strong>{topic.title}</strong><small>{topic.focus}</small><small><CalendarDays size={13}/>{workload} занятий запланировано · материал будет открыт по расписанию</small></div><span className="planned-pill">В ПЛАНЕ</span></div>})}
    </section>
    <section className="exam-card"><div><ListChecks/><span><strong>Итоговый контроль</strong><small>{subject.control}. Откроется после прохождения всех 8 крупных тем и промежуточных занятий.</small></span></div><button disabled={done<8}>Начать</button></section>
  </div>
}

function LessonScreen({subject,lesson,progress,note,updateNote,completeLesson,back}:{subject:Subject;lesson:Lesson;progress:Progress;note:string;updateNote:(v:string)=>void;completeLesson:()=>void;back:()=>void}){
  const rich=getRichLesson(subject.id,lesson.id);const active={...lesson,...rich} as Lesson;const [answers,setAnswers]=useState<Record<number,number>>({});const [checked,setChecked]=useState(false)
  const complete=progress.completed.includes(lessonKey(subject.id,lesson.id));const score=active.quiz.reduce((n,qq,i)=>n+(answers[i]===qq.correct?1:0),0);const allAnswered=Object.keys(answers).length===active.quiz.length
  const topicIndex=Math.max(0,subject.lessons.findIndex(l=>l.id===lesson.id));const workload=topicWorkload(subject.id,topicIndex);const duration=lessonMinutes(active)
  return <div className="lesson-page"><div className="lesson-toolbar"><button onClick={back}><ArrowLeft size={17}/>К темам</button><span>{subject.title}</span><div className={complete?'done-badge complete':'done-badge'}>{complete?<><CheckCircle2 size={15}/>Пройдено</>:<><CalendarDays size={15}/>{workload} занятий в теме</>}</div></div>
    <article className="lecture">
      <header className={`lecture-cover ${subject.tone}`}><div className="cover-icon">{subject.icon}</div><p>{subject.title}</p><h1>{active.title}</h1><div className="cover-meta"><span><BookOpen size={16}/>Большая тема как глава учебника</span><span><NotebookPen size={16}/>Личный конспект</span><span><Target size={16}/>Практикум</span></div></header>
      <section className="learning-goal"><Target/><div><span>Цель большой темы</span><p>{active.goal}</p></div></section>
      <section className="module-scale"><div><Layers3/><span><strong>{workload} отдельных учебных встреч</strong><small>Эту тему не нужно проходить за один вечер. Расписание возвращает тебя к ней несколько раз в течение месяца.</small></span></div><div><TimerReset/><span><strong>Теория + задачи + воспроизведение</strong><small>Текст ниже — база главы. Между занятиями решай практику и возвращайся к трудным разделам.</small></span></div></section>
      <section className="session-route"><div className="route-head"><TimerReset/><div><strong>Как проходить эту главу</strong><small>На одну встречу бери 1–2 раздела, затем обязательно закрывай текст и воспроизводи смысл без подсказки.</small></div></div><div className="route-grid"><span><b>01</b>Чтение<small>15–25 мин</small></span><span><b>02</b>Пересказ<small>5–10 мин</small></span><span><b>03</b>Пример<small>10 мин</small></span><span><b>04</b>Задачи<small>20–30 мин</small></span><span><b>05</b>Конспект<small>5–10 мин</small></span></div></section>
      <div className="lecture-layout"><aside className="toc"><strong>Глава</strong>{active.sections.map((s,i)=><a key={s.title} href={`#s${i}`}>{i+1}. {s.title.replace(/^\d+\.\s*/, '')}</a>)}<a href="#remember">Самопроверка</a><a href="#practice">Практика</a><a href="#notes">Конспект</a><a href="#test">Тест</a></aside>
      <div className="lecture-body">
        {active.sections.map((s,i)=><section id={`s${i}`} className="lecture-section" key={s.title}><span className="section-num">{String(i+1).padStart(2,'0')}</span><h2>{s.title.replace(/^\d+\.\s*/, '')}</h2>{s.text.split('\n').filter(Boolean).map((p,j)=><p key={j}>{p}</p>)}<div className="recall-card"><Brain size={17}/><div><strong>Стоп-точка · не листай дальше автоматически</strong><p>Закрой этот раздел и объясни его своими словами. Если не можешь без текста назвать основные идеи и привести пример — раздел ещё не усвоен, даже если при чтении всё казалось понятным.</p></div></div></section>)}
        <section id="remember" className="remember"><div className="section-label"><Brain size={18}/>Активная самопроверка</div><p className="remember-intro">Эти тезисы используй как вопросы для себя. Сначала попробуй сформулировать правило по памяти, и только затем сравни с текстом.</p>{active.keyFacts.map((f,i)=><div key={f} className="fact"><span>{i+1}</span><div><strong>Объясни без подсказки</strong><p>{f}</p></div></div>)}</section>
        <section className="example"><div className="section-label"><Sparkles size={18}/>Большой разобранный пример</div>{active.example.split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}<div className="example-task">После разбора закрой пример и воспроизведи ход решения по памяти. Цель — запомнить не цифры, а порядок проверки размеров, выбор операции и способ контроля ответа.</div></section>
        <section id="practice" className="practice-block"><div className="section-label"><Target size={18}/>Самостоятельная работа</div>{active.practice.split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}<div className="practice-tip">Не пытайся решить весь практикум за один подход. Расписание будет возвращать тебя к теме, а задачи должны становиться сложнее постепенно.</div></section>
        <section id="notes" className="notes"><div className="section-label"><NotebookPen size={18}/>Мой конспект</div><textarea value={note} onChange={e=>updateNote(e.target.value)} placeholder="Напиши не копию лекции, а свою версию: определения, алгоритмы, формулы, пример, типичная ошибка, вопрос, который ещё остался..."/><small>Сохраняется автоматически на этом устройстве.</small></section>
        <section id="test" className="test"><div className="test-head"><div><span>Контрольная точка</span><h2>Проверим понимание главы</h2></div><div>{active.quiz.length} вопросов</div></div>
          {active.quiz.map((qq,qi)=><div className="question" key={qq.q}><h3>Вопрос {qi+1}. <span>{qq.q}</span></h3><div className="options">{qq.options.map((o,oi)=>{const chosen=answers[qi]===oi;const state=checked?(oi===qq.correct?'right':chosen?'wrong':''):chosen?'chosen':'';return <button className={state} key={o} onClick={()=>!checked&&setAnswers({...answers,[qi]:oi})}><b>{String.fromCharCode(65+oi)}</b><span>{o}</span>{checked&&oi===qq.correct&&<Check size={17}/>}</button>})}</div>{checked&&<div className={answers[qi]===qq.correct?'explain good':'explain'}>{qq.explanation}</div>}</div>)}
          {!checked?<button className="test-submit" disabled={!allAnswered} onClick={()=>setChecked(true)}>Проверить ответы</button>:<div className="test-result"><div><strong>{score}/{active.quiz.length}</strong><span>{score>=Math.ceil(active.quiz.length*.8)?'Хорошая база. Теперь закрепляй тему задачами по расписанию.':'Вернись к тем разделам, где возникли ошибки, и объясни их заново без текста.'}</span></div><button onClick={()=>{setAnswers({});setChecked(false)}}>Пройти ещё раз</button></div>}
        </section>
        {rich?.sourceNote&&<section className="source-note"><BookOpen/><div><strong>Методическая основа</strong><p>{rich.sourceNote}</p></div></section>}
        <button className={complete?'complete-btn finished':'complete-btn'} onClick={completeLesson} disabled={complete}>{complete?<><CheckCircle2/>Большая тема отмечена пройденной</>:<><CheckCircle2/>Отметить тему пройденной · +75 XP</>}</button>
      </div></div>
    </article>
  </div>
}

function PracticeScreen({openSubject}:{openSubject:(s:Subject)=>void}){
  const att=subjects.find(s=>s.id==='attention')!;const logic=subjects.find(s=>s.id==='logic')!;const math=subjects.find(s=>s.id==='math')!
  return <div className="page"><div className="page-title"><div><p className="overline">Тренажёр</p><h1>Практика</h1><p>Дополнительный режим между основными занятиями.</p></div><Brain size={42}/></div>
    <div className="practice-hero"><div><span>Ежедневный минимум</span><h2>20 минут умственной работы</h2><p>10 минут внимательности + 10 минут логики. Это не заменяет пять занятий по расписанию, а дополняет их.</p></div><div className="practice-circle">20<small>мин</small></div></div>
    <div className="practice-grid"><PracticeCard icon="◎" title="Внимательность" text="Детали, числа, чек-листы, поиск невнимательных ошибок." tone="teal" onClick={()=>openSubject(att)}/><PracticeCard icon="◇" title="Логика" text="Условия, доказательства, контрпримеры и дедукция." tone="magenta" onClick={()=>openSubject(logic)}/><PracticeCard icon="∑" title="Математика" text="Задачи на линейную алгебру и геометрию." tone="violet" onClick={()=>openSubject(math)}/></div>
  </div>
}
function PracticeCard({icon,title,text,tone,onClick}:{icon:string;title:string;text:string;tone:string;onClick:()=>void}){return <button className={`practice-card ${tone}`} onClick={onClick}><span>{icon}</span><h3>{title}</h3><p>{text}</p><div>Открыть тренажёр <ChevronRight size={16}/></div></button>}

function ProgressScreen({progress,totalLessons}:{progress:Progress;totalLessons:number}){
  const p=Math.round(progress.completed.length/Math.max(1,totalLessons)*100);const courseStats=subjects.map(s=>({s,done:s.lessons.filter(l=>progress.completed.includes(lessonKey(s.id,l.id))).length,total:semesterPlan(s).length}))
  return <div className="page"><div className="page-title"><div><p className="overline">Статистика</p><h1>Мой прогресс</h1><p>Прогресс считается по крупным темам. Ежедневное расписание показывает реальный объём занятий внутри них.</p></div><BarChart3 size={42}/></div>
    <div className="metric-grid"><Metric value={`${p}%`} label="общий прогресс" icon={<Target/>}/><Metric value={String(progress.completed.length)} label="тем пройдено" icon={<CheckCircle2/>}/><Metric value={`${progress.minutes}`} label="минут обучения" icon={<Clock3/>}/><Metric value={`${progress.xp}`} label="XP заработано" icon={<Trophy/>}/></div>
    <section className="progress-panel"><h2>По предметам</h2>{courseStats.map(({s,done,total})=>{const pc=Math.round(done/total*100);return <div className="course-stat" key={s.id}><span className={`course-dot ${s.tone}`}>{s.icon}</span><div><strong>{s.title}</strong><i><em style={{width:`${pc}%`}}/></i></div><b>{done}/{total}</b></div>})}</section>
  </div>
}
function Metric({value,label,icon}:{value:string;label:string;icon:React.ReactNode}){return <div className="metric"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function SectionTitle({title,action,onClick}:{title:string;action?:string;onClick?:()=>void}){return <div className="section-title"><h2>{title}</h2>{action&&<button onClick={onClick}>{action}<ChevronRight size={16}/></button>}</div>}

function MobileNav({screen,go}:{screen:Screen;go:(s:Screen)=>void}){return <nav className="mobile-nav five"><button className={screen==='home'?'active':''} onClick={()=>go('home')}><Home/><span>Главная</span></button><button className={screen==='schedule'?'active':''} onClick={()=>go('schedule')}><CalendarDays/><span>День</span></button><button className={screen==='learning'?'active':''} onClick={()=>go('learning')}><Library/><span>Предметы</span></button><button className={screen==='practice'?'active':''} onClick={()=>go('practice')}><Brain/><span>Практика</span></button><button className={screen==='progress'?'active':''} onClick={()=>go('progress')}><BarChart3/><span>Прогресс</span></button></nav>}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)