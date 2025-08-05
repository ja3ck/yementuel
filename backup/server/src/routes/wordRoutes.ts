import { Router } from 'express';
import { checkWord, getWordList, revealAnswer } from '../controllers/wordController';

const router = Router();

// Check word similarity
router.post('/check', checkWord);

// Get word list for today
router.get('/list', getWordList);

// Reveal answer (with captcha validation)
router.post('/reveal-answer', revealAnswer);

export default router;