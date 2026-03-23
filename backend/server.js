const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Backend is running!');
});
server.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});