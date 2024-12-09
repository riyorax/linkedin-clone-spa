import { Router } from 'express';
import { 
    getSelfProfile,
    getUserById,
    updateUser,
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import { formDataMiddleware } from '../middleware/validateFormData';
import { accessLevel } from '../middleware/accesslevel';


const profileRouter = Router();

profileRouter.get('/self/profile', verifyToken, getSelfProfile);
profileRouter.get('/profile/:id', validateParamId, verifyToken, accessLevel, getUserById);
profileRouter.put('/profile/:id', validateParamId, verifyToken, accessLevel, formDataMiddleware, updateUser);


export default profileRouter;