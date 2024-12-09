self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title;
  const body = data.body;
  const url = data.data.url;
  const tag = data.tag;

  const notificationOptions = {
    body: body,
    tag: `${data.tag}-${Date.now()}`,
    icon: "https://static.vecteezy.com/system/resources/previews/023/986/569/non_2x/linkedin-logo-linkedin-logo-transparent-linkedin-icon-transparent-free-free-png.png",
    data: {
      url: url,
      timestamp: Date.now(),
    },
  };
  console.log("NOTIF");
  event.waitUntil(
    self.registration.showNotification(title, notificationOptions),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});

