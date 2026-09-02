import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'learning-content-aggregate',
      transform(code, id) {
        if (id.endsWith('/src/main.tsx')) {
          return code
            .replace("from './richLessons'", "from './richLessonsAggregate'")
            .replace("from './semesterPlan'", "from './coursePlans'")
        }
        if (id.endsWith('/src/studySchedule.ts')) {
          return code.replace("from './semesterPlan'", "from './coursePlans'")
        }
        return null
      },
    },
  ],
})
