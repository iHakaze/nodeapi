const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = "public/uploads"

// Middleware to ensure the upload directory exists
const ensureUploadDirectory = (req, res, next) => {
  console.log("Ensuring upload directory exists");

  // Create parent directory if it doesn't exist
  const parentDirectory = uploadDirectory.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }

  // Create the upload directory if it doesn't exist
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }

  next();
};
// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueFilename =  file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg','image/webp', 'image/jpg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  console.log('Checking file type:', file.mimetype);
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});
const handleFileUpload = (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    console.log('Multer error:', err);
    next();
  });
};

module.exports = {
  ensureUploadDirectory,
  handleFileUpload,
};