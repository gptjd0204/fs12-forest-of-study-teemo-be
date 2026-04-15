import express from 'express';
import {
  getStudies,
  createStudy,
  getStudy,
} from '../controllers/studyController.js';

const router = express.Router();

router.get('/', getStudies);
router.get('/:studyId', getStudy);
router.post('/', createStudy);

export default router;
