const express = require("express");
const {
  platformAnalytics,
  creatorAnalytics,
  contributorAnalytics,
} = require("../controller/analytics.controller");

const router = express.Router();

router.get("/analytics/platform", platformAnalytics);
router.get("/analytics/creator/:wallet", creatorAnalytics);
router.get("/analytics/contributor/:wallet", contributorAnalytics);

module.exports = router;
