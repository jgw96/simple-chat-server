const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const dbHelper = require('./data/db');

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = 'mongodb://localhost:27017';
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
    dbHelper.newChannel(db, req.body.channel);
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
    res.status(503).send({ err });
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  mainSocket = socket;

  mainSocket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
