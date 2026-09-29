
const express = require("express");
const crypto = require("crypto");

const Order = require("../models/Order");

const router = express.Router();

/* =========================================================
   VERIFY SAFE PAY WEBHOOK
========================================================= */

const verifySafepayWebhook = (
  req,
  res,
  next
) => {
  try {
    const secret =
      process.env.SAFE_PAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error(
        "SAFE_PAY_WEBHOOK_SECRET is missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Webhook secret is not configured.",
      });
    }

    const signature =
      req.headers["x-sfpy-signature"];

    const timestamp =
      req.headers["x-sfpy-timestamp"];

    if (!signature || !timestamp) {
      return res.status(400).json({
        success: false,
        message:
          "Missing Safepay webhook headers.",
      });
    }

    /* -----------------------------------------------------
       TIMESTAMP CHECK
    ----------------------------------------------------- */

    const timestampNumber =
      Number(timestamp);

    if (
      !Number.isFinite(timestampNumber)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid webhook timestamp.",
      });
    }

    const now =
      Math.floor(Date.now() / 1000);

    const difference =
      Math.abs(
        now - timestampNumber
      );

    if (difference > 300) {
      return res.status(400).json({
        success: false,
        message:
          "Webhook timestamp expired.",
      });
    }

    /* -----------------------------------------------------
       RAW BODY
    ----------------------------------------------------- */

    const rawBody =
      req.body instanceof Buffer
        ? req.body.toString("utf8")
        : JSON.stringify(req.body);

    /* -----------------------------------------------------
       SIGNATURE
    ----------------------------------------------------- */

    const signedPayload =
      `${timestamp}.${rawBody}`;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          signedPayload
        )
        .digest("hex");

    const receivedBuffer =
      Buffer.from(
        signature,
        "utf8"
      );

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8"
      );

    if (
      receivedBuffer.length !==
      expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid webhook signature.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "WEBHOOK VERIFICATION ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Webhook verification failed.",
    });
  }
};

/* =========================================================
   WEBHOOK
========================================================= */

router.post(
  "/",

  express.raw({
    type: "application/json",
  }),

  verifySafepayWebhook,

  async (req, res) => {
    try {
      const eventId =
        req.headers[
          "x-sfpy-event-id"
        ];

      const headerEvent =
        req.headers[
          "x-sfpy-event-type"
        ];

      const rawBody =
        req.body instanceof Buffer
          ? req.body.toString("utf8")
          : "{}";

      let payload;

      try {
        payload =
          JSON.parse(rawBody);
      } catch {
        return res.status(400).json({
          success: false,
          message:
            "Invalid webhook JSON.",
        });
      }

      console.log(
        "================================================"
      );

      console.log(
        "SAFEPAy WEBHOOK RECEIVED"
      );

      console.log(
        "EVENT ID:",
        eventId
      );

      console.log(
        "HEADER EVENT:",
        headerEvent
      );

      console.log(
        "PAYLOAD:",
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      console.log(
        "================================================"
      );

      /* -----------------------------------------------------
         EVENT
      ----------------------------------------------------- */

      const event =
        headerEvent ||
        payload.event ||
        payload.type ||
        payload.event_type ||
        "";

      /* -----------------------------------------------------
         TRACKER
      ----------------------------------------------------- */

      const tracker =
        payload.tracker ||
        payload?.data?.tracker ||
        payload?.data?.tracker?.token ||
        payload?.payment?.tracker ||
        payload?.payment?.tracker?.token ||
        null;

      if (!tracker) {
        console.warn(
          "SAFEPAy webhook has no tracker."
        );

        return res.status(200).json({
          success: true,
          received: true,
          message:
            "Webhook received without tracker.",
        });
      }

      /* -----------------------------------------------------
         SUCCESS EVENTS
      ----------------------------------------------------- */

      const successfulEvent =
        event ===
          "payment.succeeded" ||
        event ===
          "payment.completed" ||
        event ===
          "payment.success" ||
        event ===
          "payment_success";

      if (!successfulEvent) {
        return res.status(200).json({
          success: true,
          received: true,
          event,
        });
      }

      /* -----------------------------------------------------
         FIND ORDER
      ----------------------------------------------------- */

      const order =
        await Order.findOne({
          paymentReference:
            String(tracker),
        });

      if (!order) {
        console.warn(
          "ORDER NOT FOUND FOR TRACKER:",
          tracker
        );

        return res.status(200).json({
          success: true,
          received: true,
          message:
            "No matching order found.",
        });
      }

      /* -----------------------------------------------------
         IDEMPOTENCY
      ----------------------------------------------------- */

      if (
        order.paymentStatus ===
        "Paid"
      ) {
        return res.status(200).json({
          success: true,
          received: true,
          alreadyProcessed: true,
        });
      }

      /* -----------------------------------------------------
         DO NOT UPDATE CANCELLED ORDER
      ----------------------------------------------------- */

      if (
        order.orderStatus ===
        "Cancelled"
      ) {
        return res.status(200).json({
          success: true,
          received: true,
          message:
            "Order is already cancelled.",
        });
      }

      /* -----------------------------------------------------
         MARK PAID
      ----------------------------------------------------- */

      order.paymentStatus =
        "Paid";

      order.orderStatus =
        "Confirmed";

      await order.save();

      console.log(
        `Order ${order.orderNumber} marked PAID.`
      );

      return res.status(200).json({
        success: true,
        received: true,
        orderId: order._id,
        orderNumber:
          order.orderNumber,
      });
    } catch (error) {
      console.error(
        "SAFEPAy WEBHOOK ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Webhook processing failed.",
      });
    }
  }
);

module.exports = router;

