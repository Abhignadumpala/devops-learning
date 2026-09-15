const http = require('http');

// Create HTTP server
http.createServer((req, res) => {
  // Set response header
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  // Send response
  res.end('Hello from Docker!\n');
}).listen(3000, () => {
  console.log('Server running on port 3000');
});

