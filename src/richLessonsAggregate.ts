import { getRichLesson as getCoreRichLesson } from './richLessons'
import { getDayOneRichLesson } from './dayOneLessons'

export function getRichLesson(subjectId:string,lessonId:string){
  return getCoreRichLesson(subjectId,lessonId) || getDayOneRichLesson(subjectId,lessonId)
}
