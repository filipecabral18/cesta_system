import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import DespensaPage from './features/despensa/DespensaPage'
import ListasPage from './features/listas/ListasPage'

export default function App() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-white shadow-sm">
      <main className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="/despensa" replace />} />
          <Route path="/despensa" element={<DespensaPage />} />
          <Route path="/listas" element={<ListasPage />} />
          <Route path="*" element={<Navigate to="/despensa" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
