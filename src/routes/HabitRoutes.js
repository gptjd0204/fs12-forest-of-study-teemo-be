import express from 'express';
import { getTodayHabits, createHabit } from '../controllers/HabitController.js';

const router = express.Router({ mergeParams: true });

router.get('/today', getTodayHabits);
router.post('/', createHabit);

export default router;
