import React from "react";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";

const Navbar = () => {
  return (
    <div className="drawer border-b border-border">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
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
          <a href="/" className="flex-1">
            <div className="mx-2 px-2 text-2xl font-bold tracking-wider ">
              WiShuffle
            </div>
          </a>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal flex gap-4">
              {/* Navbar menu content here */}
              <li>
                <LoginButton />
              </li>
              <li>
                <RegisterButton />
              </li>
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
          <li>
            <button>no</button>
          </li>
          <li>
            <button>hi</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
