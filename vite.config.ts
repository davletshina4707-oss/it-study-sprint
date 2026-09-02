import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'academy47-learning-content',
      transform(code, id) {
        if (id.endsWith('/src/main.tsx')) {
          return code
            .replace("from './richLessons'", "from './richLessonsAggregate'")
            .replace("from './semesterPlan'", "from './coursePlans'")
            .replace('<strong>8 больших тем</strong>','<strong>{plan.length} больших тем</strong>')
            .replace('<span>8 крупных тем</span>','<span>{plan.length} крупных тем</span>')
            .replace('done<8','done<plan.length')
            .replaceAll('8 крупных тем на каждый предмет','6–8 крупных тем в зависимости от предмета')
            .replaceAll('8 тем','6–8 тем')
            .replace('<span className="brand-mark">K</span>', '<span className="brand-mark">47</span>')
            .replace('<strong>KATYA Study</strong>', '<strong>ACADEMY 47</strong>')
            .replace('<small>личный университет</small>', '<small>твоя учебная система</small>')
        }
        if (id.endsWith('/src/studySchedule.ts')) {
          return code.replace("from './semesterPlan'", "from './coursePlans'")
        }
        return null
      },
    },
  ],
})
