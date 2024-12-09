import { Router } from "express";
import { verifyToken } from "../middleware/verifytoken";
import {
  saveSubscription,
  sendNewFeedNotif,
} from "../controllers/notif.controller";

const notifRouter = Router();

notifRouter.post("/push_notification/subscribe", verifyToken, saveSubscription);
notifRouter.post("/push_notification/feed", verifyToken, sendNewFeedNotif);

export default notifRouter;
