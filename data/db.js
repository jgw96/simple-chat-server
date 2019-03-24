exports.connectToDB = (client) => {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (!err) {
        console.log("Connected successfully to server");
  
        resolve();
      }
      else {
        console.error(err);
        reject(err);
      }
    });
  })
}

exports.newChannel = (db, name, created, creator, users) => {
  console.log(db, name, created, creator, users);
  db.collection('channels').insertOne({
    name,
    created,
    creator,
    users
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

exports.addToChannel = (db, name, newUsers) => {
  db.collection('channels').findOneAndUpdate({ name }, {$set: { users: newUsers }}, (err, r) => {
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

exports.getChannels = (db, user) => {
  return new Promise((resolve, reject) => {
    const id = user.id;
    db.collection('channels').find({ "creator": id }, {users: {$elemMatch: {id}}}).toArray((err, channels) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      else {
        console.log(channels);
        resolve(channels);
      }
    })
  })
}

exports.newUser = (db, user) => {
  console.log(user);
  db.collection('users').update({ id: { $eq: user.id } }, user, { upsert: true }, (err, r) => {
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
