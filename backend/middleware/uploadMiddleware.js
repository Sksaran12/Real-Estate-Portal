const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // If cloudinary key is default or missing, return a beautiful Unsplash placeholder image
    if (process.env.CLOUDINARY_CLOUD_NAME === 'demo' || !process.env.CLOUDINARY_API_KEY) {
      const sampleImages = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      ];
      const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      return resolve(randomImg);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'real-estate-portal' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { upload, uploadToCloudinary };
