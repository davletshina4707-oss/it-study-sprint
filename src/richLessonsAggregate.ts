import { getRichLesson as getCoreRichLesson } from './richLessons'
import { getDayOneRichLesson } from './dayOneLessons'
import { getAllSubjectRichLesson } from './allSubjectRichLessons'
import { getFutureRichLesson } from './futureRichLessons'

export function getRichLesson(subjectId:string,lessonId:string){
  return getCoreRichLesson(subjectId,lessonId)
    || getDayOneRichLesson(subjectId,lessonId)
    || getAllSubjectRichLesson(subjectId,lessonId)
    || getFutureRichLesson(subjectId,lessonId)
}
