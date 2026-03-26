import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import { LoginPage } from './pages/LoginPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomPage } from './pages/RoomPage';

function App() {
  const auth = useAuth();
  const { socket, connected } = useSocket(auth.token);

  if (!auth.user) {
    return (
      <LoginPage
        authHook={auth}
        onLogin={() => {}} // auth state updates internally in hook
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route
          path="/rooms"
          element={
            <RoomsPage
              token={auth.token}
              user={auth.user}
              onLogout={auth.logout}
            />
          }
        />
        <Route
          path="/room/:id"
          element={
            <RoomPage
              socket={socket}
              connected={connected}
              user={auth.user}
              token={auth.token}
            />
          }
        />
        <Route path="*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;