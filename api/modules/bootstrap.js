
const usersRouter = require('./users/router')
const articlesRouter = require('./articles/router')

const bootstrapAuth = (router) => {
  router.use('/users', usersRouter);
  router.use('/articles', articlesRouter);
};

module.exports =  bootstrapAuth ;
