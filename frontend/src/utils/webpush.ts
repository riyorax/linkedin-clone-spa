import axios from "axios";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export async function initPushNotif() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported");
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return false;
    } else {
      console.log("Notification permission granted");
    }
    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration =
        await navigator.serviceWorker.register("/service_worker.js");
      console.log("Service Worker registered");
    }

    const subscription = await subscribeToPushNotif(registration);

    await saveSubscription(subscription);

    return true;
  } catch (error) {
    console.error("Error initializing web push:", error);
    return false;
  }
}

async function subscribeToPushNotif(registration: ServiceWorkerRegistration) {
  const converted_vapid_public_key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

  try {
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      return subscription;
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: converted_vapid_public_key,
    });

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push:", error);
    throw error;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function saveSubscription(subscription: PushSubscription) {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/push_notification/subscribe",
      {
        subscription: subscription,
      },
      {
        withCredentials: true,
      },
    );

    if (!res) {
      throw new Error("Failed to save subscription");
    }

    return true;
  } catch (error) {
    console.error("Error saving subscription:", error);
    throw error;
  }
}

