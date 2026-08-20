import express from 'express';
import {
  createTimer,
  getTimer,
  updateComplete,
  updatePause,
  updateReset,
  updateStart,
  updateTargetDuraion,
} from '../controllers/timerController.js';

const router = express.Router();

router.post('/:studyId', createTimer);

router.get('/:studyId', getTimer);

router.patch('/:studyId/target-duration', updateTargetDuraion);

router.patch('/:studyId/start', updateStart);

router.patch('/:studyId/pause', updatePause);

router.patch('/:studyId/reset', updateReset);

router.patch('/:studyId/complete', updateComplete);

export default router;
