import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Now __dirname works like before
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// API endpoint
app.get('/api/video', (req, res) => {
  res.json({ 
    videoId: 'kgOwsTbIHq4'
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});