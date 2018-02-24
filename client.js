const net = require('net');

const server = net.createConnection(6969, '127.0.0.1', socket => {
  server.write(server.address().address.toString());
  server.write(server.address().port.toString());
});
