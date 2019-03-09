
const authorize = (requiredPermission = '') => {
  return (req, res, next) => {
    next()
    return;

  };
};

module.exports = { authorize }