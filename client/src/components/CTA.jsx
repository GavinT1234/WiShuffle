import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CTA = () => {
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
    <div className="bg-gradient-to-r py-16" style={{backgroundImage: 'linear-gradient(to right, #aa3bff, rgba(170, 59, 255, 0.5))'}}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold text-white mb-4">
          Ready to Join the Music Community?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Connect with friends and discover music together. Create your WiShuffle account today!
        </p>
        <button onClick={handleGetStarted} className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-[#aa3bff]">
          {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
        </button>
      </div>
    </div>
  );
};

export default CTA;
