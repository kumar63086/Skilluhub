const express = require('express');
const router = express.Router();
const { clerkWebhooks } = require('../controllers/webhooks');

router.post('/clerk', clerkWebhooks);

module.exports = router;
