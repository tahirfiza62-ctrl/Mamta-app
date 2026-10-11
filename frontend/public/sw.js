self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data
      ? event.data.json()
      : {};
  } catch (error) {
    console.error(
      "Push data parsing error:",
      error
    );
  }

  const title =
    data.title || "MAMTA";

  const options = {
    body:
      data.body ||
      "You have a new notification.",

    icon:
      data.icon ||
      "/logo 1.jpg",

    badge:
      data.badge ||
      "/logo 1.jpg",

    tag:
      data.tag ||
      "mamta-notification",

    renotify: true,

    requireInteraction:
      data.requireInteraction !== false,

    data: {
      url:
        data.url ||
        "/admin/orders",
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const targetUrl =
      event.notification?.data?.url ||
      "/admin/orders";

    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if (
              "focus" in client &&
              "navigate" in client
            ) {
              return client
                .navigate(targetUrl)
                .then(() => client.focus());
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow(
              targetUrl
            );
          }

          return null;
        })
    );
  }
);