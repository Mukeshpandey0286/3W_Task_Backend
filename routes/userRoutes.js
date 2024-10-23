const express = require('express');
const multer = require('multer');
const { submitUser, getAllSubmissions } = require('../controllers/userController');
const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // temporary storage
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

// Max file size 5MB, max 15 images
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 6 } // 5MB limit
});

// User submission route
router.post('/submit', upload.array('images', 15), submitUser);

// Fetch user submissions
router.get('/submissions', getAllSubmissions);

module.exports = router;
