import express from 'express';
import { getStudies } from '../controllers/studyController.js';

const router = express.Router();

router.get('/', getStudies);

export default router;
