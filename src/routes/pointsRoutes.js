import express from 'express';
import { getTotalPoint } from '../controllers/pointsController.js';

const router = express.Router();

router.get('/:id', getTotalPoint);

export default router;
