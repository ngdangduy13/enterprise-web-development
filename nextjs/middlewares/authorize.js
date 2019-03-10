const admin = require('firebase-admin');
const serviceAccount = require('../../firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://testweb-3595a.firebaseio.com/'
});


const authorize = () => {
  return async (req, res, next) => {
    const loginUrl = `${req.protocol}://${req.get('host')}/login?callbackUrl=${req.url}`;

    let token = req.cookies.token;
    console.log(token)
    if (!token) {
      res.redirect(loginUrl);
    }
    else if (token) {
      let tokenData;
      try {
        tokenData = await admin.auth().verifyIdToken(token)
        console.log('tokenData', tokenData)
      }
      catch (error) {
        console.log(error)
        res.redirect(loginUrl);
      }
      if (tokenData && tokenData.exp && tokenData.exp < Math.round(new Date().getTime() / 1000)) {
        res.redirect(loginUrl);
      }
      // Refresh Token
      req.query.profile = {
        ...tokenData,
        token: token,
      };
      // // Verify Permissions
      // if (requiredPermission && tokenData.roles.indexOf(requiredPermission) === -1) {
      //   res.redirect('/error?statusCode=401');
      // }
      // else if (!requiredPermission) {
      //   next();
      //   return;
      // }
      next();
      return;
    }
  }
};

module.exports = { authorize }

