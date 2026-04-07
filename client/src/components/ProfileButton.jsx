import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileButton = ({ user, loading }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (loading || !user) return null;

  // Get first letter or use default placeholder
  const getInitial = () => {
    return user.username ? user.username.charAt(0).toUpperCase() : "U";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary-content font-bold text-lg">{getInitial()}</span>
          )}
        </div>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <button onClick={() => navigate("/profile")}>View Profile</button>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileButton;