// const success = {
//     status:"success",
//     message: 'Successfully completed the request',
//     data: {},
//     error: {}
// }

// module.exports = success;
const success = ({ message, data = null }) => ({
    success: true,
    message,
    data,
  });
  
module.exports = success;