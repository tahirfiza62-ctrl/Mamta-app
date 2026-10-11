const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription");

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (payload) => {
  try {
    const subscriptions =
      await PushSubscription.find({
        role: "admin",
      });

    if (!subscriptions.length) {
      console.log(
        "No admin push subscriptions found."
      );
      return;
    }

    const notificationPayload =
      JSON.stringify(payload);

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,

            expirationTime:
              subscription.expirationTime,

            keys: {
              p256dh:
                subscription.keys.p256dh,

              auth:
                subscription.keys.auth,
            },
          },
          notificationPayload
        );

        console.log(
          "MAMTA push notification sent."
        );

      } catch (error) {
        console.error(
          "MAMTA push notification failed:",
          error.statusCode,
          error.message
        );

        if (
          error.statusCode === 404 ||
          error.statusCode === 410
        ) {
          await PushSubscription.deleteOne({
            _id: subscription._id,
          });

          console.log(
            "Expired push subscription removed."
          );
        }
      }
    }

  } catch (error) {
    console.error(
      "SEND PUSH NOTIFICATION ERROR:",
      error
    );
  }
};

module.exports = sendPushNotification;