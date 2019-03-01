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

exports.newChannel = (db, name, created) => {
  db.collection('channels').insertOne({
    name,
    created
  }, (err, r) => {
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

exports.newUser = (db, user) => {
  console.log(user);
  db.collection('users').update(user, user, { upsert: true }, (err, r) => {
    if (!err) {
      console.log('success');
      return true;
    }
    else {
      console.log('err', err);
      return err;
    }
  })
}
