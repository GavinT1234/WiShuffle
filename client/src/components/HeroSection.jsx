import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="hero bg-gradient-to-b from-base-300 to-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold mb-4">WiShuffle</h1>
          <p className="text-xl py-6 leading-relaxed">
            Discover a new way to share music with friends. Create listening rooms, connect with music lovers, and explore each other's favorite tracks. Build your music community and discover what your friends are listening to.
          </p>
          <button onClick={handleGetStarted} className="btn btn-success btn-lg">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
