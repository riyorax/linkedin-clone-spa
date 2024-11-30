import { Router } from 'express';
import { 
    getMutualConnection,
} from '../controllers/connection.controller';
import { validateParamId } from '../middleware/validateinput';

const connectionRouter = Router();

connectionRouter.get('/connection/list/:id', validateParamId, getMutualConnection);

export default connectionRouter;