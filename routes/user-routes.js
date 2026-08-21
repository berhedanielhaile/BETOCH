const express = require('express');
const multer = require('multer');
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

// Multer configuration for photo uploads
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else if (file.mimetype === 'application/octet-stream') {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.post('/signup', upload.single('photo'), signUp);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:resetToken', resetPassword);

router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', upload.single('photo'), updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe);
router.get('/Me', getMe);

router.use(restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
