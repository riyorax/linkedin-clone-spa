import { Router } from 'express';
import { getFeedsPaginated } from '../controllers/feeds.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateFeedParam } from '../middleware/validateinput';

const feedRouter = Router();

feedRouter.get('/feed', verifyToken, validateFeedParam, getFeedsPaginated);

export default feedRouter;