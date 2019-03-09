const express = require('express')
const next = require('next')
const morgan = require('morgan')
const { authorize } = require('./middlewares/authorize')

const setupNextjsRoutes = (server, app) => {
    const handle = app.getRequestHandler();

    server.get('/_next/*', (req, res) => {
        return handle(req, res);
    });

    server.get('/static/*', (req, res) => {
        return handle(req, res);
    });
};

const setupPublicRoutes = (server, app) => {
    // Middleware
    server.use(morgan('short'));

    // Nextjs Pages
    server.get('/', async (req, res) => {
        app.render(req, res, '/', {
            ...req.query,
        });
    });

    server.get('/admin/view-article', authorize(), async (req, res) => {
        app.render(req, res, '/article/view-article', req.query);
    });

    server.get('/login', async (req, res) => {
        app.render(req, res, '/login', req.query);
    });

    server.get('/admin', authorize(), async (req, res) => {
        app.render(req, res, '/admin', req.query);
    });
};


const bootstrapNextjs = async (server) => {
    const dev = process.env.NODE_ENV !== 'production';
    const app = next({ dev });
    await app.prepare();

    setupNextjsRoutes(server, app);
    setupPublicRoutes(server, app);
};

module.exports = { bootstrapNextjs }