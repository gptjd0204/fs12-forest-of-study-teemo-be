import express from 'express';
import { getTodayHabits, createHabit } from '../controllers/HabitController.js';

const router = express.Router();

router.get('/:studyId/today', getTodayHabits);
router.post('/:studyId', createHabit);
router.post('/:studyId/:habitId/today', toggleHabit);

export default router;
