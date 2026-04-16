import express from 'express';
import {
  createHabit,
  toggleHabit,
} from '../controllers/HabitWriteController.js';
import {
  getTodayHabits,
  getWeekHabits,
} from '../controllers/HabitReadController.js';

const router = express.Router();

router.get('/:studyId/today', getTodayHabits);
router.post('/:studyId', createHabit);
router.patch('/:studyId/:habitId/today', toggleHabit);

router.get('/:studyId/weekly', getWeekHabits);

export default router;
