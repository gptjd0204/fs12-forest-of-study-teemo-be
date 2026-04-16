import express from 'express';
import {
  createHabit,
  toggleHabit,
} from '../controllers/HabitWriteController.js';
import { getTodayHabits } from '../controllers/HabitReadController.js';

const router = express.Router();

router.get('/:studyId/today', getTodayHabits);
router.post('/:studyId', createHabit);
router.patch('/:studyId/:habitId/today', toggleHabit);

export default router;
