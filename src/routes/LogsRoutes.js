import express from "express";
import {
  getStudyLogs
} from '../controllers/LogsController.js'

const router = express.Router();

router.get('/:studyId/Logs', getStudyLogs)

export default router;