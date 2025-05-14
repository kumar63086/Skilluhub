const app = require('./app');
const http=require('http')
const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
server.on('error', error => {
  console.error(error);
});