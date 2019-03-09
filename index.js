const express = require('express')
const { bootstrapNextjs } = require('./nextjs/bootstrapNextjs');

const bootstrap = async () => {
    const port = parseInt(process.env.PORT ? process.env.PORT : '', 10) || 3000;
    const server = express();

    await bootstrapNextjs(server);

    await server.listen(port);

    process.on('SIGINT', () => {
        /* tslint:disable-next-line:no-console */
        console.log(`\nShutting down the server...Goodbye.\n`);
        process.exit();
    });
};

bootstrap();