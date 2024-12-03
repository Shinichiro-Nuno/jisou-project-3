import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import LearningRecord from './LearningRecord.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LearningRecord />
  </StrictMode>,
)
