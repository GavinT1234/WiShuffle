import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your WiShuffle account and set up your profile with your favorite music",
    },
    {
      number: "2",
      title: "Connect",
      description: "Find and add friends to start building your music community",
    },
    {
      number: "3",
      title: "Create or Join Rooms",
      description: "Start a listening room or join an existing one to share music with friends",
    },
    {
      number: "4",
      title: "Explore & Share",
      description: "Discover new music, share your favorites, and chat with friends about tracks",
    },
  ];

  return (
    <div className="bg-base-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-base-content/70 mb-12 text-lg">
          Get started with WiShuffle in just a few simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                <p className="text-center text-base-content/70">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-1 bg-primary/30 -ml-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
