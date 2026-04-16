import express from 'express';
import { getTotalPoint } from '../controllers/PointsController.js';

const router = express.Router();

router.get('/:id', getTotalPoint);

export default router;
