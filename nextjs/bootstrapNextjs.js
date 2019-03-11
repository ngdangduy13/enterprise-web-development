const express = require('express')
const next = require('next')
const morgan = require('morgan')
const { authorize } = require('./middlewares/authorize')
const admin = require('../firebase/admin');


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

    server.get('/student/view-article', authorize(), async (req, res) => {
        const querySnapshot = await admin.firestore().collection('articles').where("studentId", "==", req.query.profile.uid).get();
        const articles = []
        querySnapshot.forEach(doc => {
            articles.push({ ...doc.data(), id: doc.id })
        })
        app.render(req, res, '/student/view-article', {
            articles,
            ...req.query
        });
    });

    server.get('/login', async (req, res) => {
        app.render(req, res, '/login', req.query);
    });

    server.get('/admin', authorize(), async (req, res) => {
        app.render(req, res, '/admin', req.query);
    });

    server.post('/api/login', async (req, res) => {
        const idToken = req.body.idToken
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        res.cookie(`token`, idToken, {
            maxAge: expiresIn,
        })
            .status(200)
            .json({ idToken });
    });

    server.post('/api/logout', async (req, res) => {
        res.clearCookie('token')
        res.redirect('/login');
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