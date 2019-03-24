const express = require("express");

const usersRouter = express.Router();

usersRouter.post("/login", async (req, res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  res
    .cookie("token", idToken, {
      maxAge: expiresIn
    })
    .status(200)
    .json({ idToken });
});

usersRouter.post("/logout", async (req, res) => {
    res.clearCookie('token');
    return res.status(200).redirect('/login');
});

module.exports = usersRouter;
