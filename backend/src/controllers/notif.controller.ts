import { getAllConnections } from "../services/connection.service";
import * as notifService from "../services/notif.service";
import webpush from "web-push";
import { push_subscriptions, Prisma } from "@prisma/client";

type WebPushKeys = {
  [key in "p256dh" | "auth"]: string;
} & {
  [key: string]: Prisma.JsonValue;
};

export const saveSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const subscription = req.body.subscription;

    const newSubscriber = await notifService.addSubscriber(
      userId,
      subscription,
    );
    return res.status(200).json({
      success: true,
      message: "Notification subscriber saved successfully",
      data: newSubscriber,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      message:
        e.message ||
        "Something went wrong while saving notification subscription",
    });
  }
};

function isValidWebPushKeys(keys: Prisma.JsonValue): keys is WebPushKeys {
  return (
    typeof keys === "object" && 
    keys !== null &&
    !Array.isArray(keys) &&
    "p256dh" in keys &&
    "auth" in keys &&
    typeof keys.p256dh === "string" &&
    typeof keys.auth === "string"
  );
}

export const sendNewFeedNotif = async (req, res) => {
  try {
    const userId = req.user.userId;
    const connections = await getAllConnections(userId);
    const connectionIds = connections.map((conn) => conn.to_id);

    const subscriptions =
      await notifService.getSubscriptionsByConnectionIds(connectionIds);

    const payload = JSON.stringify({
      type: "feed",
      title: "New Feed Post",
      body: `Your connection has posted something new`,
      tag: `feed-${userId}`,
      userId: userId,
      data: {
        url: `http://localhost:3001/feed`,
      },
    });

    const notificationResults = await Promise.allSettled(
      subscriptions.map(async (sub: push_subscriptions) => {
        const sub_keys = sub.keys;
        if (!isValidWebPushKeys(sub_keys)) {
          console.error("Invalid subscription keys format:", sub.endpoint);
          return;
        }
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub_keys.p256dh,
                auth: sub_keys.auth,
              },
            },
            payload,
          );
        } catch (error) {
          if (error.statusCode === 410) { // expired subs
            await notifService.deleteSubscription(sub.endpoint);
          } else {
            throw error;
          }
        }
      }),
    );
    res.status(200).json({
      success: true,
      message: "Notifications sent successfully",
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      message: e.message || "Failed to send notification to connections",
    });
  }
};

export const sendNewChatNotif = async (req, res) => {};

