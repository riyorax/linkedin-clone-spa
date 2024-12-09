import { Router } from "express";
import { verifyToken } from "../middleware/verifytoken";
import {
  saveSubscription,
  sendNewChatNotif,
  sendNewFeedNotif,
} from "../controllers/notif.controller";

const notifRouter = Router();

notifRouter.post("/push_notification/subscribe", verifyToken, saveSubscription);
notifRouter.post("/push_notification/feed", verifyToken, sendNewFeedNotif);
notifRouter.post("/push_notification/chat", verifyToken, sendNewChatNotif);

export default notifRouter;
