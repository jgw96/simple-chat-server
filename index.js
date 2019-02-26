const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
