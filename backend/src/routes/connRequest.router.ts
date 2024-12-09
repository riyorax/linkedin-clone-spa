import { Router } from 'express';
import { 
    getConnRequest,
    insertConnRequest,
    deleteConnRequest,
} from '../controllers/connRequest.controller';
import { verifyToken } from '../middleware/verifytoken';
import { validateParamId } from '../middleware/validateinput';
import {accessLevel} from '../middleware/accesslevel'

const connRequestRouter = Router();

/**
 * @openapi
 * /connection/request:
 *   get:
 *     summary: Get connection requests for the authenticated user
 *     tags:
 *       - Connection Request
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Connection request fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Connection request fetched successfully"
 *                 body:
 *                   type: object
 *                   properties:
 *                     listConnRequest:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: The ID of the connection request
 *                           from_user:
 *                             type: string
 *                             description: The username of the user who sent the request
 *                           to_user:
 *                             type: string
 *                             description: The username of the user who received the request
 *                           status:
 *                             type: string
 *                             description: The status of the request (e.g., "pending", "accepted", "rejected")
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the request was created
 *       401:
 *         description: Unauthorized access - User is not authenticated or doesn't have access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You're not allowed to access this resource"
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching connection requests."
 *                 error:
 *                   type: object
 *                   nullable: true
 */
connRequestRouter.get('/connection/request', verifyToken, getConnRequest);

/**
 * @openapi
 * /connection/request/{id}:
 *   post:
 *     summary: Send a connection request to a user
 *     tags:
 *       - Connection Request
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to whom the connection request is sent
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Connection request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Connection request sent successfully"
 *                 body:
 *                   type: object
 *                   properties:
 *                     from_user:
 *                       type: integer
 *                       description: The ID of the user sending the request
 *                     to_user:
 *                       type: integer
 *                       description: The ID of the user receiving the request
 *                     status:
 *                       type: string
 *                       description: The status of the request (e.g., "pending")
 *       401:
 *         description: Unauthorized access - User must be logged in to send a connection request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You must be logged in to send connection requests"
 *                 error:
 *                   type: object
 *                   nullable: true
 *       409:
 *         description: Conflict - User is already connected to the recipient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You are already connected to this user"
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Bad request - Cannot send connection request to this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot send connection request to user"
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while inserting connection request"
 *                 error:
 *                   type: object
 *                   nullable: true
 */
connRequestRouter.post('/connection/request/:id', validateParamId, verifyToken, accessLevel, insertConnRequest);

/**
 * @openapi
 * /connection/reject/{id}:
 *   delete:
 *     summary: Reject a connection request
 *     tags:
 *       - Connection Request
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the connection request to reject
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Connection request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Connection request rejected successfully"
 *                 body:
 *                   type: object
 *                   properties:
 *                     deleted:
 *                       type: boolean
 *                       description: Indicates whether the connection request was successfully deleted
 *       401:
 *         description: Unauthorized access - User must be logged in to reject a connection request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You're not authenticated, log in to continue"
 *                 error:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Bad request - Cannot reject the specified connection request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot reject this connection request"
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while rejecting connection request"
 *                 error:
 *                   type: object
 *                   nullable: true
 */
connRequestRouter.delete('/connection/reject/:id', validateParamId, verifyToken, deleteConnRequest);

export default connRequestRouter;