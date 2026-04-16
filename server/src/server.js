import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer } from 'node:http';
import { initSocket } from './socket/index.js';
import { connectRedis } from './config/redis.js';
import roomRoutes from './routes/roomRoutes.js';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  console.log('Loaded .env file');
} else {
  console.log('📋 Using environment variables from EB');
}

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);

// HTTP Server + WebSockets
const server = createServer(app);
const io = await initSocket(server);

// API Routes (before static files)
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/youtube', youtubeRoutes);

// Serve static client files (after API routes so they don't interfere)
if (process.env.NODE_ENV === 'production') {
  // Path to React build folder
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  
  console.log('📁 Serving static files from:', clientBuildPath);
  
  // Serve static files
  app.use(express.static(clientBuildPath));
  
  // Catch-all route - send React app for any non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

// Start
try {
  console.log("Starting server...");
  // Make sure NODE_ENV is properly set
  console.log('📋 Environment:', process.env.NODE_ENV);
  await connectRedis();
  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
