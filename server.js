const net = require('net');

let chatGroup = [];

process.stdin.setEncoding('utf8');


var server = net.createServer(socket => {
  socket.Address = socket.address().address;
  socket.Port = socket.address().port;
  chatGroup.push(socket);
  socket.write(`You are connected on address: ${socket.Address} port: ${socket.Port}\r\nSet Your Username: `);


  socket.on('data', data => {
    let message = false;
    //stake out any new lines from data
    data = data.toString().replace(/\n/g,"");  

    if (!socket.name) {
      let userExists = false;
      //check if there are any users with that name already
      chatGroup.forEach((e,i) => {        
        if (e.name === data) {
          socket.write(`"${data}" is already being used by another user`)
          userExists = true;
        } else if (data.toLowerCase().indexOf('admin') !== -1){
          socket.write(`Not able to use username with "admin"`);
          userExists = true;
        }
      });
      if(!userExists) {
        socket.name = data;
        message = `****${socket.name} has signed on****`
      }      
    } else {
      message = `${socket.name} : ${data}`;
    }  
    if (message){console.log(message);
    chatGroup.forEach((e,i) => {
      if(chatGroup[i] !== socket) {
        e.write(message);
      }
    });}
  });

  socket.on('error', err => {
    console.log(`Server is currently down`);
  });

  socket.on('end', () => {
    socket.write('bye');
    chatGroup.forEach(e=> {
      e.write(`${socket.name} disconnected`);
    });
    let indexOfSocket = chatGroup.indexOf(socket)
      if(indexOfSocket !== -1) {
        chatGroup.splice(indexOfSocket, 1);
        console.log(chatGroup.length);
      }
  });


  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if(chunk !== null) {
      chatGroup.forEach(e => {
        e.write(`[ADMIN] : ${chunk}`);
      })
    }
  })
});

server.listen(6969, '127.0.0.1', () => {
  console.log('hello there', server.address());
});