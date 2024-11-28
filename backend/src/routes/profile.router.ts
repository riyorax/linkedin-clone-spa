import { Router } from 'express';
import { 
    getUserById
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import { accessProfile } from '../middleware/accessprofile';


const profileRouter = Router();

profileRouter.get('/profile/:id', verifyToken, validateParamId, accessProfile, getUserById);

export default profileRouter;