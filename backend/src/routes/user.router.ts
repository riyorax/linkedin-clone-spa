import { Router } from 'express';
import { 
    getAllUsers, 
    register, 
    login,
    logout,
    getUserById
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/verifytoken';


const apiRouter = Router();

apiRouter.post('/login', login);
apiRouter.post('/register', register);
apiRouter.get('/users', verifyToken, getAllUsers);
apiRouter.get('/profile/:id', getUserById);
apiRouter.get('/logout', logout)


export default apiRouter;