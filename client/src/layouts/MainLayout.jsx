import { Outlet, Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../context/SocketContext";

const MainLayout = () => {
  const { user } = useUser();
  const { handleLogout } = useAuth();
  const { connected } = useSocket();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-4 py-3 border-b">
        <Link to="/dashboard" className="font-bold text-lg">PlugClone</Link>
        <div className="flex items-center gap-4">
          <span className="text-xs ${connected ? `text-green-500` : `text-red-400`}">
            {connected ? "● live" : "○ offline"}
          </span>
          <span className="text-sm">{user?.username}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />   {/* Dashboard, RoomPage, etc render here */}
      </main>
    </div>
  );
};

export default MainLayout;