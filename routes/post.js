const router = require('express').Router();
const post = require('../controllers/post');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const Multer  = require('multer');
const upload =  Multer({ 
  storage: Multer.MemoryStorage, 
  limits: {
  fileSize: 5 * 1024 * 1024
}});

const gcs = require('../middleware/gcs');

router.use(authentication);

router.get('/', post.findAll);

router.post('/', upload.single('image'), gcs, post.create);

router.get('/:id', post.findOne);

router.put('/:id', authorization, upload.single('image'), gcs, post.update);

router.delete('/:id', authorization, post.delete);

module.exports = router;