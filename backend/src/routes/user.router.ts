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

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user with email and password
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 body:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *               oneOf:
 *                 - properties:
 *                     success:
 *                       type: boolean
 *                     message:
 *                       type: string
 *                     error:
 *                       type: string
 *       500:
 *         description: Internal server error, something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 */
userRouter.post('/login', validateLogin, login);

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 body:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       409:
 *         description: Conflict - Username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 */
userRouter.post('/register', validateRegister, register);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Fetch a list of users
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         required: false
 *         description: Keyword to search for users
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Maximum number of users to fetch
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cursor for pagination
 *     responses:
 *       200:
 *         description: User list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 body:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: string
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           name:
 *                             type: string
 *                           profile_photo:
 *                             type: string
 *                     nextCursor:
 *                       type: integer
 *                       nullable: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   nullable: true
 */
userRouter.get('/users', verifyToken, getAllUsers);

/**
 * @openapi
 * /logout:
 *   get:
 *     summary: Log out the current user
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 body:
 *                   type: object
 *                   properties: {}
 */
userRouter.get('/logout', logout);


export default userRouter;