import express from 'express';
import {
  createHabit,
  toggleHabit,
  editHabit,
  deleteHabit,
} from '../controllers/HabitWriteController.js';
import {
  getTodayHabits,
  getWeekHabits,
} from '../controllers/HabitReadController.js';

const router = express.Router();

router.get('/:studyId/today', getTodayHabits);
router.post('/:studyId', createHabit);
router.patch('/:studyId/:habitId/today', toggleHabit);
router.patch('/:studyId/:habitId', editHabit);
router.delete('/:studyId/:habitId', deleteHabit)

router.get('/:studyId/weekly', getWeekHabits);

export default router;
