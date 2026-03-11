import prisma from '../src/config/db.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'john_doe',
      password: 'hashedpassword123', // In real app, use bcrypt
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'jane_smith',
      password: 'hashedpassword456',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  });

  console.log('✅ Created users');

  // Create sample songs
  const song1 = await prisma.song.create({
    data: {
      title: 'Take Five',
      artist: 'Dave Brubeck Quartet',
      youtubeUrl: 'https://www.youtube.com/watch?v=vmDDOFXSgAs',
      duration: 340,
      thumbnail: 'https://img.youtube.com/vi/vmDDOFXSgAs/maxresdefault.jpg',
      addedBy: user1.id,
    },
  });

  const song2 = await prisma.song.create({
    data: {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMt7o',
      duration: 354,
      thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMt7o/maxresdefault.jpg',
      addedBy: user1.id,
    },
  });

  const song3 = await prisma.song.create({
    data: {
      title: 'Nightcall',
      artist: 'Kavinsky',
      youtubeUrl: 'https://www.youtube.com/watch?v=MV_3Dpw-BRY',
      duration: 360,
      thumbnail: 'https://img.youtube.com/vi/MV_3Dpw-BRY/maxresdefault.jpg',
      addedBy: user2.id,
    },
  });

  const song4 = await prisma.song.create({
    data: {
      title: 'Clair de Lune',
      artist: 'Claude Debussy',
      youtubeUrl: 'https://www.youtube.com/watch?v=CvFH_6DNRCY',
      duration: 450,
      thumbnail: 'https://img.youtube.com/vi/CvFH_6DNRCY/maxresdefault.jpg',
      addedBy: user1.id,
    },
  });

  const song5 = await prisma.song.create({
    data: {
      title: 'Epic Battle Theme',
      artist: 'Two Steps From Hell',
      youtubeUrl: 'https://www.youtube.com/watch?v=kLIJBn1g6VA',
      duration: 240,
      thumbnail: 'https://img.youtube.com/vi/kLIJBn1g6VA/maxresdefault.jpg',
      addedBy: user2.id,
    },
  });

  console.log('✅ Created songs');

  // Create sample playlist for user 1
  const playlist1 = await prisma.playlist.create({
    data: {
      name: 'My Gaming Playlist',
      description: 'Music for intense gaming sessions',
      userId: user1.id,
      isPublic: false,
    },
  });

  const playlist2 = await prisma.playlist.create({
    data: {
      name: 'Relaxing Vibes',
      description: 'Chill music to relax',
      userId: user1.id,
      isPublic: true,
    },
  });

  console.log('✅ Created playlists');

  // Create folders in playlist
  const folder1 = await prisma.folder.create({
    data: {
      playlistId: playlist1.id,
      name: 'Intense Action',
      description: 'High energy tracks',
      isShuffle: false,
      orderIndex: 0,
    },
  });

  const folder2 = await prisma.folder.create({
    data: {
      playlistId: playlist1.id,
      name: 'Chill Zone',
      description: 'Relaxing tracks',
      isShuffle: true,
      orderIndex: 1,
    },
  });

  const folder3 = await prisma.folder.create({
    data: {
      playlistId: playlist2.id,
      name: 'Classical',
      description: 'Classical music collection',
      isShuffle: false,
      orderIndex: 0,
    },
  });

  console.log('✅ Created folders');

  // Add songs to folders
  await prisma.folderSong.create({
    data: {
      folderId: folder1.id,
      songId: song5.id,
      orderIndex: 0,
    },
  });

  await prisma.folderSong.create({
    data: {
      folderId: folder2.id,
      songId: song1.id,
      orderIndex: 0,
    },
  });

  await prisma.folderSong.create({
    data: {
      folderId: folder2.id,
      songId: song4.id,
      orderIndex: 1,
    },
  });

  await prisma.folderSong.create({
    data: {
      folderId: folder3.id,
      songId: song4.id,
      orderIndex: 0,
    },
  });

  console.log('✅ Added songs to folders');

  // Create sample room
  const room1 = await prisma.room.create({
    data: {
      name: 'Late Night Gaming',
      description: 'WoW raid group listening session',
      ownerId: user1.id,
      currentSongId: song2.id,
      skipVoteThreshold: 50,
      isActive: true,
    },
  });

  console.log('✅ Created rooms');

  // Add users to DJ queue
  await prisma.dJQueueEntry.create({
    data: {
      userId: user1.id,
      roomId: room1.id,
      playlistId: playlist1.id,
      position: 0,
    },
  });

  await prisma.dJQueueEntry.create({
    data: {
      userId: user2.id,
      roomId: room1.id,
      playlistId: playlist2.id,
      position: 1,
    },
  });

  console.log('✅ Added users to DJ queue');

  // Add sample votes
  await prisma.vote.create({
    data: {
      userId: user2.id,
      roomId: room1.id,
      songId: song2.id,
      voteType: 'like',
    },
  });

  await prisma.vote.create({
    data: {
      userId: user1.id,
      roomId: room1.id,
      songId: song1.id,
      voteType: 'like',
    },
  });

  console.log('✅ Added votes');

  // Add song history
  await prisma.songHistory.create({
    data: {
      roomId: room1.id,
      songId: song5.id,
      playedAt: new Date(Date.now() - 3600000), // 1 hour ago
      duration: 240,
    },
  });

  console.log('✅ Added song history');

  console.log('✨ Seeding complete!');
  console.log(`
Sample Data Created:
- Users: john_doe, jane_smith
- Playlists: My Gaming Playlist, Relaxing Vibes
- Folders: Intense Action, Chill Zone, Classical
- Songs: 5 tracks
- Room: Late Night Gaming
- DJ Queue entries for both users
- Sample votes and history
  `);
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
