import express from 'express';
import dotenv from 'dotenv';
import studyRouter from './routes/studyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// study
app.use('/studies', studyRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
