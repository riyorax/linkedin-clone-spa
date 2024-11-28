import { Router } from 'express';
import { 
    getUserById
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';


const profileRouter = Router();

profileRouter.get('/profile/:id', verifyToken, getUserById);

export default profileRouter;