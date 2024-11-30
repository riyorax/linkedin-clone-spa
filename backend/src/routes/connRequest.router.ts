import { Router } from 'express';
import { 
    getConnRequest,
    insertConnRequest
} from '../controllers/connRequest.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import {accessLevel} from '../middleware/accesslevel'

const connRequestRouter = Router();

connRequestRouter.get('/connection/request', verifyToken, getConnRequest);
connRequestRouter.post('/connection/request/:id', validateParamId, verifyToken, accessLevel, insertConnRequest);

export default connRequestRouter;