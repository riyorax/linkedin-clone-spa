import { Router } from 'express';
import { 
    getConnRequest,
    insertConnRequest
} from '../controllers/connRequest.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import {accessLevel} from '../middleware/accesslevel'

const connRequestRouter = Router();

connRequestRouter.get('/connectionrequest/:id', verifyToken, validateParamId, accessLevel, getConnRequest);
connRequestRouter.post('/connectionrequest/:id', verifyToken, validateParamId, accessLevel, insertConnRequest);

export default connRequestRouter;