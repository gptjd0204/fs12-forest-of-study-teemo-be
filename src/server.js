import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pointsRoutes from './routes/pointsRoutes.js';
import HabitRoutes from './routes/HabitRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/points', pointsRoutes);

app.use('/api/studies/:studyId/habits', HabitRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
