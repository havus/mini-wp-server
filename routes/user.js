const router = require('express').Router();
const user = require('../controllers/user');

router.post('/register', user.register);
router.post('/login/google', user.googleSignIn);

// const authentication = require('../middleware/authentication');
// router.use(authentication);
// router.get('/:id', user.getProfile);

module.exports = router;
