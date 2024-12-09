import { Router } from "express";
import { verifyToken } from "../middleware/verifytoken";
import { validateParamId } from "../middleware/validateinput";
import { getUsersForSidebar, getMessages, sendMessages } from "../controllers/chat.controller";

const chatRouter = Router();

/**
 * @openapi
 * /chat/users:
 *   get:
 *     summary: Fetch a list of users for the chat sidebar
 *     tags:
 *       - Chat
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of mutual connections fetched successfully
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
 *                       description: User access level
 *                     listConnection:
 *                       type: array
 *                       description: Array of mutual connections
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           profile_photo:
 *                             type: string
 *       500:
 *         description: Internal server error while fetching connections
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
chatRouter.get("/chat/users", verifyToken, getUsersForSidebar);

/**
 * @openapi
 * /chat/{id}:
 *   get:
 *     summary: Fetch messages between the authenticated user and a specific user
 *     tags:
 *       - Chat
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to fetch chat messages with
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Messages fetched successfully
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
 *                     messages:
 *                       type: array
 *                       description: List of chat messages
 *                       items:
 *                         type: object
 *                         properties:
 *                           senderId:
 *                             type: integer
 *                             description: ID of the message sender
 *                           receiverId:
 *                             type: integer
 *                             description: ID of the message receiver
 *                           message:
 *                             type: string
 *                             description: Content of the message
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                             description: Time when the message was sent
 *       500:
 *         description: Internal server error while fetching messages
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
chatRouter.get("/chat/:id", validateParamId, verifyToken, getMessages);

/**
 * @openapi
 * /chat/{id}:
 *   post:
 *     summary: Send a message to a specific user
 *     tags:
 *       - Chat
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to send a message to
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The content of the message to be sent
 *                 example: "Hello, how are you?"
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Message sent successfully
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
 *                     message:
 *                       type: object
 *                       properties:
 *                         senderId:
 *                           type: integer
 *                           description: ID of the sender
 *                         receiverId:
 *                           type: integer
 *                           description: ID of the receiver
 *                         content:
 *                           type: string
 *                           description: Content of the message
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           description: Time the message was sent
 *       500:
 *         description: Internal server error while sending the message
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
chatRouter.post("/chat/:id", validateParamId, verifyToken, sendMessages); 

export default chatRouter;