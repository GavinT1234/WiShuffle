import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileButton = ({ user, loading }) => {
  const navigate = useNavigate();

  if (loading || !user) return null;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar flex items-center gap-2">
        <div className="flex items-center gap-2">
          {user.avatarUrl && (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
            </div>
          )}
          <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
        </div>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <button onClick={() => navigate("/profile")}>View Profile</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileButton;