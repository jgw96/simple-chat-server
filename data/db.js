exports.connectToDB = (client) => {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (!err) {
        console.log("Connected successfully to server");
  
        resolve();
      }
      else {
        reject(err);
      }
    });
  })
}

exports.newChannel = (db, channel) => {
  db.collection('channels').insertOne({ channel }, (err, r) => {
    if (!err) {
      console.log('success');
      return true;
    }
    else {
      console.log('err', err);
      return err;
    }
  });
}

exports.getChannels = (db) => {
  return new Promise((resolve, reject) => {
    db.collection('channels').find({}).toArray((err, channels) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(channels);
      }
    })
  })
}