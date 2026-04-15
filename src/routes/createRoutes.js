import express from 'express';
import { createStudy } from '../controllers/createController.js';

const router = express.Router();

router.post('/', createStudy);

export default router;
