const express = require("express");
const next = require("next");
const morgan = require("morgan");
const { authorize } = require("./middlewares/authorize");
const admin = require("../firebase/admin");
var nodemailer = require("nodemailer");
const fs = require("fs");
const https = require("https");
const archiver = require("archiver");
const path = require("path");
var zip = require("express-zip");

const setupNextjsRoutes = (server, app) => {
  const handle = app.getRequestHandler();

  server.get("/_next/*", (req, res) => {
    return handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    return handle(req, res);
  });
};

const setupPublicRoutes = (server, app) => {
  // Middleware
  server.use(morgan("short"));

  // Nextjs Pages
  server.get("/", async (req, res) => {
    app.render(req, res, "/", {
      ...req.query
    });
  });

  server.get("/admin/dashboard", authorize("ADMIN"), async (req, res) => {
    app.render(req, res, "/admin/dashboard", {
      ...req.query
    });
  });

  server.get("/admin/view-user", authorize("ADMIN"), async (req, res) => {
    app.render(req, res, "/admin/view-user", {
      ...req.query
    });
  });

  server.get("/admin/view-article", authorize("ADMIN"), async (req, res) => {
    app.render(req, res, "/admin/view-article", {
      ...req.query
    });
  });

  server.get("/admin/view-faculty", authorize("ADMIN"), async (req, res) => {
    app.render(req, res, "/admin/view-faculty", {
      ...req.query
    });
  });

  server.get(
    "/student/view-article",
    authorize("STUDENT"),
    async (req, res) => {
      app.render(req, res, "/student/view-article", {
        ...req.query
      });
    }
  );

  server.get(
    "/student/detail-article/",
    authorize("STUDENT"),
    async (req, res) => {
      app.render(req, res, "/student/detail-article", {
        ...req.query
      });
    }
  );

  server.get("/coord/view-student", authorize("COORD"), async (req, res) => {
    app.render(req, res, "/coordinator/view-student", {
      ...req.query
    });
  });

  server.get(
    "/coord/manage-uploaded-article",
    authorize("COORD"),
    async (req, res) => {
      app.render(req, res, "/coordinator/manage-uploaded-article", {
        // articles,
        ...req.query
      });
    }
  );

  server.get(
    "/coord/detail-uploaded-article/",
    authorize("COORD"),
    async (req, res) => {
      app.render(req, res, "/coordinator/detail-uploaded-article", req.query);
    }
  );

  server.get("/coord/view-event", authorize("COORD"), async (req, res) => {
    app.render(req, res, "/coordinator/view-event", {
      ...req.query
    });
  });

  server.get("/login", async (req, res) => {
    app.render(req, res, "/login", req.query);
  });

  server.get("/admin", authorize("ADMIN"), async (req, res) => {
    app.render(req, res, "/admin", req.query);
  });

  server.post("/api/login", async (req, res) => {
    const idToken = req.body.idToken;
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    res
      .cookie(`token`, idToken, {
        maxAge: expiresIn
      })
      .status(200)
      .json({ idToken });
  });

  server.post("/api/logout", async (req, res) => {
    res.clearCookie("token");
  });

  server.post("/api/send_email", function(req, res) {
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

  server.post("/api/download/", async (req, res) => {
    try {
      const paths = [];

      for (const data of req.body.data) {
        const file = fs.createWriteStream(`./static/material/${data.name}`);
        const request = await https.get(data.url, function(response) {
          response.pipe(file);
          paths.push({
            path: `./static/material/${data.name}`,
            name: data.name
          });
        });
      }
      const output = fs.createWriteStream(`./static/material/${req.body.id}.zip`);

      var archive = archiver("zip", {
        zlib: { level: 9 } // Sets the compression level.
      });

      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on("close", function() {
        console.log(archive.pointer() + " total bytes");
        console.log(
          "archiver has been finalized and the output file descriptor has closed."
        );
      });

      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      output.on("end", function() {
        console.log("Data has been drained");
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on("warning", function(err) {
        if (err.code === "ENOENT") {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });

      // good practice to catch this error explicitly
      archive.on("error", function(err) {
        throw err;
      });

      // pipe archive data to the file
      archive.pipe(output);
      for (const i of paths) {
        const file = `./static/material/${i.name}`;
        archive.append(fs.createReadStream(file), {
          name: i.name
        });
      }
      // append a file from stream

      archive.finalize();
      res.status(200).send('success');

    } catch (error) {
      console.log(error);
      res.status(401).send(error);
    }
  });
};

const bootstrapNextjs = async server => {
  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev });
  await app.prepare();
  setupNextjsRoutes(server, app);
  setupPublicRoutes(server, app);
};

module.exports = { bootstrapNextjs };
