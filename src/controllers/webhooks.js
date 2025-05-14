const { Webhook } = require('svix');
const { StatusCodes } = require('http-status-codes');
const User = require('../model/User');
const successResponse = require('../utils/common/success-response');
const errorResponse = require('../utils/common/error-response');
const catchAsync = require('../utils/catchAsync/catchAsync');

// Webhook handler for Clerk events
const clerkWebhooks = catchAsync(async (req, res) => {
  // Verify the incoming webhook signature using raw body
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  await webhook.verify(JSON.stringify(req.body), {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature'],
  });

  const { data, type } = req.body;

  if (!data || !type) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      errorResponse({
        message: 'Invalid webhook payload: missing data or type',
      })
    );
  }

  switch (type) {
    case 'user.created': {
      if (!data.email_addresses?.[0]?.email_address) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          errorResponse({
            message: 'Invalid user data: email address is required',
          })
        );
      }

      const userData = {
        _id: data.id,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
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
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email_addresses?.[0]?.email_address,
        imageUrl: data.image_url,
      };

      // Only update fields that are provided
      const updateData = {};
      if (userData.name) updateData.name = userData.name;
      if (userData.email) updateData.email = userData.email;
      if (userData.imageUrl) updateData.imageUrl = userData.imageUrl;

      await User.findByIdAndUpdate(data.id, updateData, { new: true });

      return res.status(StatusCodes.OK).json(
        successResponse({
          message: 'User updated successfully',
          data: updateData,
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
        errorResponse({
          message: 'Unhandled event type',
        })
      );
  }
});

module.exports = {
  clerkWebhooks,
};