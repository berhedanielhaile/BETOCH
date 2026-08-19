const express = require('express');
const {
  getAllUsers,

  updateMe,
  deleteMe,
  deleteUser,
  updateUser,
  getMe,
  getUser,
} = require('../controllers/user-controller');
const {
  signUp,
  login,
  protect,
  forgetPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout,
} = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:resetToken', resetPassword);

router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);
router.get('/Me', getMe, getUser);

router.use(restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
