import { Router } from 'express';
import { 
    getMutualConnection,
    acceptConnection,
    deleteConnection,
} from '../controllers/connection.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';

const connectionRouter = Router();

connectionRouter.get('/connection/list/:id', validateParamId, getMutualConnection);
connectionRouter.post('/connection/accept/:id', validateParamId, verifyToken, acceptConnection);
connectionRouter.delete('/connection/unconnect/:id', validateParamId, verifyToken, deleteConnection);

export default connectionRouter;