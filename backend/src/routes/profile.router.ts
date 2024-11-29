import { Router } from 'express';
import { 
    getUserById
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import { accessLevel } from '../middleware/accesslevel';


const profileRouter = Router();

profileRouter.get('/profile/:id', verifyToken, validateParamId, accessLevel, getUserById);

export default profileRouter;