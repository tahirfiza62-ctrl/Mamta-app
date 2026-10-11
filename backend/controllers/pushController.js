const PushSubscription = require("../models/PushSubscription");

const saveSubscription = async (req, res) => {
  try {
    const subscription = req.body;

    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid push subscription.",
      });
    }

    const savedSubscription =
      await PushSubscription.findOneAndUpdate(
        {
          endpoint: subscription.endpoint,
        },
        {
          endpoint: subscription.endpoint,
          expirationTime:
            subscription.expirationTime || null,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
          role: "admin",
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Push subscription saved.",
      subscription: savedSubscription,
    });
  } catch (error) {
    console.error(
      "saveSubscription error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save push subscription.",
    });
  }
};

const removeSubscription = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: "Endpoint is required.",
      });
    }

    await PushSubscription.deleteOne({
      endpoint,
    });

    return res.status(200).json({
      success: true,
      message: "Push subscription removed.",
    });
  } catch (error) {
    console.error(
      "removeSubscription error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to remove subscription.",
    });
  }
};

module.exports = {
  saveSubscription,
  removeSubscription,
};