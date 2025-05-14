// src/Router/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { clerkWebhooks } = require('../controllers/webhooks');

// Route must match exactly this path:
router.post('/webhooks/clerk', clerkWebhooks);

module.exports = router;
