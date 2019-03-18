const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testweb-3595a.firebaseio.com/",
  storageBucket: "testweb-3595a.appspot.com"
});

module.exports = admin;
