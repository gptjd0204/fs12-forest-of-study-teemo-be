import express from "express";
import {
  getStudyLogs
} from '../controllers/LogsController.js'

const router = express.Router();

router.get('/:studyId/logs', getStudyLogs)

export default router;