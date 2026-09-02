import { subjects } from './catalog'
import { semesterPlan } from './semesterPlan'

export type StudySession = {
  date: string
  order: number
  subjectId: string
  topicIndex: number
  topicTitle: string
  month: string
  part: number
  partsTotal: number
  duration: number
  stage: string
  focus: string
}

export type StudyDay = {
  date: string
  weekday: string
  sessions: StudySession[]
}

export const semesterStart='2026-09-03'
export const semesterEnd='2027-02-28'

const weekly: Record<number,string[]> = {
  1:['math','programming','english','russian','attention'],
  2:['probability','informatics','history','os','logic'],
  3:['math','ai','english','law','military'],
  4:['programming','informatics','russian','statehood','pe'],
  5:['math','probability','os','ai','attention'],
  6:['programming','english','history','life-safety','military'],
  0:['informatics','probability','law','logic','ai'],
}

const duration:Record<string,number>={
  math:60,programming:60,english:55,russian:50,attention:40,
  probability:60,informatics:55,history:50,os:60,logic:45,
  ai:60,law:50,military:50,statehood:45,pe:45,'life-safety':45,
}

const weekdayNames=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота']

function parseDate(s:string){const [y,m,d]=s.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))}
function fmt(d:Date){return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`}
function addDay(d:Date){const x=new Date(d);x.setUTCDate(x.getUTCDate()+1);return x}

const raw:{date:string;weekday:string;subjectIds:string[]}[]=[]
for(let d=parseDate(semesterStart);d<=parseDate(semesterEnd);d=addDay(d)){
  raw.push({date:fmt(d),weekday:weekdayNames[d.getUTCDay()],subjectIds:weekly[d.getUTCDay()]})
}

const totalBySubject:Record<string,number>={}
raw.forEach(day=>day.subjectIds.forEach(id=>{totalBySubject[id]=(totalBySubject[id]||0)+1}))

const appearances:Record<string,number>={}
const topicAppearances:Record<string,number>={}
const provisional:{date:string;weekday:string;order:number;subjectId:string;topicIndex:number;topicTitle:string;month:string;focus:string;duration:number}[]=[]

raw.forEach(day=>day.subjectIds.forEach((subjectId,idx)=>{
  const subject=subjects.find(s=>s.id===subjectId)!
  const plan=semesterPlan(subject)
  const occurrence=appearances[subjectId]||0
  const total=totalBySubject[subjectId]||1
  const topicIndex=Math.min(7,Math.floor(occurrence*8/total))
  const topic=plan[topicIndex]
  appearances[subjectId]=occurrence+1
  const tk=`${subjectId}:${topicIndex}`
  topicAppearances[tk]=(topicAppearances[tk]||0)+1
  provisional.push({date:day.date,weekday:day.weekday,order:idx+1,subjectId,topicIndex,topicTitle:topic.title,month:topic.month,focus:topic.focus,duration:duration[subjectId]||50})
}))

const topicCounters:Record<string,number>={}
function stageFor(part:number,total:number){
  const ratio=part/total
  if(part===1)return 'Вводная лекция и карта темы'
  if(ratio<=.3)return 'Теория и ключевые понятия'
  if(ratio<=.5)return 'Формулы, связи и разбор примеров'
  if(ratio<=.7)return 'Практика базового и среднего уровня'
  if(ratio<=.88)return 'Углубление и самостоятельные задачи'
  return 'Повторение, тест и мини-зачёт'
}

export const studyDays:StudyDay[]=raw.map(day=>({
  date:day.date,
  weekday:day.weekday,
  sessions:provisional.filter(x=>x.date===day.date).map(x=>{
    const key=`${x.subjectId}:${x.topicIndex}`
    const part=(topicCounters[key]||0)+1
    topicCounters[key]=part
    const partsTotal=topicAppearances[key]
    return {...x,part,partsTotal,stage:stageFor(part,partsTotal)}
  })
}))

export function getStudyDay(date:string){return studyDays.find(d=>d.date===date)||studyDays[0]}
export function getStudyDayIndex(date:string){const i=studyDays.findIndex(d=>d.date===date);return i<0?0:i}
export function formatHumanDate(date:string){
  const d=parseDate(date)
  return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d)
}
export function topicWorkload(subjectId:string,topicIndex:number){
  return topicAppearances[`${subjectId}:${topicIndex}`]||0
}
export function subjectSemesterSessions(subjectId:string){return totalBySubject[subjectId]||0}
