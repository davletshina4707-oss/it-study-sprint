import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rich-lessons-aggregate',
      transform(code, id) {
        if (id.endsWith('/src/main.tsx')) {
          return code.replace("from './richLessons'", "from './richLessonsAggregate'")
        }
        return null
      },
    },
  ],
})
