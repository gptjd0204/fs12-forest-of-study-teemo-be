import express from 'express';
import {
  getStudies,
  createStudy,
  getStudy,
  updateStudy,
  deleteStudy,
  validatePassword,
} from '../controllers/studyController.js';

const router = express.Router();

router.get('/', getStudies);
router.get('/:studyId', getStudy);
router.post('/:studyId/pw', validatePassword);
router.delete('/:studyId', deleteStudy);
router.post('/', createStudy);
router.patch('/:studyId', updateStudy);

export default router;
