import express from 'express';
import { getStudies, createStudy } from '../controllers/studyController.js';

const router = express.Router();

router.get('/', getStudies);

router.post('/', createStudy);

export default router;
