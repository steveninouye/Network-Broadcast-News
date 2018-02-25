const net = require('net');
process.stdin.setEncoding('utf8');

const server = net.createConnection(6969, '127.0.0.1', socket => {
  server.write(server.address().port.toString());

  server.on('data', data => {
    console.log(data.toString());
  });

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      server.write(chunk.toString());
    }
  });
});
