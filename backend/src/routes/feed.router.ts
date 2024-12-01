import { Router } from 'express';
import { addNewFeed, getFeedsPaginated } from '../controllers/feeds.controller';
import { verifyToken } from '../middleware/verifytoken';
import { isFilledContent, validateFeedParam } from '../middleware/validateinput';

const feedRouter = Router();

feedRouter.get('/feed', verifyToken, validateFeedParam, getFeedsPaginated);
feedRouter.post('/feed', verifyToken, isFilledContent, addNewFeed);

export default feedRouter;