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

    server.get('/student/view-article', authorize('STUDENT'), async (req, res) => {
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

    server.get('/student/detail-article/:articleId', authorize('STUDENT'), async (req, res) => {
        const userRef = await firebase.firestore().collection('articles').doc(res.query.articleId).get();
        const paths = {
            document: [],
            images: []
        }
        for (const path of userRef.data().paths) {
            const downloadUrl = await firebase.storage().ref(path).getDownloadURL()
            if (path.split('.')[1] === 'doc' || path.split('.')[1] === 'docx') {
                paths.document.push(downloadUrl)
            } else {
                paths.images.push(downloadUrl)
            }
        }
        app.render(req, res, '/student/detail-article', {
            selectedArticle: {...userRef.data(), paths},
            ...req.query
        });
    });


    server.get('/login', async (req, res) => {
        app.render(req, res, '/login', req.query);
    });

    server.get('/admin', authorize('ADMIN'), async (req, res) => {
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