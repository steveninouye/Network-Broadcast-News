const net = require('net');

var server = net.createServer(socket => {
  socket.write('You are connected');
  socket.on('data', data => {
    console.log(data.toString());
  });
  socket.on('end', () => {
    socket.write('BAI');
  });
  socket.on('error', err => {
    console.log('Disconnected');
  });
});

server.listen(6969, '127.0.0.1', () => {
  console.log('hello there', server.address());
});
