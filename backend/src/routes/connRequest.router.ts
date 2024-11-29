import { Router } from 'express';
import { 
    getConnRequest
} from '../controllers/connRequest.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import {accessLevel} from '../middleware/accesslevel'

const connRequestRouter = Router();

connRequestRouter.get('/connectionrequest/:id', verifyToken, validateParamId, accessLevel, getConnRequest);

export default connRequestRouter;