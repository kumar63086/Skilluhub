const { Webhook } = require('svix');
const { StatusCodes } = require('http-status-codes');
const User = require('../model/User');
const successResponse = require('../utils/common/success-response');
const errorResponse = require('../utils/common/error-response');
const catchAsync = require('../utils/catchAsync/catchAsync');

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const webhook = new Webhook(CLERK_WEBHOOK_SECRET);

// Webhook handler for Clerk events
const clerkWebhooks = catchAsync(async (req, res) => {
  try {
    // Verify the incoming webhook signature using raw body
    const payload = webhook.verify(req.body, {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });

    const { data, type } = payload;

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          imageUrl: data.profile_image_url,
        };

        await User.create(userData);

        return res.status(StatusCodes.CREATED).json(
          successResponse({
            message: 'User created successfully',
            data: userData,
          })
        );
      }

      case 'user.updated': {
        const userData = {
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          imageUrl: data.profile_image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);

        return res.status(StatusCodes.OK).json(
          successResponse({
            message: 'User updated successfully',
            data: userData,
          })
        );
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);

        return res.status(StatusCodes.OK).json(
          successResponse({
            message: 'User deleted successfully',
          })
        );
      }

      default:
        return res.status(StatusCodes.BAD_REQUEST).json(
          successResponse({
            message: 'Unhandled event type',
          })
        );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      errorResponse({
        message: 'Webhook verification failed',
        error: error.message,
      })
    );
  }
});

module.exports = {
  clerkWebhooks,
};
