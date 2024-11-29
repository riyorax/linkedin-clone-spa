import { Router } from 'express';
import { 
    getMutualConnection
} from '../controllers/connection.controller';
import { validateParamId } from '../middleware/validateinput';

const connectionRouter = Router();

connectionRouter.get('/listconnection/:id', validateParamId, getMutualConnection);

export default connectionRouter;