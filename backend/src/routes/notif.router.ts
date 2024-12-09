import { Router } from "express";
import { verifyToken } from "../middleware/verifytoken";
import {
  saveSubscription,
  sendNewChatNotif,
  sendNewFeedNotif,
} from "../controllers/notif.controller";

const notifRouter = Router();

/**
 * @openapi
 * /push_notification/subscribe:
 *   post:
 *     summary: Subscribe a user to push notifications
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription:
 *                 type: object
 *                 description: >
 *                   The push notification subscription object containing endpoint, keys, and other data.
 *                 example: 
 *                   endpoint: "https://fcm.googleapis.com/fcm/send/abcdef123456"
 *                   keys: 
 *                     p256dh: "BBase64EncodedPublicKey"
 *                     auth: "Base64EncodedAuthSecret"
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Subscription saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: integer
 *                     subscription:
 *                       type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */

notifRouter.post("/push_notification/subscribe", verifyToken, saveSubscription);

/**
 * @openapi
 * /push_notification/feed:
 *   post:
 *     summary: Send a new feed notification to all user connections
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: false
 *       description: This endpoint does not require a request body as it fetches connections and subscriptions based on the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Notifications sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error while sending notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
notifRouter.post("/push_notification/feed", verifyToken, sendNewFeedNotif);

/**
 * @openapi
 * /push_notification/chat:
 *   post:
 *     summary: Send a chat notification to a specific user
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toId:
 *                 type: integer
 *                 description: The ID of the user who will receive the notification
 *                 example: 12345
 *               message:
 *                 type: string
 *                 description: The chat message to be sent
 *                 example: "Hello, how are you?"
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request, such as malformed subscription keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: User or subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error while sending the notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
notifRouter.post("/push_notification/chat", verifyToken, sendNewChatNotif);

export default notifRouter;
