const express = require('express');
app = express();
port = 7777;
let ejs = require('ejs');
var exec = require('child_process').exec;
const fs = require('fs')
const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

  server.listen(7778, () => {
    console.log('listening on *:7778');
  });

app.set('view engine', 'ejs');

app.get('/',function(req, res) {
    fs.readFile('./bot/.env', 'utf8' , (err, data) => {
        console.log(data)
        res.render('index', { env : data });
      })
});

io.on('connection', (socket) => {
    socket.on('exec', (newEnv) => {
        fs.writeFile('./bot/.env', newEnv, function (err) {
             if (err) socket.emit('terminal', err);
          });
        socket.emit('terminal', 'ENV CONFIG: \n' + newEnv + '\n');
        var terminal = exec('ping -c 4 google.es')
        terminal.stdout.on('data', function(data) {
            socket.emit('terminal', data);
        });
    });

    socket.on('stop', (newEnv) => {
        var terminal = exec('ping -c 4 google.com')
        terminal.stdout.on('data', function(data) {
            socket.emit('terminal', data);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
