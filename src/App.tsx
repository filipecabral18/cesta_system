import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import LoginPage from './features/auth/LoginPage';
import { useAuth } from './features/auth/useAuth';
import DespensaPage from './features/despensa/DespensaPage';
import ListasPage from './features/listas/ListasPage';
import NovaListaPage from './features/listas/NovaListaPage';
import CompraPage from './features/compra/CompraPage';

export default function App() {
  const { session, carregando } = useAuth();

  // Enquanto verifica se já existe sessão salva, evita piscar a tela de login.
  if (carregando) {
    return (
      <div className="flex min-h-full items-center justify-center text-gray-400">
        Carregando…
      </div>
    );
  }

  // Sem sessão -> só a tela de login. As rotas do app nem são montadas.
  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-white shadow-sm">
      <AppHeader email={session.user.email ?? ''} />
      <main className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="/despensa" replace />} />
          <Route path="/despensa" element={<DespensaPage />} />
          <Route path="/listas" element={<ListasPage />} />
          <Route path="/listas/nova" element={<NovaListaPage />} />
          <Route path="/listas/:id" element={<CompraPage />} />
          <Route path="*" element={<Navigate to="/despensa" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
