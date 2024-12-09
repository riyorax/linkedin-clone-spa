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

/**
 * @openapi
 * /self/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags:
 *       - Profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
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
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profile_photo:
 *                       type: string
 *       401:
 *         description: Unauthorized, user is not logged in
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
 *       404:
 *         description: User not found
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
 *                   exampe: null
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
 *                   properties:
 *                     type:
 *                       type: string
 *                     details:
 *                       type: string
 */
profileRouter.get('/self/profile', verifyToken, getSelfProfile);

/**
 * @openapi
 * /profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
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
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     work_history:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     connection_count:
 *                       type: integer
 *                     profile_photo:
 *                       type: string
 *                     access:
 *                       type: string
 *                     relevant_posts:
 *                       type: array
 *                       items:
 *                         type: string
 *                     status_request:
 *                       type: string
 *       404:
 *         description: User not found
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
profileRouter.get('/profile/:id', validateParamId, verifyToken, accessLevel, getUserById);

/**
 * @openapi
 * /profile/{id}:
 *   put:
 *     summary: Update user profile data
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username
 *                 minLength: 4
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 minLength: 4
 *               work_history:
 *                 type: string
 *                 description: Work history of the user
 *               skills:
 *                 type: string
 *                 description: Skills of the user
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *                 description: New profile photo
 *     responses:
 *       200:
 *         description: User data updated successfully
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
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     work_history:
 *                       type: string
 *                     skills:
 *                       type: string
 *                     profile_photo:
 *                       type: string
 *       401:
 *         description: User not authenticated or not authorized
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
profileRouter.put('/profile/:id', validateParamId, verifyToken, accessLevel, formDataMiddleware, updateUser);

export default profileRouter;