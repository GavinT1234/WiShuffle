import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import FriendProfilePage from "./pages/FriendProfilePage";
import MessagesPage from "./pages/MessagesPage";

import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <div className="h-screen flex flex-col">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoutes>
                    <Dashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoutes>
                    <ProfilePage />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoutes>
                    <FriendProfilePage />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/friends"
                element={
                  <ProtectedRoutes>
                    <FriendsPage />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoutes>
                    <MessagesPage />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/messages/:partnerId"
                element={
                  <ProtectedRoutes>
                    <MessagesPage />
                  </ProtectedRoutes>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
