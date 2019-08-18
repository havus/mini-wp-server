const Post = require('../models/post');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId; 

class PostController {
  static findAll(req, res, next) {
    Post.find({ user_id: req.payload._id })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      next({
        code: 500,
        msg: err.message
      })
    })
  }

  static create(req, res, next) {
    const {title, content} = req.body;
    let obj = {
      user_id: req.payload._id,
      author: req.payload.full_name,
      title, content
    };
    if (req.file) {
      obj.featured_image = req.file.gcsUrl;
    }
    Post.create(obj)
    .then(data => {
      console.log('created!');
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err.message);
      next({
        code: 500,
        msg: err.message
      })
    })
  }

  static findOne(req, res, next) {
    Post.findOne({
      _id: req.params.id
    })
    .then(one => {
      if (one) {
        res.status(200).json(one);
      } else {
        next({
          code: 404,
          msg: 'not found'
        })
      }
    })
    .catch(err => {
      console.log(err.meassage);
      next({
        code: 500,
        msg: err.message
      })
    })
  }

  static update(req, res, next) {
    const {title, content} = req.body;
    let obj = {
      title, 
      content
    };

    if (req.file) {
      obj.featured_image = req.file.gcsUrl;
    }

    Post.findOneAndUpdate({ _id: req.params.id }, obj, { new: true })
    .then(response => {
      res.status(200).json(response)
    })
    .catch(err => {
      next({
        code: 500,
        msg: err.message
      })
    })
  }

  static delete(req, res, next) {
    console.log(req.params.id);
    Post.findOneAndDelete({ _id: req.params.id })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      next({
        code: 500,
        msg: err.message
      })
    })
  }
}

module.exports = PostController;