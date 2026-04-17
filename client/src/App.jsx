import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// pages
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard    from "./pages/Dashboard";
import RoomPage     from "./pages/RoomPage";
import NotFound     from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <UserProvider>               {/* auth state — outermost, no deps */}
      <SocketProvider>            {/* socket connects after user is known */}
        <Routes>

          {/* public routes */}
          <Route path="/login"    element={<LoginPage />}    />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected routes — all share MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index             element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />}                   />
              <Route path="/room/:id"   element={<RoomPage />}                    />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </UserProvider>
  </BrowserRouter>
);

export default App;