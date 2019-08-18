const {jwtVerify} = require('../helper/jwt');
const Post = require('../models/post')

module.exports = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then(one => {
    if (String(one.user_id) === String(req.payload._id)) {
      next();
    } else {
      next({
        code: 401,
        msg: "unauthorize"
      })
    }
  })
  .catch(err => {
    next({
      code: 500,
      msg: err.message
    })
  })
}