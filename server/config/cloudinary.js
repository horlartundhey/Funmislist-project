const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let upload;
// Fallback to local disk if specified or Cloudinary credentials missing
if (process.env.USE_LOCAL_STORAGE === 'true' || !process.env.CLOUDINARY_CLOUD_NAME) {
  // ensure upload directory exists externally
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  });
  upload = multer({ storage: diskStorage });
} else {
  // Cloudinary storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'product-images',
      allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });
  upload = multer({ storage });
}

module.exports = { cloudinary, upload };