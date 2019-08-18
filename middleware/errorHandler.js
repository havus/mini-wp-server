function errorHandler(err, req, res, next) {
  let error = [];
  if (typeof err.msg === 'object') {
    for (let key in err.msg) {
      let obj = {
        code: err.code,
        msg: err.msg[key].message
      }
      error.push(obj);
    }
    res.status(err.code).json(error);
  } else {
    res.status(err.code).json(err);
  }
}

module.exports = errorHandler;