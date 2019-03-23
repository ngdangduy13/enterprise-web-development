const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const { bootstrapNextjs } = require('./nextjs/bootstrapNextjs');
const apiRouter = require('./api')

const bootstrap = async () => {
    const port = parseInt(process.env.PORT ? process.env.PORT : '', 10) || 3000;
    const server = express();
    // Middleware
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
    server.use(bodyParser.json());
    server.use(cookieParser());
    await bootstrapNextjs(server);
    server.use('/api', apiRouter);

    await server.listen(port);

    process.on('SIGINT', () => {
        /* tslint:disable-next-line:no-console */
        console.log(`\nShutting down the server...Goodbye.\n`);
        process.exit();
    });
};

bootstrap();