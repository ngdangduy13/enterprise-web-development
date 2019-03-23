const express = require("express");
const next = require("next");
const morgan = require("morgan");
const { authorize } = require("./middlewares/authorize");

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

  server.get("/magazine-post", async (req, res) => {
    app.render(req, res, "/magazine-post", {
      ...req.query
    });
  });

  server.get("/admin/dashboard", authorize("ADMIN"), async (req, res) => {
    app.render(req, res, "/admin/dashboard", {
      ...req.query
    });
  });

  server.get("/admin/view-event", authorize("ADMIN"), async (req, res) => {
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

  
};

const bootstrapNextjs = async server => {
  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev });
  await app.prepare();
  setupNextjsRoutes(server, app);
  setupPublicRoutes(server, app);
};

module.exports = { bootstrapNextjs };
