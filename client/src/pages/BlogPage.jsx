import React from 'react';

export function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Welcome to WiShuffle',
      date: 'April 14, 2026',
      excerpt: 'Introducing WiShuffle, the new way to discover and share music with your friends in real-time.',
      content: `We're thrilled to launch WiShuffle and bring a fresh perspective to music discovery. Whether you're into hip-hop, pop, jazz, or any other genre, WiShuffle helps you connect with like-minded music enthusiasts and explore new sounds together.

Our platform makes it easy to create listening rooms where you and your friends can enjoy music simultaneously while chatting about your favorite tracks. It's time to stop listening alone and start building your music community.`
    },
    {
      id: 2,
      title: 'Tips for Creating the Perfect Listening Room',
      date: 'April 10, 2026',
      excerpt: 'Learn how to set up an engaging listening room that keeps your friends coming back.',
      content: `Creating a great listening room is about more than just music – it's about building a community. Here are some tips to make your room stand out:

1. Choose a meaningful name and description
2. Select consistent genres that align with your room's theme
3. Be active in the chat and engage with recommendations
4. Create regular listening sessions at consistent times
5. Share your top songs and get to know what others are listening to

Remember, the best listening rooms are built on genuine passion for music and real connections with friends.`
    },
    {
      id: 3,
      title: 'Discovering New Music Through Your Network',
      date: 'March 28, 2026',
      excerpt: 'Explore how WiShuffle helps you find new artists and tracks through your friends.',
      content: `One of the best ways to discover new music is through the people you trust. On WiShuffle, you can see what your friends are listening to, check out their top songs, and get personalized recommendations.

Don't just stick to your usual playlists – venture into your friends' recommendations, join different listening rooms, and expand your musical horizons. You might just discover your new favorite artist!`
    }
  ];

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">WiShuffle Blog</h1>
        
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl">{post.title}</h2>
                <p className="text-sm text-base-content/70">{post.date}</p>
                <p className="py-4">{post.excerpt}</p>
                <details className="cursor-pointer">
                  <summary className="text-primary font-semibold hover:underline">Read More</summary>
                  <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
