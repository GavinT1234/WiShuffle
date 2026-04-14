import React from 'react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">About WiShuffle</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              WiShuffle is dedicated to bringing music lovers together. We believe that music is best experienced and appreciated when shared with others. Our platform empowers users to create listening rooms, connect with friends, and discover new music through their communities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p>
              WiShuffle provides a social platform where you can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Create listening rooms and share real-time music experiences</li>
              <li>Connect with friends and build your music community</li>
              <li>Discover new music through your friends' playlists</li>
              <li>Share your favorite tracks and get recommendations</li>
              <li>Chat and discuss music with your network</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Community First:</strong> We prioritize building genuine connections between music lovers</li>
              <li><strong>Transparency:</strong> We believe in open communication with our users</li>
              <li><strong>Innovation:</strong> We continuously improve our platform to enhance the music discovery experience</li>
              <li><strong>Inclusivity:</strong> Music is for everyone, and so is WiShuffle</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p>
              WiShuffle was born from the simple idea that listening to music alone is fun, but sharing it with friends is even better. We noticed that while there are many music platforms out there, none truly captured the social aspect of music discovery. That's why we created WiShuffle – to bridge the gap between personal music taste and community engagement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
