const express = require("express");
const next = require("next");
const morgan = require("morgan");
const { authorize } = require("./middlewares/authorize");
const admin = require("../firebase/admin");

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

  server.get(
    "/student/view-article",
    authorize("STUDENT"),
    async (req, res) => {
      const querySnapshot = await admin
        .firestore()
        .collection("articles")
        .where("studentId", "==", req.query.profile.uid)
        .get();
      const articles = [];
      querySnapshot.forEach(doc => {
        articles.push({ ...doc.data(), id: doc.id });
      });
      app.render(req, res, "/student/view-article", {
        articles,
        ...req.query
      });
    }
  );

  server.get(
    "/student/detail-article/",
    authorize("STUDENT"),
    async (req, res) => {
      const userRef = await admin
        .firestore()
        .collection("articles")
        .doc(req.query.articleId)
        .get();
      const paths = {
        document: [],
        images: []
      };
      for (const path of userRef.data().paths) {
        const downloadUrl = await admin
          .storage()
          .bucket()
          .file(path)
          .getSignedUrl();
        // if (path.split(".")[1] === "doc" || path.split(".")[1] === "docx") {
        //   paths.document.push(downloadUrl);
        // } else {
        //   paths.images.push(downloadUrl);
        // }
      }
      app.render(req, res, "/student/detail-article", {
        selectedArticle: { ...userRef.data(), paths },
        ...req.query
      });
    }
  );

  server.get("/coord/view-student", authorize("COORD"), async (req, res) => {
    const querySnapshot = await admin
      .firestore()
      .collection("users")
      .where("facultyId", "==", req.query.profile.facultyId)
      .where("role", "==", "STUDENT")
      .get();
    const students = [];
    querySnapshot.forEach(doc => {
      students.push({ ...doc.data(), id: doc.id });
    });
    app.render(req, res, "/coordinator/view-student", {
      students,
      ...req.query
    });
  });

  server.get(
    "/coord/manage-uploaded-article",
    authorize("COORD"),
    async (req, res) => {
      const querySnapshot = await admin
        .firestore()
        .collection("articles")
        .where("facultyId", "==", req.query.profile.facultyId)
        .get();
      const articles = [];
      querySnapshot.forEach(doc => {
        articles.push({ ...doc.data(), id: doc.id });
      });
      app.render(req, res, "/coordinator/manage-uploaded-article", {
        articles,
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
    const querySnapshot = await admin
      .firestore()
      .collection("events")
      .where("facultyId", "==", req.query.profile.facultyId)
      .get();
    const events = [];
    querySnapshot.forEach(doc => {
      events.push({ ...doc.data(), id: doc.id });
    });
    app.render(req, res, "/coordinator/view-event", {
      events,
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
};

const bootstrapNextjs = async server => {
  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev });
  await app.prepare();

  setupNextjsRoutes(server, app);
  setupPublicRoutes(server, app);
};

module.exports = { bootstrapNextjs };
