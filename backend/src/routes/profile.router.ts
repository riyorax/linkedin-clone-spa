import { Router } from 'express';
import { 
    getSelfProfile,
    getUserById
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import { accessLevel } from '../middleware/accesslevel';


const profileRouter = Router();

profileRouter.get('/self/profile', verifyToken, getSelfProfile);
profileRouter.get('/profile/:id', validateParamId, verifyToken, accessLevel, getUserById);


export default profileRouter;