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
    <div className="bg-gradient-to-r from-primary to-primary/80 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold text-primary-content mb-4">
          Ready to Join the Music Community?
        </h2>
        <p className="text-xl text-primary-content/90 mb-8">
          Connect with friends and discover music together. Create your WiShuffle account today!
        </p>
        <button onClick={handleGetStarted} className="btn btn-lg btn-outline text-success-content border-success-content hover:bg-success-content hover:text-success">
          {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
        </button>
      </div>
    </div>
  );
};

export default CTA;
