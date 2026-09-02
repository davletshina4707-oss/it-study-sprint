import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  ArrowLeft,
  BookOpen,
  Bot,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock,
  Flame,
  Home,
  Languages,
  Library,
  Lightbulb,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
import './styles.css'

type CourseId = 'math' | 'probability' | 'it' | 'ai'
type Screen = 'home' | 'courses' | 'practice' | 'profile' | 'course' | 'lesson'
type Progress = {
  completed: string[]
  xp: number
  streak: number
  practiceBest: number
  lastCourse: CourseId
}
type Lesson = {
  id: string
  title: string
  duration: number
  intro: string
  points: string[]
  exampleTitle: string
  example: string
  question: string
  options: string[]
  correct: number
  explanation: string
}
type Course = {
  id: CourseId
  title: string
  short: string
  description: string
  icon: React.ReactNode
  tone: string
  lessons: Lesson[]
}

const initialProgress: Progress = {
  completed: [],
  xp: 120,
  streak: 4,
  practiceBest: 0,
  lastCourse: 'math',
}
const storageKey = 'it-study-sprint-v3'

const courses: Course[] = [
  {
    id: 'math',
    title: 'Высшая математика',
    short: 'Математика',
    description: 'Восстанавливаем базу и постепенно идём к вузовской математике.',
    icon: <Calculator size={22} />,
    tone: 'violet',
    lessons: [
      {
        id: 'math-equations',
        title: 'Линейные уравнения',
        duration: 18,
        intro: 'Уравнение — это равенство с неизвестной. Наша задача — оставить x один с одной стороны.',
        points: [
          'Одинаковое действие можно выполнять с обеими частями уравнения.',
          'Сначала переносим свободные числа, затем делим на коэффициент при x.',
          'Ответ всегда полезно проверить подстановкой.',
        ],
        exampleTitle: 'Разберём пример',
        example: '4x + 6 = 26 → 4x = 20 → x = 5. Проверка: 4×5 + 6 = 26.',
        question: 'Реши: 3x − 7 = 11. Чему равен x?',
        options: ['4', '5', '6', '7'],
        correct: 2,
        explanation: '3x − 7 = 11 → 3x = 18 → x = 6.',
      },
      {
        id: 'math-fractions',
        title: 'Дроби без паники',
        duration: 20,
        intro: 'Чтобы складывать и вычитать дроби, приводим их к общему знаменателю.',
        points: [
          'Знаменатель показывает, на сколько равных частей разделено целое.',
          'При общем знаменателе складываем или вычитаем только числители.',
          'В конце сокращаем дробь, если это возможно.',
        ],
        exampleTitle: 'Разберём пример',
        example: '2/3 + 1/6 = 4/6 + 1/6 = 5/6.',
        question: 'Вычисли: 3/4 − 1/8.',
        options: ['1/2', '5/8', '2/8', '7/8'],
        correct: 1,
        explanation: '3/4 = 6/8. Тогда 6/8 − 1/8 = 5/8.',
      },
      {
        id: 'math-functions',
        title: 'Что такое функция',
        duration: 22,
        intro: 'Функция связывает входное значение x с выходным значением y по определённому правилу.',
        points: [
          'x — аргумент функции, y — значение функции.',
          'Подставляем выбранный x в формулу и вычисляем y.',
          'График показывает сразу множество пар x и y.',
        ],
        exampleTitle: 'Разберём пример',
        example: 'Если y = 2x + 1 и x = 3, то y = 2×3 + 1 = 7.',
        question: 'Для функции y = 3x − 2 найди y при x = 4.',
        options: ['8', '10', '12', '14'],
        correct: 1,
        explanation: 'y = 3×4 − 2 = 12 − 2 = 10.',
      },
    ],
  },
  {
    id: 'probability',
    title: 'Теория вероятностей',
    short: 'Вероятность',
    description: 'Учимся считать шансы и понимать случайные события без зубрёжки.',
    icon: <BrainCircuit size={22} />,
    tone: 'orange',
    lessons: [
      {
        id: 'prob-basic',
        title: 'Вероятность события',
        duration: 18,
        intro: 'При равновозможных исходах вероятность — это доля подходящих исходов среди всех возможных.',
        points: [
          'Вероятность лежит от 0 до 1.',
          '0 означает невозможное событие, 1 — достоверное.',
          'Формула: P = число подходящих исходов / число всех исходов.',
        ],
        exampleTitle: 'Простой пример',
        example: 'У монеты два равновозможных исхода. Вероятность орла равна 1/2 = 0,5.',
        question: 'Какова вероятность выпадения числа 4 на честном шестигранном кубике?',
        options: ['1/2', '1/3', '1/6', '5/6'],
        correct: 2,
        explanation: 'Подходящий исход один, а всего равновозможных исходов шесть: P = 1/6.',
      },
      {
        id: 'prob-independent',
        title: 'Независимые события',
        duration: 21,
        intro: 'Если одно событие не меняет вероятность другого, события независимы.',
        points: [
          'Для совместного наступления независимых событий вероятности перемножаются.',
          'Два броска монеты не влияют друг на друга.',
          'Всегда проверяй, действительно ли события независимы.',
        ],
        exampleTitle: 'Простой пример',
        example: 'Два орла подряд: 1/2 × 1/2 = 1/4.',
        question: 'Вероятность попасть в цель одним выстрелом 0,8. Какова вероятность двух попаданий подряд при независимых выстрелах?',
        options: ['0,16', '0,64', '0,8', '1,6'],
        correct: 1,
        explanation: 'Для независимых событий: 0,8 × 0,8 = 0,64.',
      },
      {
        id: 'prob-opposite',
        title: 'Противоположное событие',
        duration: 17,
        intro: 'Если событие A не произошло, произошло противоположное событие. Их вероятности в сумме дают 1.',
        points: [
          'P(не A) = 1 − P(A).',
          'Так часто быстрее считать вероятность сложного события.',
          'Событие и его противоположность вместе покрывают все исходы.',
        ],
        exampleTitle: 'Простой пример',
        example: 'Если шанс дождя 0,3, то шанс того, что дождя не будет: 1 − 0,3 = 0,7.',
        question: 'Какова вероятность НЕ выбросить шестёрку на честном кубике?',
        options: ['1/6', '1/3', '2/3', '5/6'],
        correct: 3,
        explanation: 'P(6) = 1/6, поэтому P(не 6) = 1 − 1/6 = 5/6.',
      },
    ],
  },
  {
    id: 'it',
    title: 'IT · Основы',
    short: 'IT основы',
    description: 'Интернет, данные, алгоритмы и база, которая пригодится дальше в программировании.',
    icon: <BookOpen size={22} />,
    tone: 'cyan',
    lessons: [
      {
        id: 'it-internet',
        title: 'Как работает интернет',
        duration: 20,
        intro: 'Интернет — это огромная сеть устройств. Браузер запрашивает данные, а сервер отправляет ответ.',
        points: [
          'DNS помогает превратить понятное имя сайта в сетевой адрес.',
          'Запрос идёт к серверу, где находятся данные сайта.',
          'Ответ возвращается в браузер, который собирает страницу.',
        ],
        exampleTitle: 'Что происходит после ввода адреса',
        example: 'Ты вводишь адрес → браузер узнаёт адрес сервера через DNS → отправляет запрос → сервер отвечает → браузер показывает страницу.',
        question: 'Для чего в упрощённой схеме нужен DNS?',
        options: ['Чтобы хранить пароль', 'Чтобы узнать адрес сервера', 'Чтобы рисовать страницу', 'Чтобы заряжать устройство'],
        correct: 1,
        explanation: 'DNS сопоставляет доменное имя с сетевым адресом сервера, к которому нужно обратиться.',
      },
      {
        id: 'it-data',
        title: 'Биты, байты и данные',
        duration: 19,
        intro: 'Компьютер хранит данные в двоичном виде. Самая маленькая единица информации — бит: 0 или 1.',
        points: [
          'Бит принимает одно из двух значений: 0 или 1.',
          '8 бит образуют 1 байт.',
          'Текст, изображения и звук в памяти представлены числами.',
        ],
        exampleTitle: 'Связь единиц',
        example: '1 байт = 8 бит. Поэтому 4 байта содержат 32 бита.',
        question: 'Сколько бит в 3 байтах?',
        options: ['11', '16', '24', '32'],
        correct: 2,
        explanation: '1 байт = 8 бит, значит 3 × 8 = 24 бита.',
      },
      {
        id: 'it-algorithms',
        title: 'Алгоритмическое мышление',
        duration: 23,
        intro: 'Алгоритм — это конечная последовательность понятных шагов, ведущих к результату.',
        points: [
          'Шаги должны быть определёнными и выполнимыми.',
          'Алгоритм получает входные данные и выдаёт результат.',
          'В программировании алгоритм превращается в инструкции для компьютера.',
        ],
        exampleTitle: 'Алгоритм из жизни',
        example: 'Заварить чай: налить воду → вскипятить → положить чай → залить → подождать. Порядок шагов имеет значение.',
        question: 'Что лучше всего описывает алгоритм?',
        options: ['Случайный набор действий', 'Конечная последовательность шагов', 'Только математическая формула', 'Любая компьютерная программа'],
        correct: 1,
        explanation: 'Алгоритм — это именно конечная и определённая последовательность шагов для решения задачи.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'Искусственный интеллект',
    short: 'ИИ',
    description: 'Понимаем, как модели учатся, делают прогнозы и где заканчивается «магия».',
    icon: <Bot size={22} />,
    tone: 'pink',
    lessons: [
      {
        id: 'ai-ml',
        title: 'Что такое машинное обучение',
        duration: 22,
        intro: 'В машинном обучении мы не прописываем каждое правило вручную: модель находит закономерности в данных.',
        points: [
          'Данные используются как примеры для обучения.',
          'Модель настраивает внутренние параметры, чтобы уменьшать ошибки.',
          'После обучения модель применяет найденные закономерности к новым данным.',
        ],
        exampleTitle: 'Пример',
        example: 'Если дать модели много размеченных писем «спам / не спам», она может научиться классифицировать новые письма.',
        question: 'Что происходит при обучении модели?',
        options: ['Она физически ускоряет процессор', 'Она настраивает параметры по данным', 'Она удаляет все ошибки из данных', 'Она превращает текст только в картинки'],
        correct: 1,
        explanation: 'Во время обучения алгоритм изменяет параметры модели так, чтобы лучше решать задачу на обучающих примерах.',
      },
      {
        id: 'ai-supervised',
        title: 'Обучение с учителем',
        duration: 20,
        intro: 'При обучении с учителем у примеров есть правильные ответы — метки, на которых модель учится.',
        points: [
          'Для классификации метка может быть названием класса.',
          'Для регрессии меткой может быть числовое значение.',
          'Качество и репрезентативность данных сильно влияют на модель.',
        ],
        exampleTitle: 'Пример',
        example: 'Фото кошек и собак с подписями «кошка» и «собака» — набор размеченных данных.',
        question: 'Какой набор лучше всего подходит для обучения с учителем?',
        options: ['Фото без подписей', 'Фото с правильными метками классов', 'Пустая папка', 'Только случайные числа без цели'],
        correct: 1,
        explanation: 'Для обучения с учителем нужны примеры, для которых известен правильный целевой ответ.',
      },
      {
        id: 'ai-inference',
        title: 'Обучение и инференс',
        duration: 18,
        intro: 'Обучение — этап настройки модели, а инференс — использование уже обученной модели для получения результата.',
        points: [
          'Training: модель учится на данных.',
          'Inference: модель получает новый вход и выдаёт прогноз или ответ.',
          'Эти этапы отличаются по задачам и вычислительной нагрузке.',
        ],
        exampleTitle: 'Пример',
        example: 'Сначала модель обучили распознавать изображения. Когда ты загружаешь новое фото и получаешь ответ — это инференс.',
        question: 'Как называется применение уже обученной модели к новым данным?',
        options: ['Компиляция', 'Инференс', 'Разметка', 'Архивация'],
        correct: 1,
        explanation: 'Инференс — этап, когда обученная модель используется для предсказания или генерации результата.',
      },
    ],
  },
]

const practiceQuestions = courses.flatMap(course =>
  course.lessons.map(lesson => ({
    course: course.short,
    question: lesson.question,
    options: lesson.options,
    correct: lesson.correct,
    explanation: lesson.explanation,
  })),
)

function loadProgress(): Progress {
  try {
    return { ...initialProgress, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }
  } catch {
    return initialProgress
  }
}

function persist(progress: Progress) {
  localStorage.setItem(storageKey, JSON.stringify(progress))
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [progress, setProgress] = useState<Progress>(initialProgress)
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>('math')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [answer, setAnswer] = useState<number | null>(null)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [practiceAnswers, setPracticeAnswers] = useState<number[]>([])
  const [practiceDone, setPracticeDone] = useState(false)

  useEffect(() => setProgress(loadProgress()), [])

  const completedCount = progress.completed.length
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0)
  const completionPercent = Math.round((completedCount / totalLessons) * 100)
  const level = Math.floor(progress.xp / 250) + 1
  const xpInLevel = progress.xp % 250
  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0]

  const todayLessons = useMemo(() => {
    const unfinished = courses.flatMap(course =>
      course.lessons
        .filter(lesson => !progress.completed.includes(lesson.id))
        .map(lesson => ({ course, lesson })),
    )
    return unfinished.slice(0, 3)
  }, [progress.completed])

  const updateProgress = (next: Progress) => {
    setProgress(next)
    persist(next)
  }

  const openCourse = (id: CourseId) => {
    setSelectedCourseId(id)
    setScreen('course')
  }

  const openLesson = (courseId: CourseId, lesson: Lesson) => {
    setSelectedCourseId(courseId)
    setSelectedLesson(lesson)
    setAnswer(null)
    setScreen('lesson')
  }

  const completeLesson = () => {
    if (!selectedLesson) return
    const alreadyDone = progress.completed.includes(selectedLesson.id)
    const next: Progress = {
      ...progress,
      completed: alreadyDone ? progress.completed : [...progress.completed, selectedLesson.id],
      xp: alreadyDone ? progress.xp : progress.xp + 60,
      lastCourse: selectedCourseId,
    }
    updateProgress(next)
    setScreen('course')
  }

  const startPractice = () => {
    setPracticeIndex(0)
    setPracticeAnswers([])
    setPracticeDone(false)
  }

  const answerPractice = (index: number) => {
    if (practiceAnswers.length > practiceIndex) return
    const next = [...practiceAnswers, index]
    setPracticeAnswers(next)
  }

  const nextPractice = () => {
    if (practiceAnswers.length <= practiceIndex) return
    if (practiceIndex >= 5) {
      const score = practiceAnswers.slice(0, 6).reduce((sum, value, idx) => {
        return sum + (value === practiceQuestions[idx].correct ? 1 : 0)
      }, 0)
      const gained = score * 20
      updateProgress({
        ...progress,
        xp: progress.xp + gained,
        practiceBest: Math.max(progress.practiceBest, score),
      })
      setPracticeDone(true)
      return
    }
    setPracticeIndex(practiceIndex + 1)
  }

  if (screen === 'lesson' && selectedLesson) {
    const isCorrect = answer === selectedLesson.correct
    const completed = progress.completed.includes(selectedLesson.id)
    return (
      <main className="app-bg">
        <div className="app-shell lesson-shell">
          <button className="round-button" onClick={() => setScreen('course')} aria-label="Назад">
            <ArrowLeft size={19} />
          </button>
          <div className={`lesson-hero ${selectedCourse.tone}`}>
            <div className="lesson-course-label">{selectedCourse.title}</div>
            <h1>{selectedLesson.title}</h1>
            <div className="lesson-meta"><Clock size={15} /> {selectedLesson.duration} минут <span>•</span> +60 XP</div>
          </div>

          <section className="content-card">
            <div className="section-kicker"><Lightbulb size={16} /> Сначала поймём смысл</div>
            <p className="lead-text">{selectedLesson.intro}</p>
          </section>

          <section className="content-card">
            <div className="section-kicker"><BookOpen size={16} /> Запомни три вещи</div>
            <div className="point-list">
              {selectedLesson.points.map((point, index) => (
                <div className="point" key={point}>
                  <span>{index + 1}</span><p>{point}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="example-card">
            <div className="section-kicker white"><Sparkles size={16} /> {selectedLesson.exampleTitle}</div>
            <p>{selectedLesson.example}</p>
          </section>

          <section className="content-card quiz-card">
            <div className="section-kicker"><Target size={16} /> Проверь себя</div>
            <h2>{selectedLesson.question}</h2>
            <div className="answer-grid">
              {selectedLesson.options.map((option, index) => {
                const chosen = answer === index
                const revealCorrect = answer !== null && index === selectedLesson.correct
                const wrong = chosen && !isCorrect
                return (
                  <button
                    className={`answer-option ${chosen ? 'chosen' : ''} ${revealCorrect ? 'right' : ''} ${wrong ? 'wrong' : ''}`}
                    key={option}
                    onClick={() => answer === null && setAnswer(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>{option}
                  </button>
                )
              })}
            </div>
            {answer !== null && (
              <div className={`feedback ${isCorrect ? 'success' : 'retry'}`}>
                <strong>{isCorrect ? 'Отлично! Всё верно.' : 'Почти. Разберём ответ.'}</strong>
                <p>{selectedLesson.explanation}</p>
              </div>
            )}
          </section>

          <button className="cta primary-cta" disabled={answer === null} onClick={completeLesson}>
            {completed ? 'Вернуться к курсу' : 'Завершить урок и получить 60 XP'}
          </button>
        </div>
      </main>
    )
  }

  if (screen === 'course') {
    const done = selectedCourse.lessons.filter(lesson => progress.completed.includes(lesson.id)).length
    return (
      <main className="app-bg">
        <div className="app-shell">
          <button className="round-button" onClick={() => setScreen('courses')} aria-label="Назад">
            <ArrowLeft size={19} />
          </button>
          <div className={`course-detail-hero ${selectedCourse.tone}`}>
            <div className="course-big-icon">{selectedCourse.icon}</div>
            <div>
              <div className="eyebrow-light">Курс</div>
              <h1>{selectedCourse.title}</h1>
              <p>{selectedCourse.description}</p>
            </div>
          </div>

          <div className="course-progress-line">
            <span>{done} из {selectedCourse.lessons.length} уроков</span>
            <strong>{Math.round((done / selectedCourse.lessons.length) * 100)}%</strong>
          </div>
          <div className="progress-track"><div style={{ width: `${(done / selectedCourse.lessons.length) * 100}%` }} /></div>

          <div className="lesson-list">
            {selectedCourse.lessons.map((lesson, index) => {
              const completed = progress.completed.includes(lesson.id)
              return (
                <button className="lesson-item" key={lesson.id} onClick={() => openLesson(selectedCourse.id, lesson)}>
                  <div className={`lesson-number ${completed ? 'complete' : ''}`}>
                    {completed ? <CheckCircle2 size={18} /> : index + 1}
                  </div>
                  <div className="lesson-item-text">
                    <strong>{lesson.title}</strong>
                    <span><Clock size={13} /> {lesson.duration} мин · +60 XP</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              )
            })}
          </div>
        </div>
        <BottomNav active="courses" onChange={setScreen} />
      </main>
    )
  }

  if (screen === 'practice') {
    const question = practiceQuestions[practiceIndex]
    const selected = practiceAnswers[practiceIndex]
    const answered = selected !== undefined
    const currentCorrect = answered && selected === question.correct
    const finalScore = practiceAnswers.slice(0, 6).reduce((sum, value, idx) => sum + (value === practiceQuestions[idx].correct ? 1 : 0), 0)
    return (
      <main className="app-bg with-nav">
        <div className="app-shell">
          <Header title="Тренажёр" subtitle="Короткая практика, чтобы знания не выветривались." />

          {practiceDone ? (
            <section className="result-card">
              <div className="result-icon"><Trophy size={34} /></div>
              <div className="result-label">Тренировка завершена</div>
              <h2>{finalScore} / 6</h2>
              <p>Ты получила <strong>+{finalScore * 20} XP</strong>. Лучший результат: {Math.max(progress.practiceBest, finalScore)}/6.</p>
              <button className="cta primary-cta" onClick={startPractice}><RotateCcw size={17} /> Пройти ещё раз</button>
            </section>
          ) : (
            <>
              <div className="practice-top">
                <span>Вопрос {practiceIndex + 1} из 6</span>
                <span>{question.course}</span>
              </div>
              <div className="practice-track"><div style={{ width: `${((practiceIndex + 1) / 6) * 100}%` }} /></div>
              <section className="content-card practice-card">
                <div className="practice-orb"><Zap size={22} /></div>
                <h2>{question.question}</h2>
                <div className="answer-grid">
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      className={`answer-option ${selected === index ? 'chosen' : ''} ${answered && index === question.correct ? 'right' : ''} ${answered && selected === index && selected !== question.correct ? 'wrong' : ''}`}
                      onClick={() => answerPractice(index)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>{option}
                    </button>
                  ))}
                </div>
                {answered && (
                  <div className={`feedback ${currentCorrect ? 'success' : 'retry'}`}>
                    <strong>{currentCorrect ? 'Верно!' : 'Разберём.'}</strong>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </section>
              <button className="cta primary-cta" disabled={!answered} onClick={nextPractice}>
                {practiceIndex === 5 ? 'Узнать результат' : 'Следующий вопрос'}
              </button>
            </>
          )}
        </div>
        <BottomNav active="practice" onChange={setScreen} />
      </main>
    )
  }

  if (screen === 'profile') {
    return (
      <main className="app-bg with-nav">
        <div className="app-shell">
          <Header title="Мой прогресс" subtitle="Здесь видно, как складывается твоя учебная серия." />
          <section className="profile-hero">
            <div className="avatar"><CircleUserRound size={34} /></div>
            <div><div className="eyebrow-light">Уровень {level}</div><h2>Катя</h2><p>{progress.xp} XP всего</p></div>
          </section>
          <div className="level-card">
            <div className="row-between"><span>До уровня {level + 1}</span><strong>{250 - xpInLevel} XP</strong></div>
            <div className="progress-track"><div style={{ width: `${(xpInLevel / 250) * 100}%` }} /></div>
          </div>
          <div className="metric-grid">
            <Metric icon={<Flame size={20} />} value={`${progress.streak}`} label="дня подряд" tone="orange" />
            <Metric icon={<Trophy size={20} />} value={`${progress.practiceBest}/6`} label="лучший тест" tone="yellow" />
            <Metric icon={<BookOpen size={20} />} value={`${completedCount}`} label="уроков пройдено" tone="cyan" />
            <Metric icon={<Star size={20} />} value={`${completionPercent}%`} label="всего курса" tone="violet" />
          </div>
          <section className="content-card">
            <div className="section-kicker"><Target size={16} /> Твоя цель</div>
            <h2>Не идеальная учёба, а стабильная</h2>
            <p className="body-copy">Лучше 25–40 минут почти каждый день, чем один тяжёлый марафон раз в неделю. Сайт хранит прогресс прямо на этом устройстве.</p>
          </section>
        </div>
        <BottomNav active="profile" onChange={setScreen} />
      </main>
    )
  }

  if (screen === 'courses') {
    return (
      <main className="app-bg with-nav">
        <div className="app-shell">
          <Header title="Мои курсы" subtitle="Выбирай предмет и двигайся маленькими понятными шагами." />
          <div className="course-grid">
            {courses.map(course => {
              const done = course.lessons.filter(lesson => progress.completed.includes(lesson.id)).length
              return (
                <button className={`course-card ${course.tone}`} key={course.id} onClick={() => openCourse(course.id)}>
                  <div className="course-card-icon">{course.icon}</div>
                  <div className="course-card-top"><span>{done}/{course.lessons.length} уроков</span><ChevronRight size={18} /></div>
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                  <div className="mini-progress"><div style={{ width: `${(done / course.lessons.length) * 100}%` }} /></div>
                </button>
              )
            })}
          </div>
          <section className="coming-card">
            <div className="coming-icon"><Languages size={22} /></div>
            <div><strong>Английский для IT — скоро</strong><p>Добавим отдельный курс с нуля: интерфейсы, термины и разговорная практика.</p></div>
            <LockKeyhole size={18} />
          </section>
        </div>
        <BottomNav active="courses" onChange={setScreen} />
      </main>
    )
  }

  return (
    <main className="app-bg with-nav">
      <div className="app-shell">
        <div className="home-header">
          <div><div className="date-pill">2 сентября · среда</div><h1>Доброе утро, Катя 👋</h1><p>Сегодня не нужно знать всё. Нужно стать чуть сильнее, чем вчера.</p></div>
          <div className="level-bubble"><span>LVL</span><strong>{level}</strong></div>
        </div>

        <section className="hero-card">
          <div className="hero-glow one" /><div className="hero-glow two" />
          <div className="hero-content">
            <div className="hero-kicker"><Sparkles size={15} /> Твой учебный спринт</div>
            <h2>{completionPercent}% пути уже собрано</h2>
            <p>Серия {progress.streak} дня · {completedCount} уроков · {progress.xp} XP</p>
            <div className="hero-progress"><div style={{ width: `${Math.max(6, completionPercent)}%` }} /></div>
            <button className="hero-button" onClick={() => {
              const next = todayLessons[0]
              if (next) openLesson(next.course.id, next.lesson)
              else setScreen('courses')
            }}><Play size={17} fill="currentColor" /> Продолжить обучение</button>
          </div>
        </section>

        <div className="section-heading"><div><span>План на сегодня</span><h2>3 коротких шага</h2></div><div className="time-chip"><Clock size={14} /> ~55 мин</div></div>
        <div className="today-list">
          {todayLessons.length ? todayLessons.map(({ course, lesson }, index) => (
            <button className="today-card" key={lesson.id} onClick={() => openLesson(course.id, lesson)}>
              <div className={`today-index ${course.tone}`}>{index + 1}</div>
              <div className="today-text"><span>{course.short}</span><strong>{lesson.title}</strong><small>{lesson.duration} мин · +60 XP</small></div>
              <ChevronRight size={18} />
            </button>
          )) : (
            <div className="all-done"><Trophy size={28} /><strong>Все текущие уроки пройдены!</strong><span>Можно закрепить знания в тренажёре.</span></div>
          )}
        </div>

        <div className="section-heading compact"><div><span>Быстрый выбор</span><h2>К чему вернёмся?</h2></div><button className="text-button" onClick={() => setScreen('courses')}>Все курсы</button></div>
        <div className="quick-courses">
          {courses.map(course => (
            <button className={`quick-course ${course.tone}`} key={course.id} onClick={() => openCourse(course.id)}>
              <div>{course.icon}</div><strong>{course.short}</strong>
            </button>
          ))}
        </div>

        <section className="challenge-card" onClick={() => { startPractice(); setScreen('practice') }}>
          <div className="challenge-icon"><Zap size={24} /></div>
          <div><div className="eyebrow-light">Ежедневный челлендж</div><h3>6 вопросов на скорость</h3><p>Закрепи темы и забери до +120 XP.</p></div>
          <ChevronRight size={20} />
        </section>
      </div>
      <BottomNav active="home" onChange={setScreen} />
    </main>
  )
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="page-header"><h1>{title}</h1><p>{subtitle}</p></div>
}

function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: string }) {
  return <div className={`metric-card ${tone}`}><div>{icon}</div><strong>{value}</strong><span>{label}</span></div>
}

function BottomNav({ active, onChange }: { active: 'home' | 'courses' | 'practice' | 'profile'; onChange: (screen: Screen) => void }) {
  const items = [
    { id: 'home' as const, label: 'Сегодня', icon: <Home size={20} /> },
    { id: 'courses' as const, label: 'Курсы', icon: <Library size={20} /> },
    { id: 'practice' as const, label: 'Практика', icon: <Target size={20} /> },
    { id: 'profile' as const, label: 'Прогресс', icon: <Trophy size={20} /> },
  ]
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
          {item.icon}<span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)
