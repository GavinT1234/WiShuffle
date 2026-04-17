import React from "react";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";
import { useAuth } from "../context/AuthContext";
import ProfileButton from "./ProfileButton";
import { useGetUser } from "../hooks/useGetUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const { user, loading, fetchUser } = useGetUser();
  const navigate = useNavigate();

  // Refetch user data when logged in status changes to refresh avatar/profile changes
  useEffect(() => {
    if (isLoggedIn && fetchUser) {
      fetchUser();
    }
  }, [isLoggedIn]);

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };
  return (
    <div className="drawer border-b border-border">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div onClick={handleLogoClick} className="flex-1 cursor-pointer">
            <div className="mx-2 px-2 text-2xl font-bold tracking-wider">
              WiShuffle
            </div>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal flex gap-4 items-center">
              {isLoggedIn ? (
                  <>
                    <li>
                      <button className="btn border hover:border-white" onClick={() => navigate("/playlists")}>Playlists</button>
                    </li>
                    <li>
                      <button className="btn border hover:border-white" onClick={() => navigate("/dashboard")}>Rooms</button>
                    </li>
                <li>
                  <ProfileButton user={user} loading={loading} />
                </li>

                  </>
              ) : (
                <>
                  <li>
                    <LoginButton />
                  </li>
                  <li>
                    <RegisterButton />
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              </li>
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={() => navigate("/friends")}>Friends</button>
              </li>
              <li>
                <button onClick={() => navigate("/messages")}>Messages</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <LoginButton />
              </li>
              <li>
                <RegisterButton />
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;