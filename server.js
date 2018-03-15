const net = require('net');

let chatGroup = [];

process.stdin.setEncoding('utf8');

var server = net.createServer(socket => {
  chatGroup.push(socket);
  socket.msgArray = [];

  socket.on('data', data => {
    let message = false;
    //stake out any new lines from data
    data = data.toString().replace(/\n/g, '');
    if (!socket.Port) {
      socket.Port = data;
      socket.write(
        `You are connected on port: ${socket.Port}\r\nSet Your Username: `
      );
      console.log(`New User using port: ${socket.Port}`);
    } else if (!socket.name) {
      let userExists = false;
      //check if there are any users with that name already
      chatGroup.forEach((e, i) => {
        if (e.name === data) {
          socket.write(`"${data}" is already being used by another user`);
          userExists = true;
        } else if (data.toLowerCase().indexOf('admin') !== -1) {
          socket.write(`Not able to use username with "admin"`);
          userExists = true;
        }
      });
      if (!userExists) {
        socket.name = data;
        console.log(`${socket.name} Signed On Port: ${socket.Port}`);
        message = `****${socket.name} Has Signed On****`;
      }
    } else {
      let time = new Date().getTime();
      socket.msgArray.push(time);
      let msgLength = socket.msgArray.length;
      if (
        msgLength > 10 &&
        socket.msgArray[msgLength - 1] - socket.msgArray[msgLength - 10] < 8888
      ) {
        socket.write('You have been kicked out');
        message = `${socket.name} has been kicked out for Flooding the channel`;
        chatGroup.splice(chatGroup.indexOf(socket), 1);
        socket.destroy();
      } else {
        message = `[${socket.name}] : ${data}`;
      }
    }
    if (message) {
      //check if message is a private message
      let splitMessage = data.split(' ');
      let privateUser = splitMessage.filter(word => word.indexOf('@') === 0);

      if (privateUser.length !== 0) {
        privateUser = privateUser.map(e => e.slice(1));
        let privateMessage = splitMessage.filter(
          word => word.indexOf('@') !== 0
        );
        message = privateMessage.join(' ');
        console.log(`[${socket.name}] : ${data}`);

        chatGroup.forEach((e, i) => {
          if (privateUser.indexOf(e.name) !== -1) {
            e.write(`[${socket.name}] : ${message}`);
          }
        });
      } else {
        console.log(message);
        chatGroup.forEach((e, i) => {
          if (chatGroup[i] !== socket) {
            e.write(message);
          }
        });
      }
    }
  });

  socket.on('error', err => {
    console.log(`Error Occured`);
  });

  socket.on('end', () => {
    socket.write('bye');
    chatGroup.forEach(e => {
      e.write(`${socket.name} disconnected`);
    });
    let indexOfSocket = chatGroup.indexOf(socket);
    if (indexOfSocket !== -1) {
      chatGroup.splice(indexOfSocket, 1);
    }
  });

  process.stdin.on('readable', () => {
    let chunk = process.stdin.read();
    if (chunk !== null) {
      chunk = chunk.replace(/\n/g, '');
      if (chunk.indexOf('\\kick ') === 0) {
        chatGroup.forEach((e, i) => {
          if (e.name === chunk.slice(6)) {
            e.write('You have been kicked out');
            chatGroup.splice(chatGroup.indexOf(e), 1);
            e.destroy();
          }
        });
      } else if (chunk.indexOf('kick ip: ') === 0) {
        chatGroup.forEach((e, i) => {
          if (e.Port === chunk.slice(9)) {
            e.write('You have been kicked out');
            chatGroup.splice(chatGroup.indexOf(e), 1);
            e.destroy();
          }
        });
      } else {
        chatGroup.forEach(e => {
          e.write(`[ADMIN] : ${chunk}`);
        });
      }
    }
  });
});

server.listen(6969, '127.0.0.1', () => {
  console.log('hello there', server.address());
});
