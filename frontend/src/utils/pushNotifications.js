import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const getAdminToken = () => {
  return localStorage.getItem(
    "mamta_admin_token"
  );
};

const urlBase64ToUint8Array = (base64String) => {
  const padding =
    "=".repeat(
      (4 - (base64String.length % 4)) % 4
    );

  const base64 =
    (
      base64String +
      padding
    )
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(
      (char) => char.charCodeAt(0)
    )
  );
};

export const registerPushNotifications =
  async () => {
    try {
      if (
        !("serviceWorker" in navigator)
      ) {
        console.log(
          "Service workers are not supported."
        );

        return null;
      }

      if (
        !("PushManager" in window)
      ) {
        console.log(
          "Push notifications are not supported."
        );

        return null;
      }

      const token =
        getAdminToken();

      if (!token) {
        console.log(
          "Admin token not found."
        );

        return null;
      }

      const registration =
        await navigator.serviceWorker.register(
          "/sw.js"
        );

      console.log(
        "Service worker registered."
      );

      let permission =
        Notification.permission;

      if (
        permission === "default"
      ) {
        permission =
          await Notification.requestPermission();
      }

      if (
        permission !== "granted"
      ) {
        console.log(
          "Notification permission denied."
        );

        return null;
      }

      const publicKey =
        import.meta.env
          .VITE_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        console.error(
          "VITE_VAPID_PUBLIC_KEY is missing."
        );

        return null;
      }

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe(
            {
              userVisibleOnly: true,

              applicationServerKey:
                urlBase64ToUint8Array(
                  publicKey
                ),
            }
          );
      }

      await axios.post(
        `${API_URL}/push/subscribe`,
        subscription.toJSON(),
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Admin push subscription saved."
      );

      return subscription;
    } catch (error) {
      console.error(
        "Push registration failed:",
        error
      );

      return null;
    }
  };

export const unregisterPushNotifications =
  async () => {
    try {
      const registration =
        await navigator.serviceWorker.getRegistration(
          "/sw.js"
        );

      if (!registration) {
        return;
      }

      const subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        return;
      }

      const token =
        getAdminToken();

      if (token) {
        await axios.post(
          `${API_URL}/push/unsubscribe`,
          {
            endpoint:
              subscription.endpoint,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      }

      await subscription.unsubscribe();

      console.log(
        "Admin push subscription removed."
      );
    } catch (error) {
      console.error(
        "Push unsubscribe failed:",
        error
      );
    }
  };