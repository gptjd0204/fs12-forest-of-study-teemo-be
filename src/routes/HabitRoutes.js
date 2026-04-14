import express from 'express';
import { getTodayHabits } from '../controllers/HabitController.js';

const router = express.Router({ mergeParams: true });

router.get('/today', getTodayHabits);

export default router;
