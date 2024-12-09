import { Router } from 'express';
import { 
    getMutualConnection,
    acceptConnection,
    deleteConnection,
    getConnectionRecommendations,
} from '../controllers/connection.controller';
import { verifyToken } from '../middleware/verifytoken';
import { accessLevel } from '../middleware/accesslevel';
import { validateParamId } from '../middleware/validateinput';

const connectionRouter = Router();

/**
 * @openapi
 * /connection/list/{id}:
 *   get:
 *     summary: Get the list of mutual connections for a user
 *     tags:
 *       - Connection
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user whose mutual connections are being fetched
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List connection data fetched successfully
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
 *                     name:
 *                       type: string
 *                     access:
 *                       type: string
 *                     listConnection:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           profile_photo:
 *                             type: string
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
connectionRouter.get('/connection/list/:id', validateParamId, verifyToken, accessLevel, getMutualConnection);

/**
 * @openapi
 * /connection/accept/{id}:
 *   post:
 *     summary: Accept a connection request
 *     tags:
 *       - Connection
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the connection request to accept
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Connection request accepted successfully
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
 *                     newConnection:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         userId:
 *                           type: integer
 *                         connectedUserId:
 *                           type: integer
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Cannot accept this connection request
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
 *       401:
 *         description: User not authenticated
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
connectionRouter.post('/connection/accept/:id', validateParamId, verifyToken, acceptConnection);

/**
 * @openapi
 * /connection/unconnect/{id}:
 *   delete:
 *     summary: Delete an existing connection
 *     tags:
 *       - Connection
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the connection to delete
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Connection deleted successfully
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
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Cannot delete this connection
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
 *       401:
 *         description: User not authenticated
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
connectionRouter.delete('/connection/unconnect/:id', validateParamId, verifyToken, deleteConnection);

/**
 * @openapi
 * /connection/recommendation:
 *   get:
 *     summary: Get connection recommendations
 *     tags:
 *       - Connection
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Connections recommendation fetched successfully
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
 *                     recommendation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           username:
 *                             type: integer
 *                           profile_photo_path:
 *                             type: string
 *                           level:
 *                             type: integer
 *       401:
 *         description: User not authenticated
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
connectionRouter.get('/connection/recommendation', verifyToken, getConnectionRecommendations);

export default connectionRouter;