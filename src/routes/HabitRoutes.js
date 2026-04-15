import express from 'express';
import {
  getTodayHabits,
  createHabit,
  toggleHabit,
} from '../controllers/HabitController.js';

const router = express.Router();

router.get('/:studyId/today', getTodayHabits);
router.post('/:studyId', createHabit);
router.patch('/:studyId/:habitId/today', toggleHabit);

export default router;
