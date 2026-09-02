import { getRichLesson as getCoreRichLesson } from './richLessons'
import { getDayOneRichLesson } from './dayOneLessons'
import { getAllSubjectRichLesson } from './allSubjectRichLessons'

export function getRichLesson(subjectId:string,lessonId:string){
  return getCoreRichLesson(subjectId,lessonId)
    || getDayOneRichLesson(subjectId,lessonId)
    || getAllSubjectRichLesson(subjectId,lessonId)
}
