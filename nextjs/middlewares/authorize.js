const admin = require("../../firebase/admin");

const authorize = requiredPermission => {
  return async (req, res, next) => {
    const loginUrl = `${req.protocol}://${req.get("host")}/login?callbackUrl=${
      req.url
    }`;

    let token = req.cookies.token;
    if (!token) {
      res.redirect(loginUrl);
    } else if (token) {
      let tokenData;
      try {
        tokenData = await admin.auth().verifyIdToken(token);
      } catch (error) {
        console.log(error);
        res.redirect(loginUrl);
      }
      if (
        tokenData &&
        tokenData.exp &&
        tokenData.exp < Math.round(new Date().getTime() / 1000)
      ) {
        res.redirect(loginUrl);
      }
      const userRef = await admin
        .firestore()
        .collection("users")
        .doc(tokenData.uid)
        .get();

      const user = {
        email: userRef.data().email,
        fullname: userRef.data().fullname,
        role: userRef.data().role,
        facultyId: userRef.data().facultyId,
        uid: tokenData.uid
      };
      // Refresh Token
      req.query.profile = {
        ...user,
        token: token
      };
      // // Verify Permissions
      if (requiredPermission && user.role !== requiredPermission) {
        res.status(401).send("Unauthorized");
      } else if (!requiredPermission) {
        next();
        return;
      }
      next();
      return;
    }
  };
};

module.exports = { authorize };
