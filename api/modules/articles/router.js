const express = require('express')
const admin = require('../../../firebase/admin')
const _ = require('lodash')
const articlesRouter = express.Router();
const nodemailer = require('nodemailer')
const archiver = require('archiver')

articlesRouter.post("/send_email", function (req, res) {
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

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            res.status(401).send('{"message":"Error"}');
        } else {
            res.status(200).send('{"message":"Email sent."}');
        }
    });
});

articlesRouter.get("/download/:id", async (req, res) => {
    try {
        const articleId = req.params.id;

        const zip = archiver('zip');
        res.attachment(`${articleId}.zip`);
        zip.pipe(res);

        const articleRef = await admin
            .firestore()
            .collection("articles")
            .doc(articleId)
            .get()
        const article = articleRef.data()

        // _.each(article.pathsForDownload, async (path) => {
        //     const fileDir = `./static/material/${path.name}`;
        //     const options = {
        //         // The path to which the file should be downloaded, e.g. "./file.txt"
        //         destination:fileDir,
        //     };
        //     const t = await admin
        //         .storage()
        //         .bucket('testweb-3595a.appspot.com')
        //         .file(path.path)
        //         .download(options);
        // })

        zip.file( `./static/material/${article.pathsForDownload[0].name}`, {name: article.pathsForDownload[0].name});


        zip.finalize();


        console.log(article)

    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    }
});
module.exports = articlesRouter;
