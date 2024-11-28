import { Router } from 'express';
import { 
    getAllUsers, 
    register, 
    login,
    logout
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateRegister, validateLogin } from '../middleware/validateinput';


const userRouter = Router();

userRouter.post('/login', validateLogin, login);
userRouter.post('/register', validateRegister, register);
userRouter.get('/users', verifyToken, getAllUsers);
userRouter.get('/logout', logout)


export default userRouter;