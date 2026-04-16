import express from 'express';
import {
  createTimer,
  getTimer,
  updatePause,
  updateReset,
  updateStart,
  updateTargetDuraion,
} from '../controllers/TimerController.js';

const router = express.Router();

router.post('/:studyId', createTimer);

router.get('/:studyId', getTimer);

router.patch('/:studyId/target-duration', updateTargetDuraion);

router.patch('/:studyId/start', updateStart);

router.patch('/:studyId/pause', updatePause);

router.patch('/:studyId/reset', updateReset);

export default router;
