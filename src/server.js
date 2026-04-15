import express from 'express';
import dotenv from 'dotenv';
import studyRoutes from './routes/studyRoutes.js';
import cors from 'cors';
import pointsRoutes from './routes/pointsRoutes.js';
import HabitRoutes from './routes/HabitRoutes.js';
import emojiRoutes from './routes/emojiRoutes.js';
import createRoutes from './routes/studyRoutes.js';
import timerRoutes from './routes/timerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/points', pointsRoutes);
// study
app.use('/api/studies', studyRoutes);

app.use('/api/habits', HabitRoutes);

//emoji
app.use('/api/emojis', emojiRoutes);

// create
app.use('/api/create', createRoutes);

app.use('/api/timers', timerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
