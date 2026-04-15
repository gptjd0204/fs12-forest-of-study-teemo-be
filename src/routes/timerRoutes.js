import express from 'express';
import {
  updatePause,
  updateReset,
  updateStart,
  updateTargetDuraion,
  upsertTimer,
} from '../controllers/timerController.js';

const router = express.Router();

router.post('/', upsertTimer);

router.patch('/:studyId/target-duration', updateTargetDuraion);

router.patch('/:studyId/start', updateStart);

router.patch('/:studyId/pause', updatePause);

router.patch('/:studyId/reset', updateReset);

export default router;
