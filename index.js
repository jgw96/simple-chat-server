const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const dbHelper = require('./data/db');

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = 'mongodb://simplechat-app:1iSgG4y0zpdU0XGJrVX9evuAKip7sJ0jhpo5Yf3iDYEt6u5kqgRppb2RHYAPg9iJspZ8ULUsY2b14jBHRnLaLw%3D%3D@simplechat-app.documents.azure.com:10255/?ssl=true';
const dbName = 'simpleChat';
let db = null;

const client = new MongoClient(mongoURL);

try {
  dbHelper.connectToDB(client).then(() => {
    db = client.db(dbName);
  })
  .catch((err) => {
    console.log('error connecting to database', err);
  })
}
catch (err) {
  console.log(err);
}

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

const http = require('http').Server(app);
const io = require('socket.io')(http);

let mainSocket = null;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/channels', (req, res) => {
  console.log(req.body);
  try {
    dbHelper.newChannel(db, req.body.name, req.body.created);
    res.status(200).send({ message: 'New channel added' });
  }
  catch (err) {
    console.log(err);
    res.status(503).send({ err });
  }
});

app.get('/channels', async (req, res) => {
  try {
    const channels = await dbHelper.getChannels(db);

    if (channels) {
      res.status(200).send({ data: channels });
    }
    else {
      res.status(200).send({ message: 'No Channels'});
    }
  }
  catch (err) {
    res.status(503).send({ err: err });
  }
});

app.post('/users', (req, res) => {
  console.log(req.body);

  try {
    dbHelper.newUser(db, req.body);
    res.status(200).send({ message: 'New user added' });
  }
  catch (err) {
    console.log(err);
    res.status(503).send({ err });
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', (data) => {
    console.log('joining room', data);
    socket.join(data.roomName);
  });

  socket.on('leaveRoom', (data) => {
    console.log('leaving room', data);
    socket.leave(data.roomName);
  });

  socket.on('messageToRoom', (data) => {
    console.log(data);
    // mainSocket.join(data.roomName);
    // socket.broadcast.emit('newMessage', data);
    socket.broadcast.to(data.roomName).emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
