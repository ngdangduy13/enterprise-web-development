const express = require("express");
const admin = require("../../../firebase/admin");
const _ = require("lodash");
const articlesRouter = express.Router();
const nodemailer = require("nodemailer");
const archiver = require("archiver");
const path = require("path");

articlesRouter.post("/send_email", function(req, res) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    requiresAuth: true,
    domains: ["gmail.com", "googlemail.com"],
    auth: {
      user: "duyndgch15343@fpt.edu.vn",
      pass: "wonderful222"
    }
  });
  const mail = req.body.mail;
  const subject = req.body.subject;
  const html = req.body.html;

  const mailOptions = {
    from: "G7 - Enterprise Web", // sender address
    to: mail, // list of receivers
    subject: subject, // Subject line
    html: html // plain text body
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      res.status(401).send('{"message":"Error"}');
    } else {
      res.status(200).send('{"message":"Email sent."}');
    }
  });
});

articlesRouter.post("/upload", (req, res, next) => {
  let file = req.files.file;
  const id = req.body.id;
  const filename = req.body.filename;

  let pathFile = `../../../static/material/${id}/${filename}`;
  const fileFolder = path.join(__dirname, pathFile);

  file.mv(fileFolder, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ file: `static/material/${id}/${filename}` });
  });
});

articlesRouter.get("/download/:id", async (req, res) => {
  try {
    const articleId = req.params.id;

    const zip = archiver("zip");
    res.attachment(`${articleId}.zip`);
    zip.pipe(res);

    const articleRef = await admin
      .firestore()
      .collection("articles")
      .doc(articleId)
      .get();
    const article = articleRef.data();

    _.each(article.pathsForDownload, async item => {
      let pathFile = item.path;
      const fileFolder = path.join(__dirname, `../../../${pathFile}`);

      zip.file(fileFolder, {
        name: item.name
      });
    });

    zip.finalize();

    console.log(article);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});
module.exports = articlesRouter;
