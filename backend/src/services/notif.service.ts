import { PrismaClient } from "@prisma/client";

const notifClient = new PrismaClient().push_subscriptions;

export const addSubscriber = async (userId, subscription) => {
  try {
    const newSubscriber = await notifClient.upsert({
      where: {
        endpoint: subscription.endpoint,
      },
      update: {
        user_id: userId,
        keys: subscription.keys,
      },
      create: {
        endpoint: subscription.endpoint,
        user_id: userId,
        keys: subscription.keys,
      },
    });
    return newSubscriber;
  } catch (e) {
    throw e;
  }
};

export const getSubscriptionsByConnectionIds = async (
  connectionIds: bigint[],
) => {
  try {
    const subscriptions = await notifClient.findMany({
      where: {
        user_id: {
          in: connectionIds,
        },
      },
    });

    return subscriptions;
  } catch (e) {
    console.error("Error fetching subscriptions:", e);
    throw e;
  }
};

export const deleteSubscription = async (endpoint: string) => {
  try {
    const deletedSubscription = await notifClient.delete({
      where: {
        endpoint: endpoint,
      },
    });
    return deletedSubscription;
  } catch (e) {
    console.error("Error fetching subscriptions:", e);
    throw e;
  }
};

