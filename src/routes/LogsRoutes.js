import express from "express";
import {
  getPointLogs,
  getFocusLogs,
} from '../controllers/LogsController.js'

const router = express.Router();

router.get('/:studyId/pointLogs', getPointLogs)
router.get('/:studyId/focusLogs', getFocusLogs)

export default router;