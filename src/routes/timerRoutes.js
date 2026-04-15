import express from 'express';
import { upsertTimer } from '../controllers/timerController.js';

const router = express.Router();

router.post('/', upsertTimer);

export default router;
