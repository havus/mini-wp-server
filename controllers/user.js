const User = require('../models/user');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { hashPassword, comparePassword} = require('../helper/bcryptjs');
const { jwtHash, jwtVerify } = require('../helper/jwt');


class UserController {
  static getProfile(req, res, next) {
    User.findOne({ _id: req.payload._id })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      next({
        code: 500,
        msg: err.message
      })
    })
  }

  static register(req, res, next) {
    let {full_name, username, email, password} = req.body;
    password = hashPassword(password);
    if (password.length < 7) {
      next({
        code: 401,
        msg: 'password must contain 6 character'
      })
    }
    User.create({ full_name, username, email, password })
    .then(() => {
      res.status(201).json({ message: "Created!" });
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        next({
          code: 400,
          msg: err.errors
        })
      } else {
        next({
          code: 500,
          msg: err
        });
      }
    });
  }

  static login(req, res, next) {
    let {key, password} = req.body;
    let findKey = key.includes('.') && key.includes('@') ? 'email' : 'username';
    User.findOne({ [findKey]: key })
    .then(one => {
      if (one) {
        if (comparePassword(password, one.password)) {
          let obj = { 
            _id: one._id, 
            username: one.username,
            full_name: one.full_name, 
            email: one.email };
          res.status(200).json({ token: jwtHash(obj) });
        } else {
          next({
            code: 401,
            msg: 'wrong username / email!'
          })
        }
      } else {
        next({
          code: 401,
          msg: 'wrong username / email!'
        })
      }
    })
    .catch(err => {
      next({
        code: 500,
        msg: err.message
      })
    });
  }

  static googleSignIn(req, res, next) {
    client.verifyIdToken({
      idToken: req.body.idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      return Promise.all([payload, User.findOne({
        email: payload.email
      })])
    })
    .then(([payload, existUser]) => {
      if (existUser) {
        return existUser;
      } else {
        return User.create({
          full_name: payload.name,
          username: payload.email.split('@')[0],
          email: payload.email,
          password: 'd341o0>][ asdliqhb ocqyvcxicbjh xqhxioayvcquhe yxv OUcy qj$%453@#@%^6',
          profile_pic: payload.picture
        })
      }
    })
    .then((data) => {
      const {_id, username, full_name, email} = data;
      const token = jwtHash({_id, full_name, username, email});
      res.status(200).json({token});
    })
    .catch((err) => {
      console.log(err);
      res.status(401)
    })
  }
}

module.exports = UserController;