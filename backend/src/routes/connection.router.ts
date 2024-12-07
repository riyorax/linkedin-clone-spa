import { Router } from 'express';
import { 
    getMutualConnection,
    acceptConnection,
    deleteConnection,
    getConnectionRecommendations,
} from '../controllers/connection.controller';
import { verifyToken } from '../middleware/verifytoken';
import { accessLevel } from '../middleware/accesslevel';
import { validateParamId } from '../middleware/validateinput';

const connectionRouter = Router();

connectionRouter.get('/connection/list/:id', validateParamId, verifyToken, accessLevel, getMutualConnection);
connectionRouter.post('/connection/accept/:id', validateParamId, verifyToken, acceptConnection);
connectionRouter.delete('/connection/unconnect/:id', validateParamId, verifyToken, deleteConnection);
connectionRouter.get('/connection/recommendation', verifyToken, getConnectionRecommendations);

export default connectionRouter;