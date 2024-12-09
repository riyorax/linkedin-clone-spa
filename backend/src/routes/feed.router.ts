import { Router } from 'express';
import { addNewFeed, deleteFeedById, editFeedContent, getFeedsPaginated } from '../controllers/feeds.controller';
import { verifyToken } from '../middleware/verifytoken';
import { isFilledContent, validateFeedParam, validateParamId } from '../middleware/validateinput';

const feedRouter = Router();

feedRouter.get('/feed', verifyToken, validateFeedParam, getFeedsPaginated);
feedRouter.post('/feed', verifyToken, isFilledContent, addNewFeed);
feedRouter.put('/feed/:id', verifyToken, validateParamId, isFilledContent, editFeedContent);
feedRouter.delete('/feed/:id', verifyToken, validateParamId, deleteFeedById);

export default feedRouter;