import express from 'express';
import morgan from 'morgan';
import cors from "cors";
import { createServer } from "node:http";
import { initSocket } from "./socket/index.js";
import { connectRedis } from "./config/redis.js";
import roomRoutes from './routes/roomRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// HTTP Server + WebSockets
const server = createServer(app);
const io = initSocket(server);

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  console.log(err.stack); // change to console.error?
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

// Start
await connectRedis();
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));