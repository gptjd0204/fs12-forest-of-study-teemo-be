import { Router } from 'express';
import {
  getEmojis,
  createEmoji,
  updateEmoji,
} from '../controllers/emojiController.js';

const router = Router();

router.get('/:studyId', getEmojis);
router.post('/:studyId', createEmoji);
router.patch('/:studyId/:emojiId', updateEmoji);

export default router;
