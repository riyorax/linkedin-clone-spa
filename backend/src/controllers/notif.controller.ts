import { getAllConnections } from "../services/connection.service";
import * as notifService from "../services/notif.service";
import webpush from "web-push";
import { push_subscriptions, Prisma } from "@prisma/client";
import { getUserById } from "../services/user.service";

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

export const sendNewChatNotif = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fromUser = await getUserById(userId);
    
    if (!fromUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    
    const fromUsername = fromUser.username;
    const toId = req.body.toId;
    const message = req.body.message;

    const subscriptions = await notifService.getSubscriptionsByConnectionIds([toId]) as push_subscriptions[];

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({
        error: "Subscription not found for the target user",
      });
    }

    const sub = subscriptions[0];
    const subKeys = sub.keys;
    const endpoint = sub.endpoint;

    const payload = JSON.stringify({
      type: "chat",
      title: `New Chat From ${fromUsername}`,
      body: `${message}`,
      tag: `chat-${userId}`,
      userId: userId,
      data: {
        url: `http://localhost:3001/chat`,
      },
    });

    if (!isValidWebPushKeys(subKeys)) {
      console.error("Invalid subscription keys format:", endpoint);
      return res.status(400).json({
        error: "Invalid subscription keys format",
      });
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: endpoint,
          keys: {
            p256dh: subKeys.p256dh,
            auth: subKeys.auth,
          },
        },
        payload
      );
    } catch (error) {
      if (error.statusCode === 410) { // Expired subscription
        await notifService.deleteSubscription(endpoint); 
        console.error("Subscription expired:", endpoint);
      } else {
        console.error("Error sending notification:", error);
      }
      return res.status(500).json({
        error: "Failed to send notification",
        message: error.message,
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      message: e.message || "Failed to send notification",
    });
  }
};


