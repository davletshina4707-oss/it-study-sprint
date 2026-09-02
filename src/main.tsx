import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, BarChart3, BookOpen, Brain, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3, Flame, GraduationCap, Home, Layers3, Library, ListChecks, Menu, NotebookPen, Play, Search, Sparkles, Target, TimerReset, Trophy, X } from 'lucide-react'
import { subjects, type Lesson, type Subject } from './catalog'
import { semesterPlan } from './semesterPlan'
import './styles.css'

type Screen = 'home' | 'learning' | 'practice' | 'progress' | 'subject' | 'lesson'
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

function App(){
  const [screen,setScreen]=useState<Screen>('home')
  const [selectedSubject,setSelectedSubject]=useState('math')
  const [selectedLesson,setSelectedLesson]=useState('matrices')
  const [progress,setProgress]=useState<Progress>(initial)
  const [notes,setNotes]=useState<Notes>({})
  const [query,setQuery]=useState('')
  const [menuOpen,setMenuOpen]=useState(false)

  useEffect(()=>{setProgress(load(progressKey,initial)); try{setNotes(JSON.parse(localStorage.getItem(notesKey)||'{}'))}catch{}},[])
  useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'})},[screen,selectedSubject,selectedLesson])
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
      {screen==='home'&&<HomeScreen progress={progress} percent={percent} openSubject={openSubject} openLesson={openLesson} go={go}/>} 
      {screen==='learning'&&<LearningScreen progress={progress} filtered={filtered} query={query} setQuery={setQuery} openSubject={openSubject}/>} 
      {screen==='practice'&&<PracticeScreen openSubject={openSubject}/>} 
      {screen==='progress'&&<ProgressScreen progress={progress} totalLessons={totalLessons}/>} 
      {screen==='subject'&&<SubjectScreen subject={subject} progress={progress} back={()=>go('learning')} openLesson={openLesson}/>} 
      {screen==='lesson'&&<LessonScreen subject={subject} lesson={lesson} progress={progress} note={notes[lessonKey(subject.id,lesson.id)]||''} updateNote={updateNote} completeLesson={completeLesson} back={()=>go('subject')}/>} 
    </main>
    {(['home','learning','practice','progress'] as Screen[]).includes(screen)&&<MobileNav screen={screen} go={go}/>} 
  </div>
}

function TopBar({screen,go,menuOpen,setMenuOpen}:{screen:Screen;go:(s:Screen)=>void;menuOpen:boolean;setMenuOpen:(v:boolean)=>void}){
  const root=['home','learning','practice','progress'].includes(screen)
  return <header className="topbar"><div className="topbar-inner">
    <button className="brand" onClick={()=>go('home')}><span className="brand-mark">K</span><span><strong>KATYA Study</strong><small>личный университет</small></span></button>
    <nav className="desktop-nav">
      <NavButton active={screen==='home'} label="Главная" onClick={()=>go('home')}/>
      <NavButton active={screen==='learning'||screen==='subject'||screen==='lesson'} label="Обучение" onClick={()=>go('learning')}/>
      <NavButton active={screen==='practice'} label="Практика" onClick={()=>go('practice')}/>
      <NavButton active={screen==='progress'} label="Прогресс" onClick={()=>go('progress')}/>
    </nav>
    <button className="menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
    {menuOpen&&<div className="menu-pop"><button onClick={()=>go('home')}>Главная</button><button onClick={()=>go('learning')}>Обучение</button><button onClick={()=>go('practice')}>Практика</button><button onClick={()=>go('progress')}>Прогресс</button></div>}
    {!root&&<div className="location-pill">Осенний семестр 2026</div>}
  </div></header>
}
function NavButton({active,label,onClick}:{active:boolean;label:string;onClick:()=>void}){return <button className={active?'active':''} onClick={onClick}>{label}</button>}

function HomeScreen({progress,percent,openSubject,openLesson,go}:{progress:Progress;percent:number;openSubject:(s:Subject)=>void;openLesson:(s:Subject,l:Lesson)=>void;go:(s:Screen)=>void}){
  const lastS=subjects.find(s=>s.id===progress.lastSubject)||subjects[0]; const lastL=lastS.lessons.find(l=>l.id===progress.lastLesson)||lastS.lessons[0]
  const institute=subjects.filter(s=>!extraIds.includes(s.id))
  return <div className="page home-page">
    <section className="welcome"><div><p className="overline">2026/27 · 1 семестр · сентябрь — февраль</p><h1>Добрый вечер, Екатерина!</h1><p>Один предмет — 8 больших тем. Одно занятие — полноценные 60–90 минут работы, а не двухминутная карточка.</p></div><div className="avatar">ЕК</div></section>
    <section className="semester-summary"><div><CalendarDays/><span><strong>6 месяцев</strong><small>сентябрь → февраль</small></span></div><div><Library/><span><strong>{subjects.length} дисциплин</strong><small>институт + развитие</small></span></div><div><Layers3/><span><strong>8 тем</strong><small>в каждом предмете</small></span></div><div><TimerReset/><span><strong>60–90 мин</strong><small>на одно занятие</small></span></div></section>
    <section className="announcement"><Sparkles size={20}/><div><strong>Платформа стала ближе к настоящему институту</strong><span>Предмет → семестровая программа → крупная тема → лекция → активное повторение → практика → тест → конспект.</span></div></section>
    <section className="hero-learning">
      <div className="hero-copy"><span className="eyebrow">Продолжить обучение</span><h2>{lastS.title}</h2><p>{lastL.title}</p><div className="hero-meta"><span><Clock3 size={15}/>{lessonMinutes(lastL)} мин</span><span><BookOpen size={15}/>лекция + практика + тест</span></div><button onClick={()=>openLesson(lastS,lastL)}><Play size={17}/>Продолжить занятие</button></div>
      <div className="hero-score"><div className="ring" style={{'--p':`${percent*3.6}deg`} as React.CSSProperties}><strong>{percent}%</strong><span>семестра</span></div><div className="mini-stats"><span><Flame size={16}/>{progress.streak} день</span><span><Trophy size={16}/>{progress.xp} XP</span></div></div>
    </section>
    <SectionTitle title="Предметы семестра" action="Открыть учебный план" onClick={()=>go('learning')}/>
    <div className="semester-table"><div className="table-head"><span>Дисциплина</span><span>Контроль</span><span></span></div>{institute.slice(0,8).map(s=><SubjectRow key={s.id} subject={s} progress={progress} onClick={()=>openSubject(s)}/>)}</div>
    <SectionTitle title="Дополнительная подготовка"/>
    <div className="special-grid">{subjects.filter(s=>extraIds.includes(s.id)).map(s=><button key={s.id} className={`special-card ${s.tone}`} onClick={()=>openSubject(s)}><span>{s.icon}</span><div><strong>{s.title}</strong><small>{s.description}</small></div><ChevronRight size={18}/></button>)}</div>
  </div>
}

function LearningScreen({progress,filtered,query,setQuery,openSubject}:{progress:Progress;filtered:Subject[];query:string;setQuery:(v:string)=>void;openSubject:(s:Subject)=>void}){
  return <div className="page"><div className="page-title"><div><p className="overline">Моя образовательная программа</p><h1>Обучение</h1><p>Предметы института плюс направления, которые пригодятся тебе в IT, работе и будущем.</p></div><GraduationCap size={40}/></div>
    <section className="term-banner"><div><span>Текущий период</span><strong>Осенний семестр 2026/27</strong><small>Сентябрь — февраль · 8 крупных тем на каждый предмет</small></div><div className="term-months"><b>СЕН</b><b>ОКТ</b><b>НОЯ</b><b>ДЕК</b><b>ЯНВ</b><b>ФЕВ</b></div></section>
    <div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Найти предмет..."/></div>
    <div className="semester-label"><span>1</span><strong>Семестр</strong><small>текущий</small></div>
    <div className="semester-table full"><div className="table-head"><span>Курс</span><span>Вид контроля</span><span>Текущий прогресс</span></div>{filtered.map(s=><SubjectRow key={s.id} subject={s} progress={progress} onClick={()=>openSubject(s)} showProgress/>)}</div>
  </div>
}

function SubjectRow({subject,progress,onClick,showProgress=false}:{subject:Subject;progress:Progress;onClick:()=>void;showProgress?:boolean}){
  const plan=semesterPlan(subject)
  const done=subject.lessons.filter(l=>progress.completed.includes(lessonKey(subject.id,l.id))).length
  const p=Math.round(done/plan.length*100)
  return <button className="subject-row" onClick={onClick}><span className={`status-dot ${done?'started':''}`}></span><span className="subject-name"><b>{subject.icon}</b><strong>{subject.title}</strong></span><span className="control">{subject.control}</span><span className="row-progress">{showProgress?<><i><em style={{width:`${p}%`}}/></i><small>{done}/{plan.length}</small></>:<ChevronRight size={18}/>}</span></button>
}

function SubjectScreen({subject,progress,back,openLesson}:{subject:Subject;progress:Progress;back:()=>void;openLesson:(s:Subject,l:Lesson)=>void}){
  const plan=semesterPlan(subject)
  const done=subject.lessons.filter(l=>progress.completed.includes(lessonKey(subject.id,l.id))).length
  const p=Math.round(done/plan.length*100)
  return <div className="page narrow"><button className="back" onClick={back}><ArrowLeft size={18}/>Все предметы</button>
    <section className={`subject-hero ${subject.tone}`}><div className="subject-icon">{subject.icon}</div><div><span>{subject.control} · семестр {subject.semester}</span><h1>{subject.title}</h1><p>{subject.description}</p><div className="subject-progress"><i><em style={{width:`${p}%`}}/></i><small>{done} из {plan.length} больших тем пройдено</small></div></div></section>
    <div className="course-tabs"><button className="active">Содержание курса</button><button>Контрольные мероприятия</button><button>Мои материалы</button></div>
    <section className="course-intro"><div><CalendarDays/><span><strong>Сентябрь — февраль</strong><small>8 крупных тем распределены на весь семестр</small></span></div><div><Clock3/><span><strong>60–90 минут</strong><small>теория + активное воспроизведение + практика + тест</small></span></div></section>
    <section className="materials"><div className="materials-title"><h2>ПРОГРАММА СЕМЕСТРА</h2><span>8 тем</span></div>
      {plan.map((topic,i)=>{const l=subject.lessons[i];const complete=l&&progress.completed.includes(lessonKey(subject.id,l.id));return l?<button className="material-row" key={topic.title} onClick={()=>openLesson(subject,l)}><span className={complete?'num complete':'num'}>{complete?<Check size={16}/>:i+1}</span><div><span className="topic-month">{topic.month}</span><strong>{topic.title}</strong><small>{topic.focus}</small><small><Clock3 size={13}/>{lessonMinutes(l)} минут · лекция, конспект, практика и тест</small></div><ChevronRight size={18}/></button>:<div className="material-row planned" key={topic.title}><span className="num">{i+1}</span><div><span className="topic-month">{topic.month}</span><strong>{topic.title}</strong><small>{topic.focus}</small><small><Clock3 size={13}/>60–90 минут · материал наполняется</small></div><span className="planned-pill">СКОРО</span></div>})}
    </section>
    <section className="exam-card"><div><ListChecks/><span><strong>Итоговый контроль</strong><small>{subject.control}. Откроется после прохождения всех 8 тем.</small></span></div><button disabled={done<8}>Начать</button></section>
  </div>
}

function LessonScreen({subject,lesson,progress,note,updateNote,completeLesson,back}:{subject:Subject;lesson:Lesson;progress:Progress;note:string;updateNote:(v:string)=>void;completeLesson:()=>void;back:()=>void}){
  const [answers,setAnswers]=useState<Record<number,number>>({})
  const [checked,setChecked]=useState(false)
  const complete=progress.completed.includes(lessonKey(subject.id,lesson.id))
  const score=lesson.quiz.reduce((n,qq,i)=>n+(answers[i]===qq.correct?1:0),0)
  const allAnswered=Object.keys(answers).length===lesson.quiz.length
  const duration=lessonMinutes(lesson)
  return <div className="lesson-page"><div className="lesson-toolbar"><button onClick={back}><ArrowLeft size={17}/>К темам</button><span>{subject.title}</span><div className={complete?'done-badge complete':'done-badge'}>{complete?<><CheckCircle2 size={15}/>Пройдено</>:<><Clock3 size={15}/>{duration} мин</>}</div></div>
    <article className="lecture">
      <header className={`lecture-cover ${subject.tone}`}><div className="cover-icon">{subject.icon}</div><p>{subject.title}</p><h1>{lesson.title}</h1><div className="cover-meta"><span><BookOpen size={16}/>Большая лекция</span><span><NotebookPen size={16}/>Конспект</span><span><Target size={16}/>Практика</span></div></header>
      <section className="learning-goal"><Target/><div><span>Цель занятия</span><p>{lesson.goal}</p></div></section>
      <section className="session-route"><div className="route-head"><TimerReset/><div><strong>Маршрут занятия · {duration} минут</strong><small>Не читай всё залпом. Иди по этапам и действительно работай с материалом.</small></div></div><div className="route-grid"><span><b>01</b>Теория<small>20–25 мин</small></span><span><b>02</b>Воспроизведение<small>10 мин</small></span><span><b>03</b>Пример<small>10 мин</small></span><span><b>04</b>Практика<small>15–20 мин</small></span><span><b>05</b>Тест<small>10 мин</small></span></div></section>
      <div className="lecture-layout"><aside className="toc"><strong>На занятии</strong>{lesson.sections.map((s,i)=><a key={s.title} href={`#s${i}`}>{i+1}. {s.title.replace(/^\d+\.\s*/, '')}</a>)}<a href="#remember">Самопроверка</a><a href="#practice">Практика</a><a href="#notes">Конспект</a><a href="#test">Тест</a></aside>
      <div className="lecture-body">
        {lesson.sections.map((s,i)=><section id={`s${i}`} className="lecture-section" key={s.title}><span className="section-num">{String(i+1).padStart(2,'0')}</span><h2>{s.title.replace(/^\d+\.\s*/, '')}</h2>{s.text.split('\n').map((p,j)=><p key={j}>{p}</p>)}<div className="recall-card"><Brain size={17}/><div><strong>Стоп-точка · 3–5 минут</strong><p>Закрой текст и объясни этот блок своими словами, как будто рассказываешь его человеку, который тему ещё не изучал. Затем открой текст и найди, что ты упустила.</p></div></div></section>)}
        <section id="remember" className="remember"><div className="section-label"><Brain size={18}/>Активная самопроверка</div><p className="remember-intro">Не перечитывай ответы сразу. Сначала письменно или вслух ответь на вопросы, а потом сверяйся с тезисами.</p>{lesson.keyFacts.map((f,i)=><div key={f} className="fact"><span>{i+1}</span><div><strong>Объясни своими словами</strong><p>{f}</p></div></div>)}</section>
        <section className="example"><div className="section-label"><Sparkles size={18}/>Разобранный пример</div><p>{lesson.example}</p><div className="example-task">После разбора закрой пример и воспроизведи ход решения по памяти. Если застряла — отметь конкретный шаг в конспекте.</div></section>
        <section id="practice" className="practice-block"><div className="section-label"><Target size={18}/>Самостоятельная работа · 15–20 минут</div><p>{lesson.practice}</p><div className="practice-tip">Сначала реши сама и обязательно запиши ход мысли. Ошибка с объяснением полезнее, чем правильный ответ, полученный случайно.</div></section>
        <section id="notes" className="notes"><div className="section-label"><NotebookPen size={18}/>Мой конспект · 8–10 минут</div><textarea value={note} onChange={e=>updateNote(e.target.value)} placeholder="1) Главное правило темы. 2) Что было непонятно. 3) Свой пример. 4) Ошибка, которую важно не повторить..."/><small>Сохраняется автоматически на этом устройстве. Хороший конспект — не копия лекции, а твоя короткая версия смысла.</small></section>
        <section id="test" className="test"><div className="test-head"><div><span>Тестовая часть</span><h2>Проверим, что осталось в голове</h2></div><div>{lesson.quiz.length} вопроса</div></div>
          {lesson.quiz.map((qq,qi)=><div className="question" key={qq.q}><h3>Вопрос {qi+1}. <span>{qq.q}</span></h3><div className="options">{qq.options.map((o,oi)=>{const chosen=answers[qi]===oi;const state=checked?(oi===qq.correct?'right':chosen?'wrong':''):chosen?'chosen':'';return <button className={state} key={o} onClick={()=>!checked&&setAnswers({...answers,[qi]:oi})}><b>{String.fromCharCode(65+oi)}</b><span>{o}</span>{checked&&oi===qq.correct&&<Check size={17}/>}</button>})}</div>{checked&&<div className={answers[qi]===qq.correct?'explain good':'explain'}>{qq.explanation}</div>}</div>)}
          {!checked?<button className="test-submit" disabled={!allAnswered} onClick={()=>setChecked(true)}>Проверить ответы</button>:<div className="test-result"><div><strong>{score}/{lesson.quiz.length}</strong><span>{score===lesson.quiz.length?'Отлично. Теперь попробуй кратко пересказать тему без подсказок.':'Есть что повторить — вернись именно к тем блокам, где ошиблась.'}</span></div><button onClick={()=>{setAnswers({});setChecked(false)}}>Пройти ещё раз</button></div>}
        </section>
        <button className={complete?'complete-btn finished':'complete-btn'} onClick={completeLesson} disabled={complete}>{complete?<><CheckCircle2/>Занятие завершено</>:<><CheckCircle2/>Завершить занятие · +75 XP</>}</button>
      </div></div>
    </article>
  </div>
}

function PracticeScreen({openSubject}:{openSubject:(s:Subject)=>void}){
  const att=subjects.find(s=>s.id==='attention')!;const logic=subjects.find(s=>s.id==='logic')!;const math=subjects.find(s=>s.id==='math')!
  return <div className="page"><div className="page-title"><div><p className="overline">Тренажёр</p><h1>Практика</h1><p>Отдельный режим, когда хочется не читать, а думать, замечать и решать.</p></div><Brain size={42}/></div>
    <div className="practice-hero"><div><span>Ежедневный минимум</span><h2>20 минут умственной работы</h2><p>10 минут внимательности + 10 минут логики. Небольшая практика каждый день лучше редких длинных марафонов.</p></div><div className="practice-circle">20<small>мин</small></div></div>
    <div className="practice-grid"><PracticeCard icon="◎" title="Внимательность" text="Детали, числа, чек-листы, поиск невнимательных ошибок." tone="teal" onClick={()=>openSubject(att)}/><PracticeCard icon="◇" title="Логика" text="Условия, доказательства, контрпримеры и дедукция." tone="magenta" onClick={()=>openSubject(logic)}/><PracticeCard icon="∑" title="Математика" text="Задачи на линейную алгебру и геометрию." tone="violet" onClick={()=>openSubject(math)}/></div>
  </div>
}
function PracticeCard({icon,title,text,tone,onClick}:{icon:string;title:string;text:string;tone:string;onClick:()=>void}){return <button className={`practice-card ${tone}`} onClick={onClick}><span>{icon}</span><h3>{title}</h3><p>{text}</p><div>Открыть тренажёр <ChevronRight size={16}/></div></button>}

function ProgressScreen({progress,totalLessons}:{progress:Progress;totalLessons:number}){
  const p=Math.round(progress.completed.length/Math.max(1,totalLessons)*100)
  const courseStats=subjects.map(s=>({s,done:s.lessons.filter(l=>progress.completed.includes(lessonKey(s.id,l.id))).length,total:semesterPlan(s).length}))
  return <div className="page"><div className="page-title"><div><p className="overline">Статистика</p><h1>Мой прогресс</h1><p>Прогресс считается относительно всей семестровой программы — по 8 крупных тем на предмет.</p></div><BarChart3 size={42}/></div>
    <div className="metric-grid"><Metric value={`${p}%`} label="общий прогресс" icon={<Target/>}/><Metric value={String(progress.completed.length)} label="тем пройдено" icon={<CheckCircle2/>}/><Metric value={`${progress.minutes}`} label="минут обучения" icon={<Clock3/>}/><Metric value={`${progress.xp}`} label="XP заработано" icon={<Trophy/>}/></div>
    <section className="progress-panel"><h2>По предметам</h2>{courseStats.map(({s,done,total})=>{const pc=Math.round(done/total*100);return <div className="course-stat" key={s.id}><span className={`course-dot ${s.tone}`}>{s.icon}</span><div><strong>{s.title}</strong><i><em style={{width:`${pc}%`}}/></i></div><b>{done}/{total}</b></div>})}</section>
  </div>
}
function Metric({value,label,icon}:{value:string;label:string;icon:React.ReactNode}){return <div className="metric"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function SectionTitle({title,action,onClick}:{title:string;action?:string;onClick?:()=>void}){return <div className="section-title"><h2>{title}</h2>{action&&<button onClick={onClick}>{action}<ChevronRight size={16}/></button>}</div>}

function MobileNav({screen,go}:{screen:Screen;go:(s:Screen)=>void}){return <nav className="mobile-nav"><button className={screen==='home'?'active':''} onClick={()=>go('home')}><Home/><span>Главная</span></button><button className={screen==='learning'?'active':''} onClick={()=>go('learning')}><Library/><span>Обучение</span></button><button className={screen==='practice'?'active':''} onClick={()=>go('practice')}><Brain/><span>Практика</span></button><button className={screen==='progress'?'active':''} onClick={()=>go('progress')}><BarChart3/><span>Прогресс</span></button></nav>}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)