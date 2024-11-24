import { Router } from 'express';
import { 
    getAllUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/user/:id', getUserById);
userRouter.post('/user', createUser);
userRouter.put('/user/:id', updateUser);
userRouter.delete('/user/:id', deleteUser);


export default userRouter;