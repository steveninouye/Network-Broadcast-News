const net = require('net');
process.stdin.setEncoding('utf8');

const server = net.createConnection(6969, '127.0.0.1', socket => {

  server.Address = server.address().address;
  server.Port = server.address().port;
  console.log(server.Port);

  server.on('data', data => {
    console.log(data.toString());
  })

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if(chunk !== null) {
      server.write(chunk.toString());
    }
  })
});