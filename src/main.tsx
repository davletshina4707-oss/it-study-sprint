import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, Flame, Globe, Lightbulb, Sigma } from 'lucide-react'
import './styles.css'

type Progress = { weekDone: number; streak: number; minutes: number; lessonBlock: number }
const initial: Progress = { weekDone: 3, streak: 4, minutes: 45, lessonBlock: 1 }
const key = 'it-study-sprint-progress'

function loadProgress(): Progress {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') } } catch { return initial }
}
function saveProgress(p: Progress) { localStorage.setItem(key, JSON.stringify(p)) }

const answers = [
  ['Сразу на сервер сайта', false],
  ['На DNS-сервер, чтобы узнать адрес', true],
  ['В браузерную вкладку', false],
] as const

function App() {
  const [screen, setScreen] = useState<'home'|'lesson'>(() => location.pathname === '/lesson' ? 'lesson' : 'home')
  const [p, setP] = useState(initial)
  const [picked, setPicked] = useState<number|null>(null)
  useEffect(() => setP(loadProgress()), [])
  const go = (s: 'home'|'lesson') => { setScreen(s); history.pushState({}, '', s === 'lesson' ? '/lesson' : '/') }
  useEffect(() => { const f = () => setScreen(location.pathname === '/lesson' ? 'lesson' : 'home'); addEventListener('popstate', f); return () => removeEventListener('popstate', f) }, [])

  if (screen === 'lesson') {
    const block = Math.min(p.lessonBlock, 4)
    const next = () => {
      if (block >= 4) {
        const u = { ...p, lessonBlock: 1, weekDone: Math.min(5, p.weekDone + 1), streak: p.streak + 1 }
        setP(u); saveProgress(u); go('home'); return
      }
      const u = { ...p, lessonBlock: block + 1 }; setP(u); saveProgress(u); setPicked(null)
    }
    return <main className="page"><div className="shell">
      <button className="back" onClick={() => go('home')} aria-label="Назад"><ArrowLeft size={18}/></button>
      <h1 className="lesson-title">Как работает интернет</h1><p className="muted">Урок 1 · 20 минут</p>
      <section className="card lesson-card"><span className="pill"><Lightbulb size={13}/> Главная идея</span><h3>Устройства обмениваются данными через сеть</h3><p className="muted copy">Когда ты открываешь сайт, браузер отправляет запрос. Он проходит через провайдера и сеть серверов, находит нужный компьютер и получает ответ — страницу. Всё это занимает доли секунды.</p></section>
      <section className="card lesson-card"><span className="eyebrow"><CheckCircle2 size={13}/> Проверь себя</span><h3>Куда сначала отправляется запрос сайта?</h3><div className="answers">{answers.map((a,i)=><button key={a[0]} onClick={()=>setPicked(i)} className={'answer '+(picked!==null&&a[1]?'correct':picked===i?'picked':'')}>{a[0]}</button>)}</div>{picked!==null&&<p className="muted hint">Сначала браузер узнаёт адрес сервера через DNS, и только потом идёт к самому сайту.</p>}</section>
      <button className="primary" onClick={next}>Продолжить</button><div className="blocks">{[0,1,2,3].map(i=><span className={i<block?'done':''} key={i}/>)}</div><p className="center muted small">{block} из 4 блоков</p>
    </div></main>
  }

  return <main className="page"><div className="shell"><p className="muted topdate">1 сентября · понедельник</p><h1>Учёба сегодня</h1><p className="muted">Спокойно. Один шаг за раз.</p>
    <section className="card progress"><div className="row"><div><p className="eyebrow">Прогресс недели</p><strong>{p.weekDone} из 5 занятий</strong></div><span className="badge">{p.weekDone}/5</span></div><div className="segments">{[0,1,2,3,4].map(i=><span className={i<p.weekDone?'done':''} key={i}/>)}</div></section>
    <p className="eyebrow section-title">Сегодня</p>
    <LessonCard icon={<Sigma size={17}/>} subject="Высшая математика" title="Повторить уравнения" meta="25 мин · база" />
    <LessonCard icon={<Globe size={17}/>} subject="IT · Основы" title="Как работает интернет" meta="20 мин · теория" onClick={()=>go('lesson')} />
    <button className="primary" onClick={()=>go('lesson')}>Начать занятие</button>
    <div className="stats"><Stat icon={<Flame size={16}/>} value={`${p.streak} дня`} label="Серия"/><Stat icon={<Clock size={16}/>} value={`${p.minutes} мин`} label="Минимум в день"/></div>
  </div></main>
}

function LessonCard({icon,subject,title,meta,onClick}:{icon:React.ReactNode;subject:string;title:string;meta:string;onClick?:()=>void}) { return <button className="card lesson-row" onClick={onClick}><span className="iconbox">{icon}</span><span className="lesson-text"><span className="eyebrow">{subject}</span><strong>{title}</strong><span className="muted small">{meta}</span></span><ChevronRight size={17}/></button> }
function Stat({icon,value,label}:{icon:React.ReactNode;value:string;label:string}) { return <div className="card stat"><span className="miniicon">{icon}</span><strong>{value}</strong><span className="muted small">{label}</span></div> }

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
