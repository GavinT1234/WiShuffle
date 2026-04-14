import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Create Rooms",
      description: "Start a listening room and invite friends to share music in real-time",
      icon: "🎧",
    },
    {
      title: "Connect with Friends",
      description: "Add friends, see their profiles, and discover their favorite tracks",
      icon: "🗣️",
    },
    {
      title: "Share Your Top Songs",
      description: "Showcase your favorite songs and let others know what you love",
      icon: "😁",
    },
    {
      title: "Direct Messaging",
      description: "Chat with friends about music and make new recommendations",
      icon: "💬",
    },
  ];

  return (
    <div className="bg-base-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4">Features</h2>
        <p className="text-center text-base-content/70 mb-12 text-lg">
          Everything you need to enjoy music with your community
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition">
              <div className="card-body text-center">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="card-title justify-center text-xl">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
