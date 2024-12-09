import { Router } from 'express';
import { 
    getConnRequest,
    insertConnRequest,
    deleteConnRequest,
} from '../controllers/connRequest.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import {accessLevel} from '../middleware/accesslevel'

const connRequestRouter = Router();

connRequestRouter.get('/connection/request', verifyToken, getConnRequest);
connRequestRouter.post('/connection/request/:id', validateParamId, verifyToken, accessLevel, insertConnRequest);
connRequestRouter.delete('/connection/reject/:id', validateParamId, verifyToken, deleteConnRequest);

export default connRequestRouter;