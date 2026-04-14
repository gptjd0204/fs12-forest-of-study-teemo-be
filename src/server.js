import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pointsRoutes from './routes/pointsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/points', pointsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
