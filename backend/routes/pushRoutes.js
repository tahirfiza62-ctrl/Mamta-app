const express = require("express");

const {
  saveSubscription,
  removeSubscription,
} = require("../controllers/pushController");

const router = express.Router();

router.post("/subscribe", saveSubscription);

router.post("/unsubscribe", removeSubscription);

module.exports = router;