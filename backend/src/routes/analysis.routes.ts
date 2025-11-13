import { Router } from 'express';
import { 
  analyzeProduct, 
  getAnalysis, 
  getUserAnalyses 
} from '../controllers/analysis.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All analysis routes require authentication
router.use(authenticate);

router.post('/analyze/:productId', analyzeProduct);
router.get('/:analysisId', getAnalysis);
router.get('/user/history', getUserAnalyses);

export default router;
